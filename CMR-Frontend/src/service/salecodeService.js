import request from '~/core/utils/axios';
import cookies from 'react-cookies';


const getSalecodeService = (sale_code, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return request.get(
        'sale-codes',
        config
    )
}
const getSalecodeByIdService = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return request.get(
        'sale-codes/' + id,
        config
    )
}
const getSalecodesService = (sale_code, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    let s = ''
    if (sale_code.limit) {
        s += '?limit=' + sale_code.limit + '';
    } else {
        s += '?limit=10';
    }
    if (sale_code.percent && sale_code.percent !== '') {
        s += '&percent=' + sale_code.percent + '';
    }
    if (sale_code.startDate && sale_code.startDate !== '') {
        s += '&startDate=' + sale_code.startDate + '';
    }
    if (sale_code.endDate && sale_code.endDate !== '') {
        s += '&endDate=' + sale_code.endDate + '';
    }
    if (sale_code.sortBy) {
        s += '&sortBy=' + sale_code.sortBy + '';
    }
    if (sale_code.sort) {
        s += '&sort=' + sale_code.sort + '';
    }
    if (sale_code.page) {
        s += '&page=' + sale_code.page + '';
    }
    return request.get(
        'sale-codes/' + s,
        config
    )
}
const createSalecodeService = (sale_code, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const bodyParameters = {
        ...sale_code
    };

    return request.post(
        'sale-codes',
        bodyParameters,
        config,
    )
}

const updateSalecodeService = (sale_code, token, newProductIds, removeProductIds) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    let id = sale_code.id
    delete sale_code.id
    delete sale_code.createdAt
    delete sale_code.updatedAt
    delete sale_code.deletedAt

    let bodyParameters;

    if (newProductIds.length <= 0) {
        if (removeProductIds.length <= 0) {
            bodyParameters = {
                ...sale_code,
            };
        } else {
            bodyParameters = {
                ...sale_code,
                removeProductIds
            };
        }
    } else {
        if (removeProductIds.length <= 0) {
            bodyParameters = {
                ...sale_code,
                newProductIds,
            };
        } else {
            bodyParameters = {
                ...sale_code,
                newProductIds,
                removeProductIds
            };
        }
    }
    return request.put(
        'sale-codes/' + id + '',
        bodyParameters,
        config
    )
}
const deleteSalecodeService = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    console.log(config)
    return request.delete(
        'sale-codes/' + id + '',
        config,
    )
}
export { getSalecodeService, getSalecodeByIdService, getSalecodesService, deleteSalecodeService, updateSalecodeService, createSalecodeService }