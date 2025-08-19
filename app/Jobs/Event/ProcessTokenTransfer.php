<?php

namespace App\Jobs\Event;

use App\Models\Token;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessTokenTransfer implements ShouldQueue
{
    use Queueable;

    public function __construct(public $tokenId, public $to)
    {}

    public function handle(): void
    {
        Token::query()->updateOrCreate([
            'token_id' => $this->tokenId
        ],[
            'owner' => $this->to
        ]);
    }
}
