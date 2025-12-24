<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfessionalExperience extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position',
        'company',
        'location',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'achievements',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'achievements' => 'array',
    ];

    /**
     * Relation avec l'utilisateur.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Récupère la durée en années.
     */
    public function getDurationInYearsAttribute(): float
    {
        $end = $this->is_current ? now() : $this->end_date;
        return $this->start_date->diffInYears($end);
    }

    /**
     * Récupère la durée formatée.
     */
    public function getFormattedDurationAttribute(): string
    {
        $start = $this->start_date->format('M Y');
        
        if ($this->is_current) {
            return "{$start} - Présent";
        }
        
        $end = $this->end_date->format('M Y');
        return "{$start} - {$end}";
    }
}
