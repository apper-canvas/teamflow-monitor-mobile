import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EmployeeCard = ({ employee, onEdit, onDelete, index = 0 }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/employees/${employee.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(employee);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(employee);
  };

  const formatStartDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
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
          <Avatar
            src={employee.photo}
            alt={`${employee.firstName} ${employee.lastName}`}
            fallback={`${employee.firstName} ${employee.lastName}`}
            size="lg"
            status={employee.status}
          />
          <div>
            <h3 className="font-heading font-semibold text-lg text-surface-900">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-surface-600 text-sm">{employee.role}</p>
          </div>
        </div>
        
        <Badge variant={employee.status}>
          {employee.status.replace('-', ' ')}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-surface-600">
          <ApperIcon name="Building2" size={16} className="mr-2 text-surface-400" />
          {employee.department}
        </div>
        
        <div className="flex items-center text-sm text-surface-600">
          <ApperIcon name="Mail" size={16} className="mr-2 text-surface-400" />
          {employee.email}
        </div>
        
        <div className="flex items-center text-sm text-surface-600">
          <ApperIcon name="Calendar" size={16} className="mr-2 text-surface-400" />
          Started {formatStartDate(employee.startDate)}
        </div>
        
        {employee.manager && (
          <div className="flex items-center text-sm text-surface-600">
            <ApperIcon name="User" size={16} className="mr-2 text-surface-400" />
            Reports to {employee.manager}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t border-surface-100">
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
    </motion.div>
  );
};

export default EmployeeCard;