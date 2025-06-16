import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { id: 'employees', label: 'Employees', path: '/employees', icon: 'Users' },
    { id: 'departments', label: 'Departments', path: '/departments', icon: 'Building2' },
    { id: 'addEmployee', label: 'Add Employee', path: '/add-employee', icon: 'UserPlus' },
    { id: 'settings', label: 'Settings', path: '/settings', icon: 'Settings' }
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-surface-200">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-surface-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={20} className="text-white" />
              </div>
              <h1 className="text-lg font-heading font-semibold text-surface-900">TeamFlow Pro</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                  }
                `}
              >
                <ApperIcon name={item.icon} size={18} className="mr-3" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 w-64 bg-white border-r border-surface-200 z-50 lg:hidden"
          >
            <div className="flex-1 flex flex-col min-h-0">
              {/* Logo */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-surface-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Users" size={20} className="text-white" />
                  </div>
                  <h1 className="text-lg font-heading font-semibold text-surface-900">TeamFlow Pro</h1>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md text-surface-500 hover:text-surface-700 hover:bg-surface-100"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                      }
                    `}
                  >
                    <ApperIcon name={item.icon} size={18} className="mr-3" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-surface-200 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-md text-surface-500 hover:text-surface-700 hover:bg-surface-100"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-white" />
            </div>
            <h1 className="text-lg font-heading font-semibold text-surface-900">TeamFlow Pro</h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-surface-50">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;