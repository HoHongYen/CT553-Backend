const { CreatedResponse, OKResponse } = require("../response/success");
const ProductService = require("../services/product");
const { tranhPhongKhach } = require("../services/uploadTempData/productsData");

class UploadTempDataController {
    // crawl
    static async crawl(req, res) {
        new CreatedResponse({
            metadata: await ProductService.crawl(req.body),
        }).send(res);
    }

    static async crawlMany(req, res) {
        new CreatedResponse({
            metadata: await ProductService.crawlMany("tranh-phong-khach"),
        }).send(res);
    }

    static async crawlCategory(req, res) {
        new CreatedResponse({
            metadata: await ProductService.crawlCategory({
                url: req.body.url,
                categorySlugs: req.body.categorySlugs
            }),
        }).send(res);
    }
}

module.exports = UploadTempDataController;

