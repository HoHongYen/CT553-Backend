const { Payload } = require("dialogflow-fulfillment");
const { formatSlugify } = require("../utils/index");
const CategoryService = require("./category");
const { PRODUCT_TRENDING } = require("../constant/productType");

class WebhookService {
  static getAllCategories = async () => {
    console.log("getChildCategories", agent.parameters);
    const categories = await CategoryService.getAll();
    const categoryNames = categories.map((category) => category.name);

    const payloadData = {
      richContent: [[
        {
          type: "description",
          title: "Decorpic phân loại tranh theo các danh mục chính sau:",
          text: [`${categoryNames.join("\r\n")}`],
        },
        {
          type: "divider",
        },
        {
          type: "description",
          title: "Bạn muốn xem danh mục nào?",
        },
        {
          options: categoryNames.map((category) => {
            return {
              text: category,
            };
          }),
          type: "chips",
        },
      ]],
    };
    return payloadData;
  }

  static getChildCategories = async (agent) => {
    console.log("getChildCategories", agent.parameters);
    const slug = formatSlugify(categoryName);
    const category = await CategoryService.getOneBySlug(slug);
    const childCategories = await CategoryService.getChildren(category.id);
    const categoryNames = childCategories.map((category) => category.name);

    const payloadData = {
      richContent: [[
        {
          type: "description",
          title: `Danh mục con của ${categoryName} bao gồm:`,
          text: [`${categoryNames.join("\r\n")}`],
        },
        {
          type: "divider",
        },
        {
          type: "description",
          title: "Bạn muốn xem danh mục con nào?",
        },
        {
          options: categoryNames.map((category) => {
            return {
              text: category,
            };
          }),
          type: "chips",
        },
      ]],
    };
    return payloadData;
  }

  static getProductsOfChildCategory = async (agent) => {
    const categoryName = agent.parameters.ecategory;
    console.log("getProductsOfChildCategory", agent.parameters);
    const slug = formatSlugify(categoryName);
    const category = await CategoryService.getOneBySlug(slug);

    const products = await ProductService.getAll({
      categoryIds: [category.id],
      limit: 5,
      type: PRODUCT_TRENDING,
    });

    const payloadData = {
      richContent: [[
        {
          type: "description",
          title: `Một số sản phẩm bán chạy thuộc danh mục ${categoryName} bao gồm:`,
        },
        {
          options: products.map((product) => {
            return {
              text: product.name,
            };
          }),
          type: "chips",
        },
      ]],
    };
    return payloadData;
  }

  static getPolicies = async () => {
    const payloadData = {
      "richContent": [
        [
          {
            "type": "description",
            "title": "Để xem chính sách, vui lòng truy cập vào đường link sau:",
          },
          {
            "type": "info",
            "title": "Chính sách",
            "subtitle": "Chính sách của Decorpic",
            "image": {
              "src": {
                // "rawUrl": "https://cdn-icons-png.flaticon.com/128/1833/1833835.png"
                "rawUrl": "/logo.png"
              }
            },
            "actionLink": "http://localhost:5173/chinh-sach-thanh-toan"
          }
        ]
      ]
    };
    return payloadData;
  }
}

module.exports = WebhookService;
