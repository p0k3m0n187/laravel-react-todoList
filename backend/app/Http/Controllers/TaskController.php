<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    // // Shows all tasks
    // public function index()
    // {
    //     $tasks = Task::all();  // Fetch all tasks (corrected variable name to 'tasks')
    //     return response()->json($tasks);  // Return tasks as JSON
    // }

    // Shows task for a specific user
    public function myTasks(){
        $userId = Auth::id(); // Get the authenticated user's ID
        $tasks = Task::where('user_id', $userId)->get(); // Fetch tasks for the authenticated user
        return response()->json($tasks); // Return tasks as JSON
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
        ]);

        // Automatically assign the authenticated user's ID
        $validate['user_id'] = Auth::id();  // Get the user ID of the currently authenticated user

        // Create the task
        $task = Task::create($validate);

        return response()->json($task, 201);  // Return the created task with a 201 status
    }

    // Shows a specific task
    public function show($id)
    {
        $task = Task::findOrFail($id);  // Find the task by ID, or fail with 404
        return response()->json($task);  // Return the task as JSON
    }

    // Updates a specific task
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);  // Find the task by ID, or fail with 404

        // Validate input fields (marking user_id as optional in case it's not being updated)
        $validate = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'start_date' => 'nullable|date_format:Y-m-d\TH:i', // Allow the datetime-local format
            'end_date' => 'nullable|date_format:Y-m-d\TH:i',   // Allow the datetime-local format
        ]);

        // Update the task with validated data
        $task->update($validate);

        return response()->json($task);  // Return updated task as JSON
    }

    // Deletes a specific task
    public function delete($id)
    {
        $task = Task::findOrFail($id);  // Find the task by ID, or fail with 404
        $task->delete();  // Delete the task

        return response()->json(['message' => 'Task Deleted Successfully!']);  // Success message
    }
}
