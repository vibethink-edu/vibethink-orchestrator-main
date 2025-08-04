"use client";

import { useEffect, useState } from "react";

/**
 * ClientOnly
 * Renderiza los hijos solo en el cliente para evitar hydration mismatch en SSR.
 * Útil para widgets que dependen de APIs del navegador o extensiones.
 */
export const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}; 