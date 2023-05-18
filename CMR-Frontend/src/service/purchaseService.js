import request from '~/core/utils/axios';
import cookies from 'react-cookies';

const getPurchasesService = (purchase, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    let s = '';
    if (purchase.limit) {
        s += '?limit=' + purchase.limit + '';
    } else {
        s += '?limit=10';
    }
    if (purchase.staffId && purchase.staffId !== '') {
        s += '&staffId=' + purchase.staffId + '';
    }
    if (purchase.supplierId && purchase.supplierId !== '') {
        s += '&supplierId=' + purchase.supplierId + '';
    }
    if (purchase.sortBy) {
        s += '&sortBy=' + purchase.sortBy + '';
    }
    if (purchase.sort) {
        s += '&sort=' + purchase.sort + '';
    }
    if (purchase.page) {
        s += '&page=' + purchase.page + '';
    }


    return request.get(
        'purchase-orders' + s,
        config
    )
}

const getPurchaseByIdService = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return request.get(
        'purchase-orders/' + id + '',
        config
    )
}
const createPurchaseService = (purchase, token, details) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const bodyParameters = {
        ...purchase,
        details
    };

    return request.post(
        'purchase-orders',
        bodyParameters,
        config,
    )
}


export {
    createPurchaseService, getPurchaseByIdService, getPurchasesService
}