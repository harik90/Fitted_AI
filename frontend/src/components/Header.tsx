import React, { useState, useRef, useEffect } from 'react';
import type { Language } from '../lib/i18n';
import { CheckIcon } from './Icons';
import { sound } from '../lib/sound';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  currentLang: Language;
  onChangeLang: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  currentLang,
  onChangeLang,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="header-wrapper">
      <header className="header">
      <div className="header__logo">
        <div className="header__logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <span>Fitted AI</span>
      </div>

      <div className="header__actions">
        {/* Theme button */}
        <button
          className="header__btn"
          onClick={() => {
            sound.playClick();
            onToggleTheme();
          }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title="Toggle Theme"
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Language selector */}
        <div style={{ position: 'relative' }} ref={langMenuRef}>
          <button
            className="header__lang"
            onClick={() => {
              sound.playClick();
              setLangMenuOpen((prev) => !prev);
            }}
            aria-expanded={langMenuOpen}
            title="Select Language"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{currentLang === 'en' ? 'English' : 'हिन्दी'}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: langMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.18s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {langMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'var(--surface)',
                backdropFilter: 'blur(24px) saturate(190%)',
                WebkitBackdropFilter: 'blur(24px) saturate(190%)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow-lg), inset 0 1px 1px 0 var(--glass-highlight)',
                padding: '6px',
                minWidth: '140px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onChangeLang('en');
                  setLangMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  background: currentLang === 'en' ? 'var(--accent-subtle)' : 'transparent',
                  color: currentLang === 'en' ? 'var(--accent)' : 'var(--primary)',
                  fontWeight: currentLang === 'en' ? 700 : 500,
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>English</span>
                {currentLang === 'en' && <CheckIcon size={14} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onChangeLang('hi');
                  setLangMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  background: currentLang === 'hi' ? 'var(--accent-subtle)' : 'transparent',
                  color: currentLang === 'hi' ? 'var(--accent)' : 'var(--primary)',
                  fontWeight: currentLang === 'hi' ? 700 : 500,
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>हिन्दी</span>
                {currentLang === 'hi' && <CheckIcon size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    </div>
  );
};
