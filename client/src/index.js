import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contextApi/AuthContext';
import { NotificationProvider } from './contextApi/NotificationContext';
import './index.scss';

import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

i18n.init({
  interpolation: { escapeValue: false },
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: require('./locales/en/translation.json'),
    },
    es: {
      translation: require('./locales/es/translation.json'),
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>

        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>

      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
