import { api } from "@/lib/api/client";
import { KeyedApiResponse } from "@/types";

export type Brand = {
  id: string;
  brand_name: string;
};

export interface BrandsResponse {
  brands: Brand[];
}

export type BrandDropdownOption = {
  value: string;
  label: string;
};

const fetchBrands = async (): Promise<KeyedApiResponse<BrandsResponse>> => {
  const res = await api.get<KeyedApiResponse<BrandsResponse>>("/brands");
  return res.data;
};

export const brandsEndpoints = {
  fetchBrands,
};
