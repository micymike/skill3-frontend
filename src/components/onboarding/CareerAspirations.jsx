import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  RadioGroup,
  Radio,
  Button,
  VStack,
  Heading,
  useToast,
  Progress,
  Stack,
} from '@chakra-ui/react';

const CareerAspirations = ({ token }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    career_goal: '',
    career_path: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/onboarding/career-aspirations`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/onboarding/industry-preferences');
    } catch (error) {
      console.error('Error updating career aspirations:', error);
      toast({
        title: 'Error updating career aspirations',
        status: 'error',
        duration: 3000,
      });
    }
    setLoading(false);
  };

  return (
    <Box maxW="600px" mx="auto" p={8}>
      <Progress value={40} mb={8} />
      <VStack spacing={6} align="stretch">
        <Heading size="lg" mb={6}>Career Aspirations</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>What is your long-term career goal?</FormLabel>
              <Textarea
                placeholder="Describe your career ambitions..."
                value={formData.career_goal}
                onChange={(e) => setFormData({
                  ...formData,
                  career_goal: e.target.value
                })}
                minH="150px"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Which career path interests you more?</FormLabel>
              <RadioGroup
                value={formData.career_path}
                onChange={(value) => setFormData({
                  ...formData,
                  career_path: value
                })}
              >
                <Stack direction="column" spacing={4}>
                  <Radio value="specialist">
                    Specialist - Deep expertise in a specific area
                  </Radio>
                  <Radio value="leadership">
                    Leadership - Managing teams and projects
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              w="full"
              mt={4}
            >
              Next
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default CareerAspirations;
