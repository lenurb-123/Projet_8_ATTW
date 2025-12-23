<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserProfileController;
use App\Http\Controllers\API\ProfessionalProfileController;
use App\Http\Controllers\API\AnnouncementController;
use App\Http\Controllers\API\NewsController;
use App\Http\Controllers\API\DirectoryController;



Route::get('/te', function () {
    return response()->json(['message' => 'API OK']);
});


// Public routes
// Au lieu de :

// Utilisez directement :
Route::post('/register', function(\Illuminate\Http\Request $request) {
    // Validation manuelle
    $validated = $request->validate([
        'first_name' => ['required', 'string', 'max:100'],
        'last_name' => ['required', 'string', 'max:100'],
        'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
        'password' => ['required', 'confirmed'],
        'birth_date' => ['required', 'date', 'before:today'],
        'gender' => ['required', 'in:male,female,other'],
        'phone' => ['required', 'string', 'max:20'],
        'address' => ['required', 'string', 'max:255'],
        'city' => ['required', 'string', 'max:100'],
        'country' => ['required', 'string', 'max:100'],
        'newsletter_subscribed' => ['boolean'],
    ]);
    
    // Création de l'utilisateur
    $user = \App\Models\User::create([
        'first_name' => $validated['first_name'],
        'last_name' => $validated['last_name'],
        'email' => $validated['email'],
        'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
        'birth_date' => $validated['birth_date'],
        'gender' => $validated['gender'],
        'phone' => $validated['phone'],
        'address' => $validated['address'],
        'city' => $validated['city'],
        'country' => $validated['country'],
        'newsletter_subscribed' => $validated['newsletter_subscribed'] ?? false,
    ]);
    
    $token = $user->createToken('auth_token')->plainTextToken;
    
    return response()->json([
        'message' => 'Inscription réussie',
        'user' => $user,
        'token' => $token
    ], 201);
});
Route::post('/login', [AuthController::class, 'login']);
Route::post('/password-reset', [AuthController::class, 'resetPassword']);
Route::get('/email/verify/{token}', [AuthController::class, 'verifyEmail'])->name('email.verify');

// Annuaire public
Route::get('/directory', [DirectoryController::class, 'index']);
Route::get('/directory/search', [DirectoryController::class, 'search']);
Route::get('/directory/{id}', [DirectoryController::class, 'show']);

// Annonces publiques
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/announcements/{id}', [AnnouncementController::class, 'show']);

// Actualités publiques
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{slug}', [NewsController::class, 'show']);

// Routes protégées (acteurs économiques)
Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Gestion du profil utilisateur
    Route::prefix('profile')->group(function () {
        Route::get('/', [UserProfileController::class, 'show']);
        Route::put('/', [UserProfileController::class, 'update']);
        Route::delete('/', [UserProfileController::class, 'deleteAccount']);
        
        // Formations académiques
        Route::post('/education', [UserProfileController::class, 'addEducation']);
        Route::get('/education', [UserProfileController::class, 'getEducations']); // Via show
        Route::put('/education/{id}', [UserProfileController::class, 'updateEducation']); // ça manque
        Route::delete('/education/{id}', [UserProfileController::class, 'deleteEducation']);// ça manque
        
        // Expériences professionnelles
        Route::post('/experience', [UserProfileController::class, 'addExperience']);
        Route::get('/experience', [UserProfileController::class, 'getExperiences']); // Via show
        Route::put('/experience/{id}', [UserProfileController::class, 'updateExperience']);// ça manque
        Route::delete('/experience/{id}', [UserProfileController::class, 'deleteExperience']);// ça manque
    });
    
    // Profil professionnel
    Route::prefix('professional')->group(function () {
        Route::post('/', [ProfessionalProfileController::class, 'store']);
        Route::put('/{id}', [ProfessionalProfileController::class, 'store']); // Même méthode pour update
        Route::post('/upload-document', [ProfessionalProfileController::class, 'uploadDocument']);
        Route::post('/submit', [ProfessionalProfileController::class, 'submitForApproval']);
        Route::get('/status', [ProfessionalProfileController::class, 'getValidationStatus']);
        Route::get('/public-view', [ProfessionalProfileController::class, 'publicView']);
    });
    
    // Newsletter
    Route::post('/newsletter/subscribe', [UserProfileController::class, 'subscribeNewsletter']);
    Route::post('/newsletter/unsubscribe', [UserProfileController::class, 'unsubscribeNewsletter']);
    
    // Annonces (version connectée avec filtrage)
    Route::get('/user/announcements', [AnnouncementController::class, 'index']);
    
    // Actualités (version connectée)
    Route::get('/user-news', [NewsController::class, 'userNews']);
});

// Routes admin (à séparer, gérées par l'autre groupe)
// Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () { ... });
