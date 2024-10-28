const ADMIN = "ADMIN";
const EMPLOYEE = "EMPLOYEE";
const USER = "USER";
const NOT_REGISTERED = "NOT_REGISTERED";

const ROLES = {
  1: ADMIN,
  2: EMPLOYEE,
  3: USER,
  4: NOT_REGISTERED,
};

const getRole = (roleId) => {
  return ROLES[roleId];
};

module.exports = { ADMIN, EMPLOYEE, USER, NOT_REGISTERED, getRole };
