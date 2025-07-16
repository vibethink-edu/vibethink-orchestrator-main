// Hook para configuración dual
import { useState, useEffect } from 'react';

interface DualConfigurationOptions {
  primary: any;
  secondary: any;
  autoSwitch?: boolean;
  switchDelay?: number;
}

export const useDualConfiguration = (options: DualConfigurationOptions) => {
  const [activeConfig, setActiveConfig] = useState<'primary' | 'secondary'>('primary');
  const [config, setConfig] = useState(options.primary);

  useEffect(() => {
    if (options.autoSwitch && options.switchDelay) {
      const timer = setTimeout(() => {
        setActiveConfig(activeConfig === 'primary' ? 'secondary' : 'primary');
      }, options.switchDelay);

      return () => clearTimeout(timer);
    }
  }, [activeConfig, options.autoSwitch, options.switchDelay]);

  useEffect(() => {
    setConfig(activeConfig === 'primary' ? options.primary : options.secondary);
  }, [activeConfig, options.primary, options.secondary]);

  const switchConfig = () => {
    setActiveConfig(activeConfig === 'primary' ? 'secondary' : 'primary');
  };

  return {
    config,
    activeConfig,
    switchConfig,
    isPrimary: activeConfig === 'primary',
    isSecondary: activeConfig === 'secondary'
  };
}; 