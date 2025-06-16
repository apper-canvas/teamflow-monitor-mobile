import { toast } from 'react-toastify';
import employeeService from './employeeService';

class DepartmentService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        Fields: ['Name', 'head', 'employee_count', 'description', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']
      };
      
      const response = await this.apperClient.fetchRecords('department', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { data: [] };
      }
      
      // Update employee counts dynamically from actual employee data
      const employees = await employeeService.getAll();
      const departmentsWithCounts = (response.data || []).map(dept => ({
        ...dept,
        name: dept.Name || dept.name,
        employeeCount: employees.data.filter(emp => emp.department === (dept.Name || dept.name)).length
      }));
      
      return { data: departmentsWithCounts };
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
      return { data: [] };
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Name', 'head', 'employee_count', 'description', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']
      };
      
      const response = await this.apperClient.getRecordById('department', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Department not found');
      }
      
      // Get employee count
      const employees = await employeeService.getAll();
      const department = response.data;
      
      return {
        data: {
          ...department,
          name: department.Name || department.name,
          employeeCount: employees.data.filter(emp => emp.department === (department.Name || department.name)).length
        }
      };
    } catch (error) {
      console.error(`Error fetching department with ID ${id}:`, error);
      throw error;
    }
  }

  async create(departmentData) {
    try {
      // Only include Updateable fields for create operations
      const params = {
        records: [{
          Name: departmentData.Name || departmentData.name,
          head: departmentData.head || '',
          employee_count: departmentData.employee_count || 0,
          description: departmentData.description || '',
          Tags: departmentData.Tags || '',
          Owner: departmentData.Owner || ''
        }]
      };
      
      const response = await this.apperClient.createRecord('department', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return { data: successfulRecords[0].data };
        }
      }
      
      throw new Error('Failed to create department');
    } catch (error) {
      console.error("Error creating department:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Only include Updateable fields for update operations
      const updateData = {
        Id: parseInt(id),
        Name: updates.Name || updates.name,
        head: updates.head || '',
        employee_count: updates.employee_count || 0,
        description: updates.description || '',
        Tags: updates.Tags || '',
        Owner: updates.Owner || ''
      };

      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord('department', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          // Get updated employee count
          const employees = await employeeService.getAll();
          const updatedDept = successfulUpdates[0].data;
          return {
            data: {
              ...updatedDept,
              name: updatedDept.Name || updatedDept.name,
              employeeCount: employees.data.filter(emp => emp.department === (updatedDept.Name || updatedDept.name)).length
            }
          };
        }
      }
      
      throw new Error('Failed to update department');
    } catch (error) {
      console.error("Error updating department:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('department', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete department');
        }
      }
      
      return { data: { id } };
    } catch (error) {
      console.error("Error deleting department:", error);
      throw error;
    }
  }
}

export default new DepartmentService();