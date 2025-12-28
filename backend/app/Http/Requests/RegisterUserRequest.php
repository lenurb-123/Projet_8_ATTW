<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
            ],
            'phone' => ['required', 'string', 'max:20'],
            'profession' => ['required', 'string', 'max:100'],
            'secteur' => ['required', 'string', 'max:100'],
            'newsletter_subscribed' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'password.confirmed' => 'Les mots de passe ne correspondent pas.',
            'birth_date.before' => 'La date de naissance doit être dans le passé.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
        ];
    }
}
