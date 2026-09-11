import React, { useState } from 'react';

export default function GraphTab({
  graph,
  timeline = [],
  selectedEvent,
  onSelectEvent,
  infrastructure = {},
  blastRadius = {},
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedEdgeInfo, setSelectedEdgeInfo] = useState(null);
  const [layoutDirection, setLayoutDirection] = useState('horizontal');

  if (!graph || !graph.nodes) {
    return <div className="p-6 text-muted text-xs font-mono-code">No graph data available.</div>;
  }

  const nodes = graph.nodes || [];
  const affectedHosts = blastRadius.affected_hosts || [];
  const criticalAssets = blastRadius.critical_assets || [];
  const affectedUsers = blastRadius.affected_users || [];

  // Extract graph entity nodes dynamically from payload
  const entityMap = new Map();

  // 1. Add User Nodes from payload
  if (affectedUsers.length > 0) {
    affectedUsers.forEach((user) => {
      entityMap.set(`user:${user}`, {
        id: `user:${user}`,
        name: user,
        type: 'user',
        label: 'User',
        status: 'USER',
        icon: 'person',
        color: 'green',
        events: timeline.filter((e) => e.user === user),
      });
    });
  } else {
    entityMap.set('user:rahul', {
      id: 'user:rahul',
      name: 'rahul',
      type: 'user',
      label: 'User',
      status: 'USER',
      icon: 'person',
      color: 'green',
      events: timeline.filter((e) => e.user === 'rahul'),
    });
  }

  // 2. Add Compromised Hosts from timeline/blast_radius
  timeline.forEach((event) => {
    const srcHost = event.source_host;
    const destHost = event.destination_host;

    [srcHost, destHost].forEach((host) => {
      if (host && !entityMap.has(`host:${host}`)) {
        const isCritical = criticalAssets.includes(host) || host.startsWith('DB');
        const isCompromised = affectedHosts.includes(host);

        let icon = 'computer';
        let subLabel = 'Workstation';
        if (host.startsWith('DB')) {
          icon = 'database';
          subLabel = 'Database Server';
        } else if (host.startsWith('SRV')) {
          icon = 'dns';
          subLabel = 'App Server';
        } else if (host.startsWith('PC') || host.startsWith('WS')) {
          icon = 'desktop_windows';
          subLabel = 'Workstation';
        }

        entityMap.set(`host:${host}`, {
          id: `host:${host}`,
          name: host,
          type: 'host',
          label: subLabel,
          status: isCritical ? 'CRITICAL ASSET' : isCompromised ? 'COMPROMISED' : 'OBSERVED',
          icon,
          color: isCritical ? 'red' : isCompromised ? 'red' : 'blue',
          events: timeline.filter((e) => e.source_host === host || e.destination_host === host),
        });
      }
    });
  });

  // 3. Add any additional observed infrastructure from infrastructure.hosts
  const allInfraHosts = infrastructure.hosts || [];
  allInfraHosts.forEach((host) => {
    if (!entityMap.has(`host:${host}`)) {
      let icon = 'computer';
      let subLabel = 'Host';
      if (host.startsWith('DC')) {
        icon = 'domain';
        subLabel = 'Domain Controller';
      } else if (host.startsWith('WS')) {
        icon = 'desktop_windows';
        subLabel = 'Workstation';
      } else if (host.toLowerCase().includes('file')) {
        icon = 'description';
        subLabel = 'Sensitive Data';
      }

      entityMap.set(`host:${host}`, {
        id: `host:${host}`,
        name: host,
        type: 'observed',
        label: subLabel,
        status: 'OBSERVED',
        icon,
        color: 'blue',
        events: [],
      });
    }
  });

  const entityNodes = Array.from(entityMap.values());

  // Build dynamic directed edges between entities
  const graphEdges = [];

  // User -> First Host Edge
  const firstEvent = timeline[0];
  if (firstEvent && firstEvent.user && firstEvent.source_host) {
    graphEdges.push({
      id: `edge:user->${firstEvent.source_host}`,
      source: `user:${firstEvent.user}`,
      target: `host:${firstEvent.source_host}`,
      relationship: 'Authenticates',
      timestamp: firstEvent.timestamp ? firstEvent.timestamp.split('T')[1] || firstEvent.timestamp : '10:00:30',
      event: firstEvent,
      type: 'user-auth',
    });
  }

  // Host -> Host Transitions from timeline
  timeline.forEach((event) => {
    const srcHost = event.source_host;
    const destHost = event.destination_host;

    if (srcHost && destHost && srcHost !== destHost) {
      const edgeId = `edge:${srcHost}->${destHost}`;
      if (!graphEdges.some((e) => e.id === edgeId)) {
        let relLabel = 'Lateral Movement';
        if (destHost.startsWith('DB') || event.stage === 'Database Access') {
          relLabel = 'Database Connection';
        } else if (event.stage === 'Privilege Escalation') {
          relLabel = 'Privilege Escalation';
        } else if (event.stage === 'Initial Access') {
          relLabel = 'Initial Access';
        }

        const timeStr = event.timestamp ? (event.timestamp.includes('T') ? event.timestamp.split('T')[1] : event.timestamp) : '';

        graphEdges.push({
          id: edgeId,
          source: `host:${srcHost}`,
          target: `host:${destHost}`,
          relationship: relLabel,
          timestamp: timeStr,
          event: event,
          type: 'host-transition',
        });
      }
    }
  });

  // Calculate layout positions for nodes in a clean topological structure
  const nodePositions = new Map();

  if (layoutDirection === 'horizontal') {
    // Left-to-right topology
    let currentX = 80;
    const centerY = 180;

    // Place user node
    const userNode = entityNodes.find((n) => n.type === 'user');
    if (userNode) {
      nodePositions.set(userNode.id, { x: currentX, y: centerY });
      currentX += 180;
    }

    // Place compromised host chain (PC-25 -> SRV-02 -> DB-01)
    const hostChain = entityNodes.filter((n) => n.type === 'host');
    hostChain.forEach((hn, idx) => {
      nodePositions.set(hn.id, { x: currentX + idx * 220, y: centerY });
    });

    // Place observed nodes slightly offset
    const observedNodes = entityNodes.filter((n) => n.type === 'observed');
    observedNodes.forEach((on, idx) => {
      const parentX = currentX + (idx + 1) * 200;
      nodePositions.set(on.id, { x: parentX, y: centerY + (idx % 2 === 0 ? 130 : -130) });
    });
  } else {
    // Top-to-bottom layout
    let currentY = 70;
    const centerX = 360;

    entityNodes.forEach((n, idx) => {
      nodePositions.set(n.id, { x: centerX + (idx % 2 === 0 ? 0 : 40), y: currentY });
      currentY += 130;
    });
  }

  const handleNodeClick = (node) => {
    setSelectedEdgeInfo(null);
    if (node.events && node.events.length > 0 && onSelectEvent) {
      onSelectEvent(node.events[0]);
    }
  };

  const handleEdgeClick = (edge) => {
    setSelectedEdgeInfo(edge);
    if (edge.event && onSelectEvent) {
      onSelectEvent(edge.event);
    }
  };

  const handleEventRowClick = (eventNode) => {
    setSelectedEdgeInfo(null);
    const ev = timeline.find((item) => item.event_id === eventNode.id);
    if (ev && onSelectEvent) onSelectEvent(ev);
  };

  return (
    <div className="border border-main bg-surface p-6 rounded space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-main gap-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-primary flex items-center space-x-2">
            <span>Infrastructure Attack Graph</span>
          </h2>
          <p className="text-xs text-muted">
            Interactive infrastructure graph showing the attack path and relationships
          </p>
        </div>

        {/* Header Legend Badges & Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono-code">
          {/* Legend Items */}
          <div className="flex items-center space-x-3 bg-main/80 border border-main px-3 py-1.5 rounded">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-[0_0_6px_#ef4444]" />
              <span className="text-muted">Compromised</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="text-muted">Involved</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
              <span className="text-muted">Observed</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="text-muted">User</span>
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={layoutDirection}
              onChange={(e) => setLayoutDirection(e.target.value)}
              className="bg-main border border-main text-primary text-xs rounded px-2.5 py-1 font-mono-code focus:outline-none"
            >
              <option value="horizontal">Layout: Horizontal</option>
              <option value="vertical">Layout: Vertical</option>
            </select>

            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 1.4))}
              className="p-1 bg-main hover:bg-surface border border-main rounded text-primary text-xs"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.7))}
              className="p-1 bg-main hover:bg-surface border border-main rounded text-primary text-xs"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 bg-main hover:bg-surface border border-main rounded text-primary text-xs"
              title="Reset View"
            >
              <span className="material-symbols-outlined text-sm">crop_free</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Node-Edge SVG Canvas */}
      <div className="relative bg-main/90 border border-main rounded-lg overflow-hidden min-h-[420px] flex items-center justify-center p-4">
        <div
          className="w-full h-full min-h-[380px] relative transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* SVG Connector Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 min-h-[380px]">
            <defs>
              <marker
                id="arrow-green"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
              </marker>
              <marker
                id="arrow-red"
                viewBox="0 0 10 10"
                refX="24"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
              </marker>
              <marker
                id="arrow-blue"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
              </marker>
            </defs>

            {/* Render Edge Connector Lines */}
            {graphEdges.map((edge) => {
              const srcPos = nodePositions.get(edge.source);
              const destPos = nodePositions.get(edge.target);

              if (!srcPos || !destPos) return null;

              const isSelected = selectedEdgeInfo && selectedEdgeInfo.id === edge.id;
              const markerId = edge.type === 'user-auth' ? 'url(#arrow-green)' : 'url(#arrow-red)';
              const strokeColor = isSelected
                ? '#10b981'
                : edge.type === 'user-auth'
                ? '#10b981'
                : '#ef4444';

              const midX = (srcPos.x + destPos.x) / 2;
              const midY = (srcPos.y + destPos.y) / 2;

              return (
                <g key={edge.id} className="pointer-events-auto cursor-pointer" onClick={() => handleEdgeClick(edge)}>
                  <line
                    x1={srcPos.x}
                    y1={srcPos.y}
                    x2={destPos.x}
                    y2={destPos.y}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 3 : 2}
                    strokeDasharray={edge.type === 'user-auth' ? '4,4' : 'none'}
                    markerEnd={markerId}
                    className="transition-all hover:stroke-width-3"
                  />

                  {/* Edge Label Pill */}
                  <g transform={`translate(${midX}, ${midY - 12})`}>
                    <rect
                      x="-45"
                      y="-10"
                      width="90"
                      height="18"
                      rx="4"
                      fill="#13151b"
                      stroke={isSelected ? '#10b981' : '#232731'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      fill={isSelected ? '#10b981' : '#9ca3af'}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="600"
                    >
                      {edge.relationship}
                    </text>
                  </g>

                  {/* Timestamp sublabel */}
                  {edge.timestamp && (
                    <text
                      x={midX}
                      y={midY + 16}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="8"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {edge.timestamp}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML Node Layer */}
          <div className="relative z-10 w-full h-full min-h-[380px]">
            {entityNodes.map((node) => {
              const pos = nodePositions.get(node.id) || { x: 100, y: 180 };
              const isSelected =
                selectedEvent &&
                (selectedEvent.user === node.name ||
                  selectedEvent.source_host === node.name ||
                  selectedEvent.destination_host === node.name);

              const isCritical = node.status === 'CRITICAL ASSET';
              const isCompromised = node.status === 'COMPROMISED';
              const isUser = node.type === 'user';

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  style={{
                    position: 'absolute',
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="cursor-pointer group flex flex-col items-center select-none"
                >
                  {/* Circular Node Symbol */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCritical
                        ? isSelected
                          ? 'bg-[#ef4444]/30 border-2 border-[#ef4444] shadow-[0_0_25px_rgba(239,68,68,0.6)]'
                          : 'bg-[#ef4444]/20 border-2 border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                        : isCompromised
                        ? isSelected
                          ? 'bg-[#ef4444]/30 border-2 border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                          : 'bg-[#ef4444]/20 border-2 border-[#ef4444]/80'
                        : isUser
                        ? isSelected
                          ? 'bg-[#10b981]/30 border-2 border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                          : 'bg-[#10b981]/20 border-2 border-[#10b981]'
                        : 'bg-surface border-2 border-[#3b82f6]/60 hover:border-[#3b82f6]'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl ${
                        isCritical || isCompromised
                          ? 'text-[#ef4444]'
                          : isUser
                          ? 'text-[#10b981]'
                          : 'text-[#3b82f6]'
                      }`}
                    >
                      {node.icon}
                    </span>
                  </div>

                  {/* Entity Label below circle */}
                  <div className="mt-2 text-center flex flex-col items-center">
                    <span className="text-xs font-bold font-mono-code text-primary tracking-wide">
                      {node.name}
                    </span>
                    <span className="text-[10px] font-mono-code text-muted">
                      {node.label}
                    </span>

                    {/* Status Pill */}
                    <span
                      className={`mt-1 text-[8px] font-mono-code px-2 py-0.5 rounded font-bold uppercase ${
                        isCritical
                          ? 'bg-[#ef4444] text-white shadow-sm'
                          : isCompromised
                          ? 'bg-[#ef4444]/20 border border-[#ef4444]/50 text-[#ef4444]'
                          : isUser
                          ? 'bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981]'
                          : 'bg-main border border-main text-muted'
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edge Details Card */}
      {selectedEdgeInfo && (
        <div className="p-4 border border-[#10b981]/40 bg-[#10b981]/10 rounded space-y-1 text-xs font-mono-code flex items-center justify-between">
          <div>
            <div className="font-semibold text-primary">
              Causal Relationship: <span className="text-[#10b981]">{selectedEdgeInfo.source}</span> → <span className="text-[#10b981]">{selectedEdgeInfo.target}</span>
            </div>
            <div className="text-muted mt-0.5">
              Type: <span className="font-bold text-primary">{selectedEdgeInfo.relationship}</span> | Triggering Event: <span className="text-[#10b981]">{selectedEdgeInfo.event?.event_id}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedEdgeInfo(null)}
            className="text-xs text-muted hover:text-primary underline px-2 py-1"
          >
            Clear
          </button>
        </div>
      )}

      {/* Secondary Section: Event Correlation Roster */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-code text-muted uppercase">
            EVENT CORRELATION TELEMETRY ROSTER ({nodes.length} EVENTS)
          </span>
          <span className="text-[10px] font-mono-code text-muted">
            Click row to inspect in Event Inspector
          </span>
        </div>

        <div className="overflow-x-auto border border-main rounded">
          <table className="w-full text-left text-xs font-mono-code">
            <thead className="bg-main/90 border-b border-main text-muted">
              <tr>
                <th className="p-2.5">Event ID</th>
                <th className="p-2.5">Stage</th>
                <th className="p-2.5">Event Type</th>
                <th className="p-2.5">Source Host</th>
                <th className="p-2.5">Destination Host</th>
                <th className="p-2.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-main bg-surface">
              {nodes.map((node) => {
                const isSelected = selectedEvent && (selectedEvent.event_id === node.id || selectedEvent.id === node.id);

                return (
                  <tr
                    key={node.id}
                    onClick={() => handleEventRowClick(node)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#10b981]/15 font-semibold text-primary'
                        : 'hover:bg-main/50 text-muted'
                    }`}
                  >
                    <td className="p-2.5 text-[#10b981] font-semibold">{node.id}</td>
                    <td className="p-2.5 text-primary">{node.stage}</td>
                    <td className="p-2.5">{node.label}</td>
                    <td className="p-2.5 text-primary">{node.host || 'N/A'}</td>
                    <td className="p-2.5 text-primary">{node.destination || 'N/A'}</td>
                    <td className="p-2.5">{node.timestamp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
