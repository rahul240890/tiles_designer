import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@mui/material/styles";
import { Card, CardContent, Typography, Box, Fab, Stack } from "@mui/material";
import { IconShoppingBag } from "@tabler/icons-react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MonthlySales = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const optionsmonthlychart: any = {
    grid: {
      show: true,
      borderColor: "transparent",
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    colors: [primary],
    chart: {
      toolbar: {
        show: false,
      },
      foreColor: "#adb0bb",
      fontFamily: "inherit",
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 2,
      curve: "smooth",
    },
     tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };
  const seriesmonthlychart: any = [
    {
      name: "Monthly Sales",
      data: [35, 60, 30, 55, 40],
    },
  ];
  return (
    <Card
      sx={{
        pb: 0,
        pl: 0,
        pr: 0,
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="h5" color="textSecondary">
              Monthly Sales
            </Typography>
            <Typography variant="h2">3,246</Typography>
          </Box>
          <Fab size="medium" aria-label="add" color="primary">
            <IconShoppingBag width="20" height="20" />
          </Fab>
        </Stack>
      </CardContent>
      <Chart
        options={optionsmonthlychart}
        series={seriesmonthlychart}
        type="area"
        height={90}
        width={"100%"}
      />
    </Card>
  );
};

export default MonthlySales;
