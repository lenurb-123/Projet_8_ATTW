<?php
// database/seeders/TestUsersSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un admin
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'System',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
            'phone' => '+1234567890',
            'address' => '123 Admin Street',
            'city' => 'Admin City',
            'country' => 'Adminland',
            'newsletter_subscribed' => true,
        ]);

        // Créer un utilisateur normal (acteur économique)
        User::create([
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'email' => 'user@test.com',
            'password' => Hash::make('password123'),
            'role' => User::ROLE_USER,
            'status' => User::STATUS_PENDING, // En attente de validation
            'phone' => '+0987654321',
            'address' => '456 User Avenue',
            'city' => 'User City',
            'country' => 'Userland',
            'newsletter_subscribed' => false,
        ]);

        // Créer quelques utilisateurs supplémentaires
        for ($i = 1; $i <= 5; $i++) {
            User::create([
                'first_name' => "User{$i}",
                'last_name' => "Test",
                'email' => "user{$i}@test.com",
                'password' => Hash::make('password123'),
                'role' => User::ROLE_USER,
                'status' => $i % 2 == 0 ? User::STATUS_ACTIVE : User::STATUS_PENDING,
                'phone' => "+111222333{$i}",
                'city' => "Ville{$i}",
                'country' => "Pays{$i}",
            ]);
        }

        $this->command->info('✅ 7 utilisateurs de test créés !');
        $this->command->info('👑 Admin: admin@test.com / password123');
        $this->command->info('👤 User: user@test.com / password123 (en attente)');
    }
}
