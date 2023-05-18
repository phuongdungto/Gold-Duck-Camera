import React, { useState, useEffect } from 'react';
import './brandManager.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '~/components/Layout/AdminLayout/Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faScrewdriverWrench, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { createBrandService, getBrandByIdService, getBrandsService, updateBrandService, deleteBrandService } from '~/service/brandService';

import { validateBrand } from '~/core/utils/validate';
import { Notify, Gender, Roles } from '~/core/constant';
import { handleError, handelNotify } from '~/core/utils/req';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator';
import cookies from 'react-cookies'
function BrandManager() {
    const limit = 20;
    const optionsSearch = [
        { value: 'name', label: 'Tên thương hiệu' },
    ]

    const [search, setSearch] = useState('name')
    const [brandSearch, setBrandSearch] = useState({
        limit: limit,
        page: 1,
        name: '',
        sort: '',
        sortBy: ''
    })
    const handelChangeSearch = (e) => {
        const value = e.target.value
        setSearch(value);
        console.log(value)
        document.getElementById('search-product-text').value = '';
        setBrandSearch({
            limit: limit,
            page: 1,
            name: '',
            sort: '',
            sortBy: ''
        });
    }
    const handelBrandSearch = (e) => {
        const value = e.target.value
        let tmp = search
        setBrandSearch({
            [tmp]: value,
            limit: limit,
            page: 1,
            sort: '',
            sortBy: ''
        });

    }


    const token = cookies.load('Tokenadmin');
    const [showAdd, setShowAdd] = useState(false);
    const handleshowAdd = () => {
        SetAddValidate('')
        setAddBrand({
            name: '',
        })
        setShowAdd(true)
    };
    const [showRepair, setShowRepair] = useState(false);
    const [searchBrand, setSearchBrand] = useState({
        page: 1,
        limit: limit,
        sort: '',
        sortBy: '',
        name: '',
    });
    const [pagination, SetPagination] = useState('')
    const getListBrand = async (list) => {
        try {
            console.log(brandSearch)
            const res = await getBrandsService(list);
            const data = (res && res.data) ? res.data : [];
            setBrand(data.brands);
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
        setBrandSearch({
            ...brandSearch,
            page: i
        })
    }

    useEffect(() => {
        getListBrand(brandSearch);
    }, [brandSearch])
    const [brand, setBrand] = useState();
    const [addBrand, setAddBrand] = useState({
        name: '',
    });
    const [addValidate, SetAddValidate] = useState('');

    const handleChangeAddBrand = (e) => {
        const value = e.target.value;
        setAddBrand({
            ...addBrand,
            [e.target.name]: value
        });
    }

    const handleClickAddBrand = async () => {
        const isValid = validateBrand(addBrand);
        SetAddValidate(isValid);
        if (Object.keys(isValid).length > 0) return
        try {
            const data = await createBrandService(addBrand, token);
            const req = handleError(data.request)
            setShowAdd(false);
            handelNotify('success', 'Thêm thương hiệu thành công')
            setBrand(prevState => [...prevState, data.data]);
            setBrandSearch({
                ...brandSearch,
                sort: '',
                sortBy: '',
                name: '',
            })
        } catch (error) {
            const req = handleError(error.request)
            handelNotify('success', req)
        }

    }

    const [repairValidate, SetRepairValidate] = useState('');
    const [repairBrand, setRepairBrand] = useState('');
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
            let data = await getBrandByIdService(e)
            setRepairBrand(data.data)
        } catch (error) {

        }
        setShowRepair(true)
    }

    const handleChangeRepairBrand = e => {
        const value = e.target.value
        setRepairBrand({
            ...repairBrand,
            [e.target.name]: value
        });

    }

    const handleShowCfRepairBrand = (e) => {
        const isValid = validateBrand(repairBrand)
        SetRepairValidate(isValid)
        if (Object.keys(isValid).length > 0) return
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có chắc chắn muốn sửa thương hiệu này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleClickRepairBrand(e)
        })
    }
    const handleClickRepairBrand = async (brand) => {
        try {
            const data = await updateBrandService(repairBrand, token)
            const req = handleError(data.request)
            setShowRepair(false)
            setShowAlertCf({
                open: false
            })
            handelNotify('success', 'Sửa thương hiệu ' + req)
            setBrand(prevState => {
                const newState = prevState.map(obj => {
                    if (obj.id === brand) {
                        return {
                            ...obj,
                            name: repairBrand.name,
                        };
                    }
                    console.log(obj)
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
            text: 'Bạn có chắc chắn muốn xóa thương hiệu này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleDelete(e)
        })
    }
    const handleDelete = async (brand) => {
        try {
            const data = await deleteBrandService(brand, token)
            setShowAlertCf({
                open: false
            })
            setBrandSearch({
                ...brandSearch,
                sort: '',
                sortBy: '',
                name: '',
            })
            const req = handleError(data.request)
            handelNotify('success', 'Xóa thương hiệu ' + req)
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
                            <div id="search-brand-form" name="search-brand-form">
                                <div className="form-group position-relative has-icon-right row ">
                                    <div className="form-group position-relative has-icon-right col-9">
                                        <input onChange={handelBrandSearch} id="search-product-text" type="text" className="form-control" placeholder="Tìm kiếm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="page-title">
                            <div className="row">
                                <div className="col-12 col-md-7 order-md-1 order-last">
                                    <label>
                                        <h3>Danh sách thương hiệu</h3>
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

                                        <button id='btn-createbrand' className="btn btn-primary" onClick={handleshowAdd}>
                                            <i className="bi bi-plus"></i> Thêm thương hiệu
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
                                                    <th>Id thương hiệu</th>
                                                    <th>Tên thương hiệu</th>
                                                    <th>Tác vụ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    brand && brand.length > 0 &&
                                                    brand.map(item => {
                                                        let s = 'table-info';
                                                        if ((brand.indexOf(item) + 1) % 2 !== 0) {
                                                            s = 'table-light';
                                                        } return (
                                                            <tr className={s}>
                                                                <td>{item.id}</td>
                                                                <td className='text-break'>{item.name}</td>
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
                                <Modal.Title>Thêm thương hiệu</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên thương hiệu:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='name'
                                            onChange={handleChangeAddBrand}
                                        />
                                        {addValidate.name && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.name}</p>}
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowAdd(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={handleClickAddBrand}>
                                    Thêm
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <div>
                        <Modal show={showRepair} onHide={() => setShowRepair(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Sửa thông tin thương hiệu</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên thương hiệu:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='name'
                                            value={repairBrand.name}
                                            onChange={handleChangeRepairBrand}
                                        />
                                        {repairValidate.name && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.name}</p>}
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowRepair(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={() => handleShowCfRepairBrand(repairBrand.id)}>
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

export default BrandManager;