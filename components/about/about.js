
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
                                <h2>Connecting Clients with India&apos;s Best Interior Designers</h2>
                            </div>
                            <h5>Interinest is a digital platform built to connect clients with talented freelance and small-scale interior designers across India.</h5>
                            <p>We believe great design should be accessible — not limited to large firms or high-budget projects. Our mission is to create a space where emerging interior designers can showcase their work, build credibility, and grow their careers, while clients can easily discover and hire designers that match their style and budget.</p>
                            <div className="row" style={{marginTop: '20px'}}>
                                <div className="col-6">
                                    <div className="wpo-about-item">
                                        <h3>For Clients</h3>
                                        <ul>
                                            <li>Discover designers by city &amp; style</li>
                                            <li>Explore verified portfolios</li>
                                            <li>Compare services &amp; pricing</li>
                                            <li>Hire for homes &amp; commercial spaces</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="wpo-about-item">
                                        <h3>For Designers</h3>
                                        <ul>
                                            <li>Build a professional portfolio</li>
                                            <li>Receive genuine client inquiries</li>
                                            <li>Build credibility &amp; reviews</li>
                                            <li>Grow your design business</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;