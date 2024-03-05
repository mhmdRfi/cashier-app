import express from "express"
const router = express.Router();

import { getPaginatedAndFilteredProductsController, addProductController, updateProductController, getDetailByIdController, deleteCategoryForProductController, getCategoryController, checkProductController, deleteProductController, addCategoryController, deleteCategoryController, editCategoryController } from '../controllers/productController';
import { uploadProductFile } from "../middleware/multerConfig";


router.get("", getPaginatedAndFilteredProductsController);
router.get("/details-product/:productId", getDetailByIdController);
router.get("/category-lists", getCategoryController);
router.post("/add-product", uploadProductFile, addProductController);
router.patch("/edit-product", uploadProductFile, updateProductController);
router.get("/check-product/:product_id", checkProductController);
router.post("/add-category", addCategoryController);
router.delete("/remove-product/:product_id", deleteProductController);
router.delete("/remove-category-product", deleteCategoryForProductController);
router.delete("/remove-category/:category_id", deleteCategoryController);
router.patch("/edit-category", editCategoryController)
  

export default router;