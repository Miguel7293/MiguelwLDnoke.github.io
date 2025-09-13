document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar hide/show on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
        document.getElementById('mainNav').style.top = '-80px';
    } else {
        document.getElementById('mainNav').style.top = '0';
    }
    lastScrollTop = st <= 0 ? 0 : st;
});

// Animaciones con Anime.js
document.addEventListener('DOMContentLoaded', () => {
    anime.timeline({
        easing: 'easeOutQuad',
        duration: 800
    })
    .add({
        targets: '.hero-line1',
        opacity: [0, 1],
        translateX: [-50, 0],
        rotate: [-10, -5],
    })
    .add({
        targets: '.hero-line2',
        opacity: [0, 1],
        translateX: [-50, 0],
        rotate: [-10, -3],
    }, '-=600')
    .add({
        targets: '.hero-line3',
        opacity: [0, 1],
        translateX: [-50, 0],
        rotate: [-10, -1],
    }, '-=600')
    .add({
        targets: '.hero-description',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800
    });

    const sections = document.querySelectorAll('.section-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 800,
                    easing: 'easeOutQuad'
                });
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    fetchGitHubRepos();
});

async function fetchGitHubRepos() {
    const username = 'Miguel7293';
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`;

    try {
        const response = await fetch(apiUrl);
        console.log('API Response Status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const repos = await response.json();
        console.log('Repos fetched:', repos);

        const container = document.getElementById('projects-container');
        container.innerHTML = '';

        for (let index = 0; index < repos.length; index++) {
            const repo = repos[index];
            console.log(`Processing repo: ${repo.name}`);

            const languagesUrl = `https://api.github.com/repos/${username}/${repo.name}/languages`;
            const languagesResponse = await fetch(languagesUrl);
            console.log(`Languages API for ${repo.name}:`, languagesResponse.status);
            const languages = languagesResponse.ok ? await languagesResponse.json() : {};

            const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

            let languagesBarHtml = '<div class="languages-bar">';
            let languagesTextHtml = '<ul class="languages-list">';
            for (const [lang, bytes] of Object.entries(languages)) {
                const percentage = totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(2) : 0;
                const safeLang = lang.replace(/[^a-zA-Z0-9]/g, '');
                languagesBarHtml += `<div class="language-segment language-${safeLang}" style="width: ${percentage}%;" data-percentage="${percentage}%"></div>`;
                languagesTextHtml += `<li><span class="language-color language-${safeLang}"></span>${lang}: ${percentage}%</li>`;
            }
            if (Object.keys(languages).length === 0) {
                languagesBarHtml += '<div class="language-segment language-Other" style="width: 100%;" data-percentage="100%"></div>';
                languagesTextHtml += '<li><span class="language-color language-Other"></span>Other: 100%</li>';
            }
            languagesBarHtml += '</div>';
            languagesTextHtml += '</ul>';

            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card bg-dark text-light">
                    <div class="card-body">
                        <h5 class="card-title">${repo.name}</h5>
                        ${languagesBarHtml}
                        ${languagesTextHtml}
                        <p class="card-text">${repo.description || 'No description'}</p>
                        <p class="card-text"><small>Main Language: ${repo.language || 'N/A'}</small></p>
                        <p class="card-text"><small>Stars: ${repo.stargazers_count} | Forks: ${repo.forks_count}</small></p>
                        <a href="${repo.html_url}" class="btn btn-outline-light" target="_blank">View on GitHub</a>
                    </div>
                </div>
            `;
            container.appendChild(card);

            anime({
                targets: card,
                opacity: [0, 1],
                translateY: [50, 0],
                delay: index * 200,
                duration: 800,
                easing: 'easeOutQuad'
            });
        }

        if (repos.length === 0) {
            container.innerHTML = '<p>No public projects found.</p>';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('projects-container').innerHTML = '<p>Error loading projects. Check console for details.</p>';
    }
}