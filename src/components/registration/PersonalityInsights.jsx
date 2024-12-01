import React, { useState } from 'react';
import { useRegistration } from '../../context/RegistrationContext';

const PersonalityInsights = () => {
  const { registrationData, updateRegistrationData, nextStep, prevStep, skipStep } = useRegistration();
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // This step is optional, so we don't need validation
    nextStep();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const results = JSON.parse(event.target.result);
          updateRegistrationData({ personalityResults: results });
          setErrors({});
        } catch (error) {
          setErrors({ file: 'Invalid file format. Please upload a valid JSON file.' });
        }
      };
      reader.readAsText(file);
    }
  };

  const personalityTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Personality Insights</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Myers-Briggs (MBTI) Personality Type
          </label>
          <select
            value={registrationData.personalityType}
            onChange={(e) => updateRegistrationData({ personalityType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select your type</option>
            {personalityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Take the 16Personalities Test
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Don't know your personality type? Take the official test at 16personalities.com
          </p>
          <a
            href="https://www.16personalities.com/free-personality-test"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Take the Test
          </a>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Upload Test Results
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            After completing the test, you can upload your results file here
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file}</p>
          )}
          {registrationData.personalityResults && (
            <p className="text-green-500 text-sm mt-1">Results uploaded successfully!</p>
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
            Finish
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalityInsights;
