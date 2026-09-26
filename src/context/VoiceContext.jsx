import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useLanguage } from './LanguageContext';

const VoiceContext = createContext();

const langCodes = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

export function VoiceProvider({ children }) {
  const [enabled, setEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const { lang } = useLanguage();

  const speak = useCallback((text) => {
    if (!enabled || !text) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCodes[lang] || 'en-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synthRef.current.speak(utterance);
  }, [enabled, lang]);

  const stop = useCallback(() => {
    synthRef.current.cancel();
    setSpeaking(false);
  }, []);

  const toggle = useCallback(() => {
    if (enabled) {
      stop();
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, [enabled, stop]);

  return (
    <VoiceContext.Provider value={{ enabled, speaking, speak, stop, toggle }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error('useVoice must be inside VoiceProvider');
  return ctx;
}
