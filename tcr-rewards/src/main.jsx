// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RewardsProvider } from './context/RewardsContext';
import { StoreSettingsProvider } from './context/StoreSettingContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StoreSettingsProvider>
        <RewardsProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </RewardsProvider>
        </StoreSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
