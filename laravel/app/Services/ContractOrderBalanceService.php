<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\Hyorder;
use Illuminate\Support\Collection;

class ContractOrderBalanceService
{
    /**
     * @param  Collection<int, Hyorder>  $orders
     * @return array<int, array{balance_before: ?float, balance_after: ?float, profit_loss: ?float}>
     */
    public function forOrders(Collection $orders): array
    {
        if ($orders->isEmpty()) {
            return [];
        }

        $balances = [];

        foreach ($orders as $order) {
            $buyBill = Bill::query()
                ->where('uid', $order->uid)
                ->where('type', 3)
                ->where('addtime', $order->buytime)
                ->orderBy('id')
                ->first(['id', 'num', 'afternum']);

            if (!$buyBill) {
                $balances[$order->id] = [
                    'balance_before' => null,
                    'balance_after' => null,
                    'profit_loss' => null,
                ];
                continue;
            }

            $settleBill = Bill::query()
                ->where('uid', $order->uid)
                ->where('type', 4)
                ->where('id', '>', $buyBill->id)
                ->orderBy('id')
                ->first(['num', 'afternum']);

            $balanceBefore = round((float) $buyBill->afternum + (float) $buyBill->num, 2);
            $balanceAfter = $settleBill ? round((float) $settleBill->afternum, 2) : null;
            $profitLoss = $balanceAfter !== null
                ? round($balanceAfter - $balanceBefore, 2)
                : null;

            $balances[$order->id] = [
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'profit_loss' => $profitLoss,
            ];
        }

        return $balances;
    }
}
