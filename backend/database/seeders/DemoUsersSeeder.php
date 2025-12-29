<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Supprimer les utilisateurs avec role user (garder les admins)
        User::where('role', 'user')->delete();

        // Créer 6 utilisateurs de démo
        $users = [
            [
                'first_name' => 'Sophie',
                'last_name' => 'Dupont',
                'email' => 'sophie.dupont@example.com',
                'phone' => '0601020304',
                'city' => 'Cotonou',
                'country' => 'Bénin',
            ],
            [
                'first_name' => 'Marc',
                'last_name' => 'Bernard',
                'email' => 'marc.bernard@example.com',
                'phone' => '0602030405',
                'city' => 'Porto-Novo',
                'country' => 'Bénin',
            ],
            [
                'first_name' => 'Fatima',
                'last_name' => 'Kouadio',
                'email' => 'fatima.kouadio@example.com',
                'phone' => '0603040506',
                'city' => 'Parakou',
                'country' => 'Bénin',
            ],
            [
                'first_name' => 'Jean',
                'last_name' => 'Martin',
                'email' => 'jean.martin@example.com',
                'phone' => '0604050607',
                'city' => 'Cotonou',
                'country' => 'Bénin',
            ],
            [
                'first_name' => 'Aïcha',
                'last_name' => 'Diallo',
                'email' => 'aicha.diallo@example.com',
                'phone' => '0605060708',
                'city' => 'Porto-Novo',
                'country' => 'Bénin',
            ],
            [
                'first_name' => 'Thomas',
                'last_name' => 'Lefebvre',
                'email' => 'thomas.lefebvre@example.com',
                'phone' => '0606070809',
                'city' => 'Parakou',
                'country' => 'Bénin',
            ],
        ];

        foreach ($users as $userData) {
            User::create([
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'email' => $userData['email'],
                'password' => Hash::make('Azerty123'),
                'role' => 'user',
                'status' => 'active',
                'phone' => $userData['phone'],
                'city' => $userData['city'],
                'country' => $userData['country'],
                'newsletter_subscribed' => false,
            ]);
        }

        $this->command->info('6 utilisateurs de démo créés avec succès !');
        $this->command->info('Email/Password: [email ci-dessus] / Azerty123');
    }
}
