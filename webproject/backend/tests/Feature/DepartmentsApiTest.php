<?php

namespace Tests\Feature;

use Tests\TestCase;

class DepartmentsApiTest extends TestCase
{
    /** @test */
    public function it_returns_departments_list()
    {
        $response = $this->get('/api/departments');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                ['id', 'name', 'income', 'expenses']
            ]
        ]);
        $data = $response->json('data');
        $this->assertIsArray($data);
        $this->assertNotEmpty($data);
    }
}
