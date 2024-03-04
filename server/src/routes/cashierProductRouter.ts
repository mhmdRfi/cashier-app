import express  from "express";
const router = express.Router()

import { getCashierProductController, getCashierProductPromoController } from "../controllers/cashierProductController"

router.get("/promo", getCashierProductPromoController)
router.get("/allProduct", getCashierProductPromoController)
router.get("/:page/:size", getCashierProductController)

export default router; 