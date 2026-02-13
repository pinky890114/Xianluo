
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImage = async (file: File): Promise<string> => {
  // Check file size (limit to 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("檔案過大 (超過 5MB)");
  }

  try {
    // Generate a unique filename using timestamp and a random string to prevent collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `products/${uniqueSuffix}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    // Add metadata for better handling
    const metadata = {
      contentType: file.type,
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);
    return await getDownloadURL(snapshot.ref);
  } catch (error: any) {
    console.error("Image upload failed:", error);
    if (error.code === 'storage/unauthorized') {
      throw new Error("權限不足：請檢查 Firebase Console 的 Storage Rules 是否已開啟寫入權限 (allow write: if request.auth != null)");
    }
    throw error;
  }
};
