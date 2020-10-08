import { UnformErrors } from '@unform/core';
import { ValidationError } from 'yup';

export default function getValidationError(err: ValidationError): UnformErrors {
  const validationErrors: UnformErrors = {};

  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
