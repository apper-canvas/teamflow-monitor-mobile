import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { employeeService, departmentService } from '@/services';
import SearchBar from '@/components/molecules/SearchBar';
import ViewToggle from '@/components/organisms/ViewToggle';
import EmployeeGrid from '@/components/organisms/EmployeeGrid';
import EmployeeTable from '@/components/organisms/EmployeeTable';
import ConfirmDialog from '@/components/organisms/ConfirmDialog';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ department: '', status: '' });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, employee: null });
  const [deleting, setDeleting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [employees, searchTerm, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [employeesData, departmentsData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      
      setEmployees(employeesData);
      setDepartments(departmentsData);
    } catch (err) {
      setError(err.message || 'Failed to load employees');
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...employees];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(employee =>
        employee.firstName.toLowerCase().includes(term) ||
        employee.lastName.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.role.toLowerCase().includes(term) ||
        employee.department.toLowerCase().includes(term)
      );
    }

    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter(employee => employee.department === filters.department);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(employee => employee.status === filters.status);
    }

    setFilteredEmployees(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleEdit = (employee) => {
    navigate(`/add-employee?edit=${employee.id}`, { state: { employee } });
  };

  const handleDeleteClick = (employee) => {
    setDeleteDialog({ isOpen: true, employee });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.employee) return;

    try {
      setDeleting(true);
      await employeeService.delete(deleteDialog.employee.id);
      
      setEmployees(prev => prev.filter(emp => emp.id !== deleteDialog.employee.id));
      toast.success(`${deleteDialog.employee.firstName} ${deleteDialog.employee.lastName} has been removed`);
      setDeleteDialog({ isOpen: false, employee: null });
    } catch (err) {
      toast.error('Failed to delete employee');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Department', 'Status', 'Start Date', 'Manager'].join(','),
      ...filteredEmployees.map(emp => [
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.phone || '',
        emp.role,
        emp.department,
        emp.status,
        emp.startDate,
        emp.manager || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('Employee data exported successfully');
  };

  if (error && !loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" size={24} className="text-error" />
          </div>
          <h3 className="text-lg font-heading font-medium text-surface-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-surface-600 mb-4">
            {error}
          </p>
          <Button onClick={loadData} icon="RefreshCcw">
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">
            Employees
          </h1>
          <p className="text-surface-600 mt-1">
            Manage your team members and their information
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            icon="Download"
            onClick={handleExport}
            disabled={filteredEmployees.length === 0}
          >
            Export
          </Button>
          
          <Button
            icon="UserPlus"
            onClick={() => navigate('/add-employee')}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          departments={departments}
          placeholder="Search employees by name, email, role, or department..."
        />
      </div>

      {/* View Toggle and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="text-sm text-surface-600">
            {loading ? (
              <div className="h-4 bg-surface-200 rounded w-24 animate-pulse"></div>
            ) : (
              <>
                Showing {filteredEmployees.length} of {employees.length} employees
              </>
            )}
          </div>
        </div>
        
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {/* Employee List */}
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {view === 'grid' ? (
          <EmployeeGrid
            employees={filteredEmployees}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, employee: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={
          deleteDialog.employee
            ? `Are you sure you want to delete ${deleteDialog.employee.firstName} ${deleteDialog.employee.lastName}? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        type="danger"
        loading={deleting}
      />
    </div>
  );
};

export default Employees;