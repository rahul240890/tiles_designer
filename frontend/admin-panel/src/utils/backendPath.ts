export const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
};

export const getImageUrl = (filePath: string) => {
  if (!filePath) return "/placeholder-image.jpg"; // ✅ Default placeholder for missing images
  return `${getBackendUrl()}/${filePath.replace(/\\/g, "/")}`;
};
