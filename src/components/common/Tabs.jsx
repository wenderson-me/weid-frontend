import React, { useState, createContext, useContext } from 'react';


const TabsContext = createContext(null);


export const Tabs = ({ children, defaultValue, value, onValueChange, className = '' }) => {

  const [activeTab, setActiveTab] = useState(value || defaultValue);


  const handleTabChange = (newValue) => {
    if (!value) {

      setActiveTab(newValue);
    }

    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab: value || activeTab, onChange: handleTabChange }}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};


export const TabsList = ({ children, className = '' }) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};


export const TabsTrigger = ({ children, value, disabled = false, className = '' }) => {
  const { activeTab, onChange } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      className={`
        px-4 py-2 text-sm font-medium border-b-2 -mb-px
        ${isActive
          ? 'text-violet-600 border-violet-500'
          : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      onClick={() => !disabled && onChange(value)}
      aria-selected={isActive}
      role="tab"
    >
      {children}
    </button>
  );
};


export const TabsContent = ({ children, value, className = '' }) => {
  const { activeTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      className={`py-4 ${className}`}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default { Tabs, TabsList, TabsTrigger, TabsContent };