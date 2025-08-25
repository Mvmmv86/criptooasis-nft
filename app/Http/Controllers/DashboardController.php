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
            ->orderByRaw('owner is not null desc')
            ->orderBy('token_id')
            ->paginate(10);

        return Inertia::render('dashboard/index', [
            'nfts' => $nfts
        ]);
    }

    public function ranking()
    {
        $owners = NFT::query()
            ->leftJoin('tokens', 'tokens.nft_id', '=', 'n_f_t_s.id')
            ->whereNotNull('owner')
            ->selectRaw('
                count(*) as total,
                owner
            ')
            ->groupBy('owner')
            ->orderBy('total', 'desc')
            ->paginate(10);

        $tops = NFT::query()
            ->leftJoin('tokens', 'tokens.nft_id', '=', 'n_f_t_s.id')
            ->whereNotNull('owner')
            ->selectRaw('
                count(*) as total,
                owner
            ')
            ->groupBy('owner')
            ->orderBy('total', 'desc')
            ->limit(3)
            ->get();

        return Inertia::render('dashboard/ranking', [
            'owners' => $owners,
            'tops' => $tops
        ]);
    }
}
