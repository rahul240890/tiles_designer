import React from "react";
import { Typography, Box, Divider, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import ThemeSelect from "./ThemeSelect";
import DashboardCard from "../../shared/DashboardCard";
import { IconShoppingCart } from "@tabler/icons-react";

const TotalSales = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const warning = theme.palette.warning.main;
  const grey = theme.palette.grey.A100;
  const optionstotalsales: any = {
    labels: ["2024", "2023", "2022"],

    chart: {
      height: 280,
      type: "donut",
      foreColor: "#adb0bb",
      fontFamily: "inherit",
    },
    colors: [primary, secondary, grey],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      colors: ["transparent"],
    },
    plotOptions: {
      pie: {
        donut: {
          size: "78%",
          background: "transparent",
          labels: {
            show: false,
            name: {
              show: true,
              fontSize: "18px",
              color: undefined,
              offsetY: -10,
            },
            value: {
              show: false,
              color: "#98aab4",
            },
            total: {
              show: false,
              label: "Our Visitors",
              color: "#98aab4",
            },
          },
        },
      },
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };
  const seriestotalsales: any = [25, 35, 35];
  return (
    <DashboardCard title="Total Sales" action={<ThemeSelect />}>
      <>
        <Divider style={{ marginTop: "0px" }} />

        <Stack direction="row" alignItems="center" mt={3} justifyContent="space-between">
          <Typography
            color="textSecondary"
            variant="body1"
            sx={{
              fontSize: "h5.fontSize",
            }}
          >
            Sales Yearly
          </Typography>
          <Typography variant="h2" fontWeight="700">
            8,364,398
          </Typography>
        </Stack>
        {/* chart */}
        <Box
          sx={{
            mt: 5,
            position: "relative",
          }}
        >
          <Chart
            options={optionstotalsales}
            series={seriestotalsales}
            type="donut"
            height={280}
            width={"100%"}
          />
          <Typography
            color="textSecondary"
            sx={{
              position: "absolute",
              left: "46%",
              top: "45%",
            }}
          >
            <IconShoppingCart height="30" width="30" />
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            mt: 5,
          }}
        >
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                backgroundColor: primary,
                borderRadius: "50%",
                height: 8,
                width: 8,
                mr: 1,
              }}
            />
            <Typography color="textSecondary" variant="h6">
              2024
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                backgroundColor: secondary,
                borderRadius: "50%",
                height: 8,
                width: 8,
                mr: 1,
              }}
            />
            <Typography color="textSecondary" variant="h6">
              2023
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                backgroundColor: warning,
                borderRadius: "50%",
                height: 8,
                width: 8,
                mr: 1,
              }}
            />
            <Typography color="textSecondary" variant="h6">
              2022
            </Typography>
          </Box>
        </Box>
      </>
    </DashboardCard>
  );
};

export default TotalSales;
