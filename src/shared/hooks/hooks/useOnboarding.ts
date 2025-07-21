import { useState, useEffect } from 'react';

interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  formData: any;
  startTime: Date;
  lastActivity: Date;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  actions: string[];
}

const ONBOARDING_STORAGE_KEY = 'ai-pair-onboarding-progress';

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Cargar progreso guardado
  useEffect(() => {
    const savedProgress = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed: OnboardingProgress = JSON.parse(savedProgress);
        setCurrentStep(parsed.currentStep);
        setCompletedSteps(parsed.completedSteps);
        setFormData(parsed.formData || {});
        setStartTime(new Date(parsed.startTime));
        setLastActivity(new Date(parsed.lastActivity));
        updateProgress(parsed.currentStep);
      } catch (error) {
        // TODO: log error loading onboarding progress
        // Si hay error, reiniciar
        resetOnboarding();
      }
    } else {
      // Primera vez, inicializar
      initializeOnboarding();
    }
  }, []);

  // Guardar progreso automáticamente
  useEffect(() => {
    saveProgress();
  }, [currentStep, completedSteps, formData]);

  const initializeOnboarding = () => {
    const now = new Date();
    setStartTime(now);
    setLastActivity(now);
    saveProgress();
  };

  const saveProgress = () => {
    const progressData: OnboardingProgress = {
      currentStep,
      completedSteps,
      formData,
      startTime,
      lastActivity: new Date()
    };
    
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(progressData));
    } catch (error) {
      // TODO: log error saving onboarding progress
    }
  };

  const updateProgress = (stepIndex: number) => {
    const progress = ((stepIndex + 1) / 6) * 100; // 6 pasos totales
    setProgress(progress);
  };

  const completeStep = (stepIndex: number) => {
    const stepId = getStepId(stepIndex);
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
    setLastActivity(new Date());
  };

  const getStepId = (stepIndex: number): string => {
    const stepIds = ['welcome', 'company-info', 'template-selection', 'content-setup', 'voice-assistant', 'trial-activation'];
    return stepIds[stepIndex] || 'unknown';
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < 6) {
      setCurrentStep(stepIndex);
      updateProgress(stepIndex);
      setLastActivity(new Date());
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      completeStep(currentStep);
      goToStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setLastActivity(new Date());
  };

  const resetOnboarding = () => {
    setCurrentStep(0);
    setProgress(0);
    setCompletedSteps([]);
    setFormData({});
    setStartTime(new Date());
    setLastActivity(new Date());
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  const completeOnboarding = () => {
    completeStep(currentStep);
    // Enviar datos al servidor
    sendOnboardingData();
    // Limpiar progreso local
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  const sendOnboardingData = async () => {
    try {
      const onboardingData = {
        formData,
        completedSteps,
        duration: Date.now() - startTime.getTime(),
        completedAt: new Date().toISOString()
      };

      // Enviar a Strapi
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(onboardingData),
      });

      if (!response.ok) {
        throw new Error('Failed to save onboarding data');
      }

      // TODO: log onboarding data saved successfully
    } catch (error) {
      // TODO: log error saving onboarding data
    }
  };

  const getOnboardingStats = () => {
    const duration = Date.now() - startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);

    return {
      duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      progress: Math.round(progress),
      completedSteps: completedSteps.length,
      totalSteps: 6,
      timeSinceLastActivity: Date.now() - lastActivity.getTime()
    };
  };

  const isStepCompleted = (stepIndex: number) => {
    const stepId = getStepId(stepIndex);
    return completedSteps.includes(stepId);
  };

  const canGoToStep = (stepIndex: number) => {
    // Permitir ir a pasos anteriores o al siguiente paso disponible
    return stepIndex <= currentStep + 1;
  };

  return {
    // Estado
    currentStep,
    progress,
    completedSteps,
    formData,
    startTime,
    lastActivity,

    // Acciones
    nextStep,
    previousStep,
    goToStep,
    completeStep,
    updateFormData,
    resetOnboarding,
    completeOnboarding,

    // Utilidades
    updateProgress,
    getOnboardingStats,
    isStepCompleted,
    canGoToStep,
    saveProgress
  };
}; 