import axios from 'axios';
import $ from 'jquery';
import { showAlert } from '../../../utils/alert';
import { popupBox, getRandomInt } from '../../../utils/helper';

import jsLogo from '../../imgs/logos/jsLogo.svg';
import cssLogo from '../../imgs/logos/cssLogo.svg';
import htmlLogo from '../../imgs/logos/htmlLogo.svg';
import nodejsLogo from '../../imgs/logos/nodejsLogo.svg';
import designImg from '../../imgs/about-us/design.webp';
import developImg from '../../imgs/about-us/develop.webp';
import funtionsImg from '../../imgs/about-us/funtions.webp';

$('.learn-more-btn').on('click', (e) => {
    e.preventDefault();
    $('.about-us')[0].scrollIntoView({
        behavior: 'smooth',
    });
});
$('.cta-get-started, .contact-link').on('click', (e) => {
    e.preventDefault();
    $('.contact-us')[0].scrollIntoView({
        behavior: 'smooth',
    });
});

const documentHeight = () => {
    const doc = document.documentElement;
    const height = window.innerHeight - $('.nav').height();
    doc.style.setProperty('--doc-height', `${height}px`);
};
documentHeight();
window.addEventListener('resize', documentHeight);
$('window').scrollTop(0);

export const formSubmit = async () => {
    const data = {
        fullName: $('#name').val(),
        email: $('#email').val(),
        budget: $('#budget').val(),
        websiteType: $('#website-type').val(),
        message: $('#message').val(),
    };

    const nullData =
        !data.websiteType ||
        !data.budget ||
        !data.fullName ||
        !data.email ||
        !data.message
            ? true
            : false;

    if (nullData) {
        popupBox('All field must be completed to submit your request');
    } else {
        try {
            const res = await axios({
                method: 'POST',
                url: '/api/v1/form/submit',
                data,
            });

            if (res.data.status === 'success') {
                location.assign('/confirm/request');
            }
        } catch (err) {
            showAlert('error', err.response.data.msg);
        }
    }
};

/* **************************** */
/* CIRCULAR TEXT CTA  */
/* **************************** */
const text = $('.circular-text').html().trim();
const circularTextSpan = text
    .split('')
    .map((char, i) => {
        const r = (360 / text.length) * i;
        return `<span style="transform:rotateZ(${r}deg)">${char}</span>`;
    })
    .join('');

$('.circular-text').html(circularTextSpan);

/* **************************** */
/* TABS COMPONENT  */
/* **************************** */
const tabsData = [
    {
        title: `Design & Layout`,
        description: `We design visually appealing and user-friendly websites tailored
        to effectively communicate our clients' message and meet their
        target audience's needs. Our team takes the time to understand our clients' goals and the needs of their target audience to create a website that meets their specific needs.`,
        img: designImg,
        alt: `Image of a person designing a wireframe on an iPad device.`,
    },
    {
        title: `Development`,
        description: `We specialize in building custom websites that meet your specific
        needs. Whether it's a landing page, multipage website, or
        fullstack webapp, our team of experts can help bring your vision
        to life. We use the latest technologies for optimal performance
        and user experience.`,
        img: developImg,
        alt: `A picture of a computer on a desk with codes on the screen.`,
    },
    {
        title: `Functionalities`,
        description: `We understand that your website may require additional
        functionalities beyond the basic design and layout. Our team can
        help enhance your website by adding features such as user
        authentication, CRUD operations, and even CRM systems.`,
        img: funtionsImg,
        alt: `A computer showing an admin dashboard for a webapp.`,
    },
];

$('.tab').on('click', (e) => {
    $('.tab').removeClass('active');
    $(`.tab--${e.target.dataset.tab}`).addClass('active');
    let data = tabsData[`${e.target.dataset.tab - 1}`];
    $('.about-us .title').text(data.title);
    $('.about-us .description').text(data.description);
    $('.about-us .img-1').attr('src', data.img);
    $('.about-us .img-1').attr('alt', data.alt);
});

