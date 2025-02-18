import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebaseService";
import { ref, get, update, remove } from "firebase/database";
import { getAuth } from "firebase/auth";

// Icons
import { 
  Users, CreditCard, DollarSign, User, Mail, Eye, EyeOff, 
  Check, X, AlertCircle, ArrowRight, ArrowDown, Briefcase, 
  Calendar, Activity,ArrowUp, RefreshCw
} from "react-feather";

// Theme Colors
const theme = {
  primary: "#6366F1", // Indigo
  primaryLight: "#818CF8",
  primaryDark: "#4F46E5",
  secondary: "#0EA5E9", // Sky
  accent: "#F59E0B", // Amber
  success: "#10B981", // Emerald
  danger: "#EF4444", // Red
  warning: "#F59E0B", // Amber
  info: "#3B82F6", // Blue
  light: "#F9FAFB",
  dark: "#1F2937",
  gray: "#6B7280",
};

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
  background-color: #F1F5F9;
  min-height: 100vh;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const HeaderTitle = styled.h1`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const NavBar = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const NavButton = styled.button`
  background-color: ${props => props.active ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.2)"};
  color: ${props => props.active ? theme.primary : "white"};
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.active ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.3)"};
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h2`
  color: ${theme.dark};
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${theme.primaryLight}80;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const UserCard = styled(Card)`
  border-top: 4px solid ${theme.primary};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, ${theme.primaryLight}10, ${theme.primaryLight}30);
    border-radius: 0 0 0 100%;
    z-index: 0;
  }
