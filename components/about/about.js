
import Link from 'next/link'
import VideoModal from '../../components/ModalVideo/VideoModal'
import Image from 'next/image'

const About = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
    return (
        <div id="about-us" className={`wpo-about-area section-padding ${props.abClass}`}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-5 col-md-12 col-sm-12">
                        <div className="wpo-about-img">
                            <Image src="/images/About-us.webp" width={500} height={500} alt="logo" />
                        </div>
                    </div>
                    <div className="col-lg-7 col-md-12 colsm-12">
                        <div className="wpo-about-text">
                            <div className="wpo-about-title">
                                <span>About Us</span>
                                <h2>We Offer You Profesional Interior Design</h2>
                            </div>
                            <h5>Interinest is a digital platform built to connect clients with talented freelance and small-scale interior designers across India.</h5>
                            <p>We believe great design should be accessible not limited to large firms or high-budget projects.mission is to create a space where emerging interior designers can showcase their work, build credibility, and grow their careers, while clients can easily discover and hire designers that match their style and budget.
</p>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;