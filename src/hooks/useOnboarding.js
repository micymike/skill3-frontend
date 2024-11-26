import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ONBOARDING_STEPS = {
  1: '/onboarding/cv',
  2: '/onboarding/career-info',
  3: '/onboarding/career-aspirations',
  4: '/onboarding/industry-preferences',
  5: '/onboarding/personality',
};

export const useOnboarding = (token) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/onboarding/status`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const { onboarding_step, onboarding_completed } = response.data;

        if (onboarding_completed) {
          navigate('/dashboard');
        } else {
          setCurrentStep(onboarding_step);
          navigate(ONBOARDING_STEPS[onboarding_step]);
        }
      } catch (err) {
        console.error('Error fetching onboarding status:', err);
        setError(err.response?.data?.error || 'Failed to fetch onboarding status');
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingStatus();
  }, [token, navigate]);

  const goToNextStep = () => {
    const nextStep = currentStep + 1;
    if (ONBOARDING_STEPS[nextStep]) {
      setCurrentStep(nextStep);
      navigate(ONBOARDING_STEPS[nextStep]);
    }
  };

  const goToPreviousStep = () => {
    const prevStep = currentStep - 1;
    if (ONBOARDING_STEPS[prevStep]) {
      setCurrentStep(prevStep);
      navigate(ONBOARDING_STEPS[prevStep]);
    }
  };

  return {
    currentStep,
    loading,
    error,
    goToNextStep,
    goToPreviousStep,
    totalSteps: Object.keys(ONBOARDING_STEPS).length,
  };
};

export default useOnboarding;
