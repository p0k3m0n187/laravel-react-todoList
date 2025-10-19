<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    // Change this after you figure it out
    // // Shows task for a specific user
    public function myTasks()
    {
        $userId = Auth::id();

        $tasks = Task::where('user_id', $userId) // I created it
            ->orWhereHas('assigned_users', function ($query) use ($userId) {
                $query->where('user_id', $userId); // Or I was assigned
            })
            ->with('assigned_users') // load assigned users
            ->get();

        return response()->json($tasks);
    }

    // Shows task for a specific assigned user
    // public function assignedTasks()
    // {
    //     $userId = Auth::id(); // Get the authenticated user's ID
    //     $tasks = Task::with('assigned_users') // Eager load assigned users
    //         ->where('user_id', $userId)
    //         ->get();
    //     return response()->json($tasks); // Return tasks with assigned users as JSON
    // }

    public function assignedTasks()
    {
        $userId = Auth::id();

        $tasks = Task::whereHas('assigned_users', function ($query) use ($userId) {
            $query->where('user_id', $userId); // pivot column
        })
            ->with('assigned_users')
            ->get();

        return response()->json($tasks);
    }

    // Creates a new task
    public function store(Request $request)
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Validate the required fields
        $validate = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'start_date' => 'nullable|date_format:Y-m-d H:i:s', // Correct format
            'end_date' => 'nullable|date_format:Y-m-d H:i:s',   // Correct format
            'assigned_users' => 'array', // optional: assign users on create
            'assigned_users.*' => 'exists:users,id', // each must exist in users table
        ]);

        // Automatically assign the authenticated user's ID
        $validate['user_id'] = Auth::id();  // Get the user ID of the currently authenticated user

        // Create the task
        $task = Task::create($validate);

        // If assigned_users is provided, attach them
        if (!empty($request->assigned_users)) {
            $task->assigned_users()->attach($request->assigned_users);
        }

        return response()->json([
            'message' => 'Task created successfully!',
            'task' => $task->load('assigned_users')
        ], 201);
    }

    public function show($id)
    {
        $task = Task::with('assigned_users')->findOrFail($id);
        return response()->json($task);
    }

    // Updates a specific task
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validate = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'start_date' => 'nullable|date_format:Y-m-d H:i:s',
            'end_date' => 'nullable|date_format:Y-m-d H:i:s',
            'assigned_users' => 'array',
            'assigned_users.*' => 'exists:users,id',
        ]);

        $task->update($validate);

        // Sync assigned users if provided
        if ($request->has('assigned_users')) {
            $task->assigned_users()->sync($request->assigned_users);
        }

        return response()->json([
            'message' => 'Task updated successfully!',
            'task' => $task->load('assigned_users')
        ]);
    }

    // Deletes a specific task
    public function delete($id)
    {
        $task = Task::findOrFail($id);  // Find the task by ID, or fail with 404
        $task->delete();  // Delete the task

        return response()->json(['message' => 'Task Deleted Successfully!']);  // Success message
    }
}
