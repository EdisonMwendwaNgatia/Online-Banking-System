import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database, auth } from "../firebase/firebaseService";
import { ref, get, set, update } from "firebase/database";
import styled from "styled-components";
import { CreditCard, ChevronLeft, Check, Clock, Shield, Zap, Gift, Award } from "lucide-react";

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  color: #333;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const Balance = styled.div`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

const BalanceAmount = styled.span`
  font-weight: 600;
  color: #1e40af;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const CardBox = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.isRequested && `
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.7);
      z-index: 1;
    }
  `}
`;

const CardHeader = styled.div`
  background: ${props => {
    switch(props.type) {
      case 'Bronze': return 'linear-gradient(135deg, #CD7F32, #A0522D)';
      case 'Silver': return 'linear-gradient(135deg, #C0C0C0, #A9A9A9)';
      case 'Gold': return 'linear-gradient(135deg, #FFD700, #DAA520)';
      case 'Platinum': return 'linear-gradient(135deg, #E5E4E2, #8A9A9A)';
      default: return 'linear-gradient(135deg, #4F46E5, #818CF8)';
    }
  }};
  padding: 1.5rem;
  position: relative;
  height: 100px;
  display: flex;
  align-items: flex-end;
`;

const CardTypeLabel = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const CardIcon = styled.div`
  position: absolute;
  bottom: -1.5rem;
  left: 1.5rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardContent = styled.div`
  padding: 2rem 1.5rem 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  color: #1f2937;
`;

const CardPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 1rem;
`;

const PerksList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
`;

const PerkItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  
  &:before {
    content: '•';
    color: #1e40af;
  }
`;

const RequestButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  background-color: ${props => props.disabled ? '#9ca3af' : '#1e40af'};
  border: none;
  border-radius: 0.5rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.disabled ? '#9ca3af' : '#1e3a8a'};
  }
`;

const RequestedCardsSection = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RequestedCardsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const RequestedCardItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const RequestedCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const RequestedCardIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => {
    switch(props.type) {
      case 'Bronze': return '#CD7F32';
      case 'Silver': return '#C0C0C0';
      case 'Gold': return '#FFD700';
      case 'Platinum': return '#E5E4E2';
      default: return '#4F46E5';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const RequestedCardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
`;

const RequestedCardDetails = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StatusLabel = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
  background-color: ${props => {
    switch(props.status) {
      case 'Approved': return '#ecfdf5';
      case 'Rejected': return '#fef2f2';
      default: return '#eff6ff';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'Approved': return '#059669';
      case 'Rejected': return '#dc2626';
      default: return '#1e40af';
    }
  }};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e5e7eb;
  }
