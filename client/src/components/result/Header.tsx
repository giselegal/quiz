
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="result-header">
      <h2>Result Header</h2>
      <p>Component placeholder - implement as needed</p>
      {user && <p>User: {user.userName}</p>}
    </div>
  );
};

export default Header;
