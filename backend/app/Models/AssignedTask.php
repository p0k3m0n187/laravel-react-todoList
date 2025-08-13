<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignedTask extends Model
{
    public $timestamps = false; // unless you add created_at/updated_at

    protected $table = 'assigned_tasks';

    protected $fillable = [
        'user_id',
        'task_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
