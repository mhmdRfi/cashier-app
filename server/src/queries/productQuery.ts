import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// const getPaginatedAndFilteredProductsQuery = async (
//   page: number,
//   pageSize: number,
//   sortField: string,
//   sortOrder: string,
//   categoryId: number | null,
//   productName: string | null
// ) => {
//   try {
//     console.log("query", page, pageSize, sortField, sortOrder, categoryId, productName);

//     const skip = (page - 1) * pageSize;

//     const whereCondition: any = {};

//     if (productName) {
//       whereCondition.name = {
//         contains: productName,
//       };
//     }

//     if (categoryId) {
//       whereCondition.categories = {
//         some: {
//           category_id: categoryId,
//         },
//       };
//     }

//     const products = await prisma.products.findMany({
//       skip,
//       take: pageSize,
//       orderBy: {
//         [sortField]: sortOrder as any,
//       },
//       where: whereCondition,
//     });

//     const totalProducts = await prisma.products.count({
//       where: whereCondition,
//     });
//     const totalPages = Math.ceil(totalProducts / pageSize);

//     return {
//       products,
//       totalPages,
//     };
//   } catch (err) {
//     console.error('Error in getPaginatedAndFilteredProductsQuery:', err);
//     throw err;
//   }
// };
const getPaginatedAndFilteredProductsQuery = async (
  page: number,
  pageSize: number | null,
  sortField: string,
  sortOrder: string,
  categoryId: number | null,
  productName: string | null
) => {
  try {
    console.log("query", page, pageSize, sortField, sortOrder, categoryId, productName);

    const skip = (page - 1) * (pageSize || 0); // If pageSize is null, skip is set to 0

    const whereCondition: any = {};

    if (productName) {
      whereCondition.name = {
        contains: productName,
      };
    }

    if (categoryId) {
      whereCondition.categories = {
        some: {
          category_id: categoryId,
        },
      };
    }

    const products = await prisma.products.findMany({
      skip,
      take: pageSize || undefined, // If pageSize is null, all records will be fetched
      orderBy: {
        [sortField]: sortOrder as any,
      },
      where: whereCondition,
    });

    const totalProducts = await prisma.products.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(totalProducts / (pageSize || totalProducts)); // If pageSize is null, totalPages is set to 1

    return {
      products,
      totalPages,
    };
  } catch (err) {
    console.error('Error in getPaginatedAndFilteredProductsQuery:', err);
    throw err;
  }
};


const getDetailByIdQuery = async (productId: number) => {
  try {
    const productWithCategories = await prisma.products.findUnique({
      where: { id: productId },
      include: {
        categories: {
          include : {
            category: true
          }
        }
      }
    });

    console.log("Product with Categories:", productWithCategories);

    return productWithCategories;
  } catch (err) {
    console.log("ini error", err);
    
    throw err;
  }
};

  const addProductQuery = async (name: string, image: string, price: number, quantity: number, description: string, markup: number, sku: string) => {
    try {
      console.log('Input parameters:', name, image, price, quantity, description, markup, sku);
  
      if (!name || !image || isNaN(price) || price <= 0 || quantity <= 0 || !description) {
        throw new Error('Invalid input parameters for adding a product');
      }
  
      // Create a new product
      const res = await prisma.products.create({
        data: {
          name,
          image,
          price,
          quantity,
          description,
          updated_at: new Date().toISOString(),
          status: "activated",
          markup,
          sku,
        },
      });
  
      return res;
    } catch (err) {
      console.error('Error in addProductQuery:', err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  };
  

const addCategoryForProductQuery = async ( category_id: number, product_id: number) => {
    try {
      console.log("ini di query",category_id);
      
        await prisma.categories_products.create({
            data: {
                category_id,
                product_id
            }
        })

    } catch (err) {
      console.log("ini error", err);
        throw err;
    } finally {
        await prisma.$disconnect();
    }
}

const updateProductQuery = async (
  id: number,
  name: string,
  image: string,
  price: number,
  quantity: number,
  description: string,
  status: string,
  markup: number,
  sku: string
): Promise<void> => {
  try {
    // Create an object with non-null values
    const updatedValue: Record<string, any> = {
      name,
      image,
      price,
      quantity,
      description,
      status,
      markup,
      sku,
    };

    // Remove properties with null values
    Object.keys(updatedValue).forEach((key) => {
      if (updatedValue[key] === null || updatedValue[key] == "undefined" || updatedValue[key] == "NaN" || updatedValue[key] == "" || isNaN(updatedValue[key])) {
        delete updatedValue[key];
      }
    });

    // Ensure that the values are valid before calling the update
    if (typeof id === 'number') {
      await prisma.products.update({
        where: {
          id: id,
        },
        data: updatedValue,
      });
    } else {
      // Handle invalid input values
      throw new Error('Invalid input values');
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};


const getCategoryQuery = async () => {
  try {
    const res = await prisma.categories.findMany()

    return res;
  } catch (err) {
    console.log("ini error", err);
    throw err;
  }
}

const checkProductQuery = async (product_id: number ) => {
  try {
      const result = await prisma.transaction_items.findMany({
          where: {
            product_id: product_id,
          },
        });

        return result;
  } catch (err) {
    console.log("ini error", err);
      throw err;
  }
};



const deleteProductQuery = async (product_id: number ) => {
  try {
      await prisma.products.delete({
          where: {
            id: product_id
          },
        });
  } catch (err) {
    console.log("ini error", err);
      throw err;
  }
};

const deleteCategoryForProductQuery = async (product_id: number, category_id: number) => {
    try {
        await prisma.categories_products.delete({
            where: {
              category_id_product_id: {
                category_id: category_id,
                product_id: product_id,
              },
            },
          });
    } catch (err) {
      console.log("ini error", err);
        throw err;
    }
};

const addCategoryQuery = async (category: string) => {
    try {
        await prisma.categories.create({
            data: { category }
        })
    } catch (err) {
      console.log("ini error", err);
        throw err;
    }
}


const editCategoryQuery = async (category_id: number, categoryNew: string ) => {
  try {
      await prisma.categories.update({
          where: {
            id: category_id,
          },
          data:
          {
            category: categoryNew
          },
        });
  } catch (err) {
    console.log("ini error", err);
      throw err;
  }
};


const deleteCategoryQuery = async (category_id: number ) => {
  try {
      await prisma.categories.delete({
          where: {
            id: category_id
          },
        });
  } catch (err) {
    console.log("ini error", err);
      throw err;
  }
};

export {
    addProductQuery,
    addCategoryForProductQuery,
    updateProductQuery,
    addCategoryQuery,
    getPaginatedAndFilteredProductsQuery,
    getDetailByIdQuery,
    getCategoryQuery,
    deleteCategoryForProductQuery,
    checkProductQuery,
    deleteProductQuery,
    deleteCategoryQuery,
    editCategoryQuery
}