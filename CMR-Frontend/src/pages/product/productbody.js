import './productbody.scss'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { getProductsService, getProductByIdService } from '~/service/productService';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from "react-router-dom";
import { changeCart } from '~/store/action/cartAction';
import { getBrandsService } from '~/service/brandService';
import { useLocation } from 'react-router-dom';

import Tooltip from 'react-bootstrap/Tooltip';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ProductBody = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    let [searchParams, setSearchParams] = useSearchParams();
    const categoryMap = {
        '/camera': 1,
        '/videocam': 2,
        '/accessory': 3,
    }
    const location = useLocation()
    console.log('🚀 ~ ProductBody ~ location', location);

    const [filter, setFilter] = useState({
        limit: 8,
        page: searchParams.get('page') || 1,
        name: '',
        brandId: searchParams.get('brandId') || '',
        categoryId: categoryMap[location.pathname],
        description: '',
        sortBy: searchParams.get('sortBy') || '',
        sort: searchParams.get('sort') || ''
    })

    const cart = useSelector(state => state.cart.cart);

    const [products, setProducts] = useState('')
    const [brand, setBrand] = useState('')
    const [pagination, setPagination] = useState(1)

    const handelChangePage = (i) => {
        setFilter({ ...filter, page: i })
        setSearchParams({ page: i })
    }
    const getListProducts = async (list) => {
        try {
            const res = await getProductsService(list)
            const data = (res && res.data) ? res.data : [];
            setPagination([...Array(data.totalPage).keys()].map(key => key + 1))
            setProducts(data.products)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setFilter({
            ...filter,
            limit: 8,
            page: searchParams.get('page') || 1,
            brandId: searchParams.get('brandId') || '',
            categoryId: categoryMap[location.pathname],
            description: '',
            sortBy: searchParams.get('sortBy') || '',
            sort: searchParams.get('sort') || ''
        })
    }, [location, searchParams])


    const getBrands = async () => {
        try {
            const limit = 24
            const resBrand = await getBrandsService(limit)
            const data1 = (resBrand && resBrand.data) ? resBrand.data : [];
            setBrand(data1)
        } catch (error) {

        }
    }
    const handleChangeBrand = (e) => {
        const currentParams = Object.fromEntries([...searchParams]);

        const update = { ...currentParams, brandId: e.value, page: 1 }
        if (!e.value) {
            delete update.brandId
        }
        setSearchParams({ ...update })
    }
    const handleSwitchDetail = (id) => {
        navigate('/product/' + id)
    }
    const handleSortByPrice = (e) => {
        const currentParams = Object.fromEntries([...searchParams]);

        const update = { ...currentParams, sortBy: e.value, sort: 'price', page: 1 }
        if (!e.value) {
            delete update.sort
            delete update.sortby
        }
        setSearchParams({ ...update })

    }
    const handleFilter = (e) => {
        let fill = {}
        if (e.value === 'all') {
            fill = {
                ...filter,
                page: 1,
                sale: ''
            }
        }
        if (e.value === 'new') {
            fill = {
                ...filter,
                page: 1,
                sort: 'createdAt',
                sortBy: 'desc',
                sale: ''
            }
        }
        if (e.value === 'sale') {
            fill = {
                ...filter,
                page: 1,
                sale: 'sale'
            }
        }
        setFilter(fill)
        const currentParams = Object.fromEntries([...searchParams]);
        setSearchParams({ ...currentParams, page: 1 })

    }
    const handleAddcart = async (product, amount, type) => {
        const cartss = JSON.parse(sessionStorage.getItem('cart'))
        if (sessionStorage.getItem('amount')) {
            sessionStorage.setItem('amount', parseInt(sessionStorage.getItem('amount')) + amount)
        } else {
            sessionStorage.setItem('amount', parseInt(1))
        }
        console.log(sessionStorage.getItem('amount'))
        try {
            const res = await getProductByIdService(product)
            const data = res && res.data ? res.data : ''
            const datafill = {
                img1: data.img1,
                name: data.name,
                percent: data.percent,
                price: data.price,
                saleCodeId: data.saleCodeId,
                count: amount,
                productId: data.id,
                total: data.price * amount - (data.price * amount - (data.price * (100 - data.percent) / 100))

            }
            let check = false
            const newCart = cart && cart.length > 0 && cart.map(obj => {
                if (obj.productId === product) {
                    check = true
                    return {
                        ...obj,
                        count: obj.count + amount,
                        total: parseInt(obj.price * (100 - obj.percent) / 100) * (obj.count + amount)
                    };
                }

                return obj;
            });
            if (!cartss) {
                sessionStorage.setItem('cart', JSON.stringify([datafill]))
                dispatch(changeCart([datafill]))
            }
            if (check) {
                sessionStorage.setItem('cart', JSON.stringify(newCart))
                dispatch(changeCart(newCart))
            } else if (cartss && !check) {
                sessionStorage.setItem('cart', JSON.stringify([...cart, datafill]))
                dispatch(changeCart([...cart, datafill]))
            }
            if (type === 'buy') {
                navigate('/cart')
            }

        } catch (error) {
            console.log(error)
        }
    }
    function VND(x) {
        return x = x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
    function oldPrice(price, percent) {
        if (percent !== 0) {
            const x = price;
            return x.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        }
        return '';
    }
    const [searchPdt, setSearchPdt] = useState('')
    const handleChangeSearchPdt = e => {
        const value = e.target.value;
        setSearchPdt(value);
    }
    const handelSearch = (e) => {
        e.preventDefault();
        setFilter({
            ...filter,
            page: 1,
            name: searchPdt,
        })
    }
    const optionsfiter = [
        { value: 'all', label: 'Tất cả' },
        { value: 'new', label: 'Mới nhất' },
        { value: 'sale', label: 'Khuyến mãi' }
    ]
    const optionsprice = [
        { value: '', label: 'Giá' },
        { value: 'desc', label: 'Giảm dần' },
        { value: 'asc', label: 'Tăng dần' }
    ]
    const [optionsbrands, setOptionsbrands] = useState([{ value: '', label: 'Thượng hiệu' },])

    useEffect(() => {
        getListProducts(filter)
    }, [filter])

    useEffect(() => {
        setOptionsbrands([{ value: '', label: 'Thượng hiệu' },])
        if (brand) {
            brand.brands.map((item, index) =>
                setOptionsbrands(current => [...current, { value: item.id, label: item.name }])
            )
        }
    }, [brand])
    useEffect(() => {
        getBrands()
    }, [])

    return (
        <>
            <img
                className="d-block w-100"
                src={require('~/assets/images/banner-1.jpg')}
                style={{ maxHeight: '300px' }}
                alt=''
            />
            <div >
                <div className='container' style={{ backgroundColor: 'rgba(227, 227, 227, 0.804)' }}>
                    <div className='row'>
                        <div className='col-12 mt-4 mb-2'>
                            <div className='row' >
                                <div className='col-12'>
                                    <div className='row'>
                                        <div className='col-1 btn border' disabled>
                                            Lọc
                                        </div>
                                        <div className='col-4 col-md-2'>
                                            <Select
                                                onChange={handleFilter}
                                                defaultValue={optionsfiter[0]}
                                                options={optionsfiter}
                                            />
                                        </div>
                                        <div className='col-4  col-md-2'>
                                            <Select
                                                onChange={handleSortByPrice}
                                                defaultValue={optionsprice[0]}
                                                options={optionsprice}
                                                value={optionsprice.find(item => item.value === filter.sortBy)}

                                            />
                                        </div>
                                        <div className='col-4 col-md-2'>
                                            <Select
                                                onChange={handleChangeBrand}
                                                defaultValue={optionsbrands[0]}
                                                options={optionsbrands}
                                                value={optionsbrands.find(item => item.value === filter.brandId)}

                                            />
                                        </div>
                                        <div className='col-7 offset-1 col-xl-5 offset-xl-0'>
                                            <div className='search-bar '>
                                                <Form className="d-flex" onSubmit={handelSearch}>
                                                    <Form.Control
                                                        type="search"
                                                        placeholder="Tìm kiếm"
                                                        className="me-2"
                                                        aria-label="Search"
                                                        onChange={handleChangeSearchPdt}
                                                    />
                                                    <Button type='submit' variant="warning">Tìm</Button>
                                                </Form>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="row p-5">

                        {
                            products && products.length > 0 &&
                            products.map((item, index) => {
                                return (
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
                                        <div className="wsk-cp-product" role="button" onClick={() => handleSwitchDetail(item.id)}>
                                            <div className="wsk-cp-img">
                                                <img className="img-responsive" src={process.env.REACT_APP_URL_IMG + item.img1} alt="Product" />
                                            </div>
                                            <div className="wsk-cp-text">
                                                <div className="wsk-buy">
                                                    <span onClick={(e) => { e.stopPropagation(); handleAddcart(item.id, 1, 'buy') }}>Mua ngay</span>
                                                </div>
                                                <div className="title-product">
                                                    <h6>{item.name}</h6>
                                                </div>
                                                <div className="card-footer">
                                                    <div className="wcf-left">
                                                        <span className="price">
                                                            <span>{VND(item.price * (100 - item.percent) / 100)} </span>
                                                            {item.percent > 0 && <Badge bg="danger" className='percent'>-{item.percent}%</Badge>}
                                                            <br></br>
                                                            <p style={{ height: '12px', marginTop: '5px' }}><del className='text-secondary' style={{ textDecoration: 'line-through', fontStyle: 'italic' }}> {oldPrice(item.price, item.percent)}</del></p>
                                                        </span>
                                                    </div>
                                                    <div className="wcf-right">
                                                        <OverlayTrigger
                                                            key={'add-to-cart'}
                                                            placement='bottom'
                                                            overlay={
                                                                <Tooltip style={{ fontSize: '10px' }}>
                                                                    Thêm Vào Giỏ Hàng
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <button onClick={(e) => { e.stopPropagation(); handleAddcart(item.id, 1, 'add') }} href="#" className="buy-btn" data-tip="Mua Ngay">
                                                                <FontAwesomeIcon icon={faShoppingCart} className='fa-icon' />
                                                            </button>
                                                        </OverlayTrigger>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                    <nav className="mb-3">
                        <ul id="pagination" className="pagination pagination-sm justify-content-center">
                            {
                                pagination && pagination.length > 0 &&
                                pagination.map((item, index) => {
                                    return (<li className={`page-item ${item === +filter.page ? 'active' : ''}`} key={item}><button onClick={e => handelChangePage(item)} className="page-link">{item}</button></li>)
                                })
                            }

                        </ul>
                    </nav>
                </div>
            </div>

        </>
    )
}
export default ProductBody;