import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, get, set, child, update } from "firebase/database"; 
import { db, auth } from '../firebase';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Function to generate and download the .txt receipt
  const generateBill = (transactionId) => {
    const billContent = `
      POWERTRACK INVESTMENT RECEIPT
      -------------------------------
      Transaction ID: ${transactionId}
      Project: ${state.projectName}
      Amount: Rp ${state.amount.toLocaleString()}
      Date: ${new Date().toLocaleString()}
      Investor: ${auth.currentUser.email}
      -------------------------------
      Thank you for investing in West Java's Green Future!
    `;
    
    const element = document.createElement("a");
    const file = new Blob([billContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Receipt_${state.projectName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (auth.currentUser) {
        try {
          const dbRef = ref(db);
          const snapshot = await get(child(dbRef, `users/${auth.currentUser.uid}`));
          
          if (snapshot.exists()) {
            setWalletBalance(snapshot.val().walletBalance || 0);
          } else {
            const initialData = {
              email: auth.currentUser.email,
              walletBalance: 600000
            };
            await set(ref(db, `users/${auth.currentUser.uid}`), initialData);
            setWalletBalance(600000);
          }
        } catch (error) {
          console.error("Error fetching wallet:", error);
        }
      }
      setLoading(false);
    };
    fetchBalance();
  }, []);

  const handlePayment = async () => {
    if (walletBalance < state.amount) {
      alert("Insufficient Balance in Solar Wallet!");
      navigate('/topup');
      return;
    }

    setIsProcessing(true);
    // Unique ID for the receipt and database record
    const transactionId = "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    try {
      const newBalance = walletBalance - state.amount;
      const updates = {};
      updates[`/users/${auth.currentUser.uid}/walletBalance`] = newBalance;
      
      // Save the transaction in history
      updates[`/users/${auth.currentUser.uid}/investments/${transactionId}`] = {
        projectName: state.projectName,
        amount: state.amount,
        date: new Date().toISOString(),
        transactionId: transactionId
      };
      
      await update(ref(db), updates);

      // 1. Download the Bill
      generateBill(transactionId);

      // 2. Redirect to show the success popup
      setTimeout(() => {
  navigate('/receipt', { 
    state: { 
      transactionId: transactionId,
      projectName: state.projectName,
      amount: state.amount,
      date: new Date().toLocaleString(),
      userEmail: auth.currentUser.email
    } 
  });
}, 1500);

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please check your connection.");
      setIsProcessing(false);
    }
  };

  if (loading) return <p style={{textAlign:'center', marginTop:'50px'}}>Checking Wallet...</p>;
  if (!state) return <div style={{padding: '50px', textAlign: 'center'}}>No investment data found.</div>;

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Secure Checkout</h2>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', maxWidth: '400px', margin: 'auto' }}>
        <p><strong>Project:</strong> {state.projectName}</p>
        <p><strong>Cost:</strong> Rp {state.amount.toLocaleString()}</p>
        <hr />
        <p><strong>Your Balance:</strong> Rp {walletBalance.toLocaleString()}</p>
        
        {walletBalance < state.amount && (
          <div style={{color: 'red', marginBottom: '15px'}}>
            ⚠️ Insufficient funds for this community project.
          </div>
        )}

        <button 
          className="btn" 
          onClick={handlePayment} 
          disabled={isProcessing}
          style={{ 
            width: '100%', 
            background: walletBalance < state.amount ? '#666' : '#2e7d32',
            color: 'white',
            cursor: isProcessing ? 'wait' : 'pointer',
            padding: '12px',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          {walletBalance < state.amount ? 'Top Up Wallet' : (isProcessing ? 'Processing Transaction...' : 'Confirm & Generate Bill')}
        </button>
      </div>
    </div>
  );
}