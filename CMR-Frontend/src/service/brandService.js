import request from '~/core/utils/axios';
import cookies from 'react-cookies';


const getBrandService = (brand) => {
    return request.get(
        'brands',
    )
}
const getBrandByIdService = (id) => {
    return request.get(
        'brands/' + id,
    )
}
const getBrandsService = (brand) => {
    let s = ''
    if (brand.limit) {
        s += '?limit=' + brand.limit + '';
    } else {
        s += '?limit=10';
    }
    if (brand.name && brand.name !== '') {
        s += '&name=' + brand.name + '';
    }
    if (brand.sortBy) {
        s += '&sortBy=' + brand.sortBy + '';
    }
    if (brand.sort) {
        s += '&sort=' + brand.sort + '';
    }
    if (brand.page) {
        s += '&page=' + brand.page + '';
    }
    return request.get(
        'brands/' + s,
    )
}
const createBrandService = (brand, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const bodyParameters = {
        ...brand
    };

    return request.post(
        'brands',
        bodyParameters,
        config,
    )
}

const updateBrandService = (brand, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    let id = brand.id
    delete brand.id
    delete brand.createdAt
    delete brand.updatedAt
    delete brand.deletedAt


    const bodyParameters = {
        ...brand
    };
    return request.put(
        'brands/' + id + '',
        bodyParameters,
        config
    )
}
const deleteBrandService = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    console.log(config)
    return request.delete(
        'brands/' + id + '',
        config,
    )
}
export { getBrandService, getBrandByIdService, getBrandsService, deleteBrandService, updateBrandService, createBrandService }