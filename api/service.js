import simg from '@/public/images/service-single/1.jpg'
import simg2 from '@/public/images/service-single/2.jpg'
import simg3 from '@/public/images/service-single/3.jpg'
import simg4 from '@/public/images/service-single/4.jpg'
import simg5 from '@/public/images/service-single/5.jpg'
import simg6 from '@/public/images/service-single/6.jpg'
import simg7 from '@/public/images/service-single/7.jpg'
import simg8 from '@/public/images/service-single/8.jpg'
import simg9 from '@/public/images/service-single/9.jpg'
import simg10 from '@/public/images/service-single/10.jpg'
import simg11 from '@/public/images/service-single/11.jpg'
import simg12 from '@/public/images/service-single/12.jpg'
import simg13 from '@/public/images/service-single/13.jpg'

import sSingleimg1 from '@/public/images/service-single/s1.jpg'
import sSingleimg2 from '@/public/images/service-single/s2.jpg'


import ins1 from '@/public/images/instragram/7.jpg'
import ins2 from '@/public/images/instragram/8.jpg'
import ins3 from '@/public/images/instragram/9.jpg'
import ins4 from '@/public/images/instragram/10.jpg'
import ins5 from '@/public/images/instragram/11.jpg'
import ins6 from '@/public/images/instragram/12.jpg'


