<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Collection;

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

    private function getRegistrationsByMonth(): array
    {
        $months = [];

        for ($i = 11; $i >= 0; $i--) {
            $monthDate = now()->subMonths($i);
            $monthKey = $monthDate->format('Y-m');
            $monthLabel = $monthDate->translatedFormat('F Y');

            $months[$monthKey] = [
                'label' => $monthLabel,
                'count' => 0
            ];
        }

        $startDate = now()->subMonths(12);

        $users = User::where('created_at', '>=', $startDate)->get();

        $usersByMonth = $users->groupBy(function ($user) {
            return $user->created_at->format('Y-m');
        });

        foreach ($usersByMonth as $monthKey => $monthUsers) {
            if (isset($months[$monthKey])) {
                $months[$monthKey]['count'] = $monthUsers->count();
            }
        }

        $labels = [];
        $data = [];

        foreach ($months as $month) {
            $labels[] = $month['label'];
            $data[] = $month['count'];
        }

        return [
            'labels' => $labels,
            'data' => $data,
            'total' => $users->count()
        ];
    }
}
