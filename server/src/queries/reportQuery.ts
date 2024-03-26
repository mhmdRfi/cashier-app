import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getSalesByDateQuery = async (startDate: string, endDate: string) => {
  try {
    const salesData = await prisma.transactions.groupBy({
      by: ['date'],
      _sum: {
        total_price: true,
        total_quantity: true, // Add total quantity to be summed
      },
      _count: {
        id: true, // Counting transactions
      },
      where: {
        date: {
          gte: new Date(startDate + 'T00:00:00.000Z'),
          lte: new Date(endDate + 'T23:59:59.999Z'),
        },
      },
    });

    // Combine and sum results for the same date
    const mergedSalesData = salesData.reduce((accumulator: any, item) => {
      const saleDate = new Date(item.date).toISOString().split('T')[0];

      if (accumulator[saleDate]) {
        accumulator[saleDate].totalSales += item._sum.total_price || 0;
        accumulator[saleDate].totalQuantity += item._sum.total_quantity || 0;
        accumulator[saleDate].totalTransactions += item._count.id;
      } else {
        accumulator[saleDate] = {
          totalSales: item._sum.total_price || 0,
          totalQuantity: item._sum.total_quantity || 0,
          totalTransactions: item._count.id,
          saleDate: saleDate,
        };
      }

      return accumulator;
    }, {});

    // Convert the aggregated object back to an array
    const aggregatedSalesData = Object.values(mergedSalesData);

    return aggregatedSalesData;

  } catch (err) {
    console.log("ini error", err);
		throw err;
  }
};



  const getProductsByTransactionQuery = async (transactionId: number) => {
    try {
console.log("ini di query", transactionId);


      const res = await prisma.transactions.findMany({
        where: {
          id: transactionId,
        },
        include: {
          transaction_item: {
            include: {
              product: true,
            },
          },
          cashier: true,
        },
      });
      return res;
    } catch (err) {
      console.log("ini error", err);
		throw err;
    }
  }

  const createSalesReportQuery = async (startDate: string, endDate: string) => {
    try {
      const res = await prisma.transactions.findMany({
        where: {
          date: {
            gte: new Date(startDate + 'T00:00:00.000Z'),
            lte: new Date(endDate + 'T23:59:59.999Z'),
          },
        },
        include: {
          transaction_item: {
            include: {
              product: true,
            },
          },
          cashier: true
        },
      });
      
      return res;
    } catch (err) {
      console.log("ini error", err);
		throw err;
    }
};

export {
  getSalesByDateQuery,
  getProductsByTransactionQuery,
  createSalesReportQuery,
}