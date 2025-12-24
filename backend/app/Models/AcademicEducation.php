<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicEducation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'degree',
        'institution',
        'field_of_study',
        'start_year',
        'end_year',
        'is_current',
        'description',
    ];

    protected $casts = [
        'is_current' => 'boolean',
    ];

    /**
     * Relation avec l'utilisateur.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Récupère la durée formatée.
     */
    public function getDurationAttribute(): string
    {
        if ($this->is_current) {
            return "{$this->start_year} - Présent";
        }
        
        return $this->end_year 
            ? "{$this->start_year} - {$this->end_year}"
            : (string) $this->start_year;
    }
}
