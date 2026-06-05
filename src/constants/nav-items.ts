import { Icons } from "@/components/shared/icons";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
};

export const NAV_ITEMS: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: Icons.dashboard },
  { title: "Inventory", url: "/dashboard/inventory", icon: Icons.product },
  { title: "Orders", url: "/dashboard/orders", icon: Icons.package },
  { title: "Customers", url: "/dashboard/customers", icon: Icons.user2 },
];
