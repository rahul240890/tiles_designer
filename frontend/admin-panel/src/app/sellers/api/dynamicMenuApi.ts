import apiRequest from "@/utils/apiHelper";
import { getSellerId } from "@/utils/cookieuserdata";

interface Collection {
  id: string;
  name: string;
}

interface Attribute {
  id: string;
  name: string;
}

export const fetchDynamicMenuData = async (): Promise<{ collections: Collection[]; filters: Record<string, Attribute[]> }> => {
  try {
    const sellerId = await getSellerId();
    if (!sellerId) throw new Error("Seller ID not found!");

    const response = await apiRequest(`/attributes/filters?seller_id=${sellerId}`, "GET");

    return {
      collections: response.collections,
      filters: {
        categories: response.categories,
        series: response.series,
        sizes: response.sizes,
        finishes: response.finishes,
        materials: response.materials,
      },
    };
  } catch (error) {
    console.error("Error fetching dynamic menu data:", error);
    return { collections: [], filters: {} };
  }
};