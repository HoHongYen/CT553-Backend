const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const CategoryService = require("../services/category");
const { formatSlugify } = require("../utils/index");
const ProductService = require("../services/product");
const { PRODUCT_TRENDING } = require("../constant/productType");
const { formatCurrency } = require("../utils/index");

class WebhookController {
    static async getAll(req, res) {

        const agent = new WebhookClient({ request: req, response: res });

        const getAllCategories = async (agent) => {
            const categories = await CategoryService.getAll();
            const categoryNames = categories.map((category) => category.name);
            // agent.add("Decorpic có các danh mục sau: " + categoryNames.join(", "));

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
            agent.add(new Payload(agent.UNSPECIFIED, payloadData, { rawPayload: true, sendAsMessage: true }));
        }

        const getChildCategories = async (agent) => {
            const categoryName = agent.parameters.eCategory;
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
            agent.add(new Payload(agent.UNSPECIFIED, payloadData, { rawPayload: true, sendAsMessage: true }));
        }

        const getProductsOfChildCategory = async (agent) => {
            // get context which has name childCategory
            const parentCategoryName = agent.contexts.find(context => context.name === "childcategory").parameters.eCategory;
            const parentCategorySlug = formatSlugify(parentCategoryName);
            const parentCategory = await CategoryService.getOneBySlug(parentCategorySlug);
            const allChildCategories = await CategoryService.getChildren(parentCategory.id);

            const categoryTempName = agent.contexts.find(context => context.name === "childcategory").parameters['eCategory.original'];
            const categoryName = allChildCategories.find(category => category.name.includes(categoryTempName)).name;
            const slug = formatSlugify(categoryName);
            const category = await CategoryService.getOneBySlug(slug);

            const productsData = await ProductService.getAll({
                categoryIds: [category.id],
                limit: 5,
                type: PRODUCT_TRENDING,
            });

            const { products } = productsData;

            let payloadArrays = [[{
                type: "description",
                title: `${category.name} gồm có một số sản phẩm bán chạy sau:`,
            }]];

            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const data = [
                    {
                        type: "image",
                        rawUrl: product.thumbnailImage.path
                    },
                    {
                        type: "info",
                        title: product.name,
                        subtitle: formatCurrency(product.variants[0].price),
                        actionLink: `${process.env.FRONTEND_URL}/san-pham/${product.slug}`
                    },
                    {
                        type: "chips",
                        options: [
                            {
                                text: "Chi tiết",
                                link: `${process.env.FRONTEND_URL}/san-pham/${product.slug}`
                            },
                            {
                                text: "Thêm vào giỏ hàng",
                                link: "https://cloud.google.com/dialogflow/docs"
                            }
                        ]
                    }
                ]
                payloadArrays.push([...data]);
            };

            const payloadData = {
                richContent: [...payloadArrays],
            };
            agent.add(new Payload(agent.UNSPECIFIED, payloadData, { rawPayload: true, sendAsMessage: true }));
        }

        const getPolicies = async (agent) => {
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
            agent.add(new Payload(agent.UNSPECIFIED, payloadData, { rawPayload: true, sendAsMessage: true }));
        }

        let intentMap = new Map();
        intentMap.set("categories", getAllCategories);
        intentMap.set("childCategories", getChildCategories);
        intentMap.set("productsOfChildCategory", getProductsOfChildCategory);
        intentMap.set("policies", getPolicies);
        agent.handleRequest(intentMap);
    }

}

module.exports = WebhookController;
