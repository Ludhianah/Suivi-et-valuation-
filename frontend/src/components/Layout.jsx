import React from 'react';
import Sidebar from './Sidebar';
const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
