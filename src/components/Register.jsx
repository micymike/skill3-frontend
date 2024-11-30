import React, { useState } from "react";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { Box, Progress, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@chakra-ui/react';

const Register = () => {
  const navigate = useNavigate();
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/auth/register`, formData);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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
      color: strength < 2 ? "red" : strength < 4 ? "orange" : strength < 6 ? "yellow" : "green",
      text: strength < 2 ? "Weak" : strength < 4 ? "Fair" : strength < 6 ? "Good" : "Strong"
    };
  };

  const renderPasswordStrengthIndicator = (password) => {
    const strength = calculatePasswordStrength(password);
    
    return (
      <Box mt={2}>
        <Progress
          value={(strength.score / 6) * 100}
          size="sm"
          colorScheme={
            strength.score < 2 ? "red" : 
            strength.score < 4 ? "orange" : 
            strength.score < 6 ? "yellow" : "green"
          }
        />
        <Text fontSize="sm" color={strength.color} mt={1}>
          Password Strength: {strength.text}
        </Text>
        <Text fontSize="xs" color="gray.400" mt={1}>
          Use 8+ characters with a mix of letters, numbers & symbols
        </Text>
      </Box>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 relative">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          interval={3000}
          transitionTime={500}
        >
          <div>
            <img
              src="https://source.unsplash.com/random/800x600/?office"
              alt="Slide 1"
              className="h-screen object-cover"
            />
          </div>
          <div>
            <img
              src="https://source.unsplash.com/random/800x600/?business"
              alt="Slide 2"
              className="h-screen object-cover"
            />
          </div>
          <div>
            <img
              src="https://source.unsplash.com/random/800x600/?corporate"
              alt="Slide 3"
              className="h-screen object-cover"
            />
          </div>
        </Carousel>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-gray-900 text-white flex flex-col justify-center px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold mb-6">Let&apos;s get started</h1>

          {/* Social Login Buttons */}
          <div className="flex space-x-4 mb-8">
            <button className="flex-1 bg-white hover:bg-blue-700 py-2 rounded flex items-center justify-center transition">
              <i className="fab fa-linkedin text-white mr-2"></i> LinkedIn
            </button>
            <button className="flex-1 bg-white hover:bg-red-700 py-2 rounded flex items-center justify-center transition">
              <i className="fab fa-google text-white mr-2"></i> Google
            </button>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 transition"
              />
              {renderPasswordStrengthIndicator(formData.password)}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-lg font-bold transition"
            >
              Sign up
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-gray-400 mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
