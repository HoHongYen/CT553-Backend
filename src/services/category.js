const prisma = require("../config/prismaClient");

class CategoryService {
  static async create({ name, parentId, slug }) {
    return await prisma.category.create({
      data: {
        name,
        parentId,
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
            children: true,
          },
          orderBy: {
            children: {
              _count: "desc",
            },
          },
        },
      },
    });
  }

  static async getOne(categoryId) {
    return await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        children: {
          include: {
            children: true
          },
        }
      }
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
            children: true
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
              children: true
            },
          }
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
            children: true
          },
        }
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
              children: true
            },
          }
        }
      });
    }
    let res = [categoryId];
    category.children.forEach((child) => {
      res.push(child.id);
      child.children?.forEach((child2) => {
        res.push(child2.id);
      });
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

  static async getBreadcumbFromSubCategory(subCategoryId) {
    const subCategory = await prisma.category.findUnique({
      where: { id: subCategoryId },
    });

    const breadcumb = [{ name: subCategory.name, slug: subCategory.slug }];

    let parentCategoryId = subCategory.parentId;
    while (parentCategoryId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentCategoryId },
      });
      breadcumb.unshift({
        name: parentCategory.name,
        slug: parentCategory.slug,
      });

      parentCategoryId = parentCategory.parentId;
    }

    return breadcumb;
  }

  static async getBreadcumbFromProduct(productSlug) {
    const foundProduct = await prisma.product.findUnique({
      where: { slug: productSlug },
    });

    const breadcumb = await this.getBreadcumbFromSubCategory(
      foundProduct.categoryId
    );

    breadcumb.push({ name: foundProduct.name, slug: foundProduct.slug });

    return breadcumb;
  }
}

module.exports = CategoryService;