`;

const BankCardRequestForm = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  const [mainBalance, setMainBalance] = useState(0);
  const [requestedCards, setRequestedCards] = useState([]);

  // Card options with additional info
  const cards = [
    { 
      type: "Bronze", 
      price: 500, 
      icon: <Shield size={24} />,
      perks: ["Basic fraud protection", "ATM withdrawals up to Ksh 50,000/day", "24/7 customer support"]
    },
    { 
      type: "Silver", 
      price: 1000, 
      icon: <Zap size={24} />,
      perks: ["Enhanced fraud protection", "ATM withdrawals up to Ksh 100,000/day", "Purchase protection", "Travel insurance"]
    },
    { 
      type: "Gold", 
      price: 2000, 
      icon: <Gift size={24} />,
      perks: ["Premium fraud protection", "ATM withdrawals up to Ksh 200,000/day", "Extended warranty", "Cashback rewards", "Priority customer service"]
    },
    { 
      type: "Platinum", 
      price: 5000, 
      icon: <Award size={24} />,
      perks: ["Ultimate fraud protection", "Unlimited ATM withdrawals", "Exclusive concierge service", "Premium travel insurance", "Airport lounge access", "Elite cashback rewards"]
    },
  ];

  useEffect(() => {
    if (!userId) return;

    // Fetch user balance and existing card requests
    const userRef = ref(database, `users/${userId}`);
    const cardRequestsRef = ref(database, `users/${userId}/cardRequests`);

    Promise.all([get(userRef), get(cardRequestsRef)]).then(([userSnapshot, cardRequestsSnapshot]) => {
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        setMainBalance(userData.mainBalance || 0);
      }

      if (cardRequestsSnapshot.exists()) {
        const cardRequestsData = Object.values(cardRequestsSnapshot.val());
        setRequestedCards(cardRequestsData);
      }
    });
  }, [userId]);

  const handleCardRequest = (cardType, price) => {
    if (!userId || requestedCards.some((card) => card.cardType === cardType)) return;
    if (mainBalance < price) {
      alert("Insufficient balance to request this card.");
      return;
    }

    const newBalance = mainBalance - price;
    const cardRequestRef = ref(database, `users/${userId}/cardRequests/${cardType}`);
    const userBalanceRef = ref(database, `users/${userId}`);

    const newCardRequest = {
      cardType,
      price,
      status: "Pending",
      dateRequested: new Date().toISOString(),
    };

    // Store card request and update balance
    set(cardRequestRef, newCardRequest)
      .then(() => {
        update(userBalanceRef, { mainBalance: newBalance });
        setMainBalance(newBalance);
        setRequestedCards((prevCards) => [...prevCards, newCardRequest]);
        alert(`${cardType} card request submitted successfully!`);
      })
      .catch((error) => console.error("Error requesting card:", error));
  };

  return (
    <PageContainer>
      <Header>
        <PageTitle>
          <CreditCard size={28} />
          Request a Bank Card
        </PageTitle>
        <Balance>Current Balance: <BalanceAmount>Ksh {mainBalance.toFixed(2)}</BalanceAmount></Balance>
      </Header>

      <CardsGrid>
        {cards.map((card) => {
          const isRequested = requestedCards.some((requestedCard) => requestedCard.cardType === card.type);
          
          return (
            <CardBox key={card.type} isRequested={isRequested}>
              <CardHeader type={card.type}>
                <CardTypeLabel>{card.type}</CardTypeLabel>
              </CardHeader>
              <CardIcon>
                {card.icon}
              </CardIcon>
              <CardContent>
                <CardTitle>{card.type} Card</CardTitle>
                <CardPrice>Ksh {card.price.toLocaleString()}</CardPrice>
                <PerksList>
                  {card.perks.map((perk, index) => (
                    <PerkItem key={index}>{perk}</PerkItem>
                  ))}
                </PerksList>
                <RequestButton
                  onClick={() => handleCardRequest(card.type, card.price)}
                  disabled={isRequested}
                >
                  {isRequested ? (
                    <>
                      <Check size={16} />
                      Already Requested
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Request Card
                    </>
                  )}
                </RequestButton>
              </CardContent>
            </CardBox>
          );
        })}
      </CardsGrid>

      <RequestedCardsSection>
        <SectionTitle>
          <Clock size={20} />
          Your Card Requests
        </SectionTitle>
        
        {requestedCards.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>You haven't requested any cards yet.</p>
        ) : (
          <RequestedCardsList>
            {requestedCards.map((card, index) => (
              <RequestedCardItem key={index}>
                <RequestedCardHeader>
                  <RequestedCardIcon type={card.cardType}>
                    <CreditCard size={16} />
                  </RequestedCardIcon>
                  <RequestedCardTitle>{card.cardType} Card</RequestedCardTitle>
                </RequestedCardHeader>
                <RequestedCardDetails>
                  <div>Price: Ksh {card.price.toLocaleString()}</div>
                  <div>Requested on: {new Date(card.dateRequested).toLocaleDateString()}</div>
                  <StatusLabel status={card.status}>
                    {card.status === 'Pending' ? <Clock size={12} /> : card.status === 'Approved' ? <Check size={12} /> : null}
                    {' '}
                    {card.status}
                  </StatusLabel>
                </RequestedCardDetails>
              </RequestedCardItem>
            ))}
          </RequestedCardsList>
        )}
      </RequestedCardsSection>

      <BackButton onClick={() => navigate("/dashboard")}>
        <ChevronLeft size={16} />
        Back to Dashboard
      </BackButton>
    </PageContainer>
  );
};

export default BankCardRequestForm;