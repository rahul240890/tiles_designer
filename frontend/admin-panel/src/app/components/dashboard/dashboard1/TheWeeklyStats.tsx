import React from "react";
import {
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Tooltip,
} from "@mui/material";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import DashboardCard from "../../shared/DashboardCard";
import { IconDots, IconMessage2 } from "@tabler/icons-react";
import { IconShoppingCart } from "@tabler/icons-react";
import { IconStar } from "@tabler/icons-react";

const options = ["Action", "Another Action", "Something else here"];

const weeks = [
  {
    avatarbg: "secondary.main",
    icon: <IconShoppingCart width="20" height="20" />,
    title: "Top Sales",
    subtitle: "Johnathan Doe",
    profit: "+68%",
  },
  {
    avatarbg: "warning.main",
    icon: <IconStar width="20" height="20" />,
    title: "Best Seller",
    subtitle: "MaterialPro Admin",
    profit: "+68%",
  },
  {
    avatarbg: "success.main",
    icon: <IconMessage2 width="20" height="20" />,
    title: "Most Commented",
    subtitle: "Ample Admin",
    profit: "+68%",
  },
];

const WeeklyStats = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // chart
  const optionsweekstats: any = {
    chart: {
      height: 145,
      type: "area",
      foreColor: "#adb0bb",
      fontFamily: "inherit",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    colors: [primary],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "solid",
      opacity: 0.05,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
    grid: {
      show: false,
      padding: {
        right: 0,
        left: 0,
      },
    },
  };
  const seriesweekstats: any = [
    {
      name: "Weekly Stats",
      data: [40, 60, 50, 65],
    },
  ];
  return (
    <DashboardCard
      title="Weekly Stats"
      action={
        <Box>
          <Tooltip title="Action">
            <IconButton
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
              size="large"
              aria-label="action"
            >
              <IconDots width="20" height="20" />
            </IconButton>
          </Tooltip>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option}
                selected={option === "Pyxis"}
                onClick={handleClose}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      }
      footer={
        <>
          <Box px="30px" mt={-3}>
            {weeks.map((week) => (
              <Box
                key={week.title}
                display="flex"
                alignItems="center"
                gap={2}
                mb={3}
              >
                <Avatar
                  sx={{
                    backgroundColor: week.avatarbg,
                    color: "#fff",
                    width: 45,
                    height: 45,
                  }}
                >
                  {week.icon}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="700">
                    {week.title}
                  </Typography>

                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    {week.subtitle}
                  </Typography>
                </Box>
                <Box ml="auto">
                  {/* <WeekList> */}
                  <Chip
                    color="default"
                    size="small"
                    sx={{
                      borderRadius: "6px",
                      color: () => theme.palette.grey[400],
                    }}
                    label={week.profit}
                  />
                  {/* </WeekList> */}
                </Box>
              </Box>
            ))}
          </Box>
          <Box mt={1}>
            <Chart
              options={optionsweekstats}
              series={seriesweekstats}
              type="area"
              height={160}
              width={"100%"}
            />
          </Box>
        </>
      }
    >
      <>{/* List */}</>
    </DashboardCard>
  );
};

export default WeeklyStats;
