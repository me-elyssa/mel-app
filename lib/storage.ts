import { supabase } from "@/lib/supabase";

export async function uploadFile(file: File, bucket: string, folder: string): Promise<string> {
  const path = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
