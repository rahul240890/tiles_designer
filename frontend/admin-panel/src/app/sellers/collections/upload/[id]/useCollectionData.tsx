"use client";

import { useState, useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { getSellerId } from "@/utils/cookieuserdata";
import { getCollectionById } from "@/app/sellers/api/collection";
import { CollectionResponse } from "@/app/sellers/types/collection";

export const useCollectionData = (collection_id: string) => {
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [collection, setCollection] = useState<CollectionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showNotification } = useNotificationStore();

  // ✅ Fetch Seller ID from Cookies
  useEffect(() => {
    const fetchSellerId = async () => {
      const id = await getSellerId();
      if (id) setSellerId(id);
      else setErrorMessage("Seller ID not found. Please log in again.");
    };
    fetchSellerId();
  }, []);

  // ✅ Fetch Collection Details
  useEffect(() => {
    const fetchCollection = async () => {
      if (collection_id) {
        try {
          const response = await getCollectionById(collection_id);
          setCollection(response);
        } catch (error) {
          showNotification("Failed to fetch collection details", "error");
        }
      }
    };
    fetchCollection();
  }, [collection_id]);

  return { sellerId, collection, errorMessage };
};