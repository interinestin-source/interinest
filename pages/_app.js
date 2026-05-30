import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/animate.css'
import '../styles/flaticon.css'
import "../styles/font-awesome.min.css";
import "../styles/themify-icons.css";
import '../styles/sass/style.scss'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/index";
import { Provider } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <title>Interior Designers in India for Home &amp; Office | Interinest</title>
          <link rel="icon" type="image/png" href="/images/favicon.png" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
        <ToastContainer />
      </PersistGate>
    </Provider>

  )
}

export default MyApp
