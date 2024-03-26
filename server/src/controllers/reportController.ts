import { Request, Response } from 'express';
import { createSalesReportService, getProductsByTransactionService, getSalesByDateService } from '../service/reportService';

  const getSalesByDateController = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;
        
        const salesByDate = await getSalesByDateService(String(startDate), String(endDate));
        res.json(salesByDate);
        
    } catch (error) {
        console.log(error);
        
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const getProductsByTransactionController = async (req: Request, res: Response) => {
    try {
        const { transactionId } = req.params;
        console.log(transactionId);
        
        const productsByTransaction = await getProductsByTransactionService(Number(transactionId));
        res.json(productsByTransaction);
    } catch (error) {
        console.log(error);
        
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const createSalesReportController = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        const salesReport = await createSalesReportService(String(startDate), String(endDate));
        res.json(salesReport);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

export {
    getSalesByDateController,
    getProductsByTransactionController,
    createSalesReportController,
}