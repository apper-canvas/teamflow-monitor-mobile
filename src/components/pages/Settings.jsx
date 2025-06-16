import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleExportData = () => {
    toast.success('Data export initiated');
  };

  const handleImportData = () => {
    toast.info('Data import will be available in a future update');
  };

  const settingSections = [
    {
      title: 'Company Information',
      icon: 'Building2',
      color: 'primary',
      items: [
        { label: 'Company Name', value: 'TeamFlow Pro', type: 'text' },
        { label: 'Company Email', value: 'contact@teamflowpro.com', type: 'email' },
        { label: 'Company Phone', value: '+1 (555) 123-4567', type: 'tel' },
        { label: 'Address', value: '123 Business Ave, Suite 100', type: 'text' }
      ]
    },
    {
      title: 'Notification Settings',
      icon: 'Bell',
      color: 'info',
      items: [
        { label: 'Email Notifications', type: 'toggle', value: true },
        { label: 'New Employee Alerts', type: 'toggle', value: true },
        { label: 'Department Updates', type: 'toggle', value: false },
        { label: 'System Maintenance Alerts', type: 'toggle', value: true }
      ]
    },
    {
      title: 'Data Management',
      icon: 'Database',
      color: 'success',
      items: [
        { label: 'Automatic Backup', type: 'toggle', value: true },
        { label: 'Data Retention (months)', value: '24', type: 'number' },
        { label: 'Export Format', value: 'CSV', type: 'select', options: ['CSV', 'Excel', 'JSON'] }
      ]
    },
    {
      title: 'Security Settings',
      icon: 'Shield',
      color: 'warning',
      items: [
        { label: 'Two-Factor Authentication', type: 'toggle', value: false },
        { label: 'Session Timeout (minutes)', value: '30', type: 'number' },
        { label: 'Password Complexity', type: 'toggle', value: true },
        { label: 'Login Attempt Limit', value: '5', type: 'number' }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-surface-900">Settings</h1>
        <p className="text-surface-600 mt-1">
          Configure your application preferences and system settings
        </p>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mb-6"
      >
        <h2 className="text-lg font-heading font-semibold text-surface-900 mb-4 flex items-center">
          <ApperIcon name="Zap" size={20} className="mr-2 text-warning" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            variant="outline"
            icon="Download"
            onClick={handleExportData}
            className="justify-center"
          >
            Export All Data
          </Button>
          
          <Button
            variant="outline"
            icon="Upload"
            onClick={handleImportData}
            className="justify-center"
          >
            Import Data
          </Button>
          
          <Button
            variant="outline"
            icon="RefreshCcw"
            onClick={() => toast.info('System backup initiated')}
            className="justify-center"
          >
            Backup System
          </Button>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
          >
            <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4 flex items-center">
              <div className={`w-8 h-8 bg-${section.color}/10 rounded-lg flex items-center justify-center mr-3`}>
                <ApperIcon name={section.icon} size={18} className={`text-${section.color}`} />
              </div>
              {section.title}
            </h3>

            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {item.type === 'toggle' ? (
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-surface-700">
                        {item.label}
                      </label>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          ${item.value ? 'bg-primary' : 'bg-surface-300'}
                        `}
                        onClick={() => toast.info('Setting updated')}
                      >
                        <motion.span
                          animate={{ x: item.value ? 20 : 4 }}
                          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform"
                        />
                      </motion.button>
                    </div>
                  ) : item.type === 'select' ? (
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        {item.label}
                      </label>
                      <select
                        defaultValue={item.value}
                        className="w-full px-3 py-2 border border-surface-300 rounded-md bg-white text-surface-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        onChange={() => toast.info('Setting updated')}
                      >
                        {item.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <Input
                      label={item.label}
                      type={item.type}
                      defaultValue={item.value}
                      onChange={() => toast.info('Setting updated')}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 mt-6"
      >
        <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4 flex items-center">
          <ApperIcon name="Info" size={20} className="mr-2 text-info" />
          System Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Package" size={20} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-surface-500">Version</p>
            <p className="text-lg font-semibold text-surface-900">1.0.0</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Server" size={20} className="text-success" />
            </div>
            <p className="text-sm font-medium text-surface-500">Status</p>
            <p className="text-lg font-semibold text-success">Online</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Users" size={20} className="text-info" />
            </div>
            <p className="text-sm font-medium text-surface-500">Active Users</p>
            <p className="text-lg font-semibold text-surface-900">1</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Clock" size={20} className="text-warning" />
            </div>
            <p className="text-sm font-medium text-surface-500">Last Backup</p>
            <p className="text-lg font-semibold text-surface-900">Today</p>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-end mt-6"
      >
        <Button
          icon="Save"
          onClick={handleSave}
          size="lg"
        >
          Save All Settings
        </Button>
      </motion.div>
    </div>
  );
};

export default Settings;