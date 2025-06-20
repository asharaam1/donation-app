export const uploadToCloudinary = async (uri, folder) => {
    const formData = new FormData();
  
    // Convert local URI to file format for FormData
    const filename = uri.split("/").pop();
    const fileType = filename.split(".").pop();
    
    formData.append("file", {
      uri,
      type: `image/${fileType}`,
      name: filename,
    });
  
    formData.append("upload_preset", "Donation App");
    formData.append("folder", folder);
  
    const res = await fetch("https://api.cloudinary.com/v1_1/dhcqfjulx/image/upload", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  
    const data = await res.json();
    return data.secure_url;
  };
  