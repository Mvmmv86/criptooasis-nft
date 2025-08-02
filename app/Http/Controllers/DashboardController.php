<?php

namespace App\Http\Controllers;

use App\Models\NFT;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $nfts = NFT::query()->paginate(10);

        return Inertia::render('dashboard', [
            'nfts' => $nfts
        ]);
    }
}
