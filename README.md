# accverseUI
for frontend:
Create a .env file in the root of your frontend project.
Add your reCAPTCHA site key to the .env file.
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key


for backend:
Make sure your .env file in the backend directory contains:

VITE_API_URL=http://localhost:5000/api

FLASK_DEBUG=False

SECRET_KEY=dev-secret-key-change-in-production

REQUIRE_CAPTCHA=True

RECAPTCHA_SECRET_KEY=

RECAPTCHA_SITE_KEY=

Database

DB_HOST=localhost

DB_USER=

DB_PASSWORD=

DB_NAME=Accverse

DB_PORT=3306

JWT

JWT_SECRET_KEY=jwt-secret-key-change-in-production

Email

EMAIL_ENABLED=True

EMAIL_FROM=

SMTP_SERVER=smtp.gmail.com

SMTP_PORT=587

SMTP_USERNAME=

SMTP_PASSWORD=

Microsoft Teams

MS_CLIENT_ID=

MS_CLIENT_SECRET=

MS_TENANT_ID=

MS_REDIRECT_URI=http://localhost:5000/api/auth/teams/callback
TEAMS_ENABLED=False

Firebase
FIREBASE_PROJECT_ID=
FIREBASE_SERVICE_ACCOUNT_PATH=backend/firebase-service-account.json
