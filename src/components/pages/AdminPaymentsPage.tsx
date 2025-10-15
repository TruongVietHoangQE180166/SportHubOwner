'use client';

import React, { useState, useEffect } from 'react';
import { fieldService } from '../../services/fieldService';
import AdminCashFlowSummary from '../admin/AdminCashFlowSummary';
import WithdrawalManagementTable from '../admin/WithdrawalManagementTable';
import CashFlowTable from '../admin/CashFlowTable';
import { CashFlow, Withdrawal } from '../../types/payment';

const AdminPaymentsPage: React.FC = () => {
  const [showWithdrawalDetail, setShowWithdrawalDetail] = useState(false);
  const [showCashFlowDetail, setShowCashFlowDetail] = useState(false);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cash flow data for the summary component
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cashFlowResponse, withdrawalResponse] = await Promise.all([
          fieldService.getCashFlow(1, 1000, 'createdDate', 'desc'),
          fieldService.getAllWithdrawal(1, 1000, 'createdDate', 'desc')
        ]);
        setCashFlows(cashFlowResponse.data.content);
        setWithdrawals(withdrawalResponse.data.content);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // We need to manage the state here to ensure when one table shows detail, the other is hidden
  const handleWithdrawalDetailToggle = (show: boolean) => {
    setShowWithdrawalDetail(show);
  };

  const handleCashFlowDetailToggle = (show: boolean) => {
    setShowCashFlowDetail(show);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Admin Cash Flow Summary at the top - hidden when viewing details */}
      {!showWithdrawalDetail && !showCashFlowDetail && (
        <AdminCashFlowSummary cashFlows={cashFlows} withdrawals={withdrawals} />
      )}
      
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