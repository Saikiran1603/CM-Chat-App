import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ContactsProvider } from '@/context/ContactsContext';
import { AppDataProvider } from '@/context/AppDataContext';
import { UIProvider } from '@/context/UIContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <ContactsProvider>
            <AppDataProvider>
              <UIProvider>
                <App />
              </UIProvider>
            </AppDataProvider>
          </ContactsProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
