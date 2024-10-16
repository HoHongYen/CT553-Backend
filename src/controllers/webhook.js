const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const CategoryService = require("../services/category");
const { formatSlugify } = require("../utils/index");
const ProductService = require("../services/product");
const { PRODUCT_TRENDING } = require("../constant/productType");
const { formatCurrency } = require("../utils/index");

class WebhookController {
    static async getAll(req, res) {

        let allCategories = await CategoryService.getAllForAdmin({
            categorySearch: "",
            isRootCategory: "all",
            limit: 100,
            page: 1,
            sortBy: null,
        });

        allCategories = allCategories.categories;

        const agent = new WebhookClient({ request: req, response: res });

        const reponseNotFound = (agent) => {
            agent.add("Xin lỗi, không tìm thấy thông tin bạn yêu cầu.");
        }

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
            console.log("agent", agent);
            console.log("agent.parameters", agent.parameters);
            try {
                const categoryName = agent.parameters.eparentcategory;
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
            } catch (error) {
                console.log("error", error);
                reponseNotFound(agent);
            }
        }

        const getProductsOfChildCategory = async (agent) => {
            try {
                // get context which has name childCategory
                // console.log("getProductsOfChildCategory", "agent.contexts", agent.contexts);
                // console.log("getProductsOfChildCategory", "agent.parameters", agent.parameters);
                // const parentCategoryName = agent.contexts.find(context => context.name === "childcategory").parameters.eCategory;
                // const parentCategorySlug = formatSlugify(parentCategoryName);
                // const parentCategory = await CategoryService.getOneBySlug(parentCategorySlug);
                // const allChildCategories = await CategoryService.getChildren(parentCategory.id);

                // const categoryTempName = agent.contexts.find(context => context.name === "childcategory").parameters['eCategory.original'];
                // const categoryName = allChildCategories.find(category => category.name.includes(categoryTempName)).name;
                let categoryName = agent.parameters.eChildCategory;
                if (!categoryName) {
                    const foundedCategory = allCategories.find(category => category.name.includes(agent.query));
                    console.log("foundedCategory", foundedCategory?.name);
                    categoryName = foundedCategory?.name;
                }
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
                                    text: "Mua ngay",
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
            } catch (error) {
                console.log("error", error);
                reponseNotFound(agent);
            }
        }

        let intentMap = new Map();
        intentMap.set("categories", getAllCategories);
        intentMap.set("childCategories", getChildCategories);
        intentMap.set("productsOfChildCategory", getProductsOfChildCategory);
        agent.handleRequest(intentMap);
    }

}

module.exports = WebhookController;
