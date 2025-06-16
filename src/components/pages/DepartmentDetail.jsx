import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { departmentService, employeeService } from '@/services';
import EmployeeTable from '@/components/organisms/EmployeeTable';
import ConfirmDialog from '@/components/organisms/ConfirmDialog';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, employee: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [departmentData, employeesData] = await Promise.all([
        departmentService.getById(id),
        employeeService.getAll()
      ]);
      
      setDepartment(departmentData);
      
      // Filter employees by department
      const departmentEmployees = employeesData.filter(
        emp => emp.department === departmentData.name
      );
      setEmployees(departmentEmployees);
    } catch (err) {
      setError(err.message || 'Failed to load department details');
      toast.error('Failed to load department details');
    } finally {
      setLoading(false);
    }
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

  const handleEditDepartment = () => {
    toast.info('Department editing will be available in a future update');
  };

  const getDepartmentHead = () => {
    return employees.find(emp => emp.firstName + ' ' + emp.lastName === department?.head);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-surface-200 rounded"></div>
              <div className="h-8 bg-surface-200 rounded w-48"></div>
            </div>
            <div className="h-10 w-32 bg-surface-200 rounded"></div>
          </div>

          {/* Department Info Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-8 mb-6">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-surface-200 rounded-lg"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-surface-200 rounded w-64"></div>
                <div className="h-5 bg-surface-200 rounded w-48"></div>
                <div className="h-16 bg-surface-200 rounded w-full"></div>
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-surface-200 rounded-lg"></div>
                  <div className="ml-3 space-y-2">
                    <div className="h-4 bg-surface-200 rounded w-24"></div>
                    <div className="h-6 bg-surface-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            Department Not Found
          </h3>
          <p className="text-surface-600 mb-4">
            {error}
          </p>
          <div className="flex justify-center space-x-3">
            <Button variant="outline" onClick={() => navigate('/departments')}>
              Back to Departments
            </Button>
            <Button onClick={loadData} icon="RefreshCcw">
              Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!department) return null;

  const departmentHead = getDepartmentHead();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate('/departments')}
            className="text-surface-600 hover:text-surface-900"
          >
            Back
          </Button>
          <h1 className="text-2xl font-heading font-bold text-surface-900">
            {department.name} Department
          </h1>
        </div>
        
        <Button
          variant="outline"
          icon="Edit"
          onClick={handleEditDepartment}
        >
          Edit Department
        </Button>
      </div>

      {/* Department Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-8 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
          {/* Department Icon */}
          <div className="flex-shrink-0 mb-6 md:mb-0">
            <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" size={32} className="text-primary" />
            </div>
          </div>

          {/* Department Details */}
          <div className="flex-1">
            <h2 className="text-3xl font-heading font-bold text-surface-900 mb-2">
              {department.name}
            </h2>
            
            {/* Department Head */}
            {departmentHead && (
              <div className="flex items-center space-x-3 mb-4">
                <Avatar
                  src={departmentHead.photo}
                  alt={department.head}
                  fallback={department.head}
                  size="sm"
                  status={departmentHead.status}
                />
                <div>
                  <p className="text-sm font-medium text-surface-500">Department Head</p>
                  <p className="text-surface-900 font-medium">{department.head}</p>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-surface-600 leading-relaxed">
              {department.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-4"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-success" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-surface-500">Total Employees</p>
              <p className="text-2xl font-bold text-surface-900">{employees.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-4"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" size={20} className="text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-surface-500">Active Employees</p>
              <p className="text-2xl font-bold text-surface-900">
                {employees.filter(emp => emp.status === 'active').length}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-4"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-warning" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-surface-500">On Leave</p>
              <p className="text-2xl font-bold text-surface-900">
                {employees.filter(emp => emp.status === 'on-leave').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Department Employees */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-surface-900">
            Department Employees
          </h3>
          <Button
            icon="UserPlus"
            onClick={() => navigate('/add-employee')}
            size="sm"
          >
            Add Employee
          </Button>
        </div>

        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          loading={false}
        />
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
    </motion.div>
  );
};

export default DepartmentDetail;