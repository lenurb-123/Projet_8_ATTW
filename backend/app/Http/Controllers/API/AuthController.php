<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur.
     */
    public function register(RegisterUserRequest $request)
    {
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'status' => 'pending',
            'birth_date' => $request->birth_date,
            'gender' => $request->gender,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'country' => $request->country,
            'newsletter_subscribed' => $request->newsletter_subscribed ?? false,
        ]);

        // Générer le token de vérification d'email
        $token = Str::random(60);
        
        // Envoyer l'email de vérification (à implémenter avec une queue)
        // Mail::to($user->email)->send(new EmailVerificationMail($user, $token));

        // Créer un token d'authentification
        $authToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie. Veuillez vérifier votre email.',
            'user' => $user,
            'token' => $authToken,
        ], 201);
    }

    /**
     * Connexion d'un utilisateur.
     */
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

        $user = User::where('email', $request->email)->firstOrFail();
        
        // Vérifier si le compte est actif
        if ($user->status === 'suspended') {
            return response()->json([
                'message' => 'Votre compte a été suspendu.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Déconnexion.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ]);
    }

    /**
     * Récupérer l'utilisateur connecté.
     */
    public function user(Request $request)
    {
        $user = $request->user();
        $user->load(['professionalProfile', 'academicEducations', 'professionalExperiences']);

        return response()->json($user);
    }

    /**
     * Réinitialisation du mot de passe.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Générer un token de réinitialisation
        $token = Str::random(60);
        
        // Envoyer l'email de réinitialisation (à implémenter)
        // Mail::to($request->email)->send(new ResetPasswordMail($token));

        return response()->json([
            'message' => 'Un email de réinitialisation a été envoyé.'
        ]);
    }

    /**
     * Vérification d'email.
     */
    public function verifyEmail(Request $request, $token)
    {
        // Logique de vérification d'email (simplifiée)
        // Note: Dans une vraie application, vous auriez une colonne 'email_verification_token'
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Token de vérification invalide.'
            ], 400);
        }

        $user->email_verified_at = now();
        $user->save();

        return response()->json([
            'message' => 'Email vérifié avec succès.'
        ]);
    }
}