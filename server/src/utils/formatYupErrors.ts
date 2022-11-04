import { ValidationError } from "yup";

export function formatYupErrors(validationErrors: ValidationError[]) {
  return validationErrors.reduce<Record<string, string>>((errors, error) => {
    if (error.path) {
      errors[error.path] = error.message;
    }

    return errors;
  }, {});
}
