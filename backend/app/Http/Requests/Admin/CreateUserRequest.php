<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
            ],
            'role' => ['required', 'in:user,admin'],
            'status' => ['required', 'in:pending,active,inactive,suspended'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'phone' => ['nullable', 'string', 'max:20'],
            'profession' => ['required', 'string', 'max:100'],
            'secteur' => ['required', 'string', 'max:100'],
            'newsletter_subscribed' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'role.in' => 'Le rôle doit être "user" ou "admin".',
            'status.in' => 'Le statut doit être: pending, active, inactive ou suspended.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
        ];
    }
}
