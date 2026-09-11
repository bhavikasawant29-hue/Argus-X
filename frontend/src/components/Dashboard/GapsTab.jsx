import React from 'react';

export default function GapsTab({ gaps, recommendations }) {
  const gapList = gaps || [];
  const recList = recommendations || [];

  return (
    <div className="space-y-6">
      {/* Evidence Gaps */}
      <div className="border border-main bg-surface p-6 rounded space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-main">
          <span className="text-xs font-mono-code text-muted uppercase tracking-wider">
            Identified Telemetry Gaps ({gapList.length})
          </span>
          <span className="text-xs font-mono-code text-[#f59e0b]">UNOBSERVED / SUPPORTING ONLY</span>
        </div>

        {gapList.length === 0 ? (
          <div className="text-xs text-muted font-mono-code">No evidence gaps identified.</div>
        ) : (
          <div className="space-y-3">
            {gapList.map((item, idx) => (
              <div key={idx} className="p-4 rounded border border-main bg-main/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">{item.gap}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code uppercase font-semibold border ${
                    item.severity === 'high' ? 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]' :
                    item.severity === 'medium' ? 'bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#f59e0b]' :
                    'bg-main border-main text-muted'
                  }`}>
                    {item.severity} SEVERITY
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  {item.impact}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Telemetry Recommendations */}
      <div className="border border-main bg-surface p-6 rounded space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-main">
          <span className="text-xs font-mono-code text-muted uppercase tracking-wider">
            Telemetry Defensiveness Recommendations ({recList.length})
          </span>
          <span className="text-xs font-mono-code text-[#10b981]">PROACTIVE HARDENING</span>
        </div>

        {recList.length === 0 ? (
          <div className="text-xs text-muted font-mono-code">No specific recommendations available.</div>
        ) : (
          <div className="space-y-3">
            {recList.map((rec, idx) => (
              <div key={idx} className="p-4 rounded border border-main bg-main/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">{rec.recommendation}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code uppercase font-semibold border ${
                    rec.priority === 'High' ? 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]' :
                    'bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#f59e0b]'
                  }`}>
                    {rec.priority} PRIORITY
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  {rec.reason}
                </p>
                {rec.gap && (
                  <div className="text-[11px] font-mono-code text-[#10b981] pt-1">
                    Addresses gap: {rec.gap}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
