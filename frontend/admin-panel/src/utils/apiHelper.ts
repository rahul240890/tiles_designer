import { useNotificationStore } from "@/store/notificationStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ✅ Generic API Request Function (Supports JSON & FormData)
const apiRequest = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  data?: any,
  customHeaders?: HeadersInit
): Promise<any> => {
  try {
    let headers: HeadersInit = customHeaders || { "Content-Type": "application/json" };
    let body: BodyInit | null = null;

    // ✅ Check if data is FormData (File Upload)
    if (data instanceof FormData) {
      body = data;
      headers = {}; 
    } else if (data) {
      body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || `Error: ${response.statusText}`);
    }

    return result; // ✅ Return raw API response
  } catch (error: any) {
    console.error("API Request Error:", error);
    throw new Error(error.message || "Network error! Please check your connection.");
  }
};

export default apiRequest;
