<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivitySector extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
        'description',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relation avec le parent (pour l'arborescence).
     */
    public function parent()
    {
        return $this->belongsTo(ActivitySector::class, 'parent_id');
    }

    /**
     * Relation avec les enfants.
     */
    public function children()
    {
        return $this->hasMany(ActivitySector::class, 'parent_id');
    }

    /**
     * Relation avec les profils professionnels.
     */
    public function professionalProfiles()
    {
        return $this->hasMany(ProfessionalProfile::class);
    }

    /**
     * Scope pour les secteurs actifs.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour trier par ordre.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('name');
    }

    /**
     * Vérifie si le secteur a des enfants.
     */
    public function hasChildren(): bool
    {
        return $this->children()->count() > 0;
    }
}
