document.addEventListener("DOMContentLoaded", () => {

    // -------- Animation texte compétences --------
    const skills = document.querySelectorAll(".skill");
    if (skills.length > 0) {
        skills.forEach(skill => {
            const letters = skill.textContent.split("");
            skill.textContent = "";
            letters.forEach(letter => {
                const span = document.createElement("span");
                span.textContent = letter;
                span.classList.add("letter");
                skill.appendChild(span);
            });
        });

        let currentSkillIndex = 0;
        const maxSkillIndex = skills.length - 1;
        skills[currentSkillIndex].style.opacity = "1";

        const changeText = () => {
            const currentSkill = skills[currentSkillIndex];
            const nextSkill = currentSkillIndex === maxSkillIndex ? skills[0] : skills[currentSkillIndex + 1];

            Array.from(currentSkill.children).forEach((letter, i) => {
                setTimeout(() => letter.className = "letter out", i * 80);
            });

            nextSkill.style.opacity = "1";
            Array.from(nextSkill.children).forEach((letter, i) => {
                letter.className = "letter behind";
                setTimeout(() => letter.className = "letter in", 340 + i * 80);
            });

            currentSkillIndex = currentSkillIndex === maxSkillIndex ? 0 : currentSkillIndex + 1;
        };

        setInterval(changeText, 3000);
    }

    // -------- Contact form --------
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            fetch(this.action, {
                method: "POST",
                body: new FormData(this),
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    document.getElementById("successMsg").style.display = "block";
                    this.reset();
                } else {
                    alert("❌ Error sending the message.");
                }
            });
        });
    }

    // -------- Cercle de progression compétences pro --------
    const circles = document.querySelectorAll(".circle");
    let currentColor = getComputedStyle(document.documentElement).getPropertyValue('--hover-color').trim() || "#ff6600";

    const updateCircles = (color) => {
        circles.forEach(circle => {
            const percent = parseInt(circle.dataset.percent);
            const angle = (percent / 100) * 360;
            circle.style.background = `conic-gradient(${color} ${angle}deg, #444 ${angle}deg)`;
            const percentText = circle.querySelector(".percent-text");
            if (percentText) percentText.textContent = percent + "%";
        });
    };

    const updateColors = (color) => {
        updateCircles(color);

        const blobPath = document.querySelector('#blobSvg path');
        if (blobPath) blobPath.setAttribute('fill', color);

        skills.forEach(skill => {
            Array.from(skill.children).forEach(letter => letter.style.color = color);
        });

        document.querySelectorAll('.primary-color').forEach(el => el.style.color = color);
        document.querySelectorAll('.primary-bg').forEach(el => el.style.backgroundColor = color);
    };

    if (circles.length > 0) {
        circles.forEach(circle => {
            const percent = parseInt(circle.dataset.percent);
            let count = 0;
            const animate = () => {
                if (count <= percent) {
                    const angle = (count / 100) * 360;
                    circle.style.background = `conic-gradient(${currentColor} ${angle}deg, #444 ${angle}deg)`;
                    circle.querySelector(".percent-text").textContent = count + "%";
                    count++;
                    requestAnimationFrame(animate);
                }
            };
            animate();
        });
    }

    // -------- MixItUp pour portfolio --------
    const portfolioGallery = document.querySelector('.portfolio_galery');
    if (portfolioGallery) {
        mixitup(portfolioGallery, {
            selectors: { target: '.port-box' },
            animation: { duration: 300 }
        });
    }

    // -------- Menu actif selon scroll --------
    const menuLinks = document.querySelectorAll('header ul li a');
    const sections = document.querySelectorAll('section');

    const updateMenu = () => {
        let index = sections.length;
        while (--index && window.scrollY + 100 < sections[index].offsetTop) {}
        menuLinks.forEach(link => link.classList.remove("active"));
        if (menuLinks[index]) menuLinks[index].classList.add("active");
    };
    window.addEventListener("scroll", updateMenu);
    updateMenu();

    // -------- Toggle menu mobile --------
    const menuIcon = document.getElementById("menu_icon");
    const navList = document.querySelector(".lists");
    if (menuIcon && navList) {
        menuIcon.addEventListener("click", () => {
            navList.classList.toggle("active");
            menuIcon.classList.toggle("bx-menu");
            menuIcon.classList.toggle("bx-x");
        });
        navList.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navList.classList.remove("active");
                menuIcon.classList.add("bx-menu");
                menuIcon.classList.remove("bx-x");
            });
        });
    }
