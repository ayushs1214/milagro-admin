// Dashboard metrics (empty since we're using real data)
export const mockMetrics = [];

// Chart data (empty since we're using real data)
export const mockChartData = {
  revenue: [],
  users: [],
  userTypes: [],
  orderStatus: []
};

// Categories
export const mockCategories = [
  {
    id: 'slabs',
    name: 'Slabs',
    description: 'Large format tiles and slabs',
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&q=80&w=300&h=200'
  },
  {
    id: 'subways',
    name: 'Subways',
    description: 'Classic subway tiles',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=300&h=200'
  },
  {
    id: 'wall',
    name: 'Wall',
    description: 'Wall tiles and coverings',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=300&h=200'
  },
  {
    id: 'floor',
    name: 'Floor',
    description: 'Floor tiles and coverings',
    image: 'https://images.unsplash.com/photo-1584622781867-3c672631bbdd?auto=format&fit=crop&q=80&w=300&h=200'
  }
];

// Mock users data
export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'dealer',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=200',
    businessInfo: {
      companyName: 'Doe Enterprises',
      phone: '+91 98765 43210',
      gstNumber: '29ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      address: '123 Business District, Mumbai, India'
    },
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-03-15T14:30:00Z'
  }
];

// Mock products data
export const mockProducts = [
  {
    id: '1',
    productId: 'MIL-MAR-001',
    seriesName: 'Marble Elite',
    finishedName: 'Carrara White',
    colors: [
      {
        name: 'White',
        image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&q=80&w=300&h=200'
      }
    ],
    categories: ['slabs', 'floor'],
    applicationType: 'floor',
    stock: 500,
    price: 2800,
    moq: 50,
    msp: 3200,
    status: 'active',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&q=80&w=300&h=200'
      }
    ],
    manufacturedIn: 'Italy',
    checkMaterialDepot: true,
    size: {
      length: 1200,
      width: 600,
      height: 10,
      unit: 'mm'
    },
    inventoryQty: 500,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  }
];

// Mock admins data
export const mockAdmins = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'admin@milagro.com',
    role: 'superadmin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastLogin: '2024-03-15T14:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    permissions: ['all']
  },
  {
    id: '2',
    name: 'Test Admin',
    email: 'testadmin@milagro.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastLogin: '2024-03-15T12:45:00Z',
    createdAt: '2024-02-01T00:00:00Z',
    permissions: ['users', 'products', 'orders']
  }
];