/**
 * Operational Repositories Hook
 * 
 * Hook para manejar repositorios operacionales
 * 
 * @author AI Pair Platform
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface Repository {
  id: string;
  name: string;
  type: 'github' | 'gitlab' | 'bitbucket';
  url: string;
  isActive: boolean;
  lastSync: string;
}

export const useOperationalRepositories = () => {
  const { user } = useAuth();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRepositories();
    }
  }, [user]);

  const loadRepositories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for now
      const mockRepositories: Repository[] = [
        {
          id: '1',
          name: 'ai-pair-platform',
          type: 'github',
          url: 'https://github.com/VibeThink/ai-pair-platform',
          isActive: true,
          lastSync: new Date().toISOString()
        },
        {
          id: '2',
          name: 'VTK-methodology',
          type: 'github',
          url: 'https://github.com/VibeThink/VTK-methodology',
          isActive: true,
          lastSync: new Date().toISOString()
        }
      ];
      
      setRepositories(mockRepositories);
    } catch (err) {
      setError('Error loading repositories');
    } finally {
      setLoading(false);
    }
  };

  const addRepository = async (repo: Omit<Repository, 'id' | 'lastSync'>) => {
    const newRepo: Repository = {
      ...repo,
      id: Date.now().toString(),
      lastSync: new Date().toISOString()
    };
    
    setRepositories(prev => [...prev, newRepo]);
  };

  const updateRepository = async (id: string, updates: Partial<Repository>) => {
    setRepositories(prev => 
      prev.map(repo => 
        repo.id === id ? { ...repo, ...updates } : repo
      )
    );
  };

  const deleteRepository = async (id: string) => {
    setRepositories(prev => prev.filter(repo => repo.id !== id));
  };

  return {
    repositories,
    loading,
    error,
    addRepository,
    updateRepository,
    deleteRepository,
    refreshRepositories: loadRepositories
  };
}; 