import React from "react";
import { CardContent, Typography, Grid2 as Grid, Avatar, Stack } from "@mui/material";
import {
  IconBox,
  IconChartBar,
  IconRefresh,
  IconUsers,
} from "@tabler/icons-react";
import BlankCard from "../../shared/BlankCard";

const sales = [
  {
    bg: "primary",
    icon: <IconUsers size={24} />,
    digits: "39,354",
    subtext: "Customers",
    profit: "-9",
    type: "loss",
  },
  {
    bg: "warning",
    icon: <IconBox size={24} />,
    digits: "4,396",
    subtext: "Products",
    profit: "+23",
    type: "profit",
  },
  {
    bg: "error",
    icon: <IconChartBar size={24} />,
    digits: "423,39",
    subtext: "Sales",
    profit: "+38",
    type: "profit",
  },
  {
    bg: "success",
    icon: <IconRefresh size={24} />,
    digits: "835",
    subtext: "Refunds",
    profit: "-12",
    type: "loss",
  },
];

const TopCards = () => (
  <BlankCard>
    <Grid container spacing={0}>
      {sales.map((topcard) => (
        <Grid
          key={topcard.digits}
          sx={{
            "&:last-child .MuiCardContent-root": {
              borderRight: "0",
            },
          }}
          size={{
            xs: 6,
            lg: 3,
            sm: 3
          }}>
          <CardContent
            sx={{
              borderRight: {
                xs: "0",
                sm: "1px solid rgba(0,0,0,0.1)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: topcard.bg + ".light",
                color: topcard.bg + ".main",
              }}
            >
              {topcard.icon}
            </Avatar>

            <Stack direction="row" alignItems="center" spacing={1} mt={2}>
              <Typography variant="h3">{topcard.digits}</Typography>
              <Typography
                color={
                  topcard.type === "profit" ? "success.main" : "error.main"
                }
                variant="caption"
              >
                {topcard.profit}%
              </Typography>
            </Stack>
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              {topcard.subtext}
            </Typography>
          </CardContent>
        </Grid>
      ))}
    </Grid>
  </BlankCard>
);

export default TopCards;
