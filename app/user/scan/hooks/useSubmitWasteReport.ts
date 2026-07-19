"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitWasteReport } from "../services/scan.client";
import type { SubmitPayload } from "../services/scan.client";
import type { ScanSubmitResponse } from "../types/scan.types";

export function useSubmitWasteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitPayload) => submitWasteReport(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["user-history"] });
    },
  });
}

export type SubmitVariables = SubmitPayload;

export type { ScanSubmitResponse };
