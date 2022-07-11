import { GraphQLError } from 'graphql';
import { apiErrorTypes, errorTypes } from './custom_error';

const formatError = (err: GraphQLError) => {
  console.warn('err', err);
  const error = errorTypes[err.message as apiErrorTypes];
  if (err) {
    return {
      success: false,
      type: error.type,
      message: error.message,
      status: error.status,
    };
  }
  return {
    success: false,
    message: error.message,
  };
};

export default formatError;