/* **************************** */
/* PROJECTS  */
/* **************************** */
const projectData = {
    interval: {
        name: 'interval.app',
        description: `Built by startercode, interval is an easy-to-use timer app for interval training, with customizable and saveable presets, duration and rest interval settings and rounds, and a login feature for access across multiple devices.`,
        logos: `
            <img src="${nodejsLogo}" alt="" />
            <img src="${jsLogo}" alt="" />
            <img src="${htmlLogo}" alt="" />
            <img src="${cssLogo}" alt="" />
            `,
        website: `https://interval.up.railway.app/`,
        github: `https://github.com/startercode-dev/interval-app`,
    },

    dinero: {
        name: 'Dinero',
        description: `Dinero uses technology for innovative financial services, such as mobile banking and digital wallets, to disrupt traditional banking. They offer cost-effective solutions for customers to manage finances easily.`,
        logos: `
            <img src="${jsLogo}" alt="" />
            <img src="${htmlLogo}" alt="" />
            <img src="${cssLogo}" alt="" />
            `,
        website: `https://dinero-fintech.netlify.app`,
        github: `https://github.com/startercode-dev/dinero`,
    },

    nything: {
        name: 'nything',
        description: `Write anything on this forum. Nything is a space where like-minded people can come together and share ideas. Just create an account to start writing and commenting.`,
        logos: `
            <img src="${nodejsLogo}" alt="" />
            <img src="${jsLogo}" alt="" />
            <img src="${htmlLogo}" alt="" />
            <img src="${cssLogo}" alt="" />
            `,
        website: `https://nything.cyclic.app/`,
        github: `https://github.com/startercode-dev/Nything`,
    },

    blogr: {
        name: 'Blogr',
        description: `Discover the future of blogging with our modern publishing platform. Our website offers a sleek and user-friendly interface, allowing you to effortlessly create and publish content. You can even customize your blog to your specific needs and style.`,
        logos: `
            <img src="${jsLogo}" alt="" />
            <img src="${htmlLogo}" alt="" />
            <img src="${cssLogo}" alt="" />
            `,
        website: `https://blogr-forum.netlify.app`,
        github: `https://github.com/startercode-dev/blogr`,
    },

    sunnyside: {
        name: 'Sunnyside',
        description: `Establish a strong and memorable brand online with our professional branding company. We provide comprehensive branding services, including logo design, website creation, and social media management.`,
        logos: `
            <img src="${jsLogo}" alt="" />
            <img src="${htmlLogo}" alt="" />
            <img src="${cssLogo}" alt="" />
            `,
        website: `https://sunnyside-brandings.netlify.app`,
        github: `https://github.com/startercode-dev/sunnyside`,
    },

    space: {
        name: 'Space Tourism',
        description: `Embark on a journey of a lifetime with our space tourism website. We are your one-stop destination for all things space travel and adventure. Experience the thrill of zero gravity and witness the breathtaking beauty of our planet from space.`,
        logos: `
            <img src="${jsLogo}" alt="" />
            <img src="${htmlLogo}" alt="" />
            <img src="${cssLogo}" alt="" />
            `,
        website: `https://space-tourism-explore.netlify.app`,
        github: `https://github.com/startercode-dev/space-tourism`,
    },
};

const generateMarkup = function (data) {
    return `
        <div class="info-title flex">
            <h2 class="title-name">${data.name}</h2>
            <div class="title-logos flex">
                ${data.logos}
            </div>
        </div>
    
        <p class="info-description">
            ${data.description}
        </p>
    
        <div class="info-links flex">
            <a href="${data.website}" class="visit link" target="_blank">visit</a>
            <div class="line">/</div>
            <a href="${data.github}" class="github link" target="_blank">github</a>
        </div>
    
        <div class="section-title">PROJECTS</div>
        `;
};

const projects = [
    'interval',
    'nything',
    'dinero',
    'sunnyside',
    'blogr',
    'space',
];
$('.project').on('click', (e) => {
    $(`.project`).removeClass('active');

    projects.forEach((el) => {
        if (e.target.closest('.project').dataset.project === el) {
            $(`.project-${el}`).addClass('active');
            $('.projects__info').html(generateMarkup(projectData[`${el}`]));
        }
    });
});
$('.projects__info').html(generateMarkup(projectData.interval));

