import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ProfileForm() {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('owner');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user and load profile if it exists
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFullName(data.full_name || '');
        setRole(data.role || 'owner');
        setCompany(data.company_name || '');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        role,
        company_name: company,
      });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('✅ Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Complete Your Profile</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <label>Role</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="owner">Owner</option>
        <option value="cleaner">Cleaner</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Save Profile</button>
      <p>{message}</p>
    </form>
  );
}
