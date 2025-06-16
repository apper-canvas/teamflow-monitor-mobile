import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { employeeService } from '@/services';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ConfirmDialog from '@/components/organisms/ConfirmDialog';
import ApperIcon from '@/components/ApperIcon';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
const response = await employeeService.getById(id);
      setEmployee(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load employee details');
      toast.error('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/add-employee?edit=${employee.id}`, { state: { employee } });
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await employeeService.delete(employee.id);
toast.success(`${employee.first_name} ${employee.last_name} has been removed`);
      navigate('/employees');
    } catch (err) {
      toast.error('Failed to delete employee');
    } finally {
      setDeleting(false);
      setDeleteDialog(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTenure = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} ${years === 1 ? 'year' : 'years'}${remainingMonths > 0 ? `, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}` : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-surface-200 rounded"></div>
              <div className="h-8 bg-surface-200 rounded w-48"></div>
            </div>
            <div className="flex space-x-3">
              <div className="h-10 w-20 bg-surface-200 rounded"></div>
              <div className="h-10 w-24 bg-surface-200 rounded"></div>
            </div>
          </div>

          {/* Profile Card Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
              <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                <div className="w-32 h-32 bg-surface-200 rounded-full mb-4"></div>
                <div className="h-6 bg-surface-200 rounded w-20"></div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-surface-200 rounded w-64"></div>
                <div className="h-6 bg-surface-200 rounded w-48"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-12 bg-surface-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
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
            Employee Not Found
          </h3>
          <p className="text-surface-600 mb-4">
            {error}
          </p>
          <div className="flex justify-center space-x-3">
            <Button variant="outline" onClick={() => navigate('/employees')}>
              Back to Employees
            </Button>
            <Button onClick={loadEmployee} icon="RefreshCcw">
              Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate('/employees')}
            className="text-surface-600 hover:text-surface-900"
          >
            Back
          </Button>
          <h1 className="text-2xl font-heading font-bold text-surface-900">
            Employee Details
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon="Edit"
            onClick={handleEdit}
          >
            Edit
          </Button>
          
          <Button
            variant="error"
            icon="Trash2"
            onClick={() => setDeleteDialog(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-8 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
          {/* Avatar and Status */}
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <Avatar
src={employee.photo}
              alt={`${employee.first_name} ${employee.last_name}`}
              fallback={`${employee.first_name} ${employee.last_name}`}
              size="2xl"
              status={employee.status}
              className="mb-4"
            />
            <Badge variant={employee.status} size="lg">
              {employee.status.replace('-', ' ')}
            </Badge>
          </div>

          {/* Employee Information */}
          <div className="flex-1">
            <div className="mb-6">
<h2 className="text-3xl font-heading font-bold text-surface-900 mb-2">
                {employee.first_name} {employee.last_name}
              </h2>
              <p className="text-xl text-surface-600">{employee.role}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Mail" size={18} className="text-surface-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-500">Email</p>
                    <p className="text-surface-900">{employee.email}</p>
                  </div>
                </div>

                {employee.phone && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Phone" size={18} className="text-surface-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-500">Phone</p>
                      <p className="text-surface-900">{employee.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Building2" size={18} className="text-surface-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-500">Department</p>
                    <p className="text-surface-900">{employee.department}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Calendar" size={18} className="text-surface-600" />
                  </div>
                  <div>
<p className="text-sm font-medium text-surface-500">Start Date</p>
                    <p className="text-surface-900">{formatDate(employee.start_date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Clock" size={18} className="text-surface-600" />
                  </div>
                  <div>
<p className="text-sm font-medium text-surface-500">Tenure</p>
                    <p className="text-surface-900">{calculateTenure(employee.start_date)}</p>
                  </div>
                </div>

                {employee.manager && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="User" size={18} className="text-surface-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-500">Reports To</p>
                      <p className="text-surface-900">{employee.manager}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={18} className="text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-surface-900">Performance</h3>
          </div>
          <p className="text-surface-600 text-sm">
            Performance metrics and reviews will be displayed here in future updates.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" size={18} className="text-success" />
            </div>
            <h3 className="font-heading font-semibold text-surface-900">Time Off</h3>
          </div>
          <p className="text-surface-600 text-sm">
            Leave balance and time-off requests will be managed here.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" size={18} className="text-info" />
            </div>
            <h3 className="font-heading font-semibold text-surface-900">Documents</h3>
          </div>
          <p className="text-surface-600 text-sm">
            Employee documents and contracts will be stored here.
          </p>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
message={`Are you sure you want to delete ${employee.first_name} ${employee.last_name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        loading={deleting}
      />
    </motion.div>
  );
};

export default EmployeeDetail;