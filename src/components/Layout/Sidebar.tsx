import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  FileSpreadsheet,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Package,
  Upload,
  Boxes,
  Mail,
  Shield,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserCog,
  CreditCard,
  ClipboardList,
  PackageCheck,
  Building2,
  Bell,
  PackageSearch,
  LogOut
} from 'lucide-react';
import { useSidebarStore } from '../../store/sidebarStore';
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../utils/permissions';
import type { Permission } from '../../types';

export function Sidebar() {
  const { isCollapsed, toggleCollapse, currentPage, setCurrentPage } = useSidebarStore();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [showUserSubmenu, setShowUserSubmenu] = useState(false);
  const [showOrderSubmenu, setShowOrderSubmenu] = useState(false);
  const [showProductSubmenu, setShowProductSubmenu] = useState(false);
  const [showExpoSubmenu, setShowExpoSubmenu] = useState(false);

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      id: 'dashboard',
      permission: 'analytics.view' as Permission
    },
    {
      icon: Users,
      label: 'Users',
      id: 'users-section',
      permission: 'users.view' as Permission,
      submenu: [
        { icon: UserCog, label: 'User Management', id: 'users', permission: 'users.manage' as Permission },
        { icon: UserCheck, label: 'Approvals', id: 'approvals', permission: 'users.manage' as Permission }
      ]
    },
    { 
      icon: Shield, 
      label: 'Admin Management', 
      id: 'admin', 
      permission: 'admins.manage' as Permission,
      role: 'superadmin' 
    },
    {
      icon: Package,
      label: 'Products',
      id: 'products-section',
      permission: 'products.view' as Permission,
      submenu: [
        { icon: ShoppingBag, label: 'Product Management', id: 'products', permission: 'products.manage' as Permission },
        { icon: PackageCheck, label: 'Inventory Management', id: 'inventory', permission: 'inventory.manage' as Permission },
        { icon: PackageSearch, label: 'Sample Management', id: 'samples', permission: 'samples.manage' as Permission }
      ]
    },
    {
      icon: FileSpreadsheet,
      label: 'Orders',
      id: 'orders-section',
      permission: 'orders.view' as Permission,
      submenu: [
        { icon: ClipboardList, label: 'Order Management', id: 'orders', permission: 'orders.process' as Permission },
        { icon: CreditCard, label: 'Order Payments', id: 'payments', permission: 'payments.manage' as Permission }
      ]
    },
    {
      icon: Building2,
      label: 'Expo',
      id: 'expo-section',
      permission: 'expo.view' as Permission,
      submenu: [
        { icon: Boxes, label: 'Expo Management', id: 'expo', permission: 'expo.manage' as Permission },
        { icon: Upload, label: 'Bulk Upload', id: 'upload', permission: 'expo.manage' as Permission }
      ]
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      id: 'notifications',
      permission: 'settings.manage' as Permission
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      id: 'analytics',
      permission: 'analytics.view' as Permission
    },
    { 
      icon: Mail, 
      label: 'Contact', 
      id: 'contact',
      permission: 'settings.view' as Permission
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      id: 'settings',
      permission: 'settings.manage' as Permission
    }
  ];

  const handleMenuClick = (item: any) => {
    if (item.submenu) {
      if (item.id === 'users-section') {
        setShowUserSubmenu(!showUserSubmenu);
        setShowOrderSubmenu(false);
        setShowProductSubmenu(false);
        setShowExpoSubmenu(false);
      } else if (item.id === 'orders-section') {
        setShowOrderSubmenu(!showOrderSubmenu);
        setShowUserSubmenu(false);
        setShowProductSubmenu(false);
        setShowExpoSubmenu(false);
      } else if (item.id === 'products-section') {
        setShowProductSubmenu(!showProductSubmenu);
        setShowUserSubmenu(false);
        setShowOrderSubmenu(false);
        setShowExpoSubmenu(false);
      } else if (item.id === 'expo-section') {
        setShowExpoSubmenu(!showExpoSubmenu);
        setShowUserSubmenu(false);
        setShowOrderSubmenu(false);
        setShowProductSubmenu(false);
      }
    } else {
      setCurrentPage(item.id);
      if (isCollapsed) {
        setShowUserSubmenu(false);
        setShowOrderSubmenu(false);
        setShowProductSubmenu(false);
        setShowExpoSubmenu(false);
      }
    }
  };

  const canAccessMenuItem = (item: any): boolean => {
    if (!user) return false;
    
    // Superadmin has access to everything
    if (user.role === 'superadmin') return true;
    
    // Check role-specific restrictions
    if (item.role && item.role !== user.role) return false;
    
    // Check permissions
    if (item.permission && !hasPermission(user.permissions, item.permission)) return false;
    
    // If it has a submenu, check if user has access to at least one submenu item
    if (item.submenu) {
      return item.submenu.some((subitem: any) => 
        !subitem.permission || hasPermission(user.permissions, subitem.permission)
      );
    }
    
    return true;
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
        {!isCollapsed && (
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Milagro Admin
          </span>
        )}
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>

      <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
        <nav className="p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              if (!canAccessMenuItem(item)) return null;
              
              const Icon = item.icon;
              const isActive = item.submenu 
                ? item.submenu.some(subitem => subitem.id === currentPage)
                : currentPage === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-100'
                    } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-3">{item.label}</span>}
                    </div>
                    {!isCollapsed && item.submenu && (
                      ((item.id === 'users-section' && showUserSubmenu) || 
                       (item.id === 'orders-section' && showOrderSubmenu) ||
                       (item.id === 'products-section' && showProductSubmenu) ||
                       (item.id === 'expo-section' && showExpoSubmenu))
                        ? <ChevronUp className="h-4 w-4" /> 
                        : <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {!isCollapsed && item.submenu && (
                    ((item.id === 'users-section' && showUserSubmenu) || 
                     (item.id === 'orders-section' && showOrderSubmenu) ||
                     (item.id === 'products-section' && showProductSubmenu) ||
                     (item.id === 'expo-section' && showExpoSubmenu))
                  ) && (
                    <ul className="mt-2 ml-6 space-y-2">
                      {item.submenu.map((subitem) => {
                        if (!canAccessMenuItem(subitem)) return null;
                        
                        const SubIcon = subitem.icon;
                        return (
                          <li key={subitem.id}>
                            <button
                              onClick={() => setCurrentPage(subitem.id)}
                              className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                currentPage === subitem.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-100'
                              }`}
                            >
                              <SubIcon className="h-4 w-4 mr-2" />
                              <span>{subitem.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className={`flex items-center w-full p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}