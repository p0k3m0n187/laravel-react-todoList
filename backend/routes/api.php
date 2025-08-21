<?php

use App\Http\Controllers\AssignedTaskController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated Routes with Rate Limiting
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    // Task Routes
    // Route::get('/tasks', [TaskController::class, 'index']); // List all tasks
    Route::get('/my-tasks', [TaskController::class, 'myTasks']); // List created tasks
    Route::post('/tasks', [TaskController::class, 'store']); // Create a new task
    Route::get('/tasks/{id}', [TaskController::class, 'show']); // View a specific task
    Route::put('/tasks/{id}', [TaskController::class, 'update']); // Update a specific task
    Route::delete('/tasks/{id}', [TaskController::class, 'delete']); // Delete a specific task

    // Assigned Task Routes
    Route::get('/users', [UserController::class, 'index']); //list all users
    Route::get('/assigned-tasks', [AssignedTaskController::class, 'index']); // List all assigned tasks for user
    Route::post('/assigned-tasks', [AssignedTaskController::class, 'store']); // Assign a task to a user
    Route::get('/assigned-tasks/{id}', [AssignedTaskController::class, 'show']); // Show a specific assignment
    Route::delete('/assigned-tasks/{id}', [AssignedTaskController::class, 'destroy']); // Unassign a task
    Route::delete('/assigned-tasks/task/{taskId}', [AssignedTaskController::class, 'deleteByTask']); // Unassign all tasks by task ID

    // User Routes
    Route::post('/logout', [AuthController::class, 'logout']); // Logout route
    Route::get('/me', [AuthController::class, 'me']); // Get authenticated user route
});

