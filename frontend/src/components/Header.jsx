import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ currentView, onSwitchView, hasData }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full border-b border-main bg-main/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSwitchView('landing')}>
          <div className="w-5 h-5 rounded-[3px] bg-surface border border-main flex items-center justify-center shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          </div>
          <span className="text-xs font-semibold tracking-wider text-primary uppercase font-mono-code">ARGUS-X</span>
          <span className="text-[11px] text-muted pl-2.5 border-l border-main hidden sm:inline-block font-mono-code tracking-tight">
            SECURITY TELEMETRY RECONSTRUCTION ENGINE
          </span>
        </div>

        <div className="flex items-center space-x-5">
          <nav className="hidden md:flex items-center space-x-5 text-xs text-muted font-sans">
            <button
              onClick={() => onSwitchView('landing')}
              className={`hover:text-primary transition-colors ${currentView === 'landing' ? 'text-primary font-medium' : ''}`}
            >
              Platform Overview
            </button>
            {hasData && (
              <button
                onClick={() => onSwitchView('dashboard')}
                className={`hover:text-primary transition-colors ${currentView === 'dashboard' ? 'text-[#10b981] font-medium font-mono-code' : ''}`}
              >
                Dashboard [Active]
              </button>
            )}
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-1.5 px-2 py-1 rounded-[3px] border border-main bg-surface text-[11px] font-mono-code text-muted hover:text-primary hover:border-main/80 transition-colors"
            title="Toggle color theme"
          >
            <span className="material-symbols-outlined text-[15px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="hidden sm:inline font-medium">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>

          {currentView !== 'new-investigation' && (
            <button
              onClick={() => onSwitchView('new-investigation')}
              className="px-3.5 py-1.5 bg-[#10b981] hover:bg-[#059669] text-gray-950 text-xs font-semibold tracking-wide transition-colors rounded-[3px] flex items-center space-x-1.5 font-mono-code shadow-sm"
            >
              <span>{hasData ? 'New Investigation' : 'Start Investigation'}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
