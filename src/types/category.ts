export type CategoryType = "device" | "accessory";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  //capabilities
  supports_variants: boolean;
  supports_carrier_status: boolean;
  supports_stock_tracking: boolean;
  supports_specifications: boolean;
  supports_swapping: boolean;
  sub_categories: { id: string; name: string }[]; // Optional for top-level categories
};

export interface CategoriesResponse {
  categories: Category[];
}
