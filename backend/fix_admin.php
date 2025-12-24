<?php
// test_direct.php - Test DIRECT sans HTTP
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "========================================\n";
echo "🧪 TEST DIRECT BACKEND LARAVEL\n";
echo "========================================\n\n";

// 1. Test connexion DB
echo "1. 📊 Test Base de données...\n";
try {
    DB::connection()->getPdo();
    echo "   ✅ DB connectée\n";
} catch (Exception $e) {
    echo "   ❌ DB erreur: " . $e->getMessage() . "\n";
    exit;
}

// 2. Vérifier/Créer Admin
echo "\n2. 👑 Vérification Admin...\n";
$admin = User::where('email', 'admin@test.com')->first();

if (!$admin) {
    $admin = User::create([
        'first_name' => 'Admin',
        'last_name' => 'System',
        'email' => 'admin@test.com',
        'password' => Hash::make('password123'),
        'role' => 'admin',
        'status' => 'active',
        'city' => 'Test City'
    ]);
    echo "   ✅ Admin créé: admin@test.com / password123\n";
} else {
    echo "   ℹ️  Admin existe déjà\n";

    // Vérifier/corriger
    $corrections = [];
    if ($admin->status !== 'active') {
        $admin->status = 'active';
        $corrections[] = "status → active";
    }
    if ($admin->role !== 'admin') {
        $admin->role = 'admin';
        $corrections[] = "role → admin";
    }
    if (!Hash::check('password123', $admin->password)) {
        $admin->password = Hash::make('password123');
        $corrections[] = "password reset";
    }

    if (!empty($corrections)) {
        $admin->save();
        echo "   ⚠️  Corrections: " . implode(', ', $corrections) . "\n";
    }
}

// 3. Vérifier le login DIRECTEMENT (sans API)
echo "\n3. 🔐 Test Login DIRECT...\n";
$credentials = ['email' => 'admin@test.com', 'password' => 'password123'];

$user = User::where('email', $credentials['email'])->first();

if (!$user) {
    echo "   ❌ Utilisateur non trouvé\n";
} elseif (!Hash::check($credentials['password'], $user->password)) {
    echo "   ❌ Mot de passe incorrect\n";
    echo "   Hash DB: " . substr($user->password, 0, 30) . "...\n";
    echo "   Hash 'password123': " . Hash::make('password123') . "\n";
} elseif ($user->status !== 'active') {
    echo "   ❌ Compte non actif (status: {$user->status})\n";
} else {
    echo "   ✅ Login DIRECT réussi!\n";
    echo "   - Email: {$user->email}\n";
    echo "   - Rôle: {$user->role}\n";
    echo "   - Statut: {$user->status}\n";

    // Générer un token Sanctum
    $token = $user->createToken('test-token')->plainTextToken;
    echo "   - Token: " . substr($token, 0, 30) . "...\n";

    // Sauvegarder pour les tests API
    file_put_contents('test_token.txt', $token);
}

// 4. Statistiques
echo "\n4. 📈 Statistiques...\n";
$totalUsers = User::count();
$activeUsers = User::where('status', 'active')->count();
$adminUsers = User::where('role', 'admin')->where('status', 'active')->count();
$pendingUsers = User::where('status', 'pending')->count();

echo "   👥 Total utilisateurs: $totalUsers\n";
echo "   ✅ Actifs: $activeUsers\n";
echo "   👑 Admins: $adminUsers\n";
echo "   ⏳ En attente: $pendingUsers\n";

// 5. Tester AuthController DIRECTEMENT
echo "\n5. 🧪 Test AuthController...\n";
try {
    $authController = new \App\Http\Controllers\API\AuthController;

    // Créer une requête factice
    $request = new \Illuminate\Http\Request();
    $request->merge([
        'email' => 'admin@test.com',
        'password' => 'password123'
    ]);

    // Appeler directement la méthode
    $response = $authController->login($request);
    $responseData = $response->getData(true);

    echo "   ✅ AuthController.login() réussi!\n";
    echo "   - Message: " . ($responseData['message'] ?? 'N/A') . "\n";
    echo "   - Token présent: " . (isset($responseData['token']) ? '✅ Oui' : '❌ Non') . "\n";

} catch (Exception $e) {
    echo "   ❌ AuthController erreur: " . $e->getMessage() . "\n";
    echo "   Stack: " . $e->getTraceAsString() . "\n";
}

// 6. Tester AdminUserController
echo "\n6. 🧪 Test AdminUserController...\n";
if (isset($user) && $user->role === 'admin') {
    try {
        $adminController = new \App\Http\Controllers\API\Admin\AdminUserController;

        // Créer un utilisateur de test
        $testEmail = 'test_' . time() . '@example.com';
        $createRequest = new \Illuminate\Http\Request();
        $createRequest->merge([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => $testEmail,
            'password' => 'Test123',
            'role' => 'user',
            'status' => 'active',
            'city' => 'Test City'
        ]);

        // Simuler l'authentification
        auth()->setUser($user);

        $createResponse = $adminController->store($createRequest);
        $createData = $createResponse->getData(true);

        echo "   ✅ AdminUserController.store() réussi!\n";
        echo "   - Utilisateur créé: $testEmail\n";

    } catch (Exception $e) {
        echo "   ❌ AdminUserController erreur: " . $e->getMessage() . "\n";
    }
} else {
    echo "   ℹ️  Skip (admin requis)\n";
}

echo "\n========================================\n";
echo "🎯 TESTS TERMINÉS\n";
echo "========================================\n";

// Instructions pour tester l'API
echo "\n🎯 POUR TESTER L'API HTTP :\n";
echo "1. Lance le serveur: php artisan serve --port=8000\n";
echo "2. Dans un autre terminal, teste:\n";
echo "   curl -X POST http://localhost:8000/api/login \\\n";
echo "     -H \"Content-Type: application/json\" \\\n";
echo "     -d '{\"email\":\"admin@test.com\",\"password\":\"password123\"}'\n";

// Générer un script de test automatique
echo "\n📁 Génération script test_api.bat...\n";
$batContent = '@echo off
echo === TEST API AVEC CURL ===
echo.

echo 1. Test login admin...
curl -X POST http://localhost:8000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@test.com\",\"password\":\"password123\"}"
echo.

echo 2. Test directory public...
curl http://localhost:8000/api/directory
echo.

pause';

file_put_contents('test_api.bat', $batContent);
echo "✅ Script créé: test_api.bat\n";
echo "   Exécute-le APRÈS avoir lancé: php artisan serve\n";
