<?php

use App\Http\Controllers\EventsController;
use Illuminate\Support\Facades\Route;

Route::post('/token-transfer', [EventsController::class, 'tokenTransfer'])->middleware('auth:sanctum');
Route::post('/metadata-assigned', [EventsController::class, 'metadataAssigned'])->middleware('auth:sanctum');
