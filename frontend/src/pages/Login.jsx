import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: We now import loginUser and registerUser instead of signInWithGoogle
import { loginUser, registerUser } from '../firebase'; 
import '../App.css';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    let user;
    
    if (isRegistering) {
      user = await registerUser(email, password);
    } else {
      user = await loginUser(email, password);
    }

    if (user) {
      navigate('/home');
    } else {
      setError("Authentication failed. Please check your details.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">⚡ PowerWestJava</h1>
        <p className="login-subtitle">
          {isRegistering ? "Create an Account" : "Welcome Back"}
        </p>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border rounded"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 border rounded"
          />

          <button className="btn" type="submit">
            {isRegistering ? "Sign Up" : "Log In"}
          </button>
        </form>

        {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}

        <p style={{marginTop: '20px', fontSize: '0.9rem'}}>
          {isRegistering ? "Already have an account?" : "No account yet?"} 
          <span 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{color: '#2e7d32', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px'}}
          >
            {isRegistering ? "Log In" : "Sign Up"}
          </span>
        </p>
        <p className="login-skip">
          Just browsing? <span onClick={() => navigate('/home')}>Go to Home</span>
        </p>
      </div>
    </div>
  );
}