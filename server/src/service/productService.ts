import {
  addProductQuery,
  addCategoryForProductQuery,
  updateProductQuery,
  getPaginatedAndFilteredProductsQuery,
  getDetailByIdQuery,
  deleteCategoryForProductQuery,
  getCategoryQuery,
  checkProductQuery,
  deleteProductQuery,
  addCategoryQuery,
  deleteCategoryQuery,
  editCategoryQuery,
} from "../queries/productQuery";

const getPaginatedAndFilteredProductsService = async (
  page: number,
  pageSize: number,
  sortField: string,
  sortOrder: string,
  categoryId: number | null,
  productName: string | null
) => {
  try {
    const result = await getPaginatedAndFilteredProductsQuery(
      page,
      pageSize,
      sortField,
      sortOrder,
      categoryId,
      productName
    );

    console.log("service", page, pageSize, sortField, sortOrder, categoryId, productName);

    return result;
  } catch (err) {
    console.error("Error in getPaginatedAndFilteredProductsService:", err);
    throw new Error("Error in ProductService: " + (err as Error).message);
  }
};

const getDetailByIdService = async (productId: number) => {
  try {
    const result = await getDetailByIdQuery(productId);

    return result;
  } catch (err) {
    throw new Error("Error in ProductService: " + (err as Error).message);
  }
};

const addProductService = async (
  name: string,
  image: string,
  price: number,
  quantity: number,
  description: string,
  category: any,
  markup: number,
  sku: string
) => {
  try {
    const res = await addProductQuery(name, image, price, quantity, description, markup, sku);

    for (let i = 0; i < category.length; i++) {
      await addCategoryForProductQuery(Number(category[i]?.id), res.id);
    }

    return res;
  } catch (err) {
    console.log("ini error", err);

    throw err;
  }
};

const updateProductService = async (
  id: number,
  name: string,
  image: string,
  price: number,
  quantity: number,
  description: string,
  category: any,
  status: string,
  markup: number,
  sku: string
) => {
  try {
    const res = await updateProductQuery(
      id,
      name,
      image,
      price,
      quantity,
      description,
      status,
      markup,
      sku
    );

    console.log("ini di service", category, typeof category);

    if (typeof category == "object") {
      for (let i = 0; i < category.length; i++) {
        await addCategoryForProductQuery(Number(category[i]?.id), id);
      }
    }

    return res;
  } catch (err) {
    console.log("ini error", err);
    throw err;
  }
};

const getCategoryService = async () => {
  try {
    const res = await getCategoryQuery();

    return res;
  } catch (err) {
    console.log("ini error", err);
    throw err;
  }
};

const checkProductService = async (product_id: number) => {
  try {
    const res = await checkProductQuery(product_id);

    return res;
  } catch (err) {
    throw new Error("Error in ProductService: " + (err as Error).message);
  }
};

const deleteProductService = async (product_id: number) => {
  try {
    const res1 = await getDetailByIdQuery(product_id);

    if (res1) {
      for (let i = 0; i < res1.categories.length; i++) {
        await deleteCategoryForProductQuery(product_id, res1.categories[i].category_id);
      }
    }

    const res = await deleteProductQuery(product_id);

    return res;
  } catch (err) {
    throw new Error("Error in ProductService: " + (err as Error).message);
  }
};

const deleteCategoryService = async (category_id: number) => {
  try {
    const res = await deleteCategoryQuery(category_id);

    return res;
  } catch (err) {
    throw new Error("Error in ProductService: " + (err as Error).message);
  }
};

const deleteCategoryForProductService = async (product_id: number, category_id: number) => {
  try {
    const res = await deleteCategoryForProductQuery(product_id, category_id);

    return res;
  } catch (err) {
    throw new Error("Error in ProductService: " + (err as Error).message);
  }
};

const addCategoryService = async (category: string) => {
  try {
    const res = await addCategoryQuery(category);
    return res;
  } catch (err) {
    console.log("ini error", err);
    throw err;
  }
};

const editCategoryService = async (category_id: number, categoryNew: string) => {
  try {
    const res = await editCategoryQuery(category_id, categoryNew);
    return res;
  } catch (err) {
    console.log("ini error", err);
    throw err;
  }
};

export {
  addProductService,
  updateProductService,
  getPaginatedAndFilteredProductsService,
  getDetailByIdService,
  deleteCategoryForProductService,
  getCategoryService,
  checkProductService,
  deleteProductService,
  addCategoryService,
  deleteCategoryService,
  editCategoryService,
};
