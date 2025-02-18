import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database, createUserWithEmailAndPassword } from '../firebase/firebaseService';
import { set, ref } from 'firebase/database';
import './RegisterForm.css'; // Import external CSS

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
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="register-input" />
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="register-input" />
          <input type="text" placeholder="National ID or Passport Number" value={nationalId} onChange={(e) => setNationalId(e.target.value)} className="register-input" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="register-input" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="register-input" />
          <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="register-input" />
        </div>
        <div className="form-section">
          <h3>Financial Information</h3>
          <select value={employmentStatus} onChange={(e) => setEmploymentStatus(e.target.value)} className="register-input">
            <option value="">Select Employment Status</option>
            <option value="Employed">Employed</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Unemployed">Unemployed</option>
          </select>
          <select value={incomeSource} onChange={(e) => setIncomeSource(e.target.value)} className="register-input">
            <option value="">Select Source of Income</option>
            <option value="Salary">Salary</option>
            <option value="Business">Business</option>
            <option value="Investments">Investments</option>
          </select>
          <select value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="register-input">
            <option value="">Select Annual Income Range</option>
            <option value="0-50,000">0-50,000</option>
            <option value="50,001-100,000">50,001-100,000</option>
            <option value="100,001+">100,001+</option>
          </select>
        </div>
        {error && <p className="register-error">{error}</p>}
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;