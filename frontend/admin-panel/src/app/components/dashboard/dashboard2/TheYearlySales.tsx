import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import {
  Box,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Grid2 as Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconShoppingCart } from "@tabler/icons-react";
import BlankCard from "../../shared/BlankCard";

const YearlySales = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const warning = theme.palette.warning.main;
  const grey = theme.palette.grey[100];

  // chart
  const optionscolumnchart: any = {
    labels: ["2021", "2020", "2019", "2018"],
    chart: {
      type: "donut",
      height: 145,
      stacked: true,
      toolbar: { show: false },
      foreColor: "#adb0bb",
      fontFamily: "inherit",
      sparkline: { enabled: false },
    },
    colors: [secondary, primary, warning, grey],
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
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
      colors: ["transparent"],
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [25, 25, 25, 25];

  return (<>
    <BlankCard>
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={6}>
            <Box mb={5}>
              <Typography variant="h2">43,246</Typography>
              <Typography variant="subtitle1">Yearly Sales</Typography>
            </Box>
            <Grid container spacing={1}>
              <Grid size={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 9,
                      height: 9,
                      bgcolor: primary,
                      svg: { display: "none" },
                    }}
                  ></Avatar>
                  <Typography variant="subtitle2" fontSize="12px">
                    2021
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 9,
                      height: 9,
                      bgcolor: secondary,
                      svg: { display: "none" },
                    }}
                  ></Avatar>
                  <Typography variant="subtitle2" fontSize="12px">
                    2022
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 9,
                      height: 9,
                      bgcolor: "warning.main",
                      svg: { display: "none" },
                    }}
                  ></Avatar>
                  <Typography variant="subtitle2" fontSize="12px">
                    2023
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 9,
                      height: 9,
                      bgcolor: "grey.100",
                      svg: { display: "none" },
                    }}
                  ></Avatar>
                  <Typography variant="subtitle2" fontSize="12px">
                    2024
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={6}>
            <Box
              position="relative"
              display="flex"
              alignItems="center"
              mt={1}
              height="130px"
            >
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="donut"
                height={145}
                width={"100%"}
              />
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  margin: "0 auto",
                  width: "20px",
                }}
              >
                <IconShoppingCart width={20} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>
  </>);
};

export default YearlySales;
