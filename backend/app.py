from flask import Flask, request, jsonify
from flask_cors import CORS
from methods import (
    get_db_connection,
    authenticate_user, register_user, verify_user, resend_verification, reset_password_request, send_verification_otp, verify_otp,
    reset_password_complete, get_user_profile, update_user_profile,
    get_appointments, create_appointment, get_appointment_details, update_appointment,
    cancel_appointment, get_available_slots,
    get_services, get_service_details, get_service_categories,
    get_payments, create_payment, get_payment_details, handle_payment_webhook,
    get_invoices, get_invoice_details, pay_invoice,
    get_notifications, mark_notification_read, update_notification_preferences,
    get_calendar_events, create_calendar_event, update_calendar_event,
    delete_calendar_event, sync_external_calendar,
    get_knowledge_base, get_knowledge_article, 
    google_auth, complete_google_registration,
    submit_tax_form, save_tax_form_progress, load_tax_form_progress, get_tax_form_templates

)
import uuid

from firebase_setup  import verify_firebase_token
from microsoft_teams import MicrosoftTeamsIntegration
from config import app_config
import utils
import logging 
import datetime
import json
from utils import validate_token
import os 
import requests
from utils import send_email, generate_token, validate_token, get_user_id_from_token

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("api.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(app_config)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
TAX_FORM_UPLOADS = os.path.join(UPLOAD_FOLDER, 'tax_forms')
os.makedirs(TAX_FORM_UPLOADS, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['TAX_FORM_UPLOADS'] = TAX_FORM_UPLOADS
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Initialize Microsoft Teams integration
teams_integration = MicrosoftTeamsIntegration()

# New CAPTCHA validation endpoint
@app.route('/api/validate-captcha', methods=['POST'])
def validate_captcha():
    try:
        data = request.get_json()
        
        if not data or not data.get('token'):
            return jsonify({"error": "Missing CAPTCHA token"}), 400
        
        # Get the Google reCAPTCHA secret key
        secret_key = app_config.RECAPTCHA_SECRET_KEY

        if not secret_key:
            logger.error("Google reCAPTCHA secret key not configured")
            return jsonify({"error": "Server configuration error"}), 500
        
        # Prepare request data for Google
        form_data = {
            'secret': secret_key,
            'response': data.get('token')
        }
        
        # Get client IP if available
        if request.headers.get('X-Forwarded-For'):
            form_data['remoteip'] = request.headers.get('X-Forwarded-For')
        
        logger.info(f"CAPTCHA validation request: {form_data}")
        
        # Validate with Google
        response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data=form_data,
            timeout=10
        )
        
        captcha_response = response.json()
        logger.info(f"CAPTCHA validation response: {captcha_response}")
        
        if captcha_response.get('success') == True:
            return jsonify({"success": True}), 200
        else:
            return jsonify({
                "success": False,
                "error": "CAPTCHA validation failed",
                "error_codes": captcha_response.get('error-codes', [])
            }), 400
            
    except Exception as e:
        logger.error(f"CAPTCHA validation error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Authentication & User Management Endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    # Validate CAPTCHA if token is provided
    captcha_token = data.pop('captchaToken', None)
    if captcha_token and app_config.REQUIRE_CAPTCHA:
        # Get the Google reCAPTCHA secret key
        secret_key = app_config.RECAPTCHA_SECRET_KEY

        if not secret_key:
            logger.error("Google reCAPTCHA secret key not configured")
            return jsonify({"error": "Server configuration error"}), 500
            
        # Prepare request data for Google
        captcha_data = {
            'secret': secret_key,
            'response': captcha_token
        }
        
        # Get client IP if available
        if request.headers.get('X-Forwarded-For'):
            captcha_data['remoteip'] = request.headers.get('X-Forwarded-For')
        
        logger.info(f"Login CAPTCHA validation request: {captcha_data}")
        
        # Validate with Google
        captcha_response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data=captcha_data,
            timeout=10
        )
        
        captcha_result = captcha_response.json()
        logger.info(f"CAPTCHA validation response for login: {captcha_result}")
        
        if not captcha_result.get('success'):
            # return jsonify({
            #     "error": "CAPTCHA validation failed. Please try again."
            # }), 400
            error_codes = captcha_result.get('error-codes', [])
            error_message = "CAPTCHA validation failed. Please try again."
            
            # Provide more specific error messages based on error codes
            if 'timeout-or-duplicate' in error_codes:
                error_message = "CAPTCHA token has expired. Please refresh the page and try again."
            elif 'invalid-input-response' in error_codes:
                error_message = "Invalid CAPTCHA response. Please try again."
            elif 'missing-input-response' in error_codes:
                error_message = "CAPTCHA response is missing. Please complete the CAPTCHA."
            
            logger.error(f"CAPTCHA validation failed: {error_codes}")
            return jsonify({"error": error_message}), 400

    return authenticate_user(data)

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    # data = request.get_json()
    logger.info("User logout attempt")
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    # Validate CAPTCHA if token is provided
    captcha_token = data.pop('captchaToken', None)
    if captcha_token and app_config.REQUIRE_CAPTCHA:
        # Get the Google reCAPTCHA secret key
        secret_key = app_config.RECAPTCHA_SECRET_KEY

        if not secret_key:
            logger.error("Google reCAPTCHA secret key not configured")
            return jsonify({"error": "Server configuration error"}), 500
            
        # Prepare request data for Google
        captcha_data = {
            'secret': secret_key,
            'response': captcha_token
        }
        
        # Get client IP if available
        if request.headers.get('X-Forwarded-For'):
            captcha_data['remoteip'] = request.headers.get('X-Forwarded-For')
        
        logger.info(f"Registration CAPTCHA validation request: {captcha_data}")
        
        # Validate with Google
        captcha_response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data=captcha_data,
            timeout=10
        )
        
        captcha_result = captcha_response.json()
        logger.info(f"CAPTCHA validation response for registration: {captcha_result}")
        
        if not captcha_result.get('success'):
            # return jsonify({
            #     "error": "CAPTCHA validation failed. Please try again."
            # }), 400
            error_codes = captcha_result.get('error-codes', [])
            error_message = "CAPTCHA validation failed. Please try again."
            
            # Provide more specific error messages based on error codes
            if 'timeout-or-duplicate' in error_codes:
                error_message = "CAPTCHA token has expired. Please refresh the page and try again."
            elif 'invalid-input-response' in error_codes:
                error_message = "Invalid CAPTCHA response. Please try again."
            elif 'missing-input-response' in error_codes:
                error_message = "CAPTCHA response is missing. Please complete the CAPTCHA."
            
            logger.error(f"CAPTCHA validation failed: {error_codes}")
            return jsonify({"error": error_message}), 400
    
    return register_user(data)

