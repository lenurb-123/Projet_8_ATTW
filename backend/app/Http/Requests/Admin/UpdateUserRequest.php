<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        $userId = $this->route('user') ? $this->route('user')->id : $this->route('id');

        return [
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $userId],
            'role' => ['sometimes', 'in:user,admin'],
            'status' => ['sometimes', 'in:pending,active,inactive,suspended'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'birth_date' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'in:male,female,other'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'newsletter_subscribed' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'role.in' => 'Le rôle doit être "user" ou "admin".',
            'status.in' => 'Le statut doit être: pending, active, inactive ou suspended.',
        ];
    }
}
