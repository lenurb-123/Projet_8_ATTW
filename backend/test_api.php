<?php
// test_final.php - Test ultra simple SANS HTTP
echo "========================================\n";
echo "🧪 TEST BACKEND DIRECT (SANS HTTP)\n";
echo "========================================\n\n";

// 1. Initialiser Laravel
echo "1. 🔧 Initialisation Laravel...\n";
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
try {
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    echo "   ✅ Laravel initialisé\n";
} catch (Exception $e) {
    echo "   ❌ Erreur Laravel: " . $e->getMessage() . "\n";
    exit;
}

// 2. Tester la DB
echo "\n2. 📊 Test Base de données...\n";
try {
    \Illuminate\Support\Facades\DB::connection()->getPdo();
    echo "   ✅ DB connectée\n";
} catch (Exception $e) {
    echo "   ❌ DB erreur: " . $e->getMessage() . "\n";
}

// 3. Vérifier l'admin DIRECTEMENT
echo "\n3. 👑 Vérification Admin (directe)...\n";
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$admin = User::where('email', 'admin@test.com')->first();

if (!$admin) {
    echo "   ❌ Admin NON trouvé en base\n";
    echo "   Création de l'admin...\n";

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
    echo "   ✅ Admin TROUVÉ\n";
    echo "   - Email: " . $admin->email . "\n";
    echo "   - Rôle: " . $admin->role . "\n";
    echo "   - Statut: " . $admin->status . "\n";

    // Vérifier le mot de passe
    if (Hash::check('password123', $admin->password)) {
        echo "   ✅ Mot de passe 'password123' VALIDE\n";
    } else {
        echo "   ❌ Mot de passe 'password123' INVALIDE\n";
        echo "   Hash DB: " . substr($admin->password, 0, 30) . "...\n";
        echo "   Correction...\n";
        $admin->password = Hash::make('password123');
        $admin->save();
        echo "   ✅ Mot de passe corrigé\n";
    }
}

// 4. Tester AuthController DIRECTEMENT
echo "\n4. 🧪 Test AuthController.login()...\n";
try {
    // Créer une requête simulée
    $request = new \Illuminate\Http\Request();
    $request->merge([
        'email' => 'admin@test.com',
        'password' => 'password123'
    ]);

    // Appeler DIRECTEMENT le contrôleur
    $controller = new \App\Http\Controllers\API\AuthController();
    $response = $controller->login($request);
    $data = $response->getData(true);

    echo "   ✅ AuthController.login() RÉUSSI!\n";
    echo "   - Message: " . ($data['message'] ?? 'N/A') . "\n";

    if (isset($data['token'])) {
        echo "   - Token reçu: " . substr($data['token'], 0, 30) . "...\n";
        file_put_contents('token_test.txt', $data['token']);
        echo "   - Token sauvegardé dans token_test.txt\n";
    }

} catch (Exception $e) {
    echo "   ❌ AuthController ERREUR:\n";
    echo "   " . $e->getMessage() . "\n";
}

// 5. Statistiques simples
echo "\n5. 📈 Statistiques utilisateurs...\n";
$stats = [
    'total' => User::count(),
    'actifs' => User::where('status', 'active')->count(),
    'admins' => User::where('role', 'admin')->count(),
    'en_attente' => User::where('status', 'pending')->count()
];

echo "   👥 Total: " . $stats['total'] . "\n";
echo "   ✅ Actifs: " . $stats['actifs'] . "\n";
echo "   👑 Admins: " . $stats['admins'] . "\n";
echo "   ⏳ En attente: " . $stats['en_attente'] . "\n";

echo "\n========================================\n";
echo "🎯 TEST DIRECT TERMINÉ\n";
echo "========================================\n";

// Instructions pour le test HTTP
echo "\n🎯 POUR TESTER L'API HTTP:\n";
echo "1. Ouvre un TERMINAL et lance:\n";
echo "   php artisan serve --port=8000\n\n";
echo "2. Ouvre un AUTRE TERMINAL et teste:\n";
echo "   curl -X POST http://localhost:8000/api/login \\\n";
echo "     -H \"Content-Type: application/json\" \\\n";
echo "     -d '{\"email\":\"admin@test.com\",\"password\":\"password123\"}'\n\n";
echo "3. Si curl ne marche pas sur Windows, utilise PowerShell:\n";
echo "   Invoke-RestMethod -Uri \"http://localhost:8000/api/login\" \\\n";
echo "     -Method Post \\\n";
echo "     -Headers @{\"Content-Type\"=\"application/json\"} \\\n";
echo "     -Body '{\"email\":\"admin@test.com\",\"password\":\"password123\"}'\n";
