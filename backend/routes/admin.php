<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProfileValidationController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ExportController;
use App\Http\Controllers\Admin\StatisticsController;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
    Route::post('/users/{id}/activate', [UserController::class, 'activate'])->name('users.activate');
    Route::post('/users/{id}/deactivate', [UserController::class, 'deactivate'])->name('users.deactivate');

    Route::get('/profile-requests', [ProfileValidationController::class, 'index'])->name('profile_requests');
    Route::get('/profile-requests/{id}', [ProfileValidationController::class, 'show'])->name('profile_requests.show');
    Route::post('/profile-requests/{id}/approve', [ProfileValidationController::class, 'approve'])->name('profile_requests.approve');
    Route::post('/profile-requests/{id}/reject', [ProfileValidationController::class, 'reject'])->name('profile_requests.reject');

    Route::resource('categories', CategoryController::class)->except(['show']);

    Route::prefix('exports')->name('exports.')->group(function () {
        Route::get('/csv', [ExportController::class, 'csv'])->name('csv');
        Route::get('/pdf', [ExportController::class, 'pdf'])->name('pdf');
        Route::get('/json', [ExportController::class, 'json'])->name('json');
    });

    Route::get('/statistics', [DashboardController::class, 'statistics'])->name('statistics');

});
