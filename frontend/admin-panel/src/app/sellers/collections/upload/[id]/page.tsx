"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Box, Button, Stack, Typography, CircularProgress, Grid, TextField } from "@mui/material";
import { useNotificationStore } from "@/store/notificationStore";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import { IconUpload, IconFileText, IconDatabase, IconPhoto } from "@tabler/icons-react";
import BulkUploadModal from "./BulkUploadModal";
import CollectionAttributesGrid from "./CollectionAttributesGrid";
import ExtractFromPDFModal from "./ExtractFromPDFModal";
import SelectFromExistingModal from "./SelectFromExistingModal";
import { useCollectionData } from "./useCollectionData";
import { getImageUrl } from "./utils";
import { ExistingTileSelection, FinalTileSubmission } from "@/app/sellers/types/tile";
import { addExistingTilesToCollection, bulkUploadTiles, storeFinalTiles } from "@/app/sellers/api/tile";

const BulkUploadPage = () => {
  const params = useParams();
  const collection_id = params.id as string;
  const { showNotification } = useNotificationStore();

  const { sellerId, collection, errorMessage } = useCollectionData(collection_id);
  const [tilePreviews, setTilePreviews] = useState<(ExistingTileSelection | FinalTileSubmission)[]>([]);
  const [uploading, setUploading] = useState(false);
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [extractFromPDFModalOpen, setExtractFromPDFModalOpen] = useState(false);
  const [selectFromExistingModalOpen, setSelectFromExistingModalOpen] = useState(false);

  // Handle Bulk Upload
  const handleBulkUpload = async (files: File[], thickness: string) => {
    if (!files.length || !sellerId || !collection_id || !thickness) {
      showNotification("Please select files and enter thickness before uploading.", "error");
      return;
    }

    setUploading(true);
    showNotification("Uploading files... Processing color detection.", "info");

    try {
      const response = await bulkUploadTiles(files);

      if (!response.tiles || response.tiles.length === 0) {
        showNotification("No tiles were extracted. Please try again.", "error");
        return;
      }

      const newTiles: FinalTileSubmission[] = response.tiles.map((tile) => ({
        collection_id,
        name: tile.name || "",
        detected_color_name: tile.detected_color_name || "",
        detected_color_hex: tile.detected_color_hex,
        temp_image_path: tile.temp_image_path,
        thickness: thickness.toString(),
      }));

      setTilePreviews((prevTiles) => [...prevTiles, ...newTiles]);
      showNotification("Tile Designs uploaded successfully in Collection!", "success");
    } catch (error) {
      showNotification("File upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Handle Selected Tiles from Existing Collection
  const handleExistingTileSelection = (selectedTiles: ExistingTileSelection[]) => {
    setTilePreviews((prevTiles) => {
      const uniqueTiles = selectedTiles
        .filter((tile) => !prevTiles.some((prevTile) => "tile_design_id" in prevTile && prevTile.tile_design_id === tile.tile_design_id))
        .map((tile) => ({
          tile_design_id: tile.tile_design_id, // Ensure tile_design_id is preserved
          collection_id: tile.collection_id || collection_id, // Use current collection_id if not provided
          thickness: tile.thickness,
          image_url: tile.image_url,
          name: tile.name || "Unnamed Tile",
          color_id: tile.color_id || "",
        }));

      return [...prevTiles, ...uniqueTiles];
    });
  };

  // Handle Save for Both Bulk Upload & Existing Selection
  const handleSaveAll = async () => {
    if (tilePreviews.length === 0) {
      showNotification("No tiles selected!", "error");
      return;
    }

    let hasError = false;

    // Check if any tile name is empty
    const updatedTiles = tilePreviews.map((tile) => {
      if (!tile.name.trim()) {
        hasError = true;
      }
      return tile;
    });

    if (hasError) {
      showNotification("Please enter a tile name for all tiles before saving.", "error");
      return;
    }

    const bulkTiles = tilePreviews.filter((tile) => !("tile_design_id" in tile)) as FinalTileSubmission[];
    const existingTiles = tilePreviews.filter((tile) => "tile_design_id" in tile) as ExistingTileSelection[];

    try {
      if (bulkTiles.length) {
        await storeFinalTiles(bulkTiles);
      }

      if (existingTiles.length) {
        await addExistingTilesToCollection(collection_id, existingTiles);
      }

      showNotification("Tiles saved successfully!", "success");
      setTilePreviews([]);
    } catch (error) {
      showNotification("Failed to save tiles. Try again.", "error");
    }
  };

  return (
    <PageContainer title="Upload Tiles" description="Upload tiles into collection">
      <ParentCard title={`Upload Tiles for ${collection?.name || "Loading..."} - ${collection?.category?.name || "Category"}`}>
        <Box>
          {collection && <CollectionAttributesGrid collection={collection} />}

          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary" startIcon={<IconUpload />} onClick={() => setBulkUploadModalOpen(true)}>Upload Tiles</Button>
              <Button variant="contained" color="secondary" startIcon={<IconFileText />} onClick={() => setExtractFromPDFModalOpen(true)}>Extract from PDF</Button>
              <Button variant="contained" color="success" startIcon={<IconDatabase />} onClick={() => setSelectFromExistingModalOpen(true)}>Select from Existing</Button>
            </Stack>

            <Stack direction="row" spacing={3} alignItems="center">
              {tilePreviews.length > 0 && (
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Total Tiles: {tilePreviews.length}
                </Typography>
              )}

              {tilePreviews.length > 0 && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSaveAll}
                  disabled={uploading}
                  size="large"
                >
                  {uploading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Save Selected Tiles"}
                </Button>
              )}
            </Stack>
          </Stack>

          <BulkUploadModal open={bulkUploadModalOpen} onClose={() => setBulkUploadModalOpen(false)} onUpload={handleBulkUpload} />
          <ExtractFromPDFModal open={extractFromPDFModalOpen} onClose={() => setExtractFromPDFModalOpen(false)} />
          <SelectFromExistingModal
            open={selectFromExistingModalOpen}
            onClose={() => setSelectFromExistingModalOpen(false)}
            onSelect={handleExistingTileSelection}
            sellerId={sellerId}
            collectionId={collection_id} // ✅ Pass the current collection ID
          />


          {tilePreviews.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "300px" }}>
              <IconPhoto size={80} color="gray" />
              <Typography variant="h5" sx={{ color: "gray", mt: 2, textAlign: "center" }}>
                No Tile Designs Uploaded Yet
              </Typography>
              <Typography variant="body1" sx={{ color: "gray", mt: 1, textAlign: "center" }}>
                You can upload tile designs in multiple ways: Bulk Upload, Extract from PDF, or Select from Existing Designs.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ mt: 3 }}>
              {tilePreviews.map((tile, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ p: 2, border: "1px solid gray", borderRadius: "8px", textAlign: "center" }}>
                    <img
                      src={
                        "temp_image_path" in tile && tile.temp_image_path
                          ? getImageUrl(tile.temp_image_path)
                          : "image_url" in tile && tile.image_url
                            ? tile.image_url
                            : "/default-placeholder.png"
                      }
                      alt="Tile"
                      style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
                    />

                    <TextField
                      fullWidth
                      label="Tile Name"
                      size="small"
                      sx={{ mt: 1 }}
                      value={tile.name || ""}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setTilePreviews((prevTiles) =>
                          prevTiles.map((t, i) => (i === index ? { ...t, name: newName || "" } : t))
                        );
                      }}
                    />

                    {"detected_color_name" in tile && (
                      <TextField
                        fullWidth
                        label="Tile Color"
                        size="small"
                        sx={{ mt: 1 }}
                        value={tile.detected_color_name || ""}
                        onChange={(e) => {
                          const newColor = e.target.value;
                          setTilePreviews((prevTiles) =>
                            prevTiles.map((t, i) => (i === index ? { ...t, detected_color_name: newColor } : t))
                          );
                        }}
                      />
                    )}

                    <TextField
                      fullWidth
                      label="Tile Thickness (mm)"
                      size="small"
                      sx={{ mt: 1 }}
                      value={tile.thickness || ""}
                      onChange={(e) => {
                        const newThickness = e.target.value;
                        setTilePreviews((prevTiles) =>
                          prevTiles.map((t, i) => (i === index ? { ...t, thickness: newThickness } : t))
                        );
                      }}
                    />

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => setTilePreviews((prevTiles) => prevTiles.filter((_, i) => i !== index))}
                    >
                      Delete
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default BulkUploadPage;