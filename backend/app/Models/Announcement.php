<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'target_type',
        'target_ids',
        'is_published',
        'published_at',
        'published_by',
    ];

    protected $casts = [
        'target_ids' => 'array',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    /**
     * Relation avec le publiant.
     */
    public function publisher()
    {
        return $this->belongsTo(User::class, 'published_by');
    }

    /**
     * Scope pour les annonces publiées.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                     ->whereNotNull('published_at');
    }

    /**
     * Vérifie si l'annonce est publiée.
     */
    public function isPublished(): bool
    {
        return $this->is_published && $this->published_at !== null;
    }
}
