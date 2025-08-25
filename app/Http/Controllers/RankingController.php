<?php

namespace App\Http\Controllers;

use App\Models\NFT;
use Inertia\Inertia;

class RankingController extends Controller
{
    public function index()
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
            ->get();

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

        return Inertia::render('ranking', [
            'owners' => $owners,
            'tops' => $tops
        ]);
    }
}
