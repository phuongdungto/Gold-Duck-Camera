import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { faEmpire } from '@fortawesome/free-brands-svg-icons';
import { faCameraRetro, faVideo, faWrench, faPhone, faBars, faHouse } from '@fortawesome/free-solid-svg-icons';
import './sidebar.scss';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom'

function Sidebar() {
    const dispatch = useDispatch()
    return (
        <Navbar expand="lg" className='header-menu'>
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'yellow' }}><FontAwesomeIcon icon={faBars} className='fa-icon' style={{ marginLeft: '10px' }} /></Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav" className='row'>
                    <Nav className="me-auto" style={{ width: '100%' }}>
                        <NavLink to="/Home" className={(navData) => "menu-item col-xl-2" + (navData.isActive ? " active" : " link")} ><span><FontAwesomeIcon icon={faHouse} className='fa-icon' />Home</span></NavLink>
                        <NavLink to="/camera" className={(navData) => "menu-item col-xl-2" + (navData.isActive ? " active" : " link")} ><span><FontAwesomeIcon icon={faCameraRetro} className='fa-icon' />Máy ảnh</span></NavLink>
                        <NavLink to="/videocam" className={(navData) => "menu-item col-xl-2" + (navData.isActive ? " active" : " link")} ><span><FontAwesomeIcon icon={faVideo} className='fa-icon' />Máy quay</span></NavLink>
                        <NavLink to="/accessory" className={(navData) => "menu-item col-xl-2" + (navData.isActive ? " active" : " link")} ><span><FontAwesomeIcon icon={faEmpire} className='fa-icon' />phụ kiện</span></NavLink>
                        <NavLink to="/guarantee" className={(navData) => "menu-item col-xl-2" + (navData.isActive ? " active" : " link")}><span><FontAwesomeIcon icon={faWrench} className='fa-icon' />bảo hành</span></NavLink>
                        <NavLink to="/contact" className={(navData) => "menu-item col-xl-2" + (navData.isActive ? " active" : " link")} ><span><FontAwesomeIcon icon={faPhone} className='fa-icon' />liên hệ</span></NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Sidebar;