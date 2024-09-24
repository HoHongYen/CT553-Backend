const PENDING = "Chờ thanh toán";
const SUCCESS = "Thành công";
const FAILED = "Thất bại";

const PAYMENT_STATUSES = [PENDING, SUCCESS, FAILED];

const PAYMENT_STATUS_ID_MAPPING = {
  ALL: 0,
  PENDING: 1,
  SUCCESS: 2,
  FAILED: 3,
};

module.exports = {
  PENDING,
  SUCCESS,
  FAILED,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_ID_MAPPING,
};