@app.route('/api/auth/refresh-token', methods=['POST'])
def refresh_token():
    try:
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({"error": "Missing or invalid token"}), 401
        
        token = token.replace('Bearer ', '')
        user_id = validate_token(token)
        
        if not user_id:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        # Get user info for the new token
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection error"}), 500
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, email, role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Generate a new token
        new_token = generate_token(user['id'], user['email'], user.get('role'))
        
        return jsonify({
            "message": "Token refreshed successfully",
            "token": new_token
        }), 200
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/auth/google', methods=['POST'])
def google_auth_route():
    try:
        data = request.get_json()
        logger.info(f"Google auth request received: {data}")
        
        if not data or not data.get('firebase_token'):
            return jsonify({"error": "Missing required fields"}), 400
        
        return google_auth(data)
    except Exception as e:
        logger.error(f"Google auth error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/google/complete-registration', methods=['POST'])
def complete_google_reg_route():
    try:
        data = request.get_json()
        logger.info(f"Google complete registration request received")
        
        if not data or not data.get('firebase_uid') or not data.get('firebase_token'):
            return jsonify({"error": "Missing required fields"}), 400
        
         # Validate CAPTCHA if token is provided
        captcha_token = data.pop('captchaToken', None)
        if captcha_token and app_config.REQUIRE_CAPTCHA:
                        # Get the Google reCAPTCHA secret key
            secret_key = app_config.RECAPTCHA_SECRET_KEY
            
            if not secret_key:
                logger.error("Google reCAPTCHA secret key not configured")
                return jsonify({"error": "Server configuration error"}), 500
                
            # Prepare request data for Google
            captcha_data = {
                'secret': secret_key,
                'response': captcha_token
            }
            
            # Get client IP if available
            if request.headers.get('X-Forwarded-For'):
                captcha_data['remoteip'] = request.headers.get('X-Forwarded-For')
            
            logger.info(f"CAPTCHA validation request for Google registration: {captcha_data}")
            
            # Validate with Google
            captcha_response = requests.post(
                'https://www.google.com/recaptcha/api/siteverify',
                data=captcha_data,
                timeout=10
            )
            
            captcha_result = captcha_response.json()
            logger.info(f"CAPTCHA validation response for Google registration: {captcha_result}")
            
            if not captcha_result.get('success'):
                return jsonify({
                    "error": "CAPTCHA validation failed. Please try again."
                }), 400
        
        return complete_google_registration(data)
    except Exception as e:
        logger.error(f"Google complete registration error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/google/verify', methods=['POST'])
def verify_google_token_route():
    try:
        data = request.get_json()
        if not data or not data.get('token'):
            return jsonify({"error": "Missing token"}), 400
        
        # Verify Firebase token
        decoded_token = verify_firebase_token(data.get('token'))
        if not decoded_token:
            return jsonify({"error": "Invalid token"}), 401
        
        return jsonify({
            "valid": True,
            "user": {
                "uid": decoded_token.get('uid'),
                "email": decoded_token.get('email'),
                "name": decoded_token.get('name', ''),
                "email_verified": decoded_token.get('email_verified', False)
            }
        }), 200
    except Exception as e:
        logger.error(f"Google token verification error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/auth/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    return send_verification_otp(data)

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp_route():
    data = request.get_json()
    return verify_otp(data)

@app.route('/api/auth/verify', methods=['GET'])
def verify():
    token = request.args.get('token')
    return verify_user(token)

@app.route('/api/auth/resend-verification', methods=['POST'])
def resend_verification_email():
    data = request.get_json()
    return resend_verification(data)

@app.route('/api/auth/reset-password-request', methods=['POST'])
def reset_request():
    data = request.get_json()
    return reset_password_request(data)

@app.route('/api/auth/reset-password-complete', methods=['POST'])
def reset_complete():
    data = request.get_json()
    return reset_password_complete(data)

@app.route('/api/user/me', methods=['GET'])
def user_profile():
    token = request.headers.get('Authorization')
    return get_user_profile(token)

@app.route('/api/user/me', methods=['PUT'])
def update_profile():
    token = request.headers.get('Authorization')
    data = request.get_json()
    return update_user_profile(token, data)

# Admin Management Endpoints
# @app.route('/api/admin', methods=['GET'])
# def admin_list():
#     token = request.headers.get('Authorization')
#     return get_admins(token)

# @app.route('/api/admin', methods=['POST'])
# def admin_create():
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return create_admin(token, data)

# @app.route('/api/admin/<int:id>', methods=['GET'])
# def admin_details(id):
#     token = request.headers.get('Authorization')
#     return get_admin_details(token, id)

# @app.route('/api/admin/<int:id>', methods=['PUT'])
# def admin_update(id):
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return update_admin(token, id, data)

# @app.route('/api/admin/<int:id>', methods=['DELETE'])
# def admin_delete(id):
#     token = request.headers.get('Authorization')
#     return delete_admin(token, id)

# Appointment Booking Endpoints
@app.route('/api/appointments', methods=['GET'])
def appointment_list():
    token = request.headers.get('Authorization')
    return get_appointments(token)

@app.route('/api/appointments', methods=['POST'])
def appointment_create():
    token = request.headers.get('Authorization')
    data = request.get_json()
    return create_appointment(token, data)

@app.route('/api/appointments/<int:id>', methods=['GET'])
def appointment_details(id):
    token = request.headers.get('Authorization')
    return get_appointment_details(token, id)

@app.route('/api/appointments/<int:id>', methods=['PUT'])
def appointment_update(id):
    token = request.headers.get('Authorization')
    data = request.get_json()
    return update_appointment(token, id, data)

@app.route('/api/appointments/<int:id>', methods=['DELETE'])
def appointment_cancel(id):
    token = request.headers.get('Authorization')
    return cancel_appointment(token, id)

@app.route('/api/appointments/available', methods=['GET'])
def available_slots():
    date = request.args.get('date')
    service_id = request.args.get('service_id')
    return get_available_slots(date, service_id)

# @app.route('/api/appointments/<int:id>/confirm', methods=['POST'])
# def confirm_booking(id):
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return confirm_appointment(token, id, data)

# Services & Pricing Endpoints
@app.route('/api/services', methods=['GET'])
def service_list():
    return get_services()

@app.route('/api/services/<int:id>', methods=['GET'])
def service_details(id):
    return get_service_details(id)

# @app.route('/api/services', methods=['POST'])
# def service_create():
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return create_service(token, data)

# @app.route('/api/services/<int:id>', methods=['PUT'])
# def service_update(id):
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return update_service(token, id, data)

# @app.route('/api/services/<int:id>', methods=['DELETE'])
# def service_delete(id):
#     token = request.headers.get('Authorization')
#     return delete_service(token, id)

@app.route('/api/services/categories', methods=['GET'])
def service_categories():
    return get_service_categories()

# Payment Processing Endpoints
@app.route('/api/payments', methods=['GET'])
def payment_list():
    token = request.headers.get('Authorization')
    return get_payments(token)

@app.route('/api/payments', methods=['POST'])
def payment_create():
    token = request.headers.get('Authorization')
    data = request.get_json()
    return create_payment(token, data)

@app.route('/api/payments/<int:id>', methods=['GET'])
def payment_details(id):
    token = request.headers.get('Authorization')
    return get_payment_details(token, id)

@app.route('/api/payments/webhook', methods=['POST'])
def payment_webhook():
    data = request.get_json()
    return handle_payment_webhook(data)

@app.route('/api/invoices', methods=['GET'])
def invoice_list():
    token = request.headers.get('Authorization')
    return get_invoices(token)

@app.route('/api/invoices/<int:id>', methods=['GET'])
def invoice_details(id):
    token = request.headers.get('Authorization')
    return get_invoice_details(token, id)

@app.route('/api/invoices/<int:id>/pay', methods=['POST'])
def invoice_pay(id):
    token = request.headers.get('Authorization')
    data = request.get_json()
    return pay_invoice(token, id, data)

# Notifications Endpoints
@app.route('/api/notifications', methods=['GET'])
def notification_list():
    token = request.headers.get('Authorization')
    return get_notifications(token)

@app.route('/api/notifications/<int:id>/read', methods=['PUT'])
def notification_read(id):
    token = request.headers.get('Authorization')
    return mark_notification_read(token, id)

@app.route('/api/notifications/settings', methods=['POST'])
def notification_settings():
    token = request.headers.get('Authorization')
    data = request.get_json()
    return update_notification_preferences(token, data)

# Calendar Integration Endpoints
@app.route('/api/calendar/teams/meetings', methods=['POST'])
def create_teams_meeting():
    token = request.headers.get('Authorization')
    data = request.get_json()
    
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    subject = data.get('subject')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    attendees = data.get('attendees', [])
    content = data.get('content')
    
    if not subject or not start_time or not end_time:
        return jsonify({"error": "Subject, start time, and end time are required"}), 400
    
    # Get user email
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT email FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Add user's email to attendees if not already included
    if user['email'] not in attendees:
        attendees.append(user['email'])
    
    # Create Teams meeting
    meeting = teams_integration.create_meeting(
        subject=subject,
        start_time=start_time,
        end_time=end_time,
        attendees=attendees,
        content=content
    )
    
    if not meeting:
        return jsonify({"error": "Failed to create Teams meeting"}), 500
    
    return jsonify({"meeting": meeting}), 201

@app.route('/api/calendar/events/teams', methods=['GET'])
def calendar_events_with_teams():
    token = request.headers.get('Authorization')
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Get appointments with Teams meeting links
    cursor.execute(
        """
        SELECT a.*, s.name as service_name, s.duration 
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        WHERE a.user_id = %s AND a.notes LIKE '%Microsoft Teams Meeting%'
        ORDER BY a.appointment_date, a.appointment_time
        """,
        (user_id,)
    )
    
    appointments = cursor.fetchall()
    cursor.close()
    conn.close()
    
    # Extract Teams meeting links from notes
    events = []
    for appointment in appointments:
        notes = appointment.get('notes', '')
        teams_url = None
        
        # Extract Teams URL from notes
        if 'Microsoft Teams Meeting:' in notes:
            teams_url = notes.split('Microsoft Teams Meeting:')[1].strip().split('\n')[0].strip()
        
        events.append({
            'id': appointment['id'],
            'title': f"{appointment['service_name']} Appointment",
            'date': appointment['appointment_date'].strftime('%Y-%m-%d'),
            'start_time': appointment['appointment_time'].strftime('%H:%M'),
            'end_time': (datetime.datetime.combine(
                appointment['appointment_date'],
                datetime.datetime.strptime(appointment['appointment_time'].strftime('%H:%M'), '%H:%M').time()
            ) + datetime.timedelta(minutes=appointment['duration'])).strftime('%H:%M'),
            'teams_url': teams_url
        })
    
    return jsonify({"events": events}), 200


@app.route('/api/calendar/events', methods=['GET'])
def calendar_events_list():
    token = request.headers.get('Authorization')
    return get_calendar_events(token)

@app.route('/api/calendar/events', methods=['POST'])
def calendar_event_create():
    token = request.headers.get('Authorization')
    data = request.get_json()
    return create_calendar_event(token, data)

@app.route('/api/calendar/events/<int:id>', methods=['PUT'])
def calendar_event_update(id):
    token = request.headers.get('Authorization')
    data = request.get_json()
    return update_calendar_event(token, id, data)

@app.route('/api/calendar/events/<int:id>', methods=['DELETE'])
def calendar_event_delete(id):
    token = request.headers.get('Authorization')
    return delete_calendar_event(token, id)

@app.route('/api/calendar/sync', methods=['GET'])
def calendar_sync():
    token = request.headers.get('Authorization')
    return sync_external_calendar(token)

# Content Management Endpoints
@app.route('/api/content/knowledge-base', methods=['GET'])
def knowledge_base_list():
    return get_knowledge_base()

@app.route('/api/content/knowledge-base/<int:id>', methods=['GET'])
def knowledge_article_details(id):
    return get_knowledge_article(id)

# Tax Solutions Form Endpoints
@app.route('/api/tax-solutions/templates', methods=['GET'])
def get_templates():
    try:
        # Get available tax form templates
        return get_tax_form_templates()
    except Exception as e:
        logger.error(f"Get tax templates error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/tax-solutions/submit', methods=['POST'])
def tax_form_submit():
    try:
        # Get token from authorization header (if available)
        token = request.headers.get('Authorization')
        logger.info(f"Tax form submission received with files: {request.files}")

        # Use request.form.to_dict() to get all form data as a dictionary
        data = request.form.to_dict()

        # Parse engagement letters if present
        if "itrEngagementLetter" in data:
            try:
                data["itrEngagementLetter"] = json.loads(data["itrEngagementLetter"]) if data["itrEngagementLetter"] else {}
            except Exception:
                data["itrEngagementLetter"] = {}
        if "engagementLetter" in data:
            try:
                data["engagementLetter"] = json.loads(data["engagementLetter"]) if data["engagementLetter"] else {}
            except Exception:
                data["engagementLetter"] = {}
        if not data.get("itrEngagementLetter"):
            data["itrEngagementLetter"] = {}
        # Now save `data` as-is, including empty fields
        # (You may want to pass `data` to your DB or further processing here)
        # For now, just log it for debugging
        logger.info(f"Parsed form data: {data}")

        # Log all files received
        for file_key in request.files:
            file = request.files[file_key]
            logger.info(f"File received: {file_key}, filename: {file.filename}")
            # Get form type for this file
            file_form_type = data.get(f"{file_key}_formType", data.get('formType', 'individual'))
            logger.info(f"File form type: {file_form_type}")

        if 'formType' not in data:
            return jsonify({"error": "Missing form type"}), 400

        logger.info(f"Received form type: {data.get('formType')}")

        # Payment logic (optional, as in original)
        selected_plan = data.get('selectedPlan')
        selected_addons = data.get('selectedAddOns', [])
        total_amount = data.get('totalAmount')

        if selected_plan:
            logger.info(f"Processing payment - Plan: {selected_plan}, Add-ons: {selected_addons}, Total: {total_amount}")
            data['paymentStatus'] = 'pending'
            data['paymentDetails'] = {
                'plan': selected_plan,
                'addons': selected_addons,
                'amount': total_amount
            }

        # Submit tax form data and files
        return submit_tax_form(token, request)
    except Exception as e:
        logger.error(f"Tax form submission error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/tax-solutions/complete-payment', methods=['POST'])
def complete_payment():
    try:
        data = request.get_json()
        form_id = data.get('formId')
        payment_status = data.get('paymentStatus')
        
        if not form_id or not payment_status:
            return jsonify({"error": "Missing required fields"}), 400
            
        # Update form submission with payment status
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection error"}), 500
            
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE form_submissions 
            SET payment_status = %s, 
                updated_at = NOW() 
            WHERE id = %s
            """,
            (payment_status, form_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            "success": True,
            "message": "Payment status updated successfully"
        }), 200
    except Exception as e:
        logger.error(f"Payment completion error: {str(e)}")
        return jsonify({"error": str(e)}), 500
        
@app.route('/api/tax-solutions/save-progress', methods=['POST'])
def tax_form_save_progress():
    try:
        # Get token from authorization header (if available)
        token = request.headers.get('Authorization')
        # Save form progress
        data = request.get_json()
        if 'formType' not in data:
            return jsonify({"error": "Missing form type"}), 400
            
        # Log the form type to verify it's correct
        logger.info(f"Saving form progress with form type: {data.get('formType')}")
        
        # If the form has SMSF-specific fields, make sure formType is correctly set
        if data.get('smsfName') and data.get('formType') != 'smsf':
            logger.warning(f"Form contains SMSF fields but formType is {data.get('formType')}. Setting to 'smsf'")
            data['formType'] = 'smsf'
            
        return save_tax_form_progress(token, data)
    except Exception as e:
        logger.error(f"Tax form save progress error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/tax-solutions/load-progress/<string:form_id>', methods=['GET'])
def tax_form_load_progress(form_id):
    try:
        # Get token from authorization header (if available)
        token = request.headers.get('Authorization')
        # Load saved form progress
        return load_tax_form_progress(token, form_id)
    except Exception as e:
        logger.error(f"Tax form load progress error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# @app.route('/api/content/knowledge-base', methods=['POST'])
# def knowledge_article_create():
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return create_knowledge_article(token, data)

# @app.route('/api/content/knowledge-base/<int:id>', methods=['PUT'])
# def knowledge_article_update(id):
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return update_knowledge_article(token, id, data)

@app.route('/api/tax-solutions/save-engagement', methods=['POST'])
def save_engagement_letter():
    try:
        # Get token from authorization header (if available)
        token = request.headers.get('Authorization')
        # Get engagement letter data
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No engagement letter data provided"}), 400
            
        logger.info(f"Saving engagement letter data: {data}")
        
        # Get user ID if authenticated
        user_id = None
        if token:
            user_id = get_user_id_from_token(token)
        
        # Store engagement letter data
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection error"}), 500
            
        cursor = conn.cursor(dictionary=True)
        
        # Generate a unique ID for the engagement letter
        engagement_id = str(uuid.uuid4())
        
        # Convert data to JSON string
        engagement_json = json.dumps(data)
        
        # Insert record into engagement_letters table
        insert_query = """
        INSERT INTO engagement_letters 
        (id, user_id, engagement_data, created_at, updated_at)
        VALUES (%s, %s, %s, NOW(), NOW())
        """
        
        cursor.execute(
            insert_query,
            (engagement_id, user_id, engagement_json)
        )
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            "success": True,
            "id": engagement_id
        }), 200
        
    except Exception as e:
        logger.error(f"Error saving engagement letter: {str(e)}")
        return jsonify({"error": str(e)}), 500
        
if __name__ == '__main__':
    app.run(debug=app_config.DEBUG, host='0.0.0.0', port=5000)
