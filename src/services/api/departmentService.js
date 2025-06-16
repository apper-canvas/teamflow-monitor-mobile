import departmentData from '../mockData/departments.json';
import employeeService from './employeeService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DepartmentService {
  constructor() {
    this.data = [...departmentData];
  }

async getAll() {
    await delay(300);
    // Update employee counts dynamically
    const employees = await employeeService.getAll();
    const departmentsWithCounts = this.data.map(dept => ({
      ...dept,
      employeeCount: employees.data.filter(emp => emp.department === dept.name).length
    }));
    return { data: departmentsWithCounts };
  }

  async getById(id) {
    await delay(250);
    const department = this.data.find(dept => dept.id === id);
    if (!department) {
      throw new Error('Department not found');
    }
    
    // Get employee count
    const employees = await employeeService.getAll();
    return {
      ...department,
      employeeCount: employees.filter(emp => emp.department === department.name).length
    };
  }

  async create(departmentData) {
    await delay(400);
    const newDepartment = {
      ...departmentData,
      id: Date.now().toString(),
      employeeCount: 0
    };
    this.data.push(newDepartment);
    return { ...newDepartment };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.data.findIndex(dept => dept.id === id);
    if (index === -1) {
      throw new Error('Department not found');
    }
    
    this.data[index] = { ...this.data[index], ...updates };
    
    // Get updated employee count
    const employees = await employeeService.getAll();
    return {
      ...this.data[index],
      employeeCount: employees.filter(emp => emp.department === this.data[index].name).length
    };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(dept => dept.id === id);
    if (index === -1) {
      throw new Error('Department not found');
    }
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new DepartmentService();