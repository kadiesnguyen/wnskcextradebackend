import { apiClient } from "@/lib/api-client";
import { toQuery } from "@/lib/to-query";
import type { ActionResponse } from "../orders/types";
import type { OrderListParams, OrderListResponse } from "./types";

export function fetchOrders(params: OrderListParams = {}): Promise<OrderListResponse> {
  return apiClient<OrderListResponse>(
    "/contract-orders/closed" +
      toQuery({
        page: params.page,
        per_page: params.per_page ?? 15,
        username: params.username,
      }),
  );
}

/** Flip settled loss → win or win → loss (admin win-loss + forceResult). */
export function setClosedOrderResult(
  id: number,
  kongyk: 1 | 2,
): Promise<ActionResponse> {
  return apiClient<ActionResponse>("/contract-orders/win-loss", {
    method: "PUT",
    body: { id, kongyk },
  });
}
