import Carousel from 'react-bootstrap/Carousel';
import './banner.scss';

function IndividualIntervalsExample() {
    return (
        <Carousel className='carouselMain'>
            <Carousel.Item interval={3000}>
                <img
                    className="d-block w-100 slide"
                    src={require('~/assets/images/slide-1.png')}
                    style={{ maxHeight: '450px' }}
                />
            </Carousel.Item>
            <Carousel.Item interval={3000}>
                <img
                    className="d-block w-100 slide"
                    src={require('~/assets/images/slide-2.png')}
                    style={{ maxHeight: '450px' }}
                />
            </Carousel.Item>
            <Carousel.Item interval={3000}>
                <img
                    className="d-block w-100 slide"
                    src={require('~/assets/images/slide-3.jpg')}
                    style={{ maxHeight: '450px' }}
                />
            </Carousel.Item>
            <Carousel.Item interval={3000}>
                <img
                    className="d-block w-100 slide"
                    src={require('~/assets/images/slide-4.jpg')}
                    style={{ maxHeight: '450px' }}
                />
            </Carousel.Item>
        </Carousel>
    );
}

export default IndividualIntervalsExample;