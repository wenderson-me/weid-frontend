import React from 'react';
import DriveIntegration from '../../components/drive/DriveIntegration';

const DrivePage = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Google Drive Integration</h1>
      <DriveIntegration />
    </div>
  );
};

export default DrivePage;