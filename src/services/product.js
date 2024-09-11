const slugify = require("slugify");
const prisma = require("../config/prismaClient");
const UploadService = require("./upload");
const { readFileSync, rm } = require("fs");
const {
  PRODUCT_ALL,
  PRODUCT_NEWEST,
  PRODUCT_TRENDING,
  PRODUCT_SALES,
} = require("../constant/productType");
const CategoryService = require("./category");
const {
  generateEmbeddingsFromText,
  generateEmbeddingsFromTextV2,
  generateEmbeddingsFromImageUrl,
} = require("../utils/generateEmbeddings");
const { getGenderFromQuery, getUploadedImageId, getUploadedImageIds } = require("../utils");
const { Prisma } = require("@prisma/client");
const { getQueryObjectBasedOnFilters } = require("../utils/product");
const { getProduct, getAllProductLinks } = require("./uploadTempData/crawlData");

const commonIncludeOptionsInProduct = {
  images: {
    include: {
      image: true,
    },
  },
  colors: {
    include: {
      thumbnailImage: true,
      productImage: {
        include: {
          image: true,
        },
      },
    },
  },
  variants: {
    select: {
      quantity: true,
    },
  },
  productDiscount: {
    where: {
      startDate: {
        lte: new Date().toISOString(),
      },
      endDate: {
        gte: new Date().toISOString(),
      },
    },
  },
};

