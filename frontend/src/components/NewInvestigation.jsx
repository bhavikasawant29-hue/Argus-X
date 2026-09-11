import React, { useState } from 'react';
import { fetchDemoIncident, analyzeTelemetry } from '../services/api';

export default function NewInvestigation({ onAnalysisComplete }) {
  const [files, setFiles] = useState({
    authentication: null,
    endpoint: null,
    network: null,
    application: null,
  });

  const [eventCounts, setEventCounts] = useState({
    authentication: 0,
    endpoint: 0,
    network: 0,
    application: 0,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState('READING');
  const [analysisText, setAnalysisText] = useState('Initiating engine analysis...');
  const [errorMessage, setErrorMessage] = useState(null);

  const countCSVRows = (file, key) => {
    if (!file) {
      setEventCounts(prev => ({ ...prev, [key]: 0 }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      const count = Math.max(0, lines.length - 1);
      setEventCounts(prev => ({ ...prev, [key]: count }));
    };
    reader.readAsText(file);
  };

  const handleFileChange = (key, file) => {
    setFiles(prev => ({ ...prev, [key]: file }));
    setErrorMessage(null);
    countCSVRows(file, key);
  };

  const runAnalysisAnimation = async (asyncTask) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisPhase('READING');
    setAnalysisText('Reading telemetry across feeds...');

    const timer1 = setTimeout(() => {
      setAnalysisPhase('NORMALIZING');
      setAnalysisText('Normalizing timestamps and user identities...');
    }, 400);

    const timer2 = setTimeout(() => {
      setAnalysisPhase('CORRELATING');
      setAnalysisText('Correlating cross-tier causal links...');
    }, 800);

    const timer3 = setTimeout(() => {
      setAnalysisPhase('VERIFYING');
      setAnalysisText('Verifying evidence & blast radius...');
    }, 1200);

    try {
      const data = await asyncTask();
      setAnalysisPhase('COMPLETE');
      setAnalysisText('Analysis complete ✓');
      setTimeout(() => {
        setIsAnalyzing(false);
        onAnalysisComplete(data);
      }, 400);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsAnalyzing(false);
      const msg = err.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('Backend unavailable')) {
        setErrorMessage('ARGUS-X backend unavailable. Start the FastAPI server and retry.');
      } else {
        setErrorMessage(msg || 'Analysis failed');
      }
    }
  };

  const handleLoadDemo = () => {
    runAnalysisAnimation(() => fetchDemoIncident());
  };

  const handleAnalyzeUpload = () => {
    if (!files.authentication && !files.endpoint && !files.network && !files.application) {
      setErrorMessage('Please select at least one CSV telemetry file to analyze.');
      return;
    }
    runAnalysisAnimation(() => analyzeTelemetry(files));
  };

  const totalUploadedEvents = Object.values(eventCounts).reduce((a, b) => a + b, 0);

  return (
    <section className="max-w-5xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
      <div className="mb-10 text-left border-b border-main pb-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-surface border border-main text-xs text-muted rounded-[3px] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
          <span className="font-mono-code text-[11px]">TELEMETRY INGESTION PIPELINE</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-primary">
          Start a New Security Investigation
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-2">
          Select the synthetic benchmark incident or upload custom multi-tier CSV logs for real-time attack reconstruction.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-[4px] border border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444] text-xs font-mono-code flex items-start space-x-3">
          <span className="material-symbols-outlined text-sm pt-0.5">error</span>
          <div>
            <div className="font-semibold uppercase tracking-wider">Ingestion / Analysis Error</div>
            <div className="mt-0.5">{errorMessage}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Option A: Demo Incident */}
        <div className="border border-main bg-surface p-7 rounded-[4px] flex flex-col justify-between hover:border-main/80 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code text-[#10b981] uppercase tracking-wider font-semibold">Option A</span>
              <span className="px-2 py-0.5 rounded-[3px] border border-[#10b981]/30 bg-[#10b981]/10 text-[10px] font-mono-code text-[#10b981] font-medium">
                BENCHMARK DATASET
              </span>
            </div>
            <h3 className="text-xl font-semibold text-primary">
              Load Synthetic Multi-Source Incident
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Ingests 809 raw events across authentication, endpoint, network, and application feeds to reconstruct the PC-25 → SRV-02 → DB-01 intrusion chain.
            </p>
            <div className="pt-3 space-y-2 border-t border-main font-mono-code text-xs text-muted">
              <div className="flex justify-between">
                <span>Sources:</span>
                <span className="text-primary">4 Feeds (CSV)</span>
              </div>
              <div className="flex justify-between">
                <span>Total Telemetry:</span>
                <span className="text-primary font-semibold">809 Events</span>
              </div>
              <div className="flex justify-between">
                <span>Target Asset:</span>
                <span className="text-[#ef4444] font-semibold">DB-01</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLoadDemo}
            disabled={isAnalyzing}
            className="mt-8 w-full py-3 bg-[#10b981] hover:bg-[#059669] text-gray-950 text-xs font-semibold tracking-wider uppercase transition-colors rounded-[3px] shadow-sm flex items-center justify-center space-x-2 font-mono-code disabled:opacity-50"
          >
            <span>Load Demo Incident</span>
            <span>→</span>
          </button>
        </div>

        {/* Option B: Upload CSV Telemetry */}
        <div className="border border-main bg-surface p-7 rounded-[4px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code text-muted uppercase tracking-wider font-semibold">Option B</span>
              <span className="px-2 py-0.5 rounded-[3px] border border-main bg-main text-[10px] font-mono-code text-muted font-medium">
                CUSTOM CSV FILES
              </span>
            </div>
            <h3 className="text-xl font-semibold text-primary">
              Upload Telemetry Logs
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Supply your CSV logs. The backend engine normalizes timestamps, correlates user identity, and computes evidence paths.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                { label: 'Authentication CSV', key: 'authentication' },
                { label: 'Endpoint CSV', key: 'endpoint' },
                { label: 'Network CSV', key: 'network' },
                { label: 'Application CSV', key: 'application' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-2.5 rounded-[3px] border border-main bg-main/50 text-xs font-mono-code">
                  <div className="flex flex-col">
                    <span className="text-primary font-sans font-medium">{item.label}</span>
                    {files[item.key] ? (
                      <span className="text-[#10b981] text-[11px] flex items-center space-x-1 mt-0.5 font-semibold">
                        <span>✓ {files[item.key].name}</span>
                        <span className="text-muted font-normal">({eventCounts[item.key]} events)</span>
                      </span>
                    ) : (
                      <span className="text-muted text-[11px] font-normal">No file selected</span>
                    )}
                  </div>
                  <label className="px-3 py-1 bg-surface border border-main hover:bg-surface-hover text-primary text-[11px] rounded-[3px] cursor-pointer transition-colors">
                    Browse
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => handleFileChange(item.key, e.target.files[0] || null)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyzeUpload}
            disabled={isAnalyzing}
            className="mt-8 w-full py-3 border border-main bg-surface hover:bg-surface-hover text-primary text-xs font-semibold tracking-wider uppercase transition-colors rounded-[3px] shadow-sm flex items-center justify-center space-x-2 font-mono-code disabled:opacity-50"
          >
            <span>Analyze Telemetry ({totalUploadedEvents} events)</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Loading Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-main/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-main bg-surface p-6 rounded-[4px] space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-main font-mono-code">
              <span className="text-xs uppercase text-muted">Analysis Engine Status</span>
              <span className="text-xs text-[#10b981] font-semibold">{analysisPhase}</span>
            </div>
            
            <div className="space-y-2">
              <div className="w-full h-1.5 bg-main rounded overflow-hidden border border-main">
                <div
                  className="h-full bg-[#10b981] transition-all duration-300"
                  style={{
                    width:
                      analysisPhase === 'READING' ? '25%' :
                      analysisPhase === 'NORMALIZING' ? '50%' :
                      analysisPhase === 'CORRELATING' ? '75%' :
                      analysisPhase === 'VERIFYING' ? '90%' : '100%'
                  }}
                ></div>
              </div>
              <p className="text-xs font-mono-code text-primary text-center pt-1">
                {analysisText}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
