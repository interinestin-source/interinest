import React from "react";
import Slider from "react-slick";
import SectionTitle from "../SectionTitle";
import ts1 from '/public/images/testimonial/img-1.jpg'
import ts2 from '/public/images/testimonial/img-2.jpg'
import ts3 from '/public/images/testimonial/img-3.jpg'
import Image from 'next/image'


const Testimonial = () => {

    var settings = {
        dots: false,
        arrows: false,
        speed: 1000,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const testimonial = [
        {
            tsImg: ts1,
            Des: "“Ullamcorper a at sit et. Augue non donec dui quis tellus ullamcorper vitae. Eleifend augue sed diam malesuada urna, porttitor lorem dolor.”",
            Title: 'Robert Henry',
            Sub: "CEO of Mendara Office",
        },
        {
            tsImg: ts2,
            Des: "“Ullamcorper a at sit et. Augue non donec dui quis tellus ullamcorper vitae. Eleifend augue sed diam malesuada urna, porttitor lorem dolor.”",
            Title: 'Jenefer Haiway',
            Sub: "CEO of Techsub Office",
        },
        {
            tsImg: ts3,
            Des: "“Ullamcorper a at sit et. Augue non donec dui quis tellus ullamcorper vitae. Eleifend augue sed diam malesuada urna, porttitor lorem dolor.”",
            Title: 'Henry Bannet',
            Sub: "CEO of IBO Office",
        }
    ]
    return (
        <div className="wpo-testimonial-area section-padding">
            <div className="container">
                <SectionTitle subTitle={'Testimonial'} MainTitle={'People Say About Us'} />
                <div className="wpo-testimonial-wrap">
                    <div className="testimonial-slider owl-carousel">
                        <Slider {...settings}>
                            {testimonial.map((tesmnl, tsm) => (
                                <div className="wpo-testimonial-item" key={tsm}>
                                    <div className="wpo-testimonial-top">
                                        <div className="wpo-testimonial-img">
                                            <Image src={tesmnl.tsImg} alt="" />
                                        </div>
                                        <div className="wpo-testimonial-info">
                                            <h2>{tesmnl.Title}</h2>
                                            <span>{tesmnl.Sub}</span>
                                        </div>
                                    </div>
                                    <div className="wpo-testimonial-content">
                                        <p>{tesmnl.Des}</p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Testimonial;