<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserProfileController;
use App\Http\Controllers\API\ProfessionalProfileController;
use App\Http\Controllers\API\AnnouncementController;
use App\Http\Controllers\API\NewsController;
use App\Http\Controllers\API\DirectoryController;




// Public routes
Route::post('/register', [AuthController::class, 'register']);
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

// Routes admin 
// Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () { ... });
