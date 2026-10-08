import React from 'react';
import { createRoot } from 'react-dom/client';
import { LazyMotion, MotionConfig } from 'motion/react';
import App from './App';
import { MotionPreferencesProvider } from './hooks/useMotionPreferences';
import './styles.css';
import './styles/site-enhancements.css';
import { ThemeProvider } from './hooks/useTheme';
import './styles/themes.css';

const loadMotionFeatures = () => import('./motionFeatures').then((module) => module.default);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LazyMotion features={loadMotionFeatures}>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <MotionPreferencesProvider>
            <App />
          </MotionPreferencesProvider>
        </ThemeProvider>
      </MotionConfig>
    </LazyMotion>
  </React.StrictMode>,
);
