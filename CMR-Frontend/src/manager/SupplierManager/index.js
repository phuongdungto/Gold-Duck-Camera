import React, { useState, useEffect } from 'react';
import './supplierManager.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '~/components/Layout/AdminLayout/Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faScrewdriverWrench, faCalendar } from '@fortawesome/free-solid-svg-icons';

import { createSupplierService, getSupplierByIdService, getSuppliersService, updateSupplierService, deleteSupplierService } from '~/service/supplierService';

import { validateSupplier } from '~/core/utils/validate';
import { Notify, Gender, Roles } from '~/core/constant';
import { handleError, handelNotify } from '~/core/utils/req';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator';
import cookies from 'react-cookies'
function SupplierManager() {
    const limit = 20;
    const optionsSearch = [
        { value: 'name', label: 'Tên nhà cung cấp' },
    ]

    const [search, setSearch] = useState('name')
    const [supplierSearch, setSupplierSearch] = useState({
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
        setSupplierSearch({
            limit: limit,
            page: 1,
            sort: '',
            sortBy: ''
        });
    }
    const handelSupplierSearch = (e) => {
        const value = e.target.value
        let tmp = search
        setSupplierSearch({
            [tmp]: value,
            limit: limit,
            page: 1,
            sort: '',
            sortBy: ''
        });

    }


    const token = cookies.load('Tokenadmin')
    const [showAdd, setShowAdd] = useState(false);
    const handleshowAdd = () => {
        SetAddValidate('')
        setAddSupplier({
            name: '',
            address: '',
            numberPhone: '',
        })
        setShowAdd(true)
    };
    const [showRepair, setShowRepair] = useState(false);
    const [searchSupplier, setSearchSupplier] = useState({
        page: 1,
        limit: limit,
        sort: '',
        sortBy: '',
        name: '',
    });
    const [pagination, SetPagination] = useState('')
    const getListSupplier = async (list) => {
        try {
            const res = await getSuppliersService(list, token);
            const data = (res && res.data) ? res.data : [];
            console.log(data.suppliers)
            setSupplier(data.suppliers);
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
        setSupplierSearch({
            ...supplierSearch,
            page: i
        })
    }

    useEffect(() => {
        getListSupplier(supplierSearch);
    }, [supplierSearch])
    const [supplier, setSupplier] = useState();
    const [addSupplier, setAddSupplier] = useState({
        name: '',
        address: '',
        numberPhone: '',
    });
    const [addValidate, SetAddValidate] = useState('');

    const handleChangeAddSupplier = (e) => {
        const value = e.target.value;
        setAddSupplier({
            ...addSupplier,
            [e.target.name]: value
        });
    }

    const handleClickAddSupplier = async () => {
        const isValid = validateSupplier(addSupplier);
        SetAddValidate(isValid);
        if (Object.keys(isValid).length > 0) return
        try {
            const data = await createSupplierService(addSupplier, token);
            const req = handleError(data.request)
            setShowAdd(false);
            handelNotify('success', 'Thêm nhà cung cấp thành công')

        } catch (error) {
            const req = handleError(error.request)
            handelNotify('success', req)
        }

    }

    const [repairValidate, SetRepairValidate] = useState('');
    const [repairSupplier, setRepairSupplier] = useState('');
    const [showAlertCf, setShowAlertCf] = useState({
        open: false,
        valirant: '',
        text: '',
        title: '',
        backdrop: ''
    });
    const handleShowRepair = async (e) => {
        SetRepairValidate('')
        try {
            let data = await getSupplierByIdService(e, token)
            setRepairSupplier(data.data)
        } catch (error) {

        }
        setShowRepair(true)
    }

    const handleChangeRepairSupplier = e => {
        const value = e.target.value
        setRepairSupplier({
            ...repairSupplier,
            [e.target.name]: value
        });

    }

    const handleShowCfRepairSupplier = (e) => {
        const isValid = validateSupplier(repairSupplier)
        SetRepairValidate(isValid)
        if (Object.keys(isValid).length > 0) return
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có chắc chắn muốn sửa nhà cung cấp này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleClickRepairSupplier(e)
        })
    }
    const handleClickRepairSupplier = async (supplier) => {
        try {
            const data = await updateSupplierService(repairSupplier, token)
            const req = handleError(data.request)
            setShowRepair(false)
            setShowAlertCf({
                open: false
            })
            handelNotify('success', 'Sửa nhà cung cấp ' + req)
            setSupplier(prevState => {
                const newState = prevState.map(obj => {
                    if (obj.id === supplier) {
                        return {
                            ...obj,
                            name: repairSupplier.name,
                            address: repairSupplier.address,
                            numberPhone: repairSupplier.numberPhone,
                        };
                    }
                    console.log(repairSupplier)
                    return obj;
                });

                return newState;
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
            text: 'Bạn có chắc chắn muốn xóa nhà cung cấp này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleDelete(e)
        })
    }
    const handleDelete = async (supplier) => {
        try {
            const data = await deleteSupplierService(supplier, token)
            setShowAlertCf({
                open: false
            })
            setSupplierSearch({
                ...supplierSearch,
                sort: '',
                sortBy: '',
                name: '',
                page: 1,
                limit: limit,
            })
            const req = handleError(data.request)
            handelNotify('success', 'Xóa nhà cung cấp ' + req)
        } catch (error) {
            const req = handleError(error.request)
            setShowAlertCf({
                open: false
            })
            handelNotify('error', req)
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
                            <div id="search-supplier-form" name="search-supplier-form">
                                <div className="form-group position-relative has-icon-right">
                                    <div className="form-group position-relative has-icon-right col-9">
                                        <input onChange={handelSupplierSearch} id="search-product-text" type="text" className="form-control" placeholder="Tìm kiếm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="page-title">
                            <div className="row">
                                <div className="col-12 col-md-7 order-md-1 order-last">
                                    <label>
                                        <h3>Danh sách nhà cung cấp</h3>
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

                                        <button id='btn-createsupplier' className="btn btn-primary" onClick={handleshowAdd}>
                                            <i className="bi bi-plus"></i> Thêm nhà cung cấp
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
                                                    <th>Tên nhà cung cấp</th>
                                                    <th>Địa chỉ</th>
                                                    <th>Số điện thoại</th>
                                                    <th>Tác vụ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    supplier && supplier.length > 0 &&
                                                    supplier.map(item => {
                                                        let s = 'table-info';
                                                        if ((supplier.indexOf(item) + 1) % 2 !== 0) {
                                                            s = 'table-light';
                                                        } return (
                                                            <tr className={s}>
                                                                <td>{item.id}</td>
                                                                <td className='text-break'>{item.name}</td>
                                                                <td className='text-break'>{item.address}</td>
                                                                <td className='text-break'>{item.numberPhone}</td>
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
                                        <nav className="mt-4">
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
                                <Modal.Title>Thêm nhà cung cấp</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên nhà cung cấp:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='name'
                                            onChange={handleChangeAddSupplier}
                                        />
                                        {addValidate.name && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.name}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Địa chỉ:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='address'
                                            onChange={handleChangeAddSupplier}
                                        />
                                        {addValidate.address && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.address}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Số điện thoai:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='numberPhone'
                                            onChange={handleChangeAddSupplier}
                                        />
                                        {addValidate.numberPhone && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.numberPhone}</p>}
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowAdd(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={handleClickAddSupplier}>
                                    Thêm
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <div>
                        <Modal show={showRepair} onHide={() => setShowRepair(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Sửa thông tin nhà cung cấp</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên nhà cung cấp:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='name'
                                            value={repairSupplier.name}
                                            onChange={handleChangeRepairSupplier}
                                        />
                                        {repairValidate.name && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.name}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Địa chỉ:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='address'
                                            value={repairSupplier.address}
                                            onChange={handleChangeRepairSupplier}
                                        />
                                        {repairValidate.address && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.address}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Số điện thoai:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='numberPhone'
                                            value={repairSupplier.numberPhone}
                                            onChange={handleChangeRepairSupplier}
                                        />
                                        {repairValidate.numberPhone && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.numberPhone}</p>}
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowRepair(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={() => handleShowCfRepairSupplier(repairSupplier.id)}>
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

export default SupplierManager;