`;

const CardRequestCard = styled(Card)`
  border-top: 4px solid ${theme.accent};
  background: linear-gradient(to right, white, #FEF9C3, white);
`;

const LoanRequestCard = styled(Card)`
  border-top: 4px solid ${theme.success};
  background: linear-gradient(to right, white, #DCFCE7, white);
`;

const CardTitle = styled.h3`
  color: ${theme.dark};
  margin-top: 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
`;

const InfoText = styled.p`
  color: ${theme.gray};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${props => 
    props.type === "success" ? `${theme.success}20` : 
    props.type === "warning" ? `${theme.warning}20` : 
    props.type === "danger" ? `${theme.danger}20` : 
    `${theme.info}20`};
  color: ${props => 
    props.type === "success" ? theme.success : 
    props.type === "warning" ? theme.warning : 
    props.type === "danger" ? theme.danger : 
    theme.info};
  margin-left: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => 
    props.primary ? `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` : 
    props.success ? `linear-gradient(135deg, ${theme.success}, ${theme.success}DD)` : 
    props.danger ? `linear-gradient(135deg, ${theme.danger}, ${theme.danger}DD)` : 
    `linear-gradient(135deg, ${theme.gray}, ${theme.gray}DD)`};
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin-right: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  position: relative;
  z-index: 1;
`;

const TransactionList = styled.div`
  margin-top: 1.5rem;
  background-color: #F8FAFC;
  border-radius: 0.5rem;
  border: 1px solid #E2E8F0;
  overflow: hidden;
`;

const TransactionHeader = styled.div`
  background-color: ${theme.primaryLight}20;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: ${theme.dark};
  display: flex;
  justify-content: space-between;
`;

const TransactionItem = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #F1F5F9;
  }
`;

const TransactionAmount = styled.span`
  font-weight: 500;
  color: ${props => props.amount > 0 ? theme.success : theme.danger};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const TransactionDescription = styled.span`
  color: ${theme.dark};
  font-weight: 500;
`;

const EmptyMessage = styled.div`
  color: ${theme.gray};
  font-style: italic;
  text-align: center;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background-color: #F8FAFC;
  border-radius: 0.5rem;
  border: 1px dashed #E2E8F0;
`;

const LoadingSpinner = styled(RefreshCw)`
  animation: spin 2s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [cardRequests, setCardRequests] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [expandedUser, setExpandedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const usersRef = ref(database, "users");
    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        setUsers(
          Object.entries(usersData).map(([id, data]) => ({ id, ...data }))
        );
      }
      setLoading(false);
    });

    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        let allCardRequests = [];
        let allLoanRequests = [];
        Object.entries(usersData).forEach(([userId, userData]) => {
          if (userData.cardRequests) {
            Object.entries(userData.cardRequests).forEach(([cardType, request]) => {
              allCardRequests.push({ userId, cardType, ...request });
            });
          }
          if (userData.loanRequest) {
            allLoanRequests.push({ userId, ...userData.loanRequest });
          }
        });
        setCardRequests(allCardRequests);
        setLoanRequests(allLoanRequests);
      }
    });
  }, []);

  const fetchTransactions = (userId) => {
    if (transactions[userId]) {
      setExpandedUser(expandedUser === userId ? null : userId);
      return;
    }

    const transactionsRef = ref(database, `users/${userId}/transactions`);
    get(transactionsRef).then((snapshot) => {
      if (snapshot.exists()) {
        setTransactions((prev) => ({ ...prev, [userId]: Object.values(snapshot.val()) }));
      } else {
        setTransactions((prev) => ({ ...prev, [userId]: [] }));
      }
      setExpandedUser(userId);
    });
  };

  const approveCardRequest = (userId, cardType) => {
    const cardRef = ref(database, `users/${userId}/cardRequests/${cardType}`);
    update(cardRef, { status: "Approved" }).then(() => {
      setCardRequests((prev) => prev.filter(req => !(req.userId === userId && req.cardType === cardType)));
    });
  };

  const rejectCardRequest = (userId, cardType) => {
    const cardRef = ref(database, `users/${userId}/cardRequests/${cardType}`);
    remove(cardRef).then(() => {
      setCardRequests((prev) => prev.filter(req => !(req.userId === userId && req.cardType === cardType)));
    });
  };

  const approveLoanRequest = (userId, loan) => {
    const loanRef = ref(database, `users/${userId}/loanRequest`);
    update(loanRef, { status: "Approved" }).then(() => {
      setLoanRequests((prev) => prev.filter(req => req.userId !== userId));
    });
  };

  const rejectLoanRequest = (userId) => {
    const loanRef = ref(database, `users/${userId}/loanRequest`);
    remove(loanRef).then(() => {
      setLoanRequests((prev) => prev.filter(req => req.userId !== userId));
    });
  };

  const getCardTypeBadge = (cardType) => {
    switch(cardType.toLowerCase()) {
      case "gold":
        return <Badge type="warning">{cardType}</Badge>;
      case "platinum":
        return <Badge type="info">{cardType}</Badge>;
      case "black":
        return <Badge type="dark">{cardType}</Badge>;
      default:
        return <Badge>{cardType}</Badge>;
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <HeaderTitle>
          <Briefcase size={24} />
          Banking Admin Dashboard
        </HeaderTitle>
        <NavBar>
          <NavButton active={activeTab === "users"} onClick={() => setActiveTab("users")}>
            <Users size={16} />
            Users
          </NavButton>
          <NavButton active={activeTab === "cardRequests"} onClick={() => setActiveTab("cardRequests")}>
            <CreditCard size={16} />
            Card Requests
          </NavButton>
          <NavButton active={activeTab === "loanRequests"} onClick={() => setActiveTab("loanRequests")}>
            <DollarSign size={16} />
            Loan Requests
          </NavButton>
        </NavBar>
      </Header>

      {loading ? (
        <EmptyMessage>
          <LoadingSpinner size={32} color={theme.primary} />
          <p>Loading data...</p>
        </EmptyMessage>
      ) : (
        <>
          {activeTab === "users" && (
            <div>
              <SectionTitle>
                <Users size={20} />
                Users ({users.length})
              </SectionTitle>
              {users.length > 0 ? (
                users.map((user) => (
                  <UserCard key={user.id}>
                    <CardTitle>
                      <User size={18} />
                      {user.name} 
                      <span style={{ fontSize: '0.8rem', color: theme.gray, marginLeft: '0.5rem' }}>
                        (ID: {user.id})
                      </span>
                    </CardTitle>
                    <InfoText>
                      <Mail size={16} />
                      {auth.currentUser?.email || "Email not found"}
                    </InfoText>
                    <ButtonsContainer>
                      <ActionButton primary onClick={() => fetchTransactions(user.id)}>
                        {expandedUser === user.id ? 
                          <><EyeOff size={16} /> Hide Transactions</> : 
                          <><Eye size={16} /> View Transactions</>
                        }
                      </ActionButton>
                    </ButtonsContainer>
                    {expandedUser === user.id && (
                      <TransactionList>
                        <TransactionHeader>
                          <span>Description</span>
                          <span>Amount</span>
                        </TransactionHeader>
                        {transactions[user.id]?.length > 0 ? (
                          transactions[user.id].map((transaction, index) => (
                            <TransactionItem key={index}>
                              <TransactionDescription>
                                <Activity size={14} style={{ marginRight: '0.5rem' }} />
                                {transaction.description}
                              </TransactionDescription>
                              <TransactionAmount amount={transaction.amount}>
                                {transaction.amount > 0 ? '+' : ''}Ksh{Math.abs(transaction.amount).toFixed(2)}
                                {transaction.amount > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                              </TransactionAmount>
                            </TransactionItem>
                          ))
                        ) : (
                          <EmptyMessage>
                            <AlertCircle size={20} color={theme.gray} />
                            <p>No transactions found.</p>
                          </EmptyMessage>
                        )}
                      </TransactionList>
                    )}
                  </UserCard>
                ))
              ) : (
                <EmptyMessage>
                  <Users size={24} color={theme.gray} />
                  <p>No users found.</p>
                </EmptyMessage>
              )}
            </div>
          )}

          {activeTab === "cardRequests" && (
            <div>
              <SectionTitle>
                <CreditCard size={20} />
                Card Requests ({cardRequests.length})
              </SectionTitle>
              {cardRequests.length > 0 ? (
                cardRequests.map((request, index) => (
                  <CardRequestCard key={index}>
                    <CardTitle>
                      <CreditCard size={18} />
                      {request.cardType} Card
                      {getCardTypeBadge(request.cardType)}
                    </CardTitle>
                    <InfoText>
                      <User size={16} />
                      Requested by: {request.userId}
                    </InfoText>
                    <InfoText>
                      <Calendar size={16} />
                      Requested on: {request.requestDate || 'Not specified'}
                    </InfoText>
                    <ButtonsContainer>
                      <ActionButton success onClick={() => approveCardRequest(request.userId, request.cardType)}>
                        <Check size={16} />
                        Approve
                      </ActionButton>
                      <ActionButton danger onClick={() => rejectCardRequest(request.userId, request.cardType)}>
                        <X size={16} />
                        Reject
                      </ActionButton>
                    </ButtonsContainer>
                  </CardRequestCard>
                ))
              ) : (
                <EmptyMessage>
                  <CreditCard size={24} color={theme.gray} />
                  <p>No card requests found.</p>
                </EmptyMessage>
              )}
            </div>
          )}

          {activeTab === "loanRequests" && (
            <div>
              <SectionTitle>
                <DollarSign size={20} />
                Loan Requests ({loanRequests.length})
              </SectionTitle>
              {loanRequests.length > 0 ? (
                loanRequests.map((loan, index) => (
                  <LoanRequestCard key={index}>
                    <CardTitle>
                      <DollarSign size={18} />
                      Loan Amount: Ksh{loan.amount.toLocaleString()}
                      <Badge type={loan.status === "Pending" ? "warning" : "success"}>
                        {loan.status}
                      </Badge>
                    </CardTitle>
                    <InfoText>
                      <User size={16} />
                      Requested by: {loan.userId}
                    </InfoText>
                    <InfoText>
                      <Calendar size={16} />
                      Repayment Period: {loan.repaymentPeriod} Months
                    </InfoText>
                    <InfoText>
                      <ArrowRight size={16} />
                      Monthly Payment: Ksh{(loan.amount / loan.repaymentPeriod).toFixed(2)}
                    </InfoText>
                    {loan.purpose && (
                      <InfoText>
                        <Briefcase size={16} />
                        Purpose: {loan.purpose}
                      </InfoText>
                    )}
                    <ButtonsContainer>
                      <ActionButton success onClick={() => approveLoanRequest(loan.userId, loan)}>
                        <Check size={16} />
                        Approve
                      </ActionButton>
                      <ActionButton danger onClick={() => rejectLoanRequest(loan.userId)}>
                        <X size={16} />
                        Reject
                      </ActionButton>
                    </ButtonsContainer>
                  </LoanRequestCard>
                ))
              ) : (
                <EmptyMessage>
                  <DollarSign size={24} color={theme.gray} />
                  <p>No loan requests found.</p>
                </EmptyMessage>
              )}
            </div>
          )}
        </>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard;