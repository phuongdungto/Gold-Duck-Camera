const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const authRouter = require("./auth/auth.router");
const productRouter = require("./products/product.router");
const brandRouter = require("./brands/brand.router");
const categoryRouter = require("./categories/category.router");
const billRouter = require('./bills/bill.router');
const purchaseOrderRouter = require("./purchase_orders/purchase_orders.router");
const supplierRouter = require("./suppliers/suppliers.router");
const saleCodeRouter = require("./sale_codes/sale_codes.router");
const inventoryRouter = require("./inventories/inventories.router");
const userRouter = require("./users/users.router");

const passport = require('passport');
const session = require('express-session');
require('./core/middleware/passport.middleware');


const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(morgan('dev'));
app.use('/static', express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/brands', brandRouter);
app.use('/categories', categoryRouter);
app.use('/bills', billRouter);
app.use('/sale-codes', saleCodeRouter);
app.use('/purchase-orders', purchaseOrderRouter);
app.use('/inventories', inventoryRouter);
app.use('/users', userRouter);
app.use('/suppliers', supplierRouter);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, nex) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    });
});

app.listen(port, () => {
    console.log('Listening at port: ' + port);
});