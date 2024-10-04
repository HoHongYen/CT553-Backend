const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const CategoryService = require("../services/category");
const { text } = require("express");

class WebhookController {

    // static async getAll(req, res) {
    //     const agent = new WebhookClient({ request: req, response: res });

    //     const test = async (agent) => {
    //         const categories = await CategoryService.getAll();
    //         const categoryNames = categories.map((category) => category.name);
    //         // agent.add("Decorpic có các danh mục sau: " + categoryNames.join(", "));
    //         agent.add(
    //             new Payload(agent.UNSPECIFIED, JSON.stringify(categoryNames), { rawPayload: true, sendAsMessage: true })
    //         );
    //     }
    //     let intentMap = new Map();
    //     intentMap.set("categories", test);
    //     agent.handleRequest(intentMap);
    // }

    static async getAll(req, res) {

        const agent = new WebhookClient({ request: req, response: res });

        const getAllCategories = async (agent) => {
            const categories = await CategoryService.getAll();
            const categoryNames = categories.map((category) => category.name);
            // agent.add("Decorpic có các danh mục sau: " + categoryNames.join(", "));

            var payloadData = {
                richContent: [
                    [
                        {
                            type: "description",
                            title: "Decorpic có các danh mục sau:",
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
                    ],
                ],
            };

            agent.add(new Payload(agent.UNSPECIFIED, payloadData, { rawPayload: true, sendAsMessage: true }));

        }

        let intentMap = new Map();
        intentMap.set("categories", getAllCategories);
        // intentMap.set("categories", getAllCategoriesCustom);
        agent.handleRequest(intentMap);
    }

}

module.exports = WebhookController;
