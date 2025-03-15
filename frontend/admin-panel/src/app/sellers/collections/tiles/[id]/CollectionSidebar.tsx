"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { fetchCollectionsBySeller } from "@/app/sellers/api/tilesInCollection";
import { getSellerId } from "@/utils/cookieuserdata";
import { SimpleCollectionResponse } from "../../../types/tilesInCollection";
import AppCard from "@/app/components/shared/AppCard";
import GridOnIcon from "@mui/icons-material/GridOn"; // Collection Icon

const drawerWidth = 240; // Adjust width to accommodate text

interface CollectionSidebarProps {
  activeCollection: string;
}

const CollectionSidebar: React.FC<CollectionSidebarProps> = ({ activeCollection }) => {
  const router = useRouter();
  const [collections, setCollections] = useState<SimpleCollectionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const sellerId = await getSellerId();
        if (!sellerId) {
          console.error("Seller ID is missing!");
          return;
        }
        const data = await fetchCollectionsBySeller(sellerId);
        setCollections(data || []);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
      setLoading(false);
    };

    loadCollections();
  }, []);

  const handleCollectionClick = (collectionId: string) => {
    router.push(`/sellers/collections/tiles/${collectionId}`);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, position: "relative", zIndex: 2 },
      }}
    >
      <AppCard>
        <Box sx={{ width: drawerWidth, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Collections
          </Typography>
          {loading ? (
            <CircularProgress size={24} sx={{ display: "block", mx: "auto" }} />
          ) : collections.length > 0 ? (
            <List>
              {collections.map((collection) => (
                <ListItem key={collection.id} disablePadding>
                  <ListItemButton
                    selected={collection.id === activeCollection}
                    onClick={() => handleCollectionClick(collection.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1, // Space between icon and text
                      padding: "8px",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "36px" }}>
                      <GridOnIcon color={collection.id === activeCollection ? "primary" : "disabled"} />
                    </ListItemIcon>
                    <ListItemText primary={collection.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
              No collections found.
            </Typography>
          )}
        </Box>
      </AppCard>
    </Drawer>
  );
};

export default CollectionSidebar;
