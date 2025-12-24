<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    /**
     * Lister les articles d'actualité.
     */
    public function index(Request $request)
    {
        $query = NewsArticle::published()
                           ->with(['author', 'categories'])
                           ->orderByDesc('published_at');

        // Filtre par catégorie
        if ($request->has('category')) {
            $query->whereHas('categories', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Recherche par mot-clé
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 10);
        $articles = $query->paginate($perPage);

        return response()->json([
            'articles' => $articles,
        ]);
    }

    //Pour les new user
    // Ajoutez cette méthode dans NewsController
    public function userNews(Request $request)
    {
        // Logique spécifique pour les utilisateurs connectés
        // Par exemple, montrer des articles premium ou personnalisés
        $query = NewsArticle::published()
                        ->with(['author', 'categories'])
                        ->orderByDesc('published_at');

        // Ajoutez ici des filtres spécifiques aux utilisateurs connectés
        if (auth()->check()) {
            // Exemple : montrer d'abord les articles de catégories préférées
            $user = auth()->user();
            if ($user->preferred_categories) {
                $query->whereHas('categories', function($q) use ($user) {
                    $q->whereIn('slug', $user->preferred_categories);
                });
            }
        }

        $perPage = $request->get('per_page', 10);
        $articles = $query->paginate($perPage);

        return response()->json([
            'articles' => $articles,
        ]);
    }

    /**
     * Afficher un article spécifique.
     */
    public function show($slug)
    {
        $article = NewsArticle::published()
                             ->with(['author', 'categories'])
                             ->where('slug', $slug)
                             ->firstOrFail();

        return response()->json([
            'article' => $article,
        ]);
    }
}
