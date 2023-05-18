import 'bootstrap/dist/css/bootstrap.min.css'
import './payment.scss'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeCart, userPayment } from '~/store/action/cartAction';
import cookies from 'react-cookies';
import { shippingService, paymentService } from '~/service/paymentService';
import { validateFull } from '~/core/utils/validate';
import { handelNotify } from '~/core/utils/req';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Notify } from '~/core/constant';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
const Payment = () => {
    const token = cookies.load('Token');
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [userPay, setUserPay] = useState('');
    const checked = useSelector(state => state.cart.check);
    const cart = useSelector(state => state.cart.cart);
    const total = useSelector(state => state.cart.total);
    const [showAlertCf, setShowAlertCf] = useState(false);
    const [showAlertCf1, setShowAlertCf1] = useState(false);
    const [shippingFee, setShippingFee] = useState('');

    const [oldShip, setOldShip] = useState(0)
    const [validate, setValiday] = useState('')
    const [details, setDetails] = useState()
    const [isLoading, setLoading] = useState(false)
    // const handleRepairAddress = async () => {
    //     const address = {
    //         address: userPay.address
    //     }
    //     try {
    //         const res = await shippingService(address)
    //         const data = res && res.data ? res.data : '';
    //         setShippingFee(data.result)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    const handleshowCf = (e) => {
        e.preventDefault();

        if (checked.length > 0) {
            const isval = validateFull(userPay)
            setValiday(isval)
            if (Object.keys(isval).length > 0) return
            setShowAlertCf({
                open: true,
                variant: Notify.WARNING,
                text: 'Bạn chắc chắc muốn thanh toán',
                title: 'Xác nhận thanh toán',
                backdrop: 'static',
                onClick: () => handleClcikPayment()
            })
        } else {
            handelNotify('warn', 'Chưa chọn sản phẩm để thanh toán')
        }
    }
    const handleClcikPayment = async () => {
        const pay = {
            customerName: userPay.customerName,
            address: userPay.address + ' (' + shippingFee.distance + ' Km)',
            numberPhone: userPay.numberPhone,
            details: details,
            shippingFee: shippingFee.shippingFee
        }
        try {
            await paymentService(pay, token)
            setShowAlertCf({ open: false })
            let array = [...cart]
            details.forEach((item, index) => {
                cart.forEach((item1, index1) => {
                    if (item.productId === item1.productId) {
                        array.splice(index1, 1)
                    }
                })
            })
            setShowAlertCf1({
                open: true,
                variant: Notify.SUCCESS,
                text: 'Thanh toán thành công',
                title: 'Thành công',
                backdrop: 'static',
                onClick: () => handleSwitchCart()
            })
            dispatch(changeCart(array))
            sessionStorage.setItem('cart', JSON.stringify(array))
        } catch (error) {

        }
    }
    const handleSwitchCart = () => {
        navigate('/cart')
    }
    const handleChange = (e) => {
        const value = e.target.value
        setUserPay({
            ...userPay,
            [e.target.name]: value
        })
        console.log(userPay)
    }
    function VND(x) {
        return x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
    useEffect(() => {

    }, [shippingFee])
    useEffect(() => {
        let details = []
        checked && checked.length > 0 &&
            checked.forEach((item, index) => {
                console.log(checked)
                const product = {
                    productId: item.productId,
                    count: item.count,
                    price: item.total - ((item.price * (item.percent / 100)) * item.count)
                }
                details.push(product)
            })
        if (user) {
            setUserPay({
                customerName: user.fullname,
                address: user.address,
                numberPhone: user.numberPhone
            })
        } else {
            setUserPay({
                customerName: '',
                address: '',
                numberPhone: '',

            })
        }
        setDetails(details)
    }, [])


    const handleBlur = async () => {
        if (!userPay.address) {
            return;
        }
        const address = {
            address: userPay.address
        }
        try {
            setLoading(true)
            console.log(total);
            const res = await shippingService(address, token)
            const data = res && res.data ? res.data : '';
            setShippingFee(data)
            dispatch(userPayment({ ...total, total: (total.total + data.shippingFee - oldShip) }))
            console.log(total);
            setOldShip(data.shippingFee)
            setLoading(false)
        } catch (error) {
            handelNotify('warn', 'Tính phí ship thất bại')
        }
    }

    // let pathName = <button onClick={handleClickFocus} value='name' type="button" className="btn btn-secondary btnSua">Sửa</button>
    // let pathAdress = <button onClick={handleClickFocus} value='address' type="button" className="btn btn-secondary btnSua">Sửa</button>
    // let pathPhone = <button onClick={handleClickFocus} value='phone' type="button" className="btn btn-secondary btnSua">Sửa</button>
    // if (!isReadonly.address) {
    //     pathAdress = <button onClick={handleClickNotFocus} value='address' type="button" class="btn btn-success">Lưu</button>
    // }
    // if (!isReadonly.customerName) {
    //     pathName = <button onClick={handleClickNotFocus} value='name' type="button" class="btn btn-success">Lưu</button>
    // }
    // if (!isReadonly.numberPhone) {
    //     pathPhone = <button onClick={handleClickNotFocus} value='phone' type="button" class="btn btn-success">Lưu</button>
    // }
    return (
        <>
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

            <Modal
                show={showAlertCf1.open}
                onHide={handleSwitchCart}
                backdrop={showAlertCf1.backdrop}
                keyboard={false}
            >
                <Modal.Header style={{ backgroundColor: showAlertCf1.variant }} closeButton>
                    <Modal.Title>{showAlertCf1.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showAlertCf1.text}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={showAlertCf1.onClick} variant="primary">OK</Button>
                </Modal.Footer>
            </Modal>
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

            <div className="container" style={{ paddingTop: '80px' }}>
                <div className="row m-5 no-gutters shadow-lg payment-form">
                    <div className="col-md-6 d-none d-md-block">
                        <img src={require('~/assets/images/thanks.jpg')} className="img-fluid" style={{ minHeight: '100%' }} alt='' />
                    </div>
                    <div className="col-md-6 bg-white p-5">
                        <form onSubmit={handleshowCf}>

                            <div className="form-style mb-4">
                                <h4 className="pb-3 fw-bold">Thông tin thanh toán</h4>
                                <div className="form-group">
                                    <input type="text" onChange={handleChange} name='customerName' value={userPay.customerName} className="form-control" placeholder="Họ và tên" />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.customerName}</p>
                                </div>
                                <div className="form-group">
                                    <input type="text" onBlur={handleBlur} onChange={handleChange} name='address' value={userPay.address} className="form-control" placeholder="Địa chỉ" />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.address}</p>
                                </div>
                                <div className="form-group">
                                    <input type="text" onChange={handleChange} name='numberPhone' value={userPay.numberPhone} className="form-control" id="address" placeholder="Số điện thoại" />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.numberPhone}</p>
                                </div>
                                <div>
                                </div>
                            </div>
                            <h4 className="pb-3 fw-bold">Hoá đơn</h4>
                            <div>
                                <ul className="list-group mb-3">
                                    {checked && checked.length > 0 &&
                                        checked.map((item, index) => {
                                            return (
                                                <li key={index} className="list-group-item d-flex justify-content-between lh-condensed">
                                                    <div>
                                                        <h6 className="my-0">{item.name}</h6>
                                                        <small className="text-muted">{'x ' + item.count}</small>
                                                    </div>
                                                    <div className="box-item-content-2">
                                                        <p>{VND((item.price * (100 - item.percent) / 100) * item.count)}</p>
                                                        {item.percent > 0 && <del className="box-item-del">{VND(item.price * item.count)}</del>}
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                    <li className="list-group-item d-flex justify-content-between bg-light">
                                        <div className="text-success">
                                            <h6 className="my-0">Tiết kiệm: </h6>
                                            <small></small>
                                        </div>
                                        <span className="text-success">-{VND(total.totalSale)}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Phí ship: </span>
                                        <span>{shippingFee && shippingFee.shippingFee ? shippingFee.distance && VND(shippingFee.shippingFee)
                                            + ' (' + shippingFee.distance + 'km)' : '0 đ'
                                        }
                                        </span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Thành tiền: </span>
                                        <strong>{VND(total.total)}</strong>
                                    </li>
                                    <div className="form-group row pb-3">
                                        <div className="col-sm-10 d-flex mt-3">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="paymentMethod" id="inlineRadio1" value={1} defaultChecked />
                                                <label className="form-check-label form-radio-label" htmlFor="inlineRadio1">Thanh toán khi nhận hàng</label>
                                            </div>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                            <div className="pb-2">
                                <button type="submit" disabled={isLoading} className="btn btn-primary w-100 font-weight-bold mt-2" >
                                    {isLoading && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                    <span> {isLoading === false ? 'Thanh toán' : 'Đang tính phí ship'}</span>
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Payment