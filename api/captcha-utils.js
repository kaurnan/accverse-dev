/**
 * Utility function to validate a Google reCAPTCHA token
 * 
 * @param {string} token - The CAPTCHA token to validate
 * @param {string} secretKey - The Google reCAPTCHA secret key
 * @param {string} [ip] - Optional IP address of the user
 * @returns {Promise<Object>} - The validation result from Google
 */
export async function validateRecaptchaToken(token, secretKey, ip) {
    try {
      // Prepare the form data
      const formData = new URLSearchParams();
      formData.append('secret', secretKey);
      formData.append('response', token);
      
      // Add the IP if provided
      if (ip) {
        formData.append('remoteip', ip);
      }
      
      console.log('Validating CAPTCHA token with Google reCAPTCHA. Secret key length:', secretKey?.length);
      
      // Send the request to Google
      const response = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      
      // Parse the response
      if (!response.ok) {
        console.error(`Google responded with status: ${response.status}`);
        throw new Error(`Google responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('CAPTCHA validation result from Google:', result);
      
      return result;
    } catch (error) {
      console.error('CAPTCHA validation error:', error);
      return {
        success: false,
        'error-codes': ['validation-failure'],
        error: error.message
      };
    }
  }
  
  /**
   * Helper function to extract client IP address from request headers
   * 
   * @param {Object} headers - Request headers
   * @returns {string|null} - Client IP address or null
   */
  export function getClientIp(headers) {
    return (
      headers['x-forwarded-for'] ||
      headers['x-real-ip'] ||
      headers['cf-connecting-ip'] ||
      null
    );
  }
