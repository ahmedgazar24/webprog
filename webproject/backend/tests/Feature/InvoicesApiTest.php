<?php

namespace Tests\Feature;

use Tests\TestCase;

class InvoicesApiTest extends TestCase
{
    /** @test */
    public function it_lists_invoices()
    {
        $response = $this->get('/api/invoices');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                ['id', 'studentId', 'studentName', 'amount', 'issuedAt', 'paid']
            ]
        ]);
    }

    /** @test */
    public function it_creates_invoice()
    {
        $payload = [
            'studentId' => 999,
            'studentName' => 'Test Student',
            'amount' => 1234.56,
        ];
        $response = $this->postJson('/api/invoices', $payload);
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => ['id', 'studentId', 'studentName', 'amount', 'issuedAt', 'paid', 'payments']
        ]);
        $this->assertEquals(false, $response->json('data.paid'));
    }

    /** @test */
    public function it_pays_invoice()
    {
        // create one first
        $create = $this->postJson('/api/invoices', [
            'studentId' => 100,
            'studentName' => 'Pay Student',
            'amount' => 2000,
        ]);
        $create->assertStatus(201);
        $id = $create->json('data.id');

        $pay = $this->postJson("/api/invoices/{$id}/pay", [ 'amount' => 2000 ]);
        $pay->assertStatus(200);
        $this->assertTrue($pay->json('data.paid'));
    }
}
