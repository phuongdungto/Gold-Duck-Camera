import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import './login.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingBasket, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react'
import { loginService } from '~/service/authService'
import validator from 'validator';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { adminLogin } from '~/store/action/adminAction';
import cookies from 'react-cookies'
const LoginAdmin = () => {
    const [login, setLogin] = useState({
        email: "",
        password: ""
    });
    const [validate, setValidate] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const handleChange = e => {
        const value = e.target.value;

        setLogin({
            ...login,
            [e.target.name]: value
        });
    };
    const handleOnclick = async () => {
        const isValid = validateAll();
        console.log(isValid);
        if (!isValid) return
        try {
            let response = await loginService(login);
            const data = response.data;
            console.log(data)

            if (data.information.role !== 'customer') {
                cookies.save("Tokenadmin", data.accessToken, { path: '/' })
                cookies.save("admin", data.information, { path: '/' })
                dispatch(adminLogin(data.information))
                if (cookies.load("admin")) {
                    if (cookies.load('admin').role === 'admin') {
                        navigate('/admin/user');
                    } else if (cookies.load('admin').role === 'manager') {
                        navigate('/store/user');
                    } else if (cookies.load('admin').role === 'staff') {
                        navigate('/store/product');
                    } else if (cookies.load('admin').role === 'shipper') {
                        navigate('/store/shippernew');
                    }
                }
            } else {
                alert('Tài khoản này không có quyền truy cập');
            }
        } catch (e) {
            if (e.response.data.error[0].field) {
                alert(e.response.data.error[0].message)
            }
            else {
                alert(e.response.data.error)
            }
            console.log(e)
        }
    }
    const validateAll = () => {
        const msg = {}
        if (validator.isEmpty(login.email)) {
            msg.email = "Please input your Email"
        } else {
            if (!validator.isEmail(login.email)) {
                msg.email = "Incorrect data in email"
            }
        }

        if (validator.isEmpty(login.password)) {
            msg.password = "Please input your Password"
        }
        else {
            if (login.password.length < 8) {
                msg.password = '"password" length must be at least 8 characters'
            }
        }
        setValidate(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }
    return (
        <>
            <div className="auth container-fluid" style={{ fontFamily: 'Nunito !important', color: '#25396f' }}>

                <div className="row h-100">
                    <div className="col-lg-6 col-12" >
                        <div className="auth-left">
                            <h1 className="auth-title">Đăng nhập.</h1>
                            <p className="auth-subtitle mb-5">Nhập thông tin của bạn để đăng nhập.</p>
                            <Form>
                                <Form.Group className="mb-4" controlId="formBasicEmail" >
                                    <Form.Control onChange={handleChange} style={{ padding: '13.6px 16px 13.6px 48px' }} size='lg' type="email" name="email" placeholder="Tên đăng nhập" />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.email}</p>
                                </Form.Group>
                                <Form.Group className="mb-5" controlId="formBasicPassword">
                                    <Form.Control onChange={handleChange} style={{ padding: '13.6px 16px 13.6px 48px' }} size='lg' type="password" name="password" placeholder="Mật khẩu" />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.password}</p>
                                </Form.Group>
                                <Button type='button' onClick={handleOnclick} variant="primary" className='mt-4 w-100' style={{ padding: '13.6px 16px 13.6px 48px', backgroundColor: '#435ebe', borderColor: '#435ebe', fontSize: '20px' }}>
                                    Đăng nhập
                                </Button>
                            </Form>
                        </div>
                    </div>
                    <div className="col-lg-6 d-none d-lg-block">
                        <div className="auth-right">
                            <img src={require('~/assets/images/mayanh-tieubieu.jpg')} className=" d-block" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default LoginAdmin;