"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setClosedOrderResult } from "./api";
import { closehistoryQueryKey } from "./useCloseHistory";

export function useCloseHistoryActions() {
  const queryClient = useQueryClient();

  const flipResult = useMutation({
    mutationFn: ({ id, kongyk }: { id: number; kongyk: 1 | 2 }) =>
      setClosedOrderResult(id, kongyk),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: closehistoryQueryKey });
    },
  });

  return { flipResult };
}
