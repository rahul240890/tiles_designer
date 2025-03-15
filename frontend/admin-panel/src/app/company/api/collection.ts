const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ✅ Fetch All Collections
export const getCollections = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/collections`, { method: "GET", headers: { "Content-Type": "application/json" } });
    if (!res.ok) throw new Error(`API Error: ${res.status} - ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ✅ Fetch Single Collection by ID
export const getCollectionById = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/collections/${id}`, { method: "GET", headers: { "Content-Type": "application/json" } });
    if (!res.ok) throw new Error(`API Error: ${res.status} - ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ✅ Create a New Collection
export const createCollection = async (collectionData: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/collections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectionData),
    });
    if (!res.ok) throw new Error(`API Error: ${res.status} - ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ✅ Update Collection
export const updateCollection = async (id: number, collectionData: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectionData),
    });
    if (!res.ok) throw new Error(`API Error: ${res.status} - ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ✅ Delete Collection
export const deleteCollection = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/collections/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`API Error: ${res.status} - ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
