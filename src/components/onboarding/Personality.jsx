import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Heading,
  useToast,
  Progress,
  Text,
  Link,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

const Personality = ({ token }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    personality_type: '',
    personality_test_url: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/onboarding/personality`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating personality info:', error);
      toast({
        title: 'Error updating personality information',
        status: 'error',
        duration: 3000,
      });
    }
    setLoading(false);
  };

  return (
    <Box maxW="600px" mx="auto" p={8}>
      <Progress value={80} mb={8} />
      <VStack spacing={6} align="stretch">
        <Heading size="lg" mb={6}>Personality Insights</Heading>
        
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Take the 16Personalities test to discover your personality type
        </Alert>

        <Text>
          1. Visit{' '}
          <Link
            href="https://www.16personalities.com/free-personality-test"
            color="blue.500"
            isExternal
          >
            16personalities.com
          </Link>
          {' '}to take the test
        </Text>
        <Text>2. Complete the questionnaire (takes about 12 minutes)</Text>
        <Text>3. Copy your personality type (e.g., INTJ-A) and result URL</Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Your Personality Type</FormLabel>
              <Input
                placeholder="e.g., INTJ-A"
                value={formData.personality_type}
                onChange={(e) => setFormData({
                  ...formData,
                  personality_type: e.target.value.toUpperCase()
                })}
                maxLength={6}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Results URL (optional)</FormLabel>
              <Input
                placeholder="Paste your results URL here"
                value={formData.personality_test_url}
                onChange={(e) => setFormData({
                  ...formData,
                  personality_test_url: e.target.value
                })}
                type="url"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              w="full"
              mt={4}
            >
              Complete Onboarding
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Personality;
