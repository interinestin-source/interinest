import React from 'react';
import About from '../../components/about/about';
import Hero from '../../components/hero';
import Navbar from '../../components/Navbar/Navbar';
import ProjectSection from '../../components/Projects';
import ServiceSection from '../../components/Services';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '/public/images/logo.svg'
import abimg from '/public/images/about.jpg'
import FunFact from '../../components/FunFact/FunFact';
import TeamSection from '../../components/TeamSection';
import Testimonial from '../../components/Testimonial';
import BlogSection from '../../components/BlogSection/BlogSection';
import Footer from '../../components/footer/Footer';


const HomePage = (props) => {

    return (
        <div>
            <Navbar Logo={Logo} hclass={'header-style-1'}/>
            <Hero/>
            <About abimg={abimg}/>
            <ProjectSection />
            <ServiceSection />
            <FunFact/>
            <TeamSection/>
            <Testimonial/>
            <BlogSection/>
            <Footer/>
            <Scrollbar />
        </div>
    )
};
export default HomePage;


