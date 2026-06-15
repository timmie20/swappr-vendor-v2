import { CreateProductPayload } from "@/features/inventory/types";
import { ProductFormData } from "@/schemas/product";
import { format, formatDistanceToNow } from "date-fns";

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

export const formatDate = (date?: string) => {
  if (!date) return null;
  return {
    full: format(new Date(date), "dd MMM yyyy • hh:mm a"),
    relative: formatDistanceToNow(new Date(date), { addSuffix: true }),
  };
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export function formatToOptions<T extends Record<string, any>>(
  data: T[],
  keys: [keyof T, keyof T],
): { value: any; label: any }[] {
  const [valueKey, labelKey] = keys;
  return data.map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
  }));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export const normalizePayload = (
  data: ProductFormData,
): CreateProductPayload => {
  return {
    ...data,

    base_price:
      data.base_price && data.base_price.trim() !== ""
        ? Number(data.base_price)
        : undefined,

    total_stock:
      data.total_stock && data.total_stock.trim() !== ""
        ? Number(data.total_stock)
        : undefined,

    ...(data.carrier_status && {
      carrier_status: data.carrier_status,
    }),

    variants: data.variants.map((variant) => ({
      ...variant,

      storage: Number(variant.storage),

      price: Number(variant.price),

      stock_quantity: Number(variant.stock_quantity),
    })),
  };
};
