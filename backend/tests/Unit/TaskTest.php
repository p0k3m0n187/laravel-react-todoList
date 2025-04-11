<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function a_task_belongs_to_a_user()
    {
        $task = Task::factory()->create();

        $this->assertInstanceOf(User::class, $task->user);
        $this->assertEquals($task->user_id, $task->user->id);
    }
}
