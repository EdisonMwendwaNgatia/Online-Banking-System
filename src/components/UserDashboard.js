import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database, auth } from "../firebase/firebaseService";
import { ref, get, set, push } from "firebase/database";
import styled from "styled-components";
import { CreditCard, DollarSign, PiggyBank, Clock, ChevronRight, User, LogOut } from "lucide-react";

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  color: #333;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e40af;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    color: #1e40af;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
`;

const BalanceCard = styled(Card)`
  background-color: #1e40af;
  color: white;
`;

const BalanceTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  opacity: 0.7;
`;

const Balance = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const AccountsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const AccountCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const AccountHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AccountIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background-color: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e40af;
`;

const AccountTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const AccountBalance = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  background-color: #e0e7ff;
  color: #1e40af;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #c7d2fe;
  }
`;

const InputSection = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const StyledInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  flex-grow: 1;
  
  &:focus {
    outline: none;
    border-color: #1e40af;
    box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.2);
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const BankCardSection = styled(Card)`
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #1e3a8a, #1e40af);
  color: white;
`;

const CardDetails = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
`;

const CardNumber = styled.div`
  letter-spacing: 0.2rem;
  font-family: monospace;
  margin-bottom: 1rem;
`;

const CardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
`;

const TransactionsSection = styled(Card)`
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TransactionsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TransactionIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e40af;
`;

const TransactionDetails = styled.div``;

const TransactionType = styled.div`
  font-weight: 600;
  color: #374151;
`;

const TransactionDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const TransactionAmount = styled.div`
  font-weight: 600;
  color: ${props => props.type === 'Deposit' || props.type === 'Withdraw from Savings' ? '#047857' : '#b91c1c'};
`;

