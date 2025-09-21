/**
 * Utility functions for calendar operations
 */

/**
 * Format a date as YYYY-MM-DD
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDateToYYYYMMDD = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format a date as HH:MM
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string
 */
export const formatTimeToHHMM = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Combine a date string and time string into a Date object
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timeStr - Time string in HH:MM format
 * @returns {Date|null} Combined date and time as Date object
 */
export const combineDateTime = (dateStr, timeStr) => {
  if (!dateStr) return null;

  const date = new Date(dateStr);

  if (timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date;
};

/**
 * Format a date for display in header
 * @param {Date} date - The date to format
 * @param {string} view - Current calendar view (month, week, day, list)
 * @returns {string} Formatted date string for display
 */
export const formatHeaderDate = (date, view) => {
  if (!date) return '';

  if (view === 'month') {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } else if (view === 'week') {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);


    if (startOfWeek.getMonth() === endOfWeek.getMonth() &&
        startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }

    else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'long' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }

    else {
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }
  } else if (view === 'day') {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } else {
    return 'Upcoming Tasks';
  }
};

/**
 * Get an array of days for a month grid
 * @param {Date} date - A date within the month
 * @returns {Date[]} Array of date objects for the month grid
 */
export const getMonthDays = (date) => {
  const days = [];
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const startingDayOfWeek = firstDay.getDay();


  const start = new Date(firstDay);
  start.setDate(start.getDate() - startingDayOfWeek);


  for (let i = 0; i < 42; i++) {
    days.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }

  return days;
};

/**
 * Get an array of days for a week
 * @param {Date} date - A date within the week
 * @returns {Date[]} Array of date objects for the week
 */
export const getWeekDays = (date) => {
  const days = [];
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

  for (let i = 0; i < 7; i++) {
    days.push(new Date(startOfWeek));
    startOfWeek.setDate(startOfWeek.getDate() + 1);
  }

  return days;
};

/**
 * Generate an array of hours for day view
 * @returns {number[]} Array of hours (0-23)
 */
export const getHoursArray = () => {
  return Array.from({ length: 24 }, (_, i) => i);
};

/**
 * Format hour for display (12-hour format with AM/PM)
 * @param {number} hour - Hour (0-23)
 * @returns {string} Formatted hour string
 */
export const formatHour = (hour) => {
  return hour === 0 ? '12 AM' :
         hour < 12 ? `${hour} AM` :
         hour === 12 ? '12 PM' :
         `${hour - 12} PM`;
};

/**
 * Check if a task is overdue
 * @param {Object} task - Task object with dueDate
 * @returns {boolean} True if task is overdue
 */
export const isTaskOverdue = (task) => {
  if (!task?.dueDate || task.status === 'done') return false;

  const dueDate = new Date(task.dueDate);
  const now = new Date();

  return dueDate < now;
};

/**
 * Get status for a date (Today, Tomorrow, etc.)
 * @param {Date} date - The date to check
 * @returns {Object} Date status with label and CSS class
 */
export const getDateStatus = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  if (checkDate.getTime() === today.getTime()) {
    return { label: 'Today', class: 'bg-blue-100 text-blue-800' };
  } else if (checkDate.getTime() === tomorrow.getTime()) {
    return { label: 'Tomorrow', class: 'bg-purple-100 text-purple-800' };
  } else if (checkDate.getTime() === yesterday.getTime()) {
    return { label: 'Yesterday', class: 'bg-amber-100 text-amber-800' };
  } else if (checkDate < today) {
    return { label: 'Overdue', class: 'bg-red-100 text-red-800' };
  } else {

    const diffTime = checkDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return { label: 'This Week', class: 'bg-green-100 text-green-800' };
    } else if (diffDays <= 14) {
      return { label: 'Next Week', class: 'bg-teal-100 text-teal-800' };
    } else {
      return { label: 'Upcoming', class: 'bg-gray-100 text-gray-800' };
    }
  }
};

/**
 * Get color class based on task priority
 * @param {string} priority - Task priority
 * @returns {string} CSS class for the priority
 */
export const getPriorityColorClass = (priority) => {
  switch (priority) {
    case 'low':
      return 'bg-gray-100 text-gray-800';
    case 'medium':
      return 'bg-blue-100 text-blue-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'urgent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get color class based on task status
 * @param {string} status - Task status
 * @returns {string} CSS class for the status
 */
export const getStatusColorClass = (status) => {
  switch (status) {
    case 'todo':
      return 'bg-gray-100 text-gray-800';
    case 'inProgress':
      return 'bg-blue-100 text-blue-800';
    case 'inReview':
      return 'bg-amber-100 text-amber-800';
    case 'done':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get border color class based on task status
 * @param {string} status - Task status
 * @returns {string} CSS border class for the status
 */
export const getStatusBorderClass = (status) => {
  switch (status) {
    case 'todo':
      return 'border-gray-300';
    case 'inProgress':
      return 'border-blue-300';
    case 'inReview':
      return 'border-amber-300';
    case 'done':
      return 'border-green-300';
    default:
      return 'border-gray-300';
  }
};

/**
 * Get formatted label for task status
 * @param {string} status - Task status
 * @returns {string} Human-readable status label
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'inProgress':
      return 'In Progress';
    case 'inReview':
      return 'In Review';
    case 'done':
      return 'Done';
    default:
      return status;
  }
};

export default {
  formatDateToYYYYMMDD,
  formatTimeToHHMM,
  combineDateTime,
  formatHeaderDate,
  getMonthDays,
  getWeekDays,
  getHoursArray,
  formatHour,
  isTaskOverdue,
  getDateStatus,
  getPriorityColorClass,
  getStatusColorClass,
  getStatusBorderClass,
  getStatusLabel
};