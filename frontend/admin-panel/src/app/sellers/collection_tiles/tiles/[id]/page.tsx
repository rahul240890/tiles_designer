"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  MenuItem,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import GridViewIcon from "@mui/icons-material/GridView";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import CollectionSidebar from "./CollectionSidebar";
import TileTable from "./TileTable";
import TileGrid from "./TileGrid";
import { fetchTilesByCollection } from "@/app/sellers/api/tilesInCollection";
import { getSellerId } from "@/utils/cookieuserdata";
import { TileResponse, TileCollectionResponse } from "@/app/sellers/types/tilesInCollection";
import CollectionAttributesGrid from "./CollectionAttributesGrid";
import BlankCard from "@/app/components/shared/BlankCard";

const drawerWidth = 240; // Sidebar width

const TileManagementPage = () => {
  const router = useRouter();
  const params = useParams();
  const collectionId: string = Array.isArray(params.id) ? params.id[0] : params.id || "";

  console.log("Collection ID: ", collectionId);

  const [collection, setCollection] = useState<TileCollectionResponse["collection"] | null>(null);
  const [tiles, setTiles] = useState<TileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [lastTileId, setLastTileId] = useState<string | null>(null);

  // Fetch Collection & Tiles Data
  const fetchTiles = async (reset = false) => {
    try {
      if (reset) setLoading(true);

      const sellerId = await getSellerId();
      if (!sellerId) {
        console.error("Seller ID is missing!");
        return;
      }

      const data = await fetchTilesByCollection(
        collectionId,
        reset ? undefined : lastTileId || undefined,
        100,
        statusFilter || undefined,
        priorityFilter || undefined,
        sortBy as "usage_count" | "created_at" | "priority",
        order
      );

      setCollection(data.collection);
      setTiles(reset ? data.tiles : [...tiles, ...data.tiles]);

      if (data.tiles.length > 0) {
        setLastTileId(data.tiles[data.tiles.length - 1].id);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching tiles:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiles(true);
  }, [collectionId, sortBy, order, statusFilter, priorityFilter]);

  return (
    <PageContainer title="Tile Management" description="Manage tiles in collections">
    <BlankCard>
      <Box>
    {collection && <CollectionAttributesGrid collection={collection} />}
        
    
        <Box sx={{ display: "flex" }}>
      
          {/* Sidebar */}
          <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
            <CollectionSidebar activeCollection={collectionId} />
          </Box>

          {/* Main Content */}
          <Box flex={1} p={0}>
          

            {loading ? (
              <CircularProgress />
            ) : (
              <>
                {/* Filters, Sorting & View Toggle (All in One Row) */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2} flexWrap="wrap" gap={2}>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <TextField select label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)} sx={{ minWidth: 140 }}>
                      <MenuItem value="usage_count">Usage Count</MenuItem>
                      <MenuItem value="created_at">Created Date</MenuItem>
                      <MenuItem value="priority">Priority</MenuItem>
                    </TextField>

                    <TextField select label="Order" value={order} onChange={(e) => setOrder(e.target.value as "asc" | "desc")} sx={{ minWidth: 140 }}>
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </TextField>

                    <TextField select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </TextField>

                    <TextField select label="Priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} sx={{ minWidth: 140 }}>
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </TextField>
                  </Box>

                  {/* View Toggle Buttons */}
                  <ToggleButtonGroup value={viewType} exclusive onChange={(_, newView) => newView && setViewType(newView)}>
                    <ToggleButton value="grid">
                      <GridViewIcon />
                    </ToggleButton>
                    <ToggleButton value="table">
                      <TableViewIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Tile List (Grid/Table) */}
                {viewType === "grid" ? <TileGrid tiles={tiles} onTileUpdate={fetchTiles} /> : <TileTable tiles={tiles} onTileUpdate={fetchTiles} />}
              </>
            )}
          </Box>
        </Box>
        </Box>
      </BlankCard>
      
    </PageContainer>
  );
};

export default TileManagementPage;
