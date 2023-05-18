const Roles = { ADMIN: 'admin', MANAGER: 'manager', STAFF: 'staff', CUSTOMER: 'customer', SHIPPER: 'shipper' };
const Gender = { MALE: 'male', FEMALE: 'female', OTHER: 'other' };
const BillStatus = { UNPAID: 'unpaid', PAID: 'paid' };
const OrderStates = { WAITING: 'waiting', ACCEPTED: 'accepted', SHIPPING: 'shipping', DELIVERING: 'delivering', DELIVERED: 'delivered', CANCEL: 'cancel' }
const Notify = { WARNING: '#dc3545', SUCCESS: '#28a745' }

export {
    Roles,
    Gender,
    BillStatus,
    OrderStates,
    Notify
}