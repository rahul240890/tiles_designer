"use client";

import { useState, useEffect } from "react";
import getMenuItems from "../Menudata";
import { usePathname } from "next/navigation";
import { Box, List, Theme, useMediaQuery } from "@mui/material";
import { useSelector } from "@/store/hooks";
import NavItem from "../NavItem/NavItem";
import NavCollapse from "../NavCollapse/NavCollapse";
import { AppState } from "@/store/store";

const NavListing = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const pathname = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf("/"));
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : "";

  useEffect(() => {
    const fetchMenu = async () => {
      const items = await getMenuItems();
      setMenuItems(items);
    };
    fetchMenu();
  }, []);

  return (
    <Box>
      <List sx={{ p: 0, display: "flex", gap: "3px", zIndex: "100" }}>
        {menuItems.map((item) => {
          if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                onClick={undefined}
              />
            );
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={() => {}}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default NavListing;