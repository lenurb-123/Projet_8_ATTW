<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitProfileRequest;
use App\Http\Requests\UploadDocumentRequest;
use App\Models\ProfessionalProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfessionalProfileController extends Controller
{
    /**
     * Soumettre ou mettre à jour le profil professionnel.
     */
    public function store(SubmitProfileRequest $request)
    {
        $user = $request->user();

        // Vérifier si un profil existe déjà
        $profile = $user->professionalProfile;

        if ($profile) {
            // Mettre à jour le profil existant
            $profile->update($request->validated());
            
            // Réinitialiser l'approbation si mise à jour majeure
            if ($profile->isApproved()) {
                $profile->update([
                    'approved_at' => null,
                    'approved_by' => null,
                    'rejection_reason' => null,
                ]);
                
                $user->update(['status' => 'pending']);
            }

            $message = 'Profil professionnel mis à jour. Soumis pour validation.';
        } else {
            // Créer un nouveau profil
            $profile = ProfessionalProfile::create([
                'user_id' => $user->id,
                ...$request->validated()
            ]);
            
            $message = 'Profil professionnel créé. Soumis pour validation.';
        }

        // Mettre à jour le statut de l'utilisateur
        $user->update(['status' => 'pending']);

        // TODO: Envoyer une notification aux administrateurs
        // TODO: Journaliser l'action

        return response()->json([
            'message' => $message,
            'profile' => $profile,
        ], $profile->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Uploader un document (photo, CV, document légal).
     */
    public function uploadDocument(UploadDocumentRequest $request)
    {
        $user = $request->user();
        $file = $request->file('file');
        $documentType = $request->document_type;

        // Valider le type de fichier
        $this->validateFileType($file, $documentType);

        // Générer un nom de fichier unique
        $fileName = $documentType . '_' . time() . '_' . $file->getClientOriginalName();
        
        // Stocker le fichier (localement pour le moment, Cloudinary en production)
        $path = $file->storeAs('documents/' . $user->id, $fileName, 'public');

        // Mettre à jour le profil avec l'URL du document
        $profile = $user->professionalProfile;

        if (!$profile) {
            $profile = ProfessionalProfile::create(['user_id' => $user->id]);
        }

        switch ($documentType) {
            case 'profile_photo':
                $profile->update(['profile_photo_url' => Storage::url($path)]);
                break;
                
            case 'cv':
                $profile->update(['cv_url' => Storage::url($path)]);
                break;
                
            case 'legal_document':
                $documents = $profile->legal_documents ?? [];
                $documents[] = Storage::url($path);
                $profile->update(['legal_documents' => $documents]);
                break;
        }

        return response()->json([
            'message' => 'Document uploadé avec succès.',
            'url' => Storage::url($path),
            'document_type' => $documentType,
        ]);
    }

    /**
     * Valider le type de fichier selon le cahier des charges.
     */
    private function validateFileType($file, $documentType)
    {
        $maxSize = 0;
        $allowedMimes = [];

        switch ($documentType) {
            case 'profile_photo':
                $maxSize = 5 * 1024; // 5 MB en KB
                $allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
                break;
                
            case 'cv':
                $maxSize = 10 * 1024; // 10 MB
                $allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                break;
                
            case 'legal_document':
                $maxSize = 10 * 1024; // 10 MB
                $allowedMimes = ['application/pdf'];
                break;
        }

        // Vérifier la taille
        if ($file->getSize() > $maxSize * 1024) {
            abort(422, "Le fichier ne doit pas dépasser {$maxSize} MB.");
        }

        // Vérifier le type MIME
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            abort(422, "Type de fichier non autorisé. Types acceptés: " . implode(', ', $allowedMimes));
        }
    }

    /**
     * Soumettre le profil pour validation.
     */
    public function submitForApproval(Request $request)
    {
        $user = $request->user();
        $profile = $user->professionalProfile;

        if (!$profile) {
            return response()->json([
                'message' => 'Vous devez d\'abord créer un profil professionnel.'
            ], 400);
        }

        // Vérifier que tous les documents requis sont présents
        if (!$this->validateRequiredDocuments($profile)) {
            return response()->json([
                'message' => 'Documents requis manquants: photo de profil, CV et au moins un document légal.'
            ], 400);
        }

        // Mettre à jour le statut
        $user->update(['status' => 'pending']);

        // TODO: Envoyer notification aux administrateurs
        // TODO: Journaliser l'action

        return response()->json([
            'message' => 'Profil soumis pour validation avec succès.',
            'status' => 'pending',
        ]);
    }

    /**
     * Vérifier les documents requis.
     */
    private function validateRequiredDocuments($profile): bool
    {
        return $profile->profile_photo_url 
            && $profile->cv_url 
            && $profile->legal_documents 
            && count($profile->legal_documents) > 0;
    }

    /**
     * Récupérer le statut de validation.
     */
    public function getValidationStatus(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'status' => $user->status,
            'approved_at' => $user->professionalProfile->approved_at ?? null,
            'rejection_reason' => $user->professionalProfile->rejection_reason ?? null,
        ]);
    }

    /**
     * Visualiser le profil tel qu'il apparaît publiquement.
     */
    public function publicView(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isProfileApproved()) {
            return response()->json([
                'message' => 'Votre profil n\'est pas encore validé.'
            ], 403);
        }

        $profile = $user->professionalProfile;
        $profile->load(['category', 'sector']);

        return response()->json([
            'profile' => $this->formatPublicProfile($profile),
        ]);
    }

    /**
     * Formater le profil pour l'affichage public.
     */
    private function formatPublicProfile($profile)
    {
        return [
            'full_name' => $profile->user->first_name . ' ' . $profile->user->last_name,
            'category' => $profile->category->name,
            'sector' => $profile->sector->name,
            'biography' => $profile->biography,
            'years_experience' => $profile->years_experience,
            'current_position' => $profile->current_position,
            'company_name' => $profile->company_name,
            'education_level' => $profile->education_level,
            'skills' => $profile->getSkillsArray(),
            'languages' => $profile->getLanguagesArray(),
            'profile_photo_url' => $profile->profile_photo_url,
            'cv_url' => $profile->is_public ? $profile->cv_url : null,
            'contact_info' => $profile->is_public ? [
                'email' => $profile->user->email,
                'phone' => $profile->user->phone,
            ] : null,
        ];
    }
}
