<?php

namespace App\Console\Commands;

use App\Jobs\LoadNFT;
use Illuminate\Console\Command;

class SyncNFT extends Command
{
    protected $signature = 'app:sync-nft';

    protected $description = 'Sync NFT';

    public function handle()
    {
        LoadNFT::dispatch();
    }
}
