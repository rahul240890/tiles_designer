import React from "react";
import Link from "next/link";
import {
  ListItemIcon,
  List,
  styled,
  ListItemText,
  Chip,
  useTheme,
  Typography,
  ListItemButton,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { useSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import { AppState } from "@/store/store";
import { TablerIconsProps } from "@tabler/icons-react";

interface NavGroup {
  id?: string;
  title?: string;
  icon?: (props: TablerIconsProps) => JSX.Element;
  href?: string;
  children?: NavGroup[];
  chip?: string;
  chipColor?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  variant?: "filled" | "outlined";
  external?: boolean;
  level?: number;
  disabled?: boolean; // Add disabled property
  subtitle?: string;  // Add subtitle property
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface ItemType {
  item: NavGroup;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  hideMenu?: any;
  level?: number;
  pathDirect: string;
}

export default function NavItem({
  item,
  level = 1,
  pathDirect,
  hideMenu,
  onClick,
}: ItemType) {
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const customizer = useSelector((state: AppState) => state.customizer);
  const Icon = item?.icon;
  const theme = useTheme();
  const { t } = useTranslation();
  const itemIcon = Icon ? (
    level > 1 ? (
      <Icon stroke={1.5} size="1rem" />
    ) : (
      <Icon stroke={1.5} size="1.3rem" />
    )
  ) : null;

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: "nowrap",
    padding: "5px 10px",
    gap: "10px",
    borderRadius: `${customizer.borderRadius}px`,
    marginBottom: level > 1 ? "3px" : "0px",
    backgroundColor: level > 1 ? "transparent !important" : "inherit",
    color:
      level > 1 && pathDirect === item?.href
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    "&.Mui-selected": {
      color: "white",
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
      },
    },
  }));

  const listItemProps: {
    component: any;
    href?: string;
    target?: string;
  } = {
    component: item?.external ? "a" : Link,
    href: item?.external ? item?.href : item?.href || "#",
    target: item?.external ? "_blank" : "",
  };

  return (
    <List component="li" disablePadding key={item?.id}>
      {item.href ? (
        <Link href={item.href}>
          <ListItemStyled
            disabled={item?.disabled} // Now recognized by TypeScript
            selected={pathDirect === item?.href}
            onClick={lgDown ? onClick : undefined}
          >
            {itemIcon && (
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  p: "3px 0",
                  color:
                    level > 1 && pathDirect === item?.href
                      ? `${theme.palette.primary.main}!important`
                      : "inherit",
                }}
              >
                {itemIcon}
              </ListItemIcon>
            )}
            <ListItemText>
              {hideMenu ? "" : <>{t(`${item?.title || ""}`)}</>}
              {item?.subtitle && (
                <Typography variant="caption">
                  {hideMenu ? "" : item.subtitle} // Now recognized by TypeScript
                </Typography>
              )}
            </ListItemText>
            {item?.chip && !hideMenu && (
              <Chip
                color={item.chipColor || "default"}
                variant={item.variant || "filled"}
                size="small"
                label={item.chip}
              />
            )}
          </ListItemStyled>
        </Link>
      ) : (
        <ListItemStyled
          disabled={item?.disabled} // Now recognized by TypeScript
          selected={pathDirect === item?.href}
          onClick={lgDown ? onClick : undefined}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: "auto",
                p: "3px 0",
                color:
                  level > 1 && pathDirect === item?.href
                    ? `${theme.palette.primary.main}!important`
                    : "inherit",
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}
          <ListItemText>
            {hideMenu ? "" : <>{t(`${item?.title || ""}`)}</>}
            {item?.subtitle && (
              <Typography variant="caption">
                {hideMenu ? "" : item.subtitle} // Now recognized by TypeScript
              </Typography>
            )}
          </ListItemText>
          {item?.chip && !hideMenu && (
            <Chip
              color={item.chipColor || "default"}
              variant={item.variant || "filled"}
              size="small"
              label={item.chip}
            />
          )}
        </ListItemStyled>
      )}
    </List>
  );
}