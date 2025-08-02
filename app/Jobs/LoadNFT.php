<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Collection;

class LoadNFT implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $maxSupply = config('services.pinata.max_supply');

        collect(range(1, $maxSupply))->chunk(10)
            ->each(
                fn(Collection $keys) => GetSaveNFT::dispatch($keys)
            );
    }
}
