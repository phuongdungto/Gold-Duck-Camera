import 'bootstrap/dist/css/bootstrap.min.css';
import './requestOTP.scss'
import validator from 'validator';
import { useState } from 'react';
import { OtpComfirmService } from '~/service/authService';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { requestOtpService } from '~/service/authService'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handelNotify } from '~/core/utils/req';
import { useParams } from 'react-router-dom';
import { Notify } from '~/core/constant';
const RequestOTP = () => {
    const { emailurl } = useParams();
    const navigate = useNavigate();
    const [showAlertCf, setShowAlertCf] = useState(false);
    let emailuser = ''
    if (emailurl) {
        if (emailurl === 'confirm') {
            emailuser = sessionStorage.getItem('emailUser');
        } else {
            emailuser = emailurl
        }
    }
    const [disabled, setDisabled] = useState(false);
    const [otp, setotp] = useState({
        otp: ['', '', '', '', '', ''],
        email: emailuser
    });
    const [validate, setValidate] = useState('')
    const handleInputChange = (e, i) => {
        e.preventDefault();

        const value = e.target.value;
        if (value !== '' && Number.isNaN(+value)) {
            return;
        }

        if (+value > 9 || +value < 0) {
            return
        }

        const update = otp.otp
        update[i] = value
        setotp({
            ...otp,
            otp: update
        });

        if (value !== '') {
            const form = e.target.form;
            const index = [...form].indexOf(e.target);
            form[index + 1].focus();
        }
    };
    const handelOnPasteOtp = (e) => {
        e.preventDefault();

        let otpString = e.clipboardData.getData('Text');
        otpString = otpString.replace(/\s*/, '')
        otpString = otpString.substring(0, 6)
        let data = otpString.split('');
        if (data.length !== 6) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            data[i] = +data[i]
            if (Number.isNaN(data[i])) {
                return;
            }
        }
        setotp({
            ...otp,
            otp: data
        })
    };
    const handleConfirm = async (e) => {
        e.preventDefault();

        const isValid = validateAll()
        if (!isValid) return

        const payload = {
            otp: Object.values(otp.otp).join(''),
            email: otp.email
        }

        console.log(payload);
        try {
            await OtpComfirmService(payload);
            setShowAlertCf({
                open: true,
                variant: Notify.SUCCESS,
                text: 'Xác nhận tài khoản thành công',
                title: 'Đăng ký thành công',
                backdrop: 'static',
                onClick: () => handleSwitchPage()
            })
        } catch (e) {
            console.log(e)
            if (e) {
                handelNotify('error', 'Mã OTP không hợp lệ')
            }

        }
    }
    const handleSwitchPage = () => {
        navigate('/login')
    }
    const handleRequire = async (e) => {
        setDisabled(true)
        try {
            const email1 = {
                email: emailuser
            }
            await requestOtpService(email1)
            handelNotify('', 'Bạn có thể yêu cầu lại sau 90s')
        } catch (error) {
            handelNotify('error', 'Tài khoản đã được xác nhận từ trước')
        }
        setTimeout(() => {
            setDisabled(false)
        }, 5000);
    }
    const validateAll = () => {
        const msg = {}
        if (!otp.otp.length || validator.isEmpty(Object.values(otp.otp).join(''),)) {
            msg.otp = "Vui lòng nhập OTP"
        }
        setValidate(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }

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
            <div className="body-forgot">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                            <div className="card border-0 shadow rounded-3 my-5">
                                <div className="card-body p-4 p-sm-5">
                                    <h5 className="card-title text-center mb-5 fw-light fs-5">Nhập mã bảo mật</h5>
                                    <form>
                                        <div className='d-grid'>
                                            <label>
                                                Chúng tôi đã gửi mã OTP gồm 6 số về email của quý khách vui lòng kiểm tra và xác nhận
                                            </label>
                                        </div>
                                        <div className="form-row row mb-3 my-5 justify-content-center align-content-center">
                                            {
                                                [...Array(6).keys()].map(i => (
                                                    <div className='col-2' key={i}>
                                                        <input className="form-control otp" type="number" min={0} max={9} name={'opt' + i} value={otp.otp[i]} onChange={(e) => handleInputChange(e, i)} onPaste={handelOnPasteOtp} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <p style={{ color: 'red' }} className='text-red-400 text-xs italic'>{validate.otp}</p>
                                        <div className='mt-5'>
                                            <button className="btn btn-primary float-end" type="button" onClick={handleConfirm}>Xác nhận</button>
                                            <button onClick={handleRequire} disabled={disabled} className="btn btn-secondary float-end" style={{ marginRight: '5px' }} type="button">Yêu cầu lại</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RequestOTP;