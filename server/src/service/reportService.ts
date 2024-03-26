import { createSalesReportQuery, getProductsByTransactionQuery, getSalesByDateQuery } from "../queries/reportQuery";

  const getSalesByDateService = async (startDate: string, endDate: string) => {
      try {
          const res = await getSalesByDateQuery(startDate, endDate);

          return res;
      } catch (err) {
        throw new Error('Error in ReportService: ' + (err as Error).message);
      }
    }

  const getProductsByTransactionService = async (transactionId: number) => {
      try {
          const res = getProductsByTransactionQuery(transactionId);

          return res;
      } catch (err) {
        throw new Error('Error in ReportService: ' + (err as Error).message);
      }
    }

  const createSalesReportService = async (startDate: string, endDate: string) => {
      try {
    const res = await createSalesReportQuery(startDate, endDate);

    return res;
      } catch (err) {
        throw new Error('Error in ReportService: ' + (err as Error).message);
      }
    }

    export {
        getSalesByDateService,
        getProductsByTransactionService,
        createSalesReportService,
    }