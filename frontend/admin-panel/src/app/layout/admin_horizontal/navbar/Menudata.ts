import {
  IconHome,
  IconUsers,
  IconUser,
  IconBuildingStore,
  IconLayersIntersect,
  IconCreditCard,
  IconChartHistogram,
  IconReport,
  IconSettings,
  IconShieldLock,
  IconLogout,
  IconPoint,
} from "@tabler/icons-react";
import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Admin Dashboard",
    icon: IconHome,
    href: "/admin/dashboard",
  },
  {
    id: uniqueId(),
    title: "User Management",
    icon: IconUsers,
    href: "/admin/users/",
    children: [
      {
        id: uniqueId(),
        title: "All Seller Users",
        icon: IconPoint,
        href: "/admin/users/sellerusers",
      },
      {
        id: uniqueId(),
        title: "All Admin Users",
        icon: IconPoint,
        href: "/admin/users/adminusers",
      },
      {
        id: uniqueId(),
        title: "Add Admin",
        icon: IconPoint,
        href: "/admin/users/adminusers/add",
      },
      
    ],
  },
  {
    id: uniqueId(),
    title: "Seller Management",
    icon: IconBuildingStore,
    href: "/admin/sellers/",
    children: [
      {
        id: uniqueId(),
        title: "All Sellers",
        icon: IconPoint,
        href: "/admin/sellers",
      },
      {
        id: uniqueId(),
        title: "Add Seller",
        icon: IconPoint,
        href: "/admin/sellers/add",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Tile Management",
    icon: IconLayersIntersect,
    href: "/admin/tiles/",
    children: [
      {
        id: uniqueId(),
        title: "All Tiles",
        icon: IconPoint,
        href: "/admin/tiles/list",
      },
      {
        id: uniqueId(),
        title: "Tile Categories",
        icon: IconPoint,
        href: "/admin/tiles/categories",
      },
      {
        id: uniqueId(),
        title: "AI-Generated Tiles",
        icon: IconPoint,
        href: "/admin/tiles/ai-generated",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Manage Attributes",
    icon: IconCreditCard,
    href: "/admin/attributes/",
    children: [
      {
        id: uniqueId(),
        title: "Manage Categories",
        icon: IconPoint,
        href: "/admin/attributes/categories",
      },
      {
        id: uniqueId(),
        title: "Manage Series",
        icon: IconPoint,
        href: "/admin/attributes/series",
      },
      {
        id: uniqueId(),
        title: "Manage Finishing",
        icon: IconPoint,
        href: "/admin/attributes/finishing",
      },
      {
        id: uniqueId(),
        title: "Manage Materials",
        icon: IconPoint,
        href: "/admin/attributes/materials",
      },
      {
        id: uniqueId(),
        title: "Manage Sizes",
        icon: IconPoint,
        href: "/admin/attributes/sizes",
      },
      {
        id: uniqueId(),
        title: "Manage Colors",
        icon: IconPoint,
        href: "/admin/attributes/colors",
      },
      {
        id: uniqueId(),
        title: "Manage Suitable Places",
        icon: IconPoint,
        href: "/admin/attributes/suitable_places",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Reports & Analytics",
    icon: IconChartHistogram,
    href: "/admin/reports",
    children: [
      {
        id: uniqueId(),
        title: "Seller Performance",
        icon: IconPoint,
        href: "/admin/reports/seller-performance",
      },
      {
        id: uniqueId(),
        title: "User Activity",
        icon: IconPoint,
        href: "/admin/reports/user-activity",
      },
      {
        id: uniqueId(),
        title: "Tile Trends",
        icon: IconPoint,
        href: "/admin/reports/tile-trends",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Logout",
    icon: IconLogout,
    href: "/logout",
  },
];

export default Menuitems;
