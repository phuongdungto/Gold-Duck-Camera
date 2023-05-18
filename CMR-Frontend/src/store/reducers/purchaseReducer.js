const initState = {
    check: [],
}
const purchaseReducer = (state = initState, action) => {
    switch (action.type) {
        case "CHECKED_ID":
            return {
                ...state,
                check: action.payload,
            }
        case "CHECKOUT_ID":
            return {
                ...state,
                check: action.payload,
            }
        default:
            return state
    }
}

export default purchaseReducer