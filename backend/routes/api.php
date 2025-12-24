<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserProfileController;
use App\Http\Controllers\API\ProfessionalProfileController;
use App\Http\Controllers\API\AnnouncementController;
use App\Http\Controllers\API\NewsController;
use App\Http\Controllers\API\DirectoryController;
use App\Http\Controllers\API\Admin\AdminUserController;
use App\Http\Controllers\API\Admin\AdminProfileValidationController;
use App\Http\Controllers\API\Admin\AdminCategoryController;
use App\Http\Controllers\API\Admin\AdminDashboardController;
use App\Http\Controllers\API\Admin\AdminExportController;

// Routes publiques
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
        Route::get('/education', [UserProfileController::class, 'getEducations']);
        Route::post('/education', [UserProfileController::class, 'addEducation']);
        Route::put('/education/{id}', [UserProfileController::class, 'updateEducation']);
        Route::delete('/education/{id}', [UserProfileController::class, 'deleteEducation']);

        // Expériences professionnelles
        Route::get('/experience', [UserProfileController::class, 'getExperiences']);
        Route::post('/experience', [UserProfileController::class, 'addExperience']);
        Route::put('/experience/{id}', [UserProfileController::class, 'updateExperience']);
        Route::delete('/experience/{id}', [UserProfileController::class, 'deleteExperience']);
    });

    // Profil professionnel
    Route::prefix('professional')->group(function () {
        Route::get('/status', [ProfessionalProfileController::class, 'getValidationStatus']);
        Route::get('/public-view', [ProfessionalProfileController::class, 'publicView']);
        Route::post('/upload-document', [ProfessionalProfileController::class, 'uploadDocument']);
        Route::post('/submit', [ProfessionalProfileController::class, 'submitForApproval']);
        Route::post('/', [ProfessionalProfileController::class, 'store']);
        Route::put('/{id}', [ProfessionalProfileController::class, 'store']);
    });

    // Newsletter
    Route::post('/newsletter/subscribe', [UserProfileController::class, 'subscribeNewsletter']);
    Route::post('/newsletter/unsubscribe', [UserProfileController::class, 'unsubscribeNewsletter']);

    // Annonces (version connectée avec filtrage)
    Route::get('/user/announcements', [AnnouncementController::class, 'index']);

    // Actualités (version connectée)
    Route::get('/user-news', [NewsController::class, 'userNews']);
});

// Routes Admin API
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // Dashboard & Statistiques
    Route::get('/dashboard', [AdminDashboardController::class, 'dashboard']);
    Route::get('/statistics', [AdminDashboardController::class, 'statistics']);

    // Gestion des utilisateurs (CRUD complet)
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::post('/users', [AdminUserController::class, 'store']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

    // Actions sur les utilisateurs
    Route::post('/users/{id}/activate', [AdminUserController::class, 'activate']);
    Route::post('/users/{id}/deactivate', [AdminUserController::class, 'deactivate']);
    Route::post('/users/{id}/suspend', [AdminUserController::class, 'suspend']);
    Route::post('/users/{id}/pending', [AdminUserController::class, 'setPending']);

    // Validation des profils
    Route::get('/profile-requests', [AdminProfileValidationController::class, 'pending']);
    Route::get('/profile-requests/{id}', [AdminProfileValidationController::class, 'show']);
    Route::post('/profile-requests/{id}/approve', [AdminProfileValidationController::class, 'approve']);
    Route::post('/profile-requests/{id}/reject', [AdminProfileValidationController::class, 'reject']);

    // Gestion des catégories
    Route::get('/categories', [AdminCategoryController::class, 'index']);
    Route::post('/categories', [AdminCategoryController::class, 'store']);
    Route::put('/categories/{category}', [AdminCategoryController::class, 'update']);
    Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy']);

    // Catégories professionnelles
    Route::post('/professional-categories', [AdminCategoryController::class, 'storeProfessional']);

    // Export
    Route::post('/export/users', [AdminExportController::class, 'exportUsers']);
});
