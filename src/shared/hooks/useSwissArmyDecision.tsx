/**
 * Swiss Army Decision Hook
 * 
 * Provides decision-making utilities for the Swiss Army Framework
 * - Tool selection logic
 * - Decision metrics calculation
 * - Framework validation
 * 
 * @author AI Pair Platform
 * @version 2.1.0
 */

import { useState, useCallback, useMemo } from 'react';

// Tool decision interface
export interface ToolDecision {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'testing' | 'deployment' | 'monitoring' | 'security';
  complexity: 'low' | 'medium' | 'high';
  priority: number;
  isSelected: boolean;
  metrics: {
    efficiency: number;
    reliability: number;
    maintainability: number;
    cost: number;
  };
}

// Hook interface
interface UseSwissArmyDecisionReturn {
  tools: ToolDecision[];
  selectedTools: ToolDecision[];
  addTool: (tool: Omit<ToolDecision, 'id' | 'isSelected'>) => void;
  removeTool: (toolId: string) => void;
  toggleTool: (toolId: string) => void;
  calculateMetrics: () => {
    totalEfficiency: number;
    totalReliability: number;
    totalMaintainability: number;
    totalCost: number;
    averageComplexity: number;
  };
  validateFramework: () => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  resetFramework: () => void;
}

/**
 * Swiss Army Decision Hook
 */
export const useSwissArmyDecision = (): UseSwissArmyDecisionReturn => {
  const [tools, setTools] = useState<ToolDecision[]>([]);

  // Add a new tool to the framework
  const addTool = useCallback((tool: Omit<ToolDecision, 'id' | 'isSelected'>) => {
    const newTool: ToolDecision = {
      ...tool,
      id: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isSelected: false
    };
    
    setTools(prev => [...prev, newTool]);
  }, []);

  // Remove a tool from the framework
  const removeTool = useCallback((toolId: string) => {
    setTools(prev => prev.filter(tool => tool.id !== toolId));
  }, []);

  // Toggle tool selection
  const toggleTool = useCallback((toolId: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId 
        ? { ...tool, isSelected: !tool.isSelected }
        : tool
    ));
  }, []);

  // Get selected tools
  const selectedTools = useMemo(() => 
    tools.filter(tool => tool.isSelected), 
    [tools]
  );

  // Calculate framework metrics
  const calculateMetrics = useCallback(() => {
    if (selectedTools.length === 0) {
      return {
        totalEfficiency: 0,
        totalReliability: 0,
        totalMaintainability: 0,
        totalCost: 0,
        averageComplexity: 0
      };
    }

    const totals = selectedTools.reduce((acc, tool) => ({
      efficiency: acc.efficiency + tool.metrics.efficiency,
      reliability: acc.reliability + tool.metrics.reliability,
      maintainability: acc.maintainability + tool.metrics.maintainability,
      cost: acc.cost + tool.metrics.cost
    }), { efficiency: 0, reliability: 0, maintainability: 0, cost: 0 });

    const complexityValues = { low: 1, medium: 2, high: 3 };
    const averageComplexity = selectedTools.reduce((sum, tool) => 
      sum + complexityValues[tool.complexity], 0
    ) / selectedTools.length;

    return {
      totalEfficiency: totals.efficiency,
      totalReliability: totals.reliability,
      totalMaintainability: totals.maintainability,
      totalCost: totals.cost,
      averageComplexity
    };
  }, [selectedTools]);

  // Validate framework configuration
  const validateFramework = useCallback(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check minimum tools
    if (selectedTools.length < 2) {
      errors.push('Se requieren al menos 2 herramientas para un framework válido');
    }

    // Check category distribution
    const categories = selectedTools.map(tool => tool.category);
    const uniqueCategories = new Set(categories);
    
    if (uniqueCategories.size < 2) {
      warnings.push('Se recomienda diversificar las categorías de herramientas');
    }

    // Check complexity balance
    const highComplexityTools = selectedTools.filter(tool => tool.complexity === 'high');
    if (highComplexityTools.length > selectedTools.length * 0.5) {
      warnings.push('Demasiadas herramientas de alta complejidad pueden afectar la mantenibilidad');
    }

    // Check cost efficiency
    const metrics = calculateMetrics();
    if (metrics.totalCost > 1000) {
      warnings.push('El costo total del framework es alto');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, [selectedTools, calculateMetrics]);

  // Reset framework
  const resetFramework = useCallback(() => {
    setTools([]);
  }, []);

  return {
    tools,
    selectedTools,
    addTool,
    removeTool,
    toggleTool,
    calculateMetrics,
    validateFramework,
    resetFramework
  };
}; 
