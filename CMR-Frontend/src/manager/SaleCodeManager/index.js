import React, { useState, useEffect } from 'react';
import './salecodeManager.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '~/components/Layout/AdminLayout/Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faScrewdriverWrench, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { getSalecodeService, getSalecodeByIdService, getSalecodesService, deleteSalecodeService, updateSalecodeService, createSalecodeService } from '~/service/salecodeService';

import { getProductsService } from '~/service/productService';

import { validateSalecode } from '~/core/utils/validate';
import { Notify, Gender, Roles } from '~/core/constant';
import { handleError, handelNotify } from '~/core/utils/req';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator';
import cookies from 'react-cookies'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { checkedID, checkoutID } from '~/store/action/salecodeAction';

function SalecodeManager() {
    const limit = 20;
    const optionsSearch = [
        { value: 'startDate', label: 'Ngày bắt đầu' },
        { value: 'endDate', label: 'Ngày kết thúc' },
        { value: 'percent', label: '% giảm giá' },
    ]

    const [search, setSearch] = useState('startDate')
    const [salecodeSearch, setSalecodeSearch] = useState({
        limit: limit,
        page: 1,
        sort: '',
        sortBy: ''
    })
    const handelChangeSearch = (e) => {
        const value = e.target.value
        setSearch(value);
        console.log(value)
        document.getElementById('search-product-text').value = '';
        setSalecodeSearch({
            limit: limit,
            page: 1,
            sort: '',
            sortBy: ''
        });
        if (value == 'startDate' || value == 'endDate') {
            document.getElementById('search-product-text').type = 'date';
        } else {
            document.getElementById('search-product-text').type = 'number';
        }
    }
    const handelSalecodeSearch = (e) => {
        const value = e.target.value
        let tmp = search
        setSalecodeSearch({
            [tmp]: value,
            limit: limit,
            page: 1,
            sort: '',
            sortBy: ''
        });
    }


    const navigate = useNavigate();
    const dispatch = useDispatch()
    const checkedSale = useSelector(state => state.salecode.check);
    const token = cookies.load('Tokenadmin');
    const [showAddDetails, setShowAddDetails] = useState(false);
    const [productDetails, setProductDetails] = useState();
    const [productChecked, setProductChecked] = useState([]);
    const [removeProduct, setRemoveProduct] = useState([]);
    const handleshowAddDetails = () => {
        setShowAddDetails(true)
    };
    const [searchProductDetails, setSearchProductDetails] = useState({
        page: 1,
        limit: 20,
        sort: '',
        sortBy: '',
        description: '',
        name: '',
        brandId: '',
        categoryId: '',
        saleCodeId: '',
    });
    const [paginationDetails, SetPaginationDetails] = useState('')
    const getListProductDetails = async () => {
        try {
            const res = await getProductsService(searchProductDetails);
            const data = (res && res.data) ? res.data : [];
            setProductDetails(data.products);
            SetPaginationDetails(selectPaginationDetails(data.totalPage))

        } catch {

        }
    }
    const selectPaginationDetails = (page) => {
        let content = [];
        for (let i = 1; i <= page; i++) {
            content.push({
                pageNumber: i,
            });
        }

        return content
    }
    const handelChangeDetails = (i) => {
        setSearchProductDetails({
            ...searchProductDetails,
            page: i
        })
    }
    const handleCheck = (event) => {
        const value = JSON.parse(event.target.value)
        let tmp = [...productChecked]
        if (event.target.checked) {
            tmp = [...productChecked, value]
        } else {
            tmp.splice(productChecked.indexOf(value), 1);
        }
        setProductChecked(tmp);
    }
    const handleClickCheck = () => {
        if (productChecked.length > 0) {
            dispatch(checkedID(productChecked))
            setShowAddDetails(false);
            let tmp = [...repairProductDetails]
            for (let i = 0; i < productChecked.length; i++) {
                const result = repairProductDetails.findIndex(({ id }) => id === productChecked[i].id);
                if (result != -1) tmp.splice(result, 1)
            }
            setRepairProductDetails(tmp)
        } else {
            handelNotify('warn', 'Chọn sản phẩm cần áp dụng khuyến mãi')
        }
    }

    const [showAdd, setShowAdd] = useState(false);
    const handleshowAdd = () => {
        SetAddValidate('')
        setAddSalecode({
            name: '',
            percent: 0,
            startDate: '',
            endDate: '',
        })
        setShowAdd(true)
    };

    const [showRepair, setShowRepair] = useState(false);
    const [searchSalecode, setSearchSalecode] = useState({
        page: 1,
        limit: 1,
        sort: '',
        sortBy: '',
        percent: 0,
        startDate: '',
        endDate: '',
    });
    const [pagination, SetPagination] = useState('')
    const getListSalecode = async (list) => {
        try {
            console.log(salecodeSearch)
            const res = await getSalecodesService(list, token);
            const data = (res && res.data) ? res.data : [];
            setSalecode(data.saleCodes);
            SetPagination(selectPagination(data.totalPage))
        } catch {

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
        setSalecodeSearch({
            ...salecodeSearch,
            page: i
        })
    }

    useEffect(() => {
        getListSalecode(salecodeSearch);
        getListProductDetails();
    }, [salecodeSearch], [searchProductDetails])
    const [sale_code, setSalecode] = useState();
    const [addSalecode, setAddSalecode] = useState({
        name: '',
        percent: 0,
        startDate: '',
        endDate: '',
    });
    const [addValidate, SetAddValidate] = useState('');

    const handleChangeAddSalecode = (e) => {
        const value = e.target.value;
        setAddSalecode({
            ...addSalecode,
            [e.target.name]: value
        });
    }

    const handleClickAddSalecode = async () => {
        const isValid = validateSalecode(addSalecode);
        SetAddValidate(isValid);
        if (Object.keys(isValid).length > 0) return
        try {
            const data = await createSalecodeService(addSalecode, token);
            const req = handleError(data.request)
            setShowAdd(false);
            handelNotify('success', 'Thêm khuyến mãi thành công')
            setSalecode(prevState => [...prevState, data.data]);

        } catch (error) {
            const req = handleError(error.request)
            handelNotify('success', req)
        }

    }

    const [repairValidate, SetRepairValidate] = useState('');
    const [repairSalecode, setRepairSalecode] = useState('');
    const [showAlertCf, setShowAlertCf] = useState({
        open: false,
        valirant: '',
        text: '',
        title: '',
        backdrop: ''
    });
    const [repairSalecodeDetails, setRepairSalecodeDetails] = useState();
    const [repairProductDetails, setRepairProductDetails] = useState();
    const handleShowRepair = async (e) => {
        SetRepairValidate('')
        try {
            let data = await getSalecodeByIdService(e, token)
            setRepairSalecode(data.data)
            let tmp = [...productDetails]
            let tmp1 = [...productDetails]
            for (let i = 0; i < productDetails.length; i++) {
                if (productDetails[i].saleCodeId == e) {
                    tmp1.splice(tmp1.indexOf(productDetails[i]), 1)
                } else if (productDetails[i].saleCodeId != e && productDetails[i].saleCodeId != null) {
                    tmp1.splice(tmp1.indexOf(productDetails[i]), 1)
                    tmp.splice(tmp.indexOf(productDetails[i]), 1)
                } else if (productDetails[i].saleCodeId != e) {
                    tmp.splice(tmp.indexOf(productDetails[i]), 1)
                }
            }

            setRepairSalecodeDetails(tmp)
            setRepairProductDetails(tmp1)
            setRemoveProduct([])
            dispatch(checkoutID([]))
        } catch (error) {

        }
        setShowRepair(true)
    }

    const handleChangeRepairSalecode = e => {
        const value = e.target.value
        setRepairSalecode({
            ...repairSalecode,
            [e.target.name]: value
        });

    }

    const handleShowCfRepairSalecode = (e) => {
        const isValid = validateSalecode(repairSalecode)
        SetRepairValidate(isValid)
        if (Object.keys(isValid).length > 0) return
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có chắc chắn muốn sửa khuyến mãi này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleClickRepairSalecode(e)
        })
    }
    const handleClickRepairSalecode = async (sale_code) => {
        try {
            let tmp = [];
            for (let i = 0; i < checkedSale.length; i++) {
                tmp.push(checkedSale[i].id)
            }

            const data = await updateSalecodeService(repairSalecode, token, tmp, removeProduct)
            const req = handleError(data.request)
            setShowRepair(false)
            setShowAlertCf({
                open: false
            })
            handelNotify('success', 'Sửa khuyến mãi ' + req)
            setSalecode(prevState => {
                const newState = prevState.map(obj => {
                    if (obj.id === sale_code) {
                        return {
                            ...obj,
                            name: repairSalecode.name,
                            percent: repairSalecode.percent,
                            startDate: repairSalecode.startDate,
                            endDate: repairSalecode.endDate,
                        };
                    }
                    return obj;
                });

                return newState;
            });
            setSearchProductDetails({
                page: 1,
                limit: 20,
                sort: '',
                sortBy: '',
                description: '',
                name: '',
                brandId: '',
                categoryId: '',
                saleCodeId: '',
            });
        } catch (e) {
            const req = handleError(e.request);
            setShowAlertCf({
                open: false
            })
            handelNotify('error', req)
        }
    }
    const handleShowCfDelete = (e) => {
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có chắc chắn muốn xóa khuyến mãi này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleDelete(e)
        })
    }
    const handleDelete = async (sale_code) => {
        try {
            const data = await deleteSalecodeService(sale_code, token)
            setShowAlertCf({
                open: false
            })
            setSalecodeSearch({
                ...salecodeSearch,
                sort: '',
                sortBy: '',
                name: '',
                percent: 0,
                startDate: '',
                endDate: '',
            })
            const req = handleError(data.request)
            handelNotify('success', 'Xóa khuyến mãi ' + req)
        } catch (error) {
            const req = handleError(error.request)
            setShowAlertCf({
                open: false
            })
            handelNotify('error', req)
        }
    }
    const handleShowCfDeleteDetails = (e) => {
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có chắc chắn muốn xóa sản phẩm đang áp dụng khuyến mãi này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleDeleteDetails(e)
        })
    }
    const handleDeleteDetails = async (details) => {
        try {
            let detail = JSON.parse(details)
            setShowAlertCf({
                open: false
            })
            let tmp = [...repairSalecodeDetails]
            const result = repairSalecodeDetails.findIndex(({ id }) => id === detail.id);
            if (result != -1) {
                tmp.splice(result, 1)
                let remove = [...removeProduct]
                remove = [...removeProduct, detail.id]
                setRemoveProduct(remove)
            }
            if (checkedSale.length > 0) {
                const result1 = checkedSale.findIndex(({ id }) => id === detail.id);
                if (result1 != -1)
                    checkedSale.splice(result1, 1)
            }
            setRepairSalecodeDetails(tmp)
            handelNotify('success', 'Xóa khuyến mãi thành công')
        } catch (error) {

        }
    }
    return (
        <>
            {/* Modal Thông báo */}
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
            {/* Modal Xác nhận */}
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
                    <Button variant="secondary" onClick={() => setShowAlertCf({ open: false })}>
                        Hủy
                    </Button>
                    <Button onClick={showAlertCf.onClick} variant="primary">OK</Button>
                </Modal.Footer>
            </Modal>
            <div id="main" className="layout-navbar">
                <Header />
                <div id="main-content">
                    <div className="page-heading">
                        <div className="col-sm-6">
                            <h6>Tìm Kiếm</h6>
                            <div id="search-salecode-form" name="search-salecode-form">
                                <div className="form-group position-relative has-icon-right">
                                    <div className="form-group position-relative has-icon-right col-9">
                                        <input onChange={handelSalecodeSearch} id="search-product-text" type="date" className="form-control" placeholder="Tìm kiếm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="page-title">
                            <div className="row">
                                <div className="col-12 col-md-7 order-md-1 order-last">
                                    <label>
                                        <h3>Danh sách khuyến mãi</h3>
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
                                <div className="col-12 col-md-5 order-md-2 order-first">

                                    <div className=" loat-start float-lg-end mb-3">

                                        <button id='btn-createsalecode' className="btn btn-primary" onClick={handleshowAdd}>
                                            <i className="bi bi-plus"></i> Thêm khuyến mãi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <section className="section">
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table mb-0 table-danger" id="table1">
                                            <thead>
                                                <tr>
                                                    <th>Chọn</th>
                                                    <th>Tên chương trình</th>
                                                    <th>% giảm giá</th>
                                                    <th>Ngày bắt đầu</th>
                                                    <th>Ngày kết thúc</th>
                                                    <th>Tác vụ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    sale_code && sale_code.length > 0 &&
                                                    sale_code.map(item => {
                                                        let s = 'table-info';
                                                        if ((sale_code.indexOf(item) + 1) % 2 !== 0) {
                                                            s = 'table-light';
                                                        } return (
                                                            <tr className={s}>
                                                                <td>{item.id}</td>
                                                                <td className='text-break'>{item.name}</td>
                                                                <td className='text-break'>{item.percent}</td>
                                                                <td className='text-break'>{new Date(item.startDate).toLocaleDateString()}</td>
                                                                <td className='text-break'>{new Date(item.endDate).toLocaleDateString()}</td>
                                                                <td className='text-break'>
                                                                    <pre>
                                                                        <button onClick={e => handleShowRepair(item.id)}><FontAwesomeIcon icon={faScrewdriverWrench} className='fa-icon' /></button><span>  </span>
                                                                        <button onClick={e => handleShowCfDelete(item.id)}><FontAwesomeIcon icon={faTrash} className='fa-icon' /></button>
                                                                    </pre>
                                                                </td>
                                                            </tr>
                                                        )

                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <nav className="mt-5">
                                            <ul id="pagination" className="pagination justify-content-center">
                                                {
                                                    pagination && pagination.length > 0 &&
                                                    pagination.map(item => {
                                                        return (<li class="page-item" active><button onClick={e => handelChange(item.pageNumber)} class="page-link">{item.pageNumber}</button></li>)
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
                        <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Thêm khuyến mãi</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên chương trình:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='name'
                                            onChange={handleChangeAddSalecode}
                                        />
                                        {addValidate.name && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.name}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>% giảm giá:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="0"
                                            autoFocus
                                            name='percent'
                                            onChange={handleChangeAddSalecode}
                                        />
                                        {addValidate.percent && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.percent}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Ngày bắt đầu:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder=""
                                            autoFocus
                                            name='startDate'
                                            onChange={handleChangeAddSalecode}
                                        />
                                        {addValidate.startDate && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.startDate}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Ngày kết thúc:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder=""
                                            autoFocus
                                            name='endDate'
                                            onChange={handleChangeAddSalecode}
                                        />
                                        {addValidate.endDate && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.endDate}</p>}
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowAdd(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={handleClickAddSalecode}>
                                    Thêm
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <div>
                        <Modal show={showRepair} onHide={() => setShowRepair(false)} size='lg'>
                            <Modal.Header closeButton>
                                <Modal.Title>Sửa thông tin khuyến mãi</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên chương trình:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='name'
                                            value={repairSalecode.name}
                                            onChange={handleChangeRepairSalecode}
                                        />
                                        {repairValidate.name && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.name}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>% giảm giá:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder=""
                                            autoFocus
                                            name='percent'
                                            value={repairSalecode.percent}
                                            onChange={handleChangeRepairSalecode}
                                        />
                                        {repairValidate.percent && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.percent}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Ngày bắt đầu:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder=""
                                            autoFocus
                                            name='startDate'
                                            value={new Date(repairSalecode.startDate).toLocaleDateString('en-CA')}
                                            onChange={handleChangeRepairSalecode}
                                        />
                                        {repairValidate.startDate && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.startDate}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Ngày kết thúc:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder=""
                                            autoFocus
                                            name='endDate'
                                            value={new Date(repairSalecode.endDate).toLocaleDateString('en-CA')}
                                            onChange={handleChangeRepairSalecode}
                                        />
                                        {repairValidate.endDate && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.endDate}</p>}
                                    </Form.Group>
                                </Form>
                                <hr />
                                <div className="row">
                                    <div className="col-12 col-md-7 order-md-1 order-last">
                                    </div>
                                    <div className="col-12 col-md-5 order-md-2 order-first">
                                        <div className=" loat-start float-lg-end mb-3">
                                            <button id='btn-createsalecode' className="btn btn-primary" onClick={handleshowAddDetails}>
                                                <i className="bi bi-plus"></i> Thêm sản phẩm áp dụng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table class="table mb-0 table-danger" id="tb2">
                                        <thead>
                                            <tr>
                                                <th>Mã sản phẩm</th>
                                                <th>Tác vụ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                checkedSale && checkedSale.length > 0 &&
                                                checkedSale.map(item => {
                                                    let s = 'table-info';
                                                    if ((checkedSale.indexOf(item) + 1) % 2 !== 0) {
                                                        s = 'table-light';
                                                    } return (
                                                        <tr className={s}>
                                                            <td className='text-break'>{item.id}</td>
                                                            <td className='text-break'>
                                                                <pre>
                                                                    <button onClick={e => handleShowCfDeleteDetails(JSON.stringify(item))}><FontAwesomeIcon icon={faTrash} className='fa-icon' /></button>
                                                                </pre>
                                                            </td>
                                                        </tr>
                                                    )

                                                })
                                            }
                                            {
                                                repairSalecodeDetails && repairSalecodeDetails.length > 0 &&
                                                repairSalecodeDetails.map(item => {
                                                    let s = 'table-info';
                                                    if ((repairSalecodeDetails.indexOf(item) + 1) % 2 !== 0) {
                                                        s = 'table-light';
                                                    } return (
                                                        <tr className={s}>
                                                            <td className='text-break'>{item.id}</td>
                                                            <td className='text-break'>
                                                                <pre>
                                                                    <button onClick={e => handleShowCfDeleteDetails(JSON.stringify(item))}><FontAwesomeIcon icon={faTrash} className='fa-icon' /></button>
                                                                </pre>
                                                            </td>
                                                        </tr>
                                                    )

                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <nav class="mt-5">
                                        <ul id="pagination" class="pagination justify-content-center">
                                        </ul>
                                    </nav>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowRepair(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={() => handleShowCfRepairSalecode(repairSalecode.id)}>
                                    Sửa
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div>
                        <Modal show={showAddDetails} onHide={() => setShowAddDetails(false)} size='xl'>
                            <Modal.Header closeButton>
                                <Modal.Title>Thêm sản phẩm khuyến mãi</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <section className="section">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table mb-0 table-danger" id="table1">
                                                    <thead>
                                                        <tr>
                                                            <th>Chọn</th>
                                                            <th>ID</th>
                                                            <th>Tên sản phẩm</th>
                                                            <th>Giá sản phẩm</th>
                                                            <th>Hình ảnh 1</th>
                                                            <th>Hình ảnh 2</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            repairProductDetails && repairProductDetails.length > 0 &&
                                                            repairProductDetails.map(item => {
                                                                let s = 'table-info';
                                                                if ((repairProductDetails.indexOf(item) + 1) % 2 !== 0) {
                                                                    s = 'table-light';
                                                                } return (
                                                                    <tr className={s}>
                                                                        <td>
                                                                            <div class="custom-control custom-checkbox">
                                                                                <input onChange={handleCheck} type="checkbox" class="form-check-input form-check-success form-check-glow" value={JSON.stringify(item)} />
                                                                            </div>
                                                                        </td>
                                                                        <td className='text-break'>{item.id}</td>
                                                                        <td className='text-break'>{item.name}</td>
                                                                        <td className='text-break'>{item.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                                        <td className='text-break'>
                                                                            <div className="productmanager">
                                                                                <img className="imgmanager" src={'http://localhost:1912/static/product/image/' + item.img1} alt="Canon" />
                                                                            </div>
                                                                        </td>
                                                                        <td className='text-break'>
                                                                            <div className="productmanager">
                                                                                <img className="imgmanager" src={'http://localhost:1912/static/product/image/' + item.img2} alt="Canon" />
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )

                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                                <nav className="mt-4">
                                                    <ul id="pagination" className="pagination justify-content-center">
                                                        {
                                                            paginationDetails && paginationDetails.length > 0 &&
                                                            paginationDetails.map(item => {
                                                                return (<li class="page-item" active><button onClick={e => handelChangeDetails(item.pageNumber)} class="page-link">{item.pageNumber}</button></li>)
                                                            })
                                                        }

                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowAddDetails(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={handleClickCheck}>
                                    Thêm
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                </div>
            </div >
        </>
    )
}

export default SalecodeManager;