/* **************************** */
/* TEAM COMPONENT  */
/* **************************** */
const jasonHTML = `
    <div class="flex-column">
        <div class="member-name">Jason</div>
        <div class="member-position">co-founder</div>
    </div>
    <div class="member-description">
    As a designer with a passion for technology, I am always on the
    lookout for new and exciting ways to push the boundaries of what
    is possible. Whether its working on a solo project or
    collaborating with others, I am driven by my love for design and
    desire to create innovative solutions. My skills and knowledge
    are constantly evolving, and I am always looking to take on new
    challenges.
    </div>
`;
const ronaldHTML = `
    <div class="flex-column">
        <div class="member-name">Ronald</div>
        <div class="member-position">co-founder</div>
    </div>
    <div class="member-description">
    I began my coding journey 5 years ago doing automation work for a
    small business in South SF. I created sleek front-end designs and
    complex back-end applications to streamline important business
    processes. Now I focus my efforts on designing websites and
    applications for small businesses around the world.
    </div>
`;

$('.container-mobile .team__img img').on('click', (e) => {
    $('.team__img').removeClass('active');
    $(`.img-${e.target.dataset.member}`).addClass('active');
    if (e.target.dataset.member === 'jason') {
        $('.container-mobile .team__info').html(jasonHTML);
    } else {
        $('.container-mobile .team__info').html(ronaldHTML);
    }
});

const randomizeBio = () => {
    $('.team__img').removeClass('active');
    const randomInt = getRandomInt(2);
    if (randomInt === 1) {
        $('.img-jason').addClass('active');
        $('.container-mobile .team__info').html(jasonHTML);
    } else {
        $('.img-ronald').addClass('active');
        $('.container-mobile .team__info').html(ronaldHTML);
    }
};
randomizeBio();

/* **************************** */
/* SIDE INDICATOR  */
/* **************************** */
const [...sections] = $('section');
const [heroSection] = $('.hero');

const showSideIndicator = (entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            $('.side-indicator').removeClass('hide');
        } else {
            $('.side-indicator').addClass('hide');
            // HERO INIT ANIMATION
            $('.hero__content').removeClass('init-animation');
        }
    });
};
const heroObserver = new IntersectionObserver(showSideIndicator, {
    root: null,
    threshold: 0.2,
});
heroObserver.observe(heroSection);

const addCurrentClass = (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            let currentSection = $(`a[href='#${entry.target.id}']`);
            $('.bullet').removeClass('current');
            currentSection.addClass('current');
        }
    });
};
const initAnimation = (entries) => {
    entries.forEach((entry) => {
        if (entry.target.id) {
            if (entry.isIntersecting) {
                $(`.${entry.target.id}__content`).removeClass('init-animation');
            } else {
                if (entry.target.id !== 'contact-us') {
                    // Contact us animation only run once
                    $(`.${entry.target.id}__content`).addClass(
                        'init-animation'
                    );
                }
            }
        }
    });
};
const sectionObserver = new IntersectionObserver(addCurrentClass, {
    root: null,
    threshold: 0.5,
});
const sectionObserver2 = new IntersectionObserver(initAnimation, {
    root: null,
    threshold: 0.5,
});
sections.forEach((section) => {
    sectionObserver.observe(section);
    sectionObserver2.observe(section);
});

/* **************************** */
/* PROJECT SWIPER  */
/* **************************** */
const swiper = new Swiper('.swiper', {
    mousewheelControl: true,
    slideToClickedSlide: true,
    freeMode: true,
    slidesPerView: 'auto',
    spaceBetween: 10,
    breakpoints: {
        375: {
            spaceBetween: 25,
        },

        560: {
            spaceBetween: 45,
        },

        1360: {
            spaceBetween: 50,
        },

        1504: {
            spaceBetween: 55,
        },
    },
    scrollbar: {
        el: '.swiper-scrollbar',
        hide: true,
    },
});
