import React, { useState } from 'react';
import { runCounterfactual } from '../../services/api';

export default function WhatIfTab({ timeline }) {
  const [selectedStage, setSelectedStage] = useState('Lateral Movement');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState(null);

  const stages = [
    'Initial Access',
    'Execution',
    'Credential Access',
    'Lateral Movement',
    'Privilege Escalation',
    'Database Access',
  ];

  const handleSimulate = async (stage) => {
    setSelectedStage(stage);
    setIsSimulating(true);
    setError(null);

    try {
      const res = await runCounterfactual(stage);
      setSimulationResult(res);
    } catch (err) {
      setError(err.message || 'Counterfactual simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="border border-main bg-surface p-6 rounded space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-main">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] font-mono-code text-xs font-bold uppercase tracking-wider">
            SIMULATION
          </span>
          <span className="text-xs font-mono-code text-primary uppercase tracking-wider font-semibold">
            Counterfactual Attack Containment Analysis
          </span>
        </div>
        <span className="text-xs font-mono-code text-muted">WHAT-IF ENGINE</span>
      </div>

      <p className="text-xs text-muted leading-relaxed font-sans">
        Select an attack stage to simulate blocking the adversary at that exact bottleneck. The backend engine calculates downstream stage prevention and containment impact.
      </p>

      {/* Stage Selection Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-mono-code text-muted">Select Target Stage to Block:</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stages.map((stage) => {
            const isSelected = selectedStage === stage;
            return (
              <button
                key={stage}
                onClick={() => handleSimulate(stage)}
                disabled={isSimulating}
                className={`p-3 rounded border text-xs font-mono-code text-left transition-all ${
                  isSelected
                    ? 'border-[#10b981] bg-main text-[#10b981] font-semibold'
                    : 'border-main bg-main/50 text-muted hover:text-primary hover:border-main/80'
                }`}
              >
                <div>{stage}</div>
                <div className="text-[10px] text-muted font-normal mt-0.5">Click to simulate block</div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded border border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444] text-xs font-mono-code">
          {error}
        </div>
      )}

      {/* Simulation Result */}
      {simulationResult && (
        <div className="p-6 border border-[#10b981]/40 bg-main/80 rounded space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-main">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono-code text-muted">Blocked Bottleneck:</span>
              <span className="text-sm font-semibold text-primary font-mono-code">{simulationResult.blocked_stage}</span>
            </div>
            <span className="px-3 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/30 text-xs font-mono-code text-[#10b981] font-bold">
              {simulationResult.stopped ? 'ATTACK CONTAINED ✓' : 'ATTACK NOT STOPPED'}
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono-code text-muted uppercase">Prevented Downstream Stages</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {(simulationResult.prevented_stages || []).map((stage, idx) => (
                <span key={idx} className="px-3 py-1 rounded bg-surface border border-main text-xs font-mono-code text-[#10b981]">
                  ✓ {stage}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono-code text-muted uppercase">Simulated Impact Assessment</span>
            <p className="text-xs text-primary leading-relaxed bg-surface p-4 rounded border border-main font-sans">
              {simulationResult.impact}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
