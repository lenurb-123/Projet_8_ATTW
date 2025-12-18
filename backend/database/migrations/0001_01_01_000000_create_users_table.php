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
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Informations d'identification de base
            $table->string('name'); // Nom complet (ou Nom d'affichage pour l'admin)
            [span_5](start_span)$table->string('email')->unique(); // Authentification via email[span_5](end_span)
            $table->timestamp('email_verified_at')->nullable(); [span_6](start_span)// Confirmation email[span_6](end_span)
            $table->string('password'); [span_7](start_span)// Mot de passe crypté (Bcrypt)[span_7](end_span)

            [span_8](start_span)// Gestion des Rôles (RBAC)[span_8](end_span)
            // 'admin' pour l'administrateur, 'user' pour les cadres/opérateurs
            $table->enum('role', ['admin', 'user'])->default('user')->index();

            [span_9](start_span)// Gestion du statut du compte (Activation/Suspension)[span_9](end_span)
            $table->boolean('is_active')->default(true);

            $table->rememberToken();
            $table->timestamps(); // create_at, updated_at
            $table->softDeletes(); // Suppression douce (optionnel mais recommandé pour l'historique)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
