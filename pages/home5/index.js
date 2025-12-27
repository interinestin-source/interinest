import React from 'react';
import Navbar2 from '../../components/Navbar2/Navbar2';
import Hero5 from '../../components/hero5';
import ProjectSectionS4 from '../../components/ProjectsS4';
import ServiceSection3 from '../../components/Services3';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Pricing from '../../components/Pricing';
import Logo from '/public/images/logo.svg'
import About from '../../components/about/about';
import BlogSectionS2 from '../../components/BlogSectionS2';
import Footer from '../../components/footer/Footer';
import abimg from '/public/images/about6.png'

const HomePage5 = (props) => {

    return (
        <div>
            <Navbar2 Logo={Logo} hclass={'wpo-header-style-3'} />
            <Hero5 />
            <About abClass={'wpo-about-area-s5'} abimg={abimg} />
            <ServiceSection3 />
            <ProjectSectionS4 />
            <Pricing pClass={'wpo-pricing-section-s2'} />
            <BlogSectionS2 />
            <Footer ftClass={'wpo-site-footer-s2'} />
            <Scrollbar />
        </div>
    )
};
export default HomePage5;


