import React, { useState } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function TopUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const addCredits = async (amount) => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        walletBalance: increment(amount)
      });
      alert(`Rp ${amount.toLocaleString()} added to your Solar Wallet!`);
      navigate('/invest');
    } catch (e) {
      alert("Error adding credits");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <h3>Recharge Solar Wallet</h3>
      <p>Select an amount to add (Demo Mode)</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <button className="btn" onClick={() => addCredits(500000)} disabled={loading}>+ 500k</button>
        <button className="btn" onClick={() => addCredits(1000000)} disabled={loading}>+ 1M</button>
        <button className="btn" onClick={() => addCredits(5000000)} disabled={loading}>+ 5M</button>
      </div>
      <p style={{marginTop: '20px', fontSize: '0.8rem', color: '#888'}}>
        * In the future, these buttons will open a Payment Gateway (Stripe/Razorpay).
      </p>
    </div>
  );
}