import React from 'react';
import PageTitle from '../../components/pagetitle/PageTitle';
import Navbar from '../../components/Navbar/Navbar';
import ServiceSection2 from '../../components/Services2';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '/public/images/logo.svg'

const ServicePage2 = (props) => {

    return (
        <div>
            <Navbar Logo={Logo}/>
            <PageTitle pageTitle={'Service'} pagesub={'Service'}/> 
            <ServiceSection2 srvClass={'title-v'}/>
            <Footer ftClass={'wpo-site-footer-s2'}/>
            <Scrollbar/>
        </div>
    )
};
export default ServicePage2;


