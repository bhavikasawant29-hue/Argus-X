import React, { useState } from 'react';
import { runAIInvestigation } from '../../services/api';

export default function AIInvestigatorTab({ timeline, evidence, gaps, blastRadius, onInspectRawEvent }) {
  const [query, setQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const presetQuestions = [
    "How did the attacker reach DB-01?",
    "What evidence supports Lateral Movement?",
    "Where could the intrusion have been stopped?",
  ];

  const handleAsk = async (qText) => {
    const textToSubmit = qText || query;
    if (!textToSubmit.trim()) return;

    setIsQuerying(true);
    setError(null);

    const contextData = {
      timeline,
      evidence,
      gaps,
      blast_radius: blastRadius,
    };

    try {
      const res = await runAIInvestigation(textToSubmit, null, contextData);
      setResult({
        question: textToSubmit,
        answer: res.answer,
        evidenceRefs: res.evidence_refs || [],
        confidence: res.confidence ?? 0,
      });
    } catch (err) {
      setError(err.message || 'AI Investigation request failed');
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="border border-main bg-surface p-6 rounded space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-main">
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-[#10b981]">psychology</span>
          <span className="text-xs font-mono-code text-primary uppercase tracking-wider font-semibold">
            Evidence-Grounded AI Investigator
          </span>
        </div>
        <span className="text-xs font-mono-code text-[#10b981]">BACKEND GROUNDED VERIFICATION</span>
      </div>

      {/* Preset Questions */}
      <div className="space-y-2">
        <span className="text-xs font-mono-code text-muted">Suggested Investigative Queries:</span>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(q);
                handleAsk(q);
              }}
              className="px-3 py-1.5 rounded border border-main bg-main hover:bg-main/80 text-xs font-mono-code text-primary transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about the reconstructed telemetry evidence..."
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            className="flex-1 px-4 py-2.5 rounded border border-main bg-main text-xs text-primary font-mono-code focus:outline-none focus:border-[#10b981]"
          />
          <button
            onClick={() => handleAsk()}
            disabled={isQuerying}
            className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-gray-950 text-xs font-semibold uppercase tracking-wider rounded transition-colors disabled:opacity-50 font-mono-code"
          >
            {isQuerying ? 'Querying...' : 'Ask AI'}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded border border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444] text-xs font-mono-code">
            {error}
          </div>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <div className="p-5 border border-main bg-main/80 rounded space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-main">
            <span className="text-xs font-mono-code text-muted">Query: "{result.question}"</span>
            <span className="px-2.5 py-0.5 rounded border border-[#10b981]/30 bg-[#10b981]/10 text-xs font-mono-code text-[#10b981] font-semibold">
              Calculated Confidence: {result.confidence}%
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono-code text-muted uppercase">Investigative Answer</span>
            <p className="text-xs text-primary leading-relaxed font-sans bg-surface p-4 rounded border border-main">
              {result.answer}
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-xs font-mono-code text-muted uppercase">Supporting Evidence References</span>
            <div className="flex flex-wrap gap-2">
              {result.evidenceRefs.length > 0 ? (
                result.evidenceRefs.map(refId => (
                  <button
                    key={refId}
                    onClick={() => onInspectRawEvent(refId)}
                    className="px-2.5 py-1 rounded bg-surface border border-main text-xs font-mono-code text-[#10b981] hover:underline"
                  >
                    {refId}
                  </button>
                ))
              ) : (
                <span className="text-xs font-mono-code text-muted">No explicit evidence references returned.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
