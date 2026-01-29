import React, { useState, useEffect } from 'react';
import { ref, update, get, runTransaction } from "firebase/database";
import { db, auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function TopUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const addCredits = async (amount) => {
    if (!user) {
      alert("Auth not ready yet");
      return;
    }

    setLoading(true);

    try {
      const userRef = ref(db, `users/${user.uid}/walletBalance`);

      await runTransaction(userRef, (currentBalance) => {
        return (currentBalance || 0) + amount;
      });

      alert(`Rp ${amount.toLocaleString()} added to your Solar Wallet!`);
      navigate("/invest");

    } catch (e) {
      console.error("TopUp error:", e);
      alert(e.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <h3>Recharge Solar Wallet</h3>
      <p>Select an amount to add (Demo Mode)</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <button className="btn" onClick={() => addCredits(500000)} disabled={loading || !user}>+ 500k</button>
        <button className="btn" onClick={() => addCredits(1000000)} disabled={loading || !user}>+ 1M</button>
        <button className="btn" onClick={() => addCredits(5000000)} disabled={loading || !user}>+ 5M</button>
      </div>
      <p style={{marginTop: '20px', fontSize: '0.8rem', color: '#888'}}>
        * In the future, these buttons will open a Payment Gateway (Stripe/Razorpay).
      </p>
    </div>
  );
}