import request from '~/core/utils/axios';
import cookies from 'react-cookies';

const token = cookies.load('Tokenadmin')

const ChangePasswordUserService = (user, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const bodyParameters = {
        ...user
    };

    return request.put(
        'users/me/password',
        bodyParameters,
        config,
    )
}
const ChangePasswordAdminService = (user, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const bodyParameters = {
        ...user
    };

    return request.put(
        'users/me/password',
        bodyParameters,
        config
    )
}
const getUsersService = (users, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    let s = '';
    if (users.locked && users.locked !== '') {
        s += '/' + users.locked + '';
    }
    if (users.limit) {
        s += '?limit=' + users.limit + '';
    } else {
        s += '?limit=10';
    }
    if (users.fullname && users.fullname !== '') {
        s += '&fullname=' + users.fullname + '';
    }
    if (users.gender && users.gender !== '') {
        s += '&gender=' + users.gender + '';
    }
    if (users.address && users.address !== '') {
        s += '&address=' + users.address + '';
    }
    if (users.page) {
        s += '&page=' + users.page + '';
    }
    if (users.sort) {
        s += '&sort=' + users.sort + '';
    }
    if (users.sortBy) {
        s += '&sortBy=' + users.sortBy + '';
    }


    return request.get(
        'users' + s + '',
        config
    )
}
const getUserbyIdService = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };


    return request.get(
        'users/' + id + '',
        config,
    )
}
const createUserService = (user, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const bodyParameters = {
        ...user
    };

    return request.post(
        'users',
        bodyParameters,
        config,
    )
}

const updateUserService = async (user, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    let id = user.id
    delete user.id
    delete user.email
    delete user.role
    delete user.createdAt
    delete user.updatedAt
    delete user.deletedAt
    delete user.verify

    const bodyParameters = {
        ...user
    };
    return await request.put(
        'users/me',
        bodyParameters,
        config
    )
}
const deleteUserService = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    console.log(config)
    return request.delete(
        'users/' + id + '',
        config,
    )
}
const unLockUserService = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return request.put(
        'users/locked/' + id, {},
        config,
    )
}
const changePositionService = (user, id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const bodyParameters = {
        ...user
    };
    return request.put(
        'users/position/' + id + '',
        bodyParameters,
        config
    )
}

export {
    ChangePasswordUserService,
    ChangePasswordAdminService,
    getUsersService,
    createUserService,
    getUserbyIdService,
    updateUserService,
    deleteUserService,
    changePositionService,
    unLockUserService,
};