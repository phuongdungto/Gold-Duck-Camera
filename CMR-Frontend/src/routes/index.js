import Home from '~/pages/Home';
import Login from '~/pages/auth/login/login';
import Signup from '~/pages/auth/signup/signup';
import Forgotpassword from '~/pages/auth/forgotaccount/forgotPassword';
import changePassword from '~/pages/auth/forgotaccount/changePassowrd'
import productDetail from '~/pages/product/productDetail';
import loginAdmin from '~/admin/Login';
import userAdmin from '~/admin/UserAdmin';
import cart from '~/pages/cart/cart';
import UserProfile from '~/pages/userprofile/userprofile';
import { AdminLayout, ManagerLayout } from '~/components/Layout';
import BillManager from '~/manager/BillManager';
import BrandManager from '~/manager/BrandManager';
import CategoriesManager from '~/manager/CategoriesManager';
import InventoriesManager from '~/manager/InventoriesManager';
import LoginManager from '~/manager/Login';
import ProductManager from '~/manager/ProductManager';
import PurchaseorderManager from '~/manager/PurchaseOrderManager';
import SalecodeManager from '~/manager/SaleCodeManager';
import SupplierManager from '~/manager/SupplierManager';
import StatisticManager from '~/manager/StatisticManager';
import Shipper from '~/manager/Shipper';
import ShipperNew from '~/manager/ShipperNew';
import RolesAdmin from '~/admin/RolesAdmin'
import Payment from '~/pages/payment/payment';
import ProductBody from '~/pages/product/productbody';
import Contact from '~/pages/contact/contact';
import Guarantee from '~/pages/guarantee/guarantee';
import cookies from 'react-cookies';
import RequestOTP from '~/pages/auth/signup/requestOTP';
import Error404 from '~/pages/404/B404';
import UserManager from '~/manager/UserManager';
import HistoryOder from '~/pages/historyoder/historyoder';


const publicRoutes = [
    { path: '/', component: Home },
    { path: '/Home', component: Home },
    { path: '/Payment', component: Payment },
    { path: '/Cart', component: cart },
    { path: '/admin/login', component: loginAdmin, layout: null },
    { path: '/admin/*', component: loginAdmin, layout: null },
    { path: '/product/:id', component: productDetail },
    { path: '/camera', component: ProductBody },
    { path: '/videocam', component: ProductBody },
    { path: '/accessory', component: ProductBody },
    { path: '/contact', component: Contact },
    { path: '/guarantee', component: Guarantee },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/forgotpassword', component: Forgotpassword },
    { path: '/password-reset/:uid/:token', component: changePassword },
    { path: '/signup/otp/:emailurl', component: RequestOTP },
    { path: '/productdetail', component: productDetail },
    { path: '*', component: Error404, layout: null },
]

const privateRoutesA = [
    { path: '/admin/user', component: userAdmin, layout: AdminLayout },
    { path: '/admin/role', component: RolesAdmin, layout: AdminLayout },
    { path: '/admin/*', component: userAdmin, layout: AdminLayout },
    { path: '/store/*', component: userAdmin, layout: AdminLayout },
    { path: '/admin/login', component: loginAdmin, layout: null },
]

const privateRoutesM = [
    { path: '/store/bill', component: BillManager, layout: ManagerLayout },
    { path: '/store/brand', component: BrandManager, layout: ManagerLayout },
    { path: '/store/categories', component: CategoriesManager, layout: ManagerLayout },
    { path: '/store/product', component: ProductManager, layout: ManagerLayout },
    { path: '/store/purchase', component: PurchaseorderManager, layout: ManagerLayout },
    { path: '/store/salecode', component: SalecodeManager, layout: ManagerLayout },
    { path: '/store/supplier', component: SupplierManager, layout: ManagerLayout },
    { path: '/store/shipper', component: Shipper, layout: ManagerLayout },
    { path: '/store/shippernew', component: ShipperNew, layout: ManagerLayout },
    { path: '/store/user', component: UserManager, layout: ManagerLayout },
    { path: '/store/*', component: UserManager, layout: ManagerLayout },
    { path: '/admin/*', component: UserManager, layout: ManagerLayout },
    { path: '/admin/login', component: loginAdmin, layout: null },
]

const privateRoutesSt = [
    { path: '/store/bill', component: BillManager, layout: ManagerLayout },
    { path: '/store/brand', component: BrandManager, layout: ManagerLayout },
    { path: '/store/categories', component: CategoriesManager, layout: ManagerLayout },
    { path: '/store/product', component: ProductManager, layout: ManagerLayout },
    { path: '/store/purchase', component: PurchaseorderManager, layout: ManagerLayout },
    { path: '/store/salecode', component: SalecodeManager, layout: ManagerLayout },
    { path: '/store/supplier', component: SupplierManager, layout: ManagerLayout },
    { path: '/store/*', component: ProductManager, layout: ManagerLayout },
    { path: '/admin/*', component: ProductManager, layout: ManagerLayout },
    { path: '/admin/login', component: loginAdmin, layout: null },
]

