import { body, validationResult } from "express-validator";

export const registrationValidation = [
  body("username")
    .notEmpty()
    .withMessage("enter email frist")
    .isEmail()
    .withMessage("enter valid email"),
  body("password_hash")
    .notEmpty()
    .withMessage("enter password")
    .matches(/[0-9]/)
    .withMessage("password should contain number between 0-9")
    .matches(/[a-z]/)
    .withMessage("password should contain char between a-z")
    .matches(/[A-Z]/)
    .withMessage("password should contain char between A-Z")
    .matches(/[@#$&]/)
    .withMessage("password should contain symbol @#$&"),
];

export const logInValidation = [
  body("username")
    .notEmpty()
    .withMessage("enter email frist")
    .isEmail()
    .withMessage("enter valid email"),
  body("password_hash")
    .notEmpty()
    .withMessage("enter password")
    .matches(/[0-9]/)
    .withMessage("password should contain number between 0-9")
    .matches(/[a-z]/)
    .withMessage("password should contain char between a-z")
    .matches(/[A-Z]/)
    .withMessage("password should contain char between A-Z")
    .matches(/[@#$&]/)
    .withMessage("password should contain symbol @#$&"),
];

export const validationError = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(401).json({
      error: error.array(),
    });
  }

  next();
};
