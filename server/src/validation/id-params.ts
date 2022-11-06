import * as yup from "yup";

export const idParamsValidationSchema = yup.object({
  id: yup
    .string()
    .required("The id is required")
    .typeError("The id must be a string"),
});
