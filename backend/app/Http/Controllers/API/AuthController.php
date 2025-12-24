<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterUserRequest $request)
    {
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => User::ROLE_USER,
            'status' => User::STATUS_PENDING,
            'birth_date' => $request->birth_date,
            'gender' => $request->gender,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'country' => $request->country,
            'newsletter_subscribed' => $request->newsletter_subscribed ?? false,
        ]);

        $authToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie. Votre compte est en attente de validation.',
            'user' => $user,
            'token' => $authToken,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Identifiants incorrects.'
            ], 401);
        }

        $user = Auth::user();

        if ($user->isSuspended()) {
            Auth::logout();
            return response()->json([
                'message' => 'Votre compte a été suspendu.'
            ], 403);
        }

        if ($user->isPending()) {
            Auth::logout();
            return response()->json([
                'message' => 'Votre compte est en attente de validation par un administrateur.'
            ], 403);
        }

        if ($user->isInactive()) {
            Auth::logout();
            return response()->json([
                'message' => 'Votre compte est désactivé. Contactez l\'administrateur.'
            ], 403);
        }

        if (!$user->isActive()) {
            Auth::logout();
            return response()->json([
                'message' => 'Votre compte n\'est pas actif.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ]);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        $user->load(['professionalProfile', 'academicEducations', 'professionalExperiences']);

        return response()->json($user);
    }
}