const privateRoutesSh = [
    { path: '/store/shipper', component: Shipper, layout: ManagerLayout },
    { path: '/store/shippernew', component: ShipperNew, layout: ManagerLayout },
    { path: '/store/*', component: ShipperNew, layout: ManagerLayout },
    { path: '/admin/*', component: ShipperNew, layout: ManagerLayout },
    { path: '/admin/login', component: loginAdmin, layout: null },
]

const privateRoutesU = [
    { path: '/', component: Home },
    { path: '/Home', component: Home },
    { path: '/Profile', component: UserProfile },
    { path: '/productdetail', component: productDetail },
    { path: '/Payment', component: Payment },
    { path: '/Cart', component: cart },
    { path: '/product/:id', component: productDetail },
    { path: '/camera', component: ProductBody },
    { path: '/videocam', component: ProductBody },
    { path: '/accessory', component: ProductBody },
    { path: '/contact', component: Contact },
    { path: '/guarantee', component: Guarantee },
    { path: '/history', component: HistoryOder },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/forgotpassword', component: Forgotpassword },
    { path: '/password-reset/:uid/:token', component: changePassword },
    { path: '/signup/otp/:emailurl', component: RequestOTP },
    { path: '*', component: Error404, layout: null },
]

const publicRoutesU = [
    { path: '/admin/login', component: loginAdmin, layout: null },
    { path: '/admin/*', component: loginAdmin, layout: null },
]
const publicRoutesMASS = [
    { path: '/', component: Home },
    { path: '/Home', component: Home },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/forgotpassword', component: Forgotpassword },
    { path: '/password-reset/:uid/:token', component: changePassword },
    { path: '/Payment', component: Payment },
    { path: '/Cart', component: cart },
    { path: '/product/:id', component: productDetail },
    { path: '/camera', component: ProductBody },
    { path: '/videocam', component: ProductBody },
    { path: '/accessory', component: ProductBody },
    { path: '/contact', component: Contact },
    { path: '/guarantee', component: Guarantee },
    { path: '/signup/otp/:emailurl', component: RequestOTP },
    { path: '/productdetail', component: productDetail },
    { path: '/admin/login', component: loginAdmin, layout: null },
    { path: '*', component: Error404, layout: null },
]
const xulyRoutes = () => {
    if (cookies.load('admin') && cookies.load('user')) {
        if (cookies.load('admin').role === 'admin') {
            const tmp = [];
            tmp.push(...privateRoutesA);
            tmp.push(...privateRoutesU);
            return tmp;
        } else if (cookies.load('admin').role === 'manager') {
            const tmp = [];
            tmp.push(...privateRoutesM);
            tmp.push(...privateRoutesU);
            return tmp;
        } else if (cookies.load('admin').role === 'staff') {
            const tmp = [];
            tmp.push(...privateRoutesSt);
            tmp.push(...privateRoutesU);
            return tmp;
        } else if (cookies.load('admin').role === 'shipper') {
            const tmp = [];
            tmp.push(...privateRoutesSh);
            tmp.push(...privateRoutesU);
            return tmp;
        }
    } else if (cookies.load('admin')) {
        if (cookies.load('admin').role === 'admin') {
            const tmp = [];
            tmp.push(...privateRoutesA);
            tmp.push(...publicRoutesMASS);
            return tmp;
        } else if (cookies.load('admin').role === 'manager') {
            const tmp = [];
            tmp.push(...privateRoutesM);
            tmp.push(...publicRoutesMASS);
            return tmp;
        } else if (cookies.load('admin').role === 'staff') {
            const tmp = [];
            tmp.push(...privateRoutesSt);
            tmp.push(...publicRoutesMASS);
            return tmp;
        } else if (cookies.load('admin').role === 'shipper') {
            const tmp = [];
            tmp.push(...privateRoutesSh);
            tmp.push(...publicRoutesMASS);
            return tmp;
        }
    } else if (cookies.load('user')) {
        const tmp = [];
        tmp.push(...privateRoutesU);
        tmp.push(...publicRoutesU);
        return tmp;
    } else {
        return publicRoutes;
    }
}

const privateRoutes = () => {
    return xulyRoutes();
}

export { xulyRoutes, publicRoutes, privateRoutes };
