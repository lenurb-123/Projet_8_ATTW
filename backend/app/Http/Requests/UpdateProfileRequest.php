<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user() ? $this->user()->id : 0;

        return [
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $userId],
            'phone' => ['sometimes', 'string', 'max:20'],
            'profession' => ['sometimes', 'string', 'max:100'],
            'secteur' => ['sometimes', 'string', 'max:100'],
            'newsletter_subscribed' => ['sometimes', 'boolean'],
        ];
    }
}
