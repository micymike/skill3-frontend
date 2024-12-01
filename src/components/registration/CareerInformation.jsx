import React, { useState, useEffect } from 'react';
import { useRegistration } from '../../context/RegistrationContext';

const CareerInformation = () => {
  const { registrationData, updateRegistrationData, nextStep, prevStep, skipStep } = useRegistration();
  const [universities, setUniversities] = useState([]);
  const [educationPrograms, setEducationPrograms] = useState([]);
  const [errors, setErrors] = useState({});
  const [showCustomUniversity, setShowCustomUniversity] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Denmark');

  useEffect(() => {
    // Fetch universities based on selected country
    const fetchUniversities = async () => {
      try {
        const response = await fetch(`/api/v1/universities?country=${selectedCountry}`);
        const data = await response.json();
        setUniversities(data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    fetchUniversities();
  }, [selectedCountry]);

  useEffect(() => {
    // Fetch education programs based on selected university
    const fetchEducationPrograms = async () => {
      if (registrationData.university && !showCustomUniversity) {
        try {
          const response = await fetch(`/api/v1/universities/${registrationData.university}/programs`);
          const data = await response.json();
          setEducationPrograms(data);
        } catch (error) {
          console.error('Error fetching education programs:', error);
        }
      }
    };

    fetchEducationPrograms();
  }, [registrationData.university, showCustomUniversity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!showCustomUniversity && !registrationData.university) {
      newErrors.university = 'Please select a university';
    }
    if (showCustomUniversity && !registrationData.customUniversity) {
      newErrors.customUniversity = 'Please enter your university';
    }
    if (!registrationData.education) {
      newErrors.education = 'Please select your education';
    }

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Career Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              updateRegistrationData({ university: '', education: '' });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Denmark">Denmark</option>
            {/* Add more countries as needed */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">University</label>
          {!showCustomUniversity ? (
            <>
              <select
                value={registrationData.university}
                onChange={(e) => {
                  updateRegistrationData({ 
                    university: e.target.value,
                    education: ''  // Reset education when university changes
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select University</option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
                <option value="other">Other (Not Listed)</option>
              </select>
              {errors.university && (
                <p className="text-red-500 text-sm mt-1">{errors.university}</p>
              )}
            </>
          ) : (
            <>
              <input
                type="text"
                value={registrationData.customUniversity}
                onChange={(e) => updateRegistrationData({ customUniversity: e.target.value })}
                placeholder="Enter your university"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.customUniversity && (
                <p className="text-red-500 text-sm mt-1">{errors.customUniversity}</p>
              )}
            </>
          )}
          <button
            type="button"
            onClick={() => {
              setShowCustomUniversity(!showCustomUniversity);
              updateRegistrationData({
                university: '',
                customUniversity: '',
                education: ''
              });
            }}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            {showCustomUniversity ? 'Select from list' : 'My university is not listed'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Education Program</label>
          <select
            value={registrationData.education}
            onChange={(e) => updateRegistrationData({ education: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={!registrationData.university || showCustomUniversity}
          >
            <option value="">Select Education Program</option>
            {educationPrograms.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
          {errors.education && (
            <p className="text-red-500 text-sm mt-1">{errors.education}</p>
          )}
          {showCustomUniversity && (
            <input
              type="text"
              value={registrationData.education}
              onChange={(e) => updateRegistrationData({ education: e.target.value })}
              placeholder="Enter your education program"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          )}
        </div>

        <div className="flex justify-between space-x-4">
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

export default CareerInformation;
