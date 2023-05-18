import React, { useState, useEffect } from 'react';
import './shippernew.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '~/components/Layout/AdminLayout/Header';
import { getBillsService, updateBillsService } from '~/service/billsService';
import cookies from 'react-cookies';
import { OrderStates } from '~/core/constant';
import { Notify } from '~/core/constant';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handelNotify } from '~/core/utils/req';

function ShipperNew() {
    const limit = 10;
    const token = cookies.load('Tokenadmin');
    const user = cookies.load('admin');
    const [bills, setBills] = useState('')
    const [pagination, SetPagination] = useState('')
    const [searchBills, setSearchBills] = useState({
        page: 1,
        limit: limit,
        sort: 'createdAt',
        sortBy: 'desc',
        numberPhone: '',
        states: [OrderStates.ACCEPTED]
    });
    const [checked, setChecked] = useState([])
    const [showAlertCf, setShowAlertCf] = useState(false);
    const getListBills = async (list) => {
        try {
            const res = await getBillsService(list, token)
            const data = (res && res.data) ? res.data : [];
            SetPagination(selectPagination(data.totalPage))

            setBills(data.bills)
        } catch (error) {
        }
    }
    const selectPagination = (page) => {
        let content = [];
        for (let i = 1; i <= page; i++) {
            content.push({
                pageNumber: i,
            });
        }

        return content
    }
    const handelChange = (i) => {
        setSearchBills({
            ...searchBills,
            page: i
        })
    }
    const handleCheck = (event) => {
        const value = JSON.parse(event.target.value)
        var updatedList = [...checked];
        if (event.target.checked) {
            updatedList = [...checked, value];
        } else {
            updatedList.splice(checked.indexOf(value), 1);
        }
        setChecked(updatedList);
    }
    const handleUpdateStates = async (action, id) => {
        try {
            let satesupdate = {
                states: OrderStates.DELIVERING,
                shipperId: user.id,
                id: id
            }
            const res = await updateBillsService(satesupdate, action, token)
            const data = res && res.data ? res.data : '';
            setSearchBills({
                ...searchBills,
                sort: 'createdAt',
                sortBy: 'desc',
                numberPhone: '',
            })
            handelNotify('success', 'Nhận đơn hàng thành công')
            setShowAlertCf({
                open: false
            })
        } catch (error) {
            handelNotify('erorr', 'Nhận đơn hàng thất bại')
        }
    }
    const hadleUpdateMuti = async (action) => {
        if (checked.length < 0) {
            handelNotify('erorr', 'Chọn đơn hàng để nhận đơn')
            return
        }
        checked.map((item, index) => {
            handleUpdateStates(action, item.id)
        })
    }
    function VND(x) {
        return x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
    useEffect(() => {
        getListBills(searchBills)
        console.log(bills)
    }, [searchBills])
    let total = 0
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div id="main" className="layout-navbar">
                <Header />
                <div id="main-content">
                    <div className="page-heading">

                        <div className="page-title">
                            <div className="row">
                                <div className="col-12 col-md-7 order-md-1 order-last">
                                    <label>
                                        <h3>Danh sách đơn hàng</h3>
                                    </label>
                                </div>

                            </div>
                        </div>
                        {bills && bills.length > 0 &&
                            bills.map((item, index) => {
                                total = 0
                                return (
                                    <>
                                        <div className="card border-success mb-3 mt-5 col-8 offset-2">
                                            <div className="card-header">
                                                <div onClick={() => handleUpdateStates('ship', item.id, OrderStates.DELIVERING)} className='btn btn-success'>
                                                    Nhận đơn
                                                </div>
                                            </div>
                                            <div className="card-body text-success row">
                                                <h5 className="card-title col-12">Tên Khách: {item.customerName}</h5>
                                                <p className="card-text col-12">{item.address}</p>
                                                <div className='col-6'>
                                                    <p className="card-text">{
                                                        item.billDetails && item.billDetails.length > 0 &&
                                                        item.billDetails.map((item1, index) => {
                                                            total += item1.price
                                                            return (
                                                                item1.count + 'x ' + item1.product.name + ' '
                                                            )
                                                        })
                                                    }</p>
                                                </div>
                                                <div className='col-6'>
                                                    <p className="card-text">Số tiền thu hộ: {VND(total)}</p>
                                                    <p className="card-text">Phí ship: {VND(item.shippingFee)}</p>
                                                </div>

                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                    </div>
                </div>
            </div >
        </>
    )
}

export default ShipperNew;