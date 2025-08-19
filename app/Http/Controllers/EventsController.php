<?php

namespace App\Http\Controllers;

use App\Jobs\Event\ProcessTokenTransfer;
use App\Jobs\Event\ProcessMetadataAssigned;
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

        ProcessTokenTransfer::dispatch($request->tokenId, $request->to);

        return response()->json([
            'message' => 'Owner update successfully'
        ]);
    }

    public function metadataAssigned(Request $request): JsonResponse
    {
        logger($request);

        ProcessMetadataAssigned::dispatch($request->metadataId, $request->tokenId);

        return response()->json([
            'message' => 'Owner update successfully'
        ]);
    }
}
