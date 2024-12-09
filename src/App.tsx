import React, { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { useSidebarStore } from './store/sidebarStore';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';
import { AdminManagement } from './pages/AdminManagement';
import { ProductManagement } from './pages/ProductManagement';
import { Approvals } from './pages/Approvals';
import { Orders } from './pages/Orders';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Contact } from './pages/Contact';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { InventoryManagement } from './pages/InventoryManagement';
import { AddStock } from './pages/AddStock';
import { ManageStock } from './pages/ManageStock';
import { SampleManagement } from './pages/SampleManagement';
import { ExpoManagement } from './pages/ExpoManagement';
import { BulkUpload } from './pages/BulkUpload';
import { OrderPayments } from './pages/OrderPayments';
import { Notifications } from './pages/Notifications';
import { AdminDetails } from './components/Admin/AdminDetails';

export function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isDark = useThemeStore((state) => state.isDark);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const currentPage = useSidebarStore((state) => state.currentPage);
  const selectedAdminId = useSidebarStore((state) => state.selectedAdminId);
  const setSelectedAdminId = useSidebarStore((state) => state.setSelectedAdminId);
  const setCurrentPage = useSidebarStore((state) => state.setCurrentPage);

  // Apply dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      <Sidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header />
        <main className="p-6">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'users' && <UserManagement />}
          {currentPage === 'admin' && (
            selectedAdminId ? (
              <AdminDetails 
                adminId={selectedAdminId} 
                onBack={() => {
                  setSelectedAdminId(null);
                  setCurrentPage('admin');
                }}
              />
            ) : (
              <AdminManagement />
            )
          )}
          {currentPage === 'products' && <ProductManagement />}
          {currentPage === 'inventory' && <InventoryManagement />}
          {currentPage === 'addstock' && <AddStock />}
          {currentPage === 'managestock' && <ManageStock />}
          {currentPage === 'samples' && <SampleManagement />}
          {currentPage === 'approvals' && <Approvals />}
          {currentPage === 'orders' && <Orders />}
          {currentPage === 'payments' && <OrderPayments />}
          {currentPage === 'settings' && <Settings />}
          {currentPage === 'profile' && <Profile />}
          {currentPage === 'contact' && <Contact />}
          {currentPage === 'analytics' && <Analytics />}
          {currentPage === 'reports' && <Reports />}
          {currentPage === 'expo' && <ExpoManagement />}
          {currentPage === 'upload' && <BulkUpload />}
          {currentPage === 'notifications' && <Notifications />}
        </main>
      </div>
    </div>
  );
}