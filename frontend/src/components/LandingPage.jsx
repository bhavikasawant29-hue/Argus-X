import React from 'react';

export default function LandingPage({ onStartInvestigation }) {
  return (
    <section className="min-h-screen flex flex-col bg-main text-primary">
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-surface border border-main text-xs text-muted rounded-[3px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              <span className="font-mono-code text-[11px]">ARGUS CORRELATION ENGINE V2.4 ACTIVE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-primary">
              From fragmented telemetry to a reconstructed attack.
            </h1>
            <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed font-normal">
              ARGUS-X correlates authentication, endpoint, network, and application telemetry to reconstruct what happened, connect conclusions to evidence, identify what remains unknown, and show where the attack could have been stopped.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartInvestigation}
                className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-gray-950 text-xs font-semibold uppercase tracking-wider transition-colors rounded-[3px] shadow-sm flex items-center space-x-2 font-mono-code"
              >
                <span>Start Investigation</span>
                <span>→</span>
              </button>
              <a
                href="#pipeline"
                className="px-4 py-2.5 border border-main bg-surface text-primary hover:bg-surface-hover text-xs font-medium uppercase tracking-wider transition-colors rounded-[3px] font-mono-code"
              >
                How it Works
              </a>
            </div>
            <div className="pt-6 border-t border-main flex items-center space-x-8 text-xs text-muted">
              <div>
                <span className="text-primary font-semibold font-mono-code">809</span> events in benchmark
              </div>
              <div className="w-1 h-1 rounded-full bg-main border border-main"></div>
              <div>
                <span className="text-primary font-semibold font-mono-code">4</span> cross-tier telemetry feeds
              </div>
              <div className="w-1 h-1 rounded-full bg-main border border-main"></div>
              <div>
                <span className="text-[#10b981] font-semibold font-mono-code">100%</span> evidence confidence
              </div>
            </div>
          </div>

          {/* Conceptual Pipeline Flow Graphic */}
          <div className="lg:col-span-5">
            <div className="border border-main bg-surface p-6 rounded-[4px] space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-main">
                <span className="text-xs font-mono-code uppercase tracking-wider text-muted">Ingestion to Narrative Pipeline</span>
                <span className="text-[11px] font-mono-code text-[#10b981] flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                  <span>Engine Ready</span>
                </span>
              </div>
              
              <div className="py-4 flex flex-col items-center justify-center space-y-1.5 font-mono-code text-xs">
                <div className="w-full py-2 px-3 rounded-[3px] border border-main bg-main/80 text-center text-primary">
                  TELEMETRY INGESTION (4 FEEDS)
                </div>
                <div className="text-[#10b981] text-xs font-bold py-0.5">↓</div>
                <div className="w-full py-2 px-3 rounded-[3px] border border-main bg-main/80 text-center text-primary">
                  CROSS-TIER IDENTITY CORRELATION
                </div>
                <div className="text-[#10b981] text-xs font-bold py-0.5">↓</div>
                <div className="w-full py-2 px-3 rounded-[3px] border border-main bg-main/80 text-center text-primary">
                  ATTACK CHAIN RECONSTRUCTION
                </div>
                <div className="text-[#10b981] text-xs font-bold py-0.5">↓</div>
                <div className="w-full py-2 px-3 rounded-[3px] border border-main bg-main/80 text-center text-primary">
                  EVIDENCE & GAP VERIFICATION
                </div>
                <div className="text-[#10b981] text-xs font-bold py-0.5">↓</div>
                <div className="w-full py-2 px-3 rounded-[3px] border border-[#10b981]/40 bg-[#10b981]/10 text-center text-[#10b981] font-semibold">
                  GROUNDED ATTACK NARRATIVE
                </div>
              </div>

              <div className="pt-4 border-t border-main flex items-center justify-between text-xs font-mono-code">
                <span className="text-muted">Target Path:</span>
                <span className="font-medium text-primary">
                  PC-25 <span className="text-muted">→</span> SRV-02 <span className="text-muted">→</span> <span className="text-[#ef4444]">DB-01</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pillars */}
        <section className="mt-24 pt-16 border-t border-main" id="pipeline">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs uppercase tracking-wider font-mono-code text-muted">The Analysis Problem</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight leading-snug">
                Security events don't arrive as a narrative.
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Raw SIEM logs split attack steps into thousands of isolated rows. ARGUS-X normalizes identities, computes causal correlation scores, and builds a verified attack chain.
              </p>
            </div>
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-5 border border-main bg-surface rounded-[4px] space-y-2">
                <div className="text-[11px] font-mono-code text-[#10b981]">01. CORRELATION ENGINE</div>
                <h3 className="text-xs font-semibold text-primary uppercase font-mono-code">Cross-Tier User & Host Linking</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Links authentication events to endpoint processes and network connections using temporal and identity alignment.
                </p>
              </div>
              <div className="p-5 border border-main bg-surface rounded-[4px] space-y-2">
                <div className="text-[11px] font-mono-code text-[#10b981]">02. ATTACK RECONSTRUCTION</div>
                <h3 className="text-xs font-semibold text-primary uppercase font-mono-code">Grounded Attack Chain</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Transforms correlated telemetry into chronological stages from Initial Access to Database Access.
                </p>
              </div>
              <div className="p-5 border border-main bg-surface rounded-[4px] space-y-2">
                <div className="text-[11px] font-mono-code text-[#10b981]">03. EVIDENCE & GAPS</div>
                <h3 className="text-xs font-semibold text-primary uppercase font-mono-code">Gaps & Telemetry Advice</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Evaluates supporting evidence, identifies missing telemetry sources, and generates remediation advice.
                </p>
              </div>
              <div className="p-5 border border-main bg-surface rounded-[4px] space-y-2">
                <div className="text-[11px] font-mono-code text-[#10b981]">04. COUNTERFACTUAL WHAT-IF</div>
                <h3 className="text-xs font-semibold text-primary uppercase font-mono-code">Containment Simulation</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Simulates blocking key attack stages to determine downstream containment impact.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </section>
  );
}
