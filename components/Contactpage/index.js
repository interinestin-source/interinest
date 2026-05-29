import React from 'react';
import ContactForm from '../ContactFrom'

const Contactpage = () => {
    return (
        <section className="wpo-contact-pg-section section-padding">
            <div className="container">
                <div className="row">
                    <div className="col col-lg-10 offset-lg-1">
                        <div className="office-info">
                            <div className="row justify-content-center">
                                <div className="col col-xl-4 col-lg-6 col-md-6 col-12">
                                    <div className="office-info-item">
                                        <div className="office-info-icon">
                                            <div className="icon">
                                                <i className="fi flaticon-email"></i>
                                            </div>
                                        </div>
                                        <div className="office-info-text">
                                            <h2>Email Us</h2>
                                            <p>hello@interinest.in</p>
                                            <p>support@interinest.in</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-xl-4 col-lg-6 col-md-6 col-12">
                                    <div className="office-info-item">
                                        <div className="office-info-icon">
                                            <div className="icon">
                                                <i className="fi flaticon-telephone"></i>
                                            </div>
                                        </div>
                                        <div className="office-info-text">
                                            <h2>Call Us</h2>
                                            <p>+91 98765 43210</p>
                                            <p>+91 98765 43211</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wpo-contact-title">
                            <h2>Get In Touch</h2>
                            <p>Have a project in mind or want to connect with a designer?
                                Fill in the form below and we&apos;ll get back to you shortly.</p>
                        </div>
                        <div className="wpo-contact-form-area">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contactpage;
