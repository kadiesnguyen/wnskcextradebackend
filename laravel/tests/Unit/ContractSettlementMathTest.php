<?php

namespace Tests\Unit;

use App\Models\Hyorder;
use App\Services\ContractSettlementMath;
use PHPUnit\Framework\TestCase;

class ContractSettlementMathTest extends TestCase
{
    public function test_loss_to_win_adjustment_is_twice_profit(): void
    {
        $order = new Hyorder([
            'num' => 100,
            'hybl' => 5,
        ]);

        $this->assertSame(5.0, ContractSettlementMath::profitAmount($order));
        $this->assertSame(105.0, ContractSettlementMath::winPayout($order));
        $this->assertSame(95.0, ContractSettlementMath::lossRefund($order));
        $this->assertSame(10.0, ContractSettlementMath::lossToWinAdjustment($order));
    }

    public function test_loss_to_win_remark_includes_order_id(): void
    {
        $this->assertSame(
            'Trade loss-to-win adjust #42',
            ContractSettlementMath::lossToWinRemark(42),
        );
    }
}
