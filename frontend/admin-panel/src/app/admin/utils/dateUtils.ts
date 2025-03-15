// Utility function to format dates to YYYY-MM-DD
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Handle invalid dates
    return date.toISOString().split("T")[0];
  };