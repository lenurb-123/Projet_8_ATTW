<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return view('admin.users', compact('users'));
    }

    public function activate($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active'=>true]);
        return back()->with('success','Utilisateur activé');
    }

    public function deactivate($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active'=>false]);
        return back()->with('success','Utilisateur désactivé');
    }
}
