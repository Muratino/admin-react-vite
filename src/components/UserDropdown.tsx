import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { User, Settings, LogOut } from 'lucide-react';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

interface UserDropdownProps {
  user: { 
    email: string;
    username?: string;
    avatar?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDropdown({ user, isOpen, onClose }: UserDropdownProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
    >
      <div className="py-1">
        <div className="px-4 py-2 border-b">
          <p className="text-sm font-medium text-gray-900">
            {user?.username || user?.email}
          </p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
        
        <button
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <User className="mr-3 h-4 w-4" />
          Profile
        </button>
        
        <button
          onClick={() => {
            navigate('/settings');
            onClose();
          }}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </button>
        
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}