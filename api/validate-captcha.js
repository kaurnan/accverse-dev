// API endpoint for validating Google reCAPTCHA tokens
import { validateRecaptchaToken, getClientIp } from './captcha-utils.js';

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract the token from the request body
    const { token } = request.body;
    
    if (!token) {
      return response.status(400).json({ error: 'Missing CAPTCHA token' });
    }
    
    // Get the Google reCAPTCHA secret key
    // This is Google's test secret key that pairs with the test site key we're using
    const secretKey = app_config.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      console.error('Google reCAPTCHA secret key is not configured');
      return response.status(500).json({ error: 'Server configuration error' });
    }
    
    // Get client IP from request headers
    const clientIp = getClientIp(request.headers);
    
    // Use the utility function to validate the token
    const verificationResult = await validateRecaptchaToken(token, secretKey, clientIp);
    
    // Log the verification result for debugging
    console.log('CAPTCHA verification result:', verificationResult);
    
    // Return success or failure based on Google's response
    if (verificationResult.success) {
      return response.status(200).json({
        success: true,
        message: 'CAPTCHA verification successful',
      });
    } else {
      return response.status(400).json({
        success: false,
        message: 'CAPTCHA verification failed',
        errors: verificationResult['error-codes'],
      });
    }
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return response.status(500).json({
      success: false,
      message: 'An error occurred during CAPTCHA verification',
    });
  }
}
