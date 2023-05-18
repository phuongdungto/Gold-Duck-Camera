let amout
if (JSON.parse(sessionStorage.getItem('amount'))) {
    amout = JSON.parse(sessionStorage.getItem('amount'))
} else {
    amout = 0
}
const initState = {
    cart: JSON.parse(sessionStorage.getItem('cart')),
    amount: amout,
    check: [],
    total: ''
}
const cartReducer = (state = initState, action) => {
    switch (action.type) {
        case "CHANGE_CART":
            return {
                ...state,
                cart: action.payload,
                amount: sessionStorage.getItem('amount')
            }
        case "CHECK_CART":
            return {
                ...state,
                check: action.payload,
            }
        case "USER_PAYMENT":
            return {
                ...state,
                total: action.payload,
            }
        case "CHANGE_AMOUNT":
            return {
                ...state,
                amount: action.payload,
            }
        default:
            return state
    }
}

export default cartReducer