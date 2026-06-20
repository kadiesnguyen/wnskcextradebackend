<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ContractResultQueueActionRequest;
use App\Http\Resources\Admin\ContractResultQueueResource;
use App\Models\HyResultQueue;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ContractQueueController extends Controller
{
    /**
     * List session result queue entries (ThinkPHP Trade/resultQueuePanel).
     */
    public function index(): JsonResponse
    {
        $list = HyResultQueue::query()
            ->orderBy('round_no')
            ->orderBy('id')
            ->get();

        return response()->json([
            'status' => true,
            'code' => 1,
            'message' => 'Successfully.',
            'data' => ContractResultQueueResource::collection($list),
        ]);
    }

    /**
     * Mutate session result queue (ThinkPHP Trade/resultQueueAction).
     */
    public function action(ContractResultQueueActionRequest $request): JsonResponse
    {
        $action = $request->input('action');
        $now = time();

        if (in_array($action, ['next_win', 'next_loss'], true)) {
            HyResultQueue::query()->where('id', '>', 0)->delete();

            $created = HyResultQueue::query()->create([
                'round_no' => 1,
                'result' => $action === 'next_win' ? 'WIN' : 'LOSS',
                'addtime' => $now,
            ]);

            if (!$created) {
                return response()->json([
                    'status' => false,
                    'message' => 'System error.',
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            return response()->json([
                'status' => true,
                'code' => 1,
                'message' => 'Successfully.',
            ]);
        }

        if (in_array($action, ['add_win', 'add_loss'], true)) {
            $lastRound = (int) HyResultQueue::query()->max('round_no');
            $nextRound = max($lastRound + 1, 1);

            $created = HyResultQueue::query()->create([
                'round_no' => $nextRound,
                'result' => $action === 'add_win' ? 'WIN' : 'LOSS',
                'addtime' => $now,
            ]);

            if (!$created) {
                return response()->json([
                    'status' => false,
                    'message' => 'System error.',
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            return response()->json([
                'status' => true,
                'code' => 1,
                'message' => 'Successfully.',
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Parameter error.',
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
