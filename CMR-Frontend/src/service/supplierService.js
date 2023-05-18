import request from '~/core/utils/axios';

const getSuppliersService = (supplier, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    let s = '';
    if (supplier.limit) {
        s += '?limit=' + supplier.limit + '';
    } else {
        s += '?limit=10';
    }
    if (supplier.name && supplier.name !== '') {
        s += '&name=' + supplier.name + '';
    }
    if (supplier.sortBy) {
        s += '&sortBy=' + supplier.sortBy + '';
    }
    if (supplier.sort) {
        s += '&sort=' + supplier.sort + '';
    }
    if (supplier.page) {
        s += '&page=' + supplier.page + '';
    }


    return request.get(
        'suppliers' + s,
        config
    )
}

const getSupplierByIdService = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return request.get(
        'suppliers/' + id + '',
        config
    )
}
const createSupplierService = (supplier, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const bodyParameters = {
        ...supplier
    };

    return request.post(
        'suppliers',
        bodyParameters,
        config,
    )
}

const updateSupplierService = (supplier, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    let id = supplier.id
    delete supplier.id
    delete supplier.createdAt
    delete supplier.updatedAt
    delete supplier.deletedAt


    const bodyParameters = {
        ...supplier
    };
    return request.put(
        'suppliers/' + id + '',
        bodyParameters,
        config
    )
}
const deleteSupplierService = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    console.log(config)
    return request.delete(
        'suppliers/' + id + '',
        config,
    )
}
export {
    createSupplierService, getSupplierByIdService, getSuppliersService, updateSupplierService, deleteSupplierService
}