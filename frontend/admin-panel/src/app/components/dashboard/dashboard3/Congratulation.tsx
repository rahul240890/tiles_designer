import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import BlankCard from "../../shared/BlankCard";
import { IconArrowUpLeft } from "@tabler/icons-react";

const Congratulation = () => {
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <BlankCard>
      <Box>
        <Avatar
          src="/images/backgrounds/welcome-bg2-2x-svg.svg"
          sx={{
            borderRadius: 0,
            height: 178,
            width: 190,
            position: "absolute",
            right: 0,
            top: "10px",
            transform: customizer.activeDir === "rtl" ? "scaleX(-1)" : "unset",
          }}
        />
      </Box>
      <CardContent>
        <Stack spacing={1} useFlexGap flexWrap="wrap">
          <Typography variant="h4" mt={1} gutterBottom>
            Congratulation Julia
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography variant="h2" gutterBottom>
              $39,358
            </Typography>
            <Stack direction="row" alignItems="center">
              <IconArrowUpLeft size="14" />
              <Typography variant="h6" gutterBottom>
                +9%
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Box
          mb={2}
          sx={{
            display: {
              sm: "flex",
              xs: "block",
            },
            alignItems: "flex-end",
          }}
        ></Box>
        <Box mb={1}>
          <Button variant="contained" color="secondary">
            Download
          </Button>
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default Congratulation;
