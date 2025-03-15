import { Box, CardContent, Card, Typography, Stack, Grid } from "@mui/material";
import { IconArrowUpLeft } from "@tabler/icons-react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";

const Customers = () => {
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
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: "Customers",
      data: [1, 19, 3, 13, 2, 19],
    },
  ];

  return (
    <>
      <Card sx={{ p: 0, bgcolor: "primary.main" }}>
        <CardContent>
          <Typography color="white" variant="h4">
            Customers
          </Typography>
          <Box mt={4} height="45px">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="line"
              height={45}
              width={"100%"}
            />
          </Box>
          <Stack mt={4} pt="2px" direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" color="white">
              750
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

export default Customers;
