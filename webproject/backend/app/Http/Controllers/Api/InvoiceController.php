<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    private static array $invoices = [
        [ 'id' => 1, 'studentId' => 101, 'studentName' => 'Ali Ahmed', 'amount' => 10000, 'issuedAt' => null, 'paid' => false, 'payments' => [] ],
        [ 'id' => 2, 'studentId' => 102, 'studentName' => 'Mona Saleh', 'amount' => 12000, 'issuedAt' => null, 'paid' => true, 'payments' => [ [ 'date' => null, 'amount' => 12000 ] ] ],
    ];
    private static int $nextId = 3;

    public function __construct()
    {
        // initialize ISO dates on first access
        foreach (self::$invoices as &$inv) {
            if ($inv['issuedAt'] === null) {
                $inv['issuedAt'] = now()->toIso8601String();
            }
            if (!empty($inv['payments'])) {
                foreach ($inv['payments'] as &$p) {
                    if ($p['date'] === null) {
                        $p['date'] = now()->toIso8601String();
                    }
                }
            }
        }
    }

    /**
     * List invoices
     */
    public function index(): JsonResponse
    {
        return response()->json([ 'data' => array_values(self::$invoices) ]);
    }

    /**
     * Create invoice
     */
    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'studentId' => 'required|integer',
            'studentName' => 'required|string',
            'amount' => 'required|numeric|min:0',
        ]);

        $inv = [
            'id' => self::$nextId++,
            'studentId' => $payload['studentId'],
            'studentName' => $payload['studentName'],
            'amount' => $payload['amount'],
            'issuedAt' => now()->toIso8601String(),
            'paid' => false,
            'payments' => [],
        ];
        self::$invoices[] = $inv;

        return response()->json([ 'data' => $inv ], 201);
    }

    /**
     * Pay invoice
     */
    public function pay(int $id, Request $request): JsonResponse
    {
        $amount = $request->input('amount');
        if ($amount !== null) {
            $request->validate(['amount' => 'numeric|min:0']);
        }

        foreach (self::$invoices as &$inv) {
            if ($inv['id'] === $id) {
                $payAmt = $amount ?? $inv['amount'];
                $inv['payments'][] = [ 'date' => now()->toIso8601String(), 'amount' => $payAmt ];
                $paidTotal = 0;
                foreach ($inv['payments'] as $p) { $paidTotal += $p['amount']; }
                $inv['paid'] = $paidTotal >= $inv['amount'];
                return response()->json([ 'data' => $inv ]);
            }
        }
        return response()->json([ 'message' => 'Invoice not found' ], 404);
    }
}
