import * as yup from "yup";

export const userInfoValidationSchema = yup.object({
  id: yup
    .string()
    .required("The id is required")
    .typeError("The id must be a string"),
  email: yup
    .string()
    .required("The e-mail is required")
    .email("The e-mail must be a valid e-mail")
    .typeError("The e-mail must be a string"),
  name: yup
    .string()
    .required("The name is required")
    .typeError("The name must be a string"),
  picture: yup
    .string()
    .required("The picture is required")
    .url("The picture must be a valid url")
    .typeError("The picture must be a string"),
});
