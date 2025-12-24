<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_type' => ['required', 'in:profile_photo,cv,legal_document'],
            'file' => ['required', 'file'],
        ];
    }

    public function messages(): array
    {
        return [
            'document_type.in' => 'Le type de document doit être: profile_photo, cv ou legal_document.',
            'file.required' => 'Veuillez sélectionner un fichier.',
        ];
    }
}
