<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UsersExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return User::with(['profile', 'category'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nom',
            'Email',
            'Catégorie',
            'Téléphone',
            'Statut',
            'Date d\'inscription'
        ];
    }

    public function map($user): array
    {
        return [
            $user->id,
            $user->name,
            $user->email,
            $user->category->name ?? 'Non catégorisé',
            $user->profile->contacts ?? 'Non renseigné',
            $user->is_active ? 'Actif' : 'En attente',
            $user->created_at->format('d/m/Y H:i')
        ];
    }
}
