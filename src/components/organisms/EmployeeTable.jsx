import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EmployeeTable = ({ employees, onEdit, onDelete, loading = false }) => {
  const [sortField, setSortField] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    let aValue = a[sortField] || '';
    let bValue = b[sortField] || '';
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const formatStartDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center animate-pulse">
                      <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
                      <div className="ml-4 space-y-2">
                        <div className="h-4 bg-surface-200 rounded w-24"></div>
                        <div className="h-3 bg-surface-200 rounded w-20"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-surface-200 rounded w-20 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-surface-200 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-surface-200 rounded-full w-16 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-surface-200 rounded w-20 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <div className="h-8 w-16 bg-surface-200 rounded animate-pulse"></div>
                      <div className="h-8 w-16 bg-surface-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12 bg-white rounded-lg shadow-sm border border-surface-200"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ApperIcon name="Users" size={32} className="text-surface-400" />
        </motion.div>
        <h3 className="text-lg font-heading font-medium text-surface-900 mb-2">
          No employees found
        </h3>
        <p className="text-surface-600 mb-4">
          Get started by adding your first team member
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-90 transition-all"
          onClick={() => navigate('/add-employee')}
        >
          Add First Employee
        </motion.button>
      </motion.div>
    );
  }

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left hover:text-surface-700 transition-colors"
    >
      <span>{children}</span>
      {sortField === field && (
        <ApperIcon 
          name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
          size={14} 
        />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-200">
          <thead className="bg-surface-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                <SortButton field="lastName">Employee</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                <SortButton field="role">Role</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                <SortButton field="department">Department</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                <SortButton field="startDate">Start Date</SortButton>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-surface-200">
            {sortedEmployees.map((employee, index) => (
              <motion.tr
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-surface-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/employees/${employee.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar
src={employee.photo}
                      alt={`${employee.first_name} ${employee.last_name}`}
                      fallback={`${employee.first_name} ${employee.last_name}`}
                      size="md"
                      status={employee.status}
                    />
                    <div className="ml-4">
<div className="text-sm font-medium text-surface-900">
                        {employee.first_name} {employee.last_name}
                      </div>
                      <div className="text-sm text-surface-500">
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-surface-900">{employee.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-surface-900">{employee.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={employee.status} size="sm">
                    {employee.status.replace('-', ' ')}
                  </Badge>
                </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                  {formatStartDate(employee.start_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(employee);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(employee);
                      }}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;