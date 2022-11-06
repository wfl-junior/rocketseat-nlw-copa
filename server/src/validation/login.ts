import * as yup from "yup";

export const loginValidationSchema = yup.object({
  access_token: yup
    .string()
    .required("The access token is required")
    .typeError("The access token must be a string"),
});
