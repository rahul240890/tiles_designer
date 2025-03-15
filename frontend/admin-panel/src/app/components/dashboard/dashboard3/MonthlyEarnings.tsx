import { Box, CardContent, Card, Typography, Stack, Grid } from "@mui/material";
import { IconArrowUpLeft } from "@tabler/icons-react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";

const MonthlyEarningsChart = () => {
  const theme = useTheme();
  // chart
  const optionscolumnchart: any = {
    colors: ["rgba(255,255,255,0.5)"],
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
      },
    },
    chart: {
      fontFamily: "inherit",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        startingShape: "flat",
        endingShape: "flat",
        columnWidth: "30%",
        barHeight: "100%",
      },
    },
    stroke: {
      show: true,
      width: 2,
      curve: "smooth",
      colors: ["transparent"],
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: "Monthly Earnings",
      data: [6, 10, 9, 11, 9, 10, 12, 10, 9, 11, 9, 10, 12],
    },
  ];

  return (
    <>
      <Card sx={{ p: 0, bgcolor: "secondary.main" }}>
        <CardContent>
          <Typography color="white" variant="h4">
            Monthly Earnings
          </Typography>
          <Box mt={4} height="45px">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="bar"
              height={45}
              width={"100%"}
            />
          </Box>
          <Stack mt={4} direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" color="white">
              $39,358
            </Typography>

            <Typography variant="subtitle1" display="flex" color="white">
              <Box display="flex" alignItems="center">
                <IconArrowUpLeft width={18} height={18} />
              </Box>
              +9 this week
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default MonthlyEarningsChart;
