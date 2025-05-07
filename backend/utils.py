
import jwt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import uuid
from config import email_config, jwt_config
import json
import logging
import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("api.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Email utility function
def send_email(to_email, subject, body):
    try:
        if email_config.EMAIL_ENABLED:
            msg = MIMEMultipart()
            msg['From'] = email_config.EMAIL_FROM
            msg['To'] = to_email
            msg['Subject'] = subject

            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(email_config.SMTP_SERVER, email_config.SMTP_PORT)
            server.starttls()
            server.login(email_config.SMTP_USERNAME, email_config.SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            logger.info(f"Email sent to {to_email} with subject: {subject}")
        else:
            # Log email in development mode
            logger.info(f"DEVELOPMENT MODE: Email to {to_email}")
            logger.info(f"Subject: {subject}")
            logger.info(f"Body: {body}")
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")

# JWT token generation with all parameters
def generate_token(user_id, email=None, role=None , expiry_hours=24):
    """
    Generate a JWT token for authentication
    
    Parameters:
    - user_id: The user's ID (required)
    - email: The user's email (optional)
    - role: The user's role (optional)
    
    Returns:
    - JWT token string
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=expiry_hours),
        'iat': datetime.datetime.utcnow()
    }
    
    # Add optional fields if provided
    if email:
        payload['email'] = email
    if role:
        payload['role'] = role
    
    logger.info(f"Generating token for user_id: {user_id} with expiry: {expiry_hours} hours")
    token = jwt.encode(payload, jwt_config.JWT_SECRET_KEY, algorithm='HS256')
    return token

# Generate JWT token with just user_id
def generate_jwt_token(user_id):
    """
    Generate a JWT token with just the user ID
    
    Parameters:
    - user_id: The user's ID
    
    Returns:
    - JWT token string
    """
    return generate_token(user_id)

#     payload = {
#         'user_id': user_id,
#         'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
#     }
#     token = jwt.encode(payload, jwt_config.JWT_SECRET_KEY, algorithm='HS256')
#     return token

# # JWT token validation
# def validate_token(token):
#     if not token or not token.startswith('Bearer '):
#         logger.warning("Missing or malformed token: %s", token)
#         return None
    
#     token = token.replace('Bearer ', '')
#     logger.info("Decoding token: %s", token)  # Debugging line

    
#     try:
#         payload = jwt.decode(token, jwt_config.JWT_SECRET_KEY, algorithms=['HS256'])
#         return payload['user_id']
#     except jwt.ExpiredSignatureError:
#         logger.warning("Token expired")
#         return None
#     except jwt.InvalidTokenError:
#         logger.warning("Invalid token")
#         return None

# Extract user_id from token
def generate_refresh_token(user_id, email=None):
    """
    Generate a long-lived refresh token
    
    Parameters:
    - user_id: The user's ID
    - email: The user's email (optional)
    
    Returns:
    - Refresh token string
    """
    return generate_token(user_id, email=email, expiry_hours=jwt_config.JWT_REFRESH_TOKEN_EXPIRES // 3600)

# JWT token validation with improved error handling and logging
def validate_token(token):
    """
    Validate a JWT token and return the user_id if valid
    
    Parameters:
    - token: JWT token string (with or without 'Bearer ' prefix)
    
    Returns:
    - user_id if token is valid, None otherwise
    """
    if not token:
        logger.warning("No token provided")
        return None
        
    # Remove Bearer prefix if present
    if token.startswith('Bearer '):
        token = token.replace('Bearer ', '')
    
    logger.info("Validating token")
    
    try:
        # Decode and verify the token
        payload = jwt.decode(token, jwt_config.JWT_SECRET_KEY, algorithms=['HS256'])
        
        # Check if token is about to expire (within 5 minutes)
        exp_time = payload['exp']
        current_time = datetime.datetime.utcnow().timestamp()
        
        if exp_time - current_time < 300:  # Less than 5 minutes until expiry
            logger.warning(f"Token is about to expire. Exp: {exp_time}, Current: {current_time}")
        else:
            logger.info(f"Token valid. Expires in {exp_time - current_time} seconds")
            
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        logger.warning("Token expired")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error validating token: {str(e)}")
        return None

def get_user_id_from_token(token):
    """
    Extract user_id from a JWT token
    
    Parameters:
    - token: The JWT token string
    
    Returns:
    - user_id if token is valid, None otherwise
    """
    return validate_token(token)

def get_token_claims(token):
    """
    Extract all claims from a JWT token
    
    Parameters:
    - token: JWT token string (with or without 'Bearer ' prefix)
    
    Returns:
    - Dictionary of claims if token is valid, None otherwise
    """
    if not token:
        return None
        
    # Remove Bearer prefix if present
    if token.startswith('Bearer '):
        token = token.replace('Bearer ', '')
    
    try:
        # Decode without verifying signature (to get claims even if expired)
        payload = jwt.decode(token, jwt_config.JWT_SECRET_KEY, algorithms=['HS256'], options={"verify_exp": False})
        return payload
    except jwt.InvalidTokenError:
        return None

# Check if token is expired
def is_token_expired(token):
    """
    Check if a token is expired
    
    Parameters:
    - token: JWT token string
    
    Returns:
    - True if expired, False if valid, None if invalid
    """
    if not token:
        return None
        
    # Remove Bearer prefix if present
    if token.startswith('Bearer '):
        token = token.replace('Bearer ', '')
        
    try:
        # Just check the expiration without fully validating
        payload = jwt.decode(token, jwt_config.JWT_SECRET_KEY, algorithms=['HS256'], options={"verify_exp": False})
        exp_time = payload['exp']
        current_time = datetime.datetime.utcnow().timestamp()
        
        return exp_time < current_time
    except jwt.InvalidTokenError:
        return None

# Generate a unique identifier
def generate_uuid():
    return str(uuid.uuid4())

# Load JSON data
def load_json_data(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except Exception as e:
        logger.error(f"Failed to load JSON data from {file_path}: {str(e)}")
        return {}

# Format currency
def format_currency(amount):
    return f"${amount:.2f}"

# Date and time formatting
def format_date(date_str):
    from datetime import datetime
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        return date_obj.strftime('%d %b, %Y')
    except:
        return date_str

def format_time(time_str):
    from datetime import datetime
    try:
        time_obj = datetime.strptime(time_str, '%H:%M')
        return time_obj.strftime('%I:%M %p')
    except:
        return time_str

# Data validation functions
def validate_email(email):
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    import re
    pattern = r'^\+?[0-9\s-]{8,15}$'
    return re.match(pattern, phone) is not None

# Sample data for demonstration
sample_service_categories = [
    {"id": 1, "name": "Tax Services", "description": "Professional tax preparation and planning services"},
    {"id": 2, "name": "Accounting Services", "description": "Bookkeeping and accounting solutions for businesses"},
    {"id": 3, "name": "Business Advisory", "description": "Strategic financial advice for business growth"},
    {"id": 4, "name": "Training & Workshops", "description": "Educational sessions on financial management"}
]

sample_services = [
    {
        "id": 1,
        "name": "Personal Tax Return",
        "description": "Complete preparation and filing of personal income tax returns",
        "category_id": 1,
        "price": 250.00,
        "duration": 60,
        "is_active": True
    },
    {
        "id": 2,
        "name": "Business Tax Return",
        "description": "Comprehensive tax preparation for businesses of all sizes",
        "category_id": 1,
        "price": 800.00,
        "duration": 120,
        "is_active": True
    },
    {
        "id": 3,
        "name": "Monthly Bookkeeping",
        "description": "Regular bookkeeping services to maintain accurate financial records",
        "category_id": 2,
        "price": 350.00,
        "duration": 60,
        "is_active": True
    },
    {
        "id": 4,
        "name": "Financial Statement Preparation",
        "description": "Creation of profit & loss statements, balance sheets, and cash flow reports",
        "category_id": 2,
        "price": 500.00,
        "duration": 90,
        "is_active": True
    },
    {
        "id": 5,
        "name": "Business Growth Strategy",
        "description": "Custom strategic planning for business expansion and profitability",
        "category_id": 3,
        "price": 1200.00,
        "duration": 120,
        "is_active": True
    },
    {
        "id": 6,
        "name": "Tax Planning Workshop",
        "description": "Group workshop on tax-saving strategies and planning",
        "category_id": 4,
        "price": 150.00,
        "duration": 180,
        "is_active": True
    }
]

