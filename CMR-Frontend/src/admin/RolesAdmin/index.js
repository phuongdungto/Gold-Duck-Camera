import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import './rolesAdmin.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from '~/components/Layout/AdminLayout/Header';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { Roles, Notify } from '~/core/constant';
import cookies from 'react-cookies';
import { faEye, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer } from 'react-toastify';
import { handleError, handelNotify } from '~/core/utils/req';
import {
    getUsersService,
    getUserbyIdService,
    changePositionService
} from '~/service/userService'

function RolesAdmin() {
    const token = cookies.load('Tokenadmin');
    const limit = 10;
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState();
    const [showRepair, setShowRepair] = useState(false);
    const [pagination, SetPagination] = useState('')
    const [searchUser, setSearchUser] = useState({
        limit: limit,
        page: 1,
        fullname: '',
        gender: '',
        address: '',
        sort: '',
        sortBy: '',
        locked: ''
    });
    const [userRole, SetUserRole] = useState({
        id: '',
        role: '',
    });
    const getListUser = async (list) => {
        try {
            const res = await getUsersService(list, token)
            const data = (res && res.data) ? res.data : [];
            SetPagination(selectPagination(data.totalPage))
            setUsers(data.users)
        } catch (error) {
        }
    }
    const selectPagination = (page) => {
        let content = [];
        for (let i = 1; i <= page; i++) {
            content.push({
                pageNumber: i,
            });
        }

        return content
    }
    const handelChange = (i) => {
        setSearchUser({
            ...searchUser,
            page: i
        })
    }
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true)
    };
    const [repairuser, setRepairuser] = useState({
        role: '',
        id: ''
    });
    const handleShowDetail = async (e) => {
        try {
            let data = await getUserbyIdService(e, token)
            setRepairuser(data.data)
            SetUserRole({
                role: data.data.role,
                id: data.data.id
            })
        } catch (error) {

        }
        handleShow(true)
    };
    const handelShowUnChangeRole = () => {
        if (repairuser.role === 'admin') {
            handelNotify('error', 'Không thể sửa quyền tài khoản này')
            return
        }
        setshowChange({
            open: true,
            variant: Notify.SUCCESS,
            title: 'Sửa quyền tài khoản',
            backdrop: 'static',
            mt: '100px'
        })
    }
    const [showChange, setshowChange] = useState({
        open: false,
        valirant: '',
        text: '',
        title: '',
        backdrop: '',
        mt: ''
    });
    const [showAlertCf, setShowAlertCf] = useState({
        open: false,
        valirant: '',
        text: '',
        title: '',
        backdrop: ''
    });

    const handleOnchange = e => {
        const value = e.target.value;
        SetUserRole({
            ...userRole,
            [e.target.name]: value
        });
    }
    const handleShowChange = (e) => {
        setShowAlertCf({
            open: true,
            variant: Notify.WARNING,
            text: 'Bạn có chắc chắn muốn đổi quyền tài khoản này không?',
            title: 'Xác nhận',
            backdrop: 'static',
            onClick: () => handleOnClick(e)
        })
    }
    const handleOnClick = async (user) => {
        try {
            const data = await changePositionService(user, repairuser.id, token)
            const req = handleError(data.request)
            setRepairuser({
                ...repairuser,
                role: user.role
            })
            setShowAlertCf({
                open: false
            })
            setshowChange({
                open: false
            })
            setShow(false)
            handelNotify('success', 'Đổi quyền tài khoản thành công')
            setUsers(prevState => {
                const newState = prevState.map(obj => {
                    if (obj.id === user.id) {
                        return {
                            ...obj,
                            role: user.role
                        };
                    }

                    return obj;
                });

                return newState;
            });
        } catch (error) {
            const req = handleError(error.request)
            handelNotify('erorr', req)
        }
    }
    useEffect(() => {
        getListUser(searchUser)
    }, [searchUser])
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
                    <Button variant="secondary" onClick={() => setShowAlertCf({ open: false })}>
                        Hủy
                    </Button>
                    <Button onClick={showAlertCf.onClick} variant="primary">OK</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showChange.open}
                onHide={() => setshowChange({ open: false })}
                keyboard={false}
                style={{ marginTop: showChange.mt }}
            >
                <Modal.Header style={{ backgroundColor: showChange.variant }} closeButton>
                    <Modal.Title>{showChange.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <input onChange={handleOnchange} checked={userRole.role === 'customer'} value={Roles.CUSTOMER} type="radio" className="btn-check " name="role" id="secondary-outlined" autocomplete="off" />
                        <label class="btn btn-outline-secondary mb-3" for="secondary-outlined">Customer</label>

                        <input onChange={handleOnchange} checked={userRole.role === 'staff'} value={Roles.STAFF} type="radio" className="btn-check" name="role" id="success-outlined" autocomplete="off" />
                        <label class="btn btn-outline-success mb-3" for="success-outlined">Staff</label>

                        <input onChange={handleOnchange} checked={userRole.role === 'manager'} value={Roles.MANAGER} type="radio" className="btn-check" name="role" id="danger-outlined" autocomplete="off" />
                        <label class="btn btn-outline-danger mb-3" for="danger-outlined">Manager</label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setshowChange({ open: false })}>
                        Hủy
                    </Button>
                    <Button onClick={() => handleShowChange(userRole)} variant="primary">OK</Button>
                </Modal.Footer>
            </Modal>
            <div id="main" className="layout-navbar">
                <Header />
                <div id="main-content">
                    <div className="page-heading">
                        <div className="col-sm-6">
                            <h6>Tìm Kiếm</h6>
                            <div id="search-user-form" name="search-user-form">
                                <div className="form-group position-relative has-icon-right">
                                    <input id="serch-user-text" type="text" className="form-control" placeholder="Tìm kiếm" />
                                    <div className="form-control-icon">
                                        <i className="bi bi-search"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="page-title">
                            <div className="row">
                                <div className="col-12 col-md-7 order-md-1 order-last">
                                    <label>
                                        <h3>Danh sách người dùng</h3>
                                    </label>
                                    <label>
                                        <h5 style={{ marginLeft: '50px', marginRight: '10px' }}> Lọc Theo:</h5>
                                    </label>
                                    <select className="btn btn btn-primary" name="search-cbb" id="cars-search">
                                        <option>Tất Cả</option>
                                    </select>
                                </div>
                                <div className="col-12 col-md-5 order-md-2 order-first">

                                    <div className=" loat-start float-lg-end mb-3">
                                        <button id='btn-delete-user' className="btn btn-danger">
                                            <i className="bi bi-trash-fill"></i> Khóa tài khoản
                                        </button>
                                        <button id='btn-createaccount' onClick={handleShow} className="btn btn-primary">
                                            <i className="bi bi-plus"></i> Thêm tài khoản
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <section className="section">
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table mb-0 table-danger" id="table1">
                                            <thead>
                                                <tr>
                                                    <th>Chọn</th>
                                                    <th>Tài khoản email</th>
                                                    <th>Họ và tên</th>
                                                    <th>Số điện thoại</th>
                                                    <th>Chức vụ</th>
                                                    <th>Tác Vụ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    users && users.length > 0 &&
                                                    users.map(item => {
                                                        let s = 'table-info';
                                                        if ((users.indexOf(item) + 1) % 2 !== 0) {
                                                            s = 'table-light';
                                                        } return (
                                                            <tr className={s}>
                                                                <td>{item.id}</td>
                                                                <td className='text-break'>{item.email}</td>
                                                                <td className='text-break'>{item.fullname}</td>
                                                                <td className='text-break'>{item.numberPhone}</td>
                                                                <td className='text-break'>{item.role}</td>
                                                                <td className='text-break'>

                                                                    <button onClick={e => handleShowDetail(item.id)}><FontAwesomeIcon icon={faEye} className='fa-icon' /></button>

                                                                </td>
                                                            </tr>
                                                        )

                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <nav className="mt-5">
                                            <ul id="pagination" className="pagination justify-content-center">
                                                {
                                                    pagination && pagination.length > 0 &&
                                                    pagination.map(item => {
                                                        return (<li class="page-item" active><button onClick={e => handelChange(item.pageNumber)} class="page-link">{item.pageNumber}</button></li>)
                                                    })
                                                }
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div >
            <Modal className='ModalChitiet' show={show} onHide={handleClose}>
                <Modal.Header className='ModalChitietHeader' closeButton>
                    <Modal.Title>Chi tiết người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                            <Form.Label>Địa chỉ Email:</Form.Label>
                            <Form.Control
                                readonly="readonly"
                                placeholder="name@example.com"
                                defaultValue={repairuser.email}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-2"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Họ Tên:</Form.Label>
                            <Form.Control
                                readonly="readonly"
                                placeholder="Họ tên"
                                defaultValue={repairuser.fullname}
                            />
                        </Form.Group>
                        <div className='row'>
                            <div className='col-6'>
                                <Form.Group
                                    className="mb-2"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Ngày sinh:</Form.Label>
                                    <Form.Control
                                        readonly="readonly"
                                        defaultValue={repairuser.birthday}
                                    />
                                </Form.Group>
                            </div>
                            <div className='col-6'>
                                <Form.Group
                                    className="mb-2"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Số điện thoại:</Form.Label>
                                    <Form.Control
                                        readonly="readonly"
                                        placeholder="Số điện thoại"
                                        defaultValue={repairuser.numberPhone}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <Form.Group
                            className="mb-2"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Địa chỉ:</Form.Label>
                            <Form.Control
                                readonly="readonly"
                                placeholder="Địa chỉ"
                                defaultValue={repairuser.address}
                            />
                        </Form.Group>
                        <div className='row'>
                            <div className='col-4 mb-2'>
                                <Form.Label>Quyền:</Form.Label>
                                <Form.Control
                                    readonly="readonly"
                                    placeholder="Quyền"
                                    defaultValue={repairuser.role}
                                />
                            </div>
                            <div className='col-2 mt-4'>
                                <button onClick={handelShowUnChangeRole} type="button" class="btn btn-info">Sửa</button>
                            </div>
                            <div className='col-6 mb-2'>
                                <Form.Label>Giới tính:</Form.Label>
                                <Form.Control
                                    readonly="readonly"
                                    placeholder="Giới tính"
                                    defaultValue={repairuser.gender}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <Form.Group
                                    className="mb-2"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Ngày tạo:</Form.Label>
                                    <Form.Control
                                        readonly="readonly"
                                        defaultValue={repairuser.createdAt}
                                    />
                                </Form.Group>
                            </div>
                            <div className='col-6'>
                                <Form.Group
                                    className="mb-2"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Ngày cập nhật gần nhất:</Form.Label>
                                    <Form.Control
                                        readonly="readonly"
                                        placeholder="Số điện thoại"
                                        defaultValue={repairuser.updatedAt}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RolesAdmin;