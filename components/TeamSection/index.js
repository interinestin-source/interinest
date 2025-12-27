import React from 'react'
import Link from 'next/link'
import Teams from '../../api/team'
import SectionTitle from '../SectionTitle'
import Image from 'next/image'


const TeamSection = (props) => {
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }


    return(

        <section className="wpo-team-section section-padding">
            <div className="container">
                <SectionTitle subTitle={'OUR PROFESSIONALS'} MainTitle={'Meet Our Team'}/>
                <div className="wpo-team-wrap">
                    <div className="row">
                        {Teams.map((team, aitem) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={aitem}>
                            <div className="wpo-team-item">
                                <div className="wpo-team-img">
                                    <Image src={team.tImg} alt=""/>
                                    <Link onClick={ClickHandler} href='/team-single/[slug]' as={`/team-single/${team.slug}`}><i className="ti-plus"></i></Link>
                                </div>
                                <div className="wpo-team-text">
                                    <h3><Link onClick={ClickHandler} href='/team-single/[slug]' as={`/team-single/${team.slug}`}>{team.name}</Link></h3>
                                    <span>Creative Director</span>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default TeamSection;