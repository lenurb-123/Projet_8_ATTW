<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Mapper les anciennes valeurs vers les nouvelles
        DB::table('professional_profiles')->whereNotNull('education_level')->each(function ($profile) {
            $mapping = [
                'bac' => 'bac',
                'bac_2' => 'licence',
                'bac_3' => 'licence',
                'bac_5' => 'master',
                'doctorate' => 'doctorat',
            ];
            
            $newValue = $mapping[$profile->education_level] ?? 'bac';
            
            DB::table('professional_profiles')
                ->where('id', $profile->id)
                ->update(['education_level' => $newValue]);
        });
    }

    public function down(): void
    {
        // Pas de rollback nécessaire
    }
};
