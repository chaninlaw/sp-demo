import { queryOptions } from "@tanstack/react-query";
import { fetchVehiclesFromSheet } from "@/shared/api";

export const vehicleQueryOptions = queryOptions({
  queryKey: ["vehicles"],
  queryFn: fetchVehiclesFromSheet,
  refetchInterval: 30_000,
  staleTime: 25_000,
});
