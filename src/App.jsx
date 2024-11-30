import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import CVUpload from './components/onboarding/CVUpload';
import CareerInfo from './components/onboarding/CareerInfo';
import CareerAspirations from './components/onboarding/CareerAspirations';
import IndustryPreferences from './components/onboarding/IndustryPreferences';
import Personality from './components/onboarding/Personality';
import { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [onboardingStep, setOnboardingStep] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newToken = params.get('token');
    const step = params.get('step');
    
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      if (step) {
        setOnboardingStep(parseInt(step));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setOnboardingStep(null);
  };

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  const OnboardingRoute = ({ children, step }) => {
    if (!token) return <Navigate to="/login" />;
    if (onboardingStep && step !== onboardingStep) {
      return <Navigate to={`/onboarding/step-${onboardingStep}`} />;
    }
    return children;
  };

  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route
            path="/onboarding/cv"
            element={
              <OnboardingRoute step={1}>
                <CVUpload token={token} />
              </OnboardingRoute>
            }
          />
          <Route
            path="/onboarding/career-info"
            element={
              <OnboardingRoute step={2}>
                <CareerInfo token={token} />
              </OnboardingRoute>
            }
          />
          <Route
            path="/onboarding/career-aspirations"
            element={
              <OnboardingRoute step={3}>
                <CareerAspirations token={token} />
              </OnboardingRoute>
            }
          />
          <Route
            path="/onboarding/industry-preferences"
            element={
              <OnboardingRoute step={4}>
                <IndustryPreferences token={token} />
              </OnboardingRoute>
            }
          />
          <Route
            path="/onboarding/personality"
            element={
              <OnboardingRoute step={5}>
                <Personality token={token} />
              </OnboardingRoute>
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
