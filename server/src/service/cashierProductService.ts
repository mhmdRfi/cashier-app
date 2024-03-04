import {
	getCashierProductQuery,
	getCashierProductPromoQuery,
} from "../queries/cashierProductQuery";

const getCashierProductService = async (
	page: number,
	size: number,
	categoryId: number,
	productName: string,
	sortOrder: string,
	sortName: string
) => {
	try {
		const res = await getCashierProductQuery(
			page,
			size,
			categoryId,
			productName,
			sortOrder,
			sortName
		);
		return res;
	} catch (err) {
		throw err;
	}
};
const getCashierProductPromoService = async () => {
	try {
		const res = await getCashierProductPromoQuery();
		return res;
	} catch (err) {
		throw err;
	}
};

export { getCashierProductService, getCashierProductPromoService };
