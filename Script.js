document.addEventListener('DOMContentLoaded', function() {

    // ------------------------------------------------------------------
    // 💡 ESTADO GLOBAL DE AUTENTICACIÓN Y MODO OSCURO
    // ------------------------------------------------------------------
    let isLoggedIn = false;
    let isDarkMode = localStorage.getItem('darkMode') === 'true';
    let isAdmin = false;

    // --- Selectores Principales (Corregidos) ---
    const authContainer = document.getElementById('auth-container');
    const userIconButton = document.getElementById('user-icon-btn');
    const userDropdownMenu = document.getElementById('user-dropdown-menu');
    const homeLink = document.getElementById('home-link');
    const logoLink = document.getElementById('logo-link');
    const sidebar = document.getElementById('sidebar');
    const homeContent = document.getElementById('home-content');
    const heroBanner = document.querySelector('.hero-banner');
    const createPostContainer = document.getElementById('create-post-container');
    const createPostBtn = document.getElementById('create-post-btn');
    const createPostModal = document.getElementById('create-post-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const mundialesContent = document.getElementById('mundiales-content');
    const adminContent = document.getElementById('admin-content');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const addMundialContainer = document.getElementById('add-mundial-container');
    const manageCategoryModal = document.getElementById('manage-category-modal');
    const closeCategoryModalBtn = document.getElementById('close-category-modal-btn');
    const categoryModalListoBtn = document.getElementById('category-modal-listo-btn');
    const categoryListAdmin = document.getElementById('category-list-admin');
    const addCategoryForm = document.getElementById('add-category-form');
    const postsContainer = document.querySelector('.posts-container');
    const filterPills = document.querySelectorAll('.filter-pill');
    const addMundialBtn = document.getElementById('add-mundial-btn');
    const addMundialModal = document.getElementById('add-mundial-modal');
    const closeMundialModalBtn = document.getElementById('close-mundial-modal-btn');
    const newMundialForm = document.getElementById('new-mundial-form');
    const myPostsContent = document.getElementById('my-posts-content');
    const myPostsContainer = document.getElementById('my-posts-container');
    const settingsContent = document.getElementById('settings-content');
    const settingsProfilePicInput = document.getElementById('settings-profilePic');
    const currentProfilePic = document.getElementById('current-profile-pic');
    const settingsFileNameDisplay = document.getElementById('settings-file-name');
    const filterBtn = document.querySelector('.country-filter-btn');
    const filterModal = document.getElementById('filter-mundial-modal');
    const closeFilterModalBtn = document.getElementById('close-filter-modal-btn');
    const filterForm = document.getElementById('filter-mundial-form');
    const filterSelect = document.getElementById('mundial-filter-select');
    const filterClearBtn = document.getElementById('filter-clear-btn');
    const sortSelect = document.getElementById('sort-by-select');
    const registrationForm = document.getElementById('registration-form');
    const loginForm = authContainer ? authContainer.querySelector('.form-login form') : null;
    const mainAuthBox = document.getElementById('main-auth-box');
    const showLoginButton = document.getElementById('show-login');
    const showRegisterButton = document.getElementById('show-register');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const mainCarousel = document.getElementById('mainCarousel');
    // Selectores de la Página de Mundiales
    const mundialGridView = document.getElementById('mundial-grid-view');
    const mundialPostsView = document.getElementById('mundial-posts-view');
    const mundialPostsTitle = document.getElementById('mundial-posts-title');
    const mundialPostsContainer = document.getElementById('mundial-posts-container');
    const backToMundialesGridBtn = document.getElementById('back-to-mundiales-grid');
    
    // Selectores del Tour Guiado
    const tourOverlay = document.getElementById('tour-overlay');
    const tourModal = document.getElementById('tour-modal');
    const tourTitle = document.getElementById('tour-title');
    const tourText = document.getElementById('tour-text');
    const tourBtnSkip = document.getElementById('tour-btn-skip');
    const tourBtnNext = document.getElementById('tour-btn-next');
    let currentTourStep = 1;

    // --- DATOS GLOBALES ---
    const worldCupsData = [
        { year: 2022, host: 'Qatar' },
        { year: 2018, host: 'Rusia' },
        { year: 2014, host: 'Brasil' },
        { year: 2010, host: 'Sudáfrica' },
        { year: 2006, host: 'Alemania' },
        { year: 2002, host: 'Corea del Sur & Japón' },
        { year: 1998, host: 'Francia' },
        { year: 1994, host: 'Estados Unidos' },
        { year: 1990, host: 'Italia' },
        { year: 1986, host: 'México' },
        { year: 1982, host: 'España' },
        { year: 1978, host: 'Argentina' },
        { year: 1974, host: 'Alemania Occidental' },
        { year: 1970, host: 'México' },
        { year: 1966, host: 'Inglaterra' },
        { year: 1962, host: 'Chile' },
        { year: 1958, host: 'Suecia' },
        { year: 1954, host: 'Suiza' },
        { year: 1950, host: 'Brasil' },
        { year: 1938, host: 'Francia' },
        { year: 1934, host: 'Italia' },
        { year: 1930, host: 'Uruguay' }
    ];
    const mundialHostMap = new Map(worldCupsData.map(m => [m.year.toString(), m.host]));
    
    // Almacena la categoría activa y los posts cargados
    let currentPosts = [];
    let currentCategory = 'todo';

    // ==========================================================
    // --- FUNCIONES AUXILIARES DE VISTAS Y ESTADO ---
    // ==========================================================
    
    const applyDarkModeState = () => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', isDarkMode);
    };

    const toggleDarkMode = (event) => {
        event.preventDefault();
        isDarkMode = !isDarkMode;
        applyDarkModeState();
        updateUserDropdownContent();
        userDropdownMenu.classList.remove('show-dropdown');
    };

    const navigateToAuthScreen = (event) => {
        event.preventDefault();
        userDropdownMenu.classList.remove('show-dropdown');
        if (homeContent) homeContent.classList.add('content-hidden');
        if (heroBanner) heroBanner.classList.add('content-hidden');
        if (mundialesContent) mundialesContent.classList.add('hidden');
        if (adminContent) adminContent.classList.add('hidden');
        if (myPostsContent) myPostsContent.classList.add('hidden');
        if (settingsContent) settingsContent.classList.add('hidden');
        if (authContainer) {
            authContainer.classList.remove('hidden');
            authContainer.style.display = 'flex';
        }
        updateAuthView(true);
    };

    const updateAuthView = (showLogin) => {
        if (!mainAuthBox) return;
        if (showLogin) {
            mainAuthBox.classList.add('login-state');
        } else {
            mainAuthBox.classList.remove('login-state');
        }
    };

    const returnToHome = (event, isAdminUser = false) => {
        event.preventDefault(); 
        
        isLoggedIn = true; 
        isAdmin = isAdminUser;
        updateUserDropdownContent();

        if (isAdminUser && addCategoryBtn) {
            addCategoryBtn.classList.remove('hidden');
        }
        if (isAdminUser && addMundialContainer) {
            addMundialContainer.classList.remove('hidden');
        }
        if (authContainer) {
            authContainer.classList.add('hidden');
            authContainer.style.display = 'none';
        }
        if (homeContent) homeContent.classList.remove('content-hidden');
        if (createPostContainer) { 
            createPostContainer.classList.remove('hidden');
        }
        if (heroBanner) heroBanner.classList.remove('content-hidden');
        const mainCarousel = document.getElementById('mainCarousel');
        const filterBar = document.querySelector('.content-filter-bar');
        if (mainCarousel) mainCarousel.classList.remove('hidden');
        if (filterBar) filterBar.classList.remove('hidden');

        fetchData('todo');
    };
    
    const logout = (event) => {
        event.preventDefault();
        isLoggedIn = false;
        isAdmin = false;
        if (createPostContainer) createPostContainer.classList.add('hidden');
        if (addCategoryBtn) addCategoryBtn.classList.add('hidden');
        if (addMundialContainer) addMundialContainer.classList.add('hidden');
        
        userDropdownMenu.classList.remove('show-dropdown');
        updateUserDropdownContent();
        
        if (mundialesContent) mundialesContent.classList.add('hidden');
        if (adminContent) adminContent.classList.add('hidden');
        if (authContainer) authContainer.classList.add('hidden');
        if (myPostsContent) myPostsContent.classList.add('hidden');
        if (settingsContent) settingsContent.classList.add('hidden');
        
        if (homeContent) homeContent.classList.remove('content-hidden');
        if (heroBanner) heroBanner.classList.remove('content-hidden');
        const mainCarousel = document.getElementById('mainCarousel');
        const filterBar = document.querySelector('.content-filter-bar');
        if (mainCarousel) mainCarousel.classList.remove('hidden');
        if (filterBar) filterBar.classList.remove('hidden');

        fetchData('todo');
    };

    // ==========================================================
    // --- NAVEGACIÓN ENTRE VISTAS ---
    // ==========================================================
    const navigateToAdminScreen = (event) => {
        event.preventDefault();
        userDropdownMenu.classList.remove('show-dropdown'); 
        
        if (homeContent) homeContent.classList.add('content-hidden');
        if (heroBanner) heroBanner.classList.add('content-hidden');
        if (authContainer) authContainer.classList.add('hidden');
        if (mundialesContent) mundialesContent.classList.add('hidden');
        if (myPostsContent) myPostsContent.classList.add('hidden');
        if (settingsContent) settingsContent.classList.add('hidden');

        const mainCarousel = document.getElementById('mainCarousel');
        const filterBar = document.querySelector('.content-filter-bar');
        if (mainCarousel) mainCarousel.classList.add('hidden');
        if (filterBar) filterBar.classList.add('hidden');

        if (adminContent) {
            adminContent.classList.remove('hidden');
        }
        
        renderAdminManagementTable(adminPostsManagementData); 
        if (sidebar) sidebar.classList.remove('open');
    };
    
    const navigateToMyPosts = (event) => {
        event.preventDefault();
        userDropdownMenu.classList.remove('show-dropdown');
        
        if (homeContent) homeContent.classList.add('content-hidden');
        if (heroBanner) heroBanner.classList.add('content-hidden');
        if (authContainer) authContainer.classList.add('hidden');
        if (mundialesContent) mundialesContent.classList.add('hidden');
        if (adminContent) adminContent.classList.add('hidden');
        if (settingsContent) settingsContent.classList.add('hidden');

        const mainCarousel = document.getElementById('mainCarousel');
        const filterBar = document.querySelector('.content-filter-bar');
        if (mainCarousel) mainCarousel.classList.add('hidden');
        if (filterBar) filterBar.classList.add('hidden');

        if (myPostsContent) {
            myPostsContent.classList.remove('hidden');
        }
        
        renderMyPosts(myPostsData); 

        if (sidebar) sidebar.classList.remove('open');
    };

    const navigateToSettings = (event) => {
        event.preventDefault();
        userDropdownMenu.classList.remove('show-dropdown');
        
        if (homeContent) homeContent.classList.add('content-hidden');
        if (heroBanner) heroBanner.classList.add('content-hidden');
        if (authContainer) authContainer.classList.add('hidden');
        if (mundialesContent) mundialesContent.classList.add('hidden');
        if (adminContent) adminContent.classList.add('hidden');
        if (myPostsContent) myPostsContent.classList.add('hidden');

        const mainCarousel = document.getElementById('mainCarousel');
        const filterBar = document.querySelector('.content-filter-bar');
        if (mainCarousel) mainCarousel.classList.add('hidden');
        if (filterBar) filterBar.classList.add('hidden');

        if (settingsContent) {
            settingsContent.classList.remove('hidden');
        }
        
        if (sidebar) sidebar.classList.remove('open');
    };

    // ==========================================================
    // --- LÓGICA DE DATOS Y RENDERIZADO ---
    // ========================================================== 
    const adminPostsManagementData = [
        {
            username: 'Carmen Padilla',
            meta: 'Hace 13 minutos',
            year: '2026',
            description: '¿Qué opinan de las sedes para el 2026? Creo que el Estadio Azteca será el más emblemático. ¡Será su tercer mundial!, voy acompañado por mi familia y me siento muy feliz por que desde niño soy fan de seguir los mundiales y hacerlo con mi familia es grandioso', 
            imageUrl: 'ImagenesProyecto/ComEstadio16.jpg'
        },
        {
            username: 'Marco Lopez',
            meta: 'Hace 2 dias',
            year: '2022',
            description: 'Polémica: ¿El VAR le quitó la emoción al mundial de Qatar 2022 o lo hizo más justo? Abro debate.',
            imageUrl: 'ImagenesProyecto/ComPolemica41.jpg'
        },
        {
            username: 'Josue Guerrero',
            meta: 'Hace 5 horas',
            year: '1986',
            description: 'Recordando el 86, ¿creen que la selección mexicana de ese año fue la mejor de nuestra historia? Ese partido contra Bulgaria fue cardiaco.',
            imageUrl: 'ImagenesProyecto/Publiadmin.jpg'
        },
        {
            username: 'Sandra Hernandez',
            meta: 'Hace 4 minutos',
            year: '2010',
            description: 'Todos hablan de las vuvuzelas, pero... ¿recuerdan lo controversial que fue el balón Jabulani en Sudáfrica 2010? Los porteros lo odiaban.',
            imageUrl: 'ImagenesProyecto/Publiadmin1.jpg'
        }
    ];

    const myPostsData = [
        {
            year: '2022',
            description: 'Polémica: ¿El VAR le quitó la emoción al mundial de Qatar 2022 o lo hizo más justo? Abro debate.',
            imageUrl: 'ImagenesProyecto/ComPolemica41.jpg',
            views: 12500,
            likes: 830,
            interactions: [
                { type: 'rating', user: 'Ruben Martinez', rating: 5 },
                { type: 'comment', user: 'Jenifer Garcia', comment: '¡Gran debate! Yo creo que lo hizo más justo.' },
                { type: 'rating', user: 'Ariel Campos', rating: 3 }
            ]
        },
        {
            year: '2010',
            description: 'Todos hablan de las vuvuzelas, pero... ¿recuerdan lo controversial que fue el balón Jabulani en Sudáfrica 2010? Los porteros lo odiaban.',
            imageUrl: 'ImagenesProyecto/Publiadmin1.jpg',
            views: 8430,
            likes: 412,
            interactions: [
                { type: 'comment', user: 'Samantha Olvera', comment: '¡Totalmente de acuerdo! Ese balón era impredecible.' }
            ]
        },
        {
            year: '1986',
            description: 'Recordando el 86, ¿creen que la selección mexicana de ese año fue la mejor de nuestra historia? Ese partido contra Bulgaria fue cardiaco.',
            imageUrl: 'ImagenesProyecto/Publiadmin.jpg',
            views: 15200,
            likes: 1100,
            interactions: [
                { type: 'rating', user: 'Cristobal Sanchez', rating: 5 },
                { type: 'comment', user: 'Omar Hernandez', comment: 'Sin duda, la mejor. Lástima de los penales contra Alemania.' },
                { type: 'comment', user: 'Elizabeth Gomez', comment: 'Jugaron bien, pero Alemania fue superior.' },
                { type: 'rating', user: 'Fatima M.', rating: 4 }
            ]
        },
        {
            year: '2022',
            description: 'Mi segunda opinión sobre el VAR: Sigo pensando que es bueno, aunque lento.',
            imageUrl: 'ImagenesProyecto/ComPolemica41.jpg',
            views: 1500,
            likes: 95,
            interactions: [
                { type: 'rating', user: 'Paulo G.', rating: 4 }
            ]
        },
        {
            year: '2010',
            description: '¿Alguien más coleccionó las Vuvuzelas? Yo todavía tengo la mía.',
            imageUrl: 'ImagenesProyecto/Post.jpg',
            views: 2500,
            likes: 150,
            interactions: []
        },
        {
            year: '1986',
            description: 'El "Gol del Siglo" de Maradona también fue en este mundial. Increíble.',
            imageUrl: 'ImagenesProyecto/Post1.jpg',
            views: 18000,
            likes: 2300,
            interactions: [
                { type: 'rating', user: 'Ivan Rdz', rating: 5 },
                { type: 'comment', user: 'Paulina Dominguez', comment: 'El mejor gol de la historia.' }
            ]
        },
        {
            year: '2022',
            description: 'Final. Messi vs Mbappé. La mejor final que he visto.',
            imageUrl: 'ImagenesProyecto/Post2.jpg',
            views: 35000,
            likes: 4500,
            interactions: [
                { type: 'rating', user: 'Jonathan Mora', rating: 5 },
                { type: 'rating', user: 'Natalya L.', rating: 5 },
                { type: 'comment', user: 'Galilea Escobar', comment: 'Partido inolvidable.' }
            ]
        },
        {
            year: '2010',
            description: '¿La mano de Suárez fue trampa o astucia?',
            imageUrl: 'ImagenesProyecto/ComTodo3.jpg',
            views: 9800,
            likes: 620,
            interactions: [
                { type: 'comment', user: 'Daniel Mendoza', comment: '¡Astucia pura!' },
                { type: 'comment', user: 'Erick Sandoval', comment: '¡Fue trampa! 😡' }
            ]
        }
    ];

    const renderAdminManagementTable = (data) => {
        if (!adminContent) return;
        const tableContainer = document.getElementById('posts-management-table');
        if (!tableContainer) return;

        let postsHtml = ''; 
        if (data && data.length > 0) {
            postsHtml = data.map(post => `
                <div class="post-card admin-post-card">
                    <div class="post-header">
                        <div class="user-avatar"><i class="fas fa-user"></i></div>
                        <div class="user-info">
                            <span class="username">${post.username}</span>
                            <span class="post-meta-line">
                                <span class="post-meta">${post.meta}</span>
                                <span class="post-context-year"> Mundial ${post.year}</span>
                            </span>
                        </div>
                    </div>
                    <div class="post-body">
                        <div class="post-description"><p>${post.description}</p></div>
                        <div class="post-image-container">
                            <img src="${post.imageUrl}" alt="Imagen de ${post.username}">
                        </div>
                    </div>
                    <div class="post-footer admin-post-footer">
                        <button class="admin-action-btn btn-confirm">Confirmar</button>
                        <button class="admin-action-btn btn-decline">Declinar</button>
                    </div>
                </div>
            `).join('');
        } else {
            postsHtml = '<p>No hay publicaciones pendientes de revisión.</p>';
        }
        tableContainer.innerHTML = postsHtml;
    };
    
    // RENDERIZADO DE TARJETAS (MIS PUBLICACIONES)
    const renderMyPosts = (data) => {
        if (!myPostsContainer) return;
        myPostsContainer.innerHTML = ''; 

        data.forEach(post => {
            const formatNumber = (num) => {
                if (num >= 1000) {
                    return (num / 1000).toFixed(1) + 'k';
                }
                return num;
            };

            const statsHtml = `
                <div class="post-stats-bar">
                    <div class="stat-item">
                        <i class="fas fa-eye"></i>
                        <span>${formatNumber(post.views)} Vistas</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-heart"></i>
                        <span>${formatNumber(post.likes)} Likes</span>
                    </div>
                </div>
            `;

            // Lógica para el botón de eliminar (con texto "Eliminar")
            const adminDeleteButton = isAdmin ? 
                '<button class="admin-delete-comment">Eliminar</button>' : 
                '';

            // Construir HTML para las interacciones
            let interactionsHtml = '<div class="interactions-container">';
            if (post.interactions.length > 0) {
                post.interactions.forEach(interaction => {
                    if (interaction.type === 'comment') {
                        interactionsHtml += `
                            <div class="interaction comment">
                                <span class="interaction-user">${interaction.user}:</span>
                                <span class="interaction-content">"${interaction.comment}"</span>
                                ${adminDeleteButton} </div>
                        `;
                    } else if (interaction.type === 'rating') {
                        let stars = '';
                        for (let i = 1; i <= 5; i++) {
                            stars += `<i class="${i <= interaction.rating ? 'fas' : 'far'} fa-star"></i>`;
                        }
                        interactionsHtml += `
                            <div class="interaction rating">
                                <span class="interaction-user">${interaction.user} calificó:</span>
                                <span class="interaction-content stars">${stars}</span>
                                ${adminDeleteButton} </div>
                        `;
                    }
                });
            } else {
                interactionsHtml += '<p class="no-interactions">Aún no hay interacciones.</p>';
            }
            interactionsHtml += '</div>';

            // Construir la tarjeta completa
            const postCardHtml = `
                <div class="post-card my-post-card">
                    <div class="original-post-content">
                        <div class="post-header">
                            <div class="user-avatar"><i class="fas fa-user-edit"></i></div>
                            <div class="user-info">
                                <span class="username">Mi Publicación</span>
                                <span class="post-meta-line">
                                    <span class="post-context-year">Mundial ${post.year}</span>
                                </span>
                            </div>
                        </div>
                        <div class="post-body">
                            <div class="post-description"><p>${post.description}</p></div>
                            <div class="post-image-container">
                                <img src="${post.imageUrl}" alt="Imagen de ${post.username}">
                            </div>
                        </div>
                    </div>
                    
                    <div class="post-analytics">
                        ${statsHtml}
                        <h4 class="interactions-title">Interacciones Recientes</h4>
                        ${interactionsHtml}
                    </div>
                </div>
            `;
            myPostsContainer.innerHTML += postCardHtml;
        });
    };

    // ==========================================================
    // --- LÓGICA DE CATEGORÍAS (MODAL ADMIN) ---
    // ==========================================================

    const renderCategoryList = () => {
        if (!categoryListAdmin) {
            console.error('No se encontró el contenedor category-list-admin');
            return;
        }

        categoryListAdmin.innerHTML = ''; // Limpia la lista anterior

        // Itera sobre el mapa de categorías para construir la lista
        Object.keys(categoryDataMap).forEach(categoryKey => {
            
            // Omitimos "todo" de la lista de categorías a gestionar
            if (categoryKey === 'todo') return; 

            // Capitaliza el nombre para mostrarlo (ej: "jugadas" -> "Jugadas")
            const categoryName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);

            const itemHtml = `
                <div class="category-admin-item">
                    <span class="category-admin-name">${categoryName}</span>
                    <div class="category-admin-actions">
                        <button class="btn-edit" data-category="${categoryKey}"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" data-category="${categoryKey}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            categoryListAdmin.innerHTML += itemHtml;
        });
    };

    // ==========================================================
    // --- LÓGICA DEL MENÚ DESPLEGABLE ---
    // ==========================================================
    const updateUserDropdownContent = () => {
        if (!userDropdownMenu) return; // Comprobación de seguridad
        let menuHtml = '';
        
        if (isLoggedIn) {
            menuHtml += '<a href="#" class="dropdown-item profile-link"><i class="fa-solid fa-square-poll-horizontal icon-spacing"></i>Ver mis Publicaciones</a>';
            
            if (isAdmin) {
                 menuHtml += '<a href="#" class="dropdown-item admin-posts-link"><i class="fa-solid fa-folder-open icon-spacing"></i>Administrar Publicaciones</a>';
            }

            const modeIcon = isDarkMode ? 'fa-sun' : 'fa-moon';
            const modeText = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
            menuHtml += `<a href="#" class="dropdown-item dark-mode-link"><i class="fa-solid ${modeIcon} icon-spacing"></i>${modeText}</a>`;
            menuHtml += '<a href="#" class="dropdown-item settings-link"><i class="fa-solid fa-gear icon-spacing"></i>Configuración</a>';
            menuHtml += '<a href="#" class="dropdown-item logout-link"><i class="fa-solid fa-sign-out-alt icon-spacing"></i>Cerrar Sesión</a>';
            
        } else {
            menuHtml += '<a href="#" class="dropdown-item ingresar-link"><i class="fa-solid fa-sign-in-alt icon-spacing"></i>Ingresar</a>';
        }
        
        userDropdownMenu.innerHTML = menuHtml;
        
        // --- Añadir Listeners ---
        if (isLoggedIn) {
            userDropdownMenu.querySelector('.profile-link')?.addEventListener('click', navigateToMyPosts);
            
            if (isAdmin) {
                userDropdownMenu.querySelector('.admin-posts-link')?.addEventListener('click', navigateToAdminScreen);
            }
            
            userDropdownMenu.querySelector('.dark-mode-link')?.addEventListener('click', toggleDarkMode);
            userDropdownMenu.querySelector('.settings-link')?.addEventListener('click', navigateToSettings);
            userDropdownMenu.querySelector('.logout-link')?.addEventListener('click', logout);

        } else {
            userDropdownMenu.querySelector('.ingresar-link')?.addEventListener('click', navigateToAuthScreen);
        }
    };

    // ==========================================================
    // --- LÓGICA DE CARGA DE DATOS (MODIFICADA) ---
    // ==========================================================

    // Mapeo de categorías a los archivos JSON
    const categoryDataMap = {
        'todo': 'Datos/Todo.json',
        'jugadas': 'Datos/Jugadas.json',
        'entrevistas': 'Datos/Entrevistas.json',
        'jugadores': 'Datos/Jugadores.json',
        'estadisticas': 'Datos/Estadisticas.json',
        'playeras': 'Datos/Playeras.json',
        'incidentes': 'Datos/Incidentes.json',
        'polemicas': 'Datos/Polemicas.json',
        'estadiosysedes': 'Datos/Estadiosysedes.json',
        'mascotas': 'Datos/Mascotas.json',
        'comunidad': 'Datos/Comunidad.json',
        'noticias': 'Datos/Noticias.json'
    };

    // --- (MODIFICADA) FUNCIÓN 'fetchData' ---
    const fetchData = async (category) => {
        currentCategory = category; // Almacena la categoría activa
        if (mainCarousel) {
            if (category === 'todo') {
                mainCarousel.classList.remove('hidden');
            } else {
                mainCarousel.classList.add('hidden');
            }
        }
        const filePath = categoryDataMap[category];
        if (!filePath) {
            console.error(`No se encontró un archivo para la categoría: ${category}`);
            return;
        }

        if (postsContainer) postsContainer.innerHTML = '<p style="text-align: center; font-size: 1.2rem; padding: 50px;">Cargando...</p>';

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            
            // --- INYECCIÓN DE DATOS DE SIMULACIÓN ---
            const dataWithFullInfo = data.map(post => {
                const simulatedInteractions = [
                    { type: 'comment', user: 'Cristobal Palacios', comment: '¡Qué buena publicación!' },
                    { type: 'rating', user: 'Guadalupe T.', rating: 4 },
                ];
                if (post.likes > 1000) {
                    simulatedInteractions.push({ type: 'comment', user: 'Rodrigo Valdez', comment: '¡Totalmente de acuerdo, es histórico!' });
                }

                return {
                    ...post,
                    host: mundialHostMap.get(post.year) || 'Desconocido',
                    likes: post.likes || Math.floor(Math.random() * 1500),
                    comments: post.comments || Math.floor(Math.random() * 100),
                    interactions: post.interactions || simulatedInteractions 
                };
            });
            // --- -------------------------------------------- ---

            // Ordenar por defecto (cronológico)
            dataWithFullInfo.sort((a, b) => parseInt(a.year) - parseInt(b.year));
            
            if (category === 'todo') {
                dataWithFullInfo.sort(() => Math.random() - 0.5);
            }
            
            currentPosts = dataWithFullInfo; 
            renderPosts(currentPosts);
        } catch (error) {
            console.error('Error al cargar o procesar los datos:', error);
            if (postsContainer) postsContainer.innerHTML = '<p style="text-align: center; color: red;">Error al cargar el contenido. Revisa tus archivos JSON.</p>';
        }
    };

    // --- (CORREGIDA) FUNCIÓN PARA RENDERIZAR POSTS ---
    const renderPosts = (posts) => {
        if (!postsContainer) return;
        postsContainer.innerHTML = ''; 
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p style="text-align: center;">No hay publicaciones en esta categoría.</p>';
            return;
        }

        posts.forEach((post, index) => { 
            
            let starsHtml = '';
            let postActionsHtml = '';
            let commentSectionHtml = '';
            
            // --- 1. LÓGICA DE VISIBILIDAD (LOGUEADO vs. NO LOGUEADO) ---
            
            // Si el usuario NO está logueado (solo lectura)
            if (!isLoggedIn) {
                // Estrellas Estáticas (solo muestra el rating)
                let staticStars = '';
                for (let i = 1; i <= 5; i++) {
                    staticStars += `<i class="${i <= post.rating ? 'fas' : 'far'} fa-star"></i>`;
                }
                starsHtml = `<div class="post-rating">${staticStars}</div>`;

                // Íconos de acción (Solo muestra Likes/Comentarios, no permite interactuar)
                postActionsHtml = `
                    <span class="action-icon-static"><i class="fas fa-heart"></i> ${post.likes}</span>
                    <span class="action-icon-static"><i class="fas fa-comment"></i> ${post.comments}</span>
                `;
            } 
            // Si el usuario SÍ está logueado (interactivo)
            else {
                // Estrellas Interactivas
                starsHtml = '<div class="interactive-rating">';
                for (let i = 5; i >= 1; i--) {
                    starsHtml += `
                        <input type="radio" id="post-${index}-star-${i}" name="rating-post-${index}" value="${i}">
                        <label for="post-${index}-star-${i}"><i class="fas fa-star"></i></label>
                    `;
                }
                starsHtml += '</div>';
                
                // Lógica de Admin para el botón de Eliminar Comentario
                const adminDeleteButton = isAdmin ? 
                    '<button class="admin-delete-comment">Eliminar</button>' : 
                    '';

                // Sección de Comentarios
                let interactionsHtml = '';
                if (post.interactions && post.interactions.length > 0) {
                    interactionsHtml = `<div class="interactions-container" style="max-height: 200px; overflow-y: auto; margin-bottom: 15px;">`;
                    post.interactions.forEach(interaction => {
                         if (interaction.type === 'comment') {
                             interactionsHtml += `
                                 <div class="interaction comment">
                                     <span class="interaction-user">${interaction.user}:</span>
                                     <span class="interaction-content">"${interaction.comment}"</span>
                                     ${adminDeleteButton}
                                 </div>
                             `;
                         } else if (interaction.type === 'rating') {
                             let stars = '';
                             for (let i = 1; i <= 5; i++) { stars += `<i class="${i <= interaction.rating ? 'fas' : 'far'} fa-star"></i>`; }
                             interactionsHtml += `
                                 <div class="interaction rating">
                                     <span class="interaction-user">${interaction.user} calificó:</span>
                                     <span class="interaction-content stars">${stars}</span>
                                     ${adminDeleteButton}
                                 </div>
                             `;
                         }
                    });
                    interactionsHtml += '</div>';
                } else {
                    interactionsHtml = '<p class="no-interactions">Aún no hay interacciones.</p>';
                }

                commentSectionHtml = `
                    <div class="post-comment-section hidden" id="comment-section-post-${index}">
                        ${interactionsHtml}
                        <textarea placeholder="Escribe tu comentario..."></textarea>
                        <button class="submit-btn" style="padding: 8px 15px; margin-top: 10px; width: 100%;">Publicar Comentario</button>
                    </div>
                `;

                // Íconos de acción (Interactivo)
                postActionsHtml = `
                    <span class="action-icon-static"><i class="fas fa-heart"></i> ${post.likes}</span>
                    <a href="#" class="action-icon comment-toggle-btn" data-target="comment-section-post-${index}"><i class="fas fa-comment"></i></a>
                    <a href="#" class="action-icon"><i class="fas fa-share-square"></i></a>
                    <a href="#" class="action-icon"><i class="fas fa-bookmark"></i></a>
                `;
            }


            // --- 2. MONTAJE FINAL DE LA TARJETA ---
            let postHtml = '';
            if (post.type === 'multimedia') {
                postHtml = `
                <div class="post-card multimedia-card">
                    <div class="post-header">
                        <div class="user-avatar"><i class="fas fa-user"></i></div>
                        <div class="user-info">
                            <span class="username">${post.username}</span>
                            <span class="post-meta-line">
                                <span class="post-meta">${post.meta}</span>
                                <span class="post-context-year"> Mundial ${post.year} (${post.host})</span>
                            </span>
                        </div>
                    </div>
                    <div class="multimedia-content">
                        <img src="${post.imageUrl}" alt="Publicación de ${post.username}">
                    </div>
                    <div class="post-footer">
                        <div class="post-rating">${starsHtml}</div>
                        <div class="post-actions">
                            ${postActionsHtml}
                        </div>
                    </div>
                    ${commentSectionHtml} 
                </div>`;
            } else {
                postHtml = `
                <div class="post-card">
                    <div class="post-header">
                        <div class="user-avatar"><i class="fas fa-user"></i></div>
                        <div class="user-info">
                            <span class="username">${post.username}</span>
                            <span class="post-meta-line">
                                <span class="post-meta">${post.meta}</span>
                                <span class="post-context-year"> Mundial ${post.year} (${post.host})</span>
                            </span>
                        </div>
                    </div>
                    <div class="post-body">
                        <div class="post-description"><p>${post.description}</p></div>
                        <div class="post-image-container">
                            <img src="${post.imageUrl}" alt="Imagen de la publicación de ${post.username}">
                        </div>
                    </div>
                    <div class="post-footer">
                        <div class="post-rating">${starsHtml}</div>
                        <div class="post-actions">
                            ${postActionsHtml}
                        </div>
                    </div>
                    ${commentSectionHtml}
                </div>`;
            }
            postsContainer.innerHTML += postHtml;
        });
    };

    /**
     * (NUEVO) Copia de renderPosts, pero apunta al contenedor de la pág. Mundiales
     */
    const renderPostsForMundialPage = (posts) => {
        if (!mundialPostsContainer) return;
        mundialPostsContainer.innerHTML = ''; 
        if (posts.length === 0) {
            mundialPostsContainer.innerHTML = '<p style="text-align: center;">No hay publicaciones para este mundial.</p>';
            return;
        }

        posts.forEach((post, index) => { 
            let starsHtml = '';
            let postActionsHtml = '';
            let commentSectionHtml = '';
            
            // Lógica de Logueado vs No Logueado (copiada de renderPosts)
            if (!isLoggedIn) {
                let staticStars = '';
                for (let i = 1; i <= 5; i++) { staticStars += `<i class="${i <= post.rating ? 'fas' : 'far'} fa-star"></i>`; }
                starsHtml = `<div class="post-rating">${staticStars}</div>`;
                postActionsHtml = `
                    <span class="action-icon-static"><i class="fas fa-heart"></i> ${post.likes}</span>
                    <span class="action-icon-static"><i class="fas fa-comment"></i> ${post.comments}</span>
                `;
            } else {
                starsHtml = '<div class="interactive-rating">';
                for (let i = 5; i >= 1; i--) { starsHtml += `<input type="radio" id="mp-post-${index}-star-${i}" name="mp-rating-post-${index}" value="${i}"><label for="mp-post-${index}-star-${i}"><i class="fas fa-star"></i></label>`; }
                starsHtml += '</div>';
                
                const adminDeleteButton = isAdmin ? '<button class="admin-delete-comment">Eliminar</button>' : '';
                let interactionsHtml = '';
                if (post.interactions && post.interactions.length > 0) {
                    interactionsHtml = `<div class="interactions-container" style="max-height: 200px; overflow-y: auto; margin-bottom: 15px;">`;
                    post.interactions.forEach(interaction => {
                         if (interaction.type === 'comment') { interactionsHtml += `<div class="interaction comment"><span class="interaction-user">${interaction.user}:</span><span class="interaction-content">"${interaction.comment}"</span>${adminDeleteButton}</div>`; } 
                         else if (interaction.type === 'rating') {
                             let stars = ''; for (let i = 1; i <= 5; i++) { stars += `<i class="${i <= interaction.rating ? 'fas' : 'far'} fa-star"></i>`; }
                             interactionsHtml += `<div class="interaction rating"><span class="interaction-user">${interaction.user} calificó:</span><span class="interaction-content stars">${stars}</span>${adminDeleteButton}</div>`;
                         }
                    });
                    interactionsHtml += '</div>';
                } else { interactionsHtml = '<p class="no-interactions">Aún no hay interacciones.</p>'; }
                commentSectionHtml = `<div class="post-comment-section hidden" id="mp-comment-section-post-${index}">${interactionsHtml}<textarea placeholder="Escribe tu comentario..."></textarea><button class="submit-btn" style="padding: 8px 15px; margin-top: 10px; width: 100%;">Publicar Comentario</button></div>`;
                postActionsHtml = `<span class="action-icon-static"><i class="fas fa-heart"></i> ${post.likes}</span><a href="#" class="action-icon comment-toggle-btn" data-target="mp-comment-section-post-${index}"><i class="fas fa-comment"></i></a><a href="#" class="action-icon"><i class="fas fa-share-square"></i></a><a href="#" class="action-icon"><i class="fas fa-bookmark"></i></a>`;
            }

            // Montaje de la tarjeta (copiado de renderPosts)
            let postHtml = '';
            if (post.type === 'multimedia') {
                postHtml = `<div class="post-card multimedia-card"><div class="post-header"><div class="user-avatar"><i class="fas fa-user"></i></div><div class="user-info"><span class="username">${post.username}</span><span class="post-meta-line"><span class="post-meta">${post.meta}</span><span class="post-context-year"> Mundial ${post.year} (${post.host})</span></span></div></div><div class="multimedia-content"><img src="${post.imageUrl}" alt="Publicación de ${post.username}"></div><div class="post-footer"><div class="post-rating">${starsHtml}</div><div class="post-actions">${postActionsHtml}</div></div>${commentSectionHtml}</div>`;
            } else {
                postHtml = `<div class="post-card"><div class="post-header"><div class="user-avatar"><i class="fas fa-user"></i></div><div class="user-info"><span class="username">${post.username}</span><span class="post-meta-line"><span class="post-meta">${post.meta}</span><span class="post-context-year"> Mundial ${post.year} (${post.host})</span></span></div></div><div class="post-body"><div class="post-description"><p>${post.description}</p></div><div class="post-image-container"><img src="${post.imageUrl}" alt="Imagen de ${post.username}"></div></div><div class="post-footer"><div class="post-rating">${starsHtml}</div><div class="post-actions">${postActionsHtml}</div></div>${commentSectionHtml}</div>`;
            }
            mundialPostsContainer.innerHTML += postHtml;
        });
    };

    /**
     * (NUEVO) Copia de loadAndFilterByYear, pero llama a la nueva función de renderizado
     */
    const loadPostsForMundialPage = async (year) => {
        if (!mundialPostsContainer) return;
        mundialPostsContainer.innerHTML = '<p style="text-align: center; font-size: 1.2rem; padding: 50px;">Cargando publicaciones del mundial...</p>';
        
        const allPostPromises = [];
        for (const category in categoryDataMap) {
            if (category === 'todo') continue;
            allPostPromises.push(fetch(categoryDataMap[category]).then(res => res.json()));
        }

        let allPosts = [];
        try {
            const results = await Promise.allSettled(allPostPromises);
            results.forEach(result => {
                if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                    allPosts.push(...result.value);
                } else if (result.status === 'rejected') { console.error('Error cargando un archivo JSON:', result.reason); }
            });

            const allPostsWithInfo = allPosts.map(post => ({
                ...post,
                host: mundialHostMap.get(post.year) || 'Desconocido',
                likes: post.likes || Math.floor(Math.random() * 1500),
                comments: post.comments || Math.floor(Math.random() * 100),
                interactions: post.interactions || [{ type: 'comment', user: 'Test', comment: 'Test' }]
            }));
            
            const filteredByYear = allPostsWithInfo.filter(post => post.year === year);
            
            // Llama a la NUEVA función de renderizado
            renderPostsForMundialPage(filteredByYear);

        } catch (error) {
            console.error('Error al cargar todos los posts:', error);
            if (mundialPostsContainer) mundialPostsContainer.innerHTML = '<p style="text-align: center; color: red;">Error al cargar el contenido.</p>';
        }
    };


    // ==========================================================
    // --- LÓGICA DE MUNDIALES ---
    // ==========================================================
    const renderWorldCups = () => {
        const grid = document.querySelector('.mundiales-grid');
        if (!grid) return;

        const images = [
            'ImagenesProyecto/banderas/qatar.png',
            'ImagenesProyecto/banderas/rusia.png',
            'ImagenesProyecto/banderas/brasil.png',
            'ImagenesProyecto/banderas/sudafrica.png',
            'ImagenesProyecto/banderas/alemania.png',
            'ImagenesProyecto/banderas/corea.png',
            'ImagenesProyecto/banderas/francia.png',
            'ImagenesProyecto/banderas/us.png',
            'ImagenesProyecto/banderas/it.png',
            'ImagenesProyecto/banderas/mx.png',
            'ImagenesProyecto/banderas/es.png',
            'ImagenesProyecto/banderas/ar.png',
            'ImagenesProyecto/banderas/al oc.png',
            'ImagenesProyecto/banderas/mx.png',
            'ImagenesProyecto/banderas/eng.png',
            'ImagenesProyecto/banderas/cl.png',
            'ImagenesProyecto/banderas/se.png',
            'ImagenesProyecto/banderas/ch.png',
            'ImagenesProyecto/banderas/brasil.png',
            'ImagenesProyecto/banderas/francia.png',
            'ImagenesProyecto/banderas/it.png',
            'ImagenesProyecto/banderas/uy.png'

        ];

        grid.innerHTML = ''; 

        worldCupsData.forEach((mundial, index) => {
            const imageUrl = images[index % images.length]; 
            const cardHtml = `
               <a href="#" class="mundial-card" data-year="${mundial.year}" style="background-image: url('${imageUrl}');">
                   <div class="mundial-card-overlay">
                       <span class="mundial-year">${mundial.year}</span>
                       <span class="mundial-host">${mundial.host}</span>
                   </div>
               </a>
            `;
            grid.innerHTML += cardHtml;
        });
    };
    renderWorldCups(); // Sigue llamando a esta función
    
    // ==========================================================
    // --- (NUEVO) LISTENER PARA TARJETAS DE MUNDIALES (CORREGIDO) ---
    // ==========================================================
    const mundialesGrid = document.querySelector('.mundiales-grid'); 

    if (mundialesGrid && mundialGridView && mundialPostsView && mundialPostsTitle && backToMundialesGridBtn) {
        
        // --- Clic en una tarjeta de mundial ---
        mundialesGrid.addEventListener('click', (e) => {
            const clickedCard = e.target.closest('.mundial-card');
            if (!clickedCard) return; 
            
            e.preventDefault(); 
            const selectedYear = clickedCard.dataset.year;
            const selectedHost = clickedCard.querySelector('.mundial-host').textContent;

            // 1. Oculta la cuadrícula y muestra la vista de posts
            mundialGridView.classList.add('hidden');
            mundialPostsView.classList.remove('hidden');

            // 2. Actualiza el título
            mundialPostsTitle.textContent = `Publicaciones de ${selectedHost} (${selectedYear})`;

            // 3. Carga y filtra los posts para esta página
            loadPostsForMundialPage(selectedYear);
        });

        // --- Clic en el botón "Volver" ---
        backToMundialesGridBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Oculta los posts y muestra la cuadrícula
            mundialPostsView.classList.add('hidden');
            mundialGridView.classList.remove('hidden');
            // Limpia los posts para que no se queden
            if (mundialPostsContainer) mundialPostsContainer.innerHTML = '';
        });
    }

   
    // ==========================================================
    // --- (MODIFICADO) LÓGICA DE BÚSQUEDA Y FILTROS ---
    // ==========================================================
    
    // 1. Función para llenar el <select> del modal de filtro
    const populateFilterDropdown = () => {
        if (!filterSelect) return;
        
        while (filterSelect.options.length > 1) {
            filterSelect.remove(1);
        }
        
        worldCupsData.forEach(mundial => {
            const option = document.createElement('option');
            option.value = mundial.year; 
            option.textContent = `${mundial.year} - ${mundial.host}`;
            filterSelect.appendChild(option);
        });
    };

    // 2. Lógica para el modal de filtro (Botones)
    if (filterBtn && filterModal && closeFilterModalBtn && filterForm && filterClearBtn && sortSelect) {
        
        // Abrir el modal
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            populateFilterDropdown(); 
            filterModal.classList.remove('hidden');
        });

        // Cerrar con 'X'
        closeFilterModalBtn.addEventListener('click', () => {
            filterModal.classList.add('hidden');
        });

        // Cerrar al hacer clic fuera
        filterModal.addEventListener('click', (e) => {
            if (e.target === filterModal) {
                filterModal.classList.add('hidden');
            }
        });

        // Botón "Aplicar" (Lógica de Filtro y Orden)
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedYear = filterSelect.value;
            const selectedSort = sortSelect.value;
            
            let postsToDisplay = [...currentPosts];

            // --- 1. ETAPA DE FILTRO ---
            if (selectedYear) {
                postsToDisplay = postsToDisplay.filter(post => post.year === selectedYear);
            }

            // --- 2. ETAPA DE ORDEN ---
            switch (selectedSort) {
                case 'likes':
                    postsToDisplay.sort((a, b) => b.likes - a.likes); // Descendente
                    break;
                case 'comments':
                    postsToDisplay.sort((a, b) => b.comments - a.comments); // Descendente
                    break;
                case 'country':
                    postsToDisplay.sort((a, b) => a.host.localeCompare(b.host)); // Alfabético (A-Z)
                    break;
                case 'default':
                default:
                    postsToDisplay.sort((a, b) => parseInt(a.year) - parseInt(b.year)); // Cronológico
                    break;
            }
            
            renderPosts(postsToDisplay); 
            filterModal.classList.add('hidden'); 
        });

        // Botón "Limpiar Filtro"
        filterClearBtn.addEventListener('click', () => {
            filterSelect.value = ""; 
            sortSelect.value = "default";
            
            currentPosts.sort((a, b) => parseInt(a.year) - parseInt(b.year));
            renderPosts(currentPosts); 
            filterModal.classList.add('hidden');
        });
    }

    // 3. (NUEVO) Lógica de la Barra de Búsqueda Principal
    const performSearch = (query) => {
        const lowerCaseQuery = query.toLowerCase().trim();

        // 1. Verificar si la búsqueda es un nombre de categoría
        if (categoryDataMap[lowerCaseQuery] && lowerCaseQuery !== 'todo') {
            fetchData(lowerCaseQuery);
            
            // Actualiza la píldora activa
            filterPills.forEach(p => {
                p.classList.toggle('active', p.dataset.category === lowerCaseQuery);
            });
            return; // Termina la función aquí
        }

        // 2. Si no es un nombre de categoría, continúa con la búsqueda de texto normal
        if (!lowerCaseQuery) {
            renderPosts(currentPosts);
            return;
        }

        const filteredPosts = currentPosts.filter(post => {
            const username = post.username.toLowerCase();
            const description = post.description.toLowerCase();
            const year = post.year.toString();
            const host = post.host.toLowerCase();

            return (
                username.includes(lowerCaseQuery) ||    // 1. Busca por Usuario
                description.includes(lowerCaseQuery) || // 2. Busca en descripción
                year.includes(lowerCaseQuery) ||        // 3. Busca por Año
                host.includes(lowerCaseQuery)           // 4. Busca por País Sede
            );
        });

        renderPosts(filteredPosts);
    };


    // ==========================================================
    // --- INICIALIZACIÓN Y LISTENERS PRINCIPALES ---
    // ==========================================================
    
    applyDarkModeState();
    updateUserDropdownContent(); 

    // --- Menú lateral ---
    const menuIcon = document.getElementById('menu-icon');
    const closeBtn = document.getElementById('close-btn');
    if (menuIcon && sidebar && closeBtn) {
        menuIcon.addEventListener('click', () => sidebar.classList.add('open'));
        closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
    }

    // --- Menú de Usuario (Dropdown) ---
    if (userIconButton && userDropdownMenu) {
        userIconButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            userDropdownMenu.classList.toggle('show-dropdown'); 
        });
        document.addEventListener('click', (e) => {
            const isClickInside = userIconButton.contains(e.target) || userDropdownMenu.contains(e.target);
            if (!isClickInside && userDropdownMenu.classList.contains('show-dropdown')) {
                userDropdownMenu.classList.remove('show-dropdown');
            }
        });
    }

    // --- Lógica para SUBIR Y PREVISUALIZAR IMAGEN DE PERFIL EN CONFIGURACIÓN ---
    if (settingsProfilePicInput && currentProfilePic && settingsFileNameDisplay) {
        settingsProfilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    currentProfilePic.src = event.target.result;
                };
                reader.readAsDataURL(file);
                settingsFileNameDisplay.textContent = file.name;
            } else {
                settingsFileNameDisplay.textContent = 'No se ha seleccionado archivo';
                currentProfilePic.removeAttribute('src'); 
            }
        });
    }

    // --- Navegación (Home, Logo, etc.) ---
    const navigateToHome = (e) => {
        e.preventDefault();
        if (mundialesContent) mundialesContent.classList.add('hidden');
        if (authContainer) authContainer.classList.add('hidden');
        if (adminContent) adminContent.classList.add('hidden');
        if (myPostsContent) myPostsContent.classList.add('hidden');
        if (settingsContent) settingsContent.classList.add('hidden');
        
        if (homeContent) homeContent.classList.remove('content-hidden');
        if (heroBanner) heroBanner.classList.remove('content-hidden');

        const mainCarousel = document.getElementById('mainCarousel');
        const filterBar = document.querySelector('.content-filter-bar');
        if (mainCarousel) mainCarousel.classList.remove('hidden');
        if (filterBar) filterBar.classList.remove('hidden');
        
        sidebar.classList.remove('open');
        fetchData('todo'); 
    };
    
    homeLink.addEventListener('click', navigateToHome);
    if (logoLink) logoLink.addEventListener('click', navigateToHome);

    // --- Formularios de Auth (Login/Registro) ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const adminCheckbox = document.getElementById('admin-checkbox');
            const isAdminUser = adminCheckbox ? adminCheckbox.checked : false;
            returnToHome(e, isAdminUser);
        });
    }

    if (mainAuthBox && showLoginButton && showRegisterButton) {
        showRegisterButton.addEventListener('click', () => updateAuthView(false));
        showLoginButton.addEventListener('click', () => updateAuthView(true));
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            returnToHome(e, false); 
        });
    }
    
    // --- Lógica de Filtros y Búsqueda (Conectada) ---
    filterPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (searchInput) searchInput.value = "";
            if (filterSelect) filterSelect.value = "";
            if (sortSelect) sortSelect.value = "default";
            
            filterPills.forEach(p => p.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const category = e.currentTarget.getAttribute('data-category');
            
            fetchData(category);
        });
    });

    if (searchForm && searchInput) {
        // Ejecuta la búsqueda al presionar "Enter"
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch(searchInput.value);
        });

        // Ejecuta la búsqueda mientras escribes (opcional, pero bueno)
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }


    // --- Navegación a Mundiales ---
    const mundialesLinks = document.querySelectorAll('a[href="#"].horizon');
    mundialesLinks.forEach(link => {
        if (link.textContent === 'Mundiales') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (homeContent) homeContent.classList.add('content-hidden');
                if (heroBanner) heroBanner.classList.add('content-hidden');
                if (authContainer) authContainer.classList.add('hidden');
                if (adminContent) adminContent.classList.add('hidden');
                if (myPostsContent) myPostsContent.classList.add('hidden');
                if (settingsContent) settingsContent.classList.add('hidden');
                if (mundialesContent) mundialesContent.classList.remove('hidden');
                sidebar.classList.remove('open');
            });
        }
    });

    // --- Lógica de Modals (Crear Post, Categorías) ---
    if (createPostBtn && createPostModal && closeModalBtn) {
        createPostBtn.addEventListener('click', () => createPostModal.classList.remove('hidden'));
        closeModalBtn.addEventListener('click', () => createPostModal.classList.add('hidden'));
        createPostModal.addEventListener('click', (e) => {
            if (e.target === createPostModal) createPostModal.classList.add('hidden');
        });
    }

    if (addCategoryBtn && manageCategoryModal && closeCategoryModalBtn && categoryModalListoBtn) {
        addCategoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            renderCategoryList(); 
            manageCategoryModal.classList.remove('hidden');
        });
        closeCategoryModalBtn.addEventListener('click', () => manageCategoryModal.classList.add('hidden'));
        categoryModalListoBtn.addEventListener('click', () => manageCategoryModal.classList.add('hidden'));
        manageCategoryModal.addEventListener('click', (e) => {
            if (e.target === manageCategoryModal) manageCategoryModal.classList.add('hidden');
        });
        
        // --- Lógica de Event Delegation para botones de editar/borrar en categorías (Simulación) ---
        categoryListAdmin.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            
            const categoryName = button.dataset.category;

            if (button.classList.contains('btn-edit')) {
                console.log(`(Lógica pendiente) Editar categoría: ${categoryName}`);
            }
            if (button.classList.contains('btn-delete')) {
                // Simulación: No se pueden eliminar categorías estáticas, solo logueamos.
                console.log(`(Lógica pendiente) Eliminar categoría: ${categoryName}`);
            }
        });
    }

    // --- 💡 LISTENER AÑADIDO PARA EL FORMULARIO DE CATEGORÍA ---
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = addCategoryForm.querySelector('input[type="text"]');
            if (!input) return;

            const newCategoryName = input.value.trim().toLowerCase();
            
            if (newCategoryName && !categoryDataMap[newCategoryName]) {
                console.log(`(SIMULACIÓN) Agregando nueva categoría: ${newCategoryName}`);
                
                // 1. Simula la adición al mapa
                categoryDataMap[newCategoryName] = `Datos/${newCategoryName}.json`;
                
                // 2. Vuelve a renderizar la lista en el modal
                renderCategoryList();
                
                // 3. Limpia el input
                input.value = '';
                
                // NOTA: En un proyecto real, también deberías
                // actualizar la barra de filtros (pills) de la página principal.
            } else if (categoryDataMap[newCategoryName]) {
                alert('Esa categoría ya existe.');
            }
        });
    }


    // --- Lógica de Modals (Agregar Mundial) ---
    if (addMundialBtn && addMundialModal && closeMundialModalBtn && newMundialForm) {
        
        addMundialBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addMundialModal.classList.remove('hidden');
        });

        closeMundialModalBtn.addEventListener('click', () => {
            addMundialModal.classList.add('hidden');
        });

        addMundialModal.addEventListener('click', (e) => {
            if (e.target === addMundialModal) {
                addMundialModal.classList.add('hidden');
            }
        });
        
        newMundialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const year = e.target.year.value;
            const host = e.target.host.value;
            
            console.log(`(SIMULACIÓN) Agregando Mundial:`);
            console.log(`Año: ${year}, Anfitrión: ${host}`);
            
            addMundialModal.classList.add('hidden');
            newMundialForm.reset();
        });
    }

    // --- Lógica para INTERACCIÓN DE POSTS (Feed Principal) ---
    if (postsContainer) {
        postsContainer.addEventListener('click', (e) => {
            
            // --- Lógica para el botón de toggle de comentarios ---
            const commentToggle = e.target.closest('.comment-toggle-btn');
            if (commentToggle) {
                e.preventDefault();
                const targetId = commentToggle.dataset.target;
                const commentSection = document.getElementById(targetId);
                if (commentSection) {
                    commentSection.classList.toggle('hidden');
                }
            }

            // --- Lógica para las estrellas (simulación) ---
            const starLabel = e.target.closest('.interactive-rating label');
            if (starLabel) {
                console.log("Calificación enviada (simulación)");
            }

            // --- Lógica para el botón de eliminar comentario (ADMIN) ---
            const deleteButton = e.target.closest('.admin-delete-comment');
            if (deleteButton && isAdmin) { // Solo si es admin
                e.preventDefault();
                const interactionElement = deleteButton.closest('.interaction');
                if (interactionElement) {
                    interactionElement.style.display = 'none'; // Simulación de borrado
                    console.log("Comentario eliminado (simulación)");
                }
            }
        });
    }

    // --- Listener para "MIS PUBLICACIONES" (Eliminar Comentarios Admin) ---
    if (myPostsContainer) {
        myPostsContainer.addEventListener('click', (e) => {

            // --- Lógica para el botón de eliminar comentario ---
            const deleteButton = e.target.closest('.admin-delete-comment');
            if (deleteButton && isAdmin) { // Doble chequeo de seguridad
                e.preventDefault();
                const interactionElement = deleteButton.closest('.interaction');
                if (interactionElement) {
                    // Simulación: Oculta el comentario
                    interactionElement.style.display = 'none';
                    console.log("Comentario eliminado (simulación)");
                }
            }
        });
    }
    
    // ==========================================================
    // --- LÓGICA DE AJUSTE DE FUENTE (PASO 2) ---
    // ==========================================================
    
    const btnSmall = document.getElementById('font-size-small');
    const btnMedium = document.getElementById('font-size-medium');
    const btnLarge = document.getElementById('font-size-large');
    const allFontBtns = [btnSmall, btnMedium, btnLarge];
    const rootHtml = document.documentElement; // Usamos <html> en lugar de <body>

    const applyFontSize = (size) => {
        // 1. Quita clases anteriores
        rootHtml.classList.remove('font-size-small', 'font-size-large');

        // 2. Aplica el tamaño al <html>
        if (size === 'small') {
            rootHtml.classList.add('font-size-small');
        } else if (size === 'large') {
            rootHtml.classList.add('font-size-large');
        }
        
        // 3. Guarda en localStorage
        localStorage.setItem('copa360_fontSize', size);
        
        // 4. Actualiza el botón activo
        if (allFontBtns.every(btn => btn)) { // Asegurarse que los botones existen
            allFontBtns.forEach(btn => btn.classList.remove('active'));
            if (size === 'small') btnSmall.classList.add('active');
            else if (size === 'large') btnLarge.classList.add('active');
            else btnMedium.classList.add('active');
        }
    };

    // --- Cargar la preferencia al iniciar la página ---
    const savedFontSize = localStorage.getItem('copa360_fontSize');
    if (savedFontSize) {
        applyFontSize(savedFontSize);
    } else {
        applyFontSize('medium'); // Aplica el default si no hay nada guardado
    }

    // --- Listeners para los botones ---
    if (btnSmall && btnMedium && btnLarge) {
        btnSmall.addEventListener('click', () => applyFontSize('small'));
        btnMedium.addEventListener('click', () => applyFontSize('medium'));
        btnLarge.addEventListener('click', () => applyFontSize('large'));
    }

    
    // ==========================================================
    // --- LÓGICA DE LECTOR DE VOZ (MEJORADA CON TOGGLE) (PASO 2) ---
    // ==========================================================
    
    const hoverReadToggle = document.getElementById('hover-read-toggle');
    const readableTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'SPAN', 'BUTTON', 'LABEL'];
    
    // Estado inicial (lo leemos de localStorage)
    let isHoverReadActive = localStorage.getItem('copa360_hoverRead') === 'true';
    let lastHoveredElement = null;

    // Función para leer el texto
    const speakText = (text) => {
        if (!text || text.trim().length === 0) return;
        speechSynthesis.cancel(); // Cancela cualquier lectura anterior
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Establece el idioma
        speechSynthesis.speak(utterance);
    };

    // Manejador para cuando el mouse pasa por encima
    const handleHoverRead = (e) => {
        if (!isHoverReadActive) return;

        const target = e.target;
        
        // Si el mouse entra a la barra lateral o al header, detiene la lectura
        if (target.closest('.sidebar') || target.closest('.head')) {
             if (lastHoveredElement) {
                 lastHoveredElement.classList.remove('reading-highlight');
             }
             speechSynthesis.cancel();
             lastHoveredElement = null;
             return;
        }
        
        if (target === lastHoveredElement) return;

        if (lastHoveredElement) {
            lastHoveredElement.classList.remove('reading-highlight');
        }

        if (readableTags.includes(target.tagName)) {
            const text = target.textContent;
            
            if (text && text.trim().length > 0) {
                target.classList.add('reading-highlight');
                lastHoveredElement = target;
                speakText(text);
            } else {
                lastHoveredElement = null;
                speechSynthesis.cancel();
            }
        } else {
            lastHoveredElement = null;
            speechSynthesis.cancel();
        }
    };

    // Función para activar o desactivar la funcionalidad
    const setHoverReadState = (isActive) => {
        isHoverReadActive = isActive;
        localStorage.setItem('copa360_hoverRead', isActive);

        if (isActive) {
            document.addEventListener('mouseover', handleHoverRead);
        } else {
            document.removeEventListener('mouseover', handleHoverRead);
            speechSynthesis.cancel();
            if (lastHoveredElement) {
                lastHoveredElement.classList.remove('reading-highlight');
                lastHoveredElement = null;
            }
        }
    };

    // Asignar el evento al nuevo interruptor
    if (hoverReadToggle) {
        // 1. Poner el interruptor en el estado guardado al cargar la página
        hoverReadToggle.checked = isHoverReadActive;
        
        // 2. Activar la función si estaba guardada como "activa"
        if (isHoverReadActive) {
            setHoverReadState(true);
        }
        
        // 3. Escuchar cambios en el interruptor
        hoverReadToggle.addEventListener('change', () => {
            setHoverReadState(hoverReadToggle.checked);
        });
    }

    // ==========================================================
    // --- (FIN) LÓGICA DE LECTOR DE VOZ ---
    // ==========================================================
    
    // ==========================================================
    // --- LÓGICA DEL ONBOARDING (TOUR GUIADO) (PASO 1) ---
    // ==========================================================

    // --- Funciones del Tour ---
    
    const endTour = () => {
        if (tourOverlay) tourOverlay.classList.add('hidden');
        if (tourModal) tourModal.classList.add('hidden');
        // Usamos localStorage para "recordar" que el usuario ya vio el tour
        localStorage.setItem('copa360_tour_visto', 'true');
    };

    // Función para posicionar el modal cerca de un elemento
    const positionModal = (element) => {
        if (!tourModal) return; // Salir si el modal no existe
        
        if (!element || window.innerWidth < 769) { 
            // Si el elemento no existe (o estamos en móvil), centrarlo
            tourModal.style.top = '50%';
            tourModal.style.left = '50%';
            tourModal.style.transform = 'translate(-50%, -50%)';
            return;
        }
        
        const rect = element.getBoundingClientRect(); // Coordenadas del elemento
        const modalWidth = tourModal.offsetWidth;
        
        // Posicionar debajo del elemento
        let top = rect.bottom + 15 + window.scrollY;
        let left = rect.left + (rect.width / 2) - (modalWidth / 2) + window.scrollX;

        // Ajustar si se sale de la pantalla por los lados
        if (left < 10) left = 10;
        if ((left + modalWidth) > (window.innerWidth - 10)) {
            left = window.innerWidth - modalWidth - 10;
        }

        tourModal.style.top = `${top}px`;
        tourModal.style.left = `${left}px`;
        tourModal.style.transform = 'none'; // Quitar cualquier transform centrado
    };

    const showTourStep = (step) => {
        if (!tourModal || !tourTitle || !tourText || !tourBtnNext) return; // Comprobación de seguridad
        
        currentTourStep = step;
        let targetElement; // Elemento que vamos a señalar

        switch(step) {
            case 1:
                targetElement = document.getElementById('user-icon-btn');
                tourTitle.textContent = '¡Bienvenido a Copa 360!';
                tourText.textContent = 'Haz clic en el icono de usuario para Iniciar Sesión o Registrarte y poder interactuar con las publicaciones.';
                tourBtnNext.textContent = 'Siguiente';
                break;
            case 2:
                targetElement = document.getElementById('search-form');
                tourTitle.textContent = 'Busca Contenido';
                tourText.textContent = 'Usa la barra de búsqueda para encontrar publicaciones por jugador, año o país.';
                tourBtnNext.textContent = 'Siguiente';
                break;
            case 3:
                targetElement = document.querySelector('.content-filter-bar');
                tourTitle.textContent = 'Filtra por Categorías';
                tourText.textContent = 'Usa estas píldoras para filtrar el contenido por temas, como Jugadas, Polémicas o Estadios.';
                tourBtnNext.textContent = 'Siguiente';
                break;
            case 4:
                // Busca el enlace de "Mundiales" en la barra de categorías del header
                targetElement = Array.from(document.querySelectorAll('.navbar.categories-bar a')).find(a => a.textContent.includes('Mundiales'));
                tourTitle.textContent = 'Explora la Historia';
                tourText.textContent = 'Visita nuestra sección de "Mundiales" para ver un resumen de cada torneo.';
                tourBtnNext.textContent = '¡Entendido!';
                break;
            default:
                endTour(); // Termina el tour
                return;
        }
        
        // Posiciona el modal cerca del elemento objetivo
        positionModal(targetElement);
    };

    const startTour = () => {
        // 1. Revisa si el usuario ya vio el tour en su localStorage
        const hasSeenTour = localStorage.getItem('copa360_tour_visto');
        
        // (Descomenta la siguiente línea para forzar que el tour se muestre siempre, útil para pruebas)
        // const hasSeenTour = false; 
        
        if (!hasSeenTour && tourOverlay && tourModal) { // Comprobar que existen
            tourOverlay.classList.remove('hidden');
            tourModal.classList.remove('hidden');
            // Esperar un momento para que el CSS se aplique y podamos medir el modal
            setTimeout(() => showTourStep(1), 50); 
        }
    };

    // --- Event Listeners del Tour ---
    if (tourBtnNext && tourBtnSkip && tourOverlay) {
        tourBtnNext.addEventListener('click', () => {
            showTourStep(currentTourStep + 1); // Avanza al siguiente paso
        });
        
        tourBtnSkip.addEventListener('click', endTour); // Salta el tour
        tourOverlay.addEventListener('click', endTour); // Cierra si hace clic fuera
    }

    // Reposicionar el modal si la ventana cambia de tamaño (importante para responsive)
    window.addEventListener('resize', () => {
        if (tourModal && !tourModal.classList.contains('hidden')) {
            showTourStep(currentTourStep); // Llama a la función actual para reposicionar
        }
    });

    // --- Iniciar el Tour (si es necesario) ---
    // Lo llamamos un poco después para que la página cargue bien
    setTimeout(startTour, 1000); // Inicia el tour 1 segundo después de cargar
    // --- LÓGICA PARA BOTONES DEL HEADER (Comunidad y Noticias) ---
    const btnHeaderComunidad = document.getElementById('header-btn-comunidad');
    const btnHeaderNoticias = document.getElementById('header-btn-noticias');

    if (btnHeaderComunidad) {
        btnHeaderComunidad.addEventListener('click', (e) => {
            // 1. Usamos tu función existente para resetear vistas (ocultar admin, login, etc.)
            navigateToHome(e); 
            
            // 2. Cargamos los datos de comunidad
            fetchData('comunidad');
            
            // 3. (Opcional) Actualizamos visualmente la barra de filtros de abajo
            // para quitar la clase 'active' de otras píldoras
            filterPills.forEach(p => p.classList.remove('active'));
        });
    }

    if (btnHeaderNoticias) {
        btnHeaderNoticias.addEventListener('click', (e) => {
            navigateToHome(e);
            fetchData('noticias');
            filterPills.forEach(p => p.classList.remove('active'));
        });
    }   
    
    fetchData('todo');


}); // Cierre final de DOMContentLoaded