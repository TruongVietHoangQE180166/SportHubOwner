'use client';

import React from 'react';
import UserManagementTable from '../admin/UserManagementTable';

const AdminUsersPage: React.FC = () => {
  return (
    <div className="p-6">
      <UserManagementTable />
    </div>
  );
};

export default AdminUsersPage;