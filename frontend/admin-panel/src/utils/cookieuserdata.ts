"use server";

import { cookies } from "next/headers";

// ✅ Function to Get Seller ID Securely
export async function getSellerId() {
  const cookieStore = cookies();
  const sellerCookie = (await cookieStore).get("seller_id");
  
  if (!sellerCookie || !sellerCookie.value) {
    return null; // Return null if seller_id is missing
  }

  // ✅ Ensure seller_id is a valid number before returning
  return (sellerCookie.value);
}
