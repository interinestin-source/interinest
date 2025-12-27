import React from 'react';
import Link from 'next/link';
import Projects from '../../api/project'
import SectionTitle from '../SectionTitle';
import Image from 'next/image'

const ProjectSectionS2 = () => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }


    return (
        <div className="wpo-project-area-s2 section-padding">
            <div className="container">
                <SectionTitle subTitle={'Featured Works'} MainTitle={'Our Projects'} />
                <div className="row align-items-center">
                    <div className="wpo-project-wrap">
                        <div className="sortable-gallery">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="project-grids gallery-container clearfix">
                                        {Projects.slice(3, 9).map((project, pot) => (
                                            <div className="grid" key={pot}>
                                                <div className="wpo-project-item">
                                                    <div className="wpo-project-img">
                                                        <Image src={project.pImg} alt="" />
                                                        <div className="left-border"></div>
                                                        <div className="right-border"></div>
                                                    </div>
                                                    <div className="wpo-project-text">
                                                        <h2><Link onClick={ClickHandler} href='/project/[slug]' as={`/project/${project.slug}`}>{project.title}</Link></h2>
                                                        <span>{project.subTitle}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectSectionS2;

