"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchContractOrders } from "./api";
import type { ContractOrdersListParams } from "./types";

export function useContractOrders(params: ContractOrdersListParams) {
  return useQuery({
    queryKey: ["admin", "contract-orders", params],
    queryFn: () => fetchContractOrders(params),
    placeholderData: (prev) => prev,
  });
}
