<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProfileValidationController;

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('admin.users');
    Route::post('/users/{id}/activate', [UserController::class, 'activate'])->name('admin.users.activate');
    Route::post('/users/{id}/deactivate', [UserController::class, 'deactivate'])->name('admin.users.deactivate');

    Route::get('/profile-requests', [ProfileValidationController::class,'index'])->name('admin.profile_requests');
    Route::post('/profile-requests/{id}/approve', [ProfileValidationController::class,'approve'])->name('admin.profile_requests.approve');
    Route::post('/profile-requests/{id}/reject', [ProfileValidationController::class,'reject'])->name('admin.profile_requests.reject');

});
