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
