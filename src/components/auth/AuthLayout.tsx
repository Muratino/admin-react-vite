import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../store/store';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="absolute inset-2 rounded-full bg-white"></div>
          <div className="absolute inset-4 rounded-full bg-blue-500 animate-spin"></div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          AdminHub
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}