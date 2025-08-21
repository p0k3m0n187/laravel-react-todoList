<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $table = 'tasks';

    protected $fillable = [
        'title',
        'description',
        'status',
        'start_date',
        'end_date',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assigned_users()
    {
        return $this->belongsToMany(User::class, 'assigned_tasks', 'task_id', 'user_id');
    }
}