// -------- Style switcher --------
const styleSwitcher = document.querySelector('.style-switcher');
const toggler = document.querySelector('.style-switcher-toggler');
const dayNight = document.querySelector('.day-night');
const colorSpans = document.querySelectorAll('.colors span');

if (toggler && styleSwitcher) {
    toggler.addEventListener('click', () => styleSwitcher.classList.toggle('open'));
}

colorSpans.forEach(span => {
    span.addEventListener('click', () => {
        const color = span.dataset.color;
        if (color) {
            document.documentElement.style.setProperty('--skin-color', color);
            document.documentElement.style.setProperty('--hover-color', color);
            currentColor = color;
            updateColors(color);

            // ✅ Sauvegarder la couleur choisie
            localStorage.setItem("theme-color", color);

            styleSwitcher.classList.remove('open');
        }
    });
});

// ✅ Récupérer couleur sauvegardée au chargement
const savedColor = localStorage.getItem("theme-color");
if (savedColor) {
    document.documentElement.style.setProperty('--skin-color', savedColor);
    document.documentElement.style.setProperty('--hover-color', savedColor);
    currentColor = savedColor;
    updateColors(savedColor);
}

    // -------- Mode Dark / Light --------
    const applyTheme = (theme) => {
        document.body.classList.remove("dark", "light");
        document.body.classList.add(theme);
        localStorage.setItem("theme", theme);

        const icon = dayNight.querySelector('i');
        if (icon) {
            if (theme === "dark") {
                icon.classList.remove("fa-sun");
                icon.classList.add("fa-moon");
            } else {
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
            }
        }
    };

    if (dayNight) {
        dayNight.addEventListener('click', () => {
            const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
            applyTheme(newTheme);
        });
    }

    const savedTheme = localStorage.getItem("theme") || "dark";
    applyTheme(savedTheme);

});
const readTexts = {
    en: { more: "Read More", less: "Read Less" },
    fr: { more: "En savoir plus", less: "En savoir moins" }
};

// Récupérer la langue sauvegardée ou par défaut
let currentLang = localStorage.getItem("lang") || "en";
    // -------- ABOUT ME : Read More --------
const aboutBtn = document.getElementById("readMoreBtn");
const aboutMoreText = document.getElementById("more-text");

if (aboutBtn && aboutMoreText) {
    // Restaurer l’état
    if (localStorage.getItem("about-readmore") === "expanded") {
        aboutMoreText.style.display = "block";
        aboutBtn.textContent = readTexts[currentLang].less;
    } else {
        aboutMoreText.style.display = "none";
        aboutBtn.textContent = readTexts[currentLang].more;
    }

    aboutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const isHidden = getComputedStyle(aboutMoreText).display === "none";

        if (isHidden) {
            aboutMoreText.style.display = "block";
            aboutBtn.textContent = readTexts[currentLang].less;
            localStorage.setItem("about-readmore", "expanded");
        } else {
            aboutMoreText.style.display = "none";
            aboutBtn.textContent = readTexts[currentLang].more;
            localStorage.setItem("about-readmore", "collapsed");
        }
    });
}

// -------- SERVICES : Read More --------
document.querySelectorAll(".readMoreBtn").forEach((button, index) => {
    const moreText = button.closest(".service_box").querySelector(".more-text");

    // Restaurer état sauvegardé
    if (localStorage.getItem(`service-readmore-${index}`) === "expanded") {
        moreText.style.display = "block";
        button.textContent = readTexts[currentLang].less;
    } else {
        moreText.style.display = "none";
        button.textContent = readTexts[currentLang].more;
    }

    button.addEventListener("click", function(e) {
        e.preventDefault();
        const isHidden = getComputedStyle(moreText).display === "none";

        if (isHidden) {
            moreText.style.display = "block";
            this.textContent = readTexts[currentLang].less;
            localStorage.setItem(`service-readmore-${index}`, "expanded");
        } else {
            moreText.style.display = "none";
            this.textContent = readTexts[currentLang].more;
            localStorage.setItem(`service-readmore-${index}`, "collapsed");
        }
    });
});
function updateReadMoreButtons(lang) {
  document.querySelectorAll(".readMoreBtn").forEach((button, index) => {
    const moreText = button.closest(".service_box").querySelector(".more-text");
    const isHidden = getComputedStyle(moreText).display === "none";

    button.textContent = isHidden 
      ? readTexts[lang].more 
      : readTexts[lang].less;
  });
}


    // -------- Stars background --------
    const starsContainer = document.getElementById("stars");
    if (starsContainer) {
        for (let i = 0; i < 40; i++) {
            const star = document.createElement("div");
            star.classList.add("star");
            star.style.top = Math.random() * 100 + "%";
            star.style.left = Math.random() * 100 + "%";
            const size = Math.random() * 4 + 2;
            star.style.width = size + "px";
            star.style.height = size + "px";
            star.style.animationDelay = (Math.random() * 3) + "s";
            starsContainer.appendChild(star);
        }
    }


