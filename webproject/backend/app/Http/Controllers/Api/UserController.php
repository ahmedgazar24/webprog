<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Demo register endpoint: echoes back created user
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,accounting,student,staff',
        ]);

        $user = [
            'id' => now()->timestamp,
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
        ];

        return response()->json([ 'message' => 'Registration successful', 'data' => $user ], 201);
    }

    /**
     * Demo login: accepts email/password and returns token
     */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $token = base64_encode($data['email'].'_'.now()->timestamp.'_'.mt_rand());
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [ 'email' => $data['email'] ],
        ]);
    }
}
