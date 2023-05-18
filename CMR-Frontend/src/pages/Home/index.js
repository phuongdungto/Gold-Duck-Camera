import React from 'react'
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Badge from 'react-bootstrap/Badge';

import './home.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import cookies from 'react-cookies'
import { useState, useEffect } from 'react';
import { handelNotify } from '~/core/utils/req';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer } from 'react-toastify';
import { Notify } from '~/core/constant';
import { forgotPasswordService } from '~/service/authService';
import { getProductsService } from '~/service/productService';
import { useNavigate } from "react-router-dom";
import Banner from "~/components/Layout/DefaultLayout/Banner"
import { getProductByIdService } from '~/service/productService';
import { useDispatch, useSelector } from 'react-redux';
import { changeCart } from '~/store/action/cartAction';

function Home() {
    const limit = 8
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart.cart);
    const [showAlertCf, setShowAlertCf] = useState(false);
    const dispatch = useDispatch()
    const productnew = {
        limit: limit,
        page: 1,
        sortBy: 'desc',
        sort: 'createdAt',
        sale: '',
    }
    const [products, setProducts] = useState()
    const getListProducts = async (list) => {
        try {
            const res = await getProductsService(list)
            const data = (res && res.data) ? res.data : [];
            setProducts(data.products)
        } catch (error) {
            console.log(error)
        }
    }
    const hadelCheckHasPw = () => {
        if (cookies.load('hasPassword')) {
            if (cookies.load('hasPassword') === 'false') {
                setShowAlertCf({
                    open: true,
                    variant: Notify.WARNING,
                    text: 'Bạn muốn đặt lại mật khẩu cho tài khoản này không?',
                    title: 'Đặt lại mật khẩu',
                    backdrop: 'static',
                    onClick: () => handelChangePass()
                })
            }
        }
    }
    const handelChangePass = async () => {
        try {
            const email = {
                email: cookies.load('user').email
            }

            const data = await forgotPasswordService(email)
            cookies.save('hasPassword', 'true')
            console.log(data)
            setShowAlertCf({
                open: false
            })
            handelNotify('success', 'Thông tin đặt lại mật khẩu đã được gửi vào email của bạn')
        } catch (error) {

        }
    }
    function VND(x) {
        return x = x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
    function oldPrice(price, percent) {
        if (percent !== 0) {
            const x = price;
            return x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        }
        return '';
    }
    const handelCloseCheck = async () => {
        cookies.save('hasPassword', 'true')
        setShowAlertCf({
            open: false
        })
    }
    const handleClickDetail = (item) => {
        navigate('/product/' + item)
    }
    useEffect(() => {
        hadelCheckHasPw()
    }, [])
    const handleAddcart = async (product, amount, type) => {
        const cartss = JSON.parse(sessionStorage.getItem('cart'))
        if (sessionStorage.getItem('amount')) {
            sessionStorage.setItem('amount', parseInt(sessionStorage.getItem('amount')) + amount)
        } else {
            sessionStorage.setItem('amount', parseInt(1))
        }
        console.log(sessionStorage.getItem('amount'))
        try {
            const res = await getProductByIdService(product)
            const data = res && res.data ? res.data : ''
            const datafill = {
                img1: data.img1,
                name: data.name,
                percent: data.percent,
                price: data.price,
                saleCodeId: data.saleCodeId,
                count: amount,
                productId: data.id,
                total: data.price * amount

            }
            let check = false
            const newCart = cart && cart.length > 0 && cart.map(obj => {
                if (obj.productId === product) {
                    check = true
                    return {
                        ...obj,
                        count: obj.count + amount,
                        total: parseInt(obj.price * (obj.count + amount))
                    };
                }

                return obj;
            });
            if (!cartss) {
                sessionStorage.setItem('cart', JSON.stringify([datafill]))
                dispatch(changeCart([datafill]))
            }
            if (check) {
                sessionStorage.setItem('cart', JSON.stringify(newCart))
                dispatch(changeCart(newCart))
            } else if (cartss && !check) {
                sessionStorage.setItem('cart', JSON.stringify([...cart, datafill]))
                dispatch(changeCart([...cart, datafill]))
            }
            if (type === 'buy') {
                navigate('/cart')
            }

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getListProducts(productnew)
        console.log(products)
    }, [])
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
                onHide={() => handelCloseCheck()}
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
                    <Button variant="secondary" onClick={handelCloseCheck}>
                        Hủy
                    </Button>
                    <Button onClick={showAlertCf.onClick} variant="primary">OK</Button>
                </Modal.Footer>
            </Modal>
            <Banner />
            <div className="container homeContain" style={{ marginTop: '3rem', color: '#3A4048' }}>

                <div className="row section-row" style={{ paddingTop: '2%', alignItems: 'center' }}>
                    <div className='col-0 col-xl-4'>
                        <img className="section-mid-img" src={require('~/assets/images/mayanh-gioithieu.jpg')} width="90%"
                            alt="Generic placeholder" />
                    </div>
                    <div className='col-0 col-xl-8'>
                        <h2> Máy ảnh tuyệt đỉnh. Hình ảnh tuyệt đẹp.</h2>
                        <p> Xứng tầm cột mốc mới, mở ra tầm nhìn nhiếp ảnh vượt trội, mang đến khả năng biểu đạt từng chi
                            tiết ở đẳng cấp chuyên nghiệp với tốc độ bắt nét cực nhanh đến kinh ngạc trong thân máy nhỏ gọn.
                            Độ cứng cáp với khả năng kết nối xuất sắc tăng thêm hiệu suất cho bạn. </p>
                    </div>

                </div>
                <div className="row section-row" style={{ paddingTop: '2%', alignItems: 'center' }}>
                    <div className='col-0 col-xl-8'>
                        <h2> Lưu lại những thước phim. Tạo nên nhiều kỉ niệm đáng nhớ. </h2>
                        <p> Thân máy nhỏ gọn, tích hợp mọi tính năng để mang lại những thước phim tuyệt đẹp. kèm theo khả
                            năng lấy nét siêu nhanh. Tính năng theo dõi trong thời gian thực và lấy nét tự động theo ánh
                            mắt. Chất lượng âm thanh bắt âm thanh cực xa.</p>
                    </div>
                    <div className='col-0 col-xl-4'>
                        <img className="section-mid-img"
                            src={require('~/assets/images/mayquay-gioithieu.jpg')} width="90%"
                            alt="Generic placeholder" />
                    </div>
                </div>
                <div className="row section-row" style={{ paddingTop: '2%', alignItems: 'center' }}>
                    <div className='col-0 col-xl-4'>
                        <img className="section-mid-img" src={require('~/assets/images/phukien-gioithieu.jpg')} width="90%"
                            alt="Generic placeholder" />
                    </div>
                    <div className='col-0 col-xl-8'>
                        <h2> Phụ kiện tuyệt vời.Tạo nên thiết bị hoàn hảo.</h2>
                        <p> Có rất nhiều phụ kiện cho để bạn lựa chọn. Giúp cho thiết bị của bạn thêm phần chuyên nghiệp,
                            khiến độ zoom cực xa cực kì sắc nét. Làm cho thiết bị của bạn an toàn, kéo dài thời gian sử
                            dụng. Để bạn làm chủ mọi khoảng khắc trong cuộc đời.</p>
                    </div>

                </div>
                <hr className='col-0' />
                <h2 className="title" style={{ textAlign: 'center', paddingBottom: '3rem' }}> MỚI NHẤT </h2>
                <div className="row">
                    {products && products.length > 0 &&
                        products.map((item, index) => {
                            return (
                                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
                                    <div className="wsk-cp-product" role="button" onClick={() => handleClickDetail(item.id)}>
                                        <div className="wsk-cp-img">
                                            <img className="img-responsive" src={process.env.REACT_APP_URL_IMG + item.img1} alt="Product" />
                                        </div>
                                        <div className="wsk-cp-text">
                                            <div className="wsk-buy">
                                                <span onClick={(e) => { e.stopPropagation(); handleAddcart(item.id, 1, 'buy') }}>Mua ngay</span>
                                            </div>
                                            <div className="title-product">
                                                <h6>{item.name}</h6>
                                            </div>
                                            <div className="card-footer">
                                                <div className="wcf-left">
                                                    <span className="price">
                                                        <span>{VND(item.price * (100 - item.percent) / 100)} </span>
                                                        {item.percent > 0 && <Badge bg="danger" className='percent'>-{item.percent}%</Badge>}
                                                        <br></br>
                                                        <p style={{ height: '12px', marginTop: '5px' }}><del className='text-secondary' style={{ textDecoration: 'line-through', fontStyle: 'italic' }}> {oldPrice(item.price, item.percent)}</del></p>
                                                    </span>
                                                </div>
                                                <div className="wcf-right">
                                                    <OverlayTrigger
                                                        key={'add-to-cart'}
                                                        placement='bottom'
                                                        overlay={
                                                            <Tooltip style={{ fontSize: '10px' }}>
                                                                Thêm Vào Giỏ Hàng
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <button onClick={(e) => { e.stopPropagation(); handleAddcart(item.id, 1, 'add') }} href="#" className="buy-btn" data-tip="Mua Ngay">
                                                            <FontAwesomeIcon icon={faShoppingCart} className='fa-icon' />
                                                        </button>
                                                    </OverlayTrigger>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
                <hr />

            </div>

        </>
    )
}

export default Home;