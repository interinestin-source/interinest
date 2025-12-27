import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero2 from '../../components/hero2';
import ProjectSectionS2 from '../../components/ProjectsS2';
import ServiceSection from '../../components/Services';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '/public/images/logo.svg'
import About2 from '../../components/about2';
import TeamSection from '../../components/TeamSection';
import Testimonial from '../../components/Testimonial';
import BlogSection from '../../components/BlogSection/BlogSection';
import Footer from '../../components/footer/Footer';


const HomePage2 = (props) => {

    return (
        <div>
            <Navbar Logo={Logo} hclass={'wpo-header-style-1'}/>
            <Hero2/>
            <About2/>
            <ServiceSection sClass={'section-bg'}/>
            <ProjectSectionS2 />
            <TeamSection/>
            <Testimonial/>
            <BlogSection/>
            <Footer/>
            <Scrollbar />
        </div>
    )
};
export default HomePage2;


