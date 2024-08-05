const CategoryService = require("../services/category");
const {
  PRODUCT_ALL,
  PRODUCT_NEWEST,
  PRODUCT_TRENDING,
  PRODUCT_SALES,
} = require("../constant/productType");

const getQueryObjectBasedOnFilters = async (currentQueryObject, filters) => {
  const { productIds, categoryIds, type } = filters;
  const queryObject = { ...currentQueryObject };

  if (categoryIds.length > 0) {
    const res = await Promise.all(
      categoryIds.map((categoryId) =>
        CategoryService.getCategoriesRecursivelyFromParent(+categoryId)
      )
    );
    const recursiveCategoryIds = Array.from(new Set(res.flat()));
    queryObject.where = {
      categoryId: {
        in: recursiveCategoryIds,
      },
    };
  }

  if (productIds.length > 0) {
    if (queryObject.where) {
      queryObject.where.id = {
        in: productIds.map((id) => +id),
      };
    } else {
      queryObject.where = {
        id: {
          in: productIds.map((id) => +id),
        },
      };
    }

    queryObject.include.variants = true;
  }

  if (type === PRODUCT_NEWEST) {
    queryObject.orderBy = {
      createdAt: "desc",
    };
  }

  if (type === PRODUCT_TRENDING) {
    queryObject.orderBy = {
      soldNumber: "desc",
    };
  }

  if (type === PRODUCT_SALES) {
    if (!queryObject.where) Object.assign(queryObject, { where: {} });
    queryObject.where.productDiscount = {
      some: {
        startDate: {
          lte: new Date().toISOString(),
        },
        endDate: {
          gte: new Date().toISOString(),
        },
      },
    };
  }

  return queryObject;
};

module.exports = { getQueryObjectBasedOnFilters };
