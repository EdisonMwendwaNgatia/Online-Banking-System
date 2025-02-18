import React, { useState, useEffect } from "react";
import { database } from "../firebase/firebaseService";
import { ref, get, update, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./AdminDashboard.css";


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [cardRequests, setCardRequests] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [expandedUser, setExpandedUser] = useState(null);

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

  return (
    <div className="admin-dashboard">
      <header>
        <nav>
          <button onClick={() => setActiveTab("users")}>Users</button>
          <button onClick={() => setActiveTab("cardRequests")}>Card Requests</button>
          <button onClick={() => setActiveTab("loanRequests")}>Loan Requests</button>
        </nav>
      </header>

      {activeTab === "users" && (
        <div className="user-management">
          <h2>Users</h2>
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <h3>{user.name} (ID: {user.id})</h3>
              <p>Email: {auth.currentUser?.email || "Email not found"}</p>
              <button onClick={() => fetchTransactions(user.id)}>
                {expandedUser === user.id ? "Hide Transactions" : "View Transactions"}
              </button>
              {expandedUser === user.id && (
                <ul>
                  {transactions[user.id]?.length > 0 ? (
                    transactions[user.id].map((transaction, index) => (
                      <li key={index}>{transaction.description} - ${transaction.amount}</li>
                    ))
                  ) : (
                    <p>No transactions found.</p>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "cardRequests" && (
        <div className="card-requests">
          <h2>Card Requests</h2>
          {cardRequests.length > 0 ? (
            cardRequests.map((request, index) => (
              <div key={index} className="card-request">
                <h3>{request.cardType} Card</h3>
                <p>Requested by: {request.userId}</p>
                <button onClick={() => approveCardRequest(request.userId, request.cardType)}>Approve</button>
                <button onClick={() => rejectCardRequest(request.userId, request.cardType)}>Reject</button>
              </div>
            ))
          ) : (
            <p>No card requests found.</p>
          )}
        </div>
      )}

      {activeTab === "loanRequests" && (
        <div className="loan-requests">
          <h2>Loan Requests</h2>
          {loanRequests.length > 0 ? (
            loanRequests.map((loan, index) => (
              <div key={index} className="loan-request">
                <h3>Loan Amount: ${loan.amount}</h3>
                <p>Requested by: {loan.userId}</p>
                <p>Repayment Period: {loan.repaymentPeriod} Months</p>
                <p>Status: {loan.status}</p>
                <button onClick={() => approveLoanRequest(loan.userId, loan)}>Approve</button>
                <button onClick={() => rejectLoanRequest(loan.userId)}>Reject</button>
              </div>
            ))
          ) : (
            <p>No loan requests found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;