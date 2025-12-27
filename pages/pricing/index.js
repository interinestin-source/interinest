import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Pricing from '../../components/Pricing';
import Logo from '/public/images/logo.svg'

const PricingPage = () => {
    return (
        <Fragment>
            <Navbar Logo={Logo}/>
            <PageTitle pageTitle={'Pricing'} pagesub={'Pricing'} />
            <Pricing pClass={'title-off'} />
            <Footer ftClass={'wpo-site-footer-s2'}/>
            <Scrollbar />
        </Fragment>
    )
};
export default PricingPage;