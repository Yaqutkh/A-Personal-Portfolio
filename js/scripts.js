document.addEventListener('DOMContentLoaded', () => {
    const aboutMe = document.getElementById('aboutMe');
    const projectList = document.getElementById('projectList');
    const spotlight = document.getElementById('projectSpotlight');
    const spotlightTitles = document.getElementById('spotlightTitles');
    const leftArrow = document.querySelector('.arrow-left');
    const rightArrow = document.querySelector('.arrow-right');
    const form = document.getElementById('formSection');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const charactersLeft = document.getElementById('charactersLeft');

    let projectsData = [];
    let aboutMeData = {};

    // تحميل بيانات About Me
    fetch('./starter/js/aboutMeData.json')
        .then(res => res.json())
        .then(json => {
            aboutMeData = json;
            populateAboutMe(aboutMeData);
        })
        .catch(err => console.error('Error loading About Me data:', err));

    // تحميل بيانات المشاريع
    fetch('./starter/js/projectsData.json')
        .then(res => res.json())
        .then(json => {
            projectsData = json;
            populateProjects(projectsData);
            if (projectsData.length > 0) {
                updateSpotlight(projectsData[0]);
            }
        })
        .catch(err => console.error('Error loading Projects data:', err));

    function populateAboutMe(data) {
        aboutMe.innerHTML = ''; // تنظيف المحتوى قبل الإضافة

        const fragment = document.createDocumentFragment();

        // إضافة النص الخاص بـ aboutMe من الملف الجديد
        const bio = document.createElement('p');
        bio.textContent = data.aboutMe || 'No bio provided.';

        // إضافة الصورة من headshot المسار الجديد
        const headshotContainer = document.createElement('div');
        headshotContainer.className = 'headshotContainer';

        const img = document.createElement('img');
        img.src = data.headshot || './starter/img/default.png';
        img.alt = 'Headshot';

        headshotContainer.appendChild(img);
        fragment.appendChild(bio);
        fragment.appendChild(headshotContainer);

        aboutMe.appendChild(fragment);
    }

    function populateProjects(projects) {
        projectList.innerHTML = ''; // تنظيف المحتوى قبل الإضافة

        const fragment = document.createDocumentFragment();

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'projectCard';
            card.id = project.project_id;

            card.style.backgroundImage = `url(${project.card_image || './starter/img/default.png'})`;

            const name = document.createElement('h3');
            name.textContent = project.project_name || 'Untitled Project';

            const desc = document.createElement('p');
            desc.textContent = project.short_description || 'No description.';

            card.appendChild(name);
            card.appendChild(desc);

            card.addEventListener('click', () => {
                updateSpotlight(project);
            });

            fragment.appendChild(card);
        });

        projectList.appendChild(fragment);
    }

    function updateSpotlight(project) {
        spotlight.style.backgroundImage = `url(${project.card_image || './starter/img/default.png'})`;
        spotlightTitles.innerHTML = ''; // تنظيف المحتوى قبل الإضافة

        const name = document.createElement('h2');
        name.textContent = project.project_name || 'Untitled';

        const desc = document.createElement('p');
        desc.textContent = project.long_description || 'No description available.';

        const link = document.createElement('a');
        link.href = project.external_link || '#';
        link.target = '_blank';
        link.textContent = project.external_link ? 'View Project' : 'No Link Available';
        if(!project.external_link) {
            link.style.pointerEvents = 'none';
            link.style.color = 'gray';
            link.style.textDecoration = 'none';
            link.style.cursor = 'default';
        }

        spotlightTitles.appendChild(name);
        spotlightTitles.appendChild(desc);
        spotlightTitles.appendChild(link);
    }

    // Scroll Arrows
    rightArrow.addEventListener('click', () => {
        projectList.scrollBy({
            top: window.innerWidth >= 768 ? 100 : 0,
            left: window.innerWidth < 768 ? 200 : 0,
            behavior: 'smooth'
        });
    });

    leftArrow.addEventListener('click', () => {
        projectList.scrollBy({
            top: window.innerWidth >= 768 ? -100 : 0,
            left: window.innerWidth < 768 ? -200 : 0,
            behavior: 'smooth'
        });
    });

    // Contact form
    messageInput.addEventListener('input', () => {
        const count = messageInput.value.length;
        const remaining = 300 - count;
        charactersLeft.textContent = `Characters left: ${remaining}`;

        if (remaining < 0) {
            charactersLeft.classList.add('error');
        } else {
            charactersLeft.classList.remove('error');
        }
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidCharRegex = /[^a-zA-Z0-9@._-]/;

        let valid = true;

        // Reset errors
        emailError.textContent = '';
        messageError.textContent = '';

        if (!email || !emailRegex.test(email) || invalidCharRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email without special characters.';
            valid = false;
        }

        if (!message) {
            messageError.textContent = 'Message cannot be empty.';
            valid = false;
        } else if (message.length > 300) {
            messageError.textContent = 'Message is too long.';
            valid = false;
        }

        if (valid) {
            alert('Form submitted successfully!');
            form.reset();
            charactersLeft.textContent = 'Characters left: 300';
            charactersLeft.classList.remove('error');
        }
    });
});