class ProductService {
  // crawl
  static async crawl({ url, categorySlug }) {
    const productData = await getProduct(url);

    const findProduct = await prisma.product.findFirst({
      where: {
        name: productData.name,
      },
    });

    if (findProduct) {
      return `Product ${productData.name} already exists`;
    }

    console.log("productData", productData);

    // get category
    const category = await CategoryService.getOneBySlug(categorySlug);

    // upload thumbnail image
    const thumbnailImageId = await getUploadedImageId(productData.thumbnailImage);
    console.log("thumbnailImageId", thumbnailImageId);

    // upload view image
    const viewImageId = await getUploadedImageId(productData.viewImage);
    console.log("viewImageId", viewImageId);

    // upload images
    const uploadedImageIds = await getUploadedImageIds(productData.images);
    console.log("uploadedImageIds", uploadedImageIds);

    // create product
    const newProduct = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          name: productData.name,
          overview: productData.overview,
          specification: productData.specification,
          material: productData.material,
          instruction: productData.instruction,
          categoryId: category.id,
          thumbnailImageId,
          viewImageId,
          slug: slugify(productData.name, { lower: true }),
        },
      });

      await tx.variant.createMany({
        data: productData.variants.map((variant) => ({
          size: variant.size,
          price: variant.price,
          quantity: 10,
          productId: createdProduct.id,
        })),
      });

      await tx.productImage.createMany({
        data: uploadedImageIds.map((uploadedImageId) => ({
          imageId: uploadedImageId,
          productId: createdProduct.id,
        })),
      });
      return createdProduct;
    });

    return newProduct;
  }

  static async crawlMany({ categorySlug, urls }) {
    return await Promise.all(
      urls.map(async (url) => {
        return await ProductService.crawl({ url, categorySlug });
      })
    );
  }

  static async crawlCategory({ url }) {
    const links = await getAllProductLinks(url);
    return await ProductService.crawlMany({ categorySlug: "tranh-tre-em", urls: links });
  }

  static async create({ uploadedImageIds, variants, ...data }) {
    console.log("product service", data);
    const newProduct = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          ...data,
        },
      });

      await tx.variant.createMany({
        data: variants.map((variant) => ({
          size: variant.size,
          price: +variant.price,
          quantity: +variant.quantity,
          productId: createdProduct.id,
        })),
      });

      await tx.productImage.createMany({
        data: uploadedImageIds.map((uploadedImageId) => ({
          imageId: uploadedImageId,
          productId: createdProduct.id,
        })),
      });
      return createdProduct;
    });

    return newProduct;
  }

  static async getAll({
    type = PRODUCT_ALL,
    limit = 6,
    categoryIds = [],
    productIds = [],
    page = 1,
  }) {
    let query = {
      include: {
        images: {
          include: {
            image: true,
          },
        },
        thumbnailImage: true,
        viewImage: true,
        variants: true,

        // productDiscount: {
        //   where: {
        //     startDate: {
        //       lte: new Date().toISOString(),
        //     },
        //     endDate: {
        //       gte: new Date().toISOString(),
        //     },
        //   },
        // },
      },
      take: limit,
    };

    query = await getQueryObjectBasedOnFilters(query, {
      categoryIds,
      productIds,
      type,
    });

    const count = await prisma.product.count({
      where: query.where,
    });

    const offset = page > 1 ? (page - 1) * limit : 0;
    const totalPages = Math.ceil(count / limit);

    const products = await prisma.product.findMany({ ...query, skip: offset });

    query;
    return {
      products,
      pagination: {
        totalProducts: count,
        totalPages,
      },
    };
  }

  static async getOne(productId) {
    const [product, productSizes] = await Promise.all([
      prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          images: {
            include: {
              image: true,
            },
          },
          thumbnailImage: true,
          viewImage: true,
          variants: true,
          // productDiscount: {
          //   where: {
          //     startDate: {
          //       lte: new Date().toISOString(),
          //     },
          //     endDate: {
          //       gte: new Date().toISOString(),
          //     },
          //   },
          // },
        },
      }),
      prisma.variant.findMany({
        distinct: ["size"],
        where: {
          productId,
        },
      }),
    ]);

    product.sizes = productSizes
      .map((item) => item.size)
      .sort((a, b) => b.id - a.id);

    return product;
  }

  static async getOneBySlug(productSlug) {
    const product = await prisma.product.findUnique({
      where: {
        slug: productSlug,
      },
      include: {
        images: {
          include: {
            image: true,
          },
        },
        thumbnailImage: true,
        viewImage: true,
        variants: true
        // productDiscount: {
        //   where: {
        //     startDate: {
        //       lte: new Date().toISOString(),
        //     },
        //     endDate: {
        //       gte: new Date().toISOString(),
        //     },
        //   },
        // },
      },
    });

    const productSizes = await prisma.variant.findMany({
      distinct: ["size"],
      where: {
        productId: product.id,
      },
      select: {
        size: true,
      },
    });

    product.sizes = productSizes
      .map((item) => item.size)
      .sort((a, b) => a.id - b.id);

    return product;
  }

  static async update(productId, updatedData) {
    return await prisma.product.update({
      where: {
        id: productId,
      },
      data: updatedData,
    });
  }

  static async delete(productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
      },
    });

    await Promise.all(
      product.images.map((image) => UploadService.destroyImage(image.imageId))
    );

    await prisma.product.delete({ where: { id: productId } });
  }

  static async addImage(productId, { uploadedImageId }) {
    return await prisma.productImage.create({
      data: {
        productId,
        imageId: uploadedImageId,
      },
    });
  }

  static async deleteImage(productImageId, filename) {

    const productImage = await prisma.productImage.findUnique({
      where: {
        id: productImageId,
      },
    });

    await Promise.all([
      prisma.productImage.delete({
        where: {
          id: productImageId,
        },
      }),
      UploadService.destroyImage(productImage.imageId),
    ]);
  }

  static async search(query) {
    const trimmedQuery = query.trim().replace(/ {2,}/g, " ").toLowerCase();

    const genderObject = await getGenderFromQuery(trimmedQuery);

    let categoriesRecursivelyFromParent = [];

    if (genderObject) {
      categoriesRecursivelyFromParent = Array.from(
        new Set(
          await CategoryService.getCategoriesRecursivelyFromParent(
            genderObject.id
          )
        )
      );
    }

    const fullTextSearchStringQueryWithoutGender = trimmedQuery
      .replace(/nam|nữ|trẻ em/g, "")
      .trim()
      .replace(/ {2,}/g, " ")
      .replace(/ /g, " & ");

    const fullTextSearchResult = await ProductService.fullTextSearch(
      fullTextSearchStringQueryWithoutGender,
      categoriesRecursivelyFromParent
    );

    const semanticSearchResult = await ProductService.semanticSeach(
      trimmedQuery,
      fullTextSearchResult,
      categoriesRecursivelyFromParent
    );

    return {
      fullTextSearchResult,
      semanticSearchResult,
    };
  }

  static async fullTextSearch(query, categoriesRecursivelyFromParent = []) {
    const searchQuery = {
      where: {
        name: {
          search: query,
        },
      },
      include: commonIncludeOptionsInProduct,
    };
    if (categoriesRecursivelyFromParent.length > 0) {
      searchQuery.where.categoryId = {
        in: categoriesRecursivelyFromParent,
      };
    }
    return await prisma.product.findMany(searchQuery);
  }

  static async semanticSeach(
    query,
    fullTextSearchResult = [],
    categoriesRecursivelyFromParent = []
  ) {
    const embeddings = await generateEmbeddingsFromTextV2(query.toLowerCase());

    const fullTextSearchResultIds = fullTextSearchResult.map((item) => item.id);
    if (fullTextSearchResultIds.length === 0) {
      fullTextSearchResultIds.push(-1);
    }
    let result;
    let threadhold = fullTextSearchResult.length > 0 ? 0.3 : 0.6;
    if (categoriesRecursivelyFromParent.length > 0) {
      result =
        await prisma.$queryRaw`SELECT 1 - (embedding <=> ${embeddings}::vector) AS cosine_similarity, products.product_id FROM product_embeddings JOIN products ON product_embeddings.product_id = products.product_id  WHERE 1 - (embedding <=> ${embeddings}::vector) >= ${threadhold} AND products.category_id IN (${Prisma.join(
          categoriesRecursivelyFromParent
        )}) AND products.product_id NOT IN (${Prisma.join(
          fullTextSearchResultIds
        )}) ORDER BY cosine_similarity DESC LIMIT 10;`;
    } else {
      result =
        await prisma.$queryRaw`SELECT 1 - (embedding <=> ${embeddings}::vector) AS cosine_similarity, product_id FROM product_embeddings WHERE 1 - (embedding <=> ${embeddings}::vector) >= ${threadhold} AND product_id NOT IN (${Prisma.join(
          fullTextSearchResultIds
        )}) ORDER BY cosine_similarity DESC LIMIT 10;`;
    }

    return await prisma.product.findMany({
      where: {
        id: {
          in: result.map((item) => item.product_id),
        },
      },
      include: commonIncludeOptionsInProduct,
    });
  }

  static async getRecommendProductsBasedOnOrders(accountId) {
    const orders = await prisma.order.findMany({
      where: {
        buyerId: accountId,
      },
      include: {
        OrderDetail: {
          include: {
            variant: {
              select: {
                productId: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (orders.length === 0)
      return await ProductService.getAll({ limit: 10, type: PRODUCT_NEWEST });

    const productIds = new Set();

    orders.forEach((order) => {
      order.OrderDetail.forEach((orderDetail) => {
        if (productIds.size > 10) return;
        productIds.add(orderDetail.variant.productId);
      });
    });

    let limit = Math.floor(10 / productIds.size);

    const productEmbeddings =
      await prisma.$queryRaw`SELECT embedding::text, product_id FROM product_embeddings WHERE product_id IN (${Prisma.join(
        Array.from(productIds)
      )}) ORDER BY product_id ASC;`;

    const recommendProductIds = [];
    const excludedProductIds = Array.from(productIds);
    for (let productEmbeddingIndex in productEmbeddings) {
      if (productEmbeddingIndex == productEmbeddings.length - 1) {
        limit = 10 - recommendProductIds.length;
      }
      const productEmbedding = productEmbeddings[productEmbeddingIndex];
      let result = await prisma.$queryRaw`SELECT 1 - (embedding <=> ${productEmbedding.embedding
        }::vector) AS cosine_similarity, product_id FROM product_embeddings WHERE product_id NOT IN (${Prisma.join(
          excludedProductIds
        )}) ORDER BY cosine_similarity DESC LIMIT ${limit};`;

      for (let item of result) {
        recommendProductIds.push(item.product_id);
        excludedProductIds.push(item.product_id);
      }
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: recommendProductIds,
        },
      },
      include: {
        images: {
          include: {
            image: true,
          },
        },
        colors: {
          include: {
            thumbnailImage: true,
            productImage: {
              include: {
                image: true,
              },
            },
          },
        },
        variants: {
          select: {
            quantity: true,
          },
        },
        productDiscount: {
          where: {
            startDate: {
              lte: new Date().toISOString(),
            },
            endDate: {
              gte: new Date().toISOString(),
            },
          },
        },
      },
    });

    return products;
  }

  static async imageSearch(imageUrl, uploadedImagePath) {
    const embeddings = Array.from(
      await generateEmbeddingsFromImageUrl(imageUrl)
    );
    const foundResults = [];
    const exclusiveProductIds = [-1];
    let result;
    do {
      result =
        await prisma.$queryRaw`SELECT product_id, 1 - (embedding <=> ${embeddings}::vector) AS cosine_similarity, image_id FROM product_image_embeddings WHERE product_id NOT IN (${Prisma.join(
          exclusiveProductIds
        )}) ORDER BY cosine_similarity DESC LIMIT 1`;

      if (result.length > 0) {
        foundResults.push(result[0]);
        exclusiveProductIds.push(result[0].product_id);
      }
    } while (
      result.length > 0 &&
      result[0].cosine_similarity > 0.6 &&
      foundResults.length < 10
    );

    const products = [];

    for (let foundResult of foundResults) {
      const product = await prisma.product.findUnique({
        where: {
          id: foundResult.product_id,
        },
        include: commonIncludeOptionsInProduct,
      });
      products.push({ ...product, similarImageId: foundResult.image_id });
    }

    if (uploadedImagePath) {
      rm(uploadedImagePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    return products;
  }
}

module.exports = ProductService;
