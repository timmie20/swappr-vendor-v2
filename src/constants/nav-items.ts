import { Icons } from "@/components/shared/icons";

export type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
};

export const NAV_ITEMS: NavItem[] = [
  { title: "Overview", url: "/overview", icon: Icons.dashboard },
  { title: "Inventory", url: "/inventory", icon: Icons.product },
  { title: "Orders", url: "/orders", icon: Icons.package },
  { title: "Customers", url: "/customers", icon: Icons.user2 },
  { title: "Account", url: "/account", icon: Icons.settings },
];
