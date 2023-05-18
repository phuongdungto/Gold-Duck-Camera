import React, { useState, useEffect } from 'react';

import './productManager.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '~/components/Layout/AdminLayout/Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faScrewdriverWrench, faCalendar } from '@fortawesome/free-solid-svg-icons';

import { getProductsService, getProductService, createProductService, getProductByIdService, updateProductService, deleteProductService } from '~/service/productService';
import { getBrandService } from '~/service/brandService';
import { getCategoriessService } from '~/service/categoryService';

import { validateFull, validateProduct, validateProductR } from '~/core/utils/validate';
import { Notify, Gender, Roles } from '~/core/constant';
import { handleError, handelNotify } from '~/core/utils/req';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator';
import cookies from 'react-cookies'

function ProductManager() {

    const token = cookies.load('Tokenadmin');
    const limit = 20;
    const optionsSearch = [
        { value: 'name', label: 'Tên sản phẩm' },
        { value: 'description', label: 'Mô tả' },
        { value: 'brandId', label: 'Id thương hiệu' },
        { value: 'categoryId', label: 'Id Danh mục' }
    ]
    const [searchInput, setSearchInput] = useState({
        limit: limit,
        page: 1,
        name: '',
        desciption: '',
        brandId: '',
        categoryId: '',
        sort: '',
        sortBy: ''
    })
    const [search, setSearch] = useState('name')
    const [productSearch, setProductSearch] = useState({
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
        setProductSearch({
            limit: limit,
            page: 1,
            sort: '',
            sortBy: ''
        });
    }
    const handelProductSearch = (e) => {
        const value = e.target.value
        let tmp = search
        if (tmp == 'categoryId' || tmp == 'brandId') {
            if (validator.isNumeric(value) == true) {
                setProductSearch({
                    [tmp]: value,
                    limit: limit,
                    page: 1,
                    sort: '',
                    sortBy: ''
                });
            } else {
                alert('Vui lòng nhập ' + tmp + ' là số!!')
            }
        } else {
            setProductSearch({
                [tmp]: value,
                limit: limit,
                page: 1,
                sort: '',
                sortBy: ''
            });
        }
        console.log(value)
    }
    const HandleClickSearch = async () => {
        try {
            console.log(productSearch)
            const res = await getProductsService(productSearch);
            const data = (res && res.data) ? res.data : [];
            setProduct(data.products);
            SetPagination(selectPagination(data.totalPage))
        } catch {

        }
    }

    const [showAdd, setShowAdd] = useState(false);
    const handleshowAdd = () => {
        SetAddValidate('')
        setAddProduct({
            name: '',
            price: '',
            description: '',
            brandId: '',
            categoryId: '',
            saleCodeId: 0,
            warrantyPeriod: '',
        })
        setFile([]);
        setShowAdd(true)
    };
    const [showRepair, setShowRepair] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [searchProduct, setSearchProduct] = useState({
        page: 1,
        limit: limit,
        sort: '',
        sortBy: '',
        description: '',
        name: '',
        brandId: '',
        categoryId: '',
        saleCodeId: '',
    });
    const [pagination, SetPagination] = useState('')
    const getListProduct = async (list) => {
        try {
            const res = await getProductsService(list);
            const data = (res && res.data) ? res.data : [];
            setProduct(data.products);
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
        setProductSearch({
            ...productSearch,
            page: i
        })
    }

    const [brand, setBrand] = useState({
        name: '',
    });
    const getListBrand = async () => {
        try {
            const res = await getBrandService(brand);
            const data = (res && res.data) ? res.data : [];
            setBrand(data.brands);
        } catch {

        }
    }
    const [categories, setCategories] = useState({
        name: '',
    });
    const getListCategories = async () => {
        try {
            const res = await getCategoriessService(categories);
            const data = (res && res.data) ? res.data : [];
            setCategories(data.categories);
        } catch {

        }
    }

    useEffect(() => {
        getListProduct(productSearch);
        getListBrand();
        getListCategories();
    }, [productSearch])
    const [product, setProduct] = useState();
    const [files, setFile] = useState([]);
    const [addProduct, setAddProduct] = useState({
        name: '',
        price: '',
        description: '',
        brandId: '',
        categoryId: '',
        saleCodeId: 0,
        warrantyPeriod: '',
    });
    const [addValidate, SetAddValidate] = useState('');

    const handleChangeAddProduct = (e) => {
        const value = e.target.value;
        setAddProduct({
            ...addProduct,
            [e.target.name]: value
        });
    }
    const handleChangeBrand = (e) => {
        setAddProduct({
            ...addProduct,
            brandId: e.target.value
        });
    }
    const handleChangeCategories = (e) => {
        setAddProduct({
            ...addProduct,
            categoryId: e.target.value
        });
    }
    const handleChangeWarranty = (e) => {
        setAddProduct({
            ...addProduct,
            warrantyPeriod: e.target.value
        });
    }

    const handleChangeFiles = (e) => {
        setFile({
            files: e.target.files,
        })

    }
    const handleClickAddProduct = async () => {
        let bodyFormData = new FormData();
        let count = 0;
        for (let key in files.files) {
            count = count + 1;
            bodyFormData.append('images', files.files[key]);
            if (count == files.files.length) {
                count = 0;
                break;
            }
        }
        bodyFormData.append('name', addProduct.name);
        bodyFormData.append('price', addProduct.price);
        bodyFormData.append('description', addProduct.description);
        bodyFormData.append('brandId', addProduct.brandId);
        bodyFormData.append('categoryId', addProduct.categoryId);
        bodyFormData.append('warrantyPeriod', addProduct.warrantyPeriod);
        const isValid = validateProduct(bodyFormData);
        SetAddValidate(isValid);
        if (Object.keys(isValid).length > 0) return
        try {
            const data = await createProductService(bodyFormData, token);
            const req = handleError(data.request)
            setShowAdd(false);
            handelNotify('success', 'Thêm sản phẩm thành công')
            setProduct(prevState => [...prevState, data.data]);

        } catch (error) {
            const req = handleError(error.request)
            handelNotify('success', req)
        }

    }

    const [repairValidate, SetRepairValidate] = useState('');
    const [repairProduct, setRepairProduct] = useState('');
    const [filesR, setFileR] = useState([]);
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
            let data = await getProductByIdService(e)
            setRepairProduct(data.data)
        } catch (error) {

        }
        setShowRepair(true)
    }

    const handleChangeRepairProduct = e => {
        const value = e.target.value
        setRepairProduct({
            ...repairProduct,
            [e.target.name]: value
        });

    }
    const handleChangeBrandR = (e) => {
        setRepairProduct({
            ...repairProduct,
            brandId: e.target.value
        });
    }
    const handleChangeCategoriesR = (e) => {
        setRepairProduct({
            ...repairProduct,
            categoryId: e.target.value
        });
    }
    const handleChangeWarrantyR = (e) => {
        setRepairProduct({
            ...repairProduct,
            warrantyPeriod: e.target.value
        });
    }

    const handleChangeFilesR = (e) => {
        setFileR({
            files: e.target.files,
        })

    }
    const handleShowCfRepairProduct = (e) => {
        let bodyFormData = new FormData();
        let count = 0;
        for (let key in filesR.files) {
            count = count + 1;
            bodyFormData.append('images', filesR.files[key]);
            if (count == filesR.files.length) {
                count = 0;
                break;
            }
        }
        bodyFormData.append('name', repairProduct.name);
        bodyFormData.append('price', repairProduct.price);
        bodyFormData.append('description', repairProduct.description);
        bodyFormData.append('brandId', repairProduct.brandId);
        bodyFormData.append('categoryId', repairProduct.categoryId);
        bodyFormData.append('warrantyPeriod', repairProduct.warrantyPeriod);
        const isValid = validateProductR(bodyFormData)
        SetRepairValidate(isValid)
        if (Object.keys(isValid).length > 0) return
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có chắc chắn muốn sửa sản phẩm này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleClickRepairProduct(e, bodyFormData)
        })
    }
    const handleClickRepairProduct = async (product, bodyFormData) => {
        try {
            const data = await updateProductService(bodyFormData, repairProduct.id, token)
            const req = handleError(data.request)
            setShowRepair(false)
            setShowAlertCf({
                open: false
            })
            handelNotify('success', 'Sửa sản phẩm ' + req)
            setProduct(prevState => {
                const newState = prevState.map(obj => {
                    if (obj.id === product) {
                        return {
                            ...obj,
                            name: repairProduct.name,
                            brandId: repairProduct.brandId,
                            categoryId: repairProduct.categoryId,
                            price: repairProduct.price,
                            warrantyPeriod: repairProduct.warrantyPeriod,
                            description: repairProduct.description,
                            img1: repairProduct.img1,
                            img2: repairProduct.img2,
                        };
                    }
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
    const handleShowDetail = async (e) => {
        try {
            let data = await getProductByIdService(e)
            setRepairProduct(data.data)
        } catch (error) {

        }
        setShowDetail(true)
    }
    const handleShowCfDelete = (e) => {
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleDelete(e)
        })
    }
    const handleDelete = async (product) => {
        try {
            const data = await deleteProductService(product, token)
            setShowAlertCf({
                open: false
            })
            setProductSearch({
                ...productSearch,
                sort: '',
                sortBy: '',
                description: '',
                name: '',
                brandId: '',
                categoryId: '',
                saleCodeId: '',
            })
            const req = handleError(data.request)
            handelNotify('success', 'Xóa sản phẩm ' + req)
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
                            <div id="search-product-form" name="search-product-form" className='row'>
                                <div className="form-group position-relative has-icon-right col-9">
                                    <input onChange={handelProductSearch} id="search-product-text" type="text" className="form-control" placeholder="Tìm kiếm" />
                                </div>
                            </div>
                        </div>
                        <div className="page-title">
                            <div className="row">
                                <div className="col-12 col-md-7 order-md-1 order-last">
                                    <label>
                                        <h3>Danh sách sản phẩm</h3>
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

                                        <button id='btn-createproduct' className="btn btn-primary" onClick={handleshowAdd}>
                                            <i className="bi bi-plus"></i> Thêm sản phẩm
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
                                                    <th>Tên sản phẩm</th>
                                                    <th>Giá sản phẩm</th>
                                                    <th>Hình ảnh 1</th>
                                                    <th>Hình ảnh 2</th>
                                                    <th>Tác vụ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    product && product.length > 0 &&
                                                    product.map(item => {
                                                        let s = 'table-info';
                                                        if ((product.indexOf(item) + 1) % 2 !== 0) {
                                                            s = 'table-light';
                                                        } return (
                                                            <tr className={s}>
                                                                <td>{item.id}</td>
                                                                <td className='text-break'>{item.name}</td>
                                                                <td className='text-break'>{item.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                                <td className='text-break'>
                                                                    <div className="productmanager">
                                                                        <img className="imgmanager" src={process.env.REACT_APP_URL_IMG + item.img1} alt="Canon" />
                                                                    </div>
                                                                </td>
                                                                <td className='text-break'>
                                                                    <div className="productmanager">
                                                                        <img className="imgmanager" src={process.env.REACT_APP_URL_IMG + item.img2} alt="Canon" />
                                                                    </div>
                                                                </td>
                                                                <td className='text-break'>
                                                                    <pre>
                                                                        <button onClick={e => handleShowDetail(item.id)}><FontAwesomeIcon icon={faCalendar} className='fa-icon pr-2' /></button><span>  </span>
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
                                <Modal.Title>Thêm sản phẩm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên sản phẩm:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            name='name'
                                            onChange={handleChangeAddProduct}
                                            autoFocus
                                        />
                                        {addValidate.name && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.name}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Thương hiệu:</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={handleChangeBrand}>
                                            <option value='0'>Chọn thương hiệu</option>
                                            {
                                                brand && brand.length > 0 &&
                                                brand.map(item => {
                                                    return (
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }

                                        </Form.Select>
                                        {addValidate.brandId && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.brandId}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Danh mục:</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={handleChangeCategories}>
                                            <option value='0'>Chọn danh mục</option>
                                            {
                                                categories && categories.length > 0 &&
                                                categories.map(item => {
                                                    return (
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </Form.Select>
                                        {addValidate.categoryId && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.categoryId}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Giá sản phẩm:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            name='price'
                                            onChange={handleChangeAddProduct}
                                            autoFocus
                                        />
                                        {addValidate.price && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.price}</p>}
                                    </Form.Group>
                                    <Form.Group controlId="formFileMultiple" className="mb-3">
                                        <Form.Label>Chọn 2 ảnh sản phẩm:</Form.Label>
                                        <Form.Control type="file" multiple name="files" onChange={handleChangeFiles} />
                                        {addValidate.images && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.images}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Thời hạn bảo hành:</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={handleChangeWarranty}>
                                            <option value="0">Chọn thời hạn bảo hành</option>
                                            <option value="1">1 năm</option>
                                            <option value="2">2 năm</option>
                                            <option value="3">3 năm</option>
                                        </Form.Select>
                                        {addValidate.warrantyPeriod && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.warrantyPeriod}</p>}
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"

                                    >
                                        <Form.Label>Mô tả</Form.Label>
                                        <Form.Control name='description' onChange={handleChangeAddProduct} as="textarea" rows={3} />
                                        {addValidate.description && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.description}</p>}
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowAdd(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={handleClickAddProduct}>
                                    Thêm
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <div>
                        <Modal show={showRepair} onHide={() => setShowRepair(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Sửa thông tin sản phẩm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên sản phẩm:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='name'
                                            value={repairProduct.name}
                                            onChange={handleChangeRepairProduct}
                                        />
                                        {repairValidate.name && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.name}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Thương hiệu:</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={handleChangeBrandR}>
                                            <option value='0'>Chọn thương hiệu</option>
                                            {
                                                brand && brand.length > 0 &&
                                                brand.map(item => {
                                                    if (item.id == repairProduct.brandId)
                                                        return (
                                                            <option selected value={item.id}>{item.name}</option>
                                                        )
                                                    return <option value={item.id}>{item.name}</option>
                                                })
                                            }
                                        </Form.Select>
                                        {repairValidate.brandId && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.brandId}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Danh mục:</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={handleChangeCategoriesR}>
                                            <option value='0'>Chọn danh mục</option>
                                            {
                                                categories && categories.length > 0 &&
                                                categories.map(item => {
                                                    if (item.id == repairProduct.categoryId)
                                                        return (
                                                            <option selected value={item.id}>{item.name}</option>
                                                        )
                                                    return <option value={item.id}>{item.name}</option>
                                                })
                                            }
                                        </Form.Select>
                                        {repairValidate.categoryId && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.categoryId}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Giá sản phẩm:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            name='price'
                                            value={repairProduct.price}
                                            onChange={handleChangeRepairProduct}
                                        />
                                        {repairValidate.price && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.price}</p>}
                                    </Form.Group>
                                    <Form.Group controlId="formFileMultiple" className="mb-3">
                                        <Form.Label>Chọn 2 ảnh sản phẩm:</Form.Label>
                                        <Form.Control type="file" multiple name="file" onChange={handleChangeFilesR} />
                                        {repairValidate.images && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.images}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Thời hạn bảo hành:</Form.Label>
                                        {repairProduct.warrantyPeriod == 0 &&
                                            <Form.Select aria-label="Default select example" onChange={handleChangeWarrantyR}>
                                                <option selected value="0">Chọn thời hạn bảo hành</option>
                                                <option value="1">1 năm</option>
                                                <option value="2">2 năm</option>
                                                <option value="3">3 năm</option>
                                            </Form.Select>
                                        }
                                        {repairProduct.warrantyPeriod == 1 &&
                                            <Form.Select aria-label="Default select example" onChange={handleChangeWarrantyR}>
                                                <option value="0">Chọn thời hạn bảo hành</option>
                                                <option selected value="1">1 năm</option>
                                                <option value="2">2 năm</option>
                                                <option value="3">3 năm</option>
                                            </Form.Select>
                                        }
                                        {repairProduct.warrantyPeriod == 2 &&
                                            <Form.Select aria-label="Default select example" onChange={handleChangeWarrantyR}>
                                                <option value="0">Chọn thời hạn bảo hành</option>
                                                <option value="1">1 năm</option>
                                                <option selected value="2">2 năm</option>
                                                <option value="3">3 năm</option>
                                            </Form.Select>
                                        }
                                        {repairProduct.warrantyPeriod == 3 &&
                                            <Form.Select aria-label="Default select example" onChange={handleChangeWarrantyR}>
                                                <option value="0">Chọn thời hạn bảo hành</option>
                                                <option value="1">1 năm</option>
                                                <option value="2">2 năm</option>
                                                <option selected value="3">3 năm</option>
                                            </Form.Select>
                                        }
                                        {repairValidate.warrantyPeriod && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.warrantyPeriod}</p>}
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"

                                    >
                                        <Form.Label>Mô tả</Form.Label>
                                        <Form.Control as="textarea" rows={3}
                                            name='description'
                                            value={repairProduct.description}
                                            onChange={handleChangeRepairProduct} />
                                        {repairValidate.description && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{repairValidate.description}</p>}
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowRepair(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={() => handleShowCfRepairProduct(repairProduct.id)}>
                                    Sửa
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <div>
                        <Modal show={showDetail} onHide={() => setShowDetail(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Thông tin chi tiết sản phẩm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>ID sản phẩm:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            disabled
                                            readOnly
                                            value={repairProduct.id}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên sản phẩm:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            disabled
                                            readOnly
                                            name='price'
                                            value={repairProduct.name}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Thương hiệu:</Form.Label>
                                        <Form.Select aria-label="Default select example" disabled readOnly>
                                            {
                                                brand && brand.length > 0 &&
                                                brand.map(item => {
                                                    if (item.id == repairProduct.brandId)
                                                        return (
                                                            <option value={item.id}>{item.name}</option>
                                                        )
                                                })
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Danh mục:</Form.Label>
                                        <Form.Select aria-label="Default select example" disabled readOnly>
                                            {
                                                categories && categories.length > 0 &&
                                                categories.map(item => {
                                                    if (item.id == repairProduct.categoryId)
                                                        return (
                                                            <option value={item.id}>{item.name}</option>
                                                        )
                                                })
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Giá sản phẩm:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            disabled
                                            readOnly
                                            value={repairProduct.price}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formFileMultiple" className="mb-3" >
                                        <Form.Label>Hình ảnh 1</Form.Label>
                                        <img src={process.env.REACT_APP_URL_IMG + repairProduct.img1} width='100px' height='100px' alt='image1' />
                                    </Form.Group>
                                    <Form.Group controlId="formFileMultiple" className="mb-3" >
                                        <Form.Label>Hình ảnh 2</Form.Label>
                                        <img src={process.env.REACT_APP_URL_IMG + repairProduct.img2} width='100px' height='100px' alt='image2' />
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Thời hạn bảo hành:</Form.Label>
                                        <Form.Select aria-label="Default select example" disabled readOnly>
                                            {repairProduct.warrantyPeriod == 1 && <option value="1">1 năm</option>}
                                            {repairProduct.warrantyPeriod == 2 && <option value="2">2 năm</option>}
                                            {repairProduct.warrantyPeriod == 3 && <option value="3">3 năm</option>}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                    >
                                        <Form.Label>Mô tả</Form.Label>
                                        <Form.Control as="textarea" rows={3} disabled readOnly value={repairProduct.description} />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowDetail(false)}>
                                    Đóng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ProductManager;