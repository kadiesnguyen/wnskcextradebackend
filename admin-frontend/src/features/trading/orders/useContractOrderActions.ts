"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setContractWinLoss, settleContractOrder, settleStuckContractOrders } from "./api";

export function useContractOrderActions() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "contract-orders"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "pending-counts"] });
  };

  const setWinLoss = useMutation({
    mutationFn: setContractWinLoss,
    onSuccess: invalidate,
  });

  const manualSettle = useMutation({
    mutationFn: settleContractOrder,
    onSuccess: invalidate,
  });

  const settleStuck = useMutation({
    mutationFn: settleStuckContractOrders,
    onSuccess: invalidate,
  });

  return { setWinLoss, manualSettle, settleStuck };
}
