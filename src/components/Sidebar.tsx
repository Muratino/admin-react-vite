import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { RootState } from '../store/store';
import { toggleSidebar } from '../store/sidebarSlice';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: ShoppingCart, label: 'Products', path: '/products' },
  { icon: BarChart3, label: 'Calendar', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state: RootState) => state.sidebar.isCollapsed);
  
  return (
    <>
      {/* Backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-20 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="absolute -right-3 top-6 bg-gray-900 text-white p-1 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-40"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <div className={`flex items-center gap-2 mb-8 p-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <LayoutDashboard className="h-8 w-8 text-blue-400 flex-shrink-0" />
          <span className={`text-xl font-bold transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
          }`}>
            AdminHub
          </span>
        </div>
        
        <nav className="space-y-2 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className={`transition-opacity duration-300 ${
                  isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}