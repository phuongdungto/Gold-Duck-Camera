import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser, faGears } from '@fortawesome/free-solid-svg-icons';
import './sidebar.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

function Sidebar() {
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
                        <NavLink to="/admin/user" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                            <span className="sidebar-link">
                                <FontAwesomeIcon icon={faUser} />
                                <span>Quản lý tài khoản</span>
                            </span>
                        </NavLink>
                        <NavLink to="/admin/role" className={(navData) => "sidebar-item" + (navData.isActive ? " active" : " link")} >
                            <span className="sidebar-link">
                                <FontAwesomeIcon icon={faGears} />
                                <span>Quản lý phân quyền</span>
                            </span>
                        </NavLink>
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