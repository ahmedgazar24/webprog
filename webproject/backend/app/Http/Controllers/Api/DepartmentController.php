<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    /**
     * Return demo department budgets
     */
    public function index(): JsonResponse
    {
        $departments = [
            [ 'id' => 1, 'name' => 'Computer Science', 'income' => 90000, 'expenses' => 55000 ],
            [ 'id' => 2, 'name' => 'Business', 'income' => 60000, 'expenses' => 42000 ],
            [ 'id' => 3, 'name' => 'Design', 'income' => 30000, 'expenses' => 18000 ],
        ];

        return response()->json([ 'data' => $departments ]);
    }
}
