import React from 'react';
import Navbar2 from '../../components/Navbar2/Navbar2';
import Hero3 from '../../components/hero3';
import ProjectSectionS3 from '../../components/ProjectsS3';
import ServiceSection2 from '../../components/Services2';
import FunFact from '../../components/FunFact/FunFact';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Pricing from '../../components/Pricing';
import Logo from '/public/images/logo.svg'
import About3 from '../../components/about3';
import BlogSection from '../../components/BlogSection/BlogSection';
import Footer from '../../components/footer/Footer';


const HomePage3 = (props) => {

    return (
        <div>
            <Navbar2 Logo={Logo} hclass={'wpo-header-style-2'} />
            <Hero3 />
            <About3 />
            <ServiceSection2 />
            <FunFact />
            <ProjectSectionS3 />
            <Pricing />
            <BlogSection />
            <Footer />
            <Scrollbar />
        </div>
    )
};
export default HomePage3;


