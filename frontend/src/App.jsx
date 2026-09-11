import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import NewInvestigation from './components/NewInvestigation';
import DashboardView from './components/Dashboard/DashboardView';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [investigationData, setInvestigationData] = useState(null);

  const handleAnalysisComplete = (data) => {
    setInvestigationData(data);
    setCurrentView('dashboard');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-main text-primary">
        <Header
          currentView={currentView}
          onSwitchView={setCurrentView}
          hasData={!!investigationData}
        />

        {currentView === 'landing' && (
          <LandingPage onStartInvestigation={() => setCurrentView('new-investigation')} />
        )}

        {currentView === 'new-investigation' && (
          <NewInvestigation onAnalysisComplete={handleAnalysisComplete} />
        )}

        {currentView === 'dashboard' && (
          <DashboardView investigationData={investigationData} />
        )}
      </div>
    </ThemeProvider>
  );
}
