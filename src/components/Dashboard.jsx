import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  List,
  ListItem,
  useToast,
  Progress,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Wrap,
  WrapItem,
  Input,
  Icon,
} from '@chakra-ui/react';
import { FaUpload, FaFile, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [incrementalData, setIncrementalData] = useState({});
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Check initial processing status
    checkProcessingStatus();
  }, []);

  useEffect(() => {
    let intervalId;
    if (uploading || (processingStatus && processingStatus.status !== 'completed' && processingStatus.status !== 'error')) {
      intervalId = setInterval(checkProcessingStatus, 2000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [uploading, processingStatus]);

  const checkProcessingStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/profile/cv/processing-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch processing status');
      }

      const status = await response.json();
      setProcessingStatus(status);
      
      if (status.latest_data) {
        setIncrementalData(prevData => ({
          ...prevData,
          ...status.latest_data
        }));
      }
      
      if (status.status === 'completed') {
        setUploading(false);
        toast({
          title: 'Processing Complete',
          description: 'Your CV has been successfully processed',
          status: 'success',
          duration: 5000,
        });
      } else if (status.status === 'error') {
        setUploading(false);
        toast({
          title: 'Processing Error',
          description: status.error || 'There was an error processing your CV',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error checking processing status:', error);
      if (error.message.includes('Failed to fetch')) {
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to the server. Please check your connection.',
          status: 'error',
          duration: 5000,
        });
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a PDF file to upload',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/profile/cv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setFile(null);
      
      toast({
        title: 'Upload Successful',
        description: data.message || 'Your CV is being processed',
        status: 'success',
        duration: 3000,
      });

      // Start polling for status updates
      setProcessingStatus({ status: 'started', progress: 0 });
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload CV',
        status: 'error',
        duration: 3000,
      });

      if (error.message.includes('authentication')) {
        navigate('/login');
      }
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const renderProcessingStatus = () => {
    if (!processingStatus) return null;

    return (
      <Box mb={6}>
        <HStack mb={2}>
          <Text fontWeight="bold">Processing Status:</Text>
          <Badge colorScheme={
            processingStatus.status === 'completed' ? 'green' : 
            processingStatus.status === 'error' ? 'red' : 
            'blue'
          }>
            {processingStatus.status.toUpperCase()}
          </Badge>
        </HStack>
        <Progress 
          value={processingStatus.progress} 
          size="lg" 
          colorScheme={
            processingStatus.status === 'completed' ? 'green' : 
            processingStatus.status === 'error' ? 'red' : 
            'blue'
          }
          mb={2}
        />
        <Text fontSize="sm" color="gray.500">
          {processingStatus.progress}% Complete
        </Text>
      </Box>
    );
  };

  const renderExtractedData = () => {
    if (!incrementalData || Object.keys(incrementalData).length === 0) return null;

    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="100%">
        {/* Personal Information */}
        {incrementalData.personal_info && (
          <Card>
            <CardHeader>
              <Heading size="md">Personal Information</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={2}>
                {incrementalData.personal_info.name && (
                  <Text><strong>Name:</strong> {incrementalData.personal_info.name}</Text>
                )}
                {incrementalData.personal_info.email && (
                  <Text><strong>Email:</strong> {incrementalData.personal_info.email}</Text>
                )}
                {incrementalData.personal_info.phone && (
                  <Text><strong>Phone:</strong> {incrementalData.personal_info.phone}</Text>
                )}
                {incrementalData.personal_info.summary && (
                  <Text><strong>Summary:</strong> {incrementalData.personal_info.summary}</Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Skills */}
        {incrementalData.skills && incrementalData.skills.length > 0 && (
          <Card>
            <CardHeader>
              <Heading size="md">Skills</Heading>
            </CardHeader>
            <CardBody>
              <Wrap spacing={2}>
                {incrementalData.skills.map((skill, index) => (
                  <WrapItem key={index}>
                    <Badge colorScheme="blue" p={2} borderRadius="md">
                      {skill}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            </CardBody>
          </Card>
        )}

        {/* Work Experience */}
        {incrementalData.work_experience && incrementalData.work_experience.length > 0 && (
          <Card>
            <CardHeader>
              <Heading size="md">Work Experience</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={4} width="100%">
                {incrementalData.work_experience.map((exp, index) => (
                  <Box key={index} width="100%">
                    <Text fontWeight="bold">{exp.position}</Text>
                    <Text>{exp.company}</Text>
                    <Text fontSize="sm" color="gray.500">{exp.duration}</Text>
                    {exp.achievements && (
                      <List spacing={1} mt={2}>
                        {exp.achievements.map((achievement, idx) => (
                          <ListItem key={idx} fontSize="sm">
                            • {achievement}
                          </ListItem>
                        ))}
                      </List>
                    )}
                    {index < incrementalData.work_experience.length - 1 && <Divider mt={2} />}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Education */}
        {incrementalData.education && incrementalData.education.length > 0 && (
          <Card>
            <CardHeader>
              <Heading size="md">Education</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={4} width="100%">
                {incrementalData.education.map((edu, index) => (
                  <Box key={index} width="100%">
                    <Text fontWeight="bold">{edu.degree}</Text>
                    <Text>{edu.institution}</Text>
                    <Text fontSize="sm" color="gray.500">{edu.year}</Text>
                    {index < incrementalData.education.length - 1 && <Divider mt={2} />}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}
      </SimpleGrid>
    );
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
          <VStack spacing={4} align="stretch">
            <Heading size="lg" mb={4}>CV Upload & Processing</Heading>
            
            {/* File Upload Section */}
            <HStack spacing={4}>
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
                colorScheme="blue"
                leftIcon={<Icon as={FaUpload} />}
                isDisabled={uploading}
              >
                Select PDF
              </Button>
              {file && (
                <HStack>
                  <Icon as={FaFile} />
                  <Text>{file.name}</Text>
                </HStack>
              )}
              <Button
                colorScheme="green"
                onClick={handleFileUpload}
                isLoading={uploading}
                loadingText="Uploading..."
                isDisabled={!file || uploading}
              >
                Upload & Process
              </Button>
            </HStack>

            {/* Processing Status */}
            {renderProcessingStatus()}
          </VStack>
        </Box>

        {/* Extracted Data Display */}
        {renderExtractedData()}
      </VStack>
    </Container>
  );
};

export default Dashboard;
