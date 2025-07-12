
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { ApiSettings, Page, AppContextType } from '../types';
import { OPEN_ROUTER_MODELS } from '../constants';

const defaultApiSettings: ApiSettings = {
  geminiApiKey: '',
  openRouterApiKey: '',
  service: 'gemini',
  openRouterModel: OPEN_ROUTER_MODELS[0],
};

export const AppContext = createContext<AppContextType>({
  apiSettings: defaultApiSettings,
  setApiSettings: () => {},
  isApiConfigured: false,
  currentPage: 'introduction',
  setCurrentPage: () => {},
});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiSettings, setApiSettingsState] = useState<ApiSettings>(defaultApiSettings);
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('introduction');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
        const storedSettings = localStorage.getItem('mlLabApiSettings');
        if (storedSettings) {
            const parsedSettings: ApiSettings = JSON.parse(storedSettings);
            setApiSettingsState(parsedSettings);
            if ((parsedSettings.service === 'gemini' && parsedSettings.geminiApiKey) || (parsedSettings.service === 'openrouter' && parsedSettings.openRouterApiKey)) {
                setIsApiConfigured(true);
            }
        }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        localStorage.removeItem('mlLabApiSettings');
    }
    setIsLoaded(true);
  }, []);

  const setApiSettings = (settings: ApiSettings) => {
    setApiSettingsState(settings);
    localStorage.setItem('mlLabApiSettings', JSON.stringify(settings));
    if ((settings.service === 'gemini' && settings.geminiApiKey) || (settings.service === 'openrouter' && settings.openRouterApiKey)) {
        setIsApiConfigured(true);
    } else {
        setIsApiConfigured(false);
    }
  };

  const contextValue = useMemo(() => ({
    apiSettings,
    setApiSettings,
    isApiConfigured,
    currentPage,
    setCurrentPage,
  }), [apiSettings, isApiConfigured, currentPage]);

  if (!isLoaded) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        </div>
      );
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
