<?php

namespace App\Http\Controllers;

use App\Models\AssignedTask;
use Illuminate\Http\Request;

class AssignedTaskController extends Controller
{
    // Displays all assigned tasks
    public function index()
    {
        $assignedTasks = AssignedTask::with(['task', 'user'])->get();
        return response()->json($assignedTasks);
    }

    // Assigns a user to a task
    public function create(Request $request)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $assignedTask = AssignedTask::create($validated);

        return response()->json([
            'message' => 'User successfully assigned to the task.',
            'assignedTask' => $assignedTask,
        ], 201);
    }
}