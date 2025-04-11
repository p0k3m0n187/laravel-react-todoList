<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;
use App\Models\User;

class RateLimitTest extends TestCase
{
    /** @test */
    public function it_applies_api_rate_limiting()
    {
        // Create a user for authentication
        $user = User::factory()->create();  // Assuming you have a User factory

        // Simulate login with actingAs
        $this->actingAs($user);

        // Define IP and key for rate limiter
        $ip = '127.0.0.1';
        $key = 'api:' . $ip;

        // Simulate 61 requests to exceed the rate limit
        for ($i = 0; $i < 61; $i++) {
            $response = $this->withHeader('REMOTE_ADDR', $ip)
                             ->getJson('/api/tasks'); // Adjust to your actual API route
        }

        // Debug: Check the attempts before asserting
        dd(RateLimiter::attempts($key)); // Output the current number of attempts for the given key

        // Ensure the last request exceeds the rate limit
        $response->assertStatus(429); // Expect "Too Many Requests" status

        // Assert that the rate limiter has tracked too many attempts for the given IP
        $this->assertTrue(RateLimiter::tooManyAttempts($key, 60));

        // Optionally: Check the rate limiter's attempts (Optional)
        $this->assertEquals(61, RateLimiter::attempts($key));
    }
}
