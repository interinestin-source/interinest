import React from 'react'
import Link from 'next/link'

const PageTitle = (props) => {
    const bgStyle = props.bgImage
        ? { backgroundImage: `url(${props.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center center' }
        : undefined;

    return(
        <section className="wpo-page-title" style={bgStyle}>
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <div className="wpo-breadcumb-wrap">
                            <h2>{props.pageTitle}</h2>
                            <ol className="wpo-breadcumb-wrap">
                                <li><Link href="/home">Home</Link></li>
                                <li><span>{props.pagesub}</span></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PageTitle;