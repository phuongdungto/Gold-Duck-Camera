import request from '~/core/utils/axios';

const getBillsService = async (bill, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    let s = '';
    if (bill.history) {
        s += '/history';
    }
    if (bill.limit) {
        s += '?limit=' + bill.limit + '';
    } else {
        s += '?limit=10';
    }
    if (bill.page) {
        s += '&page=' + bill.page + '';
    }
    if (bill.sort) {
        s += '&sort=' + bill.sort + '';
    }
    if (bill.sortBy) {
        s += '&sortBy=' + bill.sortBy + '';
    }
    if (bill.numberPhone) {
        s += '&numberPhone=' + bill.numberPhone + '';
    }
    if (bill.states) {
        bill.states.map((item, index) => {
            s += '&states[]=' + item + '';
        })
    }


    return await request.get(
        'bills' + s + '',
        config
    )
}
const updateBillsService = async (bill, action, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const id = bill.id;
    delete bill.id
    const bodyParameters = {
        ...bill
    };

    return await request.put(
        'bills/' + action + '/' + id,
        bodyParameters,
        config
    )
}
// const historySerVice = async (bill,token) =>{
//     const config = {
//         headers: { Authorization: `Bearer ${token}` }
//     };
//     const id = bill.id;
//     delete bill.id
//     const bodyParameters = {
//         ...bill
//     };

//     return await request.put(
//         'bills/' + action + '/' + id,
//         bodyParameters,
//         config
//     )
// }

export {
    getBillsService,
    updateBillsService
}