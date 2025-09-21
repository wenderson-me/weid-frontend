import React from 'react';

/**
 * Full page loading indicator
 */
export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 mb-4"></div>
      <span className="text-violet-800 text-lg font-medium">Loading...</span>
    </div>
  </div>
);

/**
 * Content area loading skeleton
 */
export const ContentLoader = ({ numberOfItems = 3, type = 'card' }) => {
  const renderCardSkeleton = (index) => (
    <div key={index} className="bg-white rounded-lg shadow p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="flex items-center mt-4">
        <div className="h-6 w-6 rounded-full bg-gray-200 mr-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  const renderListItemSkeleton = (index) => (
    <div key={index} className="bg-white border-b py-3 animate-pulse flex items-center">
      <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mr-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 ml-auto"></div>
    </div>
  );

  const renderTableRowSkeleton = (index) => (
    <tr key={index} className="animate-pulse">
      <td className="py-2 px-4 border-b"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
      <td className="py-2 px-4 border-b"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
      <td className="py-2 px-4 border-b"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
      <td className="py-2 px-4 border-b"><div className="h-4 bg-gray-200 rounded w-1/2 ml-auto"></div></td>
    </tr>
  );

  const skeletons = Array(numberOfItems).fill(0);

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {skeletons.map((_, i) => renderCardSkeleton(i))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="divide-y divide-gray-200">
        {skeletons.map((_, i) => renderListItemSkeleton(i))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <tbody>
        {skeletons.map((_, i) => renderTableRowSkeleton(i))}
      </tbody>
    );
  }

  return null;
};

/**
 * Inline loading spinner for buttons and small areas
 */
export const ButtonLoader = ({ small = false }) => (
  <div className={`inline-block animate-spin rounded-full border-t-2 border-violet-600 border-r-2 border-b-2 border-transparent ${small ? "h-3 w-3" : "h-4 w-4"}`}></div>
);

/**
 * Overlay loading indicator for forms and cards
 */
export const OverlayLoader = ({ transparentBackground = false }) => (
  <div className={`absolute inset-0 flex items-center justify-center ${transparentBackground ? 'bg-white bg-opacity-60' : 'bg-white bg-opacity-90'} rounded-lg z-10`}>
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600"></div>
  </div>
);

/**
 * Small skeleton for form fields
 */
export const FormFieldSkeleton = ({ height = 'h-10', width = 'w-full' }) => (
  <div className={`${height} ${width} bg-gray-200 rounded animate-pulse`}></div>
);

/**
 * Custom loading indicator for TaskBoard columns
 */
export const TaskColumnLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full p-4">
    {Array(4).fill(0).map((_, i) => (
      <div key={i} className="bg-gray-50 rounded-lg p-3 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        {Array(3).fill(0).map((_, j) => (
          <div key={j} className="bg-white rounded-lg shadow p-3 mb-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6 mb-3"></div>
            <div className="flex justify-between items-center mt-2">
              <div className="h-5 w-5 rounded-full bg-gray-200"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

/**
 * Loading indicator specifically for dashboard stats
 */
export const DashboardStatsLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {Array(4).fill(0).map((_, i) => (
      <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 mr-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="mt-4 h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="mt-2 h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    ))}
  </div>
);