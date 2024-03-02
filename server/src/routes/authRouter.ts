import express from "express";
import { body } from "express-validator";
const router = express.Router();

import {
  registerController,
  loginController,
  keepLoginController,
  forgotPasswordController,
  setPasswordController,
  updatePasswordController,
} from "../controllers/authController";
import validator from "../middleware/validator";
import verifyToken from "../middleware/auth";
import checkRoles from "../middleware/auth";
// import checkUserStatus from "../middleware/checkUserStatus";

const validations = [
  body("email").notEmpty().withMessage("Email cannot be emptied"),
  body("email").isEmail().withMessage("Email format is invalid"),
  body("password").notEmpty().withMessage("Password cannot be emptied"),
];
const emailValid = [
  body("email").notEmpty().withMessage("Email cannot be emptied"),
  body("email").isEmail().withMessage("Email format is invalid"),
];

router.post("/addcashier", checkRoles, registerController);
router.patch("/forgot-password", validator(emailValid), forgotPasswordController);
router.patch("/reset-password", setPasswordController);
router.patch("/update-password/:id", updatePasswordController);
router.post("/login", validator(validations), loginController);
router.get("/keep-login", verifyToken, keepLoginController);

export default router;
