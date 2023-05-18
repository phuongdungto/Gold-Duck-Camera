const connectDB = require('../core/database.js');
const db = require('../models/index');
const { BadRequest } = require('http-errors');
const { buildPagination } = require('../core/utils/paginantion.utils')

async function createPurchaseOrder(body) {
    const { inventoryId, details, ...purchaseOrder } = body;

    const newPurchaseOrder = await db.PurchaseOrder.create(purchaseOrder);
    if (!newPurchaseOrder) throw new BadRequest("Can't not create Purchase-Order");

    const detailstmp = details.map(detail => (
        detail.productId
    ));
    const existedProductInventory = await db.ProductInventory.findAll({
        where: {
            productId: detailstmp,
            inventoryId: inventoryId,
        }
    })
    const arr = existedProductInventory.map(detail => ({
        ...detail.dataValues
    }))
    arr.forEach((value) => {
        details.forEach(detail => {
            if (detail.productId == +value.productId) {
                value.amount += detail.count;
            }

        })
    });
    await db.ProductInventory.bulkCreate(arr, { updateOnDuplicate: ["amount"] })

    const existedProductId = existedProductInventory.map(productInventory => (productInventory.productId));
    const notExistedProductInventory = details.filter(detail => {
        return !existedProductId.includes(detail.productId);
    });
    const newProductInventory = notExistedProductInventory.map(productInventory => ({
        amount: productInventory.count,
        inventoryId: inventoryId,
        productId: productInventory.productId
    }))
    await db.ProductInventory.bulkCreate(newProductInventory)

    const detailsCom = details.map(detail => ({
        ...detail,
        purchaseOrderId: newPurchaseOrder.id,
    }));
    const PurchaseOrderDetails = await db.PurchaseOrderDetail.bulkCreate(detailsCom);

    return existedProductInventory;

}
async function getPurchaseOrders(filters) {
    const query = buildPagination(filters);
    const { rows, count } = await db.PurchaseOrder.findAndCountAll({
        ...query,
        include: db.PurchaseOrderDetail,
    })
    return { totalPage: Math.ceil(count / filters.limit), products: rows };
}
async function getPurchaseOrder(id) {
    const purchaseOrder = await db.PurchaseOrder.findOne({
        where: { id: id }
    });
    if (!purchaseOrder) throw new BadRequest('Purhcase Order not found');

    return purchaseOrder;
}
module.exports = {
    createPurchaseOrder,
    getPurchaseOrders,
    getPurchaseOrder
}