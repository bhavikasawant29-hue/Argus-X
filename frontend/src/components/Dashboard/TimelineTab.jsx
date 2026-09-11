import React from 'react';

export default function TimelineTab({ timeline, selectedEvent, onSelectEvent }) {
  if (!timeline || timeline.length === 0) {
    return <div className="p-6 text-muted text-xs">No reconstructed timeline available.</div>;
  }

  const getDotColor = (stage) => {
    switch (stage) {
      case 'Initial Access': return '#10b981';
      case 'Execution': return '#3b82f6';
      case 'Credential Access': return '#f59e0b';
      case 'Lateral Movement': return '#ef4444';
      case 'Privilege Escalation': return '#ef4444';
      case 'Database Access': return '#ef4444';
      default: return '#10b981';
    }
  };

  return (
    <div className="border border-main bg-surface p-6 rounded space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-main">
        <span className="text-xs font-mono-code text-muted uppercase tracking-wider">
          Reconstructed Attack Timeline ({timeline.length} events)
        </span>
        <span className="text-xs font-mono-code text-[#10b981]">CHRONOLOGICAL RECONSTRUCTION</span>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-main">
        {timeline.map((ev, index) => {
          const isSelected = selectedEvent && (selectedEvent.event_id === ev.event_id || selectedEvent.id === ev.event_id);
          const dotColor = getDotColor(ev.stage);

          return (
            <div
              key={ev.event_id || index}
              onClick={() => onSelectEvent(ev)}
              className={`flex items-start space-x-4 cursor-pointer group p-3 rounded transition-colors ${
                isSelected ? 'bg-main border border-main' : 'hover:bg-main/40'
              }`}
            >
              <div className="w-6 flex justify-center pt-1 z-10">
                <span
                  className="w-3 h-3 rounded-full border-2 border-main shadow-sm"
                  style={{ backgroundColor: dotColor }}
                ></span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary group-hover:text-[#10b981] transition-colors">
                    {ev.stage} ({ev.event_type})
                  </span>
                  <span className="font-mono-code text-muted text-[11px]">{ev.timestamp}</span>
                </div>
                <div className="text-xs text-muted leading-relaxed font-sans">
                  User <span className="text-primary font-mono-code">{ev.user || 'Unknown'}</span> activity detected on host <span className="text-primary font-mono-code">{ev.source_host || 'N/A'}</span>
                  {ev.destination_host ? <span> moving to <span className="text-[#ef4444] font-mono-code">{ev.destination_host}</span></span> : ''}.
                  {ev.time_since_previous !== null && ev.time_since_previous !== undefined && (
                    <span className="text-muted text-[11px] block mt-0.5 font-mono-code">
                      +{ev.time_since_previous}s since previous stage
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-6 pt-1 font-mono-code text-[11px] text-muted">
                  <span>Host: <span className="text-primary">{ev.source_host}</span></span>
                  {ev.destination_host && <span>Dest: <span className="text-primary">{ev.destination_host}</span></span>}
                  <span>Event ID: <span className="text-[#10b981] underline">{ev.event_id}</span></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
