import request from '~/core/utils/axios';
import cookies from 'react-cookies';


const getCategoriessService = (categories) => {
    let s = '';
    if (categories.limit) {
        s += '?limit=' + categories.limit + '';
    } else {
        s += '?limit=10';
    }
    if (categories.name && categories.name !== '') {
        s += '&name=' + categories.name + '';
    }
    if (categories.sortBy) {
        s += '&sortBy=' + categories.sortBy + '';
    }
    if (categories.sort) {
        s += '&sort=' + categories.sort + '';
    }
    if (categories.page) {
        s += '&page=' + categories.page + '';
    }


    return request.get(
        'categories' + s,
    )
}
const getCategoriesByIdService = (id) => {
    return request.get(
        'categories/' + id + '',
    )
}
const createCategoriesService = (categories, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const bodyParameters = {
        ...categories
    };

    return request.post(
        'categories',
        bodyParameters,
        config,
    )
}

const updateCategoriesService = (categories, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    let id = categories.id
    delete categories.id
    delete categories.createdAt
    delete categories.updatedAt
    delete categories.deletedAt


    const bodyParameters = {
        ...categories
    };
    return request.put(
        'categories/' + id + '',
        bodyParameters,
        config
    )
}
const deleteCategoriesService = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return request.delete(
        'categories/' + id + '',
        config,
    )
}
const getCategoryByIdService = (id) => {
    return request.get(
        'categories/' + id,
    )
}
export {
    getCategoryByIdService, createCategoriesService, getCategoriesByIdService, getCategoriessService, updateCategoriesService, deleteCategoriesService
}