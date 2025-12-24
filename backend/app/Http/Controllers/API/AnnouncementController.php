<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Lister les annonces (pour les acteurs économiques).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Announcement::published()
                             ->orderByDesc('published_at');

        // Si l'utilisateur est connecté, on peut filtrer par cible
        if ($user) {
            $query->where(function($q) use ($user) {
                // Annonces pour tous
                $q->where('target_type', 'all');
                
                // Annonces pour la catégorie de l'utilisateur
                if ($user->professionalProfile && $user->professionalProfile->category_id) {
                    $q->orWhere(function($q2) use ($user) {
                        $q2->where('target_type', 'category')
                           ->whereJsonContains('target_ids', $user->professionalProfile->category_id);
                    });
                }
                
                // Annonces pour le secteur de l'utilisateur
                if ($user->professionalProfile && $user->professionalProfile->sector_id) {
                    $q->orWhere(function($q2) use ($user) {
                        $q2->where('target_type', 'sector')
                           ->whereJsonContains('target_ids', $user->professionalProfile->sector_id);
                    });
                }
            });
        }

        $perPage = $request->get('per_page', 10);
        $announcements = $query->paginate($perPage);

        return response()->json([
            'announcements' => $announcements,
        ]);
    }

    /**
     * Afficher une annonce spécifique.
     */
    public function show($id)
    {
        $announcement = Announcement::published()->findOrFail($id);

        return response()->json([
            'announcement' => $announcement,
        ]);
    }
}
