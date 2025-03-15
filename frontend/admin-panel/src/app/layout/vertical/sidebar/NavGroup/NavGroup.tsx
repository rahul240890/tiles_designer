import { ListSubheader, styled, Theme } from "@mui/material";
import { IconDots } from "@tabler/icons-react";
import React from "react";
import { useSelector, useDispatch } from "@/store/hooks";
import { AppState } from "@/store/store";

type NavGroup = {
  navlabel?: boolean;
  subheader?: string;
};

interface ItemType {
  item: NavGroup;
  hideMenu: string | boolean;
}

const NavGroup = ({ item, hideMenu }: ItemType) => {
  const customizer = useSelector((state: AppState) => state.customizer);

  const ListSubheaderStyle = styled((props: Theme | any) => (
    <ListSubheader disableSticky {...props} />
  ))(({ theme }) => ({
    ...theme.typography.overline,
    fontWeight: "500",
    marginTop: "32px",
    marginBottom: "16px",
    lineHeight: "26px",
    padding: "3px 12px",
    marginLeft: hideMenu ? "" : "-10px",
    fontSize: "14px",
    opacity: 0.7,
    ...(customizer.isCollapse && {
      [theme.breakpoints.up("lg")]: {
        textAlign: "center",
      },
    }),
    ...(customizer!.isSidebarHover && {
      [theme.breakpoints.up("lg")]: {
        textAlign: "left",
      },
    }),
  }));

  return (
    <ListSubheaderStyle>
      {hideMenu ? <IconDots size="14" /> : item?.subheader}
    </ListSubheaderStyle>
  );
};

export default NavGroup;
