import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email to confirm your account!');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Sign Up</button>
      <p>{message}</p>
    </form>
  );
}