document.addEventListener("DOMContentLoaded", () => {
    const translations = {
        en: {
            // Header & Navigation
            "Home": "Home",
            "About": "About",
            "Services": "Services",
            "Skills": "Skills",
            "Portfolio": "Portfolio",
            "Contact": "Contact",

            // Home Section
            "Hi! I'm": "Hi! I'm",
            "And I'm": "And I'm",
            "web Developer": "Web Developer",
            "Full Stact Developer": "Full Stack Developer",
            "UX/UI Developer": "UX/UI Developer",
            "Graphic Designer": "Graphic Designer",
            "I study computer science at BIT second year. Bachelor's degree in 2026": "I study computer science at BIT second year. Bachelor's degree in 2026",
            "View CV": "View CV",
            "🤝 Let's collaborate!": "🤝 Let's collaborate!",

            // About Section
            "Let me introduce Myself": "Let me introduce Myself",
            "About me": "About me",
            "An Inspiring Story": "An Inspiring Story",
            intro: "Hello! My name is Djémilatou BONKOUNGOU, a passionate computer science student and aspiring full-stack developer. I create elegant and functional websites, design engaging user experiences, and constantly explore new technologies. My goal is to combine creativity and coding to build innovative solutions that make people’s lives easier and more enjoyable. Beyond coding, I am deeply interested in entrepreneurship and digital innovation. I believe that technology is not just about solving problems but also about creating opportunities. In the future, I aspire to contribute to impactful projects that empower communities, especially in Africa, by promoting digital solutions adapted to local needs.",

            // About Stats
            "Years Experience": "Years Experience",
            "Academic & Personal Projects": "Academic & Personal Projects",
            "International Internship": "International Internship",

            // Services Section
            "what I will do for you": "What I can do for you",
            "Our services": "Our Services",
            "Graphic Designer": "Graphic Designer",
            "I create attractive visuals for your projects, including logos and custom illustrations.": "I create attractive visuals for your projects, including logos and custom illustrations.",
            "graphic-details": "My work focuses on delivering unique and professional graphic solutions adapted to your brand. From business cards to digital banners, I ensure high-quality designs that make your identity stand out.",
            "Programmation": "Programming",
            "Web development, applications, and customized solutions tailored to your needs.": "Web development, applications, and customized solutions tailored to your needs.",
            "Website": "Website",
            "Creating modern, responsive, and visually appealing websites for all projects.": "Creating modern, responsive, and visually appealing websites for all projects.",
            "I design and develop websites that are mobile-friendly, SEO-optimized, and easy to maintain. Whether it’s a personal portfolio, e-commerce, or corporate website, I ensure an elegant design and smooth user experience.": "I design and develop websites that are mobile-friendly, SEO-optimized, and easy to maintain. Whether it’s a personal portfolio, e-commerce, or corporate website, I ensure an elegant design and smooth user experience.",
            "My work focuses on delivering unique and professional graphic solutions adapted to your brand. \n                From business cards to digital banners, I ensure high-quality designs that make your identity stand out.":"My work focuses on delivering unique and professional graphic solutions adapted to your brand. From business cards to digital banners, I ensure high-quality designs that make your identity stand out.",
            "I specialize in Full-Stack development using modern technologies. \n                From front-end design to back-end functionality, I build scalable and efficient applications \n                that meet professional standards and solve real-world problems.":"I specialize in Full-Stack development using modern technologies. From front-end design to back-end functionality, I build scalable and efficient applications that meet professional standards and solve real-world problems.",
            "I design and develop websites that are mobile-friendly, SEO-optimized, and easy to maintain. \n                Whether it’s a personal portfolio, e-commerce, or corporate website, \n                I ensure an elegant design and smooth user experience.":"I design and develop websites that are mobile-friendly, SEO-optimized, and easy to maintain. Whether it’s a personal portfolio, e-commerce, or corporate website, I ensure an elegant design and smooth user experience.",

            // Skills Section
            "Technical and Professional": "Technical and Professional",
            "My Skills": "My Skills",
            "Frontend": "Frontend",
            "Backend": "Backend",
            "Databases & APIs": "Databases & APIs",
            "Professional skill": "Professional Skills",
            "Team Work": "Team Work",
            "Communication": "Communication",
            "Collaboration": "Collaboration",
            "Creativity": "Creativity",
            "Leadership": "Leadership",
            "Entrepreneurship": "Entrepreneurship",

            // Portfolio Section
            "What I can do for you": "What I can do for you",
            "Projects coming soon! Stay connected.": "Projects coming soon! Stay connected.",
            "Latest Projects": "Latest Projects",
            "All": "All",
            "Web": "Web",
            "UI/UX": "UI/UX",
            "Full Stack": "Full Stack",
            "AI": "AI",
            "Design": "Design",
            "Web Development": "Web Development",
            "Developed a responsive company website using HTML, CSS, and JavaScript to improve visibility and user engagement.": "Developed a responsive company website using HTML, CSS, and JavaScript to improve visibility and user engagement.",
            "AI Assistant": "AI Assistant",
            "Built an intelligent assistant capable of answering user questions and analyzing data automatically to enhance decision-making.": "Built an intelligent assistant capable of answering user questions and analyzing data automatically to enhance decision-making.",
            "UI/UX Design": "UI/UX Design",
            "Designed a clean and intuitive user interface for a web app with Figma and Adobe XD, boosting usability and customer satisfaction.": "Designed a clean and intuitive user interface for a web app with Figma and Adobe XD, boosting usability and customer satisfaction.",
            "Full Stack Development": "Full Stack Development",
            "Developed a complete e-commerce platform with React (frontend) and Node.js/Express (backend), including secure online payments.": "Developed a complete e-commerce platform with React (frontend) and Node.js/Express (backend), including secure online payments.",
            "Graphic Design": "Graphic Design",
            "Created brand visuals, logos, and marketing graphics to strengthen client branding and digital presence.": "Created brand visuals, logos, and marketing graphics to strengthen client branding and digital presence.",
            "Web Application": "Web Application",
            "Developed a task management app with real-time features to help users stay organized and improve productivity.": "Developed a task management app with real-time features to help users stay organized and improve productivity.",
            "Creative Solution": "Creative Solution",
            "Implemented an online booking system combining design, performance, and responsiveness for seamless user experience.": "Implemented an online booking system combining design, performance, and responsiveness for seamless user experience.",

            // Contact Section
            "Contact Me": "Contact Me",
            "Have You Any Questions ?": "Have You Any Questions?",
            "I'M AT YOUR SERVICES": "I'M AT YOUR SERVICES",
            "Call me On": "Call me On",
            "Office": "Office",
            "Email": "Email",
            "Website": "Website",
            "SEND ME AN EMAIL": "SEND ME AN EMAIL",
            "I'M VERY RESPONSIVE TO MESSAGES": "I'M VERY RESPONSIVE TO MESSAGES",
           "placeholder-name": "Name",
        "placeholder-email": "Email",
        "placeholder-subject": "Subject",
            "Send Message": "Send Message"
        },
        fr: {
            "Home": "Accueil",
            "About": "À propos",
            "Services": "Services",
            "Skills": "Compétences",
            "Portfolio": "Portfolio",
            "Contact": "Contact",
            "Hi! I'm": "Salut! Je suis",
            "And I'm": "Et je suis",
            "web Developer": "Développeuse Web",
            "Full Stact Developer": "Développeuse Full Stack",
            "UX/UI Developer": "Développeuse UX/UI",
            "Graphic Designer": "Graphiste",
            "I study computer science at BIT second year. Bachelor's degree in 2026": "J'étudie l'informatique à BIT en deuxième année. Licence prévue en 2026",
            "View CV": "Voir CV",
            "🤝 Let's collaborate!": "🤝Collaborons!",
            "Let me introduce Myself": "Permettez-moi de me présenter",
            "About me": "À propos de moi",
            "An Inspiring Story": "Une histoire inspirante",
            intro: "Bonjour ! Je m'appelle Djémilatou BONKOUNGOU, étudiante passionnée en informatique et future développeuse full-stack. Je crée des sites élégants et fonctionnels, conçois des expériences utilisateur engageantes et explore constamment les nouvelles technologies. Mon objectif est de combiner créativité et programmation pour construire des solutions innovantes qui facilitent et enrichissent la vie des gens. Au-delà du code, je m'intéresse profondément à l'entrepreneuriat et à l'innovation numérique. Je crois que la technologie ne se limite pas à résoudre des problèmes, mais aussi à créer des opportunités. À l'avenir, j'aspire à contribuer à des projets impactants qui autonomisent les communautés, notamment en Afrique, en promouvant des solutions numériques adaptées aux besoins locaux.",

            
            "Years Experience": "Années d'expérience",
            "Academic & Personal Projects": "Projets académiques et personnels",
            "International Internship": "Stage international",
            "what I will do for you": "Ce que je peux faire pour vous",
            "Our services": "Nos Services",
            "Graphic Designer": "Graphiste",
            "I create attractive visuals for your projects, including logos and custom illustrations.": "Je crée des visuels attractifs pour vos projets, incluant logos et illustrations personnalisées.",
            "Programmation": "Programmation",
            "Web development, applications, and customized solutions tailored to your needs.": "Développement web, applications et solutions personnalisées adaptées à vos besoins.",
            "Website": "Site Web",
            "Creating modern, responsive, and visually appealing websites for all projects.": "Création de sites modernes, responsive et visuellement attrayants pour tous les projets.",
           
            "graphic-details": "Mon travail se concentre sur la livraison de solutions graphiques uniques et professionnelles adaptées à votre marque. Des cartes de visite aux bannières digitales, j'assure des designs de haute qualité qui font ressortir votre identité.",
            "graphic-details-1":"Je me spécialise dans le développement Full-Stack en utilisant des technologies modernes. Du design front-end à la fonctionnalité back-end, je construis des applications évolutives et efficaces qui répondent aux standards professionnels et résolvent des problèmes réels.",
            "graphic-details-2":"Je conçois et développe des sites web adaptés aux mobiles, optimisés SEO et faciles à maintenir. Qu’il s’agisse d’un portfolio personnel, d’un site e-commerce ou d’un site d’entreprise, j’assure un design élégant et une expérience utilisateur fluide.",
            // Skills
            "Technical and Professional": "Technique et Professionnel",
            "My Skills": "Mes Compétences",
            "Frontend": "Frontend",
            "Backend": "Backend",
            "Databases & APIs": "Bases de données & APIs",
            "Professional skill": "Compétences professionnelles",
            "Team Work": "Travail en équipe",
            "Communication": "Communication",
            "Collaboration": "Collaboration",
            "Creativity": "Créativité",
            "Leadership": "Leadership",
            "Entrepreneurship": "Entrepreneuriat",

            // Portfolio
            "What I can do for you": "Ce que je peux faire pour vous",
            "Projects coming soon! Stay connected.": "Projets à venir ! Restez connecté.",
            "Latest Projects": "Projets récents",
            "All": "Tous",
            "Web": "Web",
            "UI/UX": "UI/UX",
            "Full Stack": "Full Stack",
            "AI": "IA",
            "Design": "Design",
            "Web Development": "Développement Web",
            "Developed a responsive company website using HTML, CSS, and JavaScript to improve visibility and user engagement.": "Développement d’un site web d’entreprise responsive avec HTML, CSS et JavaScript pour améliorer la visibilité et l’engagement utilisateur.",
            "AI Assistant": "Assistant IA",
            "Built an intelligent assistant capable of answering user questions and analyzing data automatically to enhance decision-making.": "Création d’un assistant intelligent capable de répondre aux questions des utilisateurs et d’analyser automatiquement les données pour améliorer la prise de décision.",
            "UI/UX Design": "Design UI/UX",
            "Designed a clean and intuitive user interface for a web app with Figma and Adobe XD, boosting usability and customer satisfaction.": "Conception d’une interface utilisateur claire et intuitive pour une application web avec Figma et Adobe XD, améliorant l’utilisabilité et la satisfaction client.",
            "Full Stack Development": "Développement Full Stack",
            "Developed a complete e-commerce platform with React (frontend) and Node.js/Express (backend), including secure online payments.": "Développement d’une plateforme e-commerce complète avec React (frontend) et Node.js/Express (backend), incluant des paiements en ligne sécurisés.",
            "Graphic Design": "Design Graphique",
            "Created brand visuals, logos, and marketing graphics to strengthen client branding and digital presence.": "Création de visuels de marque, logos et supports marketing pour renforcer l’identité et la présence digitale des clients.",
            "Web Application": "Application Web",
            "Developed a task management app with real-time features to help users stay organized and improve productivity.": "Développement d’une application de gestion de tâches avec fonctionnalités en temps réel pour aider les utilisateurs à rester organisés et améliorer leur productivité.",
            "Creative Solution": "Solution Créative",
            "Implemented an online booking system combining design, performance, and responsiveness for seamless user experience.": "Mise en place d’un système de réservation en ligne combinant design, performance et réactivité pour une expérience utilisateur optimale.",

            // Contact Section
            "Contact Me": "Contactez-moi",
            "Have You Any Questions ?": "Vous avez des questions ?",
            "I'M AT YOUR SERVICES": "Je suis à votre service",
            "Call me On": "Appelez-moi au",
            "Office": "Bureau",
            "Email": "Email",
            "Website": "Site Web",
            "SEND ME AN EMAIL": "Envoyez-moi un email",
            "I'M VERY RESPONSIVE TO MESSAGES": "Je réponds rapidement aux messages",
            "placeholder-name": "Nom",
            "placeholder-subject": "Sujet",
            "Message": "Message",
            "Send Message": "Envoyer le message"
        }
    };

    // Sauvegarde du texte d'origine pour éviter les pertes
    document.querySelectorAll("body *").forEach(node => {
        if (node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE) {
            node.dataset.original = node.textContent.trim();
        }
    });
function translatePage(lang) {
    document.querySelectorAll("[data-translate]").forEach(el => {
        const key = el.getAttribute("data-translate");
        if (translations[lang][key]) {
            // Vérifie si c'est un placeholder ou du texte
            if (el.placeholder !== undefined) {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });
}


function translateServices(lang) {
    document.querySelectorAll(".service_box").forEach(box => {
        const moreText = box.querySelector(".more-text");
        const key = moreText?.getAttribute("data-translate");
        if (key && translations[lang][key]) {
            moreText.textContent = translations[lang][key];
        }

        const btn = box.querySelector(".readMoreBtn");
        if (btn) {
            const isVisible = getComputedStyle(moreText).display !== "none";
            btn.textContent = isVisible ? readTexts[lang].less : readTexts[lang].more;
        }
    });
}
function updateReadMoreButton(button) {
    const moreText = document.getElementById("more-text");
    if (!moreText) return;

    const isVisible = getComputedStyle(moreText).display !== "none";
    button.textContent = isVisible ? readTexts[currentLang].less : readTexts[currentLang].more;
}
const aboutBtn = document.getElementById("readMoreBtn");
const aboutMoreText = document.getElementById("more-text");

if (aboutBtn && aboutMoreText) {
    // Restaurer état sauvegardé
    if (localStorage.getItem("about-readmore") === "expanded") {
        aboutMoreText.style.display = "block";
    } else {
        aboutMoreText.style.display = "none";
    }
    updateReadMoreButton(aboutBtn);

    // Clic
    aboutBtn.addEventListener("click", e => {
        e.preventDefault();
        const isHidden = getComputedStyle(aboutMoreText).display === "none";
        aboutMoreText.style.display = isHidden ? "block" : "none";
        updateReadMoreButton(aboutBtn);

        localStorage.setItem("about-readmore", isHidden ? "expanded" : "collapsed");
    });
}

translatePage(currentLang);
    function translateNode(node, lang) {
        if (node.nodeType === Node.TEXT_NODE) {
            const original = node.parentNode.dataset.original;
            if (original && translations[lang][original]) {
                node.textContent = translations[lang][original];
            }
        } else {
            node.childNodes.forEach(child => translateNode(child, lang));
        }
    }

    const setLanguage = (lang) => {
        translateNode(document.body, lang);
        translatePage(lang);
        updateReadMoreButtons(lang);      // traduction générale
        translateServices(lang);
    
        localStorage.setItem("lang", lang);
        const languageSelect = document.getElementById("language");
        if (languageSelect) languageSelect.value = lang;
    };

    const languageSelect = document.getElementById("language");
    if (languageSelect) {
        languageSelect.addEventListener("change", e => setLanguage(e.target.value));
    }

    // Touche F pour switch rapide
    document.addEventListener("keydown", e => {
        if (e.key.toLowerCase() === "f") {
            const currentLang = localStorage.getItem("lang") || "en";
            setLanguage(currentLang === "en" ? "fr" : "en");
        }
    });

    const savedLang = localStorage.getItem("lang") || "en";
    setLanguage(savedLang);
});