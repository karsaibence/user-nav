<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NavRole extends Model
{
    /** @use HasFactory<\Database\Factories\NavRoleFactory> */
    use HasFactory;
    protected $fillable = [
        'sorszam', 
        'parent',
        'role_id', 
        'nav_id', 
    ];
}
