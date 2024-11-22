import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { restoreUser } from './store/authSlice';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Calendar from './components/calendar/Calendar';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import AuthLayout from './components/auth/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfileForm from './components/profile/ProfileForm';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthLayout><LoginForm /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterForm /></AuthLayout>} />
        <Route path="*" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <div className="flex-1 flex flex-col overflow-hidden ml-[5rem]">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={<div className="p-6">Users Page</div>} />
                    <Route path="/products" element={<div className="p-6">Products Page</div>} />
                    <Route path="/analytics" element={<Calendar />} />
                    <Route path="/settings" element={<div className="p-6">Settings Page</div>} />
                    <Route path="/profile" element={<ProfileForm />} />
                  </Routes>
                </main>
              </div>
              <Sidebar />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}