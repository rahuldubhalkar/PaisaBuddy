'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { modules as initialModulesData, Module } from '@/lib/learning-modules-data';

interface LearningModulesContextType {
  modules: Module[];
  updateModuleProgress: (moduleId: string, progress: number) => void;
  getModuleById: (moduleId: string) => Module | undefined;
}

const LearningModulesContext = createContext<LearningModulesContextType | undefined>(undefined);

export function LearningModulesProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedModules = localStorage.getItem('learningModules');
      if (storedModules) {
        setModules(JSON.parse(storedModules));
      } else {
        setModules(initialModulesData);
      }
    } catch (error) {
      console.error("Failed to load learning modules from localStorage", error);
      setModules(initialModulesData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('learningModules', JSON.stringify(modules));
    }
  }, [modules, loading]);

  const updateModuleProgress = (moduleId: string, newProgress: number) => {
    setModules(prevModules =>
      prevModules.map(module =>
        module.id === moduleId
          ? { ...module, progress: Math.max(module.progress, newProgress) } // Keep highest progress
          : module
      )
    );
  };

  const getModuleById = (moduleId: string) => {
    return modules.find(m => m.id === moduleId);
  };
  
  if (loading) {
    return null;
  }

  return (
    <LearningModulesContext.Provider value={{ modules, updateModuleProgress, getModuleById }}>
      {children}
    </LearningModulesContext.Provider>
  );
}

export function useLearningModules() {
  const context = useContext(LearningModulesContext);
  if (context === undefined) {
    throw new Error('useLearningModules must be used within a LearningModulesProvider');
  }
  return context;
}
