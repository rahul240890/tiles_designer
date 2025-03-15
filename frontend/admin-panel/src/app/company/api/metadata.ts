const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ✅ Fetch Metadata (Categories, Sizes, Materials, Finishes, Series)
export const fetchMetadata = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/metadata`, { method: "GET", headers: { "Content-Type": "application/json" } });
    if (!res.ok) throw new Error(`API Error: ${res.status} - ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
