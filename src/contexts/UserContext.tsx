import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  location: string;
  language: string;
}

interface UserContextType {
  user: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setUser: (user: UserProfile) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: UserProfile = {
  id: '1',
  name: 'Climate User',
  email: 'user@climate.com',
  phone: '+1-555-0123',
  location: 'New York, USA',
  language: 'english'
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserProfile | null>(defaultUser);
  const [language, setLanguage] = useState('english');

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      setUserState({ ...user, ...updates });
    }
  };

  const setUser = (newUser: UserProfile) => {
    setUserState(newUser);
  };

  return (
    <UserContext.Provider value={{
      user,
      updateProfile,
      setUser,
      language,
      setLanguage
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};