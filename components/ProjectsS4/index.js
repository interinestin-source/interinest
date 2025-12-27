import React from 'react';
import Slider from "react-slick";
import Link from 'next/link';
import Projects from '../../api/project'
import Image from 'next/image'

const ProjectSectionS4 = () => {

    var settings = {
        dots: false,
        arrows: true,
        speed: 1000,
        slidesToShow: 3,
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
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }


    return (
        <div className="wpo-project-area black-bg">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="wpo-project-wrap project-active owl-carousel">
                        <Slider {...settings}>
                            {Projects.slice(14, 18).map((project, pot) => (
                                <div className="wpo-project-item" key={pot}>
                                    <div className="wpo-project-img">
                                        <Image src={project.pImg} alt="" />
                                        <div className="left-border"></div>
                                        <div className="right-border"></div>
                                    </div>
                                    <div className="wpo-project-text">
                                        <h2><Link onClick={ClickHandler} href='/project/[slug]' as={`/project/${project.slug}`}>{project.title}</Link></h2>
                                        <span>{project.subTitle}</span>
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

export default ProjectSectionS4;

