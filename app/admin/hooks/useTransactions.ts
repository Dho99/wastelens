import { useQuery } from "@tanstack/react-query";
import { getCoinTransactions, getProductRedemptions } from "../services/transactions";

export function useCoinTransactions(page: number) {
  return useQuery({
    queryKey: ["admin-coin-tx", page],
    queryFn: () => getCoinTransactions(page),
  });
}

export function useProductRedemptions(page: number) {
  return useQuery({
    queryKey: ["admin-redemptions", page],
    queryFn: () => getProductRedemptions(page),
  });
}
