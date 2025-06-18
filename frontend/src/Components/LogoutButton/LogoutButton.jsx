// src/components/Logout/Logout.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSignout } from '../../services/authHandlers';

export default function Logout() {
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      await handleSignout();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <button onClick={onClick}>
      Logout
    </button>
  );
}
