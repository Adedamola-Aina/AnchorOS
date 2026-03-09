// @ts-nocheck
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TabView } from '../types';

interface AppContextType {
  activeTab: TabView;
  navigateTo: (tab: TabView, params?: Record<string, string | number | undefined>) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabView>(() => {
    const saved = localStorage.getItem('anchor_active_tab');
    return (saved as TabView) || 'dashboard';
  });

  const navigateTo = (tab: TabView, params?: Record<string, string | number | undefined>) => {
    setActiveTab(tab);
    localStorage.setItem('anchor_active_tab', tab);
    // Map internal tab names to routes
    const routeMap: Record<TabView, string> = {
      'dashboard': '/dashboard',
      'commitments': '/commitments',
      'fabric': '/fabric',
      'finance': '/finance',
      'settings': '/settings'
    };

    let path = routeMap[tab];

    // Append query params if present
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        path += `?${queryString}`;
      }
    }

    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      navigateTo
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
