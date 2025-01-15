<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nav extends Model
{
    /** @use HasFactory<\Database\Factories\NavFactory> */
    use HasFactory;

    protected $fillable = [
        'megnevezes',
        'url',
        'componentName',
    ];
}
