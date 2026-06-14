import { KeyedApiResponse } from "@/types";
import { CategoriesResponse } from "@/types/category";
import { serverFetch } from "@/lib/api/server";

export async function fetchCategories(): Promise<
  KeyedApiResponse<CategoriesResponse>
> {
  const res =
    await serverFetch<KeyedApiResponse<CategoriesResponse>>("/categories");
  return res;
}
