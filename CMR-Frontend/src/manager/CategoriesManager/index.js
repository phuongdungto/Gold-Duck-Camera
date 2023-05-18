import React, { useState, useEffect } from 'react';
import './categoriesManager.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '~/components/Layout/AdminLayout/Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faScrewdriverWrench, faCalendar } from '@fortawesome/free-solid-svg-icons';

import { getCategoryByIdService, createCategoriesService, getCategoriesByIdService, getCategoriessService, updateCategoriesService, deleteCategoriesService } from '~/service/categoryService';

import { validateCategories } from '~/core/utils/validate';
import { Notify, Gender, Roles } from '~/core/constant';
import { handleError, handelNotify } from '~/core/utils/req';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator';
import cookies from 'react-cookies'
function CategoriesManager() {
    const limit = 20;
    const optionsSearch = [
        { value: 'name', label: 'Tên danh mục' },
    ]

    const [search, setSearch] = useState('name')
    const [catrgorySearch, setCategorySearch] = useState({
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
        setCategorySearch({
            limit: limit,
            page: 1,
            name: '',
            sort: '',
            sortBy: ''
        });
    }
    const handelCategorySearch = (e) => {
        const value = e.target.value
        let tmp = search
        setCategorySearch({
            [tmp]: value,
            limit: limit,
            page: 1,
            sort: '',
            sortBy: ''
        });
        console.log(value)
    }
    const HandleClickSearch = async () => {
        try {
            console.log(catrgorySearch)
            const res = await getCategoriessService(catrgorySearch);
            const data = (res && res.data) ? res.data : [];
            setCategories(data.categories);
            SetPagination(selectPagination(data.totalPage))
        } catch {

        }
    }

    const token = cookies.load('Tokenadmin');
    const [showAdd, setShowAdd] = useState(false);
    const handleshowAdd = () => {
        SetAddValidate('')
        setAddCategories({
            name: '',
        })
        setShowAdd(true)
    };
    const [showRepair, setShowRepair] = useState(false);
    const [searchCategories, setSearchCategories] = useState({
        page: 1,
        limit: limit,
        sort: '',
        sortBy: '',
        name: '',
    });
    const [pagination, SetPagination] = useState('')
    const getListCategories = async (list) => {
        try {
            const res = await getCategoriessService(list);
            const data = (res && res.data) ? res.data : [];
            setCategories(data.categories);
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
        setCategorySearch({
            ...catrgorySearch,
            page: i
        })
    }

    useEffect(() => {
        getListCategories(catrgorySearch);
    }, [catrgorySearch])
    const [categories, setCategories] = useState();
    const [addCategories, setAddCategories] = useState({
        name: '',
    });
    const [addValidate, SetAddValidate] = useState('');

    const handleChangeAddCategories = (e) => {
        const value = e.target.value;
        setAddCategories({
            ...addCategories,
            [e.target.name]: value
        });
    }

    const handleClickAddCategories = async () => {
        const isValid = validateCategories(addCategories);
        SetAddValidate(isValid);
        if (Object.keys(isValid).length > 0) return
        try {
            const data = await createCategoriesService(addCategories, token);
            const req = handleError(data.request)
            setShowAdd(false);
            handelNotify('success', 'Thêm danh mục thành công')
            setCategories(prevState => [...prevState, data.data]);

        } catch (error) {
            const req = handleError(error.request)
            handelNotify('success', req)
        }

    }

    const [repairValidate, SetRepairValidate] = useState('');
    const [repairCategories, setRepairCategories] = useState('');
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
            let data = await getCategoriesByIdService(e)
            setRepairCategories(data.data)
        } catch (error) {

        }
        setShowRepair(true)
    }

    const handleChangeRepairCategories = e => {
        const value = e.target.value
        setRepairCategories({
            ...repairCategories,
            [e.target.name]: value
        });

    }

    const handleShowCfRepairCategories = (e) => {
        const isValid = validateCategories(repairCategories)
        SetRepairValidate(isValid)
        if (Object.keys(isValid).length > 0) return
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có chắc chắn muốn sửa danh mục này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleClickRepairCategories(e)
        })
    }
    const handleClickRepairCategories = async (categories) => {
        try {
            const data = await updateCategoriesService(repairCategories, token)
            const req = handleError(data.request)
            setShowRepair(false)
            setShowAlertCf({
                open: false
            })
            handelNotify('success', 'Sửa danh mục ' + req)
            setCategories(prevState => {
                const newState = prevState.map(obj => {
                    if (obj.id === categories) {
                        return {
                            ...obj,
                            name: repairCategories.name,
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
            text: 'Bạn có chắc chắn muốn xóa danh mục này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleDelete(e)
        })
    }
    const handleDelete = async (categories) => {
        try {
            const data = await deleteCategoriesService(categories, token)
            setShowAlertCf({
                open: false
            })
            setCategorySearch({
                ...catrgorySearch,
                sort: '',
                sortBy: '',
                name: '',
            })
            const req = handleError(data.request)
            handelNotify('success', 'Xóa danh mục ' + req)
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
                            <div id="search-categories-form" name="search-categories-form">
                                <div className="form-group position-relative has-icon-right row">
                                    <div className="form-group position-relative has-icon-right col-9">
                                        <input onChange={handelCategorySearch} id="search-product-text" type="text" className="form-control" placeholder="Tìm kiếm" />
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="page-title">
                            <div className="row">
                                <div className="col-12 col-md-7 order-md-1 order-last">
                                    <label>
                                        <h3>Danh sách danh mục</h3>
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

                                        <button id='btn-createcategories' className="btn btn-primary" onClick={handleshowAdd}>
                                            <i className="bi bi-plus"></i> Thêm danh mục
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
                                                    <th>Id danh mục</th>
                                                    <th>Tên danh mục</th>
                                                    <th>Tác vụ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    categories && categories.length > 0 &&
                                                    categories.map(item => {
                                                        let s = 'table-info';
                                                        if ((categories.indexOf(item) + 1) % 2 !== 0) {
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
                                <Modal.Title>Thêm danh mục</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên danh mục:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='name'
                                            onChange={handleChangeAddCategories}
                                        />
                                        {addValidate.name && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.name}</p>}
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowAdd(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={handleClickAddCategories}>
                                    Thêm
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <div>
                        <Modal show={showRepair} onHide={() => setShowRepair(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Sửa thông tin danh mục</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên danh mục:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='name'
                                            value={repairCategories.name}
                                            onChange={handleChangeRepairCategories}
                                        />
                                        {repairValidate.name && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.name}</p>}
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowRepair(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={() => handleShowCfRepairCategories(repairCategories.id)}>
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

export default CategoriesManager;