const Services = [
    {
        Id: '1',
        sImg:simg,
        slug:'Residential-Interior-Design',
        sTitle: 'Residential Interior Design',
        description:'Your home should be a reflection of your lifestyle, personality, and aspirations. At Interinest, we connect homeowners with talented residential interior designers who specialize in creating functional, beautiful, and personalized living spaces.',
        des2:"Whether you're designing a new home, renovating an apartment, or refreshing a single room, our network of interior design professionals can help bring your vision to life.",
        des3:'From modular kitchen design to complete home interiors, our designers bring your vision to life with practical layouts, smart storage, and beautiful aesthetics.',
        icon:'fi flaticon-double-bed',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins1,
        subsections: [
            { title: 'Living Room Design', desc: 'Create welcoming and stylish living spaces that balance comfort and aesthetics. From furniture selection to lighting design, our designers help craft spaces where families connect and guests feel at home.' },
            { title: 'Bedroom Interior Design', desc: 'Design a relaxing retreat tailored to your needs. From modern minimalism to luxurious comfort, our designers focus on creating bedrooms that promote rest and well-being.' },
            { title: 'Kitchen Interior Design', desc: 'Optimize functionality and style with smart kitchen layouts, storage solutions, and contemporary finishes designed for modern living.' },
            { title: 'Dining Area Design', desc: 'Transform dining spaces into inviting environments for everyday meals and special gatherings.' },
            { title: "Children's Room Design", desc: 'Create safe, practical, and inspiring spaces that grow with your child while maximizing storage and functionality.' },
            { title: 'Complete Home Interior Design', desc: 'From concept development to final styling, our designers can manage the entire interior design process for apartments, villas, bungalows, and residential properties.' },
        ],
        howItWorks: [
            { step: '01', title: 'Share Your Requirements', desc: 'Tell us about your project, property type, preferred style, budget, and timeline.' },
            { step: '02', title: 'Connect With Designers', desc: 'Receive responses from interior designers suited to your project needs.' },
            { step: '03', title: 'Review Portfolios', desc: 'Explore previous work, compare approaches, and evaluate design expertise.' },
            { step: '04', title: 'Start Your Design Journey', desc: 'Select the right designer and begin transforming your space.' },
        ],
    },
    {
        Id: '2',
        sImg:simg2,
        slug:'Commercial-Interior-Design',
        sTitle: 'Commercial Interior Design',
        description:'Hire interior designers for cafes, restaurants, retail stores, office interiors, salons, clinics, and co-working spaces across India.',
        des2:'Connect with designers who understand branding, functionality, and customer experience for commercial environments.',
        des3:'Whether you are setting up a new cafe or redesigning your office, our verified designers deliver spaces that reflect your brand identity and business goals.',
        icon:'fi flaticon-blueprint',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins2,
    },
    {
        Id: '3',
        sImg:simg3,
        slug:'Budget-Interior-Design',
        sTitle: 'Budget Interior Design',
        description:'Find freelance designers who offer flexible pricing — per room, per sq. ft., consultation-only, or complete renovation and makeover packages.',
        des2:'Ideal for budget-conscious homeowners and startups looking for quality design without the heavy price tag.',
        des3:'Interinest helps you find affordable interior designers who deliver creative, high-quality results within your budget constraints.',
        icon:'fi flaticon-planning',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins3,
    },
    {
        Id: '4',
        sImg:simg4,
        slug:'Style-Based-Interior-Design',
        sTitle: 'Style-Based Design',
        description:'Discover designers specializing in modern, minimalist, Scandinavian, luxury, contemporary, and industrial interior design styles.',
        des2:'Browse portfolios by design style and find a designer whose aesthetic matches your vision.',
        des3:'Whether you love clean minimalist lines or rich luxury interiors, Interinest connects you with specialists in every design style.',
        icon:'fi flaticon-interior-design',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins4,
    },
    {
        Id: '5',
        sImg:simg5,
        slug:'Student-Emerging-Designers',
        sTitle: 'Student & Emerging Designers',
        description:'Support fresh talent while staying within budget. Connect with interior design students and emerging professionals offering creative, affordable design solutions.',
        des2:'Great for homeowners wanting unique, creative spaces at affordable rates while supporting the next generation of design talent.',
        des3:'Interinest gives emerging interior designers a platform to showcase their skills and build their careers while clients get fresh, creative design at lower cost.',
        icon:'fi flaticon-armchair',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins5,
    },
    {
        Id: '6',
        sImg:simg6,
        slug:'Interior-Design-Consultation',
        sTitle: 'Design Consultation',
        description:'Not sure where to start? Book a one-on-one consultation with a professional interior designer to discuss your space, requirements, and budget.',
        des2:'Get expert advice, mood boards, and initial design concepts before committing to a full project.',
        des3:'Our consultation services help you clarify your vision, explore design options, and understand costs before beginning your interior design journey.',
        icon:'fi flaticon-furniture',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins6,
    },
    {
        Id: '7',
        sImg:simg7,
        slug:'Interior-Design',
        sTitle: 'Interior Design',
        description:'Professional interior design services for homes and commercial spaces across India.',
        des2:'Our designers create beautiful, functional spaces that reflect your personality and lifestyle.',
        des3:'Interior design encompasses space planning, aesthetics, and function to create beautiful and purposeful living and working environments.',
        icon:'fi flaticon-interior-design',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins6,
    },
    {
        Id: '8',
        sImg:simg8,
        slug:'Room-Decoration',
        sTitle: 'Room Decoration',
        description:'Transform any room with expert interior decoration and styling services.',
        des2:'Our decorators work with your existing furniture and budget to refresh your space.',
        des3:'Interior decoration focuses on the aesthetic elements of a room, including color, texture, lighting, and accessories.',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins6,
    },
    {
        Id: '9',
        sImg:simg9,
        slug:'Planning',
        sTitle: 'Planning',
        description:'Comprehensive space planning and layout design for residential and commercial projects.',
        des2:'Good space planning maximizes functionality, flow, and comfort in any environment.',
        des3:'We analyze your space requirements, lifestyle, and goals to create an optimal layout that works for you.',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins6,
    },
    {
        Id: '10',
        sImg:simg10,
        slug:'Lighting',
        sTitle: 'Lighting',
        description:'Expert interior lighting design to enhance mood, functionality, and aesthetics of your space.',
        des2:'Good lighting design transforms spaces and improves the quality of life for occupants.',
        des3:'We design layered lighting schemes that combine ambient, task, and accent lighting to create the perfect atmosphere.',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins6,
    },
    {
        Id: '11',
        sImg:simg11,
        slug:'Interior-Designs',
        sTitle: 'Interior Design',
        description:'Complete interior design solutions for modern homes and commercial spaces.',
        des2:'From concept to completion, we handle every aspect of your interior design project.',
        des3:'Our comprehensive design approach ensures a cohesive, beautiful result that exceeds your expectations.',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins6,
    },
    {
        Id: '12',
        sImg:simg12,
        slug:'Rooms-Decoration',
        sTitle: 'Room Decoration',
        description:'Creative room decoration services to enhance the beauty and functionality of your living spaces.',
        des2:'Our decorators blend colors, textures, and accessories to create a harmonious and inviting environment.',
        des3:'We pay attention to every detail, from furniture placement to accent pieces, to create a room that tells your story.',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins6,
    },
    {
        Id: '13',
        sImg:simg13,
        slug:'Plannings',
        sTitle: 'Planning',
        description:'Strategic space planning and design consultation for your home or office.',
        des2:'We help you make the most of your available space with smart, practical design solutions.',
        des3:'Our planning process begins with understanding your needs and ends with a detailed layout that maximizes your space potential.',
        ssImg1:sSingleimg1,
        ssImg2:sSingleimg2,
        sinst:ins6,
    },
]
export default Services;
