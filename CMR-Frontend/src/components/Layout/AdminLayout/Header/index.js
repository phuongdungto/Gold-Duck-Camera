import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
import './header.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import cookies from 'react-cookies';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '~/store/action/adminAction';
import validator from 'validator';
import { ChangePasswordAdminService } from '~/service/userService';


function Header() {
    const admin = useSelector(state => state.admin.admin);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [showNav, setShowNav] = useState(true);
    const [show, setShow] = useState(false);
    const handleshowChange = () => {
        setValidate('')
        setChange({
            currentPassword: "",
            newPassword: ""
        });
        setConfirmPass({
            repass: "",
        })
        setShow(true)
    };
    const handleOnclickLogout = () => {
        cookies.remove("Tokenadmin", { path: '/' })
        cookies.remove("admin", { path: '/' })
        dispatch(adminLogout());
        navigate('/admin/login');
    }

    let name = "";
    if (admin !== undefined && admin !== null) {
        let arrName = admin.fullname.split(' ');
        if (arrName.length < 1) {
            name = admin.fullname
        } else {
            name += arrName[arrName.length - 1];
        }
    }

    const [validate, setValidate] = useState('')
    const handleClose = () => setShow(false);
    const [change, setChange] = useState({
        currentPassword: "",
        newPassword: ""
    });
    const [confirmPass, setConfirmPass] = useState({
        repass: "",
    })

    const handleChangePassword = e => {
        const value = e.target.value;
        setChange({
            ...change,
            [e.target.name]: value
        });
    }
    const RePassword = e => {
        const value = e.target.value;
        setConfirmPass({
            ...confirmPass,
            [e.target.name]: value
        });
        console.log(confirmPass)
    }
    const handeClickChangePassword = async (e) => {
        e.preventDefault();
        const isValid = validateAll()
        if (!isValid) return
        try {
            let token = cookies.load('Tokenadmin');
            let response = await ChangePasswordAdminService(change, token);
        } catch (e) {
            console.log(e);
        }

    }
    const validateAll = () => {
        const msg = {}
        if (validator.isEmpty(change.currentPassword)) {
            msg.passwordcCurrent = "Please input your Current Password"
        } else {
            if (change.currentPassword.length < 8) {
                msg.passwordcCurrent = '"password" length must be at least 8 characters'
            }
        }

        if (validator.isEmpty(change.newPassword)) {
            msg.passwordNew = "Please input your New Password"
        }
        else {
            if (change.newPassword.length < 8) {
                msg.passwordNew = '"password" length must be at least 8 characters'
                console.log('1')
            }
            console.log('1')
        }
        if (validator.isEmpty(confirmPass.repass)) {
            msg.passwordConfirm = "Please input your Confirm Password"
        } else {
            if (confirmPass.repass !== change.newPassword) {
                msg.passwordConfirm = "Confirm password is incorect"
            }
        }
        setValidate(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }

    return (
        <><Modal className='ModalResetpass' show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật lại mật khẩu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form method='PUT'>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Mật khẩu cũ:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="currentPassword"
                            defaultValue={change.currentPassword}
                            onChange={handleChangePassword}
                            autoFocus
                        />
                        <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.passwordcCurrent}</p>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Mật khẩu mới:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="newPassword"
                            onChange={handleChangePassword}
                            defaultValue={change.newPassword}
                            autoFocus
                        />
                        <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.passwordNew}</p>
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Nhập lại mật khẩu:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="repass"
                            defaultValue={confirmPass.repass}
                            onChange={RePassword}
                            autoFocus
                        />
                        <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.passwordConfirm}</p>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" type="submit" onClick={handeClickChangePassword}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
            <header className="mb-3">
                <nav className="navbar navbar-expand navbar-light" style={{ height: '60px', paddingBottom: '0px' }}>
                    <div className="container-fluid">
                        <a href="#" className="burger-btn d-block">
                            <i className="bi bi-justify fs-3"></i>
                        </a>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            </ul>
                            <div className="dropdown">
                                <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                    {showNav ? (
                                        <div className="user-menu d-flex" onClick={() => setShowNav(false)}>
                                            <div className="user-name text-end me-3">
                                                <h6 className="mb-0 text-gray-600">{admin !== undefined && admin !== null && <>{name}</>}</h6>
                                                <p className="mb-0 text-sm text-gray-600" id="mail">{admin !== undefined && admin !== null && <>{admin.email}</>}</p>
                                            </div>
                                            <div className="user-img d-flex align-items-center">
                                                <div className="avatar avatar-md">
                                                    <img src={require('~/assets/images/logo.jpg')} />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="user-menu d-flex" onClick={() => setShowNav(true)}>
                                            <div className="user-name text-end me-3">
                                                <h6 className="mb-0 text-gray-600">{admin !== undefined && admin !== null && <>{name}</>}</h6>
                                                <p className="mb-0 text-sm text-gray-600" id="mail">{admin !== undefined && admin !== null && <>{admin.email}</>}</p>
                                            </div>
                                            <div className="user-img d-flex align-items-center">
                                                <div className="avatar avatar-md">
                                                    <img src={require('~/assets/images/logo.jpg')} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </a>
                                <ul className={(!showNav ? 'show' : '') + " dropdown-menu dropdown-menu-end"} aria-labelledby="dropdownMenuButton">
                                    <li>
                                        <h6 className="dropdown-header">{admin !== undefined && admin !== null && <>{admin.email}</>}</h6>
                                    </li>
                                    <li stye={{ backgroundColor: '#fff !important' }} onClick={handleshowChange}>
                                        <button className="btn-changepass" style={{ background: '#fff' }}><a id='open-change-pass-btn' className="dropdown-item" ><i className="icon-mid bi bi-key me-2"></i> Đổi mật khẩu</a></button>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li id="logout" onClick={handleOnclickLogout}   >
                                        <a className="dropdown-item" ><i className="icon-mid bi bi-box-arrow-left me-2"></i>
                                            Đăng Xuất</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Header;