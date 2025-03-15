import apiRequest from "@/utils/apiHelper";
import { AttributesResponse, CollectionCreate, CollectionUpdate, CollectionResponse, Attribute } from "../types/collection";
import { getSellerId } from "@/utils/cookieuserdata";

// ✅ Fetch Collections for Logged-in Seller
export const getCollections = async (): Promise<CollectionResponse[]> => {
  const sellerId = await getSellerId();
  if (!sellerId) return []; // If seller_id is missing, return empty array

  return await apiRequest(`/collections?seller_id=${sellerId}`, "GET"); // ✅ Pass seller_id
};

// ✅ Fetch Single Collection by ID (For Editing)
export const getCollectionById = async (collectionId: string): Promise<CollectionResponse> => {
  return await apiRequest(`/collections/${collectionId}`, "GET");
};

// ✅ Create a New Collection (Now Supports Suitable Places)
export const createCollection = async (collectionData: CollectionCreate) => {
  return await apiRequest("/collections", "POST", collectionData);
};

// ✅ Update Existing Collection (Now Supports Suitable Places)
export const updateCollection = async (collectionId: string, collectionData: CollectionUpdate) => {
  return await apiRequest(`/collections/${collectionId}`, "PUT", collectionData);
};

// ✅ Soft Delete Collection (Updated to Handle Soft Deletion Properly)
export const deleteCollection = async (collectionId: string) => {
  return await apiRequest(`/collections/${collectionId}`, "DELETE");
};

// ✅ Toggle Collection Status (Active/Inactive)
export const toggleCollectionStatus = async (collectionId: string) => {
  return await apiRequest(`/collections/${collectionId}/toggle-status`, "PATCH");
};

// ✅ Duplicate Collection
export const duplicateCollection = async (collectionId: string) => {
  return await apiRequest(`/collections/duplicate/${collectionId}`, "POST");
};

// ✅ Fetch All Attributes in One Call (For Dropdowns in Create/Edit Collection)
export const getAllAttributes = async (): Promise<AttributesResponse> => {
  return await apiRequest("/attributes/all", "GET");
};

// ✅ Fetch Suitable Places (New API)
export const fetchSuitablePlaces = async (): Promise<Attribute[]> => {
  return await apiRequest("/suitable-places", "GET");
};

// ✅ Toggle Favorite Status
export const toggleFavoriteCollection = async (collectionId: string) => {
  const sellerId = await getSellerId();
  if (!sellerId) return { success: false };
  return await apiRequest(`/collections/favorite/toggle/${collectionId}?seller_id=${sellerId}`, "POST");
};
