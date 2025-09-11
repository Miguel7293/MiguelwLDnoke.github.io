document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
async function fetchGitHubRepos() {
    const username = 'Miguel7293'; // Reemplaza con tu username de GitHub
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`; // Muestra los 6 más recientes; ajusta per_page si quieres más

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error al fetch repos');
        }
        const repos = await response.json();

        const container = document.getElementById('projects-container');
        container.innerHTML = ''; // Limpia por si acaso

        repos.forEach(repo => {
            if (repo.fork) return; // Opcional: Salta forks; quita si quieres incluirlos

            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card bg-dark text-light">
                    <div class="card-body">
                        <h5 class="card-title">${repo.name}</h5>
                        <p class="card-text">${repo.description || 'Sin descripción'}</p>
                        <p class="card-text"><small>Lenguaje: ${repo.language || 'N/A'}</small></p>
                        <p class="card-text"><small>Estrellas: ${repo.stargazers_count} | Forks: ${repo.forks_count}</small></p>
                        <a href="${repo.html_url}" class="btn btn-outline-light" target="_blank">Ver en GitHub</a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        if (repos.length === 0) {
            container.innerHTML = '<p>No se encontraron proyectos públicos.</p>';
        }
    } catch (error) {
        console.error(error);
        document.getElementById('projects-container').innerHTML = '<p>Error al cargar proyectos. Intenta más tarde.</p>';
    }
}

// Llama la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchGitHubRepos);