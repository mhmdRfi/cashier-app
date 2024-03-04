import express  from "express";
const router = express.Router()

import { createTransactionController } from "../controllers/transactionController"

router.post("/", createTransactionController)

export default router; 