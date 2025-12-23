<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileValidationController extends Controller
{

    public function index()
    {
        $requests = User::with(['profile', 'category'])
            ->where('is_active', false)
            ->where('role', 'user')
            ->latest()
            ->get();

        return view('admin.profile_requests.index', compact('requests'));
    }

    public function show($id)
    {
        $user = User::with(['profile', 'category'])
            ->where('is_active', false)
            ->findOrFail($id);

        return view('admin.profile_requests.show', compact('user'));
    }

    public function approve($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => true]);

        \Log::channel('admin')->info('Profil approuvé', [
            'admin_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'user_id' => $user->id,
            'user_name' => $user->name,
            'action' => 'approve'
        ]);

        return back()->with('success', 'Profil approuvé avec succès!');
    }

    public function reject($id, Request $request)
    {
        $request->validate([
            'reason' => 'nullable|string|max:500'
        ]);

        $user = User::findOrFail($id);

        $reason = $request->input('reason', 'Votre profil ne répond pas aux critères requis.');

        \Log::channel('admin')->info('Profil rejeté', [
            'admin_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'user_id' => $user->id,
            'user_name' => $user->name,
            'reason' => $reason,
            'action' => 'reject'
        ]);

        $user->delete();

        return back()->with('success', 'Profil rejeté et supprimé!');
    }
}
