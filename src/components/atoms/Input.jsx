import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  error,
  icon,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  defaultValue, // Extract defaultValue to prevent it from being spread
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value && value.length > 0;
  const shouldFloatLabel = focused || hasValue;

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`relative ${className}`}>
      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 z-10">
            <ApperIcon name={icon} size={18} />
          </div>
        )}

        {/* Input Field */}
        <input
          type={inputType}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={!label ? placeholder : ''}
          className={`
            w-full px-3 py-3 text-base border rounded-md transition-all duration-200
            ${icon ? 'pl-10' : 'pl-3'}
            ${type === 'password' ? 'pr-10' : 'pr-3'}
            ${error 
              ? 'border-error focus:border-error focus:ring-error' 
              : 'border-surface-300 focus:border-primary focus:ring-primary'
            }
            ${disabled 
              ? 'bg-surface-100 text-surface-400 cursor-not-allowed' 
              : 'bg-white text-surface-900'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            ${label ? 'pt-6 pb-2' : ''}
          `}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <motion.label
            initial={false}
            animate={{
              y: shouldFloatLabel ? -8 : 8,
              scale: shouldFloatLabel ? 0.85 : 1,
              color: error ? '#EF4444' : focused ? '#2563EB' : '#64748B'
            }}
            transition={{ duration: 0.2 }}
            className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none origin-left
              ${icon ? 'left-10' : 'left-3'}
              ${shouldFloatLabel ? 'text-xs' : 'text-base'}
            `}
          >
            {label} {required && <span className="text-error">*</span>}
          </motion.label>
        )}

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error mt-1 flex items-center"
        >
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;