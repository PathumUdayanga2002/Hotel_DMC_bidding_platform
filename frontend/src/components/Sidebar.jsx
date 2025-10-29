import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaUsers, FaChartPie, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      </div>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/overview" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaChartBar className="mr-3" />
              Overview
            </Link>
          </li>
          <li>
            <Link to="/user-management" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaUsers className="mr-3" />
              User Management
            </Link>
          </li>
          <li>
            <Link to="/analytics" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaChartPie className="mr-3" />
              Analytics
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaCog className="mr-3" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;