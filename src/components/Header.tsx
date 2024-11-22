import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, Search, User } from 'lucide-react';
import { RootState } from '../store/store';
import UserDropdown from './UserDropdown';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
            >
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {user?.username || user?.email}
                </div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-600" />
                )}
              </div>
            </button>

            <UserDropdown
              user={user}
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}