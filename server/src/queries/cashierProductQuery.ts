import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getCashierProductQuery = async (
	page: number,
	size: number,
	categoryId: number,
	productName: string,
	sortOrder: string,
	sortName: string
) => {
	try {
		const pageSize = size;
		const skip = (page - 1) * pageSize;
		const take = pageSize;

		const params: any = {};

		if(productName) {
			params.name = {
				contains: productName,
			}
		}

		if (categoryId) {
			params.categories = {
				some: {
					category_id : categoryId,
				}
			};
		}



		const result = await prisma.products.findMany({
			include: { categories: true },
			skip,
			take,
			orderBy: {
				[sortName]: sortOrder as any,
			},
			where: params,
		});

		const totalProduct = await prisma.products.count({
			where: params
		})

		const totalPage = Math.ceil(totalProduct/pageSize)

		return {result, totalPage};
	} catch (err) {
		console.log("ini error", err);
		console.log("ini error lagi", err);
		
		throw err;
	}
};

const getCashierProductPromoQuery = async () => {
	try {
		const result = await prisma.products.findMany();
		return result;
	} catch (err) {
		console.log("ini error", err);
		throw err;
	}
};

export { getCashierProductQuery, getCashierProductPromoQuery };
