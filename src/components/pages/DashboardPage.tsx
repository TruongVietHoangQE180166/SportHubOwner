'use client'
import React, { useEffect } from 'react';
import Dashboard from '../Dashboard';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useFieldStore } from '../../stores/fieldStore';
import { useUserStore } from '../../stores/userStore';
import { mockActivities } from '../../data/mockAnalytics';
import { useAuthStore } from '../../stores/authStore';

const DashboardPage: React.FC = () => {
  const { analytics, loading: analyticsLoading, fetchAnalytics } = useAnalyticsStore();
  const { fields, loading: fieldsLoading, fetchFields } = useFieldStore();
  const { profile, loading: profileLoading, fetchProfile } = useUserStore();
   const { user } = useAuthStore();

  useEffect(() => {
    fetchAnalytics();
    fetchFields();
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [fetchAnalytics, fetchFields, fetchProfile, user]);

  if (analyticsLoading || fieldsLoading || profileLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!analytics || !fields || !profile) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div>Không tải được dữ liệu</div> 
      </div>
    );
  }

  return (
    <Dashboard 
      analytics={analytics}
      activities={mockActivities}
      fields={fields}
      user={profile}
    />
  );
};

export default DashboardPage;