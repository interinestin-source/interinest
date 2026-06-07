import React from 'react';
import Head from 'next/head';
import PageTitle from '../../components/pagetitle/PageTitle';
import Navbar from '../../components/Navbar/Navbar';
import ServiceSection from '../../components/Services';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '@/public/images/logo-interinest.png'

const ServicePage = (props) => {
    return (
        <div>
            <Head>
                <title>Interior Designers in India for Home &amp; Office | Interinest</title>
                <meta
                    name="description"
                    content="Find affordable interior designers in India for homes, cafes, offices, and commercial spaces. Compare portfolios and hire the right designer for your project."
                />
                <meta property="og:title" content="Interior Designers in India for Home & Office | Interinest" />
                <meta property="og:description" content="Find affordable interior designers in India for homes, cafes, offices, and commercial spaces. Compare portfolios and hire the right designer for your project." />
            </Head>
            <Navbar Logo={Logo} />
            <PageTitle
                pageTitle="Our Interior Design Services"
                pagesub="Services"
                bgImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80"
            />
            <ServiceSection />
            <Footer />
            <Scrollbar />
        </div>
    );
};

export default ServicePage;
