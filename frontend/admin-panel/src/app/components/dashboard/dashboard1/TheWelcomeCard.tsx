import React from "react";
import Image from "next/image";
import { Card, CardContent, Button, Typography, Box } from "@mui/material";
import imgsvg from "/public/images/backgrounds/welcome-bg2-2x-svg.svg";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";

const WelcomeCard = () => {
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: "-10px",
          width: "198px",
          height: "252px",
          top: "-8px",
        }}
      >
        <Image
          src={imgsvg}
          alt="welcome-img"
          style={{
            width: "100%",
            height: "250px",
            transform: customizer.activeDir === "rtl" ? "scaleX(-1)" : "unset",
          }}
        />
      </Box>

      <CardContent>
        <Typography
          sx={{
            marginTop: "8px",
            marginBottom: "0px",
            lineHeight: "35px",
            position: "relative",
            zIndex: 9,
          }}
          variant="h3"
          gutterBottom
        >
          Hey Julia, <br /> Download Latest Report
        </Typography>
        <Button
          sx={{
            marginTop: "15px",
          }}
          variant="contained"
          color="primary"
        >
          Download
        </Button>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
