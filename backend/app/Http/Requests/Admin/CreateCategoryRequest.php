<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:categories'],
            'description' => ['nullable', 'string', 'max:500'],
            'type' => ['required', 'in:cadre_administratif,cadre_technique,chef_entreprise,artisan,commercant,jeune_entrepreneur,investisseur'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.in' => 'Type de catégorie invalide.',
            'name.unique' => 'Une catégorie avec ce nom existe déjà.',
        ];
    }
}
