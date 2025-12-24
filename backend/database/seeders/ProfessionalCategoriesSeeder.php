<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProfessionalCategory;

class ProfessionalCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Cadres administratifs', 'slug' => 'cadres-administratifs', 'order' => 1],
            ['name' => 'Cadres techniques', 'slug' => 'cadres-techniques', 'order' => 2],
            ['name' => 'Chefs d\'entreprise', 'slug' => 'chefs-entreprise', 'order' => 3],
            ['name' => 'Artisans', 'slug' => 'artisans', 'order' => 4],
            ['name' => 'Commerçants', 'slug' => 'commercants', 'order' => 5],
            ['name' => 'Jeunes entrepreneurs', 'slug' => 'jeunes-entrepreneurs', 'order' => 6],
            ['name' => 'Investisseurs', 'slug' => 'investisseurs', 'order' => 7],
        ];

        foreach ($categories as $category) {
            ProfessionalCategory::create($category);
        }

        $this->command->info('7 catégories professionnelles créées.');
    }
}
