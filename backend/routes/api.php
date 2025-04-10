<?php

use App\Http\Controllers\AssignedTaskController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function(){
    // Task routes
    Route::get('/tasks', [TaskController::class, 'index']); // List all tasks
    Route::post('/tasks', [TaskController::class, 'store']); // Create a new task
    Route::get('/tasks/{id}', [TaskController::class, 'show']); // View a specific task
    Route::put('/tasks/{id}', [TaskController::class, 'update']); // Update a specific task
    Route::delete('/tasks/{id}', [TaskController::class, 'delete']); // Delete a specific task
});
