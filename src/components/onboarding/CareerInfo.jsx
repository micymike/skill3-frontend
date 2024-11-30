import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  VStack,
  Heading,
  useToast,
  Progress,
} from '@chakra-ui/react';

const CareerInfo = ({ token }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    university_id: '',
    custom_university: '',
    education_program_id: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/universities`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUniversities(response.data);
      } catch (error) {
        console.error('Error fetching universities:', error);
        toast({
          title: 'Error fetching universities',
          status: 'error',
          duration: 3000,
        });
      }
    };
    fetchUniversities();
  }, [token, toast]);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (formData.university_id && formData.university_id !== 'other') {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/education-programs/${formData.university_id}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setPrograms(response.data);
        } catch (error) {
          console.error('Error fetching programs:', error);
          toast({
            title: 'Error fetching programs',
            status: 'error',
            duration: 3000,
          });
        }
      }
    };
    fetchPrograms();
  }, [formData.university_id, token, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/onboarding/career-info`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/onboarding/career-aspirations');
    } catch (error) {
      console.error('Error updating career info:', error);
      toast({
        title: 'Error updating career information',
        status: 'error',
        duration: 3000,
      });
    }
    setLoading(false);
  };

  return (
    <Box maxW="600px" mx="auto" p={8}>
      <Progress value={20} mb={8} />
      <VStack spacing={6} align="stretch">
        <Heading size="lg" mb={6}>Education Information</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>University</FormLabel>
              <Select
                placeholder="Select university"
                value={formData.university_id}
                onChange={(e) => setFormData({
                  ...formData,
                  university_id: e.target.value,
                  education_program_id: ''
                })}
              >
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
                <option value="other">Other</option>
              </Select>
            </FormControl>

            {formData.university_id === 'other' && (
              <FormControl isRequired>
                <FormLabel>University Name</FormLabel>
                <Input
                  placeholder="Enter university name"
                  value={formData.custom_university}
                  onChange={(e) => setFormData({
                    ...formData,
                    custom_university: e.target.value
                  })}
                />
              </FormControl>
            )}

            {formData.university_id && formData.university_id !== 'other' && (
              <FormControl isRequired>
                <FormLabel>Education Program</FormLabel>
                <Select
                  placeholder="Select program"
                  value={formData.education_program_id}
                  onChange={(e) => setFormData({
                    ...formData,
                    education_program_id: e.target.value
                  })}
                >
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

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

export default CareerInfo;
