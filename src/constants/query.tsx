import { TableQueryParams } from "@/hooks/use-table-state";

export const defaultQueryParams: TableQueryParams = {
  page: 1,
  limit: 10,
  sort_by: "created_at",
  sort_order: "DESC",
  search: "",
};
