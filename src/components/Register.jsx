import React, { useState } from "react";
//import { motion } from "framer-motion";
//import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { Box, Progress, Text, useToast } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;  // Uppercase
    if (/[a-z]/.test(password)) strength += 1;  // Lowercase
    if (/[0-9]/.test(password)) strength += 1;  // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;  // Special characters
    
    return {
      score: strength,
      color: strength < 2 ? "red.500" : strength < 4 ? "orange.500" : strength < 6 ? "yellow.500" : "green.500",
      text: strength < 2 ? "Weak" : strength < 4 ? "Fair" : strength < 6 ? "Good" : "Strong"
    };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/auth/register`, formData);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast({
          title: 'Registration successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'An error occurred during registration';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'This email is already registered. Please use a different email or sign in.';
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      toast({
        title: 'Registration failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section - Image */}
      <div className="hidden md:flex w-1/2 bg-black relative overflow-hidden">
        <img
          src="/login.jpeg"
          alt="Professional Networking"
          className="absolute w-full h-full object-cover"
        />
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 bg-black p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="space-y-8">
            {/* Logo and Header */}
            <div className="text-center space-y-4">
              <img
                src="/logo.png"
                alt="Skill3 Logo"
                className="h-20 w-20 mx-auto object-contain"
              />
              <h1 className="text-3xl font-bold text-white">Create Account</h1>
              <p className="text-gray-400 text-lg">
                Join our professional network
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 transition"
                />
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <Progress
                      value={(calculatePasswordStrength(formData.password).score / 6) * 100}
                      size="sm"
                      colorScheme={
                        calculatePasswordStrength(formData.password).score < 2 ? "red" : 
                        calculatePasswordStrength(formData.password).score < 4 ? "orange" : 
                        calculatePasswordStrength(formData.password).score < 6 ? "yellow" : "green"
                      }
                      borderRadius="full"
                      bg="gray.700"
                    />
                    <Text fontSize="sm" color={calculatePasswordStrength(formData.password).color} mt={1}>
                      Password Strength: {calculatePasswordStrength(formData.password).text}
                    </Text>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              >
                Create Account
              </button>

              {/* Sign In Link */}
              <p className="text-center text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-500 hover:text-blue-400 font-medium"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
