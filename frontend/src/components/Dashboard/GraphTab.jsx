import React, { useState } from 'react';

export default function GraphTab({ graph, timeline, selectedEvent, onSelectEvent }) {
  const [selectedEdge, setSelectedEdge] = useState(null);

  if (!graph || !graph.nodes) {
    return <div className="p-6 text-muted text-xs">No graph data available.</div>;
  }

  const nodes = graph.nodes || [];
  const edges = graph.edges || [];

  const handleNodeClick = (node) => {
    setSelectedEdge(null);
    const ev = timeline.find(item => item.event_id === node.id);
    if (ev) onSelectEvent(ev);
  };

  const handleEdgeClick = (edge) => {
    setSelectedEdge(edge);
    const ev = timeline.find(item => item.event_id === edge.source || item.event_id === edge.target);
    if (ev) onSelectEvent(ev);
  };

  return (
    <div className="border border-main bg-surface p-6 rounded space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-main">
        <span className="text-xs font-mono-code text-muted uppercase tracking-wider">
          Reconstructed Attack Graph ({nodes.length} Nodes, {edges.length} Edges)
        </span>
        <span className="text-xs font-mono-code text-[#10b981]">CAUSAL CORRELATION GRAPH</span>
      </div>

      {/* Visual Graph Nodes */}
      <div className="p-6 bg-main/70 border border-main rounded space-y-6">
        <div className="text-xs font-mono-code text-muted mb-2">Interactive Node Chain (Click to Inspect):</div>
        
        <div className="flex flex-wrap items-center justify-start gap-4">
          {nodes.map((node, idx) => {
            const isSelected = selectedEvent && (selectedEvent.event_id === node.id || selectedEvent.id === node.id);
            const edgeToNext = edges.find(e => e.source === node.id);

            return (
              <React.Fragment key={node.id || idx}>
                <div
                  onClick={() => handleNodeClick(node)}
                  className={`p-3 border rounded cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#10b981] bg-surface shadow-md'
                      : 'border-main bg-surface/60 hover:border-main/80'
                  }`}
                >
                  <div className="text-[10px] font-mono-code text-[#10b981] font-semibold">{node.id}</div>
                  <div className="text-xs font-medium text-primary mt-0.5">{node.stage}</div>
                  <div className="text-[10px] font-mono-code text-muted mt-1">
                    {node.host || 'N/A'} {node.destination ? `→ ${node.destination}` : ''}
                  </div>
                </div>

                {edgeToNext && (
                  <div
                    onClick={() => handleEdgeClick(edgeToNext)}
                    className="flex flex-col items-center cursor-pointer group px-1"
                    title={`Relationship: ${edgeToNext.relationship}`}
                  >
                    <span className="text-[10px] font-mono-code text-muted group-hover:text-[#10b981] transition-colors">
                      [{edgeToNext.relationship}]
                    </span>
                    <span className="text-sm font-mono-code text-[#10b981] font-bold">→</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Edge / Node explanation box */}
      {selectedEdge && (
        <div className="p-4 border border-[#10b981]/40 bg-[#10b981]/10 rounded space-y-1 text-xs font-mono-code">
          <div className="font-semibold text-primary">
            Causal Edge Relationship: [{selectedEdge.source}] → [{selectedEdge.target}]
          </div>
          <div className="text-[#10b981]">
            Relationship Type: <span className="font-bold">{selectedEdge.relationship}</span>
          </div>
        </div>
      )}

      {/* Graph Nodes Table */}
      <div className="space-y-3">
        <span className="text-xs font-mono-code text-muted uppercase">Node Telemetry Roster</span>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code border border-main">
            <thead className="bg-main/90 border-b border-main text-muted">
              <tr>
                <th className="p-2.5">Event ID</th>
                <th className="p-2.5">Stage</th>
                <th className="p-2.5">Event Type</th>
                <th className="p-2.5">Host</th>
                <th className="p-2.5">Destination</th>
                <th className="p-2.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-main bg-surface">
              {nodes.map(node => (
                <tr
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className="hover:bg-main/50 cursor-pointer"
                >
                  <td className="p-2.5 text-[#10b981] font-semibold">{node.id}</td>
                  <td className="p-2.5 text-primary">{node.stage}</td>
                  <td className="p-2.5 text-muted">{node.label}</td>
                  <td className="p-2.5 text-primary">{node.host || 'N/A'}</td>
                  <td className="p-2.5 text-primary">{node.destination || 'N/A'}</td>
                  <td className="p-2.5 text-muted">{node.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
