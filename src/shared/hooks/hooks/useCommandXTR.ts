import { useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
  timestamp: Date;
  executionTime?: number;
}

export interface CommandHistory {
  id: string;
  command: string;
  result: CommandResult;
  timestamp: Date;
  userId: string;
}

export interface CommandSuggestion {
  command: string;
  description: string;
  category: string;
  usage: string;
  examples: string[];
}

export interface CommandXTRConfig {
  maxHistorySize: number;
  enableAutoComplete: boolean;
  enableSuggestions: boolean;
  enableAudit: boolean;
}

export const useCommandXTR = (config: Partial<CommandXTRConfig> = {}) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<CommandResult | null>(null);
  
  const defaultConfig: CommandXTRConfig = {
    maxHistorySize: 50,
    enableAutoComplete: true,
    enableSuggestions: true,
    enableAudit: true,
    ...config
  };

  const configRef = useRef(defaultConfig);

  // Available commands - CommandXTR as fundamental prefix
  const availableCommands: CommandSuggestion[] = [
    // Projects
    {
      command: 'CommandXTR create project',
      description: 'Create new project',
      category: 'PROJECT',
      usage: 'CommandXTR create project "Name" "Description" [start_date] [end_date]',
      examples: [
        'CommandXTR create project "CRM System" "Enterprise CRM development"',
        'CommandXTR create project "Mobile App" "iOS/Android application" 2024-01-01 2024-06-30'
      ]
    },
    {
      command: 'CommandXTR list projects',
      description: 'List projects (company-scoped)',
      category: 'PROJECT',
      usage: 'CommandXTR list projects [status] [limit] [all]',
      examples: [
        'CommandXTR list projects',
        'CommandXTR list projects active 10',
        'CommandXTR list projects completed',
        'CommandXTR list projects all'  // All projects (SUPER_ADMIN only)
      ]
    },
    {
      command: 'CommandXTR update project',
      description: 'Update project',
      category: 'PROJECT',
      usage: 'CommandXTR update project [id] [field] [value]',
      examples: [
        'CommandXTR update project 123 name "New Name"',
        'CommandXTR update project 123 status completed'
      ]
    },
    {
      command: 'CommandXTR delete project',
      description: 'Delete project',
      category: 'PROJECT',
      usage: 'CommandXTR delete project [id]',
      examples: [
        'CommandXTR delete project 123'
      ]
    },

    // Tasks
    {
      command: 'CommandXTR create task',
      description: 'Create new task',
      category: 'TASK',
      usage: 'CommandXTR create task "Title" "Description" [project_id] [priority]',
      examples: [
        'CommandXTR create task "Implement login" "Authentication system" 123 high',
        'CommandXTR create task "Design UI" "User interface" 123 medium'
      ]
    },
    {
      command: 'CommandXTR list tasks',
      description: 'List tasks (project-scoped)',
      category: 'TASK',
      usage: 'CommandXTR list tasks [project_id] [status] [assigned_to] [all]',
      examples: [
        'CommandXTR list tasks',
        'CommandXTR list tasks 123 pending',
        'CommandXTR list tasks 123 pending user@email.com',
        'CommandXTR list tasks all'  // All tasks across all projects
      ]
    },
    {
      command: 'CommandXTR update task',
      description: 'Update task',
      category: 'TASK',
      usage: 'CommandXTR update task [id] [field] [value]',
      examples: [
        'CommandXTR update task 456 title "New title"',
        'CommandXTR update task 456 status in_progress'
      ]
    },
    {
      command: 'CommandXTR change status',
      description: 'Change task status',
      category: 'TASK',
      usage: 'CommandXTR change status [id] [new_status]',
      examples: [
        'CommandXTR change status 456 pending',
        'CommandXTR change status 456 in_progress',
        'CommandXTR change status 456 completed'
      ]
    },
    {
      command: 'CommandXTR assign task',
      description: 'Assign task to user',
      category: 'TASK',
      usage: 'CommandXTR assign task [id] [user_id]',
      examples: [
        'CommandXTR assign task 456 789',
        'CommandXTR assign task 456 user@email.com'
      ]
    },

    // Users
    {
      command: 'CommandXTR list users',
      description: 'List users (company-scoped)',
      category: 'USER',
      usage: 'CommandXTR list users [company_id] [role] [active] [all]',
      examples: [
        'CommandXTR list users',
        'CommandXTR list users 123 admin',
        'CommandXTR list users 123 employee true',
        'CommandXTR list users all'  // All users across all companies (SUPER_ADMIN only)
      ]
    },
    {
      command: 'CommandXTR create user',
      description: 'Create new user',
      category: 'USER',
      usage: 'CommandXTR create user "email" "name" [role]',
      examples: [
        'CommandXTR create user "john@company.com" "John Doe" manager',
        'CommandXTR create user "jane@company.com" "Jane Smith" employee'
      ]
    },
    {
      command: 'CommandXTR update user',
      description: 'Update user',
      category: 'USER',
      usage: 'CommandXTR update user [id] [field] [value]',
      examples: [
        'CommandXTR update user 789 name "John Smith"',
        'CommandXTR update user 789 role admin'
      ]
    },
    {
      command: 'CommandXTR set permission',
      description: 'Set user permission',
      category: 'USER',
      usage: 'CommandXTR set permission [id] [permission] [value]',
      examples: [
        'CommandXTR set permission 789 admin true',
        'CommandXTR set permission 789 billing false'
      ]
    },

    // System
    {
      command: 'CommandXTR system status',
      description: 'View system status',
      category: 'SYSTEM',
      usage: 'CommandXTR system status [service] [all]',
      examples: [
        'CommandXTR system status',
        'CommandXTR system status database',
        'CommandXTR system status api',
        'CommandXTR system status all'  // Detailed status of all services
      ]
    },
    {
      command: 'CommandXTR system config',
      description: 'View/update configuration',
      category: 'SYSTEM',
      usage: 'CommandXTR system config [section] [key] [value] [all]',
      examples: [
        'CommandXTR system config',
        'CommandXTR system config email smtp_host smtp.gmail.com',
        'CommandXTR system config security session_timeout 3600',
        'CommandXTR system config all'  // Show all configuration sections
      ]
    },
    {
      command: 'CommandXTR restart service',
      description: 'Restart services',
      category: 'SYSTEM',
      usage: 'CommandXTR restart service [service_name] [all]',
      examples: [
        'CommandXTR restart service',
        'CommandXTR restart service cache',
        'CommandXTR restart service worker',
        'CommandXTR restart service all'  // Restart all services
      ]
    },

    // Reports
    {
      command: 'CommandXTR generate report',
      description: 'Generate reports',
      category: 'REPORT',
      usage: 'CommandXTR generate report [type] [period] [format] [scope] [all]',
      examples: [
        'CommandXTR generate report projects month pdf',
        'CommandXTR generate report tasks 123 week excel',
        'CommandXTR generate report users quarter csv',
        'CommandXTR generate report projects all'  // Report for all companies
      ]
    },

    // Help
    {
      command: 'CommandXTR help',
      description: 'Show general help',
      category: 'HELP',
      usage: 'CommandXTR help [category] [command]',
      examples: [
        'CommandXTR help',
        'CommandXTR help projects',
        'CommandXTR help create project'
      ]
    },
    {
      command: 'CommandXTR help examples',
      description: 'Show command examples',
      category: 'HELP',
      usage: 'CommandXTR help examples [command]',
      examples: [
        'CommandXTR help examples',
        'CommandXTR help examples create project'
      ]
    },
    {
      command: 'CommandXTR help syntax',
      description: 'Show command syntax',
      category: 'HELP',
      usage: 'CommandXTR help syntax [command]',
      examples: [
        'CommandXTR help syntax create project',
        'CommandXTR help syntax list tasks'
      ]
    }
  ];

  // Execute command
  const executeCommand = useCallback(async (command: string): Promise<CommandResult> => {
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
        timestamp: new Date()
      };
    }

    setIsExecuting(true);
    const startTime = Date.now();

    try {
      // Simulate command processing
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

      // Here would be the real command processing logic
      const result: CommandResult = {
        success: true,
        message: `Command "${command}" executed successfully`,
        data: { 
          command, 
          userId: user.id,
          timestamp: new Date(),
          processed: true
        },
        timestamp: new Date(),
        executionTime: Date.now() - startTime
      };

      // Add to history
      const historyItem: CommandHistory = {
        id: Date.now().toString(),
        command,
        result,
        timestamp: new Date(),
        userId: user.id
      };

      setHistory(prev => {
        const newHistory = [historyItem, ...prev];
        return newHistory.slice(0, configRef.current.maxHistorySize);
      });

      setLastResult(result);

      // Audit if enabled
      if (configRef.current.enableAudit) {
        // TODO: log command executed audit
      }

      return result;
    } catch (error) {
      const result: CommandResult = {
        success: false,
        message: `Error executing command: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date(),
        executionTime: Date.now() - startTime
      };

      const historyItem: CommandHistory = {
        id: Date.now().toString(),
        command,
        result,
        timestamp: new Date(),
        userId: user.id
      };

      setHistory(prev => {
        const newHistory = [historyItem, ...prev];
        return newHistory.slice(0, configRef.current.maxHistorySize);
      });

      setLastResult(result);
      return result;
    } finally {
      setIsExecuting(false);
    }
  }, [user]);

  // Get suggestions
  const getSuggestions = useCallback((query: string): CommandSuggestion[] => {
    if (!configRef.current.enableSuggestions || !query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    return availableCommands.filter(suggestion =>
      suggestion.command.toLowerCase().includes(lowerQuery) ||
      suggestion.description.toLowerCase().includes(lowerQuery) ||
      suggestion.category.toLowerCase().includes(lowerQuery)
    );
  }, []);

  // Get help for specific command
  const getHelp = useCallback((command?: string): CommandSuggestion | null => {
    if (!command) return null;
    
    return availableCommands.find(suggestion => 
      suggestion.command.toLowerCase() === command.toLowerCase()
    ) || null;
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Get statistics
  const getStats = useCallback(() => {
    const totalCommands = history.length;
    const successfulCommands = history.filter(h => h.result.success).length;
    const failedCommands = totalCommands - successfulCommands;
    const avgExecutionTime = history.length > 0 
      ? history.reduce((sum, h) => sum + (h.result.executionTime || 0), 0) / history.length 
      : 0;

    return {
      totalCommands,
      successfulCommands,
      failedCommands,
      successRate: totalCommands > 0 ? (successfulCommands / totalCommands) * 100 : 0,
      avgExecutionTime,
      lastCommand: history[0] || null
    };
  }, [history]);

  return {
    // State
    history,
    isExecuting,
    lastResult,
    
    // Functions
    executeCommand,
    getSuggestions,
    getHelp,
    clearHistory,
    getStats,
    
    // Data
    availableCommands,
    config: configRef.current
  };
}; 