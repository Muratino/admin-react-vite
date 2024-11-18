import React from 'react';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

const stats = [
  {
    label: 'Total Users',
    value: '24.8k',
    change: '+12%',
    icon: Users,
    color: 'blue',
  },
  {
    label: 'Total Products',
    value: '145.2k',
    change: '+8%',
    icon: ShoppingBag,
    color: 'green',
  },
  {
    label: 'Revenue',
    value: '$45.2k',
    change: '+23%',
    icon: DollarSign,
    color: 'purple',
  },
  {
    label: 'Growth',
    value: '92%',
    change: '+4%',
    icon: TrendingUp,
    color: 'orange',
  },
];

const recentUsers = [
  { name: 'Sarah Johnson', email: 'sarah.j@example.com', status: 'active' },
  { name: 'Michael Chen', email: 'michael.c@example.com', status: 'pending' },
  { name: 'Emma Wilson', email: 'emma.w@example.com', status: 'active' },
  { name: 'James Brown', email: 'james.b@example.com', status: 'inactive' },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 font-medium">{stat.change}</span>
                <span className="text-gray-600 ml-2">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Users</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.email} className="border-b last:border-b-0">
                  <td className="py-3">{user.name}</td>
                  <td className="py-3 text-gray-500">{user.email}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}