import './guarantee.scss'
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Guarantee = () => {
    return (
        <>
            <img
                className="d-block w-100 slide"
                src={require('~/assets/images/banner-suachua.jpg')}
                style={{ maxHeight: '450px' }}
                alt=''
            />
            <div className='container'>
                <div className='row'>
                    <h4 className='mt-3'><FontAwesomeIcon icon={faHouse} className='fa-icon' /> Trang Chủ / <span className='cartText'>Sửa chữa</span></h4>
                </div>
                <div className='row'>
                    <h4 className='address mt-4'>ĐỊA CHỈ CỬA HÀNG TP. HỒ CHÍ MINH</h4>
                </div>
                <p>Ngày nay, Máy ảnh là một sản phẩm công nghệ rất gần gủi với mọi người. Chúng ta đều mong muốn sở hữu chiếc máy ảnh " đẳng cấp" và tính ổn định cao. Tuy nhiên, trong quá trình sử dụng, sẽ rất khó tránh khỏi những trường hợp hỏng hóc do va chạm, bảo quản không đúng cách, vệ sinh không đúng phương pháp. Với đội ngũ kỹ thuật viện được đào tạo chuyên sâu, giàu kinh nghiệm, tác phong làm việc chuyên nghiệp, chúng tôi tự hào có thể sửa chữa mọi hư hỏng cho chiếc Máy ảnh của bạn.</p>
                <p>Đến với trung tâm sửa chữa Máy ảnh của <b style={{ fontSize: '16px', color: 'rgb(255, 136, 0)' }}>Gold Duck Camera</b> , bạn có thể an tâm gửi chiếc Máy ảnh của mình vào sửa vì chúng tôi cam kết tất cả các linh kiện, phụ kiện trên chiếc Máy ảnh của bạn sẽ được xác nhận chữ ký (tránh bị đổi đồ, bị "luộc"), được bảo vệ cẩn thận, lựa chọn phương pháp sửa chữa , thay thế phù hợp nhất.</p>
            </div>
        </>
    )
}
export default Guarantee