// routes/salesRouter.ts
import express from 'express';
import { createSalesReportController, getProductsByTransactionController, getSalesByDateController } from '../controllers/reportController';

const router = express.Router();

router.get('/sales-by-date', getSalesByDateController);
router.get('/products-by-transaction/:transactionId', getProductsByTransactionController);
router.get('/sales-report', createSalesReportController);

export default router;
