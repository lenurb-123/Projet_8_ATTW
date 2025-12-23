<?php

use Illuminate\Support\Facades\Route;


Route::view('/', 'index');
// Si vous voulez tester rapidement, gardez ceci :
Route::get('/test', function () {
    return view('welcome'); // Conservez pour les tests
});

Route::get('/api-docs', function () {
    return view('api-documentation');
});


