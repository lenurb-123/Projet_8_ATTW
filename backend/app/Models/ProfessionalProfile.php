<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfessionalProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'sector_id',
        'biography',
        'years_experience',
        'current_position',
        'company_name',
        'education_level',
        'skills',
        'languages',
        'professional_interests',
        'profile_photo_url',
        'cv_url',
        'legal_documents',
        'is_public',
        'approved_at',
        'approved_by',
        'rejection_reason',
    ];

    protected $casts = [
        'skills' => 'array',
        'languages' => 'array',
        'professional_interests' => 'array',
        'legal_documents' => 'array',
        'is_public' => 'boolean',
        'approved_at' => 'datetime',
    ];

    /**
     * Relation avec l'utilisateur.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation avec la catégorie professionnelle.
     */
    public function category()
    {
        return $this->belongsTo(ProfessionalCategory::class);
    }

    /**
     * Relation avec le secteur d'activité.
     */
    public function sector()
    {
        return $this->belongsTo(ActivitySector::class);
    }

    /**
     * Relation avec l'approbateur.
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Vérifie si le profil est approuvé.
     */
    public function isApproved(): bool
    {
        return $this->approved_at !== null;
    }

    public function getSkillsArray() {
        return is_array($this->skills) ? $this->skills : json_decode($this->skills ?? '[]', true);
    }

    public function getLanguagesArray() {
        return is_array($this->languages) ? $this->languages : json_decode($this->languages ?? '[]', true);
    }
}
