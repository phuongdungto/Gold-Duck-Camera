import React, { useState, useEffect } from 'react';
import './billManager.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '~/components/Layout/AdminLayout/Header';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import cookies from 'react-cookies';
import { getBillsService, updateBillsService } from '~/service/billsService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashCan, faScrewdriverWrench, faCalendar, faSearch, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import Nav from 'react-bootstrap/Nav';
import { OrderStates } from '~/core/constant';
import { handelNotify } from '~/core/utils/req';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Notify } from '~/core/constant';

function BillManager() {
    const limit = 10;
    const optionsSearch = [
        { value: 'numberPhone', label: 'Số điện thoại' },
    ]

    const [search, setSearch] = useState('numberPhone')

    const handelChangeSearch = (e) => {
        const value = e.target.value
        setSearch(value);
        console.log(value)
        document.getElementById('search-product-text').value = '';
        setSearchBills({
            page: 1,
            limit: limit,
            sort: 'createdAt',
            sortBy: 'desc',
            numberPhone: '',
        });
    }
    const handelBillsSearch = (e) => {

        const value = e.target.value
        let tmp = search
        console.log(value)
        setSearchBills({
            [tmp]: value,
            limit: limit,
            page: 1,
            sort: 'createdAt',
            sortBy: 'desc',
        });

    }

    const token = cookies.load('Tokenadmin');
    const [showRepair, setShowRepair] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [searchBills, setSearchBills] = useState({
        page: 1,
        limit: limit,
        sort: 'createdAt',
        sortBy: 'desc',
        numberPhone: '',
        states: [OrderStates.WAITING]
    });
    const [showAlertCf, setShowAlertCf] = useState(false);
    const [states, setStates] = useState(OrderStates.WAITING);
    const [billsDetail, setBillsDetail] = useState(-1);
    const [bills, setBills] = useState('')
    const [pagination, SetPagination] = useState('')
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
    const handleshowDetail = (id) => {
        // console.log(id)
        if (id === billsDetail) {
            setBillsDetail(-1)
        }
        else {
            setBillsDetail(id)
        }
    }
    const handleOnclickState = (states) => {
        setBillsDetail(-1)
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
        setStates(states)
    }

    function VND(x) {
        return x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
    const handleAccept = async (action, bill) => {
        if (action == 'accepted') {
            let s
            if (states === OrderStates.WAITING) {
                s = OrderStates.ACCEPTED;
            }
            if (states === OrderStates.ACCEPTED) {
                s = OrderStates.SHIPPING
            }
            const state = {
                states: s,
                id: bill
            }
            console.log(states)
            try {
                const res = await updateBillsService(state, 'accept', token)
                const data = res && res.data ? res.data : '';
                setSearchBills({
                    ...searchBills,
                    sort: '',
                    sortBy: '',
                    numberPhone: '',
                })
                handelNotify('success', 'Xác nhận đơn hàng thành công')
                setShowAlertCf({
                    open: false
                })
            } catch (error) {
                handelNotify('erorr', 'Xác nhận đơn hàng thất bại')
            }
        }
    }
    const showCf = (action, bill) => {
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có muốn xác nhận đơn hàng này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleAccept(action, bill)
        })
    }
    const showdeleCf = (action, bill) => {
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có muốn huỷ đơn hàng này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleCancel(action, bill)
        })
    }
    const handleCancel = async (action, bill) => {
        if (action == 'accepted') {
            const state = {
                states: OrderStates.CANCEL,
                id: bill
            }
            console.log(states)
            try {
                const res = await updateBillsService(state, 'accept', token)
                const data = res && res.data ? res.data : '';
                setSearchBills({
                    ...searchBills,
                    sort: '',
                    sortBy: '',
                    numberPhone: '',
                })
                handelNotify('success', 'Huỷ đơn hàng thành công')
                setShowAlertCf({
                    open: false
                })
            } catch (error) {
                handelNotify('erorr', 'Hủy đơn hàng thất bại')
            }
        }
    }
    let price = 0, total = 0
    useEffect(() => {
        getListBills(searchBills)
    }, [searchBills])
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
            <Modal
                show={showAlertCf.open}
                onHide={() => setShowAlertCf({ open: false })}
                backdrop={showAlertCf.backdrop}
                keyboard={false}
            >
                <Modal.Header style={{ backgroundColor: showAlertCf.variant }} closeButton>
                    <Modal.Title>{showAlertCf.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showAlertCf.text}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowAlertCf({ open: false })}
                    >
                        Hủy
                    </Button>
                    <Button onClick={showAlertCf.onClick} variant="primary">OK</Button>
                </Modal.Footer>
            </Modal>
            <div id="main" className="layout-navbar">
                <Header />
                <div id="main-content">
                    <div className="page-heading">
                        <div className="page-title">
                            <div className="row">
                                <div className='col-11'>
                                    <h6>Tìm Kiếm</h6>
                                    <div id="search-bill-form" name="search-bill-form">
                                        <div className="form-group position-relative has-icon-right row">
                                            <div className="form-group position-relative has-icon-right col-9">
                                                <input onChange={handelBillsSearch} id="search-product-text" type="text" className="form-control" placeholder="Tìm kiếm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-12 col-md-7 order-md-1 order-last">
                                <label>
                                    <h3>Danh sách hóa đơn</h3>
                                </label>
                                <label>
                                    <h5 style={{ marginLeft: '50px', marginRight: '10px' }}> Lọc Theo:</h5>
                                </label>
                                <select onChange={handelChangeSearch} className="btn btn btn-primary" name="search-cbb" id="cars-search">
                                    {
                                        optionsSearch && optionsSearch.length > 0 &&
                                        optionsSearch.map(item => {
                                            return (
                                                <option value={item.value}>{item.label}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="row">
                                <div className='row mb-2'>
                                    <Nav justify variant="tabs" defaultActiveKey="/home">
                                        <Nav.Item>
                                            <Nav.Link active={states && states === OrderStates.WAITING ? true : false} onClick={() => handleOnclickState(OrderStates.WAITING)} eventKey="link-2">Chờ xác nhận</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link onClick={() => handleOnclickState(OrderStates.ACCEPTED)} eventKey="link-3">Chờ lấy hàng</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link onClick={() => handleOnclickState(OrderStates.DELIVERING)} eventKey="link-4">
                                                Đang giao
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link onClick={() => handleOnclickState(OrderStates.DELIVERED)} eventKey="link-5">
                                                Đã giao
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link onClick={() => handleOnclickState(OrderStates.CANCEL)} eventKey="link-6">
                                                Đã hủy
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>

                                </div>
                            </div>

                        </div>
                        <section className="section">
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table mb-0 table-danger tabelBill" id="table1">
                                            <thead>
                                                <tr>
                                                    <th width="5%">ID</th>
                                                    <th width="15%">Tên khách hàng</th>
                                                    <th width="35%">Địa chỉ</th>
                                                    <th width="15%">Số điện thoại</th>
                                                    {states === 'waiting'
                                                        ? <th width="25%">Xác nhận</th>
                                                        : ''
                                                    }
                                                    {states === 'all' ?
                                                        <th width="25%">Trạng thái</th>
                                                        : ''
                                                    }
                                                    <th width="5%">Chi tiết</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    bills && bills.length > 0 &&
                                                    bills.map((item, index) => {
                                                        total = 0
                                                        let s = 'table-info';
                                                        if ((bills.indexOf(index) + 1) % 2 !== 0) {
                                                            s = 'table-light';
                                                        } return (
                                                            <>
                                                                <tr className={s}>
                                                                    <td>{item.id}</td>
                                                                    <td className='text-break'>{item.customerName}</td>
                                                                    <td className='text-break'>{item.address}</td>
                                                                    <td className='text-break'>{item.numberPhone}</td>
                                                                    {states === 'all' ?
                                                                        <td className='text-break'>{item.states}</td>
                                                                        : ''
                                                                    }
                                                                    {states === 'waiting' ? (
                                                                        <td className='text-break'>
                                                                            <button onClick={() => showCf('accepted', item.id)} type="button" class="btn btn-success">Xác nhận</button>
                                                                            <span>  </span><button onClick={() => showdeleCf('accepted', item.id)} type="button" class="btn btn-danger ">Hủy</button>
                                                                        </td>
                                                                    )
                                                                        : ''
                                                                    }
                                                                    <td className='text-break'>
                                                                        <button onClick={e => handleshowDetail(item.id)}><FontAwesomeIcon icon={faEye} className='fa-icon pr-2' /></button>
                                                                    </td>
                                                                </tr>
                                                                <tr className={billsDetail === item.id ? 'table-light' : 'table-light showdetail'}>
                                                                    <td colspan={6}>
                                                                        <div className='container'>

                                                                            {item.billDetails.length > 0 && item.billDetails.map((item1, index1) => {
                                                                                total += item1.price;
                                                                                return (
                                                                                    <>
                                                                                        <aside className="col-lg-12">
                                                                                            <div className="card rounded" >
                                                                                                <div className="">
                                                                                                    <table className="table table-borderless table-shopping-cart">
                                                                                                        <thead className="text-muted">
                                                                                                            <tr className="small">
                                                                                                                <th scope="col" width="150">Sản phẩm</th>
                                                                                                                <th scope="col" width="300"></th>
                                                                                                                <th scope="col" width="200">Số lượng</th>
                                                                                                                <th scope="col" width="200" >Đơn giá</th>
                                                                                                                <th scope="col" width="200">Tổng cộng</th>
                                                                                                            </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                            <tr>
                                                                                                                <td>
                                                                                                                    <div className="aside"><img src={process.env.REACT_APP_URL_IMG + item1.product.img1} width={'90%'} /></div>
                                                                                                                </td>
                                                                                                                <td><p className="text-break">{item1.product.name}</p></td>
                                                                                                                <td>
                                                                                                                    <div className='product-amount'>
                                                                                                                        <input type='number' readOnly value={item1.count} name='' step="1" min="1" max="999" />
                                                                                                                        <button value='1' className='amount-plus'>
                                                                                                                            +
                                                                                                                        </button>
                                                                                                                        <button value='-1' className='amount-minus'>
                                                                                                                            -
                                                                                                                        </button>
                                                                                                                    </div>
                                                                                                                </td>
                                                                                                                <td>
                                                                                                                    <div className="price-wrap"><p className="text-break">{VND(item1.product.price)} </p>

                                                                                                                        <Badge bg="danger" className='percent'></Badge>
                                                                                                                    </div>

                                                                                                                </td>
                                                                                                                <td><div className="price-wrap"><p className="text-danger fw-bold">{VND(item1.price)}</p></div></td>
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>
                                                                                        </aside>

                                                                                    </>
                                                                                )
                                                                            })
                                                                            }
                                                                            <aside className="col-lg-4">

                                                                                <div className="card rounded">
                                                                                    <div className="card-body">
                                                                                        <dl className="dlist-align row">
                                                                                            <dt>Tổng cộng: {VND(total)}</dt>
                                                                                            <dd className="text-right ml-3 "></dd>
                                                                                        </dl>
                                                                                        <dl className="dlist-align">
                                                                                            <dt>Phí ship: {VND(item.shippingFee)}</dt>
                                                                                            <dd className="text-right text-danger ml-3"></dd>
                                                                                        </dl>
                                                                                        <dl className="dlist-align">
                                                                                            <dt>Thành tiền: {VND(total + item.shippingFee)}</dt>
                                                                                            <dd className="text-right text-dark b ml-3"><strong></strong></dd>
                                                                                        </dl>
                                                                                        <hr />
                                                                                    </div>
                                                                                </div>
                                                                            </aside>
                                                                        </div>

                                                                    </td>
                                                                </tr>

                                                            </>
                                                        )

                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <nav className="mt-4">
                                            <ul id="pagination" className="pagination justify-content-center">
                                                {
                                                    pagination && pagination.length > 0 &&
                                                    pagination.map(item => {
                                                        return (<li className="page-item" active><button onClick={e => handelChange(item.pageNumber)} class="page-link">{item.pageNumber}</button></li>)
                                                    })
                                                }

                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div>
                        <Modal show={showRepair} onHide={() => setShowRepair(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Sửa thông tin hóa đơn</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>ID hóa đơn:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>% giảm giá:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Ngày thêm:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder=""
                                            autoFocus
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Ngày sửa gần nhất:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder=""
                                            autoFocus
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowRepair(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={() => setShowRepair(false)}>
                                    Sửa
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <div>
                        <Modal show={showDetail} onHide={() => setShowDetail(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Thông tin chi tiết hóa đơn</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>ID hóa đơn:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>% giảm giá:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Ngày bắt đầu:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder=""
                                            autoFocus
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Ngày kết thúc:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder=""
                                            autoFocus
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Ngày thêm:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder=""
                                            autoFocus
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Ngày sửa gần nhất:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder=""
                                            autoFocus
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowDetail(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={() => setShowDetail(false)}>
                                    Sửa
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div >
        </>
    )
}

export default BillManager;