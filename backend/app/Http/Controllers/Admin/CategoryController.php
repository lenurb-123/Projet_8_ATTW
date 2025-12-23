<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('users')->orderBy('name')->get();
        return view('admin.categories.index', compact('categories'));
    }

    public function create()
    {
        $types = $this->getCategoryTypes();
        return view('admin.categories.create', compact('types'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string|max:500',
            'type' => ['required', Rule::in(array_keys($this->getCategoryTypes()))]
        ]);

        $validated['slug'] = Str::slug($request->name);

        Category::create($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Catégorie créée avec succès!');
    }

    public function edit(Category $category)
    {
        $types = $this->getCategoryTypes();
        return view('admin.categories.edit', compact('category', 'types'));
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories')->ignore($category->id)],
            'description' => 'nullable|string|max:500',
            'type' => ['required', Rule::in(array_keys($this->getCategoryTypes()))]
        ]);

        $validated['slug'] = Str::slug($request->name);

        $category->update($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Catégorie mise à jour avec succès!');
    }

    public function destroy(Category $category)
    {
        if ($category->users()->exists()) {
            return back()->with('error',
                'Impossible de supprimer cette catégorie car ' . $category->users()->count() . ' utilisateur(s) y sont associés.'
            );
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Catégorie supprimée avec succès!');
    }

    private function getCategoryTypes(): array
    {
        return [
            'cadre_administratif' => 'Cadre administratif',
            'cadre_technique' => 'Cadre technique',
            'chef_entreprise' => 'Chef d\'entreprise',
            'artisan' => 'Artisan',
            'commercant' => 'Commerçant',
            'jeune_entrepreneur' => 'Jeune entrepreneur',
            'investisseur' => 'Investisseur/Partenaire'
        ];
    }
}
