import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  HomeIcon, BriefcaseIcon, PlusCircleIcon, ChartBarIcon,
  BellIcon, UserIcon, ArrowRightOnRectangleIcon, SunIcon, MoonIcon, Bars3Icon, XMarkIcon,
  ViewColumnsIcon, SparklesIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/internships', label: 'Internships', icon: BriefcaseIcon },
  { path: '/kanban', label: 'Kanban Board', icon: ViewColumnsIcon },
  { path: '/add', label: 'Add New', icon: PlusCircleIcon },
  { path: '/analytics', label: 'Analytics', icon: ChartBarIcon },
  { path: '/ai-report', label: 'AI Reports', icon: SparklesIcon },
  { path: '/reminders', label: 'Reminders', icon: BellIcon },
  { path: '/profile', label: 'Profile', icon: UserIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const NavLink = ({ item }) => {
    const active = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
          active ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <item.icon className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600">InternTracker</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{user?.name}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => <NavLink key={item.path} item={item} />)}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button onClick={toggle} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          {dark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          <span className="font-medium">{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-blue-600">InternTracker</h1>
        <button onClick={() => setOpen(!open)}>
          {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)} />}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <SidebarContent />
      </div>
    </>
  );
}
