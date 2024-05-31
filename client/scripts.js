document.addEventListener('DOMContentLoaded', function () {
    // Function to show the selected tab
    function showTab(tabName) {
        console.log(`Switching to tab: ${tabName}`);
        document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
        document.getElementById(tabName).style.display = 'block';
    }

    // Function to show the new project form
    function showNewProjectForm() {
        console.log('Showing new project form');
        document.getElementById('new-project-form').style.display = 'block';
        populateArticleSelect('article-select');
    }

    // Function to hide all modals
    function hideModals() {
        console.log('Hiding all modals');
        document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
    }

    async function searchArticles() {
        const searchName = document.getElementById('search-name').value;

        try {
            // Construye la URL con el parámetro de búsqueda por nombre
            let url = '/api/articles';
            if (searchName) {
                url += `?search=${encodeURIComponent(searchName)}`;
            }

            // Realiza la solicitud GET
            const response = await fetch(url);
            const articles = await response.json();
            const articlesTable = document.getElementById('articles-table');
            articlesTable.innerHTML = `
                <tr>
                    <th>Title</th>
                    <th>Publication Date</th>
                    <th>Journal</th>
                    <th>DOI</th>
                    <th>Number of Pages</th>
                </tr>
                ${articles.map(article => `
                <tr>
                    <td>${article.title}</td>
                    <td>${article.publication_date}</td>
                    <td>${article.journal}</td>
                    <td>${article.doi}</td>
                    <td>${article.number_of_pages}</td>
                </tr>
            `).join('')}`;
        } catch (error) {
            console.error('Failed to search articles', error);
        }
    }


    // Function to fetch articles and populate the table
    async function fetchArticles() {
        console.log('Fetching articles');
        try {
            const response = await fetch('/api/articles');
            const articles = await response.json();
            const articlesTable = document.getElementById('articles-table');
            articlesTable.innerHTML = `
                <tr>
                    <th>Title</th>
                    <th>Publication Date</th>
                    <th>Journal</th>
                    <th>DOI</th>
                    <th>Number of Pages</th>
                </tr>
                ${articles.map(article => `
                <tr>
                    <td>${article.title}</td>
                    <td>${article.publication_date}</td>
                    <td>${article.journal}</td>
                    <td>${article.doi}</td>
                    <td>${article.number_of_pages}</td>
                </tr>
            `).join('')}`;
        } catch (error) {
            console.error('Failed to fetch articles', error);
        }
    }

    async function editProject(projectId) {
        console.log('Editing project', projectId);
        try {
            const response = await fetch(`/api/projects/${projectId}`);

            // Verifica si la respuesta es un error HTTP
            if (!response.ok) {
                throw new Error('Failed to fetch project');
            }

            const project = await response.json();
            document.getElementById('edit-project-title').value = project.project_title;
            document.getElementById('edit-article-select').value = project.article_id;
            document.getElementById('edit-team-name').value = project.team_name;
            document.getElementById('edit-project-form').style.display = 'block';

            // Llama a la función para poblar el dropdown de selección de artículo
            await populateArticleSelect('edit-article-select');

            // Manejador de evento para el formulario de edición
            document.getElementById('edit-project').onsubmit = async function (event) {
                event.preventDefault();
                const projectTitle = document.getElementById('edit-project-title').value;
                const articleId = document.getElementById('edit-article-select').value;
                const teamName = document.getElementById('edit-team-name').value;

                console.log('Saving edited project', { projectTitle, articleId, teamName });

                try {
                    const response = await fetch(`/api/projects/${projectId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ project_title: projectTitle, article_id: articleId, team_name: teamName })
                    });

                    if (response.ok) {
                        fetchProjects();
                        hideModals();
                    } else {
                        console.error('Failed to edit project');
                    }
                } catch (error) {
                    console.error('Failed to edit project', error);
                }
            };
        } catch (error) {
            console.error('Failed to fetch project', error);
        }
    }

    // Function to fetch projects and populate the table
    async function fetchProjects(searchName = '') {
        console.log('Fetching projects');
        try {
            // Construye la URL con el parámetro de búsqueda por nombre
            let url = '/api/projects';
            if (searchName) {
                url += `?search=${encodeURIComponent(searchName)}`;
            }
    
            const response = await fetch(url);
            const projects = await response.json();
            const projectsTable = document.getElementById('projects-table');
            projectsTable.innerHTML = `
                <tr>
                    <th>Project Title</th>
                    <th>Team Name</th>
                    <th>Status</th>
                    <th>Final Score</th>
                    <th>Actions</th>
                </tr>
                ${projects.map(project => `
                <tr>
                    <td>${project.project_title}</td>
                    <td>${project.team_name}</td>
                    <td>${project.status}</td>
                    <td>${project.final_score || 'N/A'}</td>
                    <td>
                        <button onclick="editProject(${project.review_project_id})">Edit</button>
                        <button onclick="scoreProject(${project.review_project_id})">Score</button>
                        <button onclick="deleteProject(${project.review_project_id})">Delete</button>
                        <input type="checkbox" ${project.status === 'finished' ? 'checked' : ''} onchange="toggleProjectStatus(${project.review_project_id}, this.checked)">
                    </td>
                </tr>
            `).join('')}`;
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
    }
    

    // Function to populate the article select dropdown
    async function populateArticleSelect(selectId) {
        console.log('Populating article select dropdown');
        try {
            const response = await fetch('/api/articles');
            const articles = await response.json();
            const select = document.getElementById(selectId);
            select.innerHTML = articles.map(article => `
                <option value="${article.article_id}">${article.title}</option>
            `).join('');
        } catch (error) {
            console.error('Failed to populate article select', error);
        }
    }

    // Function to create a new project
    async function createProject(event) {
        event.preventDefault();
        const projectTitle = document.getElementById('project-title').value;
        const articleId = document.getElementById('article-select').value;
        const teamName = document.getElementById('team-name').value;

        console.log('Creating new project', { projectTitle, articleId, teamName });

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ project_title: projectTitle, article_id: articleId, team_name: teamName })
            });

            if (response.ok) {
                fetchProjects();
                hideModals();
            } else {
                console.error('Failed to create project');
            }
        } catch (error) {
            console.error('Failed to create project', error);
        }
    }



    // Function to score a project
    async function scoreProject(projectId) {
        console.log('Scoring project', projectId);
        document.getElementById('score-project-form').style.display = 'block';

        document.getElementById('score-project').onsubmit = async function (event) {
            event.preventDefault();
            const score = document.querySelector('input[name="score"]:checked').value;

            console.log('Submitting score for project', { projectId, score });

            try {
                const response = await fetch(`/api/projects/${projectId}/score`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ score })
                });

                if (response.ok) {
                    fetchProjects();
                    hideModals();
                } else {
                    console.error('Failed to score project');
                }
            } catch (error) {
                console.error('Failed to score project', error);
            }
        };
    }

    // Function to delete a project
    async function deleteProject(projectId) {
        console.log('Deleting project', projectId);
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchProjects();
            } else {
                console.error('Failed to delete project');
            }
        } catch (error) {
            console.error('Failed to delete project', error);
        }
    }

    // Function to toggle project status
    async function toggleProjectStatus(projectId, isFinished) {
        console.log('Toggling project status', { projectId, isFinished });
        const status = isFinished ? 'finished' : 'in progress';

        try {
            const response = await fetch(`/api/projects/${projectId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                fetchProjects();
            } else {
                console.error('Failed to update project status');
            }
        } catch (error) {
            console.error('Failed to update project status', error);
        }
    }

    async function searchProjects() {
        const searchName = document.getElementById('project-search-name').value;
        fetchProjects(searchName);
        try {
            // Construye la URL con el parámetro de búsqueda por nombre
            let url = '/api/projects';
            if (searchName) {
                url += `?search=${encodeURIComponent(searchName)}`;
            }

            // Realiza la solicitud GET
            const response = await fetch(url);
            const projects = await response.json();
            const projectsTable = document.getElementById('projects-table');
            projectsTable.innerHTML = `
                <tr>
                    <th>Project Title</th>
                    <th>Team Name</th>
                    <th>Status</th>
                    <th>Final Score</th>
                    <th>Actions</th>
                </tr>
                ${projects.map(project => `
                <tr>
                    <td>${project.project_title}</td>
                    <td>${project.team_name}</td>
                    <td>${project.status}</td>
                    <td>${project.final_score || 'N/A'}</td>
                    <td>
                        <button onclick="editProject(${project.review_project_id})">Edit</button>
                        <button onclick="scoreProject(${project.review_project_id})">Score</button>
                        <button onclick="deleteProject(${project.review_project_id})">Delete</button>
                        <input type="checkbox" ${project.status === 'finished' ? 'checked' : ''} onchange="toggleProjectStatus(${project.review_project_id}, this.checked)">
                    </td>
                </tr>
            `).join('')}`;
        } catch (error) {
            console.error('Failed to search projects', error);
        }
    }

    // Initial setup
    showTab('articles'); // Show the articles tab by default
    fetchArticles(); // Fetch and display articles
    fetchProjects(); // Fetch and display projects


    // Event listeners
    document.getElementById('new-project').addEventListener('submit', createProject);

    // Expose functions globally for button onclick handlers
    window.showTab = showTab;
    window.showNewProjectForm = showNewProjectForm;
    window.editProject = editProject;
    window.scoreProject = scoreProject;
    window.deleteProject = deleteProject;
    window.toggleProjectStatus = toggleProjectStatus;
    window.searchArticles = searchArticles;
    window.searchProjects = searchProjects;
});

