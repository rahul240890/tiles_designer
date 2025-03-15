// admin/types/sellerUser.ts

// ✅ Define Seller User Role Type
export type UserRole = "admin" | "seller" | "retailer" | "customer";

// ✅ Define Seller User Interface
export interface SellerUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  seller_id: number; // Seller ID associated with the user
}
