import React from 'react'
import Link from 'next/link'
import Services from '../../api/service'
import SectionTitle from '../SectionTitle'




const ServiceSection = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }


    return (
        <div className={`wpo-service-area section-padding ${props.sClass}`}>
            <div className="container">
                <SectionTitle subTitle={'Our Capabilities'} MainTitle={'What We Do'}/>
                <div className="row align-items-center">
                    {Services.slice(0,6).map((service, sitem) => (
                        <div className="col-lg-4 col-md-6 col-12" key={sitem}>
                            <div className="wpo-service-item">
                                <i className={service.icon}></i>
                                <h2>{service.sTitle}</h2>
                                <p>{service.description}</p>
                                <Link onClick={ClickHandler} href='/service/[slug]' as={`/service/${service.slug}`}>Learn More...</Link>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default ServiceSection;