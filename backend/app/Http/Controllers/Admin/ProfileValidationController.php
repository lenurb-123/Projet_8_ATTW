<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;

class ProfileValidationController extends Controller
{
    public function index()
    {
        $requests = User::where('is_active', false)->get();
        return view('admin.profile_requests', compact('requests'));
    }

    public function approve($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => true]);
        return back()->with('success','Profil approuvé');
    }

    public function reject($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return back()->with('success','Profil rejeté et supprimé');
    }
}
