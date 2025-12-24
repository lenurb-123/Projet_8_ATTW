<?php
// api_tester.php - Dashboard de test API
session_start();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧪 Testeur API - Plateforme Communautaire</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; color: #333; }

        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }

        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 0; border-radius: 10px; margin-bottom: 30px; text-align: center; }
        h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .subtitle { font-size: 1.2rem; opacity: 0.9; }

        .token-section { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .token-input { width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px; font-family: monospace; margin: 10px 0; }
        .btn { background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 1rem; transition: background 0.3s; }
        .btn:hover { background: #5a67d8; }
        .btn-success { background: #48bb78; }
        .btn-danger { background: #f56565; }

        .tests-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
        .test-card { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .test-card h3 { color: #667eea; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0; }

        .test-form { margin: 15px 0; }
        .test-result { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 5px; padding: 15px; margin-top: 15px; max-height: 300px; overflow-y: auto; font-family: monospace; font-size: 0.9rem; }

        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; margin-left: 10px; }
        .status-success { background: #c6f6d5; color: #22543d; }
        .status-error { background: #fed7d7; color: #742a2a; }

        .response-item { margin: 5px 0; padding: 5px; border-left: 3px solid #667eea; }
        .loading { color: #a0aec0; font-style: italic; }

        footer { text-align: center; margin-top: 40px; color: #718096; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🧪 Testeur API - Plateforme Communautaire</h1>
            <p class="subtitle">Backend Laravel • Projet 8 • Interface de test complète</p>
        </header>

        <?php
        // ========== FONCTIONS UTILITAIRES ==========
        function sendApiRequest($method, $endpoint, $data = [], $token = null) {
            $url = 'http://localhost:8000/api' . $endpoint;

            $ch = curl_init($url);
            $headers = ['Content-Type: application/json'];

            if ($token) {
                $headers[] = 'Authorization: Bearer ' . $token;
            }

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);

            if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            }

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            curl_close($ch);

            return [
                'code' => $httpCode,
                'response' => json_decode($response, true) ?? $response,
                'raw' => $response
            ];
        }

        // ========== TRAITEMENT DES FORMULAIRES ==========
        $currentToken = $_SESSION['api_token'] ?? '';
        $testResults = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (isset($_POST['action'])) {
                switch ($_POST['action']) {
                    case 'login_admin':
                        $result = sendApiRequest('POST', '/login', [
                            'email' => 'admin@test.com',
                            'password' => 'password123'
                        ]);

                        if ($result['code'] === 200 && isset($result['response']['token'])) {
                            $_SESSION['api_token'] = $result['response']['token'];
                            $currentToken = $result['response']['token'];
                            $testResults['login'] = ['success' => true, 'data' => $result];
                        } else {
                            $testResults['login'] = ['success' => false, 'data' => $result];
                        }
                        break;

                    case 'login_user':
                        $result = sendApiRequest('POST', '/login', [
                            'email' => 'user@test.com',
                            'password' => 'password123'
                        ]);
                        $testResults['login_user'] = ['success' => $result['code'] === 200, 'data' => $result];
                        break;

                    case 'dashboard':
                        if ($currentToken) {
                            $result = sendApiRequest('GET', '/admin/dashboard', [], $currentToken);
                            $testResults['dashboard'] = ['success' => $result['code'] === 200, 'data' => $result];
                        }
                        break;

                    case 'users_list':
                        if ($currentToken) {
                            $result = sendApiRequest('GET', '/admin/users', [], $currentToken);
                            $testResults['users'] = ['success' => $result['code'] === 200, 'data' => $result];
                        }
                        break;

                    case 'profile_requests':
                        if ($currentToken) {
                            $result = sendApiRequest('GET', '/admin/profile-requests', [], $currentToken);
                            $testResults['profile_requests'] = ['success' => $result['code'] === 200, 'data' => $result];
                        }
                        break;

                    case 'public_directory':
                        $result = sendApiRequest('GET', '/directory');
                        $testResults['directory'] = ['success' => $result['code'] === 200, 'data' => $result];
                        break;

                    case 'public_news':
                        $result = sendApiRequest('GET', '/news');
                        $testResults['news'] = ['success' => $result['code'] === 200, 'data' => $result];
                        break;

                    case 'create_user':
                        if ($currentToken) {
                            $email = 'test_' . time() . '@example.com';
                            $result = sendApiRequest('POST', '/admin/users', [
                                'first_name' => 'Test',
                                'last_name' => 'User',
                                'email' => $email,
                                'password' => 'Password123',
                                'role' => 'user',
                                'status' => 'active',
                                'city' => 'Testville'
                            ], $currentToken);
                            $testResults['create_user'] = ['success' => $result['code'] === 201, 'data' => $result];
                        }
                        break;

                    case 'logout':
                        session_destroy();
                        $currentToken = '';
                        break;
                }
            }
        }
        ?>

        <!-- ========== SECTION TOKEN ========== -->
        <div class="token-section">
            <h3>🔑 Token d'authentification</h3>
            <input type="text" class="token-input" value="<?php echo htmlspecialchars($currentToken); ?>" readonly
                   placeholder="Token sera affiché ici après login...">

            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <form method="POST">
                    <button type="submit" name="action" value="login_admin" class="btn">🔐 Login Admin</button>
                </form>

                <form method="POST">
                    <button type="submit" name="action" value="login_user" class="btn">👤 Login User</button>
                </form>

                <?php if ($currentToken): ?>
                <form method="POST">
                    <button type="submit" name="action" value="logout" class="btn btn-danger">🚪 Logout</button>
                </form>
                <?php endif; ?>
            </div>

            <?php if (isset($testResults['login'])): ?>
                <div class="test-result">
                    <strong>Login Admin:</strong>
                    <span class="status-badge <?php echo $testResults['login']['success'] ? 'status-success' : 'status-error'; ?>">
                        <?php echo $testResults['login']['success'] ? 'SUCCESS' : 'ERROR'; ?>
                    </span>
                    <pre><?php echo json_encode($testResults['login']['data'], JSON_PRETTY_PRINT); ?></pre>
                </div>
            <?php endif; ?>
        </div>

        <!-- ========== TESTS PUBLICS ========== -->
        <h2 style="margin: 30px 0 20px 0;">🌐 Tests API Publiques</h2>
        <div class="tests-grid">
            <div class="test-card">
                <h3>📇 Annuaire Public</h3>
                <p>Teste l'API directory publique</p>
                <form method="POST" class="test-form">
                    <button type="submit" name="action" value="public_directory" class="btn">📡 Tester /directory</button>
                </form>
                <?php if (isset($testResults['directory'])): ?>
                    <div class="test-result">
                        <span class="status-badge <?php echo $testResults['directory']['success'] ? 'status-success' : 'status-error'; ?>">
                            HTTP <?php echo $testResults['directory']['data']['code']; ?>
                        </span>
                        <pre><?php echo json_encode($testResults['directory']['data']['response'], JSON_PRETTY_PRINT); ?></pre>
                    </div>
                <?php endif; ?>
            </div>

            <div class="test-card">
                <h3>📰 Actualités</h3>
                <p>Teste l'API news publique</p>
                <form method="POST" class="test-form">
                    <button type="submit" name="action" value="public_news" class="btn">📰 Tester /news</button>
                </form>
                <?php if (isset($testResults['news'])): ?>
                    <div class="test-result">
                        <span class="status-badge <?php echo $testResults['news']['success'] ? 'status-success' : 'status-error'; ?>">
                            HTTP <?php echo $testResults['news']['data']['code']; ?>
                        </span>
                        <pre><?php echo json_encode($testResults['news']['data']['response'], JSON_PRETTY_PRINT); ?></pre>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- ========== TESTS ADMIN ========== -->
        <?php if ($currentToken): ?>
        <h2 style="margin: 30px 0 20px 0;">👑 Tests API Admin</h2>
        <div class="tests-grid">
            <div class="test-card">
                <h3>📊 Dashboard</h3>
                <p>Statistiques administrateur</p>
                <form method="POST" class="test-form">
                    <button type="submit" name="action" value="dashboard" class="btn">📈 Tester /admin/dashboard</button>
                </form>
                <?php if (isset($testResults['dashboard'])): ?>
                    <div class="test-result">
                        <span class="status-badge <?php echo $testResults['dashboard']['success'] ? 'status-success' : 'status-error'; ?>">
                            HTTP <?php echo $testResults['dashboard']['data']['code']; ?>
                        </span>
                        <pre><?php echo json_encode($testResults['dashboard']['data']['response'], JSON_PRETTY_PRINT); ?></pre>
                    </div>
                <?php endif; ?>
            </div>

            <div class="test-card">
                <h3>👥 Utilisateurs</h3>
                <p>Liste tous les utilisateurs</p>
                <form method="POST" class="test-form">
                    <button type="submit" name="action" value="users_list" class="btn">👥 Tester /admin/users</button>
                </form>
                <?php if (isset($testResults['users'])): ?>
                    <div class="test-result">
                        <span class="status-badge <?php echo $testResults['users']['success'] ? 'status-success' : 'status-error'; ?>">
                            HTTP <?php echo $testResults['users']['data']['code']; ?>
                        </span>
                        <pre><?php echo json_encode($testResults['users']['data']['response'], JSON_PRETTY_PRINT); ?></pre>
                    </div>
                <?php endif; ?>
            </div>

            <div class="test-card">
                <h3>✅ Validation Profils</h3>
                <p>Demandes de validation en attente</p>
                <form method="POST" class="test-form">
                    <button type="submit" name="action" value="profile_requests" class="btn">✅ Tester /admin/profile-requests</button>
                </form>
                <?php if (isset($testResults['profile_requests'])): ?>
                    <div class="test-result">
                        <span class="status-badge <?php echo $testResults['profile_requests']['success'] ? 'status-success' : 'status-error'; ?>">
                            HTTP <?php echo $testResults['profile_requests']['data']['code']; ?>
                        </span>
                        <pre><?php echo json_encode($testResults['profile_requests']['data']['response'], JSON_PRETTY_PRINT); ?></pre>
                    </div>
                <?php endif; ?>
            </div>

            <div class="test-card">
                <h3>➕ Créer Utilisateur</h3>
                <p>Créer un nouvel utilisateur (Admin)</p>
                <form method="POST" class="test-form">
                    <button type="submit" name="action" value="create_user" class="btn btn-success">➕ Créer User</button>
                </form>
                <?php if (isset($testResults['create_user'])): ?>
                    <div class="test-result">
                        <span class="status-badge <?php echo $testResults['create_user']['success'] ? 'status-success' : 'status-error'; ?>">
                            HTTP <?php echo $testResults['create_user']['data']['code']; ?>
                        </span>
                        <pre><?php echo json_encode($testResults['create_user']['data']['response'], JSON_PRETTY_PRINT); ?></pre>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <?php else: ?>
        <div style="text-align: center; padding: 40px; background: white; border-radius: 10px; margin: 30px 0;">
            <h3 style="color: #a0aec0;">🔒 Connectez-vous en tant qu'admin pour tester les APIs protégées</h3>
            <p style="margin-top: 10px;">Cliquez sur "Login Admin" en haut pour obtenir un token</p>
        </div>
        <?php endif; ?>

        <footer>
            <p>🧪 Testeur API - Backend Laravel Projet 8 | Développé pour la plateforme communautaire</p>
            <p>Token actif: <?php echo $currentToken ? '✅ Oui' : '❌ Non'; ?> |
               Serveur: <span style="color: <?php echo @fsockopen('localhost', 8000) ? '#48bb78' : '#f56565'; ?>">
               <?php echo @fsockopen('localhost', 8000) ? 'localhost:8000 ✅' : 'localhost:8000 ❌'; ?>
               </span>
            </p>
        </footer>
    </div>

    <script>
        // Auto-scroll vers les nouveaux résultats
        document.addEventListener('DOMContentLoaded', function() {
            const results = document.querySelectorAll('.test-result');
            if (results.length > 0) {
                results[results.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    </script>
</body>
</html>
