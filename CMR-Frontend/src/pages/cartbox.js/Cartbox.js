import React from "react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import './Cartbox.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
const CartBox = () => {
    const [isOpen, setisOpen] = useState(false);
    const cart = useSelector(state => state.cart.cart);
    const wrapperRef = useRef();
    const showBox = () => {
        setisOpen(!isOpen);
    }
    function VND(x) {
        return x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setisOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };
    }, []);
    return (
        <div className="popup-box" ref={wrapperRef}>
            <button className={isOpen === true ? "btn-click btn-popup" : "btn-popup"} onClick={() => showBox()}>
                <FontAwesomeIcon icon={faShoppingCart} className='fa-icon' />
            </button>
            <div className={isOpen === true ? "box-body" : "box-body box-hiden"}>
                <div className="box-content">
                    <div className="box-header">
                        <div className="box-title">SẢN PHẨM TRONG GIỎ HÀNG</div>
                        <button className="box-btn-close" onClick={() => showBox()}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                fill="currentColor"
                                className="bi bi-x"
                                viewBox="0 0 16 16"
                            >
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </button>
                    </div>
                    <div className="box-list-item">
                        {cart && cart.length > 0 && cart.map((element, index) => {
                            return (
                                <Link to={`/product/${element.productId}`} className="box-item" key={index} onClick={() => showBox()}>
                                    <div className="box-icon">
                                        <img src={process.env.REACT_APP_URL_IMG + element.img1} alt="" />
                                    </div>
                                    <div className="box-item-content"><span className="count-item">{element.count}x </span>{element.name}
                                    </div>
                                    <div className="box-item-content-2">
                                        <p>{VND(element.price * (100 - element.percent) / 100)}</p>
                                        {element.percent > 0 && <del className="box-item-del">{VND(element.price)}</del>}
                                    </div>

                                </Link>
                            )
                        })}
                    </div>
                    <div className="box-footer" >
                        <Link to='/cart' onClick={() => showBox()}>Xem tất cả</Link>
                    </div>
                </div>
                <div className="box-triangle"></div>
            </div>
        </div>
    )
}
export default React.memo(CartBox)