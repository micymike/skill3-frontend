import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Select,
  Progress,
  Container,
  Heading,
  useColorModeValue,
  Switch,
  FormHelperText,
  Flex,
  Icon,
  Badge
} from '@chakra-ui/react';
import { FaCloudUploadAlt, FaUniversity, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [universities, setUniversities] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [wantToUploadCV, setWantToUploadCV] = useState(true);

  // Dark theme colors
  const bgColor = useColorModeValue('gray.800', 'gray.800');
  const textColor = useColorModeValue('gray.100', 'gray.100');
  const borderColor = useColorModeValue('gray.600', 'gray.600');
  const inputBgColor = useColorModeValue('gray.700', 'gray.700');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    university: '',
    program: '',
    graduationYear: '',
    cvFile: null
  });

  // Fetch universities on component mount
  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      console.log('Fetching universities from:', `${import.meta.env.VITE_API_URL}/v1/universities`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/universities`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Universities data:', data);
      setUniversities(data);
    } catch (error) {
      console.error('Error fetching universities:', error);
      toast({
        title: 'Error fetching universities',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        cvFile: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (step === 1) {
        // Basic registration
        const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.fullName
          })
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        
        if (wantToUploadCV) {
          setStep(2);
        } else {
          navigate('/dashboard');
        }
      } else if (step === 2 && formData.cvFile) {
        setIsUploading(true);
        const formDataObj = new FormData();
        formDataObj.append('cv', formData.cvFile);
        formDataObj.append('university', formData.university || 'Not Specified');
        formDataObj.append('program', formData.program || 'Not Specified');
        formDataObj.append('graduationYear', formData.graduationYear || 'Not Specified');

        const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/cv/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataObj
        });

        if (!response.ok) {
          throw new Error('CV upload failed');
        }

        setIsUploading(false);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsUploading(false);
    }
  };

  const renderStep1 = () => (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel><Icon as={FaUser} mr={2} />Full Name</FormLabel>
        <Input
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          bg={inputBgColor}
          color={textColor}
          borderColor={borderColor}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel><Icon as={FaEnvelope} mr={2} />Email</FormLabel>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          bg={inputBgColor}
          color={textColor}
          borderColor={borderColor}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel><Icon as={FaLock} mr={2} />Password</FormLabel>
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          bg={inputBgColor}
          color={textColor}
          borderColor={borderColor}
        />
      </FormControl>

      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='cv-upload' mb='0'>
          Want to upload your CV now?
        </FormLabel>
        <Switch
          id='cv-upload'
          isChecked={wantToUploadCV}
          onChange={(e) => setWantToUploadCV(e.target.checked)}
          colorScheme='teal'
        />
      </FormControl>
    </VStack>
  );

  const renderStep2 = () => (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel><Icon as={FaUniversity} mr={2} />University</FormLabel>
        <Select
          name="university"
          value={formData.university}
          onChange={handleInputChange}
          bg={inputBgColor}
          color={textColor}
          borderColor={borderColor}
        >
          <option value="">Select University</option>
          {universities.map((uni) => (
            <option key={uni.name} value={uni.name}>
              {uni.name} - {uni.city}, {uni.country}
            </option>
          ))}
        </Select>
        <FormHelperText>Optional - Select your university</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Program/Course</FormLabel>
        <Input
          name="program"
          value={formData.program}
          onChange={handleInputChange}
          placeholder="e.g., Computer Science"
          bg={inputBgColor}
          color={textColor}
          borderColor={borderColor}
        />
        <FormHelperText>Optional - Enter your program or course</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Graduation Year</FormLabel>
        <Input
          name="graduationYear"
          type="number"
          value={formData.graduationYear}
          onChange={handleInputChange}
          placeholder="e.g., 2024"
          bg={inputBgColor}
          color={textColor}
          borderColor={borderColor}
        />
        <FormHelperText>Optional - Enter your graduation year</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>
          <Icon as={FaCloudUploadAlt} mr={2} />
          Upload CV
        </FormLabel>
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          p={1}
          bg={inputBgColor}
          color={textColor}
          borderColor={borderColor}
        />
      </FormControl>

      {isUploading && (
        <Progress
          value={uploadProgress}
          size="sm"
          colorScheme="teal"
          hasStripe
          isAnimated
        />
      )}
    </VStack>
  );

  return (
    <Container maxW="container.sm" py={8}>
      <Box
        p={8}
        bg={bgColor}
        boxShadow="xl"
        borderRadius="lg"
        color={textColor}
      >
        <VStack spacing={6}>
          <Heading size="lg">
            {step === 1 ? 'Create Account' : 'Complete Your Profile'}
          </Heading>
          
          {step === 2 && (
            <Badge colorScheme="teal" p={2} borderRadius="md">
              Step 2 of 2 - Optional Information
            </Badge>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {step === 1 ? renderStep1() : renderStep2()}

            <Flex justify="space-between" mt={6}>
              {step === 2 && (
                <Button
                  onClick={() => navigate('/dashboard')}
                  colorScheme="gray"
                >
                  Skip
                </Button>
              )}
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={isUploading}
                ml={step === 2 ? 'auto' : '0'}
              >
                {step === 1 ? (wantToUploadCV ? 'Next' : 'Sign Up') : 'Complete Profile'}
              </Button>
            </Flex>
          </form>
        </VStack>
      </Box>
    </Container>
  );
};

export default SignUp;
