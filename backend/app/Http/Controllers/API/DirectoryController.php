<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ProfessionalProfile;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    /**
     * Lister tous les profils validés (annuaire public).
     */
    public function index(Request $request)
    {
        $query = User::where('status', 'approved')
                     ->whereHas('professionalProfile', function($q) {
                         $q->where('is_public', true);
                     })
                     ->with(['professionalProfile.category', 'professionalProfile.sector']);

        // Recherche par mot-clé
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhereHas('professionalProfile', function($q2) use ($search) {
                      $q2->where('skills', 'like', "%{$search}%")
                         ->orWhere('current_position', 'like', "%{$search}%")
                         ->orWhere('company_name', 'like', "%{$search}%")
                         ->orWhere('biography', 'like', "%{$search}%");
                  });
            });
        }

        // Filtres avancés
        if ($request->has('category_id')) {
            $query->whereHas('professionalProfile', function($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        if ($request->has('sector_id')) {
            $query->whereHas('professionalProfile', function($q) use ($request) {
                $q->where('sector_id', $request->sector_id);
            });
        }

        if ($request->has('education_level')) {
            $query->whereHas('professionalProfile', function($q) use ($request) {
                $q->where('education_level', $request->education_level);
            });
        }

        if ($request->has('city')) {
            $query->where('city', 'like', "%{$request->city}%");
        }

        if ($request->has('min_experience')) {
            $query->whereHas('professionalProfile', function($q) use ($request) {
                $q->where('years_experience', '>=', $request->min_experience);
            });
        }

        // Tri des résultats
        $sortBy = $request->get('sort_by', 'relevance');
        switch ($sortBy) {
            case 'name':
                $query->orderBy('last_name')->orderBy('first_name');
                break;
            case 'experience':
                $query->orderByDesc(
                    ProfessionalProfile::select('years_experience')
                        ->whereColumn('professional_profiles.user_id', 'users.id')
                        ->limit(1)
                );
                break;
            case 'newest':
                $query->orderByDesc('created_at');
                break;
            default: // relevance
                // Tri par défaut (pourrait être basé sur la correspondance de recherche)
                $query->orderByDesc('created_at');
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        $profiles = $query->paginate($perPage);

        // Formater la réponse
        $profiles->getCollection()->transform(function($user) {
            return $this->formatDirectoryProfile($user);
        });

        return response()->json([
            'profiles' => $profiles,
            'filters' => $request->only(['search', 'category_id', 'sector_id', 'education_level', 'city', 'min_experience']),
        ]);
    }

    /**
     * Recherche avancée.
     */
    public function search(Request $request)
    {
        // Cette méthode est similaire à index() mais avec plus de filtres
        return $this->index($request);
    }

    /**
     * Afficher un profil détaillé.
     */
    public function show($id)
    {
        $user = User::where('status', 'approved')
                    ->where('id', $id)
                    ->with([
                        'professionalProfile.category',
                        'professionalProfile.sector',
                        'academicEducations',
                        'professionalExperiences'
                    ])
                    ->firstOrFail();

        // Vérifier si le profil est public
        if (!$user->professionalProfile || !$user->professionalProfile->is_public) {
            return response()->json([
                'message' => 'Ce profil n\'est pas disponible.'
            ], 404);
        }

        return response()->json([
            'profile' => $this->formatDetailedProfile($user),
        ]);
    }

    /**
     * Formater un profil pour l'annuaire.
     */
    private function formatDirectoryProfile($user)
    {
        $profile = $user->professionalProfile;

        return [
            'id' => $user->id,
            'full_name' => $user->first_name . ' ' . $user->last_name,
            'category' => $profile->category->name ?? null,
            'sector' => $profile->sector->name ?? null,
            'current_position' => $profile->current_position ?? null,
            'company_name' => $profile->company_name ?? null,
            'years_experience' => $profile->years_experience ?? 0,
            'education_level' => $profile->education_level ?? null,
            'profile_photo_url' => $profile->profile_photo_url ?? null,
            'city' => $user->city,
            'summary' => $profile->biography ? substr($profile->biography, 0, 150) . '...' : null,
        ];
    }

    /**
     * Formater un profil détaillé.
     */
    private function formatDetailedProfile($user)
    {
        $profile = $user->professionalProfile;

        return [
            'personal_info' => [
                'full_name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->professionalProfile->is_public ? $user->email : null,
                'phone' => $user->professionalProfile->is_public ? $user->phone : null,
                'city' => $user->city,
                'country' => $user->country,
            ],
            'professional_info' => [
                'category' => $profile->category->name ?? null,
                'sector' => $profile->sector->name ?? null,
                'biography' => $profile->biography,
                'years_experience' => $profile->years_experience,
                'current_position' => $profile->current_position,
                'company_name' => $profile->company_name,
                'education_level' => $profile->education_level,
                'skills' => $profile->getSkillsArray(),
                'languages' => $profile->getLanguagesArray(),
                'professional_interests' => $profile->professional_interests,
            ],
            'academic_educations' => $user->academicEducations->map(function($edu) {
                return [
                    'degree' => $edu->degree,
                    'institution' => $edu->institution,
                    'field_of_study' => $edu->field_of_study,
                    'duration' => $edu->duration,
                    'description' => $edu->description,
                ];
            }),
            'professional_experiences' => $user->professionalExperiences->map(function($exp) {
                return [
                    'position' => $exp->position,
                    'company' => $exp->company,
                    'location' => $exp->location,
                    'duration' => $exp->formatted_duration,
                    'description' => $exp->description,
                    'achievements' => $exp->achievements,
                ];
            }),
            'documents' => [
                'profile_photo_url' => $profile->profile_photo_url,
                'cv_url' => $profile->is_public ? $profile->cv_url : null,
            ],
        ];
    }
}
