import cookies from 'react-cookies'
const initState = {
    admin: cookies.load('admin')
}
const adminReducer = (state = initState, action) => {
    switch (action.type) {
        case "ADMIN_LOGIN":
            return {
                ...state,
                admin: action.payload
            }
        case "ADMIN_LOGOUT":
            return {
                ...state,
                admin: action.payload
            }
        default:
            return state
    }
}

export default adminReducer