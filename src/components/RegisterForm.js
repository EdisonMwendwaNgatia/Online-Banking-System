import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database, createUserWithEmailAndPassword } from '../firebase/firebaseService';
import { set, ref } from 'firebase/database';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Section = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: #555;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  font-size: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6' fill='none'%3E%3Cpath fill='%23666' d='M6 6 0 0h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  padding: 10px;
  background-color: #fde2e2;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 14px;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  font-weight: 600;

  &:hover {
    background-color: #3a7bc8;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      await set(ref(database, 'users/' + userId), {
        fullName,
        dob,
        nationalId,
        email,
        phoneNumber,
        employmentStatus,
        incomeSource,
        annualIncome,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <Title>Register</Title>
      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Personal Information</SectionTitle>
          <Input 
            type="text" 
            placeholder="Full Name" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            required
          />
          <Input 
            type="date" 
            value={dob} 
            onChange={(e) => setDob(e.target.value)} 
            required
          />
          <Input 
            type="text" 
            placeholder="National ID or Passport Number" 
            value={nationalId} 
            onChange={(e) => setNationalId(e.target.value)} 
            required
          />
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <Input 
            type="text" 
            placeholder="Phone Number" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required
          />
        </Section>
        <Section>
          <SectionTitle>Financial Information</SectionTitle>
          <Select 
            value={employmentStatus} 
            onChange={(e) => setEmploymentStatus(e.target.value)}
            required
          >
            <option value="">Select Employment Status</option>
            <option value="Employed">Employed</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Unemployed">Unemployed</option>
          </Select>
          <Select 
            value={incomeSource} 
            onChange={(e) => setIncomeSource(e.target.value)}
            required
          >
            <option value="">Select Source of Income</option>
            <option value="Salary">Salary</option>
            <option value="Business">Business</option>
            <option value="Investments">Investments</option>
          </Select>
          <Select 
            value={annualIncome} 
            onChange={(e) => setAnnualIncome(e.target.value)}
            required
          >
            <option value="">Select Annual Income Range</option>
            <option value="0-50,000">0-50,000</option>
            <option value="50,001-100,000">50,001-100,000</option>
            <option value="100,001+">100,001+</option>
          </Select>
        </Section>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Register</Button>
      </Form>
    </Container>
  );
};

export default RegisterForm;