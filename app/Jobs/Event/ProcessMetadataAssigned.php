<?php

namespace App\Jobs\Event;

use App\Models\NFT;
use App\Models\Token;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessMetadataAssigned implements ShouldQueue
{
    use Queueable;
    public function __construct(public $metadataId, public $tokenId)
    {}
    public function handle(): void
    {
        $nft = NFT::query()->where('metadata_id', $this->metadataId)->first();

        Token::query()->updateOrCreate([
            'token_id' => $this->tokenId,
        ], [
            'nft_id' => $nft->id
        ]);
    }
}
