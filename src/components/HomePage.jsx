import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(4, 0),
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
}));

const HomePage = () => {
  const navigate = useNavigate();
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
      <Container>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleLogout}
          sx={{ mb: 2 }}
        >
          Logout
        </Button>
      </Box>

      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ 
              width: 100, 
              height: 100, 
              mr: 3,
              bgcolor: 'primary.main'
            }}
          >
            {userData.name ? userData.name[0].toUpperCase() : '?'}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome, {userData.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userData.email}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          Your Profile
        </Typography>
        <Typography variant="body1" paragraph>
          Authentication Provider: LinkedIn
        </Typography>
        <Typography variant="body1" paragraph>
          Email Verified: {userData.email_verified ? 'Yes' : 'No'}
        </Typography>
      </StyledPaper>
    </Container>
  );
};

export default HomePage;
