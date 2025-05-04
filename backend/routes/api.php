<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated Routes with Rate Limiting
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    // Task Routes
    // Route::get('/tasks', [TaskController::class, 'index']); // List all tasks
    Route::get('/my-tasks', [TaskController::class, 'myTasks']); // List created tasks
    // Route::get('/all-my-tasks', [TaskController::class, 'allAndMyTasks']); // List all tasks and created tasks
    Route::post('/tasks', [TaskController::class, 'store']); // Create a new task
    Route::get('/tasks/{id}', [TaskController::class, 'show']); // View a specific task
    Route::put('/tasks/{id}', [TaskController::class, 'update']); // Update a specific task
    Route::delete('/tasks/{id}', [TaskController::class, 'delete']); // Delete a specific task

    // User Routes
    Route::post('/logout', [AuthController::class, 'logout']); // Logout route
    Route::get('/me', [AuthController::class, 'me']); // Get authenticated user route
});
