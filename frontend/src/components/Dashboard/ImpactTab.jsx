import React from 'react';

export default function ImpactTab({ blastRadius }) {
  if (!blastRadius) {
    return <div className="p-6 text-muted text-xs">No blast radius analysis available.</div>;
  }

  const affectedHosts = blastRadius.affected_hosts || [];
  const affectedUsers = blastRadius.affected_users || [];
  const criticalAssets = blastRadius.critical_assets || [];
  const attackPath = blastRadius.attack_path || [];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 border border-main bg-surface rounded space-y-2">
          <span className="text-xs font-mono-code text-muted uppercase">Affected Hosts ({affectedHosts.length})</span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {affectedHosts.map(host => (
              <span key={host} className="px-2.5 py-1 rounded bg-main border border-main text-xs font-mono-code text-primary">
                {host}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 border border-main bg-surface rounded space-y-2">
          <span className="text-xs font-mono-code text-muted uppercase">Compromised Users ({affectedUsers.length})</span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {affectedUsers.map(user => (
              <span key={user} className="px-2.5 py-1 rounded bg-main border border-main text-xs font-mono-code text-primary">
                {user}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 border border-main bg-surface rounded space-y-2">
          <span className="text-xs font-mono-code text-muted uppercase">Critical Assets Targeted ({criticalAssets.length})</span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {criticalAssets.map(asset => (
              <span key={asset} className="px-2.5 py-1 rounded bg-[#ef4444]/10 border border-[#ef4444]/30 text-xs font-mono-code text-[#ef4444] font-semibold">
                {asset}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Attack Path */}
      <div className="border border-main bg-surface p-6 rounded space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-main">
          <span className="text-xs font-mono-code text-muted uppercase tracking-wider">
            Reconstructed Lateral Attack Path
          </span>
          <span className="text-xs font-mono-code text-[#ef4444]">BLAST RADIUS PROPAGATION</span>
        </div>

        <div className="space-y-3 font-mono-code text-xs">
          {attackPath.map((path, idx) => (
            <div key={idx} className="p-3 bg-main/70 border border-main rounded flex items-center space-x-3 text-primary">
              <span className="text-muted text-[11px] w-6">0{idx + 1}</span>
              <span className="text-[#10b981] font-semibold">{path}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
