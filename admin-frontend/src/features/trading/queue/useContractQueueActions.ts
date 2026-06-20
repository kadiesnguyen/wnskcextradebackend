"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractQueueAction } from "./api";
import type { QueueAction } from "./types";

export function useContractQueueActions() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "contract-queue"] });
  };

  const action = useMutation({
    mutationFn: (queueAction: QueueAction) => contractQueueAction(queueAction),
    onSuccess: invalidate,
  });

  return { action };
}
