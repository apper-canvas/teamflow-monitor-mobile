import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  onSearch, 
  onFilterChange,
  departments = [],
  placeholder = "Search employees...",
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

useEffect(() => {
    if (!onSearch) return;
    
    const delayedSearch = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]); // Removed onSearch from dependencies to prevent infinite loops

  useEffect(() => {
    if (!onFilterChange) return;
    
    onFilterChange({
      department: selectedDepartment,
      status: selectedStatus
    });
  }, [selectedDepartment, selectedStatus]); // Removed onFilterChange from dependencies to prevent infinite loops

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedStatus('');
  };

  const hasActiveFilters = searchTerm || selectedDepartment || selectedStatus;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            icon="Search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon="Filter"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-primary text-white' : ''}
          >
            Filters
          </Button>
          
          {hasActiveFilters && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Button
                variant="ghost"
                icon="X"
                onClick={clearFilters}
                size="sm"
              >
                Clear
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Filter Options */}
      <motion.div
        initial={false}
        animate={{
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface-50 rounded-lg border border-surface-200">
          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-md bg-white text-surface-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id || dept.name} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-md bg-white text-surface-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {searchTerm && (
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <ApperIcon name="Search" size={14} className="mr-1" />
              Search: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 hover:bg-primary/20 rounded-full p-0.5"
              >
                <ApperIcon name="X" size={12} />
              </button>
            </div>
          )}
          
          {selectedDepartment && (
            <div className="inline-flex items-center px-3 py-1 bg-info/10 text-info rounded-full text-sm">
              <ApperIcon name="Building2" size={14} className="mr-1" />
              {selectedDepartment}
              <button
                onClick={() => setSelectedDepartment('')}
                className="ml-2 hover:bg-info/20 rounded-full p-0.5"
              >
                <ApperIcon name="X" size={12} />
              </button>
            </div>
          )}
          
          {selectedStatus && (
            <div className="inline-flex items-center px-3 py-1 bg-success/10 text-success rounded-full text-sm">
              <ApperIcon name="UserCheck" size={14} className="mr-1" />
              {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1).replace('-', ' ')}
              <button
                onClick={() => setSelectedStatus('')}
                className="ml-2 hover:bg-success/20 rounded-full p-0.5"
              >
                <ApperIcon name="X" size={12} />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;