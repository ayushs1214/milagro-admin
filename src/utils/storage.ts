import { supabase } from '../lib/supabase';

export const STORAGE_BUCKETS = {
  PRODUCTS: 'products',
  AVATARS: 'avatars',
  SIGNATURES: 'signatures',
  DOCUMENTS: 'documents',
  ADMIN_PROFILES: 'admin_profiles'
} as const;

export type StorageBucket = keyof typeof STORAGE_BUCKETS;

// Add the missing generateFilePath function
export const generateFilePath = (
  bucket: StorageBucket,
  fileName: string,
  identifier: string
): string => {
  const timestamp = Date.now();
  const extension = fileName.split('.').pop();
  const sanitizedFileName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-');

  switch (bucket) {
    case 'ADMIN_PROFILES':
      return `${identifier}/profile_${timestamp}.${extension}`;
    case 'AVATARS':
      return `${identifier}/avatar_${timestamp}.${extension}`;
    case 'SIGNATURES':
      return `${identifier}/signature_${timestamp}.${extension}`;
    case 'PRODUCTS':
      return `${identifier}/${sanitizedFileName}`;
    case 'DOCUMENTS':
      return `${identifier}/docs/${sanitizedFileName}`;
    default:
      throw new Error('Invalid storage bucket');
  }
};

// Add a specific function for admin profile images
export const uploadAdminProfileImage = async (
  adminId: string,
  file: File,
  type: 'avatar' | 'signature'
): Promise<string> => {
  try {
    const bucket = type === 'avatar' ? STORAGE_BUCKETS.AVATARS : STORAGE_BUCKETS.SIGNATURES;
    const filePath = generateFilePath(bucket, file.name, adminId);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading admin profile image:', error);
    throw error;
  }
};

// Helper function to delete files from storage
export const deleteStorageFile = async (
  bucket: StorageBucket,
  filePath: string
): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Helper function to get public URL for a file
export const getPublicUrl = (
  bucket: StorageBucket,
  filePath: string
): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};