<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation API - Plateforme Économique</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #4361ee;
            --success: #4cc9f0;
            --danger: #f72585;
            --warning: #ff9e00;
            --dark: #1a1a2e;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px 0;
        }
        
        .api-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 30px;
            margin-bottom: 30px;
        }
        
        .api-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 5px solid var(--primary);
        }
        
        .api-section.public { border-left-color: var(--success); }
        .api-section.protected { border-left-color: var(--warning); }
        .api-section.admin { border-left-color: var(--danger); }
        
        .method-badge {
            font-weight: bold;
            padding: 5px 15px;
            border-radius: 5px;
            font-size: 0.9rem;
        }
        
        .method-get { background: #61affe; color: white; }
        .method-post { background: #49cc90; color: white; }
        .method-put { background: #fca130; color: white; }
        .method-delete { background: #f93e3e; color: white; }
        
        .endpoint {
            font-family: 'Courier New', monospace;
            background: #2d3748;
            color: #e2e8f0;
            padding: 10px 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        
        .test-btn {
            transition: all 0.3s;
        }
        
        .test-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .response-area {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            margin-top: 15px;
            max-height: 300px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 0.9rem;
            white-space: pre-wrap;
        }
        
        .token-display {
            background: #fffbeb;
            border: 1px solid #fcd34d;
            border-radius: 5px;
            padding: 10px;
            font-family: monospace;
            font-size: 0.8rem;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- En-tête -->
        <div class="api-container">
            <div class="text-center mb-4">
                <h1 class="display-4 fw-bold" style="color: var(--primary);">
                    <i class="fas fa-code me-2"></i>Documentation API
                </h1>
                <p class="lead">Plateforme Économique - Backend Laravel</p>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Base URL: <code id="baseUrl">{{ url('/api') }}</code>
                    <button class="btn btn-sm btn-outline-primary ms-3" onclick="copyBaseUrl()">
                        <i class="fas fa-copy"></i> Copier
                    </button>
                </div>
            </div>

            <!-- Gestion des tokens -->
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-primary text-white">
                            <i class="fas fa-key me-2"></i>Authentification
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">Token JWT</label>
                                <div class="input-group">
                                    <input type="text" id="authToken" class="form-control" 
                                           placeholder="Collez votre token ici..." 
                                           value="{{ session('api_token') }}">
                                    <button class="btn btn-outline-primary" onclick="saveToken()">
                                        <i class="fas fa-save"></i>
                                    </button>
                                    <button class="btn btn-outline-danger" onclick="clearToken()">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div id="tokenDisplay" class="token-display" style="display: none;">
                                Token sauvegardé: <span id="currentToken"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-success text-white">
                            <i class="fas fa-vial me-2"></i>Tests rapides
                        </div>
                        <div class="card-body">
                            <button class="btn btn-success w-100 mb-2" onclick="testPublicEndpoint()">
                                <i class="fas fa-check-circle me-2"></i>Tester une route publique
                            </button>
                            <button class="btn btn-warning w-100" onclick="testProtectedEndpoint()">
                                <i class="fas fa-shield-alt me-2"></i>Tester une route protégée
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ========== ROUTES PUBLIQUES ========== -->
            <h2 class="mb-4">
                <i class="fas fa-globe me-2" style="color: var(--success);"></i>
                Routes Publiques
            </h2>

            <!-- Authentification -->
            <div class="api-section public">
                <h4><i class="fas fa-user-check me-2"></i>Authentification</h4>
                
                <!-- Inscription -->
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-2">
                        <span class="method-badge method-post me-3">POST</span>
                        <h5 class="mb-0">Inscription</h5>
                    </div>
                    <div class="endpoint">/register</div>
                    <p class="text-muted">Crée un nouvel utilisateur</p>
                    
                    <button class="btn btn-outline-primary test-btn mb-3" 
                            onclick="testAPI('register', 'post', {
                                'first_name': 'John',
                                'last_name': 'Doe',
                                'email': 'john.doe@example.com',
                                'password': 'password123',
                                'password_confirmation': 'password123',
                                'birth_date': '1990-01-01',
                                'gender': 'male',
                                'phone': '+1234567890',
                                'address': '123 Main St',
                                'city': 'New York',
                                'country': 'USA'
                            })">
                        <i class="fas fa-play me-2"></i>Tester l'inscription
                    </button>
                </div>

                <!-- Connexion -->
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-2">
                        <span class="method-badge method-post me-3">POST</span>
                        <h5 class="mb-0">Connexion</h5>
                    </div>
                    <div class="endpoint">/login</div>
                    <p class="text-muted">Authentifie un utilisateur</p>
                    
                    <button class="btn btn-outline-success test-btn" 
                            onclick="testAPI('login', 'post', {
                                'email': 'test@example.com',
                                'password': 'password123'
                            })">
                        <i class="fas fa-sign-in-alt me-2"></i>Tester la connexion
                    </button>
                </div>

                <!-- Autres routes d'auth -->
                <div class="row">
                    <div class="col-md-4">
                        <button class="btn btn-outline-info w-100 mb-2" 
                                onclick="testAPI('password-reset', 'post', {'email': 'test@example.com'})">
                            <i class="fas fa-key me-2"></i>Réinitialisation MDP
                        </button>
                    </div>
                    <div class="col-md-4">
                        <button class="btn btn-outline-secondary w-100 mb-2" 
                                onclick="testAPI('email/verify/test-token', 'get')">
                            <i class="fas fa-envelope me-2"></i>Vérification Email
                        </button>
                    </div>
                </div>
            </div>

            <!-- Annuaire -->
            <div class="api-section public">
                <h4><i class="fas fa-address-book me-2"></i>Annuaire</h4>
                
                <div class="row">
                    <div class="col-md-4">
                        <button class="btn btn-outline-primary w-100 mb-2" 
                                onclick="testAPI('directory', 'get')">
                            <i class="fas fa-list me-2"></i>Liste annuaire
                        </button>
                    </div>
                    <div class="col-md-4">
                        <button class="btn btn-outline-primary w-100 mb-2" 
                                onclick="testAPI('directory/search?q=test', 'get')">
                            <i class="fas fa-search me-2"></i>Recherche
                        </button>
                    </div>
                    <div class="col-md-4">
                        <button class="btn btn-outline-primary w-100 mb-2" 
                                onclick="testAPI('directory/1', 'get')">
                            <i class="fas fa-eye me-2"></i>Voir profil
                        </button>
                    </div>
                </div>
            </div>

            <!-- Annonces -->
            <div class="api-section public">
                <h4><i class="fas fa-bullhorn me-2"></i>Annonces</h4>
                
                <div class="row">
                    <div class="col-md-6">
                        <button class="btn btn-outline-warning w-100 mb-2" 
                                onclick="testAPI('announcements', 'get')">
                            <i class="fas fa-list me-2"></i>Liste annonces
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button class="btn btn-outline-warning w-100 mb-2" 
                                onclick="testAPI('announcements/1', 'get')">
                            <i class="fas fa-eye me-2"></i>Voir annonce
                        </button>
                    </div>
                </div>
            </div>

            <!-- Actualités -->
            <div class="api-section public">
                <h4><i class="fas fa-newspaper me-2"></i>Actualités</h4>
                
                <div class="row">
                    <div class="col-md-6">
                        <button class="btn btn-outline-info w-100 mb-2" 
                                onclick="testAPI('news', 'get')">
                            <i class="fas fa-list me-2"></i>Liste actualités
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button class="btn btn-outline-info w-100 mb-2" 
                                onclick="testAPI('news/test-article', 'get')">
                            <i class="fas fa-eye me-2"></i>Voir article
                        </button>
                    </div>
                </div>
            </div>

            <!-- ========== ROUTES PROTÉGÉES ========== -->
            <h2 class="mt-5 mb-4">
                <i class="fas fa-shield-alt me-2" style="color: var(--warning);"></i>
                Routes Protégées (Authentification requise)
            </h2>

            <!-- Profil utilisateur -->
            <div class="api-section protected">
                <h4><i class="fas fa-user me-2"></i>Profil Utilisateur</h4>
                
                <div class="row mb-3">
                    <div class="col-md-3">
                        <button class="btn btn-outline-dark w-100 mb-2" 
                                onclick="testProtectedAPI('user', 'get')">
                            <i class="fas fa-user me-2"></i>Infos utilisateur
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-dark w-100 mb-2" 
                                onclick="testProtectedAPI('logout', 'post')">
                            <i class="fas fa-sign-out-alt me-2"></i>Déconnexion
                        </button>
                    </div>
                </div>

                <!-- Gestion du profil -->
                <h5 class="mt-4">Gestion du profil</h5>
                <div class="row">
                    <div class="col-md-4">
                        <button class="btn btn-outline-secondary w-100 mb-2" 
                                onclick="testProtectedAPI('profile', 'get')">
                            <i class="fas fa-id-card me-2"></i>Voir profil
                        </button>
                    </div>
                    <div class="col-md-4">
                        <button class="btn btn-outline-secondary w-100 mb-2" 
                                onclick="testProtectedAPI('profile', 'put', {
                                    'first_name': 'Updated',
                                    'last_name': 'Name'
                                })">
                            <i class="fas fa-edit me-2"></i>Mettre à jour
                        </button>
                    </div>
                    <div class="col-md-4">
                        <button class="btn btn-outline-danger w-100 mb-2" 
                                onclick="if(confirm('Supprimer le compte?')) testProtectedAPI('profile', 'delete')">
                            <i class="fas fa-trash me-2"></i>Supprimer compte
                        </button>
                    </div>
                </div>

                <!-- Formations académiques -->
                <h5 class="mt-4">Formations académiques</h5>
                <div class="row">
                    <div class="col-md-3">
                        <button class="btn btn-outline-primary w-100 mb-2" 
                                onclick="testProtectedAPI('profile/education', 'post', {
                                    'degree': 'Master',
                                    'institution': 'University',
                                    'field_of_study': 'Computer Science',
                                    'start_year': 2018,
                                    'end_year': 2020
                                })">
                            <i class="fas fa-plus me-2"></i>Ajouter
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-primary w-100 mb-2" 
                                onclick="testProtectedAPI('profile/education', 'get')">
                            <i class="fas fa-list me-2"></i>Lister
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-warning w-100 mb-2" 
                                onclick="testProtectedAPI('profile/education/1', 'put', {
                                    'degree': 'Updated Degree'
                                })">
                            <i class="fas fa-edit me-2"></i>Modifier
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-danger w-100 mb-2" 
                                onclick="testProtectedAPI('profile/education/1', 'delete')">
                            <i class="fas fa-trash me-2"></i>Supprimer
                        </button>
                    </div>
                </div>

                <!-- Expériences professionnelles -->
                <h5 class="mt-4">Expériences professionnelles</h5>
                <div class="row">
                    <div class="col-md-3">
                        <button class="btn btn-outline-success w-100 mb-2" 
                                onclick="testProtectedAPI('profile/experience', 'post', {
                                    'position': 'Developer',
                                    'company': 'Tech Corp',
                                    'start_date': '2020-01-01'
                                })">
                            <i class="fas fa-plus me-2"></i>Ajouter
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-success w-100 mb-2" 
                                onclick="testProtectedAPI('profile/experience', 'get')">
                            <i class="fas fa-list me-2"></i>Lister
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-warning w-100 mb-2" 
                                onclick="testProtectedAPI('profile/experience/1', 'put', {
                                    'position': 'Senior Developer'
                                })">
                            <i class="fas fa-edit me-2"></i>Modifier
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-danger w-100 mb-2" 
                                onclick="testProtectedAPI('profile/experience/1', 'delete')">
                            <i class="fas fa-trash me-2"></i>Supprimer
                        </button>
                    </div>
                </div>
            </div>

            <!-- Profil professionnel -->
            <div class="api-section protected">
                <h4><i class="fas fa-briefcase me-2"></i>Profil Professionnel</h4>
                
                <div class="row">
                    <div class="col-md-3">
                        <button class="btn btn-outline-info w-100 mb-2" 
                                onclick="testProtectedAPI('professional', 'post', {
                                    'company_name': 'My Company',
                                    'description': 'Company description'
                                })">
                            <i class="fas fa-plus me-2"></i>Créer
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-info w-100 mb-2" 
                                onclick="testProtectedAPI('professional/upload-document', 'post')">
                            <i class="fas fa-upload me-2"></i>Upload doc
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-info w-100 mb-2" 
                                onclick="testProtectedAPI('professional/submit', 'post')">
                            <i class="fas fa-paper-plane me-2"></i>Soumettre
                        </button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-info w-100 mb-2" 
                                onclick="testProtectedAPI('professional/status', 'get')">
                            <i class="fas fa-info-circle me-2"></i>Statut
                        </button>
                    </div>
                </div>
            </div>

            <!-- Newsletter -->
            <div class="api-section protected">
                <h4><i class="fas fa-envelope me-2"></i>Newsletter</h4>
                
                <div class="row">
                    <div class="col-md-6">
                        <button class="btn btn-outline-success w-100 mb-2" 
                                onclick="testProtectedAPI('newsletter/subscribe', 'post')">
                            <i class="fas fa-check me-2"></i>S'abonner
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button class="btn btn-outline-danger w-100 mb-2" 
                                onclick="testProtectedAPI('newsletter/unsubscribe', 'post')">
                            <i class="fas fa-times me-2"></i>Se désabonner
                        </button>
                    </div>
                </div>
            </div>

            <!-- Annonces et Actualités (version connectée) -->
            <div class="api-section protected">
                <h4><i class="fas fa-user-tie me-2"></i>Contenu personnalisé</h4>
                
                <div class="row">
                    <div class="col-md-6">
                        <button class="btn btn-outline-warning w-100 mb-2" 
                                onclick="testProtectedAPI('user/announcements', 'get')">
                            <i class="fas fa-bullhorn me-2"></i>Mes annonces
                        </button>
                    </div>
                    <div class="col-md-6">
                        <button class="btn btn-outline-info w-100 mb-2" 
                                onclick="testProtectedAPI('user/news', 'get')">
                            <i class="fas fa-newspaper me-2"></i>Mes actualités
                        </button>
                    </div>
                </div>
            </div>

            <!-- ========== ZONE DE RÉPONSE ========== -->
            <div class="mt-5">
                <h3><i class="fas fa-code me-2"></i>Réponses API</h3>
                <div class="response-area" id="responseArea">
                    <i class="text-muted">Les réponses des appels API apparaîtront ici...</i>
                </div>
                <div class="mt-3">
                    <button class="btn btn-outline-secondary" onclick="clearResponses()">
                        <i class="fas fa-trash me-2"></i>Effacer les réponses
                    </button>
                    <button class="btn btn-outline-secondary" onclick="copyResponse()">
                        <i class="fas fa-copy me-2"></i>Copier la réponse
                    </button>
                </div>
            </div>
        </div>

        <!-- Pied de page -->
        <div class="text-center text-white mb-4">
            <p>© 2024 Plateforme Économique - Laravel {{ app()->version() }}</p>
            <p class="small">
                <i class="fas fa-bolt me-1"></i>
                Temps de réponse: <span id="responseTime">0</span>ms
            </p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Variables globales
        const baseUrl = document.getElementById('baseUrl').textContent;
        let authToken = localStorage.getItem('api_token') || '';

        // Initialiser le token affiché
        document.getElementById('authToken').value = authToken;
        if (authToken) {
            document.getElementById('tokenDisplay').style.display = 'block';
            document.getElementById('currentToken').textContent = authToken.substring(0, 50) + '...';
        }

        // Fonctions de gestion des tokens
        function saveToken() {
            const token = document.getElementById('authToken').value.trim();
            if (token) {
                localStorage.setItem('api_token', token);
                authToken = token;
                document.getElementById('tokenDisplay').style.display = 'block';
                document.getElementById('currentToken').textContent = token.substring(0, 50) + '...';
                showMessage('Token sauvegardé avec succès!', 'success');
            }
        }

        function clearToken() {
            localStorage.removeItem('api_token');
            document.getElementById('authToken').value = '';
            document.getElementById('tokenDisplay').style.display = 'none';
            authToken = '';
            showMessage('Token supprimé!', 'warning');
        }

        // Fonction principale pour tester les API
        async function testAPI(endpoint, method = 'GET', data = null) {
            const startTime = Date.now();
            const url = `${baseUrl}/${endpoint}`;
            
            const options = {
                method: method.toUpperCase(),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            try {
                showLoading();
                const response = await fetch(url, options);
                const responseTime = Date.now() - startTime;
                document.getElementById('responseTime').textContent = responseTime;
                
                let responseData;
                try {
                    responseData = await response.json();
                } catch {
                    responseData = { text: await response.text() };
                }

                displayResponse({
                    endpoint: endpoint,
                    method: method,
                    status: response.status,
                    statusText: response.statusText,
                    time: responseTime + 'ms',
                    data: responseData,
                    headers: Object.fromEntries(response.headers.entries())
                });
            } catch (error) {
                displayResponse({
                    endpoint: endpoint,
                    method: method,
                    error: error.message,
                    time: (Date.now() - startTime) + 'ms'
                });
            }
        }

        // Fonction pour tester les API protégées
        async function testProtectedAPI(endpoint, method = 'GET', data = null) {
            if (!authToken) {
                showMessage('Token d\'authentification requis! Veuillez vous connecter d\'abord.', 'danger');
                return;
            }

            const url = `${baseUrl}/${endpoint}`;
            const startTime = Date.now();
            
            const options = {
                method: method.toUpperCase(),
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            try {
                showLoading();
                const response = await fetch(url, options);
                const responseTime = Date.now() - startTime;
                document.getElementById('responseTime').textContent = responseTime;
                
                let responseData;
                try {
                    responseData = await response.json();
                } catch {
                    responseData = { text: await response.text() };
                }

                displayResponse({
                    endpoint: endpoint,
                    method: method,
                    status: response.status,
                    statusText: response.statusText,
                    time: responseTime + 'ms',
                    data: responseData,
                    headers: Object.fromEntries(response.headers.entries())
                });

                // Si c'est une connexion, sauvegarder le token
                if (endpoint === 'login' && responseData.token) {
                    localStorage.setItem('api_token', responseData.token);
                    authToken = responseData.token;
                    document.getElementById('authToken').value = responseData.token;
                    document.getElementById('tokenDisplay').style.display = 'block';
                    document.getElementById('currentToken').textContent = responseData.token.substring(0, 50) + '...';
                }
            } catch (error) {
                displayResponse({
                    endpoint: endpoint,
                    method: method,
                    error: error.message,
                    time: (Date.now() - startTime) + 'ms'
                });
            }
        }

        // Afficher la réponse
        function displayResponse(info) {
            const responseArea = document.getElementById('responseArea');
            
            let statusClass = 'text-secondary';
            if (info.status >= 200 && info.status < 300) statusClass = 'text-success';
            else if (info.status >= 400) statusClass = 'text-danger';

            const responseHtml = `
                <div class="mb-3 p-3 border rounded">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong class="${statusClass}">
                            ${info.method} ${info.endpoint}
                            ${info.status ? ` - ${info.status} ${info.statusText}` : ''}
                        </strong>
                        <small class="text-muted">${info.time}</small>
                    </div>
                    <hr>
                    <pre style="margin: 0; font-size: 0.9rem;">${JSON.stringify(info.data || info.error, null, 2)}</pre>
                </div>
                ${responseArea.innerHTML}
            `;
            
            responseArea.innerHTML = responseHtml;
        }

        // Fonctions utilitaires
        function showMessage(message, type = 'info') {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
            alert.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            document.body.appendChild(alert);
            
            setTimeout(() => {
                alert.remove();
            }, 3000);
        }

        function showLoading() {
            const responseArea = document.getElementById('responseArea');
            responseArea.innerHTML = `<div class="text-center"><div class="spinner-border text-primary"></div><p class="mt-2">Chargement...</p></div>`;
        }

        function clearResponses() {
            document.getElementById('responseArea').innerHTML = '<i class="text-muted">Les réponses des appels API apparaîtront ici...</i>';
        }

        function copyResponse() {
            const text = document.getElementById('responseArea').innerText;
            navigator.clipboard.writeText(text);
            showMessage('Réponse copiée!', 'success');
        }

        function copyBaseUrl() {
            navigator.clipboard.writeText(baseUrl);
            showMessage('URL copiée!', 'success');
        }

        // Tests rapides
        function testPublicEndpoint() {
            testAPI('te', 'GET');
        }

        function testProtectedEndpoint() {
            if (!authToken) {
                showMessage('Veuillez d\'abord sauvegarder un token!', 'warning');
                return;
            }
            testProtectedAPI('user', 'GET');
        }

        // Exporter les fonctions globalement pour le débogage
        window.testAPI = testAPI;
        window.testProtectedAPI = testProtectedAPI;
    </script>
</body>
</html>