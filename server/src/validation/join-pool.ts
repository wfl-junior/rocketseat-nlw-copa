import * as yup from "yup";

export const joinPoolValidationSchema = yup.object({
  code: yup
    .string()
    .required("The code is required")
    .typeError("The code must be a string"),
});
