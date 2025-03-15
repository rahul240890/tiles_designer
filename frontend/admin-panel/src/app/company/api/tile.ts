const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ✅ Fetch all tiles
export const getTiles = async (collectionId: number) => {
  const res = await fetch(`${API_BASE_URL}/tiles?collection_id=${collectionId}`, { method: "GET" });
  return await res.json();
};

// ✅ Fetch tile by ID
export const getTileById = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/tiles/${id}`, { method: "GET" });
  return await res.json();
};

// ✅ Create a new tile (Upload Image)
export const createTile = async (tileData: any) => {
  const res = await fetch(`${API_BASE_URL}/tiles`, {
    method: "POST",
    body: tileData, // FormData for file upload
  });
  return await res.json();
};

// ✅ Update a tile
export const updateTile = async (id: number, tileData: any) => {
  const res = await fetch(`${API_BASE_URL}/tiles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tileData),
  });
  return await res.json();
};

// ✅ Delete a tile
export const deleteTile = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/tiles/${id}`, { method: "DELETE" });
  return await res.json();
};

// ✅ Activate a tile
export const activateTile = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/tiles/${id}/activate`, { method: "PUT" });
  return await res.json();
};

// ✅ Deactivate a tile
export const deactivateTile = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/tiles/${id}/deactivate`, { method: "PUT" });
  return await res.json();
};
