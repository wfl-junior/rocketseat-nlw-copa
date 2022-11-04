import * as yup from "yup";

export const createPoolValidationSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .typeError("Title must be a string"),
});
