import React, { useState } from 'react';
import { useRegistration } from '../../context/RegistrationContext';
import { FaEye, FaEyeSlash, FaLinkedin } from 'react-icons/fa';

const BasicInformation = () => {
  const { registrationData, updateRegistrationData, nextStep } = useRegistration();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!registrationData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    if (!registrationData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!registrationData.password) {
      newErrors.password = 'Password is required';
    } else if (registrationData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!registrationData.cvFile) {
      newErrors.cvFile = 'CV is required';
    }

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    } else {
      setErrors(newErrors);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      updateRegistrationData({ cvFile: file });
      setErrors(prev => ({ ...prev, cvFile: null }));
    } else {
      setErrors(prev => ({ ...prev, cvFile: 'Please upload a PDF file' }));
    }
  };

  const handleLinkedInLogin = () => {
    // LinkedIn OAuth integration
    window.location.href = '/api/v1/auth/linkedin';
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Basic Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={registrationData.fullName}
            onChange={(e) => updateRegistrationData({ fullName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={registrationData.email}
            onChange={(e) => updateRegistrationData({ email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={registrationData.password}
              onChange={(e) => updateRegistrationData({ password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload CV (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
          {errors.cvFile && <p className="text-red-500 text-sm mt-1">{errors.cvFile}</p>}
        </div>

        <button
          type="button"
          onClick={handleLinkedInLogin}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <FaLinkedin className="mr-2" /> Sign up with LinkedIn
        </button>

        <button
          type="submit"
          className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default BasicInformation;
