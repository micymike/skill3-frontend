import React, { useState, useEffect } from 'react';
import { useRegistration } from '../../context/RegistrationContext';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

const IndustryPreferences = () => {
  const { registrationData, updateRegistrationData, nextStep, prevStep, skipStep } = useRegistration();
  const [industries, setIndustries] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch industries from the backend
    const fetchIndustries = async () => {
      try {
        const response = await fetch('/api/v1/industries');
        const data = await response.json();
        setIndustries(data.map(industry => ({
          value: industry.id,
          label: industry.name
        })));
      } catch (error) {
        console.error('Error fetching industries:', error);
      }
    };

    fetchIndustries();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!registrationData.industries || registrationData.industries.length === 0) {
      newErrors.industries = 'Please select at least one industry';
    }
    if (!registrationData.workMode) {
      newErrors.workMode = 'Please select your preferred work mode';
    }

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    } else {
      setErrors(newErrors);
    }
  };

  const workModeOptions = [
    { value: 'Hybrid', label: 'Hybrid - Mix of remote and office work' },
    { value: 'Remote', label: 'Remote - Work from anywhere' },
    { value: 'In-Person', label: 'In-Person - Full-time office presence' }
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Industry & Work Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Which industries interest you?
          </label>
          <Select
            isMulti
            options={industries}
            value={registrationData.industries}
            onChange={(selected) => updateRegistrationData({ industries: selected })}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select industries..."
          />
          {errors.industries && (
            <p className="text-red-500 text-sm mt-1">{errors.industries}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dream companies you'd like to work for
          </label>
          <CreatableSelect
            isMulti
            value={registrationData.dreamCompanies}
            onChange={(selected) => updateRegistrationData({ dreamCompanies: selected })}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Add companies..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Type company names and press enter to add them
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Work Mode
          </label>
          <Select
            options={workModeOptions}
            value={workModeOptions.find(option => option.value === registrationData.workMode)}
            onChange={(selected) => updateRegistrationData({ workMode: selected.value })}
            className="basic-select"
            classNamePrefix="select"
            placeholder="Select work mode..."
          />
          {errors.workMode && (
            <p className="text-red-500 text-sm mt-1">{errors.workMode}</p>
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

export default IndustryPreferences;
