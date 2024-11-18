import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Calendar from './components/calendar/Calendar';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<div className="p-6">Users Page</div>} />
              <Route path="/products" element={<div className="p-6">Products Page</div>} />
              <Route path="/analytics" element={<Calendar />} />
              <Route path="/settings" element={<div className="p-6">Settings Page</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}