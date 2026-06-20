<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ListContractOrdersRequest;
use App\Http\Requests\Admin\SetContractWinLossRequest;
use App\Http\Resources\Admin\ContractOrderResource;
use App\Models\Hyorder;
use App\Services\HyorderSettlementService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ContractOrderController extends Controller
{
    public function index(ListContractOrdersRequest $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $username = $request->input('username');

        $query = Hyorder::query()
            ->where('status', 1)
            ->orderByDesc('id');

        if ($username !== null && $username !== '') {
            $query->where('username', $username);
        }

        if ($request->filled('hyzd') && (int) $request->input('hyzd') > 0) {
            $query->where('hyzd', (int) $request->input('hyzd'));
        }

        $paginator = $query->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => ContractOrderResource::collection(collect($paginator->items())),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    /**
     * Poll for unseen pending contract orders (ThinkPHP Trade/gethyorder).
     */
    public function pendingCount(): JsonResponse
    {
        $count = Hyorder::query()
            ->where('status', 1)
            ->where('tznum', 0)
            ->count();

        $payload = [
            'status' => true,
            'data' => [
                'count' => $count,
                'has_new' => $count > 0,
            ],
        ];

        if ($count > 0) {
            $payload['code'] = 1;
        }

        return response()->json($payload);
    }

    /**
     * Mark unseen pending contract orders as notified (ThinkPHP Trade/settzstatus).
     */
    public function markNotified(): JsonResponse
    {
        $updated = Hyorder::query()
            ->where('status', 1)
            ->where('tznum', 0)
            ->update(['tznum' => 1]);

        $payload = [
            'status' => true,
            'message' => 'Successfully.',
            'data' => [
                'updated' => $updated,
            ],
        ];

        if ($updated > 0) {
            $payload['code'] = 1;
        }

        return response()->json($payload);
    }

    /**
     * Set controlled profit/loss for a contract order (ThinkPHP Trade/setwinloss).
     */
    public function setWinLoss(SetContractWinLossRequest $request): JsonResponse
    {
        $order = Hyorder::query()->find((int) $request->input('id'));

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Missing params.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $updated = $order->update([
            'kongyk' => (int) $request->input('kongyk'),
        ]);

        if (!$updated) {
            return response()->json([
                'status' => false,
                'message' => 'System error.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json([
            'status' => true,
            'message' => 'Successfully.',
        ]);
    }

    /**
     * Manually settle a stuck pending order (ThinkPHP Trade/manualApprove).
     */
    public function manualSettle(int $id, HyorderSettlementService $settlement): JsonResponse
    {
        $order = Hyorder::query()->find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found.',
            ], Response::HTTP_NOT_FOUND);
        }

        if ((int) $order->status !== 1) {
            return response()->json([
                'status' => false,
                'message' => 'Order is not pending settlement.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $settlement->settle($order);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage() ?: 'System error.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json([
            'status' => true,
            'message' => 'Order settled successfully.',
        ]);
    }

    /**
     * Settle all overdue stuck orders (admin recovery).
     */
    public function settleStuck(HyorderSettlementService $settlement): JsonResponse
    {
        $result = $settlement->settleDueOrders();

        return response()->json([
            'status' => true,
            'message' => $result['settled'] > 0
                ? "Settled {$result['settled']} stuck order(s)."
                : 'No overdue orders to settle.',
            'data' => $result,
        ]);
    }

    /**
     * Settled contract orders (ThinkPHP Trade/hylog).
     */
    public function closed(ListContractOrdersRequest $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $username = $request->input('username');
        $invit = $request->input('invit');

        $query = Hyorder::query()
            ->where('status', 2)
            ->orderByDesc('id');

        if ($username !== null && $username !== '') {
            $query->where('username', $username);
        }

        if ($invit !== null && $invit !== '') {
            $query->where('invit', $invit);
        }

        $paginator = $query->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => ContractOrderResource::collection(collect($paginator->items())),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }
}
