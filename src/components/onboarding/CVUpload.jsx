import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  VStack,
  Heading,
  useToast,
  Progress,
  Input,
  Text,
  Icon,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';

const CVUpload = ({ token }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a PDF file to upload',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/onboarding/cv`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      navigate('/onboarding/career-info');
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast({
        title: 'Error uploading CV',
        description: error.response?.data?.error || 'An error occurred',
        status: 'error',
        duration: 3000,
      });
    }
    setLoading(false);
  };

  return (
    <Box maxW="600px" mx="auto" p={8}>
      <Progress value={0} mb={8} />
      <VStack spacing={6} align="stretch">
        <Heading size="lg" mb={6}>Upload Your CV</Heading>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Please upload your CV in PDF format
        </Alert>

        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>CV Upload</FormLabel>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                display="none"
                id="cv-upload"
              />
              <Button
                as="label"
                htmlFor="cv-upload"
                cursor="pointer"
                w="full"
                h="150px"
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="md"
                _hover={{
                  borderColor: 'blue.500',
                }}
              >
                <Center flexDirection="column">
                  <Icon as={AttachmentIcon} w={8} h={8} mb={2} />
                  <Text>
                    {file ? file.name : 'Click or drag to upload CV'}
                  </Text>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    PDF files only
                  </Text>
                </Center>
              </Button>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              w="full"
              mt={4}
              isDisabled={!file}
            >
              Next
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default CVUpload;
