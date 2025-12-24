<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Relation avec les articles.
     */
    public function articles()
    {
        return $this->belongsToMany(NewsArticle::class, 'article_category');
    }
}
