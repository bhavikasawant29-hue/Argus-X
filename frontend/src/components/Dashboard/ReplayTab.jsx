import React, { useState, useEffect } from 'react';

export default function ReplayTab({ replay, onSelectEvent }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = replay || [];

  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev < steps.length - 1) {
            const nextIdx = prev + 1;
            onSelectEvent(steps[nextIdx]);
            return nextIdx;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps, onSelectEvent]);

  if (steps.length === 0) {
    return <div className="p-6 text-muted text-xs">No attack replay steps available.</div>;
  }

  const currentStep = steps[currentIndex] || {};

  const handleStepChange = (idx) => {
    if (idx >= 0 && idx < steps.length) {
      setCurrentIndex(idx);
      onSelectEvent(steps[idx]);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    onSelectEvent(steps[0]);
  };

  return (
    <div className="border border-main bg-surface p-6 rounded space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-main">
        <span className="text-xs font-mono-code text-muted uppercase tracking-wider">
          Attack Step Replay ({currentIndex + 1} / {steps.length})
        </span>
        <span className="text-xs font-mono-code text-[#10b981]">CHRONOLOGICAL PLAYBACK</span>
      </div>

      {/* Playback Controls */}
      <div className="p-4 bg-main/80 border border-main rounded flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleStepChange(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="px-3 py-1.5 rounded border border-main bg-surface hover:bg-surface-hover text-xs font-mono-code text-primary disabled:opacity-40"
          >
            ◄ Prev
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-1.5 rounded border border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 text-xs font-mono-code font-semibold"
          >
            {isPlaying ? 'Pause ❚❚' : 'Play ▶'}
          </button>

          <button
            onClick={() => handleStepChange(currentIndex + 1)}
            disabled={currentIndex === steps.length - 1}
            className="px-3 py-1.5 rounded border border-main bg-surface hover:bg-surface-hover text-xs font-mono-code text-primary disabled:opacity-40"
          >
            Next ►
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded border border-main bg-surface hover:bg-surface-hover text-xs font-mono-code text-muted"
          >
            Reset
          </button>
        </div>

        <div className="text-xs font-mono-code text-muted">
          Step <span className="text-primary font-semibold">{currentIndex + 1}</span> of {steps.length}
        </div>
      </div>

      {/* Active Step Highlight Card */}
      <div className="p-6 border border-[#10b981]/40 bg-main/60 rounded space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-main">
          <span className="text-sm font-semibold text-[#10b981] font-mono-code">
            {currentStep.stage} ({currentStep.event_id})
          </span>
          <span className="text-xs font-mono-code text-muted">
            Timestamp: {currentStep.timestamp}
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-primary font-mono-code">
            {currentStep.description}
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-mono-code text-muted pt-2">
            <span>User: <span className="text-primary">{currentStep.user || 'Unknown'}</span></span>
            <span>Source Host: <span className="text-primary">{currentStep.source_host || 'N/A'}</span></span>
            {currentStep.destination_host && <span>Dest Host: <span className="text-primary">{currentStep.destination_host}</span></span>}
            <span>Severity: <span className="text-[#ef4444] font-semibold">{currentStep.severity || 'HIGH'}</span></span>
          </div>
        </div>
      </div>

      {/* Step List */}
      <div className="space-y-2">
        <span className="text-xs font-mono-code text-muted uppercase">Replay Step Directory</span>
        <div className="space-y-1">
          {steps.map((step, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={step.event_id || idx}
                onClick={() => handleStepChange(idx)}
                className={`p-3 rounded border text-xs font-mono-code cursor-pointer flex items-center justify-between transition-colors ${
                  isCurrent
                    ? 'border-[#10b981] bg-main text-[#10b981] font-semibold'
                    : 'border-main bg-surface/50 text-muted hover:text-primary hover:bg-main/40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-5 text-[11px]">0{step.step || idx + 1}</span>
                  <span className="text-primary font-medium">{step.stage}</span>
                  <span className="text-muted text-[11px] hidden sm:inline">{step.event_id}</span>
                </div>
                <span className="text-[11px] text-muted">{step.timestamp}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
