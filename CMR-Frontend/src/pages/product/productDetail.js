import 'bootstrap/dist/css/bootstrap.min.css'
import './productDetail.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { getProductByIdService } from '~/service/productService';
import { getBrandByIdService } from '~/service/brandService';
import { getCategoryByIdService } from '~/service/categoryService';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { changeCart } from '~/store/action/cartAction';
import { handelNotify } from '~/core/utils/req';
import { ToastContainer } from 'react-toastify';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { getProductsService } from '~/service/productService';

const ProductDetail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart.cart);
    const { id } = useParams();
    const [images, setImages] = useState('');
    const [showImg, setShowImg] = useState('')
    const [product, setProduct] = useState('')
    const [products, setProducts] = useState()
    const [isActive, setIsActive] = useState(false);
    const [count, setCount] = useState(1);

    const limit = 4;
    const [productnew, setProductnew] = useState({
        limit: limit,
        page: 1,
        sortBy: 'desc',
        sort: 'createdAt',
        sale: '',
    });

    const getProduct = async () => {
        try {
            const respro = await getProductByIdService(id);
            const data1 = respro && respro.data ? respro.data : [];
            const resbra = await getBrandByIdService(data1.brandId)
            const data2 = resbra && resbra.data ? resbra.data : [];
            const rescate = await getCategoryByIdService(data1.categoryId)
            const data3 = rescate && rescate.data ? rescate.data : [];
            setProduct({
                ...data1,
                brandId: data2.name,
                categoryId: data3.name
            })
            setImages(data1.img1);
        } catch (error) {

        }
    }


    const getListProducts = async (list) => {
        try {
            const res = await getProductsService(list)
            const data = (res && res.data) ? res.data : [];
            setProducts(data.products)
        } catch (error) {
            console.log(error)
        }
    }

    const handleClickDetail = (item) => {
        navigate('/product/' + item)
    }
    const handleAddcart = async (product, amount, type) => {
        const cartss = JSON.parse(sessionStorage.getItem('cart'))
        if (sessionStorage.getItem('amount')) {
            sessionStorage.setItem('amount', parseInt(sessionStorage.getItem('amount')) + parseInt(amount))
        } else {
            sessionStorage.setItem('amount', parseInt(parseInt(amount)))
        }
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
                total: data.price * amount - (data.price * amount - (data.price * (100 - data.percent) / 100))

            }
            let check = false
            const newCart = cart && cart.length > 0 && cart.map(obj => {
                if (obj.productId === product) {
                    check = true
                    return {
                        ...obj,
                        count: parseInt(obj.count + amount),
                        total: parseInt(obj.price * (100 - obj.percent) / 100) * (obj.count + amount)
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
            if (type === 'addcart') {
                handelNotify('success', 'Thêm vào giỏ hàng thành công')
            }
            if (type === 'buy') {
                navigate('/cart')
            }

        } catch (error) {
            console.log(error)
        }
    }
    const handleAddcart2 = async (product, amount, type) => {
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
                total: data.price * amount - ((data.price * amount) - (data.price * (100 - data.percent) / 100))

            }
            let check = false
            const newCart = cart && cart.length > 0 && cart.map(obj => {
                if (obj.productId === product) {
                    check = true
                    return {
                        ...obj,
                        count: obj.count + amount,
                        total: parseInt(obj.price * (100 - obj.percent) / 100) * (obj.count + amount)
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
    }, [productnew])
    const handleChangeCount = (e) => {
        const value = parseInt(e.target.value)
        console.log(value)
        if (e.target.value < 1) {
            setCount(1)
        }
        else {
            setCount(value)
        }
    }
    const handleCickCount = (e) => {
        const value = parseInt(e.target.value)
        if (count === 1 && value === -1) {
            setCount(1)
        }
        else {
            setCount(count + value)
        }
    }
    const handleClickImage = (img) => {
        setImages(img);
        setIsActive(current => !current);
    };
    function VND(x) {
        return x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }

    function oldPrice(price, percent) {
        if (percent != 0) {
            const x = price;
            return x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        }
        return '';
    }
    useEffect(() => {
        getProduct()
    }, [id])
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
            <div className="container bodyDetail">
                <div className="card1">
                    <div className="container" style={{ marginTop: '5%' }}>
                        <div className="row tab-pane">
                            <div className=" wrapper preview col-md-5">
                                <div className="preview-pic tab-content m-3">
                                    <div className=" active" id="pic-1"><img className="img-fluid" src={process.env.REACT_APP_URL_IMG + images} alt="" /></div>
                                </div>
                            </div>
                            <div className="wrapper details col-md-7">
                                <h3 className="product-title px-3 mt-3">{product.name}</h3>
                                <span className="px-3 ">
                                    <span className='text-danger h5 fw-bold'>{product && product.price && VND(product.price * (100 - product.percent) / 100)}</span>
                                    {product && product.percent > 0 &&
                                        <span>
                                            <del className='text-secondary px-2'>{VND(product.price)}</del>
                                            <Badge bg="danger" className='py-2'>-{product.percent}%</Badge>
                                        </span>
                                    }
                                    <hr ></hr>
                                </span>
                                <p className="price px-3">Thương hiệu: <span>{product.brandId}</span></p>
                                <p className="price px-3">Bảo hành: <span>{product.warrantyPeriod} năm</span></p>
                                <p className="price px-3">Mô tả:</p>
                                <p className="product-description px-3">{product.description}<hr></hr></p>

                                <p className="price px-3">Số lượng: </p>
                                <div className='count-product mx-3'>
                                    <input onChange={handleChangeCount} type='number' step="1" min="1" max="999" value={count} />
                                    <button onClick={handleCickCount} value='1' className='amount-plus'>
                                        +
                                    </button>
                                    <button onClick={handleCickCount} value='-1' className='amount-minus'>
                                        -
                                    </button>
                                </div>

                            </div>
                            <div className='wrapper preview col-md-5 py-2'>
                                <ul className="preview-thumbnail mx-3 nav nav-tabs">
                                    <li className='m-2'>
                                        <a href='#pic-1' data-target="#pic-1" data-toggle="tab">
                                            <img
                                                onClick={(e) => handleClickImage(product.img1, e)}
                                                className={!isActive ? 'my-img-thumbnail my-img-thumbnail-active' : 'my-img-thumbnail'}
                                                src={process.env.REACT_APP_URL_IMG + product.img1}
                                                alt="" />
                                        </a>
                                    </li>
                                    <li className='m-2'>
                                        <a href='#pic-2' data-target="#pic-2" className='ml-3' data-toggle="tab">
                                            <img
                                                onClick={() => handleClickImage(product.img2)}
                                                className={isActive ? 'my-img-thumbnail my-img-thumbnail-active' : 'my-img-thumbnail'}
                                                src={process.env.REACT_APP_URL_IMG + product.img2}
                                                alt=""
                                            />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="wrapper preview col-md-6"><div className="action">
                                <button onClick={() => handleAddcart(product.id, count, 'addcart')} className="add-to-cart buy btn" type="button">
                                    <FontAwesomeIcon icon={faCartShopping} className='fa-icon' />
                                    <span>       </span>Thêm giỏ hàng
                                </button>
                                <button onClick={() => handleAddcart(product.id, count, 'buy')} className="add-to-cart btn buy-now" type="button">
                                    <span>       </span>Mua ngay
                                </button>
                            </div></div>
                        </div>
                        <h2 className="title" style={{ textAlign: 'center', marginTop: '5%', marginBottom: '20px' }}> CÁC SẢN PHẨM TƯƠNG TỰ </h2>
                        <div className='row'>
                            {products && products.length > 0 &&
                                products.map((item, index) => {
                                    return (
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <div className="wsk-cp-product" role="button" onClick={() => handleClickDetail(item.id)}>
                                                <div className="wsk-cp-img">
                                                    <img className="img-responsive" src={process.env.REACT_APP_URL_IMG + item.img1} alt="Product" />
                                                </div>
                                                <div className="wsk-cp-text">
                                                    <div className="wsk-buy">
                                                        <span onClick={(e) => { e.stopPropagation(); handleAddcart2(item.id, 1, 'buy') }}>Mua ngay</span>
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
                                                                <button onClick={(e) => { e.stopPropagation(); handleAddcart2(item.id, 1, 'add') }} href="#" className="buy-btn" data-tip="Mua Ngay">
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
                    </div>
                </div>
            </div>
        </>
    )

}

export default ProductDetail