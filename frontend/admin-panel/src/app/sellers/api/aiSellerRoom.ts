"use client";

import apiRequest from "@/utils/apiHelper";
import { getSellerId } from "@/utils/cookieuserdata";

// ✅ Upload Room Image & Get AI Segmentation
export const uploadRoomImage = async (file: File) => {
  const sellerId = await getSellerId();
  if (!sellerId) throw new Error("Seller ID not found!");

  const formData = new FormData();
  formData.append("file", file);

  return apiRequest(`/ai/upload-image?seller_id=${sellerId}`, "POST", formData);
};

// ✅ Fetch Available Room Templates
export const fetchRoomTemplates = async () => {
  return apiRequest(`/room-templates`, "GET");
};

// ✅ Apply Selected Room Template
export const applyRoomTemplate = async (templateId: string) => {
  const sellerId = await getSellerId();
  if (!sellerId) throw new Error("Seller ID not found!");

  return apiRequest(`/ai/apply-template?seller_id=${sellerId}&template_id=${templateId}`, "POST");
};

// ✅ Fetch Available Floor & Wall Tiles
export const fetchTiles = async (tileType: "wall" | "floor", filters?: any) => {
  const sellerId = await getSellerId();
  if (!sellerId) throw new Error("Seller ID not found!");

  const queryParams = new URLSearchParams({ seller_id: sellerId, type: tileType, ...filters }).toString();
  return apiRequest(`/tiles/filter?${queryParams}`, "GET");
};

// ✅ Apply Selected Tiles to AI-Segmented Room
export const applyTiles = async (segmentationId: string, wallTileId?: string, floorTileId?: string) => {
  return apiRequest(`/ai/apply-tiles`, "POST", {
    segmentation_id: segmentationId,
    wall_tile_id: wallTileId || null,
    floor_tile_id: floorTileId || null,
  });
};

// ✅ Fetch Available Paint Colors
export const fetchPaintColors = async () => {
  return apiRequest(`/paint/colors`, "GET");
};

// ✅ Apply Paint to Walls
export const applyPaint = async (segmentationId: string, paintColor: string) => {
  return apiRequest(`/paint/apply`, "POST", {
    segmentation_id: segmentationId,
    paint_color: paintColor,
  });
};

// ✅ Fetch Available Lighting Modes
export const fetchLightingModes = async () => {
  return apiRequest(`/lighting/modes`, "GET");
};

// ✅ Apply Lighting Adjustments
export const applyLighting = async (imagePath: string, mode: string, brightness: number, contrast: number) => {
  return apiRequest(`/lighting/apply`, "POST", {
    image_path: imagePath,
    mode,
    brightness,
    contrast,
  });
};

// ✅ Fetch Seller’s Saved Room Designs
export const fetchSavedDesigns = async () => {
  const sellerId = await getSellerId();
  if (!sellerId) throw new Error("Seller ID not found!");

  return apiRequest(`/ai/saved-designs?seller_id=${sellerId}`, "GET");
};

// ✅ Save Room Design
export const saveRoomDesign = async (segmentationId: string, appliedTiles: any, appliedPaint: string, appliedLighting: any) => {
  const sellerId = await getSellerId();
  if (!sellerId) throw new Error("Seller ID not found!");

  return apiRequest(`/ai/save-design`, "POST", {
    seller_id: sellerId,
    segmentation_id: segmentationId,
    applied_tiles: appliedTiles,
    applied_paint: appliedPaint,
    applied_lighting: appliedLighting,
  });
};

// ✅ Delete Saved Room Design
export const deleteSavedDesign = async (designId: string) => {
  return apiRequest(`/ai/delete-design?design_id=${designId}`, "DELETE");
};
