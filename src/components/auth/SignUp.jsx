import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    email: '',
    password: '',
    cv_file: null,
    // Career Information
    university: '',
    program: '',
    // Career Aspirations
    careerGoal: '',
    careerPath: '',
    // Industry & Preferences
    industries: [],
    dreamCompanies: [],
    workMode: '',
    // Personality Insights
    personalityType: null
  });

  useEffect(() => {
    // Fetch universities when component mounts
    fetchUniversities();
  }, []);

  useEffect(() => {
    // Fetch programs when university changes
    if (formData.university) {
      fetchPrograms(formData.university);
    }
  }, [formData.university]);

  const fetchUniversities = async () => {
    try {
      const response = await fetch('http://localhost:8000/v1/universities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Server error:', error);
        throw new Error(error.details || error.error || 'Failed to fetch universities');
      }

      const data = await response.json();
      setUniversities(data);
      setError('');
    } catch (error) {
      console.error('Error fetching universities:', error);
      setError(error.message || 'Failed to load universities. Please try again later.');
      setUniversities([]);
    }
  };

  const fetchPrograms = async (university) => {
    try {
      const response = await fetch(`http://localhost:8000/v1/universities/${university}/programs`, {
        mode: 'cors',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Failed to fetch programs');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({
        ...prev,
        cv_file: file
      }));
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // For step 1, register the user
      if (step === 1) {
        const response = await fetch('http://localhost:8000/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName
          }),
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          setStep(2);
        } else {
          setError(data.error || 'Registration failed');
        }
      } else {
        // For subsequent steps, update profile
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/v1/profile/update/${step}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData),
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          if (step < 5) {
            setStep(step + 1);
          } else {
            // Automatically log in and redirect to onboarding
            localStorage.setItem('userEmail', formData.email);
            localStorage.setItem('userName', formData.fullName);
            navigate('/onboarding/cv');
          }
        } else {
          setError(data.error || 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-gray-500">Upload your CV (PDF only)</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <div className="flex gap-2">
                <select
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border rounded"
                >
                  <option value="">Select University</option>
                  {universities.map((uni, index) => (
                    <option key={index} value={uni.name}>{uni.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddUniversity}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Add New
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Education Program</label>
              <select
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Education</option>
                {programs.map((program, index) => (
                  <option key={index} value={program.name}>{program.name}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Long-term Career Goal</label>
              <textarea
                name="careerGoal"
                value={formData.careerGoal}
                onChange={handleInputChange}
                placeholder="What is your long-term career goal?"
                className="w-full p-2 border rounded h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Career Path</label>
              <select
                name="careerPath"
                value={formData.careerPath}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Path</option>
                <option value="specialist">Specialist</option>
                <option value="leadership">Leadership</option>
              </select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry Preferences</label>
              <select
                name="industries"
                multiple
                value={formData.industries}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData(prev => ({
                    ...prev,
                    industries: values
                  }));
                }}
                className="w-full p-2 border rounded h-32"
              >
                {['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Energy', 'Transportation', 'Media', 'Consulting'].map((industry, index) => (
                  <option key={index} value={industry}>{industry}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple industries</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dream Companies</label>
              <textarea
                name="dreamCompanies"
                value={formData.dreamCompanies}
                onChange={handleInputChange}
                placeholder="Enter the names of companies you'd love to work for"
                className="w-full p-2 border rounded h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Work Mode</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Work Mode</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">16Personalities Test</h3>
              <p className="text-sm text-gray-600 mb-4">
                Take the 16Personalities test to better understand your work style and preferences.
                After completing the test, you can upload your results here.
              </p>
              <a
                href="https://www.16personalities.com/free-personality-test"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline block mb-4"
              >
                Take the Test →
              </a>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Personality Test Results</label>
              <textarea
                name="personalityType"
                value={formData.personalityType || ''}
                onChange={handleInputChange}
                placeholder="Paste your personality type or full results here"
                className="w-full p-2 border rounded h-32"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleAddUniversity = async () => {
    const newUniversity = prompt('Enter the name of your university:');
    if (newUniversity?.trim()) {
      try {
        const response = await fetch('http://localhost:8000/v1/universities/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newUniversity.trim() }),
          credentials: 'include'
        });

        const data = await response.json();
        
        if (response.ok) {
          await fetchUniversities();
          setFormData(prev => ({
            ...prev,
            university: newUniversity.trim()
          }));
          setError('');
        } else {
          console.error('Server error:', data);
          throw new Error(data.details || data.error || 'Failed to add university');
        }
      } catch (error) {
        console.error('Error adding university:', error);
        setError(error.message || 'Failed to add university. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up - Step {step}</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderStep()}
        
        <div className="flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {step === 5 ? 'Complete' : 'Next'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
