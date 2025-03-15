import { fetchDynamicMenuData } from "@/app/sellers/api/dynamicMenuApi"; // Adjust path as needed
import {
  IconHome,
  IconPoint,
  IconFolder,
  IconLayersIntersect,
  IconZoomCode,
  IconRotate,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import { uniqueId } from "lodash";
import { TablerIconsProps } from "@tabler/icons-react";

// Define the menu item type for TypeScript
interface MenuItem {
  id: string;
  title: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  href?: string; // Make href optional for parent items with children
  children?: MenuItem[];
}

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const menuData = await fetchDynamicMenuData(); // Fetch dynamic data

    return [
      {
        id: uniqueId(),
        title: "Dashboard",
        icon: IconHome,
        href: "/sellers/dashboard",
      },
      {
        id: uniqueId(),
        title: "Collections",
        icon: IconFolder,
        href: "/sellers/collections/", // Optional, can be removed if not needed
        children: [
          {
            id: uniqueId(),
            title: "All Collections",
            icon: IconPoint,
            href: "/sellers/collections/list",
          },
          {
            id: uniqueId(),
            title: "Add New Collection",
            icon: IconPoint,
            href: "/sellers/collections/create",
          },
          {
            id: uniqueId(),
            title: "View Collections",
            icon: IconPoint,
            children: menuData.collections.map((collection) => ({
              id: uniqueId(),
              title: collection.name,
              icon: IconPoint,
              href: `/sellers/collections/tiles/${collection.id}`,
            })),
          },
          {
            id: uniqueId(),
            title: "Upload Tiles",
            icon: IconPoint,
            children: menuData.collections.map((collection) => ({
              id: uniqueId(),
              title: collection.name,
              icon: IconPoint,
              href: `/sellers/collections/upload/${collection.id}`,
            })),
          },
          {
            id: uniqueId(),
            title: "Favorite Collections",
            icon: IconPoint,
            href: "/sellers/collections/favorite",
          },
        ],
      },
      {
        id: uniqueId(),
        title: "Manage Tiles",
        icon: IconLayersIntersect,
        href: "/sellers/all_tiles/", // Optional
        children: [
          {
            id: uniqueId(),
            title: "All Tiles",
            icon: IconPoint,
            href: "/sellers/all_tiles/view",
          },
          {
            id: uniqueId(),
            title: "Tiles by Category",
            icon: IconPoint,
            children: menuData.filters.categories.map((c) => ({
              id: uniqueId(),
              title: c.name,
              icon: IconPoint,
              href: `/sellers/all_tiles/view/${c.id}`,
            })),
          },
          {
            id: uniqueId(),
            title: "Tiles by Size",
            icon: IconPoint,
            children: menuData.filters.sizes.map((s) => ({
              id: uniqueId(),
              title: s.name,
              icon: IconPoint,
              href: `/company/tiles/size/${s.id}`,
            })),
          },
          {
            id: uniqueId(),
            title: "Tiles by Series",
            icon: IconPoint,
            children: menuData.filters.series.map((s) => ({
              id: uniqueId(),
              title: s.name,
              icon: IconPoint,
              href: `/company/tiles/series/${s.id}`,
            })),
          },
          {
            id: uniqueId(),
            title: "Tiles by Finish",
            icon: IconPoint,
            children: menuData.filters.finishes.map((f) => ({
              id: uniqueId(),
              title: f.name,
              icon: IconPoint,
              href: `/company/tiles/finish/${f.id}`,
            })),
          },
          {
            id: uniqueId(),
            title: "Tiles by Material",
            icon: IconPoint,
            children: menuData.filters.materials.map((m) => ({
              id: uniqueId(),
              title: m.name,
              icon: IconPoint,
              href: `/company/tiles/material/${m.id}`,
            })),
          },
        ],
      },
      {
        id: uniqueId(),
        title: "AI Tile Design",
        icon: IconZoomCode,
        href: "/company/ai-design/",
        children: [
          {
            id: uniqueId(),
            title: "Generate AI Designs",
            icon: IconPoint,
            href: "/company/ai-design/generate",
          },
          {
            id: uniqueId(),
            title: "Manage AI Designs",
            icon: IconPoint,
            href: "/company/ai-design/list",
          },
        ],
      },
      {
        id: uniqueId(),
        title: "3D Visualization",
        icon: IconRotate,
        href: "/company/3d-visualization/",
        children: [
          {
            id: uniqueId(),
            title: "Live 3D Preview",
            icon: IconPoint,
            href: "/company/3d-visualization/live-preview",
          },
          {
            id: uniqueId(),
            title: "Saved 3D Designs",
            icon: IconPoint,
            href: "/company/3d-visualization/saved",
          },
        ],
      },
      {
        id: uniqueId(),
        title: "Company Profile",
        icon: IconUser,
        href: "/company/profile/",
        children: [
          {
            id: uniqueId(),
            title: "Edit Profile",
            icon: IconPoint,
            href: "/company/profile/edit",
          },
          {
            id: uniqueId(),
            title: "Change Password",
            icon: IconPoint,
            href: "/company/profile/change-password",
          },
          {
            id: uniqueId(),
            title: "Company Logo & Details",
            icon: IconPoint,
            href: "/company/profile/logo-details",
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
  } catch (error) {
    console.error("Error loading dynamic menu:", error);
    return [];
  }
};

export default getMenuItems;