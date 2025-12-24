<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'status',
        'birth_date',
        'gender',
        'phone',
        'address',
        'city',
        'country',
        'newsletter_subscribed'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'birth_date' => 'date',
        'newsletter_subscribed' => 'boolean',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    /* Vérifie si l'utilisateur est un administrateur.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Vérifie si l'utilisateur est un acteur économique.
     */
    public function isEconomicActor(): bool
    {
        return $this->role === 'user';
    }   


    public function professionalProfile()
    {
        return $this->hasOne(ProfessionalProfile::class);
    }

    public function academicEducations()
    {
        return $this->hasMany(AcademicEducation::class);
    }

    public function professionalExperiences()
    {
        return $this->hasMany(ProfessionalExperience::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'published_by');
    }

    public function newsArticles()
    {
        return $this->hasMany(NewsArticle::class, 'author_id');
    }
    /**
     * Vérifie si le profil est en attente.
     */
    public function isProfilePending(): bool
    {
        return $this->status === 'pending';
    }

}
