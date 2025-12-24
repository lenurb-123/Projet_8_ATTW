<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\AcademicEducation;
use App\Models\ProfessionalExperience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserProfileController extends Controller
{
    /**
     * Afficher le profil de l'utilisateur connecté.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $user->load([
            'professionalProfile.category',
            'professionalProfile.sector',
            'academicEducations',
            'professionalExperiences'
        ]);

        return response()->json([
            'user' => $user,
            'professional_profile' => $user->professionalProfile,
            'academic_educations' => $user->academicEducations,
            'professional_experiences' => $user->professionalExperiences,
        ]);
    }

    /**
     * Mettre à jour le profil utilisateur.
     */
    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        
        // Mettre à jour les champs autorisés
        $user->update($request->validated());

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user' => $user,
        ]);
    }

    /**
     * Ajouter une formation académique.
     */
    public function addEducation(Request $request)
    {
        $request->validate([
            'degree' => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'start_year' => 'required|integer|min:1900|max:' . date('Y'),
            'end_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'is_current' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $education = AcademicEducation::create([
            'user_id' => $request->user()->id,
            'degree' => $request->degree,
            'institution' => $request->institution,
            'field_of_study' => $request->field_of_study,
            'start_year' => $request->start_year,
            'end_year' => $request->end_year,
            'is_current' => $request->is_current ?? false,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Formation ajoutée avec succès.',
            'education' => $education,
        ], 201);
    }

    /**
     * Ajouter une expérience professionnelle.
     */
    public function addExperience(Request $request)
    {
        $request->validate([
            'position' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string',
            'achievements' => 'nullable|array',
        ]);

        $experience = ProfessionalExperience::create([
            'user_id' => $request->user()->id,
            'position' => $request->position,
            'company' => $request->company,
            'location' => $request->location,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_current' => $request->is_current ?? false,
            'description' => $request->description,
            'achievements' => $request->achievements,
        ]);

        return response()->json([
            'message' => 'Expérience ajoutée avec succès.',
            'experience' => $experience,
        ], 201);
    }

    /**
     * S'abonner à la newsletter.
     */
    public function subscribeNewsletter(Request $request)
    {
        $user = $request->user();
        $user->update(['newsletter_subscribed' => true]);

        return response()->json([
            'message' => 'Abonnement à la newsletter confirmé.',
        ]);
    }

    /**
     * Se désabonner de la newsletter.
     */
    public function unsubscribeNewsletter(Request $request)
    {
        $user = $request->user();
        $user->update(['newsletter_subscribed' => false]);

        return response()->json([
            'message' => 'Désabonnement de la newsletter confirmé.',
        ]);
    }

    /**
     * Supprimer le compte (RGPD droit à l'oubli).
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();
        
        // Soft delete l'utilisateur
        $user->delete();

        // Révoquer tous les tokens
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Compte supprimé avec succès.',
        ]);
    }


    public function updateEducation(Request $request, $id)
    {
        $request->validate([
            'degree' => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'start_year' => 'required|integer|min:1900|max:' . date('Y'),
            'end_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'is_current' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $education = AcademicEducation::where('user_id', $request->user()->id)
                                    ->where('id', $id)
                                    ->firstOrFail();

        $education->update($request->all());

        return response()->json([
            'message' => 'Formation mise à jour avec succès.',
            'education' => $education,
        ]);
    }

    /**
     * Supprimer une formation académique.
     */
    public function deleteEducation(Request $request, $id)
    {
        $education = AcademicEducation::where('user_id', $request->user()->id)
                                    ->where('id', $id)
                                    ->firstOrFail();

        $education->delete();

        return response()->json([
            'message' => 'Formation supprimée avec succès.',
        ]);
    }

    /**
     * Mettre à jour une expérience professionnelle.
     */
    public function updateExperience(Request $request, $id)
    {
        $request->validate([
            'position' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string',
            'achievements' => 'nullable|array',
        ]);

        $experience = ProfessionalExperience::where('user_id', $request->user()->id)
                                          ->where('id', $id)
                                          ->firstOrFail();

        $experience->update($request->all());

        return response()->json([
            'message' => 'Expérience mise à jour avec succès.',
            'experience' => $experience,
        ]);
    }

    /**
     * Supprimer une expérience professionnelle.
     */
    public function deleteExperience(Request $request, $id)
    {
        $experience = ProfessionalExperience::where('user_id', $request->user()->id)
                                          ->where('id', $id)
                                          ->firstOrFail();

        $experience->delete();

        return response()->json([
            'message' => 'Expérience supprimée avec succès.',
        ]);
    }

    public function getEducations(Request $request)
    {
        $educations = AcademicEducation::where('user_id', $request->user()->id)
                                    ->orderBy('start_year', 'desc')
                                    ->get();
        
        return response()->json(['educations' => $educations]);
    }

    public function getExperiences(Request $request)
    {
        $experiences = ProfessionalExperience::where('user_id', $request->user()->id)
                                            ->orderBy('start_date', 'desc')
                                            ->get();
        
        return response()->json(['experiences' => $experiences]);
    }
}
