import React from 'react';
import Navbar2 from '../../components/Navbar2/Navbar2';
import Hero4 from '../../components/hero4';
import ProjectSectionS4 from '../../components/ProjectsS4';
import ServiceSection3 from '../../components/Services3';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Pricing from '../../components/Pricing';
import Logo from '/public/images/logo.svg'
import About4 from '../../components/about4';
import BlogSectionS2 from '../../components/BlogSectionS2';
import Footer from '../../components/footer/Footer';


const HomePage4 = (props) => {

    return (
        <div>
            <Navbar2 Logo={Logo} hclass={'wpo-header-style-3'}/>
            <Hero4 />
            <About4 />
            <ServiceSection3 ptClass={'pt-0'}/>
            <ProjectSectionS4 />
            <Pricing pClass={'wpo-pricing-section-s2'}/>
            <BlogSectionS2 />
            <Footer ftClass={'wpo-site-footer-s2'}/>
            <Scrollbar />
        </div>
    )
};
export default HomePage4;


