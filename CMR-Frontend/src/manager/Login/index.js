import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import './login.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
function LoginManager() {
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
                                    <Form.Control style={{ padding: '13.6px 16px 13.6px 48px' }} size='lg' type="email" placeholder="Tên đăng nhập" />
                                </Form.Group>
                                <Form.Group className="mb-5" controlId="formBasicPassword">
                                    <Form.Control style={{ padding: '13.6px 16px 13.6px 48px' }} size='lg' type="password" placeholder="Mật khẩu" />
                                </Form.Group>
                                <Button variant="primary" type="submit" className='mt-4 w-100' style={{ padding: '13.6px 16px 13.6px 48px', backgroundColor: '#435ebe', borderColor: '#435ebe', fontSize: '20px' }}>
                                    Đăng nhập
                                </Button>
                            </Form>
                        </div>
                    </div>
                    <div className="col-lg-6 d-none d-lg-block">
                        <div className="auth-right">
                            <img src={require('~/assets/images/mayquay-gioithieu.jpg')} className=" d-block" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default LoginManager;