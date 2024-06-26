import { Router } from "express";
import * as authController from "../controller/auth-controller";
import { body } from "express-validator";
import authValidator from "../middleware/auth-validator";

const router = Router();

router.put(
  "/signup",
  [
    body("name").trim().isLength({ min: 3 }).withMessage("Too small name"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Too small password"),
  ],
  authController.signupController
);
router.post(
  "/signin",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Too small password"),
  ],
  authController.signinController
);
router.get("/validToken", authValidator, authController.validTokenController);

export default router;
// https://www.geeksforgeeks.org/jwt-authentication-with-refresh-tokens/
// https://www.geeksforgeeks.org/mastering-jwt-authentication-in-express/?ref=ml_lbp
