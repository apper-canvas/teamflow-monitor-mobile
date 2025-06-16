import { toast } from 'react-toastify';

class EmployeeService {
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
        Fields: ['Name', 'first_name', 'last_name', 'email', 'phone', 'role', 'department', 'start_date', 'photo', 'status', 'manager', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']
      };
      
      const response = await this.apperClient.fetchRecords('employee', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { data: [] };
      }
      
      return { data: response.data || [] };
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees");
      return { data: [] };
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Name', 'first_name', 'last_name', 'email', 'phone', 'role', 'department', 'start_date', 'photo', 'status', 'manager', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']
      };
      
      const response = await this.apperClient.getRecordById('employee', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Employee not found');
      }
      
      return { data: response.data };
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw error;
    }
  }

  async getByDepartment(departmentName) {
    try {
      const params = {
        Fields: ['Name', 'first_name', 'last_name', 'email', 'phone', 'role', 'department', 'start_date', 'photo', 'status', 'manager', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'],
        where: [
          {
            FieldName: 'department',
            Operator: 'ExactMatch',
            Values: [departmentName]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('employee', params);
      
      if (!response.success) {
        console.error(response.message);
        return { data: [] };
      }
      
      return { data: response.data || [] };
    } catch (error) {
      console.error("Error fetching employees by department:", error);
      return { data: [] };
    }
  }

  async create(employeeData) {
    try {
      // Only include Updateable fields for create operations
      const params = {
        records: [{
          Name: employeeData.Name || `${employeeData.first_name} ${employeeData.last_name}`,
          first_name: employeeData.first_name,
          last_name: employeeData.last_name,
          email: employeeData.email,
          phone: employeeData.phone || '',
          role: employeeData.role,
          department: employeeData.department,
          start_date: employeeData.start_date,
          photo: employeeData.photo || '',
          status: employeeData.status || 'active',
          manager: employeeData.manager || '',
          Tags: employeeData.Tags || '',
          Owner: employeeData.Owner || ''
        }]
      };
      
      const response = await this.apperClient.createRecord('employee', params);
      
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
      
      throw new Error('Failed to create employee');
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Only include Updateable fields for update operations
      const updateData = {
        Id: parseInt(id),
        Name: updates.Name || `${updates.first_name} ${updates.last_name}`,
        first_name: updates.first_name,
        last_name: updates.last_name,
        email: updates.email,
        phone: updates.phone || '',
        role: updates.role,
        department: updates.department,
        start_date: updates.start_date,
        photo: updates.photo || '',
        status: updates.status || 'active',
        manager: updates.manager || '',
        Tags: updates.Tags || '',
        Owner: updates.Owner || ''
      };

      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord('employee', params);
      
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
          return { data: successfulUpdates[0].data };
        }
      }
      
      throw new Error('Failed to update employee');
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('employee', params);
      
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
          throw new Error('Failed to delete employee');
        }
      }
      
      return { data: { id } };
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  }

  async search(query) {
    try {
      const searchTerm = query.toLowerCase();
      const params = {
        Fields: ['Name', 'first_name', 'last_name', 'email', 'phone', 'role', 'department', 'start_date', 'photo', 'status', 'manager', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'],
        whereGroups: [
          {
            operator: 'OR',
            SubGroups: [
              {
                conditions: [
                  { FieldName: 'first_name', Operator: 'Contains', Values: [searchTerm] }
                ],
                operator: ''
              },
              {
                conditions: [
                  { FieldName: 'last_name', Operator: 'Contains', Values: [searchTerm] }
                ],
                operator: ''
              },
              {
                conditions: [
                  { FieldName: 'email', Operator: 'Contains', Values: [searchTerm] }
                ],
                operator: ''
              },
              {
                conditions: [
                  { FieldName: 'role', Operator: 'Contains', Values: [searchTerm] }
                ],
                operator: ''
              },
              {
                conditions: [
                  { FieldName: 'department', Operator: 'Contains', Values: [searchTerm] }
                ],
                operator: ''
              }
            ]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('employee', params);
      
      if (!response.success) {
        return { data: [] };
      }
      
      return { data: response.data || [] };
    } catch (error) {
      console.error("Error searching employees:", error);
      return { data: [] };
    }
  }

  async filterByStatus(status) {
    try {
      const params = {
        Fields: ['Name', 'first_name', 'last_name', 'email', 'phone', 'role', 'department', 'start_date', 'photo', 'status', 'manager', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'],
        where: [
          {
            FieldName: 'status',
            Operator: 'ExactMatch',
            Values: [status]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('employee', params);
      
      if (!response.success) {
        return { data: [] };
      }
      
      return { data: response.data || [] };
    } catch (error) {
      console.error("Error filtering employees by status:", error);
      return { data: [] };
    }
  }
}

export default new EmployeeService();