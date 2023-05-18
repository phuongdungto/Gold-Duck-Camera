import './contact.scss'
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Contact = () => {
    return (
        <>
            <img
                className="d-block w-100 slide"
                src={require('~/assets/images/banner-lienhe.jpg')}
                style={{ maxHeight: '450px' }}
                alt=''
            />
            <div className='container'>
                <div className='row'>
                    <h4 className='mt-3'><FontAwesomeIcon icon={faHouse} className='fa-icon' /> Trang Chủ / <span className='cartText'>Liên hệ</span></h4>
                </div>
                <div className='row'>
                    <h4 className='address mt-4'>ĐỊA CHỈ CỬA HÀNG TP. HỒ CHÍ MINH</h4>
                </div>
                <p>Mở cửa: 8h30 - 17h30 (Chiều T7 và CN nghỉ)</p>
                <p>Số 273 An dương Vương, Phường 3, Quận 5, Hồ Chí Minh (Để được phục vụ tốt hơn quý khách vui lòng gọi trước khi đến)</p>
            </div>
        </>
    )
}
export default Contact