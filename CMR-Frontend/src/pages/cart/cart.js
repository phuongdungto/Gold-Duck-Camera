import 'bootstrap/dist/css/bootstrap.min.css'
import './cart.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faTrashCan, faHouse, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { changeCart, checkCart, userPayment, changeAmount } from '~/store/action/cartAction';
import { getProductByIdService } from '~/service/productService';
import { handelNotify } from '~/core/utils/req';
import { ToastContainer } from 'react-toastify';
import Badge from 'react-bootstrap/Badge';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart.cart);
    const amount1 = useSelector(state => state.cart.amount)
    const [total, setTotal] = useState()

    
    const [checked, setChecked] = useState([]);
    const handleAddcart = async (product, amount) => {
        const cartss = JSON.parse(sessionStorage.getItem('cart'))
        try {
            const res = await getProductByIdService(product)
            const data = res && res.data ? res.data : ''

            let check = false
            const newCart = cart && cart.length > 0 && cart.map(obj => {
                if (obj.productId === product) {
                    check = true
                    if (obj.count === 1 && amount === -1) {
                        return {
                            ...obj,
                            count: 1,
                            total: obj.price * (100 - obj.percent) / 100
                        }
                    }
                    else {
                        return {
                            ...obj,
                            count: obj.count + amount,
                            total: parseInt(obj.price * (100 - obj.percent) / 100) * (obj.count + amount)
                        };
                    }
                }

                return obj;
            });
            if (check) {
                sessionStorage.setItem('cart', JSON.stringify(newCart))
                dispatch(changeCart(newCart))
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleSetcart = async (e) => {
        const amount = parseInt(e.target.value)
        const product = e.target.name
        let amount1 = amount
        if (e.target.value < 1) {
            amount1 = 1
        }
        const cartss = JSON.parse(sessionStorage.getItem('cart'))
        try {
            const res = await getProductByIdService(product)
            const data = res && res.data ? res.data : ''

            let check = false
            const newCart = cart && cart.length > 0 && cart.map(obj => {
                if (obj.productId === product) {
                    check = true
                    if (obj.count > 0)
                        return {
                            ...obj,
                            count: amount1,
                            total: obj.price * amount1
                        };
                }

                return obj;
            });
            if (check) {
                sessionStorage.setItem('cart', JSON.stringify(newCart))
                dispatch(changeCart(newCart))
            }
        } catch (error) {
            console.log(error)
        }
    }
    function VND(x) {
        return x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
    const handleCheck = (event) => {
        const value = JSON.parse(event.target.value)
        var updatedList = [...checked];
        console.log('🚀 ~ handleCheck ~ event.target.checked', event.target.checked);

        if (event.target.checked) {
            updatedList = [...checked, value];
        } else {
            updatedList.splice(checked.indexOf(value), 1);
        }
        setChecked(updatedList);
    }
    const handleSwitchPaymet = () => {
        if (checked.length > 0) {
            dispatch(checkCart(checked))
            dispatch(userPayment(total))
            navigate('/payment')
        } else {
            handelNotify('warn', 'Chọn sản phẩm cần thanh toán')
        }

    }
    const handleSwitchShopping = () => {
        navigate('/camera')
    }
    const deleteCart = (e) => {
        let array = [...cart]; // make a separate copy of the array
        cart.map((item, index) => {
            if (item.productId == e) {
                array.splice(index, 1)
                return
            }
        })
        dispatch(changeCart(array))
        sessionStorage.setItem('cart', JSON.stringify(array))
    }
    useEffect(() => {
        let totalPrice = 0, totalSale = 0, total = 0, amount = 0, amountcheck = 0

        cart && cart.length > 0 &&
            cart.map((item, index) => {
                amount += parseInt(item.count);
                checked && checked.length > 0 &&
                    checked.map((item1, index) => {
                        if (item1.productId == item.productId) {
                            amountcheck += item.count
                            totalPrice += (item.price * (100 - item.percent) / 100) * item.count
                            if (item.saleCodeId)
                                totalSale += ((item.price * item.percent) / 100) * item.count
                        }
                    })
            })
        total = totalPrice;
        setTotal({
            totalPrice: total,
            totalSale: totalSale,
            total: total,
            amount: amountcheck
        })
        dispatch(changeAmount(amount))
        sessionStorage.setItem('amount', amount)
    }, [checked, cart])
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
            <div className="container cartbody">

                <div className="row" style={{ paddingBlock: " 10%" }}>
                    <aside className="col-lg-9">
                        <div className="card rounded" >
                            <div className="">
                                <table className="table table-borderless table-shopping-cart">
                                    <thead className="text-muted">
                                        <tr className="small">
                                            <th scope="col" width="50"></th>
                                            <th scope="col" width="150">Sản phẩm</th>
                                            <th scope="col" width="300"></th>
                                            <th scope="col" width="120">Số lượng</th>
                                            <th scope="col" width="250" >Đơn giá</th>
                                            <th scope="col" width="250">Tổng cộng</th>
                                            <th scope="col" className="" width="50"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart && cart.length > 0 &&
                                            cart.map((item, index) => {
                                                return (
                                                    <tr key={item.productId}>
                                                        <td>
                                                            <div className="form-check">
                                                                <input onChange={handleCheck} value={JSON.stringify(item)} className="form-check-input" type="checkbox" id="check1" name="option1" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="aside"><img src={process.env.REACT_APP_URL_IMG + item.img1} width={'90%'} alt="" /></div>

                                                        </td>
                                                        <td><p className="text-break mb-0">{item.name}</p></td>
                                                        <td>
                                                            <div className='product-amount'>
                                                                <input type='number' onChange={handleSetcart} name={item.productId} value={item.count} step="1" min="1" max="999" />
                                                                <button onClick={() => handleAddcart(item.productId, 1)} value='1' className='amount-plus'>
                                                                    +
                                                                </button>
                                                                <button onClick={() => handleAddcart(item.productId, -1)} value='-1' className='amount-minus'>
                                                                    -
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="price-wrap"><p className="mb-0">{VND(item.price * (100 - item.percent) / 100)} </p>
                                                                {item.percent > 0 && <del style={{ fontSize: '11px', marginRight: '5px' }}>{VND(item.price)}</del>}
                                                                {item.percent > 0 && <Badge bg="danger" className='percent'>-{item.percent}%</Badge>}
                                                            </div>

                                                        </td>
                                                        <td><div className="price-wrap"><p className=" mb-0">{VND(item.total)}</p></div></td>
                                                        <td><FontAwesomeIcon onClick={() => deleteCart(item.productId)} icon={faTrashCan} className='fa-trash' /></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </aside>
                    <aside className="col-lg-3">

                        <div className="card rounded">
                            <div className="card-body">
                                <dl className="dlist-align row">
                                    <dt>Tạm tính: </dt>
                                    <dd className="text-right ml-3 ">{total && VND(total.totalPrice)}</dd>
                                </dl>
                                <dl className="dlist-align">
                                    <dt>Tiết kiệm: </dt>
                                    <dd className="text-right text-danger ml-3">{total && VND(total.totalSale)}</dd>
                                </dl>
                                <dl className="dlist-align">
                                    <dt>Tổng cộng: </dt>
                                    <dd className="text-right text-dark b ml-3"><strong>{total && VND(total.total)}</strong></dd>
                                </dl>
                                <hr />
                                <button onClick={handleSwitchPaymet} className="btn btn-primary btn-main" data-abc="true"> Tiến hành thanh toán </button>
                                <button onClick={handleSwitchShopping} className="btn btn-out btn-outline-secondary btn-main mt-2" data-abc="true">Tiếp tục mua hàng</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    )
}

export default Cart