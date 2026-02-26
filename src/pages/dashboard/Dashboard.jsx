import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import MorningBriefing from '../../components/dashboard/MorningBriefing';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome message */}
      <div className="mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Welcome back, {currentUser?.name?.split(' ')[0]}!
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Morning Briefing */}
      <MorningBriefing />

      {/* Placeholder for future components */}
      <div
        className="mt-8 p-6 rounded-xl shadow-sm border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)'
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Dashboard
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your dashboard is ready for new features and integrations.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
