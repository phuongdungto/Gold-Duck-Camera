import { combineReducers } from "redux";
import userReducer from "./userReducer";
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";
import adminReducer from "./adminReducer";
import salecodeReducer from "./salecodeReducer";
import purchaseReducer from "./purchaseReducer";

const mainReducer = combineReducers({
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    admin: adminReducer,
    salecode: salecodeReducer,
    purchase: purchaseReducer,
})

export default mainReducer