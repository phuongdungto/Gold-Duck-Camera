import request from '~/core/utils/axios';
import cookies from 'react-cookies';
const token = cookies.load('Token');
const shippingService = async (address, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const bodyParameters = {
        ...address
    };
    if (token) {
        return await request.post(
            'bills/shipping',
            bodyParameters,
            config
        )
    }
    else {
        return await request.post(
            'bills/shipping',
            bodyParameters,
        )
    }

}
const paymentService = async (address, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const bodyParameters = {
        ...address
    };
    if (token) {
        return await request.post(
            'bills',
            bodyParameters,
            config
        )
    } else {
        return await request.post(
            'bills',
            bodyParameters,
        )
    }

}
export {
    shippingService,
    paymentService
}