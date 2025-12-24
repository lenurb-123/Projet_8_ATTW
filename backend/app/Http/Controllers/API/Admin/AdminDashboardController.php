<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Category;
use App\Models\ProfessionalProfile;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $stats = [
            'total_users' => User::count(),
            'users_by_status' => [
                'active' => User::where('status', User::STATUS_ACTIVE)->count(),
                'pending' => User::where('status', User::STATUS_PENDING)->count(),
                'inactive' => User::where('status', User::STATUS_INACTIVE)->count(),
                'suspended' => User::where('status', User::STATUS_SUSPENDED)->count(),
            ],
            'users_by_role' => [
                'admin' => User::where('role', User::ROLE_ADMIN)->where('status', User::STATUS_ACTIVE)->count(),
                'user' => User::where('role', User::ROLE_USER)->where('status', User::STATUS_ACTIVE)->count(),
            ],
            'profiles_by_status' => [
                'total' => ProfessionalProfile::count(),
                'approved' => ProfessionalProfile::whereNotNull('approved_at')->count(),
                'pending' => ProfessionalProfile::whereNull('approved_at')->count(),
            ],
            'categories_count' => Category::count(),
            'recent_users' => User::with('category')
                ->latest()
                ->take(5)
                ->get(['id', 'first_name', 'last_name', 'email', 'created_at', 'status', 'role']),
            'users_by_category' => Category::withCount(['users' => function($query) {
                $query->where('status', User::STATUS_ACTIVE);
            }])->get()
        ];

        return response()->json($stats);
    }

    public function statistics(): JsonResponse
    {
        $stats = [
            'users_by_status' => [
                'active' => User::where('status', User::STATUS_ACTIVE)->count(),
                'pending' => User::where('status', User::STATUS_PENDING)->count(),
                'inactive' => User::where('status', User::STATUS_INACTIVE)->count(),
                'suspended' => User::where('status', User::STATUS_SUSPENDED)->count(),
            ],
            'users_by_category' => Category::withCount(['users' => function($query) {
                $query->where('status', User::STATUS_ACTIVE);
            }])->get(),
            'top_categories' => Category::withCount(['users' => function($query) {
                $query->where('status', User::STATUS_ACTIVE);
            }])
                ->orderBy('users_count', 'desc')
                ->take(5)
                ->get(),
            'recent_users' => User::with('category')
                ->latest()
                ->take(10)
                ->get(['id', 'first_name', 'last_name', 'email', 'status', 'role', 'created_at']),
            'registration_trend' => $this->getRegistrationByMonth(),
            'profiles_by_validation' => [
                'approved' => ProfessionalProfile::whereNotNull('approved_at')->count(),
                'pending' => ProfessionalProfile::whereNull('approved_at')->whereNull('rejection_reason')->count(),
                'rejected' => ProfessionalProfile::whereNotNull('rejection_reason')->count(),
            ]
        ];

        return response()->json($stats);
    }

    private function getRegistrationByMonth(): array
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

        return array_values($months);
    }
}
