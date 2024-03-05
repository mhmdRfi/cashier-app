import { Request, Response } from 'express';
import { addProductService, getPaginatedAndFilteredProductsService, updateProductService, getDetailByIdService, deleteCategoryForProductService, getCategoryService, checkProductService, deleteProductService, addCategoryService, deleteCategoryService, editCategoryService } from '../service/productService';

const getPaginatedAndFilteredProductsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string);
    const sortField = req.query.sortField as string || 'name';
    const sortOrder = req.query.sortOrder as string || 'asc';
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null;
    const productName = req.query.productName ? String(req.query.productName) : null;

    const result = await getPaginatedAndFilteredProductsService(page, pageSize, sortField, sortOrder, categoryId, productName);

    console.log("controller", page, pageSize, sortField, sortOrder, categoryId, productName);

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error in getPaginatedAndFilteredProductsController:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getDetailByIdController = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId
    const result = await getDetailByIdService(Number(productId));
    console.log("ini di controller",productId);
    

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

const addProductController = async (req: Request, res: Response) => {
    try {
        const {name, price, quantity, description, category, markup, sku} = req.body;
        const serviceResponse = await addProductService(String(name), String(req.file?.filename), Number(price), Number(quantity), String(description), category, Number(markup), sku)

        res.status(201).json({ message: 'Product added successfully', data: serviceResponse });
    } catch (err) {
      console.log(err);
      
        res.status(500).json({error: "internal server error"})
    }
}

const updateProductController = async (req: Request, res: Response) => {
    try {
        const {id, name, price, quantity, description, category, status, markup, sku} = req.body;
        console.log(" ini di controller", id, name, price, quantity, description, category, status);
        
        await updateProductService(Number(id), name, String(req.file?.filename), Number(price), Number(quantity), description, category, status, Number(markup), sku)
        res.status(201).json({message: 'Product updated successfully'})
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "internal server error"})
    }
}

const getCategoryController = async (req: Request, res: Response) => {
  try {
    const responseService = await getCategoryService();
    
    return res.status(200).json(responseService);
  } catch (err) {
    res.status(500).json({error: "Internal server error"})
  }
}

const checkProductController = async (req: Request, res: Response) => {
  try {
    const {product_id} = req.params;

    const serviceResponse = await checkProductService(Number(product_id))

    res.status(201).json({serviceResponse})
  } catch (err) {
    res.status(500).json({error: "internal server error"})
  }
}

const deleteProductController = async (req: Request, res: Response) => {
  try {
    const {product_id} = req.params;

    await deleteProductService(Number(product_id))

    res.status(201).json({message: 'Product deleted successfully'})
  } catch (err) {
    res.status(500).json({error: "internal server error"})
  }
}

const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const {category_id} = req.params;

    await deleteCategoryService(Number(category_id))

    res.status(201).json({message: 'Category deleted successfully'})
  } catch (err) {
    res.status(500).json({error: "internal server error"})
  }
}

const deleteCategoryForProductController = async (req: Request, res: Response) => {
  try {
    const {product_id, category_id} = req.query;

    await deleteCategoryForProductService(Number(product_id), Number(category_id))

    res.status(201).json({message: 'Category product deleted successfully'})
  } catch (err) {
    res.status(500).json({error: "internal server error"})
  }
}

const addCategoryController = async (req: Request, res: Response) => {
  try {
    const { category } = req.body;

    const result = await addCategoryService(category);

    res.status(201).json({result})
  } catch (err) {
    res.status(500).json({error: "internal server error"})
  }
}

const editCategoryController = async (req: Request, res: Response) => {
  try {
    const { category_id, categoryNew } = req.body;

    const result = await editCategoryService(category_id, categoryNew);

    res.status(201).json({result})
  } catch (err) {
    res.status(500).json({error: "internal server error"})
  }
}

export {
    addProductController,
    updateProductController,
    getPaginatedAndFilteredProductsController,
    getDetailByIdController,
    deleteCategoryForProductController,
    getCategoryController,
    checkProductController,
    deleteProductController,
    addCategoryController,
    deleteCategoryController,
    editCategoryController,
}