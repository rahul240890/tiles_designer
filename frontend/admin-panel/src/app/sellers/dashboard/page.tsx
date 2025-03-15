"use client";

import { useState, useEffect } from "react";
import {
  Grid2 as Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import { useRouter } from "next/navigation";
import {
  IconFolder,
  IconLayersIntersect,
  IconPoint,
  IconBorderAll,
  IconRuler,
} from "@tabler/icons-react";
import getMenuItems from "@/app/layout/horizontal/navbar/Menudata"; // Adjust path as needed

interface MenuItem {
  id: string;
  title: string;
  icon: (props: any) => JSX.Element;
  href?: string;
  children?: MenuItem[];
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [collections, setCollections] = useState<MenuItem[]>([]);
  const [tilesSubmenus, setTilesSubmenus] = useState<{
    categories: MenuItem[];
    sizes: MenuItem[];
    series: MenuItem[];
    finishes: MenuItem[];
    materials: MenuItem[];
    others: MenuItem[];
  }>({
    categories: [],
    sizes: [],
    series: [],
    finishes: [],
    materials: [],
    others: [],
  });

  // Fetch menu data on mount
  useEffect(() => {
    const fetchMenuData = async () => {
      const menuItems = await getMenuItems();
      const collectionsMenu = menuItems.find((item) => item.title === "Collection Management");
      const tilesMenu = menuItems.find((item) => item.title === "Tile Management");

      if (collectionsMenu?.children) {
        const viewCollections = collectionsMenu.children.find((child) => child.title === "View Collections");
        setCollections(viewCollections?.children || []);
      }

      if (tilesMenu?.children) {
        setTilesSubmenus({
          categories: tilesMenu.children.find((child) => child.title === "Tiles by Category")?.children || [],
          sizes: tilesMenu.children.find((child) => child.title === "Tiles by Size")?.children || [],
          series: tilesMenu.children.find((child) => child.title === "Tiles by Series")?.children || [],
          finishes: tilesMenu.children.find((child) => child.title === "Tiles by Finish")?.children || [],
          materials: tilesMenu.children.find((child) => child.title === "Tiles by Material")?.children || [],
          others: tilesMenu.children.filter(
            (child) =>
              !["Tiles by Category", "Tiles by Size", "Tiles by Series", "Tiles by Finish", "Tiles by Material"].includes(
                child.title
              )
          ),
        });
      }
    };
    fetchMenuData();
  }, []);

  // Navigation handler
  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <PageContainer title="Dashboard" description="Company Dashboard">
      <Box sx={{ mt: 3, px: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Navigate your collections and tiles effortlessly.
        </Typography>

        <Grid container spacing={3}>
          {/* Collections Section */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card sx={{ bgcolor: "#e3f2fd", borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, fontWeight: "bold" }}
                >
                  <IconFolder color="#1976d2" /> Collections
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  {collections.map((collection) => (
                    <Button
                      key={collection.id}
                      variant="text"
                      fullWidth
                      startIcon={<IconPoint color="#1976d2" />}
                      onClick={() => handleNavigation(collection.href!)}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "text.primary",
                        "&:hover": { bgcolor: "#bbdefb" },
                      }}
                    >
                      {collection.title}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Tiles Categories Section */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card sx={{ bgcolor: "#f1f8e9", borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, fontWeight: "bold" }}
                >
                  <IconBorderAll color="#388e3c" /> Categories
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  {tilesSubmenus.categories.map((item) => (
                    <Button
                      key={item.id}
                      variant="text"
                      fullWidth
                      startIcon={<IconPoint color="#388e3c" />}
                      onClick={() => handleNavigation(item.href!)}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "text.primary",
                        "&:hover": { bgcolor: "#dcedc8" },
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Tiles Sizes Section */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card sx={{ bgcolor: "#fff3e0", borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, fontWeight: "bold" }}
                >
                  <IconRuler color="#f57c00" /> Sizes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  {tilesSubmenus.sizes.map((item) => (
                    <Button
                      key={item.id}
                      variant="text"
                      fullWidth
                      startIcon={<IconPoint color="#f57c00" />}
                      onClick={() => handleNavigation(item.href!)}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "text.primary",
                        "&:hover": { bgcolor: "#ffe0b2" },
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Tiles Series Section */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card sx={{ bgcolor: "#fce4ec", borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, fontWeight: "bold" }}
                >
                  <IconLayersIntersect color="#c2185b" /> Series
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  {tilesSubmenus.series.map((item) => (
                    <Button
                      key={item.id}
                      variant="text"
                      fullWidth
                      startIcon={<IconPoint color="#c2185b" />}
                      onClick={() => handleNavigation(item.href!)}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "text.primary",
                        "&:hover": { bgcolor: "#f8bbd0" },
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Tiles Finishes Section */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card sx={{ bgcolor: "#e8f5e9", borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, fontWeight: "bold" }}
                >
                  <IconPoint color="#2e7d32" /> Finishes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  {tilesSubmenus.finishes.map((item) => (
                    <Button
                      key={item.id}
                      variant="text"
                      fullWidth
                      startIcon={<IconPoint color="#2e7d32" />}
                      onClick={() => handleNavigation(item.href!)}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "text.primary",
                        "&:hover": { bgcolor: "#c8e6c9" },
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Tiles Materials & Others Section */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card sx={{ bgcolor: "#f3e5f5", borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, fontWeight: "bold" }}
                >
                  <IconLayersIntersect color="#7b1fa2" /> Materials & More
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  {tilesSubmenus.materials.map((item) => (
                    <Button
                      key={item.id}
                      variant="text"
                      fullWidth
                      startIcon={<IconPoint color="#7b1fa2" />}
                      onClick={() => handleNavigation(item.href!)}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "text.primary",
                        "&:hover": { bgcolor: "#e1bee7" },
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                  {tilesSubmenus.others.map((item) => (
                    <Button
                      key={item.id}
                      variant="text"
                      fullWidth
                      startIcon={<IconPoint color="#7b1fa2" />}
                      onClick={() => handleNavigation(item.href!)}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "text.primary",
                        "&:hover": { bgcolor: "#e1bee7" },
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}