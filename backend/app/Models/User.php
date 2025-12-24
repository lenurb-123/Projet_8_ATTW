<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable , HasApiTokens;

    const ROLE_ADMIN = 'admin';
    const ROLE_USER = 'user';

    const STATUS_PENDING = 'pending';
    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';
    const STATUS_SUSPENDED = 'suspended';

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
        'newsletter_subscribed',
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

    /* Vérifie si l'utilisateur est un administrateur.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin' && $this->isActive();
    }

    /**
     * Vérifie si l'utilisateur est un acteur économique.
     */
    public function isEconomicActor(): bool
    {
        return $this->role === 'user' && $this->isActive();
    }

    /**
     * Vérifie si l'utilisateur est actif.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Vérifie si le profil est en attente.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isProfilePending(): bool
    {
        return $this->isPending();
    }

    /**
     * Vérifie si le compte est suspendu.
     */
    public function isSuspended(): bool
    {
        return $this->status === self::STATUS_SUSPENDED;
    }

    /**
     * Vérifie si le compte est inactif.
     */
    public function isInactive(): bool
    {
        return $this->status === self::STATUS_INACTIVE;
    }

    /**
     * Activer l'utilisateur.
     */
    public function activate(): void
    {
        $this->update([
            'status' => self::STATUS_ACTIVE,
        ]);
    }

    /**
     * Désactiver l'utilisateur.
     */
    public function deactivate(): void
    {
        $this->update([
            'status' => self::STATUS_INACTIVE,
        ]);
    }

    /**
     * Mettre en attente l'utilisateur.
     */
    public function setPending(): void
    {
        $this->update([
            'status' => self::STATUS_PENDING,
        ]);
    }

    /**
     * Suspendre l'utilisateur.
     */
    public function suspend(): void
    {
        $this->update([
            'status' => self::STATUS_SUSPENDED,
        ]);
    }

    // Les relations

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

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
