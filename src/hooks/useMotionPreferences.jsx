import { createContext, useContext, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const MotionPreferences = createContext(null);

export function MotionPreferencesProvider({ children }) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.motionPaused = String(paused || !!reduced);
    return () => {
      delete document.documentElement.dataset.motionPaused;
    };
  }, [paused, reduced]);
  return (
    <MotionPreferences.Provider
      value={{
        reduced,
        paused,
        stopMotion: paused || !!reduced,
        togglePaused: () => setPaused((value) => !value),
      }}
    >
      {children}
    </MotionPreferences.Provider>
  );
}

export function useMotionPreferences() {
  return useContext(MotionPreferences);
}
