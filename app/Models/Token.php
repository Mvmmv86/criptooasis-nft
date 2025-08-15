<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Token extends Model
{
    protected $fillable = [
        'nft_id',
        'token_id',
        'owner'
    ];

    public function nft(): BelongsTo
    {
        return $this->belongsTo(NFT::class);
    }
}
