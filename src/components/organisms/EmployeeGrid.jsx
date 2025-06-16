import { motion } from 'framer-motion';
import EmployeeCard from '@/components/molecules/EmployeeCard';

const EmployeeGrid = ({ employees, onEdit, onDelete, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-surface-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-24"></div>
                  <div className="h-3 bg-surface-200 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-surface-200 rounded w-full"></div>
                <div className="h-3 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="text-surface-400"
          >
            👥
          </motion.div>
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
          onClick={() => window.location.href = '/add-employee'}
        >
          Add First Employee
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map((employee, index) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </div>
  );
};

export default EmployeeGrid;