<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ProfessionalCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('users')->orderBy('name')->get();
        $professionalCategories = ProfessionalCategory::withCount('professionalProfiles')->get();

        return response()->json([
            'user_categories' => $categories,
            'professional_categories' => $professionalCategories
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string|max:500',
            'type' => ['required', Rule::in($this->getCategoryTypes())]
        ]);

        $validated['slug'] = Str::slug($request->name);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Catégorie créée avec succès!',
            'category' => $category
        ], 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories')->ignore($category->id)],
            'description' => 'nullable|string|max:500',
            'type' => ['required', Rule::in($this->getCategoryTypes())]
        ]);

        $validated['slug'] = Str::slug($request->name);

        $category->update($validated);

        return response()->json([
            'message' => 'Catégorie mise à jour avec succès!',
            'category' => $category
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->users()->exists()) {
            return response()->json([
                'error' => 'Impossible de supprimer cette catégorie car ' .
                         $category->users()->count() . ' utilisateur(s) y sont associés.'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Catégorie supprimée avec succès!'
        ]);
    }

    public function storeProfessional(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:professional_categories',
            'description' => 'nullable|string',
            'order' => 'integer|min:0',
            'is_active' => 'boolean'
        ]);

        $validated['slug'] = Str::slug($request->name);

        $category = ProfessionalCategory::create($validated);

        return response()->json([
            'message' => 'Catégorie professionnelle créée avec succès!',
            'category' => $category
        ], 201);
    }

    private function getCategoryTypes(): array
    {
        return [
            'cadre_administratif',
            'cadre_technique',
            'chef_entreprise',
            'artisan',
            'commercant',
            'jeune_entrepreneur',
            'investisseur'
        ];
    }
}
