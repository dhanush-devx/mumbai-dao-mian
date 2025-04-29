/**
 * Custom error response handler to standardize API error responses
 */
class ErrorHandler {
  /**
   * Create standardized error response
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {object} details - Additional error details (optional)
   */
  static handleError(res, statusCode, message, details = null) {
    const response = {
      success: false,
      error: message
    };
    
    if (details && process.env.NODE_ENV === 'development') {
      response.details = details;
    }
    
    return res.status(statusCode).json(response);
  }
  
  /**
   * Handle common validation errors
   */
  static handleValidationError(res, error) {
    return this.handleError(res, 400, 'Validation Error', error.message);
  }
  
  /**
   * Handle database errors
   */
  static handleDBError(res, error) {
    console.error('Database error:', error);
    return this.handleError(
      res, 
      500, 
      'Database operation failed', 
      error.message
    );
  }
}

module.exports = ErrorHandler;