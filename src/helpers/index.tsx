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
