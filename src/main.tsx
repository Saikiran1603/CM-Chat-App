import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { AppDataProvider } from '@/context/AppDataContext';
import { UIProvider } from '@/context/UIContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <AppDataProvider>
            <UIProvider>
              <App />
            </UIProvider>
          </AppDataProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
