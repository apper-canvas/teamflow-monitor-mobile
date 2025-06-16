import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { departmentService, employeeService } from "@/services";
import EmployeeForm from "@/components/molecules/EmployeeForm";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const AddEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    startDate: '',
    photo: '',
    status: 'active',
    manager: ''
  });
  
const editId = searchParams.get('edit');
  const isEditing = !!editId;

  useEffect(() => {
    loadDepartments();
    if (isEditing) {
      loadEmployee();
    }
  }, [editId]);

  const loadDepartments = async () => {
try {
      const response = await departmentService.getAll();
      setDepartments(response.data || []);
    } catch (err) {
      toast.error('Failed to load departments');
      setDepartments([]);
    }
  };

  const loadEmployee = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const data = await employeeService.getById(editId);
      if (data) {
        setEmployee(data);
      } else {
        setError('Employee not found');
        toast.error('Employee not found');
      }
    } catch (err) {
      console.error('Error loading employee:', err);
      setError(err.message || 'Failed to load employee');
      toast.error('Failed to load employee details');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (isEditing) {
        await employeeService.update(editId, formData);
        toast.success('Employee updated successfully');
      } else {
        await employeeService.create(formData);
        toast.success('Employee created successfully');
      }
      
      navigate('/employees');
    } catch (err) {
      toast.error(isEditing ? 'Failed to update employee' : 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  if (initialLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
    <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center space-x-4 mb-8">
            <div className="w-6 h-6 bg-surface-200 rounded"></div>
            <div className="h-8 bg-surface-200 rounded w-48"></div>
        </div>
        {/* Form Skeleton */}
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-surface-200 p-6">
                <div className="h-6 bg-surface-200 rounded w-48 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-surface-200 rounded"></div>)}
                </div>
            </div>
            <div className="bg-white rounded-lg border border-surface-200 p-6">
                <div className="h-6 bg-surface-200 rounded w-48 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-surface-200 rounded"></div>)}
                </div>
            </div>
        </div>
    </div>
</div>
    );
  }

  if (error && isEditing) {
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

  return (
    <motion.div
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    className="p-6 max-w-4xl mx-auto">
    {/* Header */}
    <div className="flex items-center space-x-4 mb-8">
        <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={handleCancel}
            className="text-surface-600 hover:text-surface-900">Back
                    </Button>
        <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">
                {isEditing ? "Edit Employee" : "Add New Employee"}
            </h1>
            <p className="text-surface-600 mt-1">
                {isEditing ? "Update employee information and job details" : "Enter employee information and job details"}
            </p>
        </div>
    </div>
    {/* Form */}
    <motion.div
        initial={{
            opacity: 0,
            y: 20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        transition={{
            delay: 0.1
        }}>
        <EmployeeForm
            employee={employee}
            departments={departments}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading} />
    </motion.div>
</motion.div>
  );
};

export default AddEmployee;