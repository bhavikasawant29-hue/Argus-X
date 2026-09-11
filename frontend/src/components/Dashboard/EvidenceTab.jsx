import React from 'react';

export default function EvidenceTab({ evidence, timeline, onInspectRawEvent }) {
  if (!evidence || evidence.length === 0) {
    return <div className="p-6 text-muted text-xs">No evidence analysis results available.</div>;
  }

  return (
    <div className="border border-main bg-surface p-6 rounded space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-main">
        <span className="text-xs font-mono-code text-muted uppercase tracking-wider">
          Evidence Analysis & Chain of Custody ({evidence.length} items)
        </span>
        <span className="text-xs font-mono-code text-[#10b981]">GROUNDED EVIDENCE CORRELATION</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono-code border border-main">
          <thead className="bg-main/90 border-b border-main text-muted">
            <tr>
              <th className="p-3">Event ID</th>
              <th className="p-3">Attack Stage</th>
              <th className="p-3">Evidence Status</th>
              <th className="p-3">Supporting Count</th>
              <th className="p-3">Supporting Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-main bg-surface">
            {evidence.map((item, idx) => (
              <tr key={item.event_id || idx} className="hover:bg-main/50">
                <td className="p-3 text-[#10b981] font-semibold">{item.event_id}</td>
                <td className="p-3 text-primary">{item.stage}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    item.evidence_status === 'Verified'
                      ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                      : 'bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#f59e0b]'
                  }`}>
                    {item.evidence_status}
                  </span>
                </td>
                <td className="p-3 text-primary">{item.supporting_event_count || item.supporting_events?.length || 0}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {(item.supporting_events || []).map(refId => (
                      <button
                        key={refId}
                        onClick={() => onInspectRawEvent(refId)}
                        className="px-2 py-0.5 rounded bg-main border border-main text-[10px] text-[#10b981] hover:underline"
                      >
                        {refId}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
