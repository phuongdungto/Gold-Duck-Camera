import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPrint } from '@fortawesome/free-solid-svg-icons';
import styles from './footer.module.scss';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function Footer() {
    return (
        <>
            <section style={{ background: '#1a1e25', color: '#868c96' }} className={cx("contact-area")} id="contact">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="contact-content text-center">
                                <Link to='/'><img width={'400px'} src={require('~/assets/images/logo.png')} alt="logo" /></Link>
                                <br></br>
                                <br></br>
                                <br></br>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum </p>
                                <div className="hr"></div>
                                <h6> 273 An Dương Vương, Quận 5, TP. Hồ Chí Minh</h6>
                                <h6>+ 01 234 567 88<span>|</span>+ 01 234 567 89</h6>
                                <div className={cx("contact-social")}>
                                    <ul>
                                        <li><a className={cx("hover-target")} href="http://youtube.com"><i><FontAwesomeIcon icon={faPrint} /></i></a></li>
                                        <li><a className={cx("hover-target")} href="http://youtube.com"><i><FontAwesomeIcon icon={faEnvelope} /></i></a></li>
                                        <li><a className={cx("hover-target")} href="http://youtube.com"><i><FontAwesomeIcon icon={faSquareFacebook} /></i></a></li>
                                        <li><a className={cx("hover-target")} href="http://youtube.com"><i><FontAwesomeIcon icon={faYoutube} /></i></a></li>
                                        <li><a className={cx("hover-target")} href="http://youtube.com"><i><FontAwesomeIcon icon={faInstagram} /></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer>
                <p>Copyright &copy; 2022 <img src={require('~/assets/images/logo.jpg')} alt="logo" /> All Rights Reserved.</p>
            </footer>
        </>
    )

}

export default Footer;