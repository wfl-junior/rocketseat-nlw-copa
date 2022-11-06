import * as yup from "yup";

export const createGuessParamsValidationSchema = yup.object({
  poolId: yup
    .string()
    .required("The pool id is required")
    .typeError("The pool id must be a string"),
  gameId: yup
    .string()
    .required("The game id is required")
    .typeError("The game id must be a string"),
});

export const createGuessValidationSchema = yup.object({
  firstTeamPoints: yup
    .number()
    .integer("The first team points must be an integer")
    .required("The first team points is required")
    .typeError("The first team points must be a number"),
  secondTeamPoints: yup
    .number()
    .integer("The second team points must be an integer")
    .required("The second team points is required")
    .typeError("The second team points must be a number"),
});
