<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RankingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('ranking', [RankingController::class, 'index'])->name('ranking');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
