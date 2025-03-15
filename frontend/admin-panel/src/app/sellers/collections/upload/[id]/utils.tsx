export const getImageUrl = (filePath: string) => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${filePath.replace(/\\/g, "/")}`;
  };