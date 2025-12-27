import React from 'react';
import PageTitle from '../../components/pagetitle/PageTitle';
import Navbar from '../../components/Navbar/Navbar';
import ServiceSection from '../../components/Services';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '/public/images/logo.svg'

const ServicePage = (props) => {

    return (
        <div>
            <Navbar Logo={Logo}/>
            <PageTitle pageTitle={'Service'} pagesub={'Service'}/> 
            <ServiceSection/>
            <Footer/>
            <Scrollbar/>
        </div>
    )
};
export default ServicePage;


