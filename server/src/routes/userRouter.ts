import express from "express";
const router = express.Router()


import { findCashierController, updateCashierController, deleteCashierController, uploadAvatarController, findInactiveCashierController } from "../controllers/userController";
import checkRoles from "../middleware/auth"
import {uploadAvatar} from "../middleware/multer"


router.get("/cashier", checkRoles, findCashierController);
router.get("/inactive-cashier", checkRoles, findInactiveCashierController);
router.patch("/updatecashier/:id", checkRoles, updateCashierController);
router.delete("/deletecashier/:id", checkRoles, deleteCashierController);
router.patch("/upload-avatar/:id", uploadAvatar, uploadAvatarController);



export default router