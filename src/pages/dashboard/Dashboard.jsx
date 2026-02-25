import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import MorningBriefing from '../../components/dashboard/MorningBriefing';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome message */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {currentUser?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Morning Briefing */}
      <MorningBriefing />

      {/* Placeholder for future components */}
      <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard</h2>
        <p className="text-gray-600">
          Your dashboard is ready for new features and integrations.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
