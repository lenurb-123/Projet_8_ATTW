<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Documentation API – Backend</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f8fafc;
            color: #1f2937;
            margin: 0;
            padding: 20px;
        }

        h1, h2, h3 {
            margin-top: 30px;
        }

        h1 {
            color: #111827;
        }

        .section {
            margin-bottom: 40px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background: #fff;
        }

        th, td {
            padding: 12px 10px;
            border: 1px solid #e5e7eb;
            text-align: left;
        }

        th {
            background: #f1f5f9;
        }

        .method {
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            color: #fff;
            font-size: 13px;
        }

        .GET { background: #2563eb; }
        .POST { background: #16a34a; }
        .PUT { background: #d97706; }
        .DELETE { background: #dc2626; }

        .public {
            color: #16a34a;
            font-weight: bold;
        }

        .protected {
            color: #dc2626;
            font-weight: bold;
        }

        code {
            background: #f3f4f6;
            padding: 3px 6px;
            border-radius: 4px;
        }

        footer {
            margin-top: 50px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <script>alert('Allez sur la page //api-docs pour voir la documentation de l\'API si l\'API ne fonctionne pas correctement, utilsé directement les controleur.');</script>

<h1>📘 Documentation des API – Backend</h1>

<p>
    Cette page liste <strong>toutes les API disponibles</strong> pour le projet.<br>
    Elle est destinée à un usage rapide avec <strong>Postman</strong>.
</p>

<hr>

{{-- ================= ROUTES PUBLIQUES ================= --}}
<div class="section">
    <h2>🟢 A. Routes publiques <span class="public">(sans authentification)</span></h2>

    <h3>🔐 Authentification</h3>
    <table>
        <tr>
            <th>Méthode</th>
            <th>Endpoint</th>
            <th>Utilité</th>
        </tr>
        <tr>
            <td><span class="method POST">POST</span></td>
            <td><code>/api/register</code></td>
            <td>Inscription d’un nouvel utilisateur</td>
        </tr>
        <tr>
            <td><span class="method POST">POST</span></td>
            <td><code>/api/login</code></td>
            <td>Connexion et génération du token</td>
        </tr>
        <tr>
            <td><span class="method POST">POST</span></td>
            <td><code>/api/password-reset</code></td>
            <td>Demande de réinitialisation du mot de passe</td>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/email/verify/{token}</code></td>
            <td>Vérification de l’adresse email</td>
        </tr>
    </table>

    <h3>📂 Annuaire</h3>
    <table>
        <tr>
            <th>Méthode</th>
            <th>Endpoint</th>
            <th>Utilité</th>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/directory</code></td>
            <td>Liste générale des profils publics</td>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/directory/search</code></td>
            <td>Recherche avancée dans l’annuaire</td>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/directory/{id}</code></td>
            <td>Détails d’un profil spécifique</td>
        </tr>
    </table>

    <h3>📢 Annonces</h3>
    <table>
        <tr>
            <th>Méthode</th>
            <th>Endpoint</th>
            <th>Utilité</th>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/announcements</code></td>
            <td>Liste des annonces disponibles</td>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/announcements/{id}</code></td>
            <td>Détails d’une annonce</td>
        </tr>
    </table>

    <h3>📰 Actualités</h3>
    <table>
        <tr>
            <th>Méthode</th>
            <th>Endpoint</th>
            <th>Utilité</th>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/news</code></td>
            <td>Liste des actualités</td>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/news/{slug}</code></td>
            <td>Lecture d’une actualité</td>
        </tr>
    </table>
</div>

{{-- ================= ROUTES PROTÉGÉES ================= --}}
<div class="section">
    <h2>🔴 B. Routes protégées <span class="protected">(Token Bearer requis)</span></h2>

    <p>
        <strong>Header requis :</strong><br>
        <code>Authorization: Bearer VOTRE_TOKEN</code>
    </p>

    <h3>🔐 Authentification</h3>
    <table>
        <tr>
            <th>Méthode</th>
            <th>Endpoint</th>
            <th>Utilité</th>
        </tr>
        <tr>
            <td><span class="method POST">POST</span></td>
            <td><code>/api/logout</code></td>
            <td>Déconnexion (révocation du token)</td>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/user</code></td>
            <td>Récupérer l’utilisateur connecté</td>
        </tr>
    </table>

    <h3>👤 Profil utilisateur</h3>
    <table>
        <tr>
            <th>Méthode</th>
            <th>Endpoint</th>
            <th>Utilité</th>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/profile</code></td>
            <td>Afficher le profil</td>
        </tr>
        <tr>
            <td><span class="method PUT">PUT</span></td>
            <td><code>/api/profile</code></td>
            <td>Mettre à jour le profil</td>
        </tr>
        <tr>
            <td><span class="method DELETE">DELETE</span></td>
            <td><code>/api/profile</code></td>
            <td>Supprimer le compte utilisateur</td>
        </tr>
    </table>

    <h3>🎓 Formations & 💼 Expériences</h3>
    <table>
        <tr>
            <th>Méthode</th>
            <th>Endpoint</th>
            <th>Utilité</th>
        </tr>
        <tr>
            <td><span class="method POST">POST</span></td>
            <td><code>/api/profile/education</code></td>
            <td>Ajouter une formation académique</td>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/profile/education</code></td>
            <td>Liste des formations</td>
        </tr>
        <tr>
            <td><span class="method POST">POST</span></td>
            <td><code>/api/profile/experience</code></td>
            <td>Ajouter une expérience professionnelle</td>
        </tr>
        <tr>
            <td><span class="method GET">GET</span></td>
            <td><code>/api/profile/experience</code></td>
            <td>Liste des expériences</td>
        </tr>
    </table>
</div>

<footer>
    📌 Documentation interne – usage développeur / Postman
</footer>

</body>
</html>
