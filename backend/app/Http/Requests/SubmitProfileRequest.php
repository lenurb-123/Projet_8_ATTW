<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:professional_categories,id'],
            'sector_id' => ['required', 'exists:activity_sectors,id'],
            'biography' => ['required', 'string', 'min:50', 'max:2000'],
            'years_experience' => ['required', 'integer', 'min:0', 'max:50'],
            'current_position' => ['required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'education_level' => ['required', 'in:bac,bac_2,bac_3,bac_5,doctorate,other'],
            'skills' => ['required', 'array', 'min:1'],
            'skills.*' => ['string', 'max:100'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:50'],
            'professional_interests' => ['nullable', 'array'],
            'professional_interests.*' => ['string', 'max:100'],
            'is_public' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'biography.min' => 'La biographie doit contenir au moins 50 caractères.',
            'skills.min' => 'Veuillez ajouter au moins une compétence.',
        ];
    }
}
