import apiRequest from "@/utils/apiHelper";
import { AttributeBase, AttributeCreate } from "@/types/attributes";

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
}

// ✅ Fetch all attributes dynamically
export const getAttributes = async (type: string) => {
  try {
    return await apiRequest(`/attributes/${type}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Create an attribute
export const createAttribute = async (type: string, attribute: AttributeCreate) => {
  try {
    return await apiRequest(`/attributes/${type}`, "POST", attribute);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Update an attribute
export const updateAttribute = async (type: string, id: string, attribute: Partial<AttributeBase>) => {
  try {
    return await apiRequest(`/attributes/${type}/${id}`, "PUT", attribute);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Delete an attribute
export const deleteAttribute = async (type: string, id: string) => {
  try {
    return await apiRequest(`/attributes/${type}/${id}`, "DELETE");
  } catch (error) {
    console.error(error);
    return null;
  }
};

