import React from 'react'
import Link from 'next/link'
import VideoModal from '../../components/ModalVideo/VideoModal'
import abimg from '/public/images/about5.jpg'
import abimg2 from '/public/images/about-shape3.png'
import Image from 'next/image'


const About4 = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
    return (

        <div className="wpo-about-area-s4 section-padding">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className="wpo-about-img">
                            <Image src={abimg} alt="" />
                            <div className="wpo-about-img-text">
                                <h2>25+</h2>
                                <p>Years of Experience</p>
                                <div className="about-shape">
                                    <Image src={abimg2} alt="" />
                                </div>
                            </div>
                            <div className="left-shape">
                                <div className="square-shape"></div>
                                <div className="shape-top">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <div className="shape-left">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 colsm-12">
                        <div className="wpo-about-text">
                            <div className="wpo-about-title">
                                <span>About Us</span>
                                <h2>We Offer You Profesional Interior Design</h2>
                            </div>
                            <h5>Over 25 years Liarch helping investors building their drea & business goals go to the perfection</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac enim aliquam feugiat ullamcorper. Id risus mattis neque, ullamcorper. Sed sit commodo vestibulum cras in cras. Nec proin scelerisque quis nisl vitae, egestas non. Fringilla auctor.</p>
                            <div className="btns">
                                <Link href="/about" onClick={ClickHandler} className="theme-btn">Discover More</Link>
                                <ul>
                                    <li className="video-holder">
                                        <VideoModal />
                                    </li>
                                    <li className="video-text">
                                        Watch Our Video
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="invisible-title1">
                <h2>About</h2>
            </div>
        </div>
    )
}

export default About4;