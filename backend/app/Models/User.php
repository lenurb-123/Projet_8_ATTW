<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; [span_11](start_span)// Pour l'API Token[span_11](end_span)

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Les attributs assignables en masse.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    /**
     * Les attributs cachés pour la sérialisation (API).
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Les conversions de types automatiques.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        [span_12](start_span)'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    /**
     * Permet de vérifier si l'utilisateur est un administrateur.
     * Utile pour les Policies et Middleware.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
