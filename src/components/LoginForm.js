import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, auth } from '../firebase/firebaseService';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// Global Style for Fonts
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
`;

// Keyframe Animations
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const slideDown = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(-15px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f9fc 0%, #e3eeff 100%);
  padding: 20px;
  font-family: 'Poppins', sans-serif;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(42, 75, 141, 0.1);
  padding: 45px 35px;
  transition: all 0.4s ease;
  animation: ${fadeIn} 0.5s ease-out forwards;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #2a4b8d, #4a6fa5, #2a4b8d);
    background-size: 200% 100%;
    animation: gradientMove 3s linear infinite;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 20px 40px rgba(42, 75, 141, 0.15);
  }
  
  @keyframes gradientMove {
    0% { background-position: 0% 0; }
    100% { background-position: 200% 0; }
  }
  
  @media (max-width: 480px) {
    padding: 35px 25px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 35px;
`;

const Logo = styled.img`
  height: 48px;
  width: auto;
  margin-right: 16px;
  border-radius: 10px;
  animation: ${floatAnimation} 3s ease-in-out infinite;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.1));
`;

const BankName = styled.h1`
  font-size: 30px;
  font-weight: 700;
  color: #2a4b8d;
  letter-spacing: -0.5px;
  margin: 0;
  background: linear-gradient(120deg, #2a4b8d, #4a6fa5);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const WelcomeTitle = styled.h2`
  font-size: 26px;
  color: #2a4b8d;
  margin-bottom: 12px;
  animation: ${slideDown} 0.6s ease-out forwards;
  font-weight: 600;
`;

const Message = styled.p`
  color: #666;
  font-size: 16px;
  animation: ${slideDown} 0.8s ease-out forwards;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputLabel = styled.label`
  position: absolute;
  left: 15px;
  top: ${props => props.isFocused || props.hasValue ? '-10px' : '15px'};
  font-size: ${props => props.isFocused || props.hasValue ? '12px' : '15px'};
  color: ${props => props.isFocused ? '#2a4b8d' : '#888'};
  background-color: ${props => props.isFocused || props.hasValue ? 'white' : 'transparent'};
  padding: 0 5px;
  transition: all 0.2s ease;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid ${props => props.isFocused ? '#2a4b8d' : '#e0e0e0'};
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: white;
  height: 55px;
  
  &:focus {
    outline: none;
    border-color: #2a4b8d;
    box-shadow: 0 0 0 3px rgba(42, 75, 141, 0.15);
  }
`;

const Button = styled.button`
  padding: 16px;
  background: linear-gradient(135deg, #2a4b8d 0%, #1a3a7c 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(42, 75, 141, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(42, 75, 141, 0.3);
    background: linear-gradient(135deg, #1a3a7c 0%, #0d2556 100%);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(42, 75, 141, 0.2);
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin-top: 0;
  animation: ${shake} 0.5s ease-in-out;
  background-color: rgba(231, 76, 60, 0.1);
  padding: 10px;
  border-radius: 5px;
  border-left: 3px solid #e74c3c;
`;

const ForgotPassword = styled.a`
  text-align: right;
  color: #2a4b8d;
  text-decoration: none;
  font-size: 14px;
  margin-top: -15px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    color: #1a3a7c;
    text-decoration: underline;
  }
`;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if it's admin login
    if (email === 'admin@simplebank.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('isAdmin', 'false');
        navigate('/dashboard');
      } catch (err) {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <FormContainer>
        {/* Header */}
        <Header>
          <Logo src="/images/login-logo.jpeg" alt="SimpleBank Logo" />
          <BankName>SimpleBank</BankName>
        </Header>

        {/* Welcome Message */}
        <WelcomeMessage>
          <WelcomeTitle>Welcome Back!</WelcomeTitle>
          <Message>Please log in to manage your account securely.</Message>
        </WelcomeMessage>

        {/* Login Form */}
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputLabel 
              isFocused={emailFocused} 
              hasValue={email.length > 0}
            >
              Email
            </InputLabel>
            <Input
              type="email"
              value={email}
              isFocused={emailFocused}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              required
            />
          </InputGroup>
          <InputGroup>
            <InputLabel 
              isFocused={passwordFocused} 
              hasValue={password.length > 0}
            >
              Password
            </InputLabel>
            <Input
              type="password"
              value={password}
              isFocused={passwordFocused}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              required
            />
          </InputGroup>
          
          <ForgotPassword href="#">Forgot your password?</ForgotPassword>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Login to Your Account</Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default LoginForm;