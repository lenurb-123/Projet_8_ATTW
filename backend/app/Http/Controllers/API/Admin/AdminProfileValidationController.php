<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProfessionalProfile;
use App\Http\Requests\Admin\RejectProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AdminProfileValidationController extends Controller
{
    public function pending(Request $request): JsonResponse
    {
        $profiles = ProfessionalProfile::whereNull('approved_at')
            ->whereNull('rejection_reason')
            ->with([
                'user' => function($query) {
                    $query->select('id', 'first_name', 'last_name', 'email', 'created_at', 'status');
                },
                'category',
                'sector'
            ])
            ->latest()
            ->paginate($request->input('per_page', 20));

        return response()->json($profiles);
    }

    public function show($id): JsonResponse
    {
        $profile = ProfessionalProfile::with([
            'user',
            'category',
            'sector',
            'user.academicEducations',
            'user.professionalExperiences'
        ])->findOrFail($id);

        return response()->json($profile);
    }

    public function approve($id): JsonResponse
    {
        $profile = ProfessionalProfile::findOrFail($id);

        $profile->update([
            'approved_at' => now(),
            'approved_by' => auth()->id(),
            'rejection_reason' => null
        ]);

        $profile->user->activate();

        Log::channel('admin')->info('Profil professionnel approuvé via API', [
            'admin_id' => auth()->id(),
            'profile_id' => $profile->id,
            'user_id' => $profile->user_id
        ]);

        return response()->json([
            'message' => 'Profil approuvé avec succès!',
            'profile' => $profile->fresh(['user', 'category', 'sector'])
        ]);
    }

    public function reject(RejectProfileRequest $request, $id): JsonResponse
    {
        $validated = $request->validated();

        $profile = ProfessionalProfile::findOrFail($id);

        $profile->update([
            'approved_at' => null,
            'rejection_reason' => $validated['reason']
        ]);

        $profile->user->deactivate();

        Log::channel('admin')->info('Profil professionnel rejeté via API', [
            'admin_id' => auth()->id(),
            'profile_id' => $profile->id,
            'user_id' => $profile->user_id,
            'reason' => $validated['reason']
        ]);

        return response()->json([
            'message' => 'Profil rejeté avec succès!',
            'profile' => $profile->fresh(['user'])
        ]);
    }
}
