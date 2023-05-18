const checkedID = (payload) => {
    return {
        type: "CHECKED_ID",
        payload: payload
    }
}
const checkoutID = (payload = null) => {
    return {
        type: "CHECKOUT_ID",
        payload: payload
    }
}
export {
    checkedID,
    checkoutID
}