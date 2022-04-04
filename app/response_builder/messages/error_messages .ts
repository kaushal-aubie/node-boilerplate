export const errorMessage = {
  server: {
    // * General Errors
    INTERNAL_SERVER: 'Sorry! Something went wrong. Please contact your administrator.',
    INVALID_DATA: 'Sorry! Required data not found or data types are mismatched',
    BAD_REQUEST: 'Sorry! Request Body/Params are invalid',
    NOT_FOUND: 'Sorry! Required Data/Api not found',
    NO_ACCESS_PERMISSION: 'Sorry! you are not allowed to access this feature',
    UNAUTHORIZED: 'Sorry! you must be logged in to perform this operation',
  },

  user: {
    // * User Module
    USER_ALREADY_EXIST:
      'User already exist with same mobile or email. Please try with different email or mobile.',
    USER_NOT_UPDATE: 'Something went wrong. User data not updated.',
    USER_DOES_NOT_EXIST: 'User does not exist with given email. Please try with valid email',
    USER_PASSWORD_INCORRECT: 'Entered password is incorrect',
    USER_EMAIL_NOT_VERIFIED: 'Email has not been verified by user',
    USER_IS_NOT_ACTIVE: 'User is not active',
    USER_IS_DELETED: 'User has been deleted. Please contact the administrator',
    PASSWORD_NOT_MATCH: 'Password Not Match, Please try again',
    INVALID_TOKEN: 'Your Token has been expired, Please try again',
    USER_ACCESS: 'Sorry! You not have access to login portal. Please contact the administrator',
    USER_TOKEN_NOT_UPDATE: 'Sorry! You not able to login. Please contact the administrator',
    USER_UNAUTHORIZED: 'Authentication error. Token expired or invalid',
    USER_LOGOUT_ERROR: 'Something went wrong. User not logout.',
    USER_DELETED: 'User Already Deleted',
  },
};
