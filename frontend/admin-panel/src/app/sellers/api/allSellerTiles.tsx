import apiRequest from "@/utils/apiHelper";
import { getSellerId } from "@/utils/cookieuserdata";
import { useNotificationStore } from "@/store/notificationStore";

const showNotification = (message: string, type: "success" | "error") => {
  useNotificationStore.getState().showNotification(message, type);
};

// ✅ Fetch All Tiles with Filtering, Sorting, Pagination
export const fetchAllTiles = async (params: Record<string, any>) => {
  try {
    const sellerId = await getSellerId();
    if (!sellerId) throw new Error("Seller ID is missing!");

    const queryParams: Record<string, any> = {
      seller_id: sellerId,
      sort_by: params.sort_by || "created_at",
      order: params.order || "desc",
    };

    if (params.last_id) queryParams.last_id = params.last_id;
    if (params.limit) queryParams.limit = params.limit;
    if (params.status) queryParams.status = params.status;
    if (params.search) queryParams.search = params.search;
    if (params.priority !== undefined && params.priority !== "")
      queryParams.priority = Number(params.priority);
    if (params.favorite !== undefined && params.favorite !== "")
      queryParams.favorite = params.favorite === "true";

    // ✅ Handle multiple selected filters by repeating the parameter
    [
      "collection_id",
      "category_id",
      "series_id",
      "finish_id",
      "size_id",
      "material_id",
      "color_id",
    ].forEach((key) => {
      if (params[key] && Array.isArray(params[key]) && params[key].length > 0) {
        queryParams[key] = params[key];
      }
    });

    console.log("Final API Request Params:", queryParams);

    // ✅ Use URLSearchParams to handle array parameters correctly
    const query = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => query.append(key, item));
      } else {
        query.append(key, value as string);
      }
    });

    const queryString = query.toString();
    console.log("Generated Query String:", queryString);

    return await apiRequest(`/tiles/all?${queryString}`, "GET");
  } catch (error) {
    showNotification("Failed to fetch tiles.", "error");
    throw error;
  }
};

// ✅ Fetch Sidebar Filters
export const fetchSidebarFilters = async () => {
  try {
    const sellerId = await getSellerId();
    if (!sellerId) throw new Error("Seller ID is missing!");

    return await apiRequest(`/attributes/filters?seller_id=${sellerId}`, "GET");
  } catch (error) {
    showNotification("Failed to fetch sidebar filters.", "error");
    throw error;
  }
};

// ✅ Fetch Favorite Tiles
export const fetchFavoriteTiles = async () => {
  try {
    const sellerId = await getSellerId();
    if (!sellerId) throw new Error("Seller ID is missing!");

    return await apiRequest(`/favorites/${sellerId}`, "GET");
  } catch (error) {
    showNotification("Failed to fetch favorite tiles.", "error");
    throw error;
  }
};

// ✅ Toggle Favorite Tile
export const toggleFavoriteTile = async (tileId: string) => {
  try {
    const sellerId = await getSellerId();
    if (!sellerId) throw new Error("Seller ID is missing!");

    await apiRequest(`/favorites/toggle/${sellerId}/${tileId}`, "POST");
    showNotification("Tile favorite status updated!", "success");
  } catch (error) {
    showNotification("Failed to update favorite status.", "error");
    throw error;
  }
};

// ✅ Toggle Tile Status (Active/Inactive)
export const toggleTileStatus = async (tileId: string) => {
  try {
    await apiRequest(`/tiles/${tileId}/toggle-status`, "PATCH");
    showNotification("Tile status updated successfully!", "success");
  } catch (error) {
    showNotification("Failed to update tile status.", "error");
    throw error;
  }
};

// ✅ Delete Tile (Soft Delete)
export const deleteTile = async (tileId: string) => {
  try {
    await apiRequest(`/tiles/${tileId}`, "DELETE");
    showNotification("Tile deleted successfully!", "success");
  } catch (error) {
    showNotification("Failed to delete tile.", "error");
    throw error;
  }
};

// ✅ Update Tile Priority (High, Medium, Low)
export const updateTilePriority = async (tileId: string, priority: string) => {
  try {
    await apiRequest(`/tiles/${tileId}/priority`, "PATCH", { priority });
    showNotification("Tile priority updated!", "success");
  } catch (error) {
    showNotification("Failed to update tile priority.", "error");
    throw error;
  }
};

// ✅ Fetch Single Tile Details (For Quick View Modal)
export const fetchTileDetails = async (tileId: string) => {
  try {
    return await apiRequest(`/tiles/${tileId}`, "GET");
  } catch (error) {
    showNotification("Failed to fetch tile details.", "error");
    throw error;
  }
};
