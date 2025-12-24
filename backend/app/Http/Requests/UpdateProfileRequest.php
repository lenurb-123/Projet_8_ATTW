<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // tous les utilisateurs authentifiés ont accès
    }

    public function rules(): array
    {
        $userId = $this->user() ? $this->user()->id : 0;

        return [
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $userId],
            'birth_date' => ['sometimes', 'date', 'before:today'],
            'gender' => ['sometimes', 'in:male,female,other'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'address' => ['sometimes', 'string', 'max:255'],
            'city' => ['sometimes', 'string', 'max:100'],
            'country' => ['sometimes', 'string', 'max:100'],
            'newsletter_subscribed' => ['boolean'],
        ];
    }
}
