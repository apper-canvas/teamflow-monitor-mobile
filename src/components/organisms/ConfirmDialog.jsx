import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false 
}) => {
  if (!isOpen) return null;

  const iconMap = {
    danger: { name: 'AlertTriangle', color: 'text-error' },
    warning: { name: 'AlertCircle', color: 'text-warning' },
    info: { name: 'Info', color: 'text-info' }
  };

  const buttonMap = {
    danger: 'error',
    warning: 'warning',
    info: 'primary'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center mb-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${type === 'danger' ? 'error' : type}/10 flex items-center justify-center`}>
              <ApperIcon 
                name={iconMap[type].name} 
                size={20} 
                className={iconMap[type].color} 
              />
            </div>
            <h3 className="ml-3 text-lg font-heading font-semibold text-surface-900">
              {title}
            </h3>
          </div>
          
          <p className="text-surface-600 mb-6">
            {message}
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            
            <Button
              variant={buttonMap[type]}
              onClick={onConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;