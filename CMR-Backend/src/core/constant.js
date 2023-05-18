const Roles = { ADMIN: 'admin', MANAGER: 'manager', STAFF: 'staff', CUSTOMER: 'customer', SHIPPER: 'shipper' };
const Gender = { MALE: 'male', FEMALE: 'female', OTHER: 'other' };
const BillStatus = { UNPAID: 'unpaid', PAID: 'paid' };
const TokenType = { FORGOT_PASSWORD: 'forgot_password', SIGNUP: 'signup' };
const OrderStates = { WAITING: 'waiting', ACCEPTED: 'accepted', SHIPPING: 'shipping', DELIVERING: 'delivering', DELIVERED: 'delivered', CANCEL: 'cancel' };
const ANONYMOUS_USER = 'Anonymous'
module.exports = {
    Roles,
    Gender,
    BillStatus,
    TokenType,
    OrderStates,
    ANONYMOUS_USER
}

