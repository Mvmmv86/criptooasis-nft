<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class NFT extends Model
{
    protected $fillable = [
        'metadata_id',
        'image',
        'image_url',
        'name',
        'description',
        'attributes',
    ];

    protected $casts = [
        'attributes' => 'array'
    ];

    public function token(): HasOne
    {
        return $this->hasOne(Token::class);
    }
}
