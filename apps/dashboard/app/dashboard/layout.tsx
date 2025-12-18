import React from "react";

export default function DashboardLoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Layout sin padding para que el login ocupe toda la pantalla
  return <>{children}</>;
}

