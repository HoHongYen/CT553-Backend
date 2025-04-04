const { CreatedResponse, OKResponse } = require("../response/success");
const ProductService = require("../services/product");

class UploadTempDataController {
    // crawl
    static async crawl(req, res) {
        new CreatedResponse({
            metadata: await ProductService.crawl(req.body),
        }).send(res);
    }

    static async crawlMany(req, res) {
        new CreatedResponse({
            metadata: await ProductService.crawlMany({
                urls: req.body.urls,
                categorySlugs: req.body.categorySlugs
            }),
        }).send(res);
    }

    static async crawlCategory(req, res) {
        new CreatedResponse({
            metadata: await ProductService.crawlCategory({
                url: req.body.url,
                categorySlugs: req.body.categorySlugs,
                from: req.body.from,
                to: req.body.to
            }),
        }).send(res);
    }
}

module.exports = UploadTempDataController;

