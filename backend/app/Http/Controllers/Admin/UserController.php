<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function index(Request $request)
    {
        $query = User::with(['profile', 'category']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->input('status') === 'active');
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->input('category'));
        }

        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        $users = $query->latest()->paginate(20);
        $categories = \App\Models\Category::all();

        return view('admin.users.index', compact('users', 'categories'));
    }

    public function activate($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => true]);

        \Log::channel('admin')->info('Utilisateur activé', [
            'admin_id' => auth()->id(),
            'user_id' => $user->id,
            'user_name' => $user->name
        ]);

        return back()->with('success', 'Utilisateur activé avec succès!');
    }

    public function deactivate($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => false]);

        \Log::channel('admin')->info('Utilisateur désactivé', [
            'admin_id' => auth()->id(),
            'user_id' => $user->id,
            'user_name' => $user->name
        ]);

        return back()->with('success', 'Utilisateur désactivé avec succès!');
    }

    public function show($id)
    {
        $user = User::with(['profile', 'category'])->findOrFail($id);
        return view('admin.users.show', compact('user'));
    }
}
