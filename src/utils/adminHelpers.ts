import { supabase } from '../lib/supabase';
import { AdminProfile } from '../types/admin';
import { STORAGE_BUCKETS, generateFilePath } from './storage';

export const generateAdminId = (): string => {
  return `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const validateAdminData = (data: Partial<AdminProfile>): string[] => {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Name is required');
  }

  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.role || !['admin', 'superadmin'].includes(data.role)) {
    errors.push('Invalid role');
  }

  return errors;
};

export const handleImageUpload = async (file: File, type: 'avatar' | 'signature', adminId: string): Promise<string> => {
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
    console.error(`Error uploading ${type}:`, error);
    throw new Error(`Failed to upload ${type}`);
  }
};

export const deleteAdminImages = async (adminId: string): Promise<void> => {
  try {
    // Delete avatar
    await supabase.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .remove([`avatars/${adminId}`]);

    // Delete signature
    await supabase.storage
      .from(STORAGE_BUCKETS.SIGNATURES)
      .remove([`signatures/${adminId}`]);
  } catch (error) {
    console.error('Error deleting admin images:', error);
    throw new Error('Failed to delete admin images');
  }
};