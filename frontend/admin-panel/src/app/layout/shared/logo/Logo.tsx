'use client'
import { FC } from "react";
import { useSelector } from "@/store/hooks";
import Link from "next/link";
import { styled } from "@mui/material";
import { AppState } from "@/store/store";
import Image from "next/image";

const Logo = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: "50px",
    width: customizer.isCollapse && !customizer.isSidebarHover ? "40px" : "140px",
    overflow: "hidden",
    display: "block",
  }));

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="/">
        {customizer.activeMode === "dark" ? (
          <Image
            src="/images/logos/logo-white.svg"
            alt="logo"
            height={customizer.TopbarHeight}
            width={106}
            priority
          />
        ) : (
          <Image
            src={"/images/logos/logo-dark.svg"}
            alt="logo"
            height={customizer.TopbarHeight}
            width={106}
            priority
          />
        )}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/">
      {customizer.activeMode === "dark" ? (
        <Image
          src="/images/logos/rtl-logo-white.svg"
          alt="logo"
          height={customizer.TopbarHeight}
          width={106}
          priority
        />
      ) : (
        <Image
          src="/images/logos/rtl-logo-dark.svg"
          alt="logo"
          height={customizer.TopbarHeight}
          width={106}
          priority
        />
      )}
    </LinkStyled>
  );
};

export default Logo;
