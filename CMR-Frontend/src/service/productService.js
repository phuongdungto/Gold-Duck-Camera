import request from '~/core/utils/axios';


const getProductService = (product) => {
    return request.get(
        'products',
    )
}

const createProductService = (product, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    };
    return request.post(
        'products',
        product,
        config,
    )
}
const getProductsService = (product) => {
    let s = '';
    let sale = '';
    if (product.sale && product.sale !== '')
        sale = '/' + product.sale
    if (product.limit) {
        s += '?limit=' + product.limit + '';
    } else {
        s += '?limit=10';
    }
    if (product.name && product.name !== '') {
        s += '&name=' + product.name + '';
    }
    if (product.brandId && product.brandId !== '') {
        s += '&brandId=' + product.brandId + '';
    }
    if (product.categoryId && product.categoryId !== '') {
        s += '&categoryId=' + product.categoryId + '';
    }
    if (product.description && product.description !== '') {
        s += '&description=' + product.description + '';
    }
    if (product.sortBy) {
        s += '&sortBy=' + product.sortBy + '';
    }
    if (product.sort) {
        s += '&sort=' + product.sort + '';
    }
    if (product.page) {
        s += '&page=' + product.page + '';
    }

    console.log(s);
    return request.get(
        'products' + sale + s,
    )
}
const getProductByIdService = (id) => {

    return request.get(
        'products/' + id + '', ''

    )
}

const updateProductService = (product, id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    };
    return request.put(
        'products/' + id + '',
        product,
        config
    )
}
const deleteProductService = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    };
    return request.delete(
        'products/' + id + '',
        config,
    )
}
export {
    getProductService, createProductService, getProductByIdService, getProductsService, updateProductService, deleteProductService
}