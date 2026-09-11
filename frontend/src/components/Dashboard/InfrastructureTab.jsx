import React from 'react';

export default function InfrastructureTab({ infrastructure, blastRadius }) {
  if (!infrastructure) {
    return <div className="p-6 text-muted text-xs">No infrastructure map available.</div>;
  }

  const hosts = infrastructure.hosts || [];
  const users = infrastructure.users || [];
  const ips = infrastructure.source_ips || [];
  const connections = infrastructure.connections || [];

  const compromisedHosts = new Set(blastRadius?.affected_hosts || []);

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-4 border border-main bg-main/70 rounded space-y-1 text-xs">
        <div className="font-semibold text-primary font-mono-code flex items-center space-x-2">
          <span className="material-symbols-outlined text-[16px] text-muted">info</span>
          <span>Environment vs Attack Scope Distinction</span>
        </div>
        <p className="text-muted leading-relaxed font-sans">
          Below is the complete observed telemetry infrastructure. Attack-involved systems are specifically highlighted. Unhighlighted systems represent background telemetry environment hosts that were observed but remained uncompromised.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono-code">
        <div className="p-4 border border-main bg-surface rounded space-y-1">
          <span className="text-xs text-muted uppercase">Observed Hosts</span>
          <div className="text-xl font-semibold text-primary">{infrastructure.host_count || hosts.length}</div>
        </div>
        <div className="p-4 border border-main bg-surface rounded space-y-1">
          <span className="text-xs text-muted uppercase">Observed Users</span>
          <div className="text-xl font-semibold text-primary">{infrastructure.user_count || users.length}</div>
        </div>
        <div className="p-4 border border-main bg-surface rounded space-y-1">
          <span className="text-xs text-muted uppercase">Source IPs</span>
          <div className="text-xl font-semibold text-primary">{infrastructure.ip_count || ips.length}</div>
        </div>
        <div className="p-4 border border-main bg-surface rounded space-y-1">
          <span className="text-xs text-muted uppercase">Connection Links</span>
          <div className="text-xl font-semibold text-primary">{infrastructure.connection_count || connections.length}</div>
        </div>
      </div>

      {/* Observed Hosts Grid */}
      <div className="border border-main bg-surface p-6 rounded space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-main">
          <span className="text-xs font-mono-code text-muted uppercase tracking-wider">
            Observed Hosts Directory ({hosts.length})
          </span>
          <span className="text-xs font-mono-code text-muted">ENVIRONMENT SCOPE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-code text-xs">
          {hosts.map(host => {
            const isCompromised = compromisedHosts.has(host);
            return (
              <div
                key={host}
                className={`p-3 rounded border flex items-center justify-between ${
                  isCompromised
                    ? 'border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444] font-semibold'
                    : 'border-main bg-main/50 text-muted'
                }`}
              >
                <span>{host}</span>
                {isCompromised ? (
                  <span className="text-[10px] uppercase font-bold text-[#ef4444]">ATTACK PATH</span>
                ) : (
                  <span className="text-[10px] uppercase text-muted">OBSERVED</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Connections List */}
      <div className="border border-main bg-surface p-6 rounded space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-main">
          <span className="text-xs font-mono-code text-muted uppercase tracking-wider">
            Observed Inter-Host Connections ({connections.length})
          </span>
          <span className="text-xs font-mono-code text-[#10b981]">LINKAGE</span>
        </div>

        <div className="space-y-2 font-mono-code text-xs">
          {connections.map((conn, idx) => (
            <div key={idx} className="p-3 bg-main/60 border border-main rounded flex items-center justify-between text-primary">
              <div className="flex items-center space-x-3">
                <span className="text-muted text-[11px]">0{idx + 1}</span>
                <span className="text-[#10b981] font-semibold">{conn.source} → {conn.destination}</span>
              </div>
              <div className="flex items-center space-x-4 text-muted text-[11px]">
                <span>Event ID: <span className="text-primary">{conn.event_id}</span></span>
                {conn.timestamp && <span>{conn.timestamp}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
