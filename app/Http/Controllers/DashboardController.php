<?php

namespace App\Http\Controllers;

use App\Models\NFT;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $nfts = NFT::query()
            ->leftJoin('tokens', 'tokens.nft_id', '=', 'n_f_t_s.id')
            ->select(['metadata_id', 'image', 'image_url', 'name', 'description', 'attributes', 'token_id', 'owner'])
            ->orderByDesc('owner')
            ->orderBy('token_id')
            ->orderBy('metadata_id')
            ->paginate(10);

        return Inertia::render('dashboard', [
            'nfts' => $nfts
        ]);
    }
}
