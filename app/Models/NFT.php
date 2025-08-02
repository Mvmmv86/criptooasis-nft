<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NFT extends Model
{
    protected $fillable = [
        'uri',
        'image',
        'image_url',
        'name',
        'description',
        'attributes'
    ];

    protected $casts = [
        'attributes' => 'array'
    ];
}
