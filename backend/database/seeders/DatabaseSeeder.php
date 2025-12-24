<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ProfessionalCategoriesSeeder::class,
            ActivitySectorsSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}
