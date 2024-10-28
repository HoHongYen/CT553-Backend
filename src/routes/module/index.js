const { param, body } = require("express-validator");
const ModuleController = require("../../controllers/module");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existModule, validate } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

const router = require("express").Router();

router.get("/", asyncHandler(ModuleController.getAll));

module.exports = router;
