import { Request, Response } from "express";
import {
	getCashierProductService,
	getCashierProductPromoService,
} from "../service/cashierProductService";

const getCashierProductController = async (
	req: Request,
	res: Response
) => {
	try {
		const { page, size } = req.params;
		const { categoryId, productName, sortOrder, sortName } = req.query;
		const result = await getCashierProductService(
			Number(page),
			Number(size),
			Number(categoryId),
			String(productName),
			String(sortOrder),
			String(sortName)
		);

		res.status(200).json({
			message: "Transaction Success",
			data: result,
		});
	} catch (err: any) {
		console.log(err);
		res.status(500).send(err.message);
	}
};
const getCashierProductPromoController = async (
	req: Request,
	res: Response
) => {
	try {
		const result = await getCashierProductPromoService();

		res.status(200).json({
			message: "Transaction Success",
			data: result,
		});
	} catch (err: any) {
		console.log(err);
		res.status(500).send(err.message);
	}
};

export {
	getCashierProductController,
	getCashierProductPromoController,
};
