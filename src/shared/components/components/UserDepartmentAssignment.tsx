import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Select } from '@/shared/components/ui/select';
import { Department, User, UserRole, Plan } from '@/types/departmentalPermissions';

interface UserDepartmentAssignmentProps {
  user: User;
  departments: Department[];
  assignedDepartments: Department[];
  plan: Plan;
  onAssign: (departmentId: string, role: UserRole) => void;
}

/**
 * Componente para asignar departamentos a un usuario, validando el límite del plan.
 */
export const UserDepartmentAssignment: React.FC<UserDepartmentAssignmentProps> = React.memo(({
  user, departments, assignedDepartments, plan, onAssign
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('EMPLOYEE_CUST');
  const maxReached = assignedDepartments.length >= plan.maxDepartmentsPerUser;

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-bold mb-2">Asignar departamento a {user.name}</h3>
      <div className="mb-2 text-sm text-gray-600">
        Departamentos asignados: {assignedDepartments.length} / {plan.maxDepartmentsPerUser}
      </div>
      <div className="flex gap-2 mb-2">
        <Select
          value={selectedDept}
          onValueChange={setSelectedDept}
          disabled={maxReached}
          aria-label="Seleccionar departamento"
        >
          <option value="">Selecciona un departamento</option>
          {departments.filter(d => !assignedDepartments.some(a => a.id === d.id)).map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </Select>
        <Select
          value={selectedRole}
          onValueChange={setSelectedRole}
          disabled={maxReached}
          aria-label="Seleccionar rol"
        >
          <option value="EMPLOYEE_CUST">Empleado</option>
          <option value="ADVISOR_CUST">Asesor</option>
        </Select>
        <Button
          onClick={() => onAssign(selectedDept, selectedRole)}
          disabled={maxReached || !selectedDept}
        >
          Asignar
        </Button>
      </div>
      {maxReached && (
        <div className="text-red-500 text-xs">Has alcanzado el máximo de departamentos permitidos por usuario en tu plan.</div>
      )}
    </div>
  );
}); 
