import React, { useState } from 'react';
import { useRegistration } from '../../context/RegistrationContext';

const CareerAspirations = () => {
  const { registrationData, updateRegistrationData, nextStep, prevStep, skipStep } = useRegistration();
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!registrationData.longTermGoal) {
      newErrors.longTermGoal = 'Please describe your long-term career goal';
    }
    if (!registrationData.careerPath) {
      newErrors.careerPath = 'Please select your preferred career path';
    }

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Career Aspirations</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            What is your long-term career goal?
          </label>
          <textarea
            value={registrationData.longTermGoal}
            onChange={(e) => updateRegistrationData({ longTermGoal: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe your career aspirations..."
          />
          {errors.longTermGoal && (
            <p className="text-red-500 text-sm mt-1">{errors.longTermGoal}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Do you prefer a Specialist or Leadership path?
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="Specialist"
                checked={registrationData.careerPath === 'Specialist'}
                onChange={(e) => updateRegistrationData({ careerPath: e.target.value })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2">
                Specialist - Deep expertise in a specific area
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Leadership"
                checked={registrationData.careerPath === 'Leadership'}
                onChange={(e) => updateRegistrationData({ careerPath: e.target.value })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2">
                Leadership - Managing teams and driving strategy
              </span>
            </label>
          </div>
          {errors.careerPath && (
            <p className="text-red-500 text-sm mt-1">{errors.careerPath}</p>
          )}
        </div>

        <div className="flex justify-between space-x-4 mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={skipStep}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Skip
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default CareerAspirations;
