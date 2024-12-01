import React, { createContext, useContext, useState } from 'react';

const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [registrationData, setRegistrationData] = useState({
    // Basic Information
    fullName: '',
    email: '',
    password: '',
    cvFile: null,
    linkedInProfile: null,

    // Career Information
    university: '',
    customUniversity: '',
    education: '',

    // Career Aspirations
    longTermGoal: '',
    careerPath: '', // 'Specialist' or 'Leadership'

    // Industry Preferences
    industries: [],
    dreamCompanies: [],
    workMode: '', // 'Hybrid', 'Remote', or 'In-Person'

    // Personality Insights
    personalityType: '',
    personalityResults: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const updateRegistrationData = (data) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        updateRegistrationData,
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        skipStep,
        totalSteps,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
