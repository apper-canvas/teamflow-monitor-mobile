import employeeData from '../mockData/employees.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EmployeeService {
  constructor() {
    this.data = [...employeeData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(250);
    const employee = this.data.find(emp => emp.id === id);
    if (!employee) {
      throw new Error('Employee not found');
    }
    return { ...employee };
  }

  async getByDepartment(departmentId) {
    await delay(300);
    return this.data.filter(emp => emp.department === departmentId).map(emp => ({ ...emp }));
  }

  async create(employeeData) {
    await delay(400);
    const newEmployee = {
      ...employeeData,
      id: Date.now().toString(),
      status: employeeData.status || 'active'
    };
    this.data.push(newEmployee);
    return { ...newEmployee };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.data.findIndex(emp => emp.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(emp => emp.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return this.data
      .filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm) ||
        emp.lastName.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.role.toLowerCase().includes(searchTerm) ||
        emp.department.toLowerCase().includes(searchTerm)
      )
      .map(emp => ({ ...emp }));
  }

  async filterByStatus(status) {
    await delay(200);
    return this.data
      .filter(emp => emp.status === status)
      .map(emp => ({ ...emp }));
  }
}

export default new EmployeeService();