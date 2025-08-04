import React from "react";
import { Table } from "../ui/table";
import { Badge } from "../ui/badge";
import { DropdownMenu } from "../ui/dropdown-menu";

/**
 * PaymentsTable
 * Componente desacoplado para mostrar la tabla de pagos recientes en el dashboard.
 * Replica la experiencia visual del demo Bundui Premium, pero usando solo componentes propios.
 */

const payments = [
  { customer: "Kenneth Thompson", email: "ken99@yahoo.com", amount: "$316.00", status: "success" },
  { customer: "Abraham Lincoln", email: "abe45@gmail.com", amount: "$242.00", status: "success" },
  { customer: "Monserrat Rodriguez", email: "monserrat44@gmail.com", amount: "$837.00", status: "processing" },
  { customer: "Silas Johnson", email: "silas22@gmail.com", amount: "$874.00", status: "success" },
  { customer: "Carmella DeVito", email: "carmella@hotmail.com", amount: "$721.00", status: "failed" },
  { customer: "Maria Garcia", email: "maria@gmail.com", amount: "$529.00", status: "success" },
  { customer: "James Wilson", email: "james34@outlook.com", amount: "$438.00", status: "processing" },
  { customer: "Sarah Jones", email: "sarah.j@yahoo.com", amount: "$692.00", status: "success" },
];

const statusColor = {
  success: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
};

export const PaymentsTable: React.FC = () => (
  <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm overflow-x-auto">
    <Table className="min-w-full">
      <thead>
        <tr>
          <th className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
          <th className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Email</th>
          <th className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
          <th className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Status</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p, i) => (
          <tr key={i} className="border-b last:border-b-0">
            <td className="px-4 py-2 whitespace-nowrap">{p.customer}</td>
            <td className="px-4 py-2 whitespace-nowrap">{p.email}</td>
            <td className="px-4 py-2 whitespace-nowrap">{p.amount}</td>
            <td className="px-4 py-2 whitespace-nowrap">
              <Badge className={statusColor[p.status as keyof typeof statusColor] + " px-2 py-1 rounded text-xs font-semibold"}>
                {p.status}
              </Badge>
            </td>
            <td className="px-4 py-2 text-right">
              <DropdownMenu label="Open menu" />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

// Ejemplo de uso:
// <PaymentsTable /> 