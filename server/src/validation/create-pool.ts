import * as yup from "yup";

export const createPoolValidationSchema = yup.object({
  title: yup
    .string()
    .required("The title is required")
    .typeError("The title must be a string"),
});
