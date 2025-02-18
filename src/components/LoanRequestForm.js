import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database, auth } from "../firebase/firebaseService";
import { ref, get, set } from "firebase/database";
import styled from "styled-components";
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Clock, 
  FileText, 
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

// Styled Components
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
`;

const Title = styled.h2`
  color: #3f51b5;
  font-size: 32px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #7f7fd5, #86a8e7, #91eae4);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  color: white;
`;

const HeroTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const TermsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  list-style-type: none;
  padding: 0;
  margin-bottom: 1.5rem;
`;

const TermsItem = styled.li`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 500;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const InfoText = styled.p`
  font-size: 16px;
  opacity: 0.9;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  
  svg {
    vertical-align: middle;
    margin-right: 0.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #3f51b5;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
  
  &:focus {
    border-color: #3f51b5;
    outline: none;
  }
`;

const RepaymentBox = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  border: 1px dashed #ccc;
`;

const RepaymentAmount = styled.h4`
  font-size: 24px;
  color: #2196f3;
  margin: 0;
  
  span {
    font-weight: 700;
  }
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.disabled ? '#ccc' : '#3f51b5'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#303f9f'};
  }
  
  svg {
    vertical-align: middle;
    margin-right: 0.5rem;
  }
`;

const HistorySection = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const HistoryTitle = styled.h3`
  color: #3f51b5;
  font-size: 24px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const LoanCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const LoanCard = styled.div`
  background-color: ${props => {
    switch(props.status.toLowerCase()) {
      case 'approved': return '#e8f5e9';
      case 'rejected': return '#ffebee';
      case 'pending': return '#fff8e1';
      default: return '#f5f5f5';
    }
  }};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const LoanAmount = styled.h4`
  font-size: 20px;
  color: #333;
  margin-top: 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: #3f51b5;
  }
`;

const LoanDetail = styled.p`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  
  svg {
    margin-right: 0.5rem;
    color: #757575;
  }
`;

const LoanStatus = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-top: 1rem;
  
  svg {
    margin-right: 0.5rem;
  }
  
  color: ${props => {
    switch(props.status.toLowerCase()) {
      case 'approved': return '#2e7d32';
      case 'rejected': return '#c62828';
      case 'pending': return '#f57c00';
      default: return '#616161';
    }
  }};
`;

// Main Component
const LoanRequestForm = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  const [loanAmount, setLoanAmount] = useState("");
  const [repaymentPeriod, setRepaymentPeriod] = useState("1");
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [existingLoan, setExistingLoan] = useState(false);
  const [loans, setLoans] = useState([]);

  const interestRates = {
    1: 5,
    3: 10,
    6: 15,
    12: 20,
  };

  useEffect(() => {
    if (!userId) return;

    const loanRef = ref(database, `users/${userId}/loanRequest`);
    const loansRef = ref(database, `users/${userId}/loans`);

    // Fetch existing loan request and past loans
    Promise.all([get(loanRef), get(loansRef)]).then(([loanSnapshot, loansSnapshot]) => {
      const loansData = [];

      // Add pending loan request if it exists
      if (loanSnapshot.exists()) {
        const loanData = loanSnapshot.val();
        loansData.push({ ...loanData, status: "Pending" });
        setExistingLoan(true);
      }

      // Add past loans if they exist
      if (loansSnapshot.exists()) {
        const pastLoans = Object.values(loansSnapshot.val());
        loansData.push(...pastLoans);
      }

      // Update the loans state
      setLoans(loansData);
    });
  }, [userId]);

  useEffect(() => {
    if (loanAmount) {
      const interest = (loanAmount * interestRates[repaymentPeriod]) / 100;
      setTotalRepayment(parseFloat(loanAmount) + interest);
    } else {
      setTotalRepayment(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanAmount, repaymentPeriod]);

  const handleLoanRequest = () => {
    if (!userId || existingLoan) return;

    const loanRef = ref(database, `users/${userId}/loanRequest`);
    const newLoan = {
      amount: parseFloat(loanAmount),
      repaymentPeriod,
      totalRepayment,
      status: "Pending",
      dateRequested: new Date().toISOString(),
    };

    set(loanRef, newLoan)
      .then(() => {
        setExistingLoan(true);
        setLoans((prevLoans) => [newLoan, ...prevLoans]); // Add the new loan to the top of the list
        alert("Loan request submitted successfully!");
        navigate("/dashboard");
      })
      .catch((error) => console.error("Error requesting loan:", error));
  };

  // Function to render status icon
  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'approved': return <CheckCircle size={18} />;
      case 'rejected': return <XCircle size={18} />;
      case 'pending': return <AlertCircle size={18} />;
      default: return null;
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container>
      <Title>Request a Loan</Title>

      <HeroSection>
        <HeroTitle>Loan Terms & Conditions</HeroTitle>
        <TermsList>
          <TermsItem><Calendar size={20} /><strong>1 Month:</strong> 5% interest</TermsItem>
          <TermsItem><Calendar size={20} /><strong>3 Months:</strong> 10% interest</TermsItem>
          <TermsItem><Calendar size={20} /><strong>6 Months:</strong> 15% interest</TermsItem>
          <TermsItem><Calendar size={20} /><strong>12 Months:</strong> 20% interest</TermsItem>
        </TermsList>
        <InfoText>Once approved, your loan amount will be credited to your main account balance.</InfoText>
      </HeroSection>

      <FormContainer>
        <FormGroup>
          <Label><DollarSign size={18} /> Loan Amount (Ksh):</Label>
          <Input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            min="1"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label><Clock size={18} /> Repayment Period:</Label>
          <Select value={repaymentPeriod} onChange={(e) => setRepaymentPeriod(e.target.value)}>
            <option value="1">1 Month</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </Select>
        </FormGroup>

        <RepaymentBox>
          <RepaymentAmount>
            Expected Repayment: <span>Ksh {totalRepayment.toFixed(2)}</span>
          </RepaymentAmount>
        </RepaymentBox>

        <SubmitButton onClick={handleLoanRequest} disabled={existingLoan}>
          <CreditCard size={18} />
          {existingLoan ? "Loan Request Pending" : "Request Loan from Bank"}
        </SubmitButton>
      </FormContainer>

      {/* Loan History Section */}
      <HistorySection>
        <HistoryTitle><FileText size={24} /> Loan History</HistoryTitle>
        {loans.length === 0 ? (
          <InfoText>No past loans found.</InfoText>
        ) : (
          <LoanCards>
            {loans.map((loan, index) => (
              <LoanCard key={index} status={loan.status}>
                <LoanAmount><DollarSign size={20} /> Ksh {loan.amount}</LoanAmount>
                <LoanDetail><Calendar size={16} /> Repayment Period: {loan.repaymentPeriod} Months</LoanDetail>
                {loan.dateRequested && (
                  <LoanDetail><Clock size={16} /> Requested: {formatDate(loan.dateRequested)}</LoanDetail>
                )}
                <LoanStatus status={loan.status}>
                  {getStatusIcon(loan.status)} Status: {loan.status}
                </LoanStatus>
              </LoanCard>
            ))}
          </LoanCards>
        )}
      </HistorySection>
    </Container>
  );
};

export default LoanRequestForm;