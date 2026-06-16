import { KeyedApiResponse } from "@/types";
import { serverFetch } from "@/lib/api/server";
import { BrandsResponse } from "@/services/brand";

export async function fetchBrands(): Promise<KeyedApiResponse<BrandsResponse>> {
  const res = await serverFetch<KeyedApiResponse<BrandsResponse>>("/brands");
  return res;
}
