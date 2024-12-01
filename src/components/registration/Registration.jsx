import React from 'react';
import { RegistrationProvider, useRegistration } from '../../context/RegistrationContext';
import BasicInformation from './BasicInformation';
import CareerInformation from './CareerInformation';
import CareerAspirations from './CareerAspirations';
import IndustryPreferences from './IndustryPreferences';
import PersonalityInsights from './PersonalityInsights';

const RegistrationSteps = () => {
  const { currentStep } = useRegistration();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformation />;
      case 2:
        return <CareerInformation />;
      case 3:
        return <CareerAspirations />;
      case 4:
        return <IndustryPreferences />;
      case 5:
        return <PersonalityInsights />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center ${
                  step <= currentStep ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step <= currentStep
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`hidden sm:block w-full h-1 mx-2 ${
                      step < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="hidden sm:flex justify-between text-xs text-gray-600">
            <span>Basic Info</span>
            <span>Career</span>
            <span>Aspirations</span>
            <span>Industry</span>
            <span>Personality</span>
          </div>
        </div>

        {/* Registration Form */}
        {renderStep()}
      </div>
    </div>
  );
};

const Registration = () => {
  return (
    <RegistrationProvider>
      <RegistrationSteps />
    </RegistrationProvider>
  );
};

export default Registration;
