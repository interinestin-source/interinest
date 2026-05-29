// images
import blogImg1 from "@/public/images/blog/img-4.webp";
import blogImg2 from "@/public/images/blog/img-5.webp";
import blogImg3 from "@/public/images/blog/img-6.webp";

import blogSingleImg1 from "@/public/images/blog/img-4.webp";
import blogSingleImg2 from "@/public/images/blog/img-5.webp";
import blogSingleImg3 from "@/public/images/blog/img-6.webp";



const blogs = [
    {
        id: '1',
        slug:'Best-Architecture-Design',
        title: 'Best Architecture Design',
        thumb:'Architecture',
        screens: blogImg1,
        description: 'Consectetur adipiscing elit. Purusout phasellus malesuada lectus.',
        author: 'Jenefer Willy',
        authorTitle:'Sineor Architect',
        create_at: '14 AUG,23',
        blogSingleImg:blogSingleImg1, 
        comment:'35',
        blClass:'format-standard-image',
    },
    {
        id: '2',
        slug:'Modern-Bedrooms-Tips',
        title: 'Modern Bedrooms Tips',
        thumb:'Interior',
        screens: blogImg2,
        description: 'Consectetur adipiscing elit. Purusout phasellus malesuada lectus.',
        author: 'Konal Biry',
        authorTitle:'Creative Director',
        create_at: '16 AUG,21',
        blogSingleImg:blogSingleImg2, 
        comment:'80',
        blClass:'format-standard-image',
    },
    {
        id: '3',
        slug:'Decoration-Apartment',
        title: 'Decoration Apartment',
        thumb:'Architecture',
        screens: blogImg3,
        description: 'Consectetur adipiscing elit. Purusout phasellus malesuada lectus.',
        author: 'Aliza Anny',
        authorTitle:'Art Director',
        create_at: '18 AUG,21',
        blogSingleImg:blogSingleImg3,
        comment:'95',
        blClass:'format-video',
    },
];
export default blogs;