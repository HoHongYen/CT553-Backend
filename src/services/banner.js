const prisma = require("../config/prismaClient");

class BannerService {

    // for client
    static async getAll() {
        let query = {
            where: {
                visible: true
            },
            include: {
                image: true,
                bannerCategory: true
            },
            orderBy: {
                priority: "asc"
            }
        };

        const banners = await prisma.banner.findMany(query);
        return banners;
    }

    // for client
    static async getBannerByBannerCategoryId(bannerCategoryId) {
        let query = {
            where: {
                bannerCategoryId: +bannerCategoryId,
                visible: true
            },
            include: {
                image: true,
                bannerCategory: true
            },
            orderBy: {
                priority: "asc"
            }
        };

        const banners = await prisma.banner.findMany(query);
        return banners;
    }

    // for admin
    static async getAllForAdmin({ bannerSearch, bannerCategoryId, limit, page, sortBy }) {
        let query = {
            include: {
                image: true,
                bannerCategory: true
            },
            take: limit,
            orderBy: {
                priority: "asc"
            }
        };

        // search 
        if (bannerSearch) {
            // if bannerSearch is a number, search by id
            if (!query.where) Object.assign(query, { where: {} });
            if (!isNaN(bannerSearch)) {
                query.where = {
                    id: {
                        equals: +bannerSearch,
                    },
                };
            } else {
                if (!query.where) Object.assign(query, { where: {} });
                query.where = {
                    name: {
                        contains: bannerSearch,
                        mode: "insensitive",
                    },
                };
            }
        }

        // sort
        if (sortBy?.field === "createdAt") {
            query.orderBy = {
                createdAt: sortBy.direction,
            };
        } else if (sortBy?.field === "name") {
            query.orderBy = {
                name: sortBy.direction,
            };
        } else if (sortBy?.field === "priority") {
            query.orderBy = {
                priority: sortBy.direction,
            };
        }

        // filter
        if (bannerCategoryId) {
            if (!query.where) Object.assign(query, { where: {} });
            query.where = {
                ...query.where,
                bannerCategoryId: +bannerCategoryId
            }
        }

        // pagination
        const count = await prisma.banner.count({
            where: query.where,
        })

        const offset = page > 1 ? (page - 1) * limit : 0;
        const totalPages = Math.ceil(count / limit);
        let banners = await prisma.banner.findMany({ ...query, skip: offset });

        return {
            banners, pagination: {
                totalBanners: count,
                totalPages
            }
        }
    }


    static async create({ imageId, bannerCategoryId, priority, name, visible }) {
        const newBanner = await prisma.banner.create({
            data: {
                imageId: +imageId,
                bannerCategoryId: +bannerCategoryId,
                priority: +priority,
                name,
                visible,
            },
        });
        return newBanner;
    }

    static async update(
        bannerId,
        { imageId, bannerCategoryId, priority, name, visible }
    ) {

        const updatedBanner = await prisma.banner.update({
            where: {
                id: +bannerId,
            },
            data: {
                imageId: +imageId,
                bannerCategoryId: +bannerCategoryId,
                priority: +priority,
                name,
                visible,
            },
        });
        return updatedBanner;
    }
}

module.exports = BannerService;
