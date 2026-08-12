<?php

namespace App\Services;

use App\Models\Hyorder;

/**
 * Contract payout rules:
 * - Win: return stake + profit (e.g. 100 + 5 = 105)
 * - Loss: return stake - loss (e.g. 100 - 5 = 95)
 * - UI ploss field shows profit/loss amount only (+5 / -5)
 */
class ContractSettlementMath
{
    public static function profitAmount(Hyorder $order): float
    {
        return round((float) $order->num * (float) $order->hybl / 100, 2);
    }

    public static function winPayout(Hyorder $order): float
    {
        return round((float) $order->num + self::profitAmount($order), 2);
    }

    public static function lossRefund(Hyorder $order): float
    {
        return round((float) $order->num - self::profitAmount($order), 2);
    }

    public static function settlementCredit(Hyorder $order): float
    {
        return (int) $order->is_win === 1
            ? self::winPayout($order)
            : self::lossRefund($order);
    }

    public static function winRemark(int $orderId): string
    {
        return 'Trade win bonus #' . $orderId;
    }

    public static function lossRemark(int $orderId): string
    {
        return 'Trade loss refund #' . $orderId;
    }

    public static function settlementRemark(Hyorder $order): string
    {
        return (int) $order->is_win === 1
            ? self::winRemark((int) $order->id)
            : self::lossRemark((int) $order->id);
    }

    /** Credit needed to flip a settled loss into a win: winPayout - lossRefund (= 2 * profit). */
    public static function lossToWinAdjustment(Hyorder $order): float
    {
        return round(self::winPayout($order) - self::lossRefund($order), 2);
    }

    public static function lossToWinRemark(int $orderId): string
    {
        return 'Trade loss-to-win adjust #' . $orderId;
    }

    public static function winToLossRemark(int $orderId): string
    {
        return 'Trade win-to-loss adjust #' . $orderId;
    }
}
