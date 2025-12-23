<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Category;

class DashboardController extends Controller
{

    public function index()
    {
        $stats = [
            'totalUsers' => User::count(),
            'activeUsers' => User::where('is_active', true)->count(),
            'pendingUsers' => User::where('is_active', false)->count(),
            'recentUsers' => User::with('profile')->latest()->take(5)->get(),
            'categoriesCount' => Category::count(),
            'usersByCategory' => Category::withCount('users')->get()
        ];

        return view('admin.dashboard', $stats);
    }

    public function statistics()
    {
        $stats = [
            'totalUsers' => User::count(),
            'activeUsers' => User::where('is_active', true)->count(),
            'pendingUsers' => User::where('is_active', false)->count(),
            'adminUsers' => User::where('role', 'admin')->count(),

            'usersByCategory' => Category::withCount('users')->get(),

            'registrationsByMonth' => $this->getRegistrationsByMonth(),

            'recentUsers' => User::with(['profile', 'category'])->latest()->take(10)->get(),

            'topCategories' => Category::withCount('users')
                ->orderBy('users_count', 'desc')
                ->take(5)
                ->get()
        ];

        return view('admin.statistics', compact('stats'));
    }

    private function getRegistrationsByMonth()
    {
        return User::selectRaw('
                DATE_FORMAT(created_at, "%Y-%m") as month,
                COUNT(*) as count
            ')
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->month => $item->count];
            });
    }
}
