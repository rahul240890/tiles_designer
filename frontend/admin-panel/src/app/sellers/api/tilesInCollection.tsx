import apiRequest from "@/utils/apiHelper"; // ✅ Using global API function
import { SimpleCollectionResponse, TileCollectionResponse, TileResponse } from "../types/tilesInCollection";

// ✅ Fetch Tiles for a Collection (With Infinite Scroll, Sorting & Filtering)
export const fetchTilesByCollection = async (
  collectionId: string,
  lastId?: string,
  limit: number = 10,
  status?: string,
  priority?: string,
  sortBy?: "usage_count" | "created_at" | "priority",
  order: "asc" | "desc" = "desc"
): Promise<TileCollectionResponse> => {
  let queryParams = `?limit=${limit}&order=${order}`;

  if (lastId) queryParams += `&last_id=${lastId}`;
  if (status) queryParams += `&status=${status}`;
  if (priority) queryParams += `&priority=${priority}`;
  if (sortBy) queryParams += `&sort_by=${sortBy}`;

  return await apiRequest(`/tiles/collection/${collectionId}${queryParams}`, "GET");
};

// ✅ Search Tiles by Name, Description, Attributes
export const searchTiles = async (query: string): Promise<TileResponse[]> => {
  return await apiRequest(`/tiles/search?query=${encodeURIComponent(query)}`, "GET");
};

// ✅ Toggle Tile Status (Activate/Deactivate)
export const toggleTileStatus = async (tileId: string): Promise<{ message: string }> => {
  return await apiRequest(`/tiles/${tileId}/toggle-status`, "PATCH");
};

// ✅ Delete Tile (Soft Delete)
export const deleteTile = async (tileId: string): Promise<{ message: string }> => {
  return await apiRequest(`/tiles/${tileId}`, "DELETE");
};

// ✅ Fetch Collections for Sidebar
export const fetchCollectionsBySeller = async (sellerId: string): Promise<SimpleCollectionResponse[]> => {
    try {
        return await apiRequest(`/collections/seller/${sellerId}`, "GET");
    } catch (error) {
        console.error("Error fetching collections:", error);
        return [];
    }
};