import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Avatar,
  useToast,
} from '@chakra-ui/react';

const HomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!userData) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center" mt={4}>
          <Heading>Loading...</Heading>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="lg">Welcome, {userData.name}!</Heading>
            <Text color="gray.600">{userData.email}</Text>
          </Box>
          <HStack spacing={4}>
            <Avatar size="sm" />
            <Button onClick={handleLogout} colorScheme="blue" variant="outline">
              Logout
            </Button>
          </HStack>
        </HStack>

        <Box
          p={8}
          borderRadius="lg"
          bg="white"
          boxShadow="sm"
          border="1px"
          borderColor="gray.100"
        >
          <VStack spacing={6} align="stretch">
            <Heading size="md">Your Profile</Heading>
            <Text>
              Authentication Provider: LinkedIn
            </Text>
            <Text>
              Email Verified: {userData.email_verified ? 'Yes' : 'No'}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default HomePage;
