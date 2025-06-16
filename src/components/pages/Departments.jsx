import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { departmentService } from '@/services';
import DepartmentCard from '@/components/molecules/DepartmentCard';
import ConfirmDialog from '@/components/organisms/ConfirmDialog';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, department: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError(err.message || 'Failed to load departments');
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department) => {
    // For now, we'll just show a toast
    // In a real app, this would open an edit form
    toast.info('Department editing will be available in a future update');
  };

  const handleDeleteClick = (department) => {
    setDeleteDialog({ isOpen: true, department });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.department) return;

    try {
      setDeleting(true);
      await departmentService.delete(deleteDialog.department.id);
      
      setDepartments(prev => prev.filter(dept => dept.id !== deleteDialog.department.id));
      toast.success(`${deleteDialog.department.name} department has been removed`);
      setDeleteDialog({ isOpen: false, department: null });
    } catch (err) {
      toast.error('Failed to delete department');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateDepartment = () => {
    // For now, we'll just show a toast
    // In a real app, this would open a create form
    toast.info('Department creation will be available in a future update');
  };

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <div className="h-8 bg-surface-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-5 bg-surface-200 rounded w-80 animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-surface-200 rounded animate-pulse mt-4 sm:mt-0"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-surface-200 rounded w-32"></div>
                    <div className="h-4 bg-surface-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-4 bg-surface-200 rounded w-40"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-surface-200 rounded w-full"></div>
                  <div className="h-3 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                </div>
                <div className="flex justify-between pt-4">
                  <div className="h-8 w-24 bg-surface-200 rounded"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-16 bg-surface-200 rounded"></div>
                    <div className="h-8 w-16 bg-surface-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
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
          <Button onClick={loadDepartments} icon="RefreshCcw">
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">
              Departments
            </h1>
            <p className="text-surface-600 mt-1">
              Organize your team into departments and manage organizational structure
            </p>
          </div>
          
          <Button
            icon="Plus"
            onClick={handleCreateDepartment}
            className="mt-4 sm:mt-0"
          >
            Create Department
          </Button>
        </div>

        {/* Empty State */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ApperIcon name="Building2" size={32} className="text-surface-400" />
          </motion.div>
          <h3 className="text-lg font-heading font-medium text-surface-900 mb-2">
            No departments yet
          </h3>
          <p className="text-surface-600 mb-4">
            Create your first department to organize your team structure
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-90 transition-all"
            onClick={handleCreateDepartment}
          >
            Create First Department
          </motion.button>
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
            Departments
          </h1>
          <p className="text-surface-600 mt-1">
            Organize your team into departments and manage organizational structure
          </p>
        </div>
        
        <Button
          icon="Plus"
          onClick={handleCreateDepartment}
          className="mt-4 sm:mt-0"
        >
          Create Department
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-4"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" size={20} className="text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-surface-500">Total Departments</p>
              <p className="text-2xl font-bold text-surface-900">{departments.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-4"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-success" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-surface-500">Total Employees</p>
              <p className="text-2xl font-bold text-surface-900">
                {departments.reduce((total, dept) => total + dept.employeeCount, 0)}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-4"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={20} className="text-info" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-surface-500">Avg. Team Size</p>
              <p className="text-2xl font-bold text-surface-900">
                {departments.length > 0 
                  ? Math.round(departments.reduce((total, dept) => total + dept.employeeCount, 0) / departments.length)
                  : 0
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department, index) => (
          <DepartmentCard
            key={department.id}
            department={department}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            index={index}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, department: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        message={
          deleteDialog.department
            ? `Are you sure you want to delete the ${deleteDialog.department.name} department? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        type="danger"
        loading={deleting}
      />
    </div>
  );
};

export default Departments;