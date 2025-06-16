import Employees from '@/components/pages/Employees';
import EmployeeDetail from '@/components/pages/EmployeeDetail';
import AddEmployee from '@/components/pages/AddEmployee';
import Departments from '@/components/pages/Departments';
import DepartmentDetail from '@/components/pages/DepartmentDetail';
import Settings from '@/components/pages/Settings';

export const routes = {
  employees: {
    id: 'employees',
    label: 'Employees',
    path: '/employees',
    icon: 'Users',
    component: Employees
  },
  employeeDetail: {
    id: 'employeeDetail',
    label: 'Employee Detail',
    path: '/employees/:id',
    icon: 'User',
    component: EmployeeDetail
  },
  addEmployee: {
    id: 'addEmployee',
    label: 'Add Employee',
    path: '/add-employee',
    icon: 'UserPlus',
    component: AddEmployee
  },
  departments: {
    id: 'departments',
    label: 'Departments',
    path: '/departments',
    icon: 'Building2',
    component: Departments
  },
  departmentDetail: {
    id: 'departmentDetail',
    label: 'Department Detail',
    path: '/departments/:id',
    icon: 'Building2',
    component: DepartmentDetail
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;