import { api } from "@/lib/api/client";
import { KeyedApiResponse } from "@/types";
import { CategoriesResponse } from "@/types/category";

export const categoriesEndpoints = {
  async fetchCategories(): Promise<KeyedApiResponse<CategoriesResponse>> {
    const res =
      await api.get<KeyedApiResponse<CategoriesResponse>>("/categories");
    return res.data;
  },
};
