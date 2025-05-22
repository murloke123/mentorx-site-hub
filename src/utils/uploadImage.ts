
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File, bucket: string = 'avatars') {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file);
      
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = await supabase
      .storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return { url: urlData.publicUrl, path: filePath };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function removeImage(path: string, bucket: string = 'avatars') {
  try {
    const { error } = await supabase
      .storage
      .from(bucket)
      .remove([path]);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error removing image:', error);
    throw error;
  }
}
