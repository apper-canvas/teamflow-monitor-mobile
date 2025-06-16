import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const DepartmentCard = ({ department, onEdit, onDelete, index = 0 }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/departments/${department.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(department);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(department);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={handleViewDetails}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Building2" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-surface-900">
              {department.name}
            </h3>
            <p className="text-surface-600 text-sm">
              {department.employeeCount} {department.employeeCount === 1 ? 'Employee' : 'Employees'}
            </p>
          </div>
        </div>
      </div>

      {/* Department Head */}
      {department.head && (
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="Crown" size={16} className="text-warning" />
          <span className="text-sm text-surface-600">Head: {department.head}</span>
        </div>
      )}

      {/* Description */}
      <p className="text-surface-600 text-sm mb-4 line-clamp-3">
        {department.description}
      </p>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-surface-100">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon="Edit"
            onClick={handleEdit}
          >
            Edit
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={handleDelete}
            className="text-error hover:text-error hover:bg-error/10"
          >
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DepartmentCard;