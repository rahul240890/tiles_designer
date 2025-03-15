import apiRequest from "@/utils/apiHelper";
import { SuitablePlace, SuitablePlaceCreate } from "../types/suitablePlace";

// ✅ Fetch all Suitable Places
export const fetchSuitablePlaces = async (): Promise<SuitablePlace[] | null> => {
  try {
    return await apiRequest(`/suitable-places`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Create a new Suitable Place
export const createSuitablePlace = async (placeData: SuitablePlaceCreate): Promise<SuitablePlace | null> => {
  try {
    return await apiRequest(`/suitable-places`, "POST", placeData);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Delete a Suitable Place (Soft Delete)
export const deleteSuitablePlace = async (placeId: string): Promise<boolean> => {
  try {
    await apiRequest(`/suitable-places/${placeId}`, "DELETE");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
