import { getUserDepartments, getCompanyPlan, assignUserToDepartmentDB } from './dataAccess';
import { UserRole } from '@/shared/types/departmentalPermissions';

/**
 * Asigna un usuario a un departamento, validando el límite por plan.
 * @param userId ID del usuario
 * @param departmentId ID del departamento
 * @param companyId ID de la empresa
 * @param role Rol a asignar (EMPLOYEE_CUST, ADVISOR_CUST, etc.)
 * @throws Error si se supera el límite de departamentos por usuario
 */
export async function assignUserToDepartment(
  userId: string,
  departmentId: string,
  companyId: string,
  role: UserRole
): Promise<void> {
  // Obtener departamentos actuales del usuario
  const userDepartments = await getUserDepartments(userId);
  // Obtener plan de la empresa
  const plan = await getCompanyPlan(companyId);
  if (userDepartments.length >= plan.maxDepartmentsPerUser) {
    throw new Error('Límite de departamentos por usuario alcanzado para este plan.');
  }
  // Asignar usuario al departamento
  await assignUserToDepartmentDB(userId, departmentId, role);
} 