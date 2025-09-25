'use client';

import React, { useState } from 'react';
import WithdrawalManagementTable from '../admin/WithdrawalManagementTable';
import CashFlowTable from '../admin/CashFlowTable';

const AdminPaymentsPage: React.FC = () => {
  const [showWithdrawalDetail, setShowWithdrawalDetail] = useState(false);
  const [showCashFlowDetail, setShowCashFlowDetail] = useState(false);

  // We need to manage the state here to ensure when one table shows detail, the other is hidden
  const handleWithdrawalDetailToggle = (show: boolean) => {
    setShowWithdrawalDetail(show);
  };

  const handleCashFlowDetailToggle = (show: boolean) => {
    setShowCashFlowDetail(show);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Only show WithdrawalManagementTable if no cash flow detail view is active */}
      {!showCashFlowDetail && (
        <WithdrawalManagementTable onDetailToggle={handleWithdrawalDetailToggle} />
      )}
      
      {/* Only show CashFlowTable if no withdrawal detail view is active */}
      {!showWithdrawalDetail && (
        <CashFlowTable onDetailToggle={handleCashFlowDetailToggle} />
      )}
    </div>
  );
};

export default AdminPaymentsPage;