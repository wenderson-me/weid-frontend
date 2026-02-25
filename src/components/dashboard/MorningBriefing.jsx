import React from 'react';
import { FiCalendar } from 'react-icons/fi';

const MorningBriefing = () => {
  const currentDate = new Date();
  
  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const motivationalQuotes = [
    "Until we can manage time, we can manage nothing else.",
    "The secret of getting ahead is getting started.",
    "Do the hard jobs first. The easy jobs will take care of themselves.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The only way to do great work is to love what you do."
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 mb-6 border border-violet-100">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getGreeting()}
        </h2>
        <div className="flex items-center text-gray-600">
          <FiCalendar className="mr-2" />
          <span>{formatDate(currentDate)}</span>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-violet-100">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-800 mb-2">Today's Tasks</h3>
          <p className="text-sm text-gray-600">No tasks scheduled for today</p>
        </div>
        <p className="text-sm italic text-purple-700 border-l-2 border-purple-400 pl-3">
          {randomQuote}
        </p>
      </div>
    </div>
  );
};

export default MorningBriefing;
