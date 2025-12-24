<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Category;
use App\Http\Requests\Admin\CreateUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::with(['category', 'professionalProfile']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        $users = $query->latest()->paginate($request->input('per_page', 20));

        return response()->json([
            'users' => $users,
            'categories' => Category::all()
        ]);
    }

    public function show($id): JsonResponse
    {
        $user = User::with([
            'category',
            'professionalProfile',
            'professionalProfile.sector',
            'academicEducations',
            'professionalExperiences'
        ])->findOrFail($id);

        return response()->json($user);
    }

    public function store(CreateUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'status' => $validated['status'],
            'category_id' => $validated['category_id'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? null,
            'country' => $validated['country'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'newsletter_subscribed' => $validated['newsletter_subscribed'] ?? false,
        ]);

        Log::channel('admin')->info('Utilisateur créé par admin', [
            'admin_id' => auth()->id(),
            'user_id' => $user->id,
            'user_email' => $user->email
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user->load('category')
        ], 201);
    }

    public function update(UpdateUserRequest $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $validated = $request->validated();

        $user->update($validated);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user->fresh()->load('category')
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->role === User::ROLE_ADMIN &&
            User::where('role', User::ROLE_ADMIN)->count() <= 1) {
            return response()->json([
                'error' => 'Impossible de supprimer le dernier administrateur.'
            ], 422);
        }

        $user->delete();

        Log::channel('admin')->info('Utilisateur supprimé par admin', [
            'admin_id' => auth()->id(),
            'user_id' => $user->id
        ]);

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }

    public function activate($id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->activate();

        Log::channel('admin')->info('Utilisateur activé via API', [
            'admin_id' => auth()->id(),
            'user_id' => $user->id,
            'user_name' => $user->first_name . ' ' . $user->last_name
        ]);

        return response()->json([
            'message' => 'Utilisateur activé avec succès!',
            'user' => $user->fresh()
        ]);
    }

    public function deactivate($id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->deactivate();

        Log::channel('admin')->info('Utilisateur désactivé via API', [
            'admin_id' => auth()->id(),
            'user_id' => $user->id,
            'user_name' => $user->first_name . ' ' . $user->last_name
        ]);

        return response()->json([
            'message' => 'Utilisateur désactivé avec succès!',
            'user' => $user->fresh()
        ]);
    }

    public function suspend($id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->suspend();

        Log::channel('admin')->info('Utilisateur suspendu via API', [
            'admin_id' => auth()->id(),
            'user_id' => $user->id,
            'user_name' => $user->first_name . ' ' . $user->last_name
        ]);

        return response()->json([
            'message' => 'Utilisateur suspendu avec succès!',
            'user' => $user->fresh()
        ]);
    }

    public function setPending($id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->setPending();

        Log::channel('admin')->info('Utilisateur mis en attente via API', [
            'admin_id' => auth()->id(),
            'user_id' => $user->id,
            'user_name' => $user->first_name . ' ' . $user->last_name
        ]);

        return response()->json([
            'message' => 'Utilisateur mis en attente avec succès!',
            'user' => $user->fresh()
        ]);
    }
}
