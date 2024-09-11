const prisma = require("../config/prismaClient");

class CategoryService {
  static async create({ name, parentId, slug, thumbnailImageId }) {
    return await prisma.category.create({
      data: {
        name,
        parentId,
        thumbnailImageId,
        slug,
      },
    });
  }

  static async getAll() {
    return await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            parent: {
              select: {
                slug: true,
              }
            },
            thumbnailImage: true,
          },
          orderBy: {
            children: {
              _count: "desc",
            },
          },
        },
        thumbnailImage: true,
      },
    });
  }

  static async getOne(categoryId) {
    return await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: {
          include: {
            children: true,
            thumbnailImage: true,
          },
        }
      }
    });
  }

  static async getOneBySlug(slug) {
    return await prisma.category.findFirst({
      where: { slug: slug },
    });
  }

  static async getRootParent(categoryId) {
    let result = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        children: {
          include: {
            children: true,
            thumbnailImage: true,
          },
        }
      }
    });
    while (result.parentId) {
      result = await prisma.category.findUnique({
        where: {
          id: result.parentId,
        },
        include: {
          children: {
            include: {
              children: true,
              thumbnailImage: true,
            },
          },
          thumbnailImage: true,
        }
      });
    }
    return result;
  }

  static async getChildren(categoryId) {
    let category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        children: {
          include: {
            children: true,
            thumbnailImage: true,
          },
        },
        thumbnailImage: true,
      }
    });
    while (category.parentId) {
      category = await prisma.category.findUnique({
        where: {
          id: category.parentId,
        },
        include: {
          children: {
            include: {
              children: true,
              thumbnailImage: true,
            },
          },
          thumbnailImage: true,
        }
      });
    }
    let res = [];
    category.children.forEach((child) => {
      res.push(child);
    });
    return res;
  }

  static async update(categoryId, updatedData) {
    return await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: updatedData,
    });
  }

  static async delete(categoryId) {
    await prisma.category.delete({ where: { id: categoryId } });
  }

  static async getCategoriesRecursivelyFromParent(parentCategoryId) {
    let result = [parentCategoryId];
    let index = 0;
    while (parentCategoryId) {
      const categoryIds = await prisma.category.findMany({
        where: {
          parentId: parentCategoryId,
        },
        select: {
          id: true,
        },
      });

      categoryIds.forEach((category) => result.push(category.id));
      parentCategoryId = result[index++];
    }
    return result;
  }

  static async getBreadcrumbFromSubCategory(subCategoryId) {
    const subCategory = await prisma.category.findUnique({
      where: { id: subCategoryId },
    });

    const breadcrumb = [{ name: subCategory.name, slug: subCategory.slug }];

    let parentCategoryId = subCategory.parentId;
    while (parentCategoryId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentCategoryId },
      });
      breadcrumb.unshift({
        name: parentCategory.name,
        slug: parentCategory.slug,
      });

      parentCategoryId = parentCategory.parentId;
    }

    return breadcrumb;
  }

  static async getBreadcrumbFromProduct(productSlug) {
    const foundProduct = await prisma.product.findUnique({
      where: { slug: productSlug },
    });

    const breadcrumb = await this.getBreadcrumbFromSubCategory(
      foundProduct.categoryId
    );

    breadcrumb.push({ name: foundProduct.name, slug: foundProduct.slug });

    return breadcrumb;
  }
}

module.exports = CategoryService;
