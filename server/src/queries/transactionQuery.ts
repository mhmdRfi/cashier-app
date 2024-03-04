import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createtransactionsQuery = async (
	total_quantity: number,
	total_price: number,
	cashier_id: number
) => {
	try {
		const result = await prisma.transactions.create({
			data: {
				total_quantity,
				total_price,
				cashier_id,
			},
		});
		return result;
	} catch (err) {
		throw err;
	}
};

const createTransactionItemsQuery = async (
	total_quantity: number,
	product_id: number,
	transaction_id: number
) => {
	try {
		const result = await prisma.transaction_items.create({
			data: {
				total_quantity,
				product_id,
				transaction_id,
			},
		});
		return result;
	} catch (err) {
		throw err;
	}
};

const updateProductQuantityQuery = async (
	id: number,
	quantity: number
) => {
	try {
		const result = await prisma.products.update({
			data: {
				quantity,
			},
			where: { id: id },
		});
		return result;
	} catch (err) {
		throw err;
	}
};

export {
	createTransactionItemsQuery,
	createtransactionsQuery,
	updateProductQuantityQuery,
};
