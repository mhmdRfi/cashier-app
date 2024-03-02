import { Request, Response } from "express";
import {
  loginService,
  registerService,
  keepLoginService,
  forgotPasswordService,
  setPasswordService,
  updatePasswordService,
} from "../service/authService";

const registerController = async (req: Request, res: Response) => {
  try {
    const { username, email, password, type } = req.body;
    const result = await registerService(
      String(username),
      String(email),
      String(password),
      String(type)
    );

    return res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(String(email), String(password));

    return res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

const keepLoginController = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;

    if (id === undefined) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const result = await keepLoginService(Number(id));

    return res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
};

const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordService(String(email));
    return res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
};
const setPasswordController = async (req: Request, res: Response) => {
  try {
    const { resetToken } = req.query;
    const { password } = req.body;
    const result = await setPasswordService(String(resetToken), String(password));
    return res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
};

const updatePasswordController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const result = await updatePasswordService(Number(id), String(password));
    return res.status(200).json({
      data: result,
      message: "password updated successfully",
    });
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
};

export {
  registerController,
  loginController,
  keepLoginController,
  forgotPasswordController,
  setPasswordController,
  updatePasswordController,
};