const SidebarCard = styled(Card)`
  margin-bottom: 1rem;
`;

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  const [mainBalance, setMainBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [hasCard, setHasCard] = useState(false);
  const [amount, setAmount] = useState("");

  // Fetch user balances and transactions from Firebase
  useEffect(() => {
    if (!userId) return;

    const userRef = ref(database, `users/${userId}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setMainBalance(data.mainBalance || 0);
        setSavingsBalance(data.savingsBalance || 0);
        setTransactions(data.transactions ? Object.values(data.transactions) : []);
        setHasCard(data.hasCard || false);
      }
    });
  }, [userId]);

  // Update Firebase balances and add transaction
  const updateBalance = async (main, savings, type, amount) => {
    if (!userId) return;

    const userRef = ref(database, `users/${userId}`);
    const transactionRef = push(ref(database, `users/${userId}/transactions`));

    const newTransaction = { type, amount, date: new Date().toISOString() };

    await set(userRef, {
      mainBalance: main,
      savingsBalance: savings,
      hasCard,
      transactions: {
        ...transactions.reduce((acc, txn, i) => ({ ...acc, [`txn${i}`]: txn }), {}),
        [transactionRef.key]: newTransaction,
      },
    });

    setMainBalance(main);
    setSavingsBalance(savings);
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const handleDeposit = () => {
    if (!amount || isNaN(amount) || amount <= 0) return alert("Please enter a valid amount.");
    updateBalance(mainBalance + parseFloat(amount), savingsBalance, "Deposit", amount);
    setAmount("");
  };

  const handleWithdraw = () => {
    if (!amount || isNaN(amount) || amount <= 0) return alert("Please enter a valid amount.");
    if (amount > mainBalance) return alert("Insufficient funds");
    updateBalance(mainBalance - parseFloat(amount), savingsBalance, "Withdraw", amount);
    setAmount("");
  };

  const sendToSavings = () => {
    if (!amount || isNaN(amount) || amount <= 0) return alert("Please enter a valid amount.");
    if (amount > mainBalance) return alert("Insufficient funds");
    updateBalance(mainBalance - parseFloat(amount), savingsBalance + parseFloat(amount), "Transfer to Savings", amount);
    setAmount("");
  };

  const withdrawFromSavings = () => {
    if (!amount || isNaN(amount) || amount <= 0) return alert("Please enter a valid amount.");
    if (amount > savingsBalance) return alert("Insufficient funds");
    updateBalance(mainBalance + parseFloat(amount), savingsBalance - parseFloat(amount), "Withdraw from Savings", amount);
    setAmount("");
  };

  // Calculate total balance
  const totalBalance = mainBalance + savingsBalance;
  
  // Get the most recent transactions
  const recentTransactions = [...transactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  ).slice(0, 5);

  return (
    <DashboardContainer>
      <Header>
        <Logo>
          {/* This is a placeholder for your bank logo */}
          <div style={{ width: '40px', height: '40px', backgroundColor: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} color="#1e40af" />
          </div>
          Simple Bank
        </Logo>
        <UserMenu>
          <UserAvatar>
            <User size={20} />
          </UserAvatar>
          <span>{user?.email || 'User'}</span>
          <LogoutButton onClick={() => auth.signOut()}>
            <LogOut size={16} />
            Logout
          </LogoutButton>
        </UserMenu>
      </Header>

      <Grid>
        <div>
          <BalanceCard>
            <BalanceTitle>Total Balance</BalanceTitle>
            <Balance>${totalBalance.toFixed(2)}</Balance>
            <InputSection>
              <StyledInput
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <ActionButton onClick={handleDeposit}>
                <DollarSign size={16} />
                Deposit
              </ActionButton>
            </InputSection>
          </BalanceCard>

          <AccountsContainer>
            <AccountCard>
              <AccountHeader>
                <AccountIcon>
                  <DollarSign size={20} />
                </AccountIcon>
              </AccountHeader>
              <AccountTitle>Main Account</AccountTitle>
              <AccountBalance>${mainBalance.toFixed(2)}</AccountBalance>
              <ActionButtons>
                <ActionButton onClick={handleWithdraw}>
                  Withdraw
                </ActionButton>
                <ActionButton onClick={sendToSavings}>
                  To Savings
                </ActionButton>
              </ActionButtons>
            </AccountCard>

            <AccountCard>
              <AccountHeader>
                <AccountIcon>
                  <PiggyBank size={20} />
                </AccountIcon>
              </AccountHeader>
              <AccountTitle>Savings Account</AccountTitle>
              <AccountBalance>${savingsBalance.toFixed(2)}</AccountBalance>
              <ActionButton onClick={withdrawFromSavings}>
                Withdraw from Savings
              </ActionButton>
            </AccountCard>
          </AccountsContainer>

          {hasCard && (
            <BankCardSection>
              <SectionTitle>
                <CreditCard size={20} />
                Your Bank Card
              </SectionTitle>
              <CardDetails>
                <CardNumber>**** **** **** 1234</CardNumber>
                <CardInfo>
                  <div>CARD HOLDER<br />John Doe</div>
                  <div>EXPIRES<br />12/25</div>
                </CardInfo>
              </CardDetails>
            </BankCardSection>
          )}
        </div>

        <div>
          <SidebarCard>
            <SectionTitle>Quick Actions</SectionTitle>
            <ActionButton 
              style={{ width: '100%', marginBottom: '0.5rem' }} 
              onClick={() => navigate("/loan-request")}
            >
              Request Loan
              <ChevronRight size={16} />
            </ActionButton>

            {!hasCard && (
              <ActionButton 
                style={{ width: '100%' }} 
                onClick={() => navigate("/request-card")}
              >
                Request Card
                <ChevronRight size={16} />
              </ActionButton>
            )}
          </SidebarCard>
          
          <SidebarCard>
            <SectionTitle>Tips & Insights</SectionTitle>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Saving just $50 per week can add up to $2,600 in a year!
            </p>
            <ActionButton style={{ width: '100%' }}>
              View All Tips
              <ChevronRight size={16} />
            </ActionButton>
          </SidebarCard>
        </div>
      </Grid>
      
      <TransactionsSection>
        <SectionTitle>
          <Clock size={20} />
          Recent Transactions
        </SectionTitle>
        <TransactionsList>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((txn, index) => (
              <TransactionItem key={index}>
                <TransactionInfo>
                  <TransactionIcon>
                    {txn.type.includes('Deposit') ? <DollarSign size={16} /> : 
                     txn.type.includes('Savings') ? <PiggyBank size={16} /> : 
                     <CreditCard size={16} />}
                  </TransactionIcon>
                  <TransactionDetails>
                    <TransactionType>{txn.type}</TransactionType>
                    <TransactionDate>{txn.date.split("T")[0]}</TransactionDate>
                  </TransactionDetails>
                </TransactionInfo>
                <TransactionAmount type={txn.type}>
                  {txn.type.includes('Deposit') || txn.type.includes('Withdraw from Savings') ? 
                   '+' : '-'}${txn.amount}
                </TransactionAmount>
              </TransactionItem>
            ))
          ) : (
            <p style={{ color: '#6b7280' }}>No transactions yet.</p>
          )}
        </TransactionsList>
        {transactions.length > 5 && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <ActionButton onClick={() => {}}>
              View All Transactions
              <ChevronRight size={16} />
            </ActionButton>
          </div>
        )}
      </TransactionsSection>
    </DashboardContainer>
  );
};

export default UserDashboard;