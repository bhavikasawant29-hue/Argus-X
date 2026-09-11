import React, { useState } from 'react';

export default function ImpactTab({
  blastRadius,
  timeline = [],
  selectedEvent,
  onSelectEvent,
  infrastructure = {},
}) {
  const [pulseActive, setPulseActive] = useState(false);

  if (!blastRadius) {
    return <div className="p-6 text-muted text-xs font-mono-code">No blast radius analysis available.</div>;
  }

  const affectedHosts = blastRadius.affected_hosts || [];
  const affectedUsers = blastRadius.affected_users || [];
  const criticalAssets = blastRadius.critical_assets || [];
  const attackPath = blastRadius.attack_path || [];

  // Derive attack chain from attack_path data
  // attack_path is like ["PC-25 -> SRV-02", "SRV-02 -> DB-01"]
  const chain = [];
  const edgeLabels = [];
  attackPath.forEach((seg, idx) => {
    const parts = seg.split('->').map((s) => s.trim());
    if (idx === 0 && parts[0]) chain.push(parts[0]);
    if (parts[1]) chain.push(parts[1]);
  });
  // Derive edge relationship labels from timeline
  attackPath.forEach((seg) => {
    const parts = seg.split('->').map((s) => s.trim());
    const matchEv = timeline.find(
      (e) => e.source_host === parts[0] && e.destination_host === parts[1]
    );
    edgeLabels.push(matchEv?.stage || 'Connection');
  });

  // If chain is empty, fall back to affected hosts in order
  const nodes = chain.length >= 2 ? chain : affectedHosts;

  // Node role classification
  const getNodeRole = (host, idx) => {
    if (idx === 0) return 'origin';
    if (criticalAssets.includes(host)) return 'critical';
    return 'pivot';
  };

  // Node styling per role
  const roleConfig = {
    origin: {
      borderColor: 'border-[#f59e0b]',
      textColor: 'text-[#f59e0b]',
      haloColor: 'bg-[#f59e0b]/10 border-[#f59e0b]/25',
      haloSize: 'w-28 h-28',
      icon: 'desktop_windows',
      label: 'ATTACK ORIGIN',
      badgeBg: 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#f59e0b]',
      subtitle: 'Workstation',
      nodeBg: 'bg-surface',
      selectedRing: 'ring-[#f59e0b]/40',
    },
    pivot: {
      borderColor: 'border-[#ef4444]',
      textColor: 'text-[#ef4444]',
      haloColor: 'bg-[#ef4444]/8 border-[#ef4444]/20',
      haloSize: 'w-36 h-36',
      icon: 'dns',
      label: 'COMPROMISED PIVOT',
      badgeBg: 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#ef4444]',
      subtitle: 'App Server',
      nodeBg: 'bg-surface',
      selectedRing: 'ring-[#ef4444]/40',
    },
    critical: {
      borderColor: 'border-[#ef4444]',
      textColor: 'text-white',
      haloColor: 'bg-[#ef4444]/15 border-[#ef4444]/40',
      haloSize: 'w-40 h-40',
      icon: 'database',
      label: 'CRITICAL ASSET',
      badgeBg: 'bg-[#ef4444] text-white border-transparent',
      subtitle: 'Database Server',
      nodeBg: 'bg-[#ef4444]',
      selectedRing: 'ring-white/50',
    },
  };

  const handleSelectHostNode = (hostName) => {
    const matchingEv = timeline.find(
      (e) => e.destination_host === hostName || e.source_host === hostName
    );
    if (matchingEv && onSelectEvent) onSelectEvent(matchingEv);
  };

  const handleSelectEdge = (idx) => {
    if (idx < attackPath.length) {
      const parts = attackPath[idx].split('->').map((s) => s.trim());
      const matchEv = timeline.find(
        (e) => e.source_host === parts[0] && e.destination_host === parts[1]
      );
      if (matchEv && onSelectEvent) onSelectEvent(matchEv);
    }
  };

  const handleTriggerPulse = () => {
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 2500);
  };

  const isNodeSelected = (host) =>
    selectedEvent &&
    (selectedEvent.source_host === host || selectedEvent.destination_host === host);

  return (
    <div className="space-y-4">
      {/* Compact Header: Title + Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-main gap-3">
        <div>
          <h2 className="text-base font-bold text-primary">Blast Radius</h2>
          <p className="text-xs text-muted">Attack propagation and impact assessment</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code">
          <div className="px-2.5 py-1 bg-main border border-main rounded flex items-center space-x-1.5">
            <span className="text-muted">Affected Hosts:</span>
            <span className="font-bold text-primary">{affectedHosts.length}</span>
          </div>
          <div className="px-2.5 py-1 bg-main border border-main rounded flex items-center space-x-1.5">
            <span className="text-muted">Compromised User:</span>
            <span className="font-bold text-[#f59e0b]">{affectedUsers[0] || '—'}</span>
          </div>
          <div className="px-2.5 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded flex items-center space-x-1.5 text-[#ef4444]">
            <span>Critical Asset:</span>
            <span className="font-bold">{criticalAssets[0] || '—'}</span>
          </div>
          <button
            onClick={handleTriggerPulse}
            className="p-1.5 bg-main hover:bg-surface border border-main rounded text-xs flex items-center"
            title="Show propagation pulse"
          >
            <span className="material-symbols-outlined text-sm text-[#10b981]">pulse_alert</span>
          </button>
        </div>
      </div>

      {/* ONE Central Propagation Visualization */}
      <div className="border border-main bg-surface rounded p-8 relative min-h-[480px] flex flex-col">
        {/* Confirmed Attack Path — single compact line */}
        <div className="flex items-center space-x-2 text-xs font-mono-code text-muted mb-4">
          <span className="uppercase tracking-wider">Confirmed Attack Path</span>
          <span className="text-primary font-medium">{nodes.join(' → ')}</span>
        </div>

        {/* Propagation Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* SVG Arrows Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <marker id="arrow-blast" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill="#475569" />
              </marker>
              <marker id="arrow-blast-pulse" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill="#ef4444" />
              </marker>
            </defs>

            {/* Edge lines — offset below node centers for clean separation */}
            {nodes.length >= 2 && (
              <>
                {/* Edge 1: Origin → Pivot */}
                <line
                  x1="24%" y1="58%" x2="44%" y2="58%"
                  stroke={pulseActive ? '#ef4444' : '#475569'}
                  strokeWidth={pulseActive ? 2.5 : 1.5}
                  markerEnd={pulseActive ? 'url(#arrow-blast-pulse)' : 'url(#arrow-blast)'}
                  strokeDasharray={pulseActive ? '6,4' : 'none'}
                  className={pulseActive ? 'animate-pulse' : ''}
                />
                {nodes.length >= 3 && (
                  /* Edge 2: Pivot → Critical */
                  <line
                    x1="56%" y1="58%" x2="76%" y2="58%"
                    stroke={pulseActive ? '#ef4444' : '#475569'}
                    strokeWidth={pulseActive ? 3 : 2}
                    markerEnd={pulseActive ? 'url(#arrow-blast-pulse)' : 'url(#arrow-blast)'}
                    strokeDasharray={pulseActive ? '6,4' : 'none'}
                    className={pulseActive ? 'animate-pulse' : ''}
                  />
                )}
              </>
            )}
          </svg>

          {/* Nodes row with wider spacing */}
          <div className="relative z-10 flex items-start justify-center gap-44 w-full max-w-4xl">
            {nodes.map((host, idx) => {
              const role = getNodeRole(host, idx);
              const config = roleConfig[role];
              const selected = isNodeSelected(host);

              return (
                <div key={host} className="flex flex-col items-center" style={{ minWidth: '120px' }}>
                  {/* User identity marker — only on origin */}
                  {idx === 0 && affectedUsers.length > 0 && (
                    <div className="mb-2 flex items-center space-x-1 text-xs font-mono-code text-[#f59e0b]">
                      <span className="material-symbols-outlined text-sm">person</span>
                      <span className="font-semibold">{affectedUsers[0]}</span>
                    </div>
                  )}
                  {/* Spacer for non-origin nodes to keep circles vertically aligned */}
                  {(idx !== 0 || affectedUsers.length === 0) && (
                    <div className="mb-2 h-5" />
                  )}

                  {/* Subtle halo */}
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`absolute ${config.haloSize} rounded-full ${config.haloColor} border pointer-events-none`}
                    />

                    {/* Node circle */}
                    <div
                      onClick={() => handleSelectHostNode(host)}
                      className={`relative z-10 w-16 h-16 rounded-full ${config.nodeBg} border-2 ${config.borderColor} ${config.textColor} flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                        selected ? `ring-4 ${config.selectedRing} scale-105` : ''
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{config.icon}</span>
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="mt-3 text-center">
                    <div className="text-sm font-bold text-primary font-mono-code">{host}</div>
                    <div className="text-[10px] text-muted font-mono-code">{config.subtitle}</div>
                    <span
                      className={`mt-1.5 inline-block text-[8px] font-mono-code px-2 py-0.5 rounded font-bold uppercase border ${config.badgeBg}`}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edge labels — positioned in a separate row below the arrows */}
          {nodes.length >= 2 && (
            <div className="relative z-10 flex items-center justify-center gap-44 w-full max-w-4xl mt-6">
              {nodes.map((host, idx) => {
                if (idx >= nodes.length - 1) return null;
                return (
                  <React.Fragment key={`edge-${idx}`}>
                    {/* Spacer to center label between the gap */}
                    {idx === 0 && <div style={{ minWidth: '120px' }} />}
                    <div
                      onClick={() => handleSelectEdge(idx)}
                      className="cursor-pointer group flex items-center space-x-1.5"
                      style={{ minWidth: '120px', justifyContent: 'center', marginLeft: idx === 0 ? '-60px' : '0', marginRight: idx === nodes.length - 2 ? '-60px' : '0' }}
                    >
                      <span className="material-symbols-outlined text-xs text-muted group-hover:text-[#10b981] transition-colors">arrow_forward</span>
                      <span className="px-2 py-0.5 rounded bg-main/80 border border-main group-hover:border-[#10b981]/60 text-[9px] font-mono-code text-muted group-hover:text-[#10b981] transition-colors whitespace-nowrap">
                        {edgeLabels[idx] || 'Connection'}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
