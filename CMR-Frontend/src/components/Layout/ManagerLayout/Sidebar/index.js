import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCamera, faCartFlatbed, faCheck, faDollar, faDollarSign, faHouse, faList, faMoneyBill, faMoneyCheckDollar, faTags, faTruckFieldUn, faTruckFast, faSignal } from '@fortawesome/free-solid-svg-icons';
import './sidebar.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import cookies from 'react-cookies'

function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const admin = cookies.load('admin')
    return (
        <div className="active sidebar">
            <div className="sidebar-wrapper active">
                <div className="sidebar-header">
                    <div className="d-flex justify-content-center">
                        <div className="logo">
                            <img style={{ borderRadius: '100%' }} src={require('~/assets/images/logo.jpg')} alt="Logo" />
                        </div>
                        <div className="toggler">
                            <a href="#" className="sidebar-hide d-xl-none d-block"><i className="bi bi-x bi-middle"></i></a>
                        </div>
                    </div>
                </div>
                <div className="sidebar-menu">
                    <ul className="menu">
                        {admin && admin.role == 'manager' &&
                            <NavLink to="/store/user" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                                <span className="sidebar-link">
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>Quản lý tài khoản</span>
                                </span>
                            </NavLink>
                        }


                        {admin && admin.role != 'shipper' &&
                            <>
                                <NavLink to="/store/product" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                                    <span className="sidebar-link">
                                        <FontAwesomeIcon icon={faCamera} />
                                        <span>Quản lý sản phẩm</span>
                                    </span>
                                </NavLink>
                                <NavLink to="/store/brand" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                                    <span className="sidebar-link">
                                        <FontAwesomeIcon icon={faCheck} />
                                        <span>Quản lý thương hiệu</span>
                                    </span>
                                </NavLink>
                                <NavLink to="/store/categories" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                                    <span className="sidebar-link">
                                        <FontAwesomeIcon icon={faList} />
                                        <span>Quản lý danh mục</span>
                                    </span>
                                </NavLink>
                                <NavLink to="/store/bill" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                                    <span className="sidebar-link">
                                        <FontAwesomeIcon icon={faMoneyBill} />
                                        <span>Quản lý hóa đơn</span>
                                    </span>
                                </NavLink>
                                <NavLink to="/store/salecode" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                                    <span className="sidebar-link">
                                        <FontAwesomeIcon icon={faTags} />
                                        <span>Quản lý mã giảm giá</span>
                                    </span>
                                </NavLink>
                                <NavLink to="/store/supplier" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                                    <span className="sidebar-link">
                                        <FontAwesomeIcon icon={faTruckFieldUn} />
                                        <span>Quản lý nhà cung cấp</span>
                                    </span>
                                </NavLink>
                                <NavLink to="/store/purchase" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                                    <span className="sidebar-link">
                                        <FontAwesomeIcon icon={faDollarSign} />
                                        <span>Quản lý đơn nhập hàng</span>
                                    </span>
                                </NavLink>
                            </>
                        }

                        {admin && admin.role == 'shipper' &&
                            <>
                                <NavLink to="/store/shippernew" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                                    <span className="sidebar-link">
                                        <FontAwesomeIcon icon={faTruckFast} />
                                        <span>Đơn mới</span>
                                    </span>
                                </NavLink>
                                <NavLink to="/store/shipper" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                                    <span className="sidebar-link">
                                        <FontAwesomeIcon icon={faTruckFast} />
                                        <span>Đơn đã nhận</span>
                                    </span>
                                </NavLink>
                            </>
                        }
                    </ul>
                </div>
                <button className="sidebar-toggler btn x">
                    <i data-feather="x"></i>
                </button>
            </div>
        </div>
    )
}

export default Sidebar;