// context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('/api/name');
        const data = await response.json();
        if (data.userName) {
          setUserName(data.userName);
        }
      } catch (error) {
        console.error('Failed to fetch user name:', error);
      }
    };
    fetchUserName();
  }, []);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
