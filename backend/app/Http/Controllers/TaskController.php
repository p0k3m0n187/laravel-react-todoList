<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    //
    public function index()
    {
        $task = Task::all();
        return response()->json($task);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed',
            'start_date' => 'nullable|date_format:Y-m-d H:i:s',
            'end_date' => 'nullable|date_format:Y-m-d H:i:s',
            'user_id' => 'required|exists:users,id',
        ]);

        $task = Task::create($validate);
        return response()->json($task, 201);
    }

    //shows specific task

    public function show($id)
    {
        $task = Task::findOrFail($id);
        return response()->json($task);
    }

    //updates specific task
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $validate = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'start_date' => 'sometimes|nullable|date',
            'end_date' => 'sometimes|nullable|date',
            'user_id' => 'sometimes|required|exists:users,id',
        ]);

        $task->update($validate);
        return response()->json($task);
    }

    //deletes specific task
    public function delete($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task Deleted Successfuly!']);
    }
}
