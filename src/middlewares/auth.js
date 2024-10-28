const { Forbidden, UnAuthorized } = require("../response/error");
const { asyncHandler } = require("../middlewares/asyncHandler");
const { getRole } = require("../constant/roles");
const jwt = require("jsonwebtoken");
const PermissionService = require("../services/permission");

const permission = () => async (req, res, next) => {
  console.log("permission middleware");
  try {
    // const reqPath = req.originalUrl.replace(/\?.*$/, '');
    // console.log("req.path", reqPath);
    const baseUrl = req.baseUrl;
    const reqRoute = req.route.path;
    const fullPath = baseUrl + reqRoute;

    // const tempPath = "/api/accounts/toggleActive/:accountId";
    // console.log('Check path', fullPath === tempPath);

    // get method
    const reqMethod = req.method;

    // get roles that can access the route
    const allPermissions = await PermissionService.getAll();

    console.log("fullPath", fullPath);
    console.log("reqMethod", reqMethod);

    // console.log("allPermissions", allPermissions);

    const permission = allPermissions.find(
      (permission) => permission.api === fullPath && permission.method === reqMethod
    );

    if (!permission) throw new Forbidden("You don't have permission to perform this action");

    let permittedRoles = await PermissionService.getByPermission(permission.id);

    permittedRoles = permittedRoles.map((roleID) => getRole(roleID));

    console.log("permittedRoles", permittedRoles);
    
    if (permittedRoles.includes("NOT_REGISTERED")) {
      next();
      return;
    }

    const accountRole = req.account.role;

    console.log("accountRole", accountRole);

    if (!accountRole || !permittedRoles.includes(accountRole))
      throw new Forbidden("You don't have permission to perform this action");

    next();
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const authentication = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    req.account = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    throw new UnAuthorized("Invalid token");
  }
};

const getTokenFromRequest = (req) => {
  const requestBearer = req.headers.authorization;

  if (!requestBearer) throw new UnAuthorized("Authorization required");

  const token = requestBearer.split(" ")[1];

  if (!token) throw new UnAuthorized("Invalid token");

  return token;
};

module.exports = { authentication, permission };
