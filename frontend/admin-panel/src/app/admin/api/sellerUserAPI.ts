// admin/api/sellerUserAPI.ts
import { SellerUser } from "../types/sellerUser";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Fetch all Seller Users
export const fetchSellerUsers = async (): Promise<SellerUser[]> => {
  const response = await fetch(`${API_BASE_URL}/users/seller`);
  if (!response.ok) throw new Error("Failed to fetch seller users");

  return response.json();
};

// ✅ Delete a Seller User
export const deleteSellerUser = async (sellerUserId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/seller/${sellerUserId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete seller user");
};

