import { apiClient } from "@/lib/api-client";
import type { QueueAction, QueueActionResponse, QueueListResponse } from "./types";

export function fetchContractQueue(): Promise<QueueListResponse> {
  return apiClient<QueueListResponse>("/contract-queue");
}

export function contractQueueAction(action: QueueAction): Promise<QueueActionResponse> {
  return apiClient<QueueActionResponse>("/contract-queue/action", {
    method: "POST",
    body: { action },
  });
}
