"use client";

/**
 * Count Animation - @vibethink/ui
 * 
 * Componente para animar números de forma suave
 * Útil para métricas y dashboards
 * 
 * @example
 * <CountAnimation number={1234} className="text-2xl font-bold" />
 */

import { useEffect } from "react";
import { cn } from "../../lib/utils";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

export interface CountAnimationProps {
  /** El número final a mostrar */
  number: number;
  /** Clases CSS adicionales */
  className?: string;
  /** Duración de la animación en segundos */
  duration?: number;
  /** Si es true, formatea el número con separadores de miles */
  formatNumber?: boolean;
}

export function CountAnimation({
  number,
  className,
  duration = 2,
  formatNumber = false
}: CountAnimationProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (value) => {
    const roundedValue = Math.round(value);
    if (formatNumber) {
      return roundedValue.toLocaleString();
    }
    return roundedValue;
  });

  useEffect(() => {
    const animation = animate(count, number, { duration });
    return animation.stop;
  }, [count, number, duration]);

  return <motion.span className={cn(className)}>{rounded}</motion.span>;
}

export default CountAnimation;



