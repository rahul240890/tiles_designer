import { uniqueId } from "lodash";
import {
  IconUsers,
  IconBuilding,
  IconCreditCard,
  IconSettings,
  IconDashboard,
} from "@tabler/icons-react";

interface MenuitemsType {
  id?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  navlabel?: boolean;
  subheader?: string;
}

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconDashboard,
    href: "/admin/dashboard",
  },
  {
    id: uniqueId(),
    title: "Company Management",
    icon: IconBuilding,
    href: "/admin/companies",
  },
  {
    id: uniqueId(),
    title: "User Management",
    icon: IconUsers,
    href: "/admin/users",
  },
  {
    id: uniqueId(),
    title: "Subscription Plans",
    icon: IconCreditCard,
    href: "/admin/subscriptions",
  },
  {
    id: uniqueId(),
    title: "Settings",
    icon: IconSettings,
    href: "/admin/settings",
  },
];

export default Menuitems;