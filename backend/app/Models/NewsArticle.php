<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsArticle extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'author_id',
        'status',
        'published_at',
        'archived_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'archived_at' => 'datetime',
    ];

    /**
     * Relation avec l'auteur.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Relation avec les catégories.
     */
    public function categories()
    {
        return $this->belongsToMany(ArticleCategory::class, 'article_category');
    }

    /**
     * Scope pour les articles publiés.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_at');
    }

    /**
     * Vérifie si l'article est publié.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published' && $this->published_at !== null;
    }

    /**
     * Formate la date de publication.
     */
    public function getFormattedPublishedDateAttribute(): string
    {
        return $this->published_at ? $this->published_at->format('d/m/Y') : '';
    }
}
