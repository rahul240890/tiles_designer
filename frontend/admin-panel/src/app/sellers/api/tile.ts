import apiRequest from "@/utils/apiHelper";
import { getSellerId } from "@/utils/cookieuserdata";
import { BulkTileUploadResponse, ExistingTileSelection, FinalTileSubmission, TileResponse } from "../types/tile";

// ✅ Bulk Upload Tiles (Upload Multiple Tile Images)
export const bulkUploadTiles = async (files: File[]): Promise<BulkTileUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
  
    console.log("FormData being sent:", formData); // ✅ Debug FormData before sending
  
    return await apiRequest("/tiles/upload-multiple", "POST", formData);
  };

// ✅ Store Finalized Tiles in DB
export const storeFinalTiles = async (finalTiles: FinalTileSubmission[]): Promise<{ message: string }> => {
  return await apiRequest("/tiles/store-final-multiple", "POST", finalTiles);
};

// ✅ Get Uploaded Tiles for Seller (After Upload)
export const getUploadedTiles = async (): Promise<TileResponse[]> => {
  const sellerId = await getSellerId();
  if (!sellerId) return [];

  return await apiRequest(`/tiles/seller/${sellerId}`, "GET");
};

// ✅ Delete Temporary Tiles (If User Cancels Upload)
export const deleteTemporaryTiles = async (): Promise<{ success: boolean }> => {
  return await apiRequest("/tiles/temp", "DELETE");
};


// ✅ Fetch Collections for Seller (For Filtering Tile Designs)
export const getCollectionsBySeller = async (): Promise<{ id: string; name: string }[]> => {
  const sellerId = await getSellerId();
  if (!sellerId) return [];

  return await apiRequest(`/collections?seller_id=${sellerId}`, "GET");
};

// ✅ Fetch Existing Tile Designs (By Collection)
export const getTileDesignsByCollection = async (collectionId: string): Promise<TileResponse[]> => {
  return await apiRequest(`/tiles/designs?seller_id=${await getSellerId()}&collection_id=${collectionId}`, "GET");
};

// ✅ Add Selected Existing Tiles to a Collection
export const addExistingTilesToCollection = async (collectionId: string, tiles: ExistingTileSelection[]): Promise<{ message: string }> => {
  return await apiRequest(`/tiles/collections/${collectionId}/add-tiles`, "POST", { tiles });
};
