'use client';

import React from 'react';
import WelcomeHeader from '../dashboard/WelcomeHeader';

const AdminDashboardPage: React.FC = () => {
  // For now, using placeholder values since we don't have actual user data
  const userName = "Admin";
  const businessName = "SportHub Administration";

  return (
    <div className="p-6">
      <WelcomeHeader userName={userName} businessName={businessName} />
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <p className="text-gray-600">This is the admin dashboard page. Content will be added here.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;