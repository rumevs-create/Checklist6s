export const uploadToCloudinary = async (base64: string) => {
  const formData = new FormData();

  formData.append("file", base64);
  formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // ganti ini

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Upload gagal");
  }

  return data.secure_url;
};
