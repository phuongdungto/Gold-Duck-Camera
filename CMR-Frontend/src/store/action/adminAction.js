const adminLogin = (payload) => {
    return {
        type: "ADMIN_LOGIN",
        payload: payload
    }
}
const adminLogout = (payload = null) => {
    return {
        type: "ADMIN_LOGOUT",
        payload: payload
    }
}
export {
    adminLogin,
    adminLogout
}