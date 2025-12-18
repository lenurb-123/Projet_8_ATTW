<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
        public function run(): void
        {
            // Appel du seeder de l'administrateur
            $this->call([
                AdminUserSeeder::class,
                // Autres seeders (Categories, Secteurs...)
            ]);
        }
}
