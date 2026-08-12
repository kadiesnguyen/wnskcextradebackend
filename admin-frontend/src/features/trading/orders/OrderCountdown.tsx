"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/useI18n";
import type { ContractOrder } from "./types";

/** DB `time` is minutes; web countdown uses seconds via selltime/intselltime. */
export function orderDurationSeconds(order: Pick<ContractOrder, "time">): number {
  const minutes = Number(order.time);
  if (!Number.isFinite(minutes) || minutes <= 0) return 0;
  return Math.floor(minutes * 60);
}

export function orderRemainingSeconds(
  order: Pick<ContractOrder, "intselltime" | "selltime" | "status">,
  nowMs: number = Date.now(),
): number {
  if (Number(order.status) !== 1) return 0;

  if (order.intselltime && Number(order.intselltime) > 0) {
    return Math.max(Number(order.intselltime) - Math.floor(nowMs / 1000), 0);
  }

  if (order.selltime) {
    const raw = String(order.selltime).trim();
    // MySQL "Y-m-d H:i:s" -> ISO-ish so Date.parse is reliable
    const end = Date.parse(raw.includes("T") ? raw : raw.replace(" ", "T"));
    if (!Number.isNaN(end)) {
      return Math.max(Math.floor((end - nowMs) / 1000), 0);
    }
  }

  return 0;
}

type OrderCountdownProps = {
  order: ContractOrder;
};

export function OrderCountdown({ order }: OrderCountdownProps) {
  const { t } = useI18n();
  const duration = orderDurationSeconds(order);
  const [remaining, setRemaining] = useState(() => orderRemainingSeconds(order));

  useEffect(() => {
    setRemaining(orderRemainingSeconds(order));
    const id = setInterval(() => {
      setRemaining(orderRemainingSeconds(order));
    }, 1000);
    return () => clearInterval(id);
  }, [order]);

  const isOpen = Number(order.status) === 1;

  return (
    <div className="flex min-w-0 flex-col gap-0.5 tabular-nums">
      <span
        className={`whitespace-nowrap text-sm font-semibold ${
          isOpen && remaining > 0 ? "text-success" : "text-muted"
        }`}
        title={t("common.countdown")}
      >
        {remaining}s
      </span>
      <span
        className="whitespace-nowrap text-xs text-muted"
        title={t("common.duration")}
      >
        {duration}s
      </span>
    </div>
  );
}
