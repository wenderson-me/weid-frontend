import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import TaskCard from '../../components/dashboard/TaskCard';
import GoalSection from '../../components/dashboard/GoalSection';
import TodaySection from '../../components/dashboard/TodaySection';
import QuickOffloadSection from '../../components/dashboard/QuickOffloadSection';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for tasks
  const taskCards = [
    {
      title: 'Swiftly offload tasks',
      description: 'for mental ease',
      colorClass: 'blue',
      dueDate: 'Today',
      subtasks: [
        { name: 'Review project', completed: true },
        { name: 'Update status', completed: false }
      ]
    },
    {
      title: 'Setup meeting notes',
      description: 'Prepare agenda',
      colorClass: 'pink',
      dueDate: 'Tomorrow',
      subtasks: [
        { name: 'Create template', completed: false },
        { name: 'Share with team', completed: false }
      ]
    },
    {
      title: 'Quarterly review',
      description: 'Performance check',
      colorClass: 'orange',
      dueDate: 'This week',
      priority: 'high',
      subtasks: [
        { name: 'Evaluate goals', completed: true },
        { name: 'Plan next quarter', completed: false }
      ]
    },
    {
      title: 'Team standup',
      description: 'Daily sync',
      colorClass: 'green',
      dueDate: 'Today',
      subtasks: [
        { name: 'Prepare update', completed: true }
      ]
    },
    {
      title: 'Code review',
      description: 'Check PR comments',
      colorClass: 'purple',
      dueDate: 'Today',
      subtasks: [
        { name: 'Review code', completed: false },
        { name: 'Provide feedback', completed: false }
      ]
    },
    {
      title: 'Client call',
      description: 'Q&A session',
      colorClass: 'cyan',
      dueDate: 'This week',
      subtasks: [
        { name: 'Prepare slides', completed: true },
        { name: 'Test audio/video', completed: false }
      ]
    }
  ];

  const goalSections = [
    {
      title: 'Q1 Goals',
      date: 'January - March',
      tasks: [
        { name: 'Increase productivity by 20%', completed: false, priority: 'high' },
        { name: 'Complete training course', completed: true, priority: 'medium' },
        { name: 'Launch new feature', completed: false, priority: 'high' }
      ]
    },
    {
      title: 'Personal Development',
      date: 'Ongoing',
      tasks: [
        { name: 'Read 2 books', completed: false, priority: 'low' },
        { name: 'Exercise 3x per week', completed: true, priority: 'medium' },
        { name: 'Learn new skill', completed: false, priority: 'medium' }
      ]
    }
  ];

  const todayTasks = [
    { name: 'Review emails', completed: true },
    { name: 'Complete project report', completed: false },
    { name: 'Team meeting', completed: false },
    { name: 'Update documentation', completed: true }
  ];

  const quickOffloadTasks = [
    { name: 'Buy groceries', completed: false },
    { name: 'Fix bug in sidebar', completed: false },
    { name: 'Reply to support ticket', completed: true },
    { name: 'Schedule dentist appointment', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {currentUser?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Organize, schedule, and boost your productivity
          </p>
        </div>

        {/* Main layout: Cards Grid + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Task Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {taskCards.map((card, idx) => (
                <TaskCard
                  key={idx}
                  {...card}
                />
              ))}
            </div>
          </div>

          {/* Right: Goals & Today */}
          <div className="space-y-6">
            {/* Today Section */}
            <TodaySection tasks={todayTasks} />

            {/* Quick Offload */}
            <QuickOffloadSection tasks={quickOffloadTasks} />
          </div>
        </div>

        {/* Goals Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Set and Achieve Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goalSections.map((section, idx) => (
              <div key={idx}>
                <GoalSection {...section} />
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold text-gray-800 mb-2">Intuitive Interface</h3>
            <p className="text-sm text-gray-600">Easy to use and understand</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-gray-800 mb-2">Collaborative Tools</h3>
            <p className="text-sm text-gray-600">Work together seamlessly</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-bold text-gray-800 mb-2">Customizable Templates</h3>
            <p className="text-sm text-gray-600">Tailor to your needs</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-bold text-gray-800 mb-2">Real-Time Updates</h3>
            <p className="text-sm text-gray-600">Stay synchronized always</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
