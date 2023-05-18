import React, { useState, useEffect } from 'react'
import './historyoder.scss'
import cookies from 'react-cookies';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { OrderStates } from '~/core/constant';
import { getBillsService, updateBillsService } from '~/service/billsService';
import moment from 'moment'
const HistoryOder = () => {
    const limit = 10
    const token = cookies.load('Token')
    const action = 'history'
    const [bills, setBills] = useState('')
    const [pagination, SetPagination] = useState('')
    const [billsDetail, setBillsDetail] = useState(-1);
    const [showDetail, setShowDetail] = useState(false);
    const [searchBills, setSearchBills] = useState({
        page: 1,
        limit: limit,
        sort: 'createdAt',
        sortBy: 'desc',
        numberPhone: '',
        states: '',
        history: action
    });
    function VND(x) {
        return x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }

    const handleshowDetail = (id) => {
        // console.log(id)
        if (id === billsDetail) {
            setBillsDetail(-1)
        }
        else {
            setBillsDetail(id)
        }
    }
    const getListBills = async (list) => {
        try {
            const res = await getBillsService(list, token)
            const data = (res && res.data) ? res.data : [];
            // SetPagination(selectPagination(data.totalPage))

            setBills(data.bills)
        } catch (error) {
        }
    }
    // const selectPagination = (page) => {
    //     let content = [];
    //     for (let i = 1; i <= page; i++) {
    //         content.push({
    //             pageNumber: i,
    //         });
    //     }

    //     return content
    // }
    // const handelChange = (i) => {
    //     setSearchBills({
    //         ...searchBills,
    //         page: i
    //     })
    // }
    const handleOnclickState = (states) => {
        let arr = []
        arr.push(states)

        if (states == 'all') {
            setSearchBills({
                ...searchBills,
                states: '',
                page: 1,
                sort: 'createdAt',
                sortBy: 'desc',
                numberPhone: '',
            })
        } else {
            setSearchBills({
                ...searchBills,
                states: arr,
                page: 1,
                sort: 'createdAt',
                sortBy: 'desc',
                numberPhone: '',
            })
        }
    }
    const statesMessage = {
        'waiting': 'Đang chờ xác nhận',
        'accepted': 'Đã xác nhận',
        'shipping': 'Đã giao cho đơn vị vận chuyển',
        'delivering': 'Đang giao',
        'delivered': 'Đã giao',
        'cancel': 'Đã hủy'
    }
    let total = 0
    useEffect(() => {
        getListBills(searchBills)
        console.log(bills)
    }, [searchBills])
    return (
        <>
            <div className="container-fluid">
                <div className='row mb-3'>
                    <div className='text-center' style={{ marginTop: "6%", paddingLeft: '25%' }}>
                        <p className='text-dark fw-bold h3'>Đơn Mua</p>
                    </div>
                    <div className='col-3 m-3'>
                        <div className='btn-shake'>
                            <img src={require('~/assets/images/history-2.jpg')}></img>
                        </div>
                        <Link to='/camera' className='btn btn-danger' style={{ width: '35%', marginTop: "5%", marginLeft: '30%' }}>
                            Mua Ngay
                        </Link>
                    </div>
                    <div className="card p-0 col-8" style={{ backgroundColor: 'rgba(255, 255, 255,0.1)' }}>
                        <div className="card-header " >
                            <div className='col-12'>
                                <div className='row' style={{ backgroundColor: '#ffc107', borderRadius: '5px' }}>
                                    <div className='col-12'>
                                        <Nav variant="tabs" defaultActiveKey="/home" className='nav nav-tabs card-header-tabs m-0'>
                                            <Nav.Item className='nav-item'>
                                                <Nav.Link active={searchBills.states === '' ? true : false} className={`text-dark fw-bold`} onClick={() => handleOnclickState('all')} eventKey="link-1">Tất cả</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link className='text-dark fw-bold' onClick={() => handleOnclickState(OrderStates.WAITING)} eventKey="link-2">Chờ xác nhận</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link className='text-dark fw-bold' onClick={() => handleOnclickState(OrderStates.ACCEPTED)} eventKey="link-3">Chờ lấy hàng</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link className='text-dark fw-bold' onClick={() => handleOnclickState(OrderStates.DELIVERING)} eventKey="link-4">
                                                    Đang giao
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link className='text-dark fw-bold' onClick={() => handleOnclickState(OrderStates.DELIVERED)} eventKey="link-5">
                                                    Đã giao
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link className='text-dark fw-bold' onClick={() => handleOnclickState(OrderStates.CANCEL)} eventKey="link-6">
                                                    Đã hủy
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>
                                    <div className='bg-white col-12' style={{ minHeight: '500px' }}>
                                        {
                                            !bills.length && <img src={require('~/assets/images/bills.png')}
                                                className="rounded mx-auto pt-5 d-block m-0" width={'200px'}>
                                            </img>
                                        }
                                        {
                                            bills && bills.length > 0 &&
                                            bills.map((item1, index) => {
                                                const day = moment(item1.createdAt).format('DD/MM/YYYY')
                                                total = 0;
                                                return (
                                                    <>
                                                        <div className="card-body">
                                                            <div className="card border-success col-12">
                                                                <div className="card-body row">
                                                                    <div className='col-4'>
                                                                        <p className="card-text">Ngày mua: {day}</p>
                                                                        <div className='text-danger text-detail' onClick={e => handleshowDetail(item1.id)} >
                                                                            {billsDetail === item1.id ? 'Thu gọn' : 'Chi tiết'}
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-6'>
                                                                        <p className="card-text">Địa chỉ: {item1.address}</p>
                                                                        <p className="card-text text-success">{statesMessage[item1.states]}</p>
                                                                    </div>
                                                                    <div className='col-2'>
                                                                        {item1.billDetails.length > 0 &&
                                                                            <img width={'65%'} src={process.env.REACT_APP_URL_IMG + item1.billDetails[0].product.img2} />}
                                                                    </div>

                                                                    <div className={billsDetail === item1.id ? '' : 'showdetail'}>
                                                                        {item1.billDetails.length > 0 && item1.billDetails.map((item1, index1) => {
                                                                            total += item1.price;
                                                                            return (
                                                                                <>
                                                                                    {total === item1.price && <hr></hr>}
                                                                                    <div className="row">
                                                                                        <div className="col-1 offset-1"><img src={process.env.REACT_APP_URL_IMG + item1.product.img1} /></div>
                                                                                        <div className='col-7'>
                                                                                            <p className="text-product-detail">{item1.product.name}
                                                                                            </p>
                                                                                            <p className="text-count-product">X{item1.count}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className="price-wrap col-2">
                                                                                            <p className="text-danger text-end">{VND(item1.price)}</p></div>
                                                                                    </div>
                                                                                    <hr></hr>
                                                                                </>
                                                                            )

                                                                        })
                                                                        }
                                                                        {total > 0 && <div className='row'>

                                                                            <div className='col-4 offset-7 text-danger text-end fw-bold'>Tổng cộng: {VND(total)}</div>
                                                                        </div>
                                                                        }

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )

                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default HistoryOder
