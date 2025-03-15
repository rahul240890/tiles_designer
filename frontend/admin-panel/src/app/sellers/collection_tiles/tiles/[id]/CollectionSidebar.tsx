"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { SimpleCollectionResponse } from "../../../types/tilesInCollection";
import { getSellerId } from "@/utils/cookieuserdata";
import AppCard from "@/app/components/shared/AppCard";
import { fetchCollectionsBySeller } from "@/app/sellers/api/tilesInCollection";

const drawerWidth = 240;

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setLoading(false);
      }
    };

    loadCollections();
  }, []);

  const handleCollectionClick = (collectionId: string) => {
    router.push(`/sellers/collection_tiles/tiles/${collectionId}`);
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
            <CircularProgress />
          ) : collections.length > 0 ? (
            <List>
              {collections.map((collection) => (
                <ListItem key={collection.id} disablePadding>
                  <ListItemButton
                    selected={collection.id === activeCollection}
                    onClick={() => handleCollectionClick(collection.id)}
                  >
                    <ListItemText primary={collection.name} secondary={`Status: ${collection.status}`} />
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
