import React from 'react'
import Link from 'next/link'
import abimg from '/public/images/about2.jpg'
import abimg2 from '/public/images/about3.jpg'
import Image from 'next/image'
import VideoModal from '../ModalVideo/VideoModal'

const About2 = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
    return (
        <div className="wpo-about-area-s2 section-padding">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className="wpo-about-img">
                            <div className="wpo-about-img-left">
                                <Image src={abimg} alt=""/>
                                    <div className="wpo-about-img-text">
                                        <h2>25+</h2>
                                        <p>Years of Experience</p>
                                    </div>
                            </div>
                            <div className="wpo-about-img-right">
                                <Image src={abimg2} alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 colsm-12">
                        <div className="wpo-about-text">
                            <div className="wpo-about-title">
                                <span>About Us</span>
                                <h2>We Offer You Profesional Interior Design</h2>
                            </div>
                            <p>Lorem ipsum dolor sit amet, consctetur adipiscing elit. Aceim aliquam feugiat ullamcorper. Id risus mattis.</p>
                            <ul className="ab-list">
                                <li>We provide free initial consultation and support.</li>
                                <li>We have the professional designers team.</li>
                                <li>We work with some of the most successful businesses.</li>
                            </ul>
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
        </div>
    )
}

export default About2;