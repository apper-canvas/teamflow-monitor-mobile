import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const ViewToggle = ({ view, onViewChange, className = '' }) => {
  return (
    <div className={`inline-flex rounded-lg border border-surface-300 bg-surface-50 p-1 ${className}`}>
      <Button
        variant={view === 'grid' ? 'primary' : 'ghost'}
        size="sm"
        icon="Grid3x3"
        onClick={() => onViewChange('grid')}
        className={`
          relative transition-all duration-200
          ${view === 'grid' 
            ? 'bg-primary text-white shadow-sm' 
            : 'text-surface-600 hover:text-surface-900 bg-transparent hover:bg-white'
          }
        `}
      >
        Grid
      </Button>
      
      <Button
        variant={view === 'table' ? 'primary' : 'ghost'}
        size="sm"
        icon="List"
        onClick={() => onViewChange('table')}
        className={`
          relative transition-all duration-200
          ${view === 'table' 
            ? 'bg-primary text-white shadow-sm' 
            : 'text-surface-600 hover:text-surface-900 bg-transparent hover:bg-white'
          }
        `}
      >
        Table
      </Button>
    </div>
  );
};

export default ViewToggle;