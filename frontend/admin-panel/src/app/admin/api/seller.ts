// admin/api/seller.ts
import { Seller, SellerCreate, SellerUpdate } from "../types/seller";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Fetch all Sellers (No default limit, fetches all unless specified)
export const fetchSellers = async (
  page?: number,
  limit?: number,
  search?: string,
  sortField: string = "created_at",
  sortOrder: string = "desc"
): Promise<Seller[]> => {
  const url = new URL(`${API_BASE_URL}/sellers`);
  if (page) url.searchParams.append("page", page.toString());
  if (limit) url.searchParams.append("limit", limit.toString());
  if (search) url.searchParams.append("search", search);
  url.searchParams.append("sortField", sortField);
  url.searchParams.append("sortOrder", sortOrder);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch sellers");

  return response.json();
};

// ✅ Fetch a single Seller by ID
export const fetchSellerById = async (sellerId: string): Promise<Seller> => {
  const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}`);
  if (!response.ok) throw new Error("Failed to fetch seller details");

  return response.json();
};

// ✅ Create a new Seller
export const createSeller = async (sellerData: SellerCreate): Promise<Seller> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sellers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sellerData),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Extract error message
      throw new Error(errorData.detail || "Failed to create seller");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};


// ✅ Update an existing Seller
export const updateSeller = async (sellerId: string, sellerData: SellerUpdate): Promise<Seller> => {
  const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sellerData),
  });

  if (!response.ok) throw new Error("Failed to update seller");

  return response.json();
};

// ✅ Delete a Seller
export const deleteSeller = async (sellerId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete seller");
};

// ✅ Activate a Seller
export const activateSeller = async (sellerId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/activate`, { method: "PUT" });
  if (!response.ok) throw new Error("Failed to activate seller");
};

// ✅ Deactivate a Seller
export const deactivateSeller = async (sellerId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/deactivate`, { method: "PUT" });
  if (!response.ok) throw new Error("Failed to deactivate seller");
};
