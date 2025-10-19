<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AssignedTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssignedTaskController extends Controller
{
    //shows all assigned tasks for the authenticated user
    public function index()
    {
        // Get the authenticated user's ID
        $userId = Auth::id();

        // Fetch all assigned tasks for the authenticated user
        $assignedTasks = AssignedTask::where('user_id', $userId)->get();

        // Return the assigned tasks as JSON
        return response()->json($assignedTasks);
    }

    // Assigns a task to a user
    public function store(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'task_id' => 'required|exists:tasks,id',
        ]);

        $assignedTasks = [];
        foreach ($request->user_ids as $userId) {
            $assignedTasks[] = AssignedTask::create([
                'user_id' => $userId,
                'task_id' => $request->task_id,
            ]);
        }

        return response()->json(['message' => 'Users assigned successfully!', 'assignedTasks' => $assignedTasks], 201);// Return the created assigned task with a 201 status
    }

    // Unassigns (delete) a task from a user
    public function destroy($id)
    {
        $assignedTask = AssignedTask::findOrFail($id); // Find the assigned task by ID, or fail with 404
        $assignedTask->delete(); // Delete the assigned task

        return response()->json(['message' => 'Assigned task deleted successfully'], 200); // Return success message
    }

    // Show a specific assigned task
    public function show($id)
    {
        $assignedTask = AssignedTask::findOrFail($id); // Find the assigned task by ID, or fail with 404
        return response()->json($assignedTask); // Return the assigned task as JSON
    }

    // Unassign all tasks by task ID
    public function deleteByTask($taskId)
    {
        AssignedTask::where('task_id', $taskId)->delete();
        return response()->json(['message' => 'All assignments for this task deleted']);
    }
}
