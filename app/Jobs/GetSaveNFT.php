<?php

namespace App\Jobs;

use App\Models\NFT;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

class GetSaveNFT implements ShouldQueue
{
    use Queueable;

    public function __construct(public Collection $keys) {}

    public function handle(): void
    {
        $gateway = config('services.pinata.gateway');
        $ipfs = config('services.pinata.ipfs');
        $baseUrl = 'https://' . $gateway . '/ipfs/';

        logger('gateway: ' . $gateway);
        logger('ipfs: ' . $ipfs);
        logger('baseUrl: ' . $baseUrl);

        $this->keys->each(function ($key) use ($baseUrl, $ipfs) {
            $response = Http::get($baseUrl  . $ipfs . '/' . $key . '.json');

            logger('key: ' . $key);

            $data = $response->json();

            logger('data: ' . json_encode($data));

            $imageUrl = $baseUrl . str($data['image'])->after('ipfs://');

            NFT::query()->updateOrCreate([
                'metadata_id' => $key,
                'image'       => $data['image'],
                'image_url'   => $imageUrl,
                'name'        => $data['name'],
                'description' => $data['description'],
                'attributes'  => $data['attributes'],
            ]);
        });
    }
}
