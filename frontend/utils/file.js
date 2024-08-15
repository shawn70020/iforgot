export const decodeFilename = (filename) => {
    const filenameParts = filename.split("-");
    const encodedPart = filenameParts.slice(1).join("-");
    return decodeURIComponent(encodedPart);
  };
  
  export const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif)$/.test(url);
  };
  
  export const isPDF = (url) => {
    return /\.pdf$/.test(url);
  };
  
  export const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };
  