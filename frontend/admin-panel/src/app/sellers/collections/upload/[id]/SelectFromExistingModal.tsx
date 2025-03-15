"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Modal, Typography, Grid, TextField, MenuItem, CircularProgress } from "@mui/material";
import { getCollectionsBySeller, getTileDesignsByCollection } from "@/app/sellers/api/tile";
import { ExistingTileSelection } from "@/app/sellers/types/tile"; // Only import necessary types
import { getImageUrl } from "./utils";

// Define the actual API response type locally
interface ApiTileDesignResponse {
  tile_design_id: string;
  name: string;
  color_name: string;
  image_url: string;
  thickness: string; // e.g., "10mm"

}

interface SelectFromExistingModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (selectedTiles: ExistingTileSelection[]) => void;
  sellerId: string | null;
  collectionId: string; // ✅ Receive collectionId as a prop

}

const SelectFromExistingModal: React.FC<SelectFromExistingModalProps> = ({ open, onClose, onSelect, sellerId, collectionId }) => {
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [tileDesigns, setTileDesigns] = useState<ExistingTileSelection[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<ExistingTileSelection[]>([]);
  const [filterCollection, setFilterCollection] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens or closes
  useEffect(() => {
    if (!open) {
      setTileDesigns([]);
      setSelectedTiles([]);
      setFilterCollection("all");
      setSearchQuery("");
      setError(null);
      setCollections([]);
    }
  }, [open]);

  // Fetch collections when modal opens and sellerId is available
  const fetchCollections = useCallback(async () => {
    if (!sellerId || !open || !collectionId) return; // ✅ Ensure collectionId is available
  
    setLoading(true);
    setError(null);
    try {
      const response = await getCollectionsBySeller();
      if (!Array.isArray(response)) {
        throw new Error("Invalid collections data received");
      }
  
      // ✅ Exclude the current collection from the dropdown
      const filteredCollections = response.filter(collection => collection.id !== collectionId);
  
      setCollections(filteredCollections); // ✅ Only valid collections remain
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      setError("Failed to load collections");
    } finally {
      setLoading(false);
    }
  }, [sellerId, collectionId, open]); // ✅ Ensure collectionId is included
  
  


  useEffect(() => {
    if (open) {
      fetchCollections();
    }
  }, [open, fetchCollections]);

  // Fetch tile designs when collection changes
  const fetchTiles = useCallback(async () => {
    if (!sellerId || filterCollection === "all") {
      setTileDesigns([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Type assertion to match the actual API response
      const response = (await getTileDesignsByCollection(filterCollection)) as unknown as ApiTileDesignResponse[];
      if (!Array.isArray(response)) {
        throw new Error("Invalid tile designs response");
      }

      const mappedTiles: ExistingTileSelection[] = response.map((tile) => ({
        tile_design_id: tile.tile_design_id,
        collection_id: filterCollection, // Use filterCollection since collection_id isn’t in response
        name: tile.name || "Unnamed Tile",
        color_id: tile.color_name || "", // Map color_name to color_id
        thickness: tile.thickness.replace("mm", "") || "10", // Strip "mm" from thickness
        image_url: tile.image_url ? getImageUrl(tile.image_url) : "/default-placeholder.png",
      }));

      setTileDesigns(mappedTiles);
    } catch (error) {
      console.error("Failed to fetch tile designs:", error);
      setError("Failed to load tile designs");
    } finally {
      setLoading(false);
    }
  }, [sellerId, filterCollection]);

  useEffect(() => {
    if (open) {
      fetchTiles();
    }
  }, [open, filterCollection, fetchTiles]);

  // Toggle individual tile selection
  const toggleSelectTile = (tile: ExistingTileSelection) => {
    setSelectedTiles((prevSelected) => {
      const isSelected = prevSelected.some((t) => t.tile_design_id === tile.tile_design_id);
      if (isSelected) {
        return prevSelected.filter((t) => t.tile_design_id !== tile.tile_design_id); // Deselect
      } else {
        return [...prevSelected, tile]; // Select
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedTiles.length === tileDesigns.length) {
      setSelectedTiles([]); // Deselect all
    } else {
      setSelectedTiles([...tileDesigns]); // Select all
    }
  };

  // Handle proceed
  const handleProceed = () => {
    if (selectedTiles.length > 0) {
      onSelect(selectedTiles);
      onClose();
    }
  };

  // Filter tiles based on search query
  const filteredTiles = tileDesigns.filter((tile) =>
    tile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 1000, bgcolor: "white", p: 3, m: "auto", mt: "3%", borderRadius: 2, maxHeight: "90vh", overflowY: "auto" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Select from Existing Tile Designs
        </Typography>

        {/* Collection Filter */}
        <TextField
          fullWidth
          select
          label="Choose Collection"
          value={filterCollection}
          onChange={(e) => setFilterCollection(e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading || !sellerId}
        >
          <MenuItem value="all">Choose a collection</MenuItem>
          {collections.map((collection) => (
            <MenuItem key={collection.id} value={collection.id}>
              {collection.name}
            </MenuItem>
          ))}
        </TextField>


        {/* Search Box */}
        <TextField
          fullWidth
          label="Search Tiles"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          disabled={filterCollection === "all" || loading}
        />

        {/* Select All Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSelectAll}
          disabled={tileDesigns.length === 0 || loading}
          sx={{ mb: 2 }}
        >
          {selectedTiles.length === tileDesigns.length && tileDesigns.length > 0 ? "Unselect All" : "Select All"}
        </Button>

        {/* Loading or Tile Grid */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
            <Typography>Loading...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : filterCollection === "all" ? (
          <Typography>Please select a collection to view tiles.</Typography>
        ) : filteredTiles.length === 0 ? (
          <Typography>No tiles found matching your search.</Typography>
        ) : (
          <Grid container spacing={2}>
            {filteredTiles.map((tile) => (
              <Grid item xs={4} key={`${tile.tile_design_id}-${tile.collection_id}-${Math.random()}`}>
              <Box
                  sx={{
                    border: selectedTiles.some((t) => t.tile_design_id === tile.tile_design_id)
                      ? "3px solid blue"
                      : "1px solid gray",
                    p: 2,
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <img
                    src={tile.image_url}
                    alt={tile.name}
                    style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain" }}
                  />
                  <Typography sx={{ mt: 1, fontWeight: "bold" }}>{tile.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Color: <strong>{tile.color_id || "N/A"}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Thickness: <strong>{tile.thickness} mm</strong>
                  </Typography>
                  <Button
                    variant={selectedTiles.some((t) => t.tile_design_id === tile.tile_design_id) ? "contained" : "outlined"}
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => toggleSelectTile(tile)}
                  >
                    {selectedTiles.some((t) => t.tile_design_id === tile.tile_design_id) ? "Selected" : "Select"}
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>

        )}

        {/* Proceed Button */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          disabled={selectedTiles.length === 0}
          onClick={handleProceed}
        >
          Proceed ({selectedTiles.length} selected)
        </Button>
      </Box>
    </Modal>
  );
};

export default SelectFromExistingModal;