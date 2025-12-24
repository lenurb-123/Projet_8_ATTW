<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ActivitySector;

class ActivitySectorsSeeder extends Seeder
{
    public function run(): void
    {
        $sectors = [
            ['name' => 'Agriculture', 'slug' => 'agriculture', 'order' => 1],
            ['name' => 'Industrie', 'slug' => 'industrie', 'order' => 2],
            ['name' => 'Services', 'slug' => 'services', 'order' => 3],
            ['name' => 'Commerce', 'slug' => 'commerce', 'order' => 4],
            ['name' => 'Construction', 'slug' => 'construction', 'order' => 5],
            ['name' => 'Tourisme', 'slug' => 'tourisme', 'order' => 6],
            ['name' => 'Santé', 'slug' => 'sante', 'order' => 7],
            ['name' => 'Éducation', 'slug' => 'education', 'order' => 8],
            ['name' => 'Technologie', 'slug' => 'technologie', 'order' => 9],
            ['name' => 'Finance', 'slug' => 'finance', 'order' => 10],
        ];

        foreach ($sectors as $sector) {
            ActivitySector::create($sector);
        }

        $this->command->info('10 secteurs d\'activité créés.');
    }
}
