"use client";

import { useQuery } from "@tanstack/react-query";
import { api, unwrapApi } from "@/lib/api";
import { Cart } from "@/types";
import { isAuthenticated } from "@/lib/auth";

export function useCart() {
  const { data: cart, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await api.get("/cart/");
      return unwrapApi<Cart>(response.data);
    },
    enabled: isAuthenticated(),
  });

  const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return {
    cart,
    itemCount,
    isLoading,
    error
  };
}
