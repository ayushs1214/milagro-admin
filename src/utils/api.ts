import { mockProducts, mockCategories, mockUsers, mockAdmins } from '../store/mockData';
import type { User, Admin, Product } from '../types';

const mockApi = {
  products: {
    getProducts: () => Promise.resolve({ data: mockProducts }),
    getCategories: () => Promise.resolve({ data: mockCategories }),
    createProduct: (data: FormData) => {
      const newProduct = {
        id: String(mockProducts.length + 1),
        name: data.get('name'),
        description: data.get('description') || '',
        price: Number(data.get('price')),
        category: data.get('category'),
        images: ['https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&q=80&w=300&h=200'],
        specifications: {
          color: data.get('color')
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockProducts.push(newProduct);
      return Promise.resolve({ data: newProduct });
    },
    updateProduct: (id: string, data: FormData) => {
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        Object.assign(product, {
          name: data.get('name'),
          description: data.get('description') || '',
          price: Number(data.get('price')),
          category: data.get('category'),
          specifications: {
            ...product.specifications,
            color: data.get('color')
          },
          updatedAt: new Date().toISOString()
        });
      }
      return Promise.resolve({ data: product });
    },
    deleteProduct: (id: string) => {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index > -1) mockProducts.splice(index, 1);
      return Promise.resolve({ data: { success: true } });
    }
  },

  users: {
    getUsers: () => Promise.resolve({ data: mockUsers }),
    getPendingApprovals: () => Promise.resolve({ 
      data: mockUsers.filter(u => u.status === 'pending')
    }),
    approveUser: (id: string) => {
      const user = mockUsers.find(u => u.id === id);
      if (user) {
        user.status = 'active';
      }
      return Promise.resolve({ data: user });
    },
    rejectUser: (id: string) => {
      const user = mockUsers.find(u => u.id === id);
      if (user) {
        user.status = 'rejected';
      }
      return Promise.resolve({ data: user });
    },
    deleteUser: (id: string) => {
      const index = mockUsers.findIndex(u => u.id === id);
      if (index > -1) mockUsers.splice(index, 1);
      return Promise.resolve({ data: { success: true } });
    },
    updateProfile: (id: string, data: Partial<User>) => {
      const user = mockUsers.find(u => u.id === id);
      if (user) {
        Object.assign(user, data);
      }
      return Promise.resolve({ data: user });
    }
  },

  admins: {
    getAdmins: () => Promise.resolve({ data: mockAdmins }),
    createAdmin: (data: any) => {
      const newAdmin = {
        id: String(mockAdmins.length + 1),
        name: data.name,
        email: data.email,
        role: data.role,
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        permissions: []
      };
      mockAdmins.push(newAdmin);
      return Promise.resolve({ data: newAdmin });
    },
    updateAdmin: (id: string, data: Partial<Admin>) => {
      const admin = mockAdmins.find(a => a.id === id);
      if (admin) {
        Object.assign(admin, data);
      }
      return Promise.resolve({ data: admin });
    },
    deleteAdmin: (id: string) => {
      const index = mockAdmins.findIndex(a => a.id === id);
      if (index > -1) mockAdmins.splice(index, 1);
      return Promise.resolve({ data: { success: true } });
    },
    updateAdminPhoto: (id: string, formData: FormData) => {
      const admin = mockAdmins.find(a => a.id === id);
      if (admin) {
        // In a real app, this would handle file upload
        admin.avatar = URL.createObjectURL(formData.get('photo') as File);
      }
      return Promise.resolve({ data: admin });
    }
  }
};

export const productsApi = mockApi.products;
export const usersApi = mockApi.users;
export const adminApi = mockApi.admins;