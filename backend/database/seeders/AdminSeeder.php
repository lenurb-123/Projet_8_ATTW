<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Création de l'administrateur principal
        User::create([
            'name' => 'Super Administrateur',
            'email' => 'admin@commune.bj', // À changer selon le domaine réel
            [span_13](start_span)'password' => Hash::make('Admin123!@#'), // Mot de passe complexe par défaut[span_13](end_span)
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
