import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { Product, ProductColor, ProductMedia } from '../../types';

interface ProductFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Partial<Product>;
  onCancel: () => void;
}

export function ProductForm({ onSubmit, initialData, onCancel }: ProductFormProps) {
  const user = useAuthStore(state => state.user);
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [colors, setColors] = useState<ProductColor[]>(initialData?.colors || []);
  const [customApplication, setCustomApplication] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [colorPreviews, setColorPreviews] = useState<string[]>([]);
  const [media, setMedia] = useState<ProductMedia[]>(initialData?.media || []);

  const handleAddColor = () => {
    setColors([...colors, { name: '', image: '' }]);
    setColorPreviews([...colorPreviews, '']);
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
    setColorPreviews(colorPreviews.filter((_, i) => i !== index));
  };

  const handleColorChange = (index: number, field: 'name' | 'image', value: string | File) => {
    setColors(colors.map((color, i) => 
      i === index ? { ...color, [field]: value } : color
    ));

    if (field === 'image' && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setColorPreviews(prev => {
          const newPreviews = [...prev];
          newPreviews[index] = reader.result as string;
          return newPreviews;
        });
      };
      reader.readAsDataURL(value);
    }
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleColorChange(index, 'image', file);
    }
  };

  const handleMediaUpload = (type: ProductMedia['type'], files: FileList | null) => {
    if (!files) return;
    
    const newMedia = Array.from(files).map(file => ({
      type,
      url: file,
      title: file.name
    }));
    
    setMedia([...media, ...newMedia]);
  };

  const handleRemoveMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Handle categories (multiple select)
      const selectedCategories = Array.from(formData.getAll('categories'));
      formData.delete('categories');
      formData.append('categories', JSON.stringify(selectedCategories));

      // Handle colors
      colors.forEach((color, index) => {
        formData.append(`colorNames[${index}]`, color.name);
        if (color.image instanceof File) {
          formData.append(`colorImages[${index}]`, color.image);
        } else {
          formData.append(`colorImageUrls[${index}]`, color.image as string);
        }
      });

      // Handle media files
      media.forEach((item, index) => {
        if (item.url instanceof File) {
          formData.append(`media[${index}]`, item.url);
          formData.append(`mediaTypes[${index}]`, item.type);
          if (item.title) formData.append(`mediaTitles[${index}]`, item.title);
        } else {
          formData.append(`mediaUrls[${index}]`, item.url as string);
          formData.append(`mediaTypes[${index}]`, item.type);
          if (item.title) formData.append(`mediaTitles[${index}]`, item.title);
        }
      });

      // Handle custom application type
      const applicationType = formData.get('applicationType');
      if (applicationType === 'other') {
        formData.set('applicationType', customApplication);
      }

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product ID *
          </label>
          <input
            type="text"
            name="productId"
            required
            defaultValue={initialData?.productId}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Series Name *
          </label>
          <input
            type="text"
            name="seriesName"
            required
            defaultValue={initialData?.seriesName}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Finished Name *
          </label>
          <input
            type="text"
            name="finishedName"
            required
            defaultValue={initialData?.finishedName}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Categories *
          </label>
          <select
            name="categories"
            multiple
            required
            defaultValue={initialData?.categories}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="slabs">Slabs</option>
            <option value="subways">Subways</option>
            <option value="wall">Wall</option>
            <option value="floor">Floor</option>
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Hold Ctrl/Cmd to select multiple
          </p>
        </div>

        {/* Application Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Application Type *
          </label>
          <select
            name="applicationType"
            required
            defaultValue={initialData?.applicationType}
            onChange={(e) => {
              if (e.target.value === 'other') {
                setCustomApplication('');
              }
            }}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="highlighter">Highlighter</option>
            <option value="wall">Wall</option>
            <option value="floor">Floor</option>
            <option value="outdoor">Outdoor</option>
            <option value="other">Other</option>
          </select>
          {customApplication === 'other' && (
            <input
              type="text"
              value={customApplication}
              onChange={(e) => setCustomApplication(e.target.value)}
              placeholder="Specify application type"
              className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          )}
        </div>

        {/* Stock and Price Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Stock *
          </label>
          <input
            type="number"
            name="stock"
            required
            min="0"
            defaultValue={initialData?.stock}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Price *
          </label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="0.01"
            defaultValue={initialData?.price}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Minimum Order Quantity (MOQ) *
          </label>
          <input
            type="number"
            name="moq"
            required
            min="1"
            defaultValue={initialData?.moq}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {isAdmin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Maximum Selling Price (MSP) *
            </label>
            <input
              type="number"
              name="msp"
              required
              min="0"
              step="0.01"
              defaultValue={initialData?.msp}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Manufactured In
          </label>
          <select
            name="manufacturedIn"
            defaultValue={initialData?.manufacturedIn}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="India">India</option>
            <option value="China">China</option>
            <option value="Italy">Italy</option>
            <option value="Spain">Spain</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Check Material Depot
          </label>
          <input
            type="checkbox"
            name="checkMaterialDepot"
            defaultChecked={initialData?.checkMaterialDepot}
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-3 gap-4 md:col-span-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Length (mm)
            </label>
            <input
              type="number"
              name="length"
              min="0"
              defaultValue={initialData?.size?.length}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Width (mm)
            </label>
            <input
              type="number"
              name="width"
              min="0"
              defaultValue={initialData?.size?.width}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Height (mm)
            </label>
            <input
              type="number"
              name="height"
              min="0"
              defaultValue={initialData?.size?.height}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Color Tones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color Tones *
        </label>
        <div className="space-y-4">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                value={color.name}
                onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                placeholder="Color name"
                className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="url"
                  value={typeof color.image === 'string' ? color.image : ''}
                  onChange={(e) => handleColorChange(index, 'image', e.target.value)}
                  placeholder="Image URL (optional)"
                  className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <span className="text-gray-500 dark:text-gray-400">or</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 text-sm text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                >
                  Upload
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e)}
                  className="hidden"
                />
              </div>

              {colorPreviews[index] && (
                <img
                  src={colorPreviews[index]}
                  alt={`Preview ${index + 1}`}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}

              <button
                type="button"
                onClick={() => handleRemoveColor(index)}
                className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddColor}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
          >
            <Upload className="w-4 h-4 mr-2" />
            Add Color
          </button>
        </div>
      </div>

      {/* Media Files */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Additional Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleMediaUpload('image', e.target.files)}
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-600
              dark:file:bg-indigo-900/20 dark:file:text-indigo-400
              hover:file:bg-indigo-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Videos
          </label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => handleMediaUpload('video', e.target.files)}
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-600
              dark:file:bg-indigo-900/20 dark:file:text-indigo-400
              hover:file:bg-indigo-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            PDFs
          </label>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={(e) => handleMediaUpload('pdf', e.target.files)}
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-600
              dark:file:bg-indigo-900/20 dark:file:text-indigo-400
              hover:file:bg-indigo-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            3D Models
          </label>
          <input
            type="file"
            accept=".glb,.gltf"
            multiple
            onChange={(e) => handleMediaUpload('3d', e.target.files)}
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-600
              dark:file:bg-indigo-900/20 dark:file:text-indigo-400
              hover:file:bg-indigo-100"
          />
        </div>

        {/* Media Preview */}
        {media.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.map((item, index) => (
              <div key={index} className="relative">
                {item.type === 'image' && (
                  <img
                    src={item.url instanceof File ? URL.createObjectURL(item.url) : item.url}
                    alt={item.title || `Media ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                )}
                {item.type !== 'image' && (
                  <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(index)}
                  className="absolute top-1 right-1 p-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}