<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plateforme Communautaire - Backend API</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 3rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            margin: 2rem;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: white;
        }
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .endpoints {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 10px;
            padding: 1.5rem;
            margin-top: 2rem;
            text-align: left;
        }
        .endpoint {
            margin: 0.5rem 0;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            font-family: 'Courier New', monospace;
        }
        .method {
            display: inline-block;
            padding: 0.2rem 0.8rem;
            border-radius: 4px;
            font-weight: bold;
            margin-right: 1rem;
            font-size: 0.9rem;
        }
        .method.post { background: #49cc90; color: white; }
        .method.get { background: #61affe; color: white; }
        .method.put { background: #fca130; color: white; }
        .method.delete { background: #f93e3e; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 API Plateforme Communautaire</h1>
        <div class="subtitle">Backend pour la gestion des acteurs économiques locaux</div>
        
        <div style="margin: 2rem 0;">
            <p>Bienvenue sur l'API backend du projet de plateforme communautaire.</p>
            <p>Cette API permet de gérer les profils des acteurs économiques de la commune.</p>
        </div>
        
        <div class="endpoints">
            <h3>📡 Endpoints Principaux</h3>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <strong>/api/register</strong> - Inscription d'un nouvel utilisateur
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <strong>/api/login</strong> - Connexion
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <strong>/api/directory</strong> - Annuaire public des profils
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <strong>/api/announcements</strong> - Annonces de la mairie
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <strong>/api/news</strong> - Actualités économiques
            </div>
        </div>
        
        <div style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.8;">
            <p>Pour utiliser l'API, utilisez des outils comme Postman, Insomnia ou cURL</p>
        </div>
    </div>
</body>
</html>