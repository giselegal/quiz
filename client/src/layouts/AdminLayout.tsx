
import React from 'react';
import { Outlet } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};
