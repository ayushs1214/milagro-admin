export function validateProductTemplate(row: ProductTemplate): string[] {
  const errors: string[] = [];

  if (!row.productId) errors.push('Product ID is required');
  if (!row.seriesName) errors.push('Series Name is required');
  if (!row.finishedName) errors.push('Finished Name is required');
  
  // Validate color names and images
  const colorNames = row.colorNames.split(',').map(c => c.trim());
  const colorImages = row.colorImages.split(',').map(i => i.trim());
  if (colorNames.length !== colorImages.length) {
    errors.push('Number of color names must match number of color images');
  }

  // Validate categories
  const validCategories = ['slabs', 'subways', 'wall', 'floor'];
  const categories = row.categories.split(',').map(c => c.trim());
  const invalidCategories = categories.filter(c => !validCategories.includes(c));
  if (invalidCategories.length > 0) {
    errors.push(`Invalid categories: ${invalidCategories.join(', ')}`);
  }

  // Validate application type
  const validApplicationTypes = ['highlighter', 'wall', 'floor', 'outdoor'];
  if (!validApplicationTypes.includes(row.applicationType) && row.applicationType !== 'other') {
    errors.push('Invalid application type');
  }

  // Validate numeric values
  if (row.stock < 0) errors.push('Stock must be non-negative');
  if (row.price <= 0) errors.push('Price must be greater than 0');
  if (row.moq <= 0) errors.push('MOQ must be greater than 0');
  if (row.msp && row.msp <= 0) errors.push('MSP must be greater than 0');
  if (row.length <= 0) errors.push('Length must be greater than 0');
  if (row.width <= 0) errors.push('Width must be greater than 0');
  if (row.height <= 0) errors.push('Height must be greater than 0');
  if (row.inventoryQty < 0) errors.push('Inventory quantity must be non-negative');

  // Validate URLs
  const validateUrls = (urls: string, field: string) => {
    if (urls) {
      const urlList = urls.split(',').map(u => u.trim());
      urlList.forEach(url => {
        try {
          new URL(url);
        } catch {
          errors.push(`Invalid URL in ${field}: ${url}`);
        }
      });
    }
  };

  validateUrls(row.images, 'Images');
  validateUrls(row.videos, 'Videos');
  validateUrls(row.pdfs, 'PDFs');
  validateUrls(row.models3d, '3D Models');

  if (!row.manufacturedIn) errors.push('Manufacturing country is required');
  if (typeof row.checkMaterialDepot !== 'boolean') errors.push('Check Material Depot must be true or false');

  return errors;
}

export function convertTemplateToProduct(template: ProductTemplate): Omit<Product, 'status' | 'createdAt' | 'updatedAt'> {
  const colorNames = template.colorNames.split(',').map(c => c.trim());
  const colorImages = template.colorImages.split(',').map(i => i.trim());
  const colors: ProductColor[] = colorNames.map((name, index) => ({
    name,
    image: colorImages[index]
  }));

  const media: ProductMedia[] = [
    ...template.images.split(',').map(url => ({ type: 'image' as const, url: url.trim() })),
    ...template.videos.split(',').map(url => ({ type: 'video' as const, url: url.trim() })),
    ...template.pdfs.split(',').map(url => ({ type: 'pdf' as const, url: url.trim() })),
    ...template.models3d.split(',').map(url => ({ type: '3d' as const, url: url.trim() }))
  ];

  return {
    id: crypto.randomUUID(),
    productId: template.productId,
    seriesName: template.seriesName,
    finishedName: template.finishedName,
    colors,
    categories: template.categories.split(',').map(c => c.trim()) as Product['categories'],
    applicationType: template.applicationType,
    stock: template.stock,
    price: template.price,
    moq: template.moq,
    msp: template.msp,
    media,
    manufacturedIn: template.manufacturedIn,
    checkMaterialDepot: template.checkMaterialDepot,
    size: {
      length: template.length,
      width: template.width,
      height: template.height,
      unit: 'mm'
    },
    inventoryQty: template.inventoryQty
  };
}