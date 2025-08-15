<?php

namespace App\Http\Controllers;

use App\Models\NFT;
use App\Models\Token;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventsController extends Controller
{
    public function tokenTransfer(Request $request): JsonResponse
    {
        logger($request);

        Token::query()->updateOrCreate([
            'token_id' => $request->tokenId
        ],[
            'owner' => $request->to
        ]);

        return response()->json([
            'message' => 'Owner update successfully'
        ]);
    }

    public function metadataAssigned(Request $request): JsonResponse
    {
        logger($request);

        $nft = NFT::query()->where('metadata_id', $request->metadataId)->first();

        Token::query()->updateOrCreate([
            'token_id' => $request->tokenId,
        ], [
            'nft_id' => $nft->id
        ]);

        return response()->json([
            'message' => 'Owner update successfully'
        ]);
    }
}
