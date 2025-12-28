<?php
// database/seeders/TestUsersSeeder.php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ProfessionalProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Désactiver les contraintes pour nettoyer proprement (Optionnel mais sûr)
        DB::statement('PRAGMA foreign_keys = OFF;');

        // 2. Remplir la table PROFESSIONAL_CATEGORIES (Celle exigée par ta migration !) ✅
        $catId = DB::table('professional_categories')->insertGetId([
            'name' => 'Consultants & Experts',
            'slug' => 'consultants-experts',
            'is_active' => true,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // 3. Remplir la table ACTIVITY_SECTORS ✅
        $sectId = DB::table('activity_sectors')->insertGetId([
            'name' => 'Technologies',
            'slug' => 'technologies',
            'is_active' => true,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // 4. Créer l'Admin 👑
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'System',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123@'),
            'role' => 'admin',
            'status' => 'active',
            'phone' => '00000000',
        ]);

        // 5. Créer Jean Dupont et les autres 👤
        $usersData = [
            ['first_name' => 'Jean', 'last_name' => 'Dupont', 'email' => 'user@test.com'],
            ['first_name' => 'Alice', 'last_name' => 'Bio', 'email' => 'alice@test.com'],
            ['first_name' => 'Marc', 'last_name' => 'Tech', 'email' => 'marc@test.com'],
        ];

        foreach ($usersData as $data) {
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make('password123@'),
                'role' => 'user',
                'status' => 'active',
                'phone' => '9700000' . rand(0, 9),
            ]);

            // 6. Créer le profil pro avec les BONNES références de tables
            DB::table('professional_profiles')->insert([
                'user_id' => $user->id,
                'category_id' => $catId, // Pointe vers professional_categories
                'sector_id' => $sectId,   // Pointe vers activity_sectors
                'biography' => "Expert passionné par son métier.",
                'years_experience' => rand(1, 15),
                'education_level' => 'bac_5', // Valeur de ton ENUM
                'is_public' => true,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        DB::statement('PRAGMA foreign_keys = ON;');
        $this->command->info('✅ L\'annuaire est enfin prêt et les clés étrangères sont respectées !');
    }
}
