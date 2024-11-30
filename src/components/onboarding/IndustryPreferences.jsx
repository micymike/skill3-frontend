import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  RadioGroup,
  Radio,
  Button,
  VStack,
  Heading,
  useToast,
  Progress,
  Stack,
  Tag,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const IndustryPreferences = ({ token }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [industries, setIndustries] = useState([]);
  const [formData, setFormData] = useState({
    industry_ids: [],
    dream_companies: [],
    work_mode_preference: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [dreamCompany, setDreamCompany] = useState('');

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/v1/industries`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setIndustries(response.data);
      } catch (error) {
        console.error('Error fetching industries:', error);
        toast({
          title: 'Error fetching industries',
          status: 'error',
          duration: 3000,
        });
      }
    };
    fetchIndustries();
  }, [token, toast]);

  const handleAddIndustry = () => {
    if (selectedIndustry && !formData.industry_ids.includes(selectedIndustry)) {
      setFormData({
        ...formData,
        industry_ids: [...formData.industry_ids, selectedIndustry],
      });
      setSelectedIndustry('');
    }
  };

  const handleRemoveIndustry = (id) => {
    setFormData({
      ...formData,
      industry_ids: formData.industry_ids.filter((industryId) => industryId !== id),
    });
  };

  const handleAddDreamCompany = () => {
    if (dreamCompany && !formData.dream_companies.includes(dreamCompany)) {
      setFormData({
        ...formData,
        dream_companies: [...formData.dream_companies, dreamCompany],
      });
      setDreamCompany('');
    }
  };

  const handleRemoveDreamCompany = (company) => {
    setFormData({
      ...formData,
      dream_companies: formData.dream_companies.filter((c) => c !== company),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/onboarding/industry-preferences`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/onboarding/personality');
    } catch (error) {
      console.error('Error updating industry preferences:', error);
      toast({
        title: 'Error updating preferences',
        status: 'error',
        duration: 3000,
      });
    }
    setLoading(false);
  };

  return (
    <Box maxW="600px" mx="auto" p={8}>
      <Progress value={60} mb={8} />
      <VStack spacing={6} align="stretch">
        <Heading size="lg" mb={6}>Industry & Preferences</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>Preferred Industries</FormLabel>
              <HStack mb={4}>
                <Select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  placeholder="Select industry"
                >
                  {industries
                    .filter((ind) => !formData.industry_ids.includes(ind.id))
                    .map((industry) => (
                      <option key={industry.id} value={industry.id}>
                        {industry.name}
                      </option>
                    ))}
                </Select>
                <Button onClick={handleAddIndustry}>Add</Button>
              </HStack>
              <HStack wrap="wrap" spacing={2}>
                {formData.industry_ids.map((id) => (
                  <Tag key={id} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                    {industries.find((i) => i.id === id)?.name}
                    <IconButton
                      size="xs"
                      ml={1}
                      icon={<CloseIcon />}
                      onClick={() => handleRemoveIndustry(id)}
                      variant="ghost"
                      colorScheme="blue"
                    />
                  </Tag>
                ))}
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel>Dream Companies</FormLabel>
              <HStack mb={4}>
                <Textarea
                  value={dreamCompany}
                  onChange={(e) => setDreamCompany(e.target.value)}
                  placeholder="Enter company name"
                />
                <Button onClick={handleAddDreamCompany}>Add</Button>
              </HStack>
              <HStack wrap="wrap" spacing={2}>
                {formData.dream_companies.map((company) => (
                  <Tag key={company} size="md" borderRadius="full" variant="solid" colorScheme="green">
                    {company}
                    <IconButton
                      size="xs"
                      ml={1}
                      icon={<CloseIcon />}
                      onClick={() => handleRemoveDreamCompany(company)}
                      variant="ghost"
                      colorScheme="green"
                    />
                  </Tag>
                ))}
              </HStack>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Work Mode Preference</FormLabel>
              <RadioGroup
                value={formData.work_mode_preference}
                onChange={(value) => setFormData({
                  ...formData,
                  work_mode_preference: value
                })}
              >
                <Stack direction="column" spacing={4}>
                  <Radio value="hybrid">Hybrid</Radio>
                  <Radio value="remote">Remote</Radio>
                  <Radio value="in_person">In-Person</Radio>
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

export default IndustryPreferences;
