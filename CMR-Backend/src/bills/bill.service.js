const db = require('../models/index');
const { BadRequest } = require('http-errors');
const { buildPagination } = require('../core/utils/paginantion.utils');
const { Op } = require("sequelize");
const { BillStatus, OrderStates } = require('../core/constant');
const { sendMail } = require('../core/utils/send-email.utils');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function createBill({ details, ...body }) {
    const bill = await db.Bill.create(body);
    if (!bill) {
        throw new BadRequest("can't create bill");
    }

    const detailsCom = details.map(detail => ({
        ...detail,
        billId: bill.id,
    }));
    const billDetails = await db.BillDetail.bulkCreate(detailsCom);
    return { bill, billDetails };
}

async function getBills(req) {
    const query = buildPagination(req);
    const { rows, count } = await db.Bill.findAndCountAll({
        ...query,
        include: db.BillDetail
    })
    return { totalPage: Math.ceil(count / req.limit), bill: rows };
}

async function getBill(id) {
    const bill = await db.Bill.findOne({
        where: { id: id },
        include: db.BillDetail
    })
    if (!bill) {
        throw new BadRequest('Bill not found')
    }
    return bill;
}

async function getHistory(req) {
    const query = buildPagination(req);
    const { rows, count } = await db.Bill.findAndCountAll({
        ...query,
        include: db.BillDetail
    })
    return { totalPage: Math.ceil(count / req.limit), bill: rows };
}

async function acceptBill(id, body) {
    const bill = await db.Bill.findOne({
        where: { id: id },
        include: db.BillDetail
    })
    if (!bill) {
        throw new BadRequest('Bill not found')
    }
    if (bill.states === body.states) {
        throw new BadRequest('states already')
    }

    if (body.states === OrderStates.DELIVERED) {
        body.status = BillStatus.PAID;
    }
    const filter = await getProductInventory(body.states, bill);
    await bill.update({ ...body })
    if (filter) {
        const arr = filter.map(detail => ({
            ...detail.dataValues
        }));
        await db.ProductInventory.bulkCreate(
            arr,
            {
                updateOnDuplicate: ["amount", "sold"]
            }
        )
    }
    const billInfo = billInformation(bill);
    const currentStates = statesMessage[body.states];

    if (bill.userId) {
        const user = await db.User.findOne({
            where: { id: bill.userId },
            attribute: ['email']
        })
        sendMail({
            email: user.email,
            subject: "Goldduck Camera - Trạng Thái Đơn Hàng",
            template: 'order-states',
            context: { currentStates, billInfo }
        }).catch(error => console.log(error));
    }
}

async function getProductInventory(states, bill) {
    const productIds = bill.BillDetails.map(detail => detail.productId);

    const productInventory = await db.ProductInventory.findAll({
        where: { inventoryId: 1, productId: { [Op.in]: productIds } }
    })

    if (states === OrderStates.SHIPPING) {
        productInventory.forEach(productInventory => {
            bill.BillDetails.forEach(BillDetail => {
                if (productInventory.productId === BillDetail.productId) {
                    productInventory.sold += BillDetail.count;
                    productInventory.amount -= BillDetail.count;
                }
            })
        });
        return productInventory;
    }
    if (states === OrderStates.CANCEL && bill.states != OrderStates.WAITING && bill.states != OrderStates.ACCEPTED) {
        productInventory.forEach(productInventory => {
            bill.BillDetails.forEach(BillDetail => {
                if (productInventory.productId === billDetails.productId) {
                    productInventory.sold -= BillDetail.count;
                    productInventory.amount += BillDetail.count;
                }
            })
        });
        return productInventory;
    }
    return null;
}

const statesMessage = {
    'accepted': 'Đơn hàng đã được xác nhận',
    'shipping': 'Đơn hàng đã giao cho đơn vị vận chuyển',
    'delivering': 'Đơn hàng đang giao đến bạn',
    'delivered': 'Đơn hàng đã được nhận',
    'cancel': 'Đơn hàng đã bị hủy'
}

function billInformation(bill) {
    return `Địa chỉ nhận hàng: 
    ${bill.customerName}, 
    (+84)${bill.numberPhone.slice(1)}, 
    ${bill.address}.`
}
async function getCoordinates(address) {
    const apikey = process.env.API_KEY
    address = encodeURI(address)
    const config = {
        method: 'get',
        url: `https://us1.locationiq.com/v1/search?key=${apikey}&q=${address}&format=json`,
        headers: {}
    };
    const { lon, lat } = await (await axios(config)).data[0];
    return { lon, lat };
}
async function getShippingFee(value) {
    const inventory = await db.Inventory.findOne({
        where: { id: 1 }
    });
    const coordinates = await Promise.all([getCoordinates(value), getCoordinates(inventory.address)]);
    const R = 6378; // Radius of the earth in km
    const lon1 = deg2rad(coordinates[0].lon);
    const lon2 = deg2rad(coordinates[1].lon);
    const lat1 = deg2rad(coordinates[0].lat);
    const lat2 = deg2rad(coordinates[1].lat);
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const val = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    const d = R * (2 * Math.asin(Math.sqrt(val)));
    const shipping = calculateShippingFee(d);
    return { distance: d.toFixed(2), shippingFee: shipping };
}

function deg2rad(deg) {
    return (deg / 180) * Math.PI;
}

function calculateShippingFee(distance) {
    if (distance <= 5) {
        return 15000;
    }
    if (distance <= 20) {
        return (distance + 10) * 1000;
    }
    return 40000;
}

module.exports = {
    createBill,
    getBills,
    getBill,
    getHistory,
    acceptBill,
    getShippingFee,
    getCoordinates
}