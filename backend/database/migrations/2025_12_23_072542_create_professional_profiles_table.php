<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('professional_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained('professional_categories');
            $table->foreignId('sector_id')->constrained('activity_sectors');
            $table->text('biography')->nullable();
            $table->integer('years_experience')->default(0);
            $table->string('current_position')->nullable();
            $table->string('company_name')->nullable();
            $table->enum('education_level', ['bac', 'bac_2', 'bac_3', 'bac_5', 'doctorate'])->nullable();
            $table->json('skills')->nullable(); // Array de compétences
            $table->json('languages')->nullable(); // Array de langues
            $table->json('professional_interests')->nullable();
            $table->string('profile_photo_url')->nullable();
            $table->string('cv_url')->nullable();
            $table->json('legal_documents')->nullable(); // URLs des documents légaux
            $table->boolean('is_public')->default(true);
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professional_profiles');
    }
};
