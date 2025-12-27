import React from 'react';
import Services from '../../../api/service'


const RelatedService = () => {

    return (
        <div className="wpo-service-single-item">
            <div className="wpo-service-single-title">
                <h3>Related Service</h3>
            </div>
            <div className="wpo-service-area">
                <div className="row align-items-center">
                    {Services.slice(0,3).map((service, sitem) => (
                        <div className="col-lg-4 col-md-6 col-12" key={sitem}>
                            <div className="wpo-service-item">
                                <i className={service.icon}></i>
                                <h2>{service.sTitle}</h2>
                                <p>{service.des2}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};
export default RelatedService;
