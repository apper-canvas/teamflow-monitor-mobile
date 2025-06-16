import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const EmployeeForm = ({ 
  employee = {}, 
  departments = [], 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    role: employee?.role || '',
    department: employee?.department || '',
    startDate: employee?.startDate || '',
    photo: employee?.photo || '',
    status: employee?.status || 'active',
    manager: employee?.manager || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Update form data when employee prop changes
  useEffect(() => {
    if (employee && Object.keys(employee).length > 0) {
      setFormData({
        firstName: employee?.firstName || '',
        lastName: employee?.lastName || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        role: employee?.role || '',
        department: employee?.department || '',
        startDate: employee?.startDate || '',
        photo: employee?.photo || '',
        status: employee?.status || 'active',
        manager: employee?.manager || ''
      });
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role?.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.department?.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <motion.form
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    onSubmit={handleSubmit}
    className="space-y-6">
    {/* Personal Information */}
    <div className="bg-white rounded-lg border border-surface-200 p-6">
        <h3
            className="text-lg font-heading font-semibold text-surface-900 mb-4 flex items-center">
            <ApperIcon name="User" size={20} className="mr-2 text-primary" />Personal Information
                    </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="First Name"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                error={errors.firstName}
                required />
            <Input
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                error={errors.lastName}
                required />
            <Input
                label="Email"
                type="email"
                icon="Mail"
                value={formData.email}
                onChange={handleChange("email")}
                error={errors.email}
                required />
            <Input
                label="Phone"
                type="tel"
                icon="Phone"
                value={formData.phone}
                onChange={handleChange("phone")}
                error={errors.phone} />
            <div className="md:col-span-2">
                <Input
                    label="Photo URL"
                    icon="Camera"
                    value={formData.photo}
                    onChange={handleChange("photo")}
                    placeholder="https://example.com/photo.jpg" />
            </div>
        </div>
    </div>
    {/* Job Information */}
    <div className="bg-white rounded-lg border border-surface-200 p-6">
        <h3
            className="text-lg font-heading font-semibold text-surface-900 mb-4 flex items-center">
            <ApperIcon name="Briefcase" size={20} className="mr-2 text-primary" />Job Information
                    </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="Role"
                value={formData.role}
                onChange={handleChange("role")}
                error={errors.role}
                required />
            <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Department <span className="text-error">*</span>
                </label>
                <select
                    value={formData.department}
                    onChange={handleChange("department")}
                    className={`
                w-full px-3 py-3 border rounded-md transition-all duration-200 bg-white text-surface-900
                ${errors.department ? "border-error focus:border-error focus:ring-error" : "border-surface-300 focus:border-primary focus:ring-primary"}
                focus:outline-none focus:ring-2 focus:ring-opacity-20
              `}>
                    <option value="">Select Department</option>
                    {departments.map(dept => <option key={dept.id || dept.name} value={dept.name}>
                        {dept.name}
                    </option>)}
                </select>
                {errors.department && <motion.p
                    initial={{
                        opacity: 0,
                        y: -10
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="text-sm text-error mt-1 flex items-center">
                    <ApperIcon name="AlertCircle" size={14} className="mr-1" />
                    {errors.department}
                </motion.p>}
            </div>
            <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={handleChange("startDate")}
                error={errors.startDate}
                required />
            <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Status
                                </label>
                <select
                    value={formData.status}
                    onChange={handleChange("status")}
                    className="w-full px-3 py-3 border border-surface-300 rounded-md bg-white text-surface-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                </select>
            </div>
            <div className="md:col-span-2">
                <Input
                    label="Manager"
                    value={formData.manager}
                    onChange={handleChange("manager")}
                    placeholder="Manager's full name" />
            </div>
        </div>
    </div>
    {/* Form Actions */}
    <div className="flex justify-end space-x-4 pt-6 border-t border-surface-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel
                    </Button>
        <Button type="submit" loading={loading} icon="Save">
            {employee.id ? "Update Employee" : "Create Employee"}
        </Button>
    </div>
</motion.form>
  );
};

export default EmployeeForm;