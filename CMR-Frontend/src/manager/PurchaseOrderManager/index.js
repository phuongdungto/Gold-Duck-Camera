import React, { useState, useEffect } from 'react';
import './purchaseorderManager.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '~/components/Layout/AdminLayout/Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faScrewdriverWrench, faCalendar } from '@fortawesome/free-solid-svg-icons';

import { createPurchaseService, getPurchasesService, getPurchaseByIdService } from '~/service/purchaseService';
import { getSuppliersService } from '~/service/supplierService';
import { getProductsService } from '~/service/productService';

import { validatePurchase, validatePurchaseDetails } from '~/core/utils/validate';
import { Notify, Gender, Roles } from '~/core/constant';
import { handleError, handelNotify } from '~/core/utils/req';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator';
import cookies from 'react-cookies'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { checkedID, checkoutID } from '~/store/action/purchaseAction';
function PurchaseorderManager() {
    const limit = 20;
    const optionsSearch = [
        { value: 'staffId', label: 'Id nhân viên' },
        { value: 'supplierId', label: 'Id nhà cung cấp' },
    ]

    const [search, setSearch] = useState('staffId')
    const [purchaseSearch, setPurchaseSearch] = useState({
        limit: limit,
        page: 1,
        sort: '',
        sortBy: '',
    })
    const handelChangeSearch = (e) => {
        const value = e.target.value
        setSearch(value);
        console.log(value)
        document.getElementById('search-product-text').value = '';
        setPurchaseSearch({
            limit: limit,
            page: 1,
            sort: '',
            sortBy: ''
        });
    }
    const handelPurchaseSearch = (e) => {
        const value = e.target.value
        let tmp = search
        setPurchaseSearch({
            [tmp]: value,
            page: 1,
            limit: limit,
            sort: '',
            sortBy: '',
        });
        console.log(value)
    }


    const navigate = useNavigate();
    const dispatch = useDispatch()
    const checkedPurchase = useSelector(state => state.purchase.check);
    console.log(checkedPurchase)
    const token = cookies.load('Tokenadmin')
    const admin = cookies.load('admin')
    const [showAddDetails, setShowAddDetails] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [addDetails, setAddDetails] = useState({
        count: 0,
        price: 0,
        productId: '',
    });
    const [purchaseDetails, setPurchaseDetails] = useState('')
    const handleshowDetails = async (event) => {
        try {
            let data = await getPurchaseByIdService(event, token)
            console.log(data.data)
            setPurchaseDetails(data.data)
        } catch (error) {

        }
        setShowDetails(true)
    }
    const [purchaseChecked, setPurchaseChecked] = useState([]);
    const handleshowAddDetails = () => {
        setAddDetails({
            count: 0,
            price: 0,
            productId: '',
        });
        setShowAddDetails(true)
        let tmp = [...product]
        for (let i = 0; i < checkedPurchase.length; i++) {
            console.log(tmp)
            if (checkedPurchase.length > 0) {
                const result = product.findIndex(({ id }) => id === checkedPurchase[i].productId);
                if (result != -1) tmp.splice(result, 1)
            }

        }

        setProduct(tmp)
    };
    const [addValidateDetails, SetAddValidateDetails] = useState('');
    const handleClickCheck = () => {
        const isValid = validatePurchaseDetails(addDetails);
        SetAddValidateDetails(isValid);
        console.log(addDetails)
        if (Object.keys(isValid).length > 0) return
        dispatch(checkedID([...checkedPurchase, addDetails]))
        setShowAddDetails(false);
    }
    const handleChangeAddDetails = (e) => {
        const value = e.target.value;
        setAddDetails({
            ...addDetails,
            [e.target.name]: value
        });
        console.log(value)
    }
    const handleChangeAddDetailsProductID = (e) => {
        setAddDetails({
            ...addDetails,
            productId: e.target.value,
            name: e.target[e.target.selectedIndex].text
        });
    }


    const [searchSupplier, setSearchSupplier] = useState({
        name: '',
    });
    const [supplier, setSupplier] = useState();
    const getListSupplier = async () => {
        try {
            const res = await getSuppliersService(searchSupplier, token);
            const data = (res && res.data) ? res.data : [];
            setSupplier(data.suppliers);
            console.log(data)
        } catch {

        }
    }
    const [searchProduct, setSearchProduct] = useState({
        description: '',
        name: '',
        brandId: '',
        categoryId: '',
        saleCodeId: '',
    });
    const [product, setProduct] = useState('')
    const getListProduct = async () => {
        try {
            const res = await getProductsService(searchProduct);
            const data = (res && res.data) ? res.data : [];
            setProduct(data.products);
        } catch {

        }
    }
    const [showAdd, setShowAdd] = useState(false);

    const handleshowAdd = () => {
        SetAddValidate('')
        setAddPurchase({
            staffId: admin.id,
            supplierId: '',
            inventoryId: 1,
        })
        setShowAdd(true)
        dispatch(checkoutID([]))
    };
    const [searchPurchase, setSearchPurchase] = useState({
        page: 1,
        limit: limit,
        sort: '',
        sortBy: '',
        staffId: '',
        supplierId: '',
    });
    const [pagination, SetPagination] = useState('')
    const getListPurchase = async (list) => {
        try {
            const res = await getPurchasesService(list, token);
            const data = (res && res.data) ? res.data : [];
            console.log(data.purchaseOrders)
            setPurchase(data.purchaseOrders);
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
        setPurchaseSearch({
            ...purchaseSearch,
            page: i
        })
    }

    useEffect(() => {
        getListPurchase(purchaseSearch);
        getListSupplier();
        getListProduct();
    }, [purchaseSearch], [searchSupplier], [searchProduct])
    const [purchase, setPurchase] = useState();
    const [addPurchase, setAddPurchase] = useState({
        staffId: admin.id,
        supplierId: '',
        inventoryId: 1,
    });
    const [addValidate, SetAddValidate] = useState('');

    const handleChangeSupplier = (e) => {
        setAddPurchase({
            ...addPurchase,
            supplierId: e.target.value
        });
        console.log(e.target.value)
    }

    const handleClickAddPurchase = async () => {
        console.log(addPurchase)
        const isValid = validatePurchase(addPurchase);
        SetAddValidate(isValid);
        if (Object.keys(isValid).length > 0) return
        if (checkedPurchase.length <= 0) {
            handelNotify('error', 'Vui lòng thêm sản phẩm vào phiếu nhập hàng')
        } else {
            try {
                const data = await createPurchaseService(addPurchase, token, checkedPurchase);
                const req = handleError(data.request)
                setShowAdd(false);
                handelNotify('success', 'Thêm phiếu nhập hàng thành công')
                console.log(addPurchase)
            } catch (error) {
                const req = handleError(error.request)
                handelNotify('success', req)
            }
        }

    }
    const handleShowCfDeleteDetails = (e) => {
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có chắc chắn muốn xóa sản phẩm ra khỏi phiếu nhập không?',
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
            let tmp = [...product]
            console.log(detail)
            if (checkedPurchase.length > 0) {
                const result1 = checkedPurchase.findIndex(({ productId }) => productId === detail.productId);
                console.log(result1)
                if (result1 != -1) {
                    checkedPurchase.splice(result1, 1)
                    tmp = [...product, detail]
                    setProduct(tmp)
                }
            }

            handelNotify('success', 'Xóa khuyến mãi thành công')
        } catch (error) {

        }
    }
    const [showAlertCf, setShowAlertCf] = useState({
        open: false,
        valirant: '',
        text: '',
        title: '',
        backdrop: ''
    });
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
                            <div id="search-purchaseorder-form" name="search-purchaseorder-form">
                                <div className="form-group position-relative has-icon-right row">
                                    <div className="form-group position-relative has-icon-right col-9">
                                        <input onChange={handelPurchaseSearch} id="search-product-text" type="text" className="form-control" placeholder="Tìm kiếm" />
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="page-title">
                            <div className="row">
                                <div className="col-12 col-md-7 order-md-1 order-last">
                                    <label>
                                        <h3>Danh sách đơn nhập hàng</h3>
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
                                        <button id='btn-createpurchaseorder' className="btn btn-primary" onClick={handleshowAdd}>
                                            <i className="bi bi-plus"></i> Thêm đơn nhập hàng
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
                                                    <th>ID phiếu nhập</th>
                                                    <th>ID nhân viên</th>
                                                    <th>ID nhà cung cấp</th>
                                                    <th>Tác vụ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    purchase && purchase.length > 0 &&
                                                    purchase.map(item => {
                                                        let s = 'table-info';
                                                        if ((purchase.indexOf(item) + 1) % 2 !== 0) {
                                                            s = 'table-light';
                                                        } return (
                                                            <tr className={s}>
                                                                <td>{item.id}</td>
                                                                <td>{item.staffId}</td>
                                                                <td>{item.supplierId}</td>
                                                                <td className='text-break'>
                                                                    <pre>
                                                                        <button onClick={e => handleshowDetails(item.id)}><FontAwesomeIcon icon={faCalendar} className='fa-icon pr-2' /></button><span>  </span>
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
                                                        return (<li className="page-item" active><button onClick={e => handelChange(item.pageNumber)} className="page-link">{item.pageNumber}</button></li>)
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
                        <Modal show={showAdd} onHide={() => setShowAdd(false)} size='lg'>
                            <Modal.Header closeButton>
                                <Modal.Title>Thêm phiếu nhập hàng</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>ID nhân viên:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            readOnly
                                            value={admin.id}
                                        />

                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên nhà cung cấp:</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={handleChangeSupplier}>
                                            <option value='0'>Chọn nhà cung cấp</option>
                                            {
                                                supplier && supplier.length > 0 &&
                                                supplier.map(item => {
                                                    return (
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </Form.Select>
                                        {addValidate.supplierId && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidate.supplierId}</p>}
                                    </Form.Group>
                                </Form>
                                <hr />
                                <div className="row">
                                    <div className="col-12 col-md-7 order-md-1 order-last">
                                    </div>
                                    <div className="col-12 col-md-5 order-md-2 order-first">
                                        <div className=" loat-start float-lg-end mb-3">
                                            <button id='btn-createsalecode' className="btn btn-primary" onClick={handleshowAddDetails}>
                                                <i className="bi bi-plus"></i> Thêm sản phẩm vào phiếu
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table mb-0 table-danger" id="tb2">
                                        <thead>
                                            <tr>
                                                <th>Mã sản phẩm</th>
                                                <th>Giá sản phẩm</th>
                                                <th>Số lượng sản phẩm</th>
                                                <th>Tác vụ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                checkedPurchase && checkedPurchase.length > 0 &&
                                                checkedPurchase.map(item => {
                                                    let s = 'table-info';
                                                    if ((checkedPurchase.indexOf(item) + 1) % 2 !== 0) {
                                                        s = 'table-light';
                                                    } return (
                                                        <tr className={s}>
                                                            <td className='text-break'>{item.productId}</td>
                                                            <td className='text-break'>{item.price}</td>
                                                            <td className='text-break'>{item.count}</td>
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
                                    <nav className="mt-5">
                                        <ul id="pagination" className="pagination justify-content-center">
                                        </ul>
                                    </nav>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowAdd(false)}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={handleClickAddPurchase}>
                                    Thêm
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>


                    <div>
                        <Modal show={showDetails} onHide={() => setShowDetails(false)} size='lg'>
                            <Modal.Header closeButton>
                                <Modal.Title>Thông tin chi tiết phiếu nhập hàng</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>ID nhân viên:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            readOnly
                                            value={purchaseDetails.staffId}
                                        />

                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên nhà cung cấp:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            autoFocus
                                            readOnly
                                            value={purchaseDetails.supplierId}
                                        />
                                    </Form.Group>
                                </Form>
                                <hr />

                                <div className="table-responsive">
                                    <table className="table mb-0 table-danger" id="tb2">
                                        <thead>
                                            <tr>
                                                <th>Mã sản phẩm</th>
                                                <th>Giá sản phẩm</th>
                                                <th>Số lượng sản phẩm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                purchaseDetails.purchaseOrderDetails && purchaseDetails.purchaseOrderDetails.length > 0 &&
                                                purchaseDetails.purchaseOrderDetails.map(item => {
                                                    let s = 'table-info';
                                                    if ((purchaseDetails.purchaseOrderDetails.indexOf(item) + 1) % 2 !== 0) {
                                                        s = 'table-light';
                                                    } return (
                                                        <tr className={s}>
                                                            <td className='text-break'>{item.productId}</td>
                                                            <td className='text-break'>{item.price}</td>
                                                            <td className='text-break'>{item.count}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <nav className="mt-5">
                                        <ul id="pagination" className="pagination justify-content-center">
                                        </ul>
                                    </nav>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowDetails(false)}>
                                    Đóng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div>
                        <Modal show={showAddDetails} onHide={() => setShowAddDetails(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Thêm sản phẩm khuyến mãi</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Tên sản phẩm:</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={handleChangeAddDetailsProductID}>
                                            <option value='0'>Chọn tên sản phẩm</option>
                                            {
                                                product && product.length > 0 &&
                                                product.map(item => {
                                                    return (
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </Form.Select>
                                        {addValidateDetails.productId && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidateDetails.productId}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Giá sản phẩm:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="0"
                                            name='price'
                                            onChange={handleChangeAddDetails}
                                            autoFocus

                                        />
                                        {addValidateDetails.price && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidateDetails.price}</p>}
                                    </Form.Group>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Số lượng sản phẩm:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="0"
                                            name='count'
                                            onChange={handleChangeAddDetails}
                                            autoFocus
                                        />
                                        {addValidateDetails.count && <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{addValidateDetails.count}</p>}
                                    </Form.Group>
                                </Form>
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

export default PurchaseorderManager;