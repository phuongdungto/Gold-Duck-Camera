import 'bootstrap/dist/css/bootstrap.min.css';
import './signup.scss'
import { useState } from 'react'
import { signupService } from '~/service/authService'
import { Gender } from '~/core/constant'
import { useNavigate } from "react-router-dom";
import { validateFull } from '~/core/utils/validate';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Notify } from '~/core/constant';
import { handelNotify } from '~/core/utils/req';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
const Signup = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
        fullname: "",
        birthday: "",
        address: "",
        gender: Gender.MALE,
        numberPhone: "",
        confirmPassword: ""
    });
    const [showAlertCf, setShowAlertCf] = useState({
        open: false
    });
    const [validate, setValidate] = useState('')
    const navigate = useNavigate();
    const handleChange = e => {
        const value = e.target.value;

        setUser({
            ...user,
            [e.target.name]: value
        });
    };
    const handleChangeOnClick = async (e) => {
        e.preventDefault();

        const isValid = validateFull(user)
        setValidate(isValid)
        if (Object.keys(isValid).length > 0) return
        try {
            const email = {
                email: user.email
            }
            await signupService(user);
            // await requestOtpService(email)
            sessionStorage.setItem('emailUser', email.email)
            setShowAlertCf({
                open: true,
                variant: Notify.SUCCESS,
                text: 'Mã xác nhận email đã được gửi vào tài khoản của bạn',
                title: 'Đăng ký thành công',
                backdrop: 'static',
                onClick: () => navigate('/signup/otp/confirm')
            })
        } catch (e) {
            console.log(e.response.data.error)
            if (e.response.data.error) {
                const map = {
                    'Email already existed': 'Email đã tồn tại, vui lòng nhập email khác'
                }
                const message = map[e.response.data.error] || e.response.data.error

                handelNotify('error', message)
            }
        }
    }

    return (
        <>
            <ToastContainer />
            <Modal
                show={showAlertCf.open}
                onHide={() => setShowAlertCf({ open: false })}
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
                    <Button variant="secondary" >
                        Hủy
                    </Button>
                    <Button onClick={showAlertCf.onClick} variant="primary">OK</Button>
                </Modal.Footer>
            </Modal>
            <div className="container" style={{ paddingTop: '80px' }}>
                <div className="row m-5 no-gutters shadow-lg sign-up-form">
                    <div className="col-md-6 d-none d-md-block">
                        <img src={require('~/assets/images/register-banner.jpg')} className="img-fluid" style={{ minHeight: '100%' }} alt='' />
                    </div>
                    <div className="col-md-6 bg-white p-5">
                        <h2 className="pb-3 fw-bold">Đăng ký</h2>
                        <div className="form-style">
                            <form onSubmit={handleChangeOnClick}>
                                <div className="form-group pb-3">
                                    <input type="text" placeholder="Họ và tên" className="form-control" onChange={handleChange} value={user.fullname} name="fullname" autoFocus />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.fullname}</p>
                                </div>
                                <div className="form-group pb-3">
                                    <input type="email" placeholder="Email" className="form-control" onChange={handleChange} value={user.email} name="email" />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.email}</p>
                                </div>
                                <div className="form-group pb-3">
                                    <input type="password" placeholder="Mật khẩu" className="form-control" name='password' onChange={handleChange} />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.password}</p>
                                </div>
                                <div className="form-group pb-3">
                                    <input type="password" placeholder="Nhập lại mật khẩu" className="form-control" onChange={handleChange} value={user.confirmPassword} name="confirmPassword" />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.confirmPassword}</p>
                                </div>
                                <div className="form-group pb-3">
                                    <input type="text" placeholder="Địa chỉ" className="form-control" onChange={handleChange} value={user.address} name="address" />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.address}</p>
                                </div>
                                <div className="form-group pb-3">
                                    <input type="text" placeholder="Số điện thoại" className="form-control" onChange={handleChange} value={user.numberPhone} name="numberPhone" />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.numberPhone}</p>
                                </div>
                                <div className="form-group pb-3">
                                    <input type="date" placeholder="Ngày sinh" className="form-control" onChange={handleChange} value={user.birthday} name="birthday" />
                                    <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.birthday}</p>
                                </div>
                                <div className="form-group row pb-3">
                                    <div className="col-sm-10 d-flex justify-content-center">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="inlineRadio1" onChange={handleChange} value={Gender.MALE} defaultChecked />
                                            <label className="form-check-label form-radio-label" htmlFor="inlineRadio1">Nam</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="inlineRadio2" onChange={handleChange} value={Gender.FEMALE} />
                                            <label className="form-check-label form-radio-label" htmlFor="inlineRadio2">Nữ</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="inlineRadio3" onChange={handleChange} value={Gender.OTHER} />
                                            <label className="form-check-label form-radio-label" htmlFor="inlineRadio3">Khác</label>
                                        </div>
                                        <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.gender}</p>
                                    </div>

                                </div>

                                <div className="pb-2">
                                    <button type="submit" className="btn btn-dark w-100 font-weight-bold mt-2" >Đăng ký</button>
                                </div>
                            </form>
                            <div className="pt-4 text-center">
                                Bạn đã có tài khoản? <Link to='/login'>Đăng nhập</Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>

    )
}

export default Signup;