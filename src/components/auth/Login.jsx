import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Container,
  Heading,
  useColorModeValue,
  Text,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Dark theme colors
  const bgColor = useColorModeValue('gray.800', 'gray.800');
  const textColor = useColorModeValue('gray.100', 'gray.100');
  const borderColor = useColorModeValue('gray.600', 'gray.600');
  const inputBgColor = useColorModeValue('gray.700', 'gray.700');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <Heading size="lg">Welcome Back</Heading>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>
                  <Icon as={FaEnvelope} mr={2} />
                  Email
                </FormLabel>
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
                <FormLabel>
                  <Icon as={FaLock} mr={2} />
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    bg={inputBgColor}
                    color={textColor}
                    borderColor={borderColor}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      colorScheme="gray"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                width="100%"
                mt={4}
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <Text color={textColor}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#38B2AC', textDecoration: 'underline' }}>
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;