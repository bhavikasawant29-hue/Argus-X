---
name: Precision Editorial Security
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393d'
  surface-container-lowest: '#0c0e11'
  surface-container-low: '#1a1c1f'
  surface-container: '#1e2023'
  surface-container-high: '#282a2d'
  surface-container-highest: '#333538'
  on-surface: '#e2e2e6'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#e2e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#4ae176'
  on-secondary: '#003915'
  secondary-container: '#00b954'
  on-secondary-container: '#004119'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#e29100'
  on-tertiary-container: '#523200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#111317'
  on-background: '#e2e2e6'
  surface-variant: '#333538'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system embodies a disciplined, investigative intelligence posture. Built for national-grade analysts, incident responders, and forensic specialists, the aesthetic balances high-density technical analysis with editorial clarity.

The visual direction rejects neon cyberpunk tropes, decorative drop shadows, and glowing glassmorphism in favor of structured architectural planes, crisp hairline rules, disciplined typography, and deep obsidian canvases. The emotional response is one of total operational command: calm, calculated, authoritative, and frictionless.

Key stylistic pillars:
- **Editorial Typography:** Clear typographic hierarchies that transform massive volumes of telemetry and graph connections into readable narrative intelligence.
- **Architectural Framing:** Precision wireframes constructed with razor-thin 1px borders, structural data rails, and strict alignment grids.
- **Controlled Saturation:** 95% chromatic restraint. Color serves strictly as semantic signal, state confirmation, or active focus—never as surface decoration.

## Colors
The palette relies on deep, non-reflective slate-blacks, matte surfacing, and functional signaling.

### Canvas & Surface Layers
- **Canvas Base:** `#0c0e11` (Deep charcoal canvas, non-reflective)
- **Surface Level 1:** `#13171d` (Base panels, structural workspaces, side rails)
- **Surface Level 2:** `#1a202c` (Interactive cells, selected rows, active inspector panels)
- **Surface Level 3:** `#232936` (Hover surfaces, embedded detail tables, tooltips)

### Structural Outlines & Dividers
- **Hairline Subtle:** `#232936` (Primary structural grid, container outlines, pane splitters)
- **Hairline Moderate:** `#2d3748` (Selected borders, focused partitions, active tab baselines)

### Typography & Content
- **Primary High-Contrast:** `#f3f4f6` (Headlines, primary metrics, active event indicators)
- **Secondary Muted:** `#9ca3af` (Supporting context, telemetry labels, metadata values)
- **Tertiary Faint:** `#6b7280` (Disabled states, column headers, protocol prefixes)

### Semantic & Analytical Signaling
- **Operational Accent / Verified:** `#10b981` (Primary interaction hooks, verified chain of custody, confirmed IOCs)
- **Evidence Gap / Warning:** `#f59e0b` (Uncorrelated nodes, anomaly flags, missing audit logs)
- **Critical / Threat Blocked:** `#ef4444` (Confirmed malware execution, active exfiltration, kill-switch status)
- **Informational / Neutral Telemetry:** `#94a3b8` (System daemons, raw query returns)

## Typography
Typographic discipline pairs the balanced grotesque proportions of **Geist** with the mechanical exactitude of **JetBrains Mono**.

- **Editorial Narrative:** Use Geist for dashboard summaries, timeline debriefs, investigative notes, and core UI controls. Keep headline weights restrained to medium (500) and semibold (600)—never heavy or playful.
- **Telemetry Precision:** Use JetBrains Mono exclusively for non-human narrative items: IP addresses, CIDR blocks, SHA-256 hashes, MITRE ATT&CK technique IDs, ISO-8601 UTC timestamps, and process trees.
- **All-Caps Classification:** Apply `label-caps` for operational classification levels, protocol badges, column field descriptors, and telemetry groupings.

## Layout & Spacing
The layout implements a dense, technical pane system that adapts from fluid multi-column workspaces on large diagnostic displays to single-pane investigation streams on portable screens.

### Workspaces and Layout Model
- **Grid Architecture:** 12-column variable responsive framework with fixed sidebars. Standard navigation rail is fixed at 64px width (collapsible) or 260px (expanded context).
- **Desktop (>= 1440px):** Multi-pane split layouts (Timeline, Graph/Canvas, Inspector Rail) separated by thin 1px persistent rules. Section gutters scale to `1.5rem`, outer margins to `2rem`.
- **Tablet (768px – 1439px):** Inspector rails convert to off-canvas slide-out drawers. Workspace shifts to single or dual panes with `1rem` gutters.
- **Mobile (< 768px):** Strict single-column stack. Heavy data tables convert to mono card key-value blocks. Outer canvas margin shrinks to `1rem`.

Component padding strictly enforces an 8px base rhythm (`0.5rem` for compact controls, `1rem` for panel sections).

## Elevation & Depth
Elevation is achieved exclusively through **tonal layering** and **low-contrast architectural outlines**. Diffuse shadows, colored drop glows, and blurred glass surfaces are omitted.

### Layer Hierarchy
1. **Base Slate (`#0c0e11`):** Underlying viewport canvas.
2. **Primary Work Surface (`#13171d`):** Data tables, investigative canvases, timeline views. Framed with a 1px border of `#232936`.
3. **Elevated Overlays & Panels (`#1a202c`):** Context drawers, side inspectors, active drill-downs. Separated by a 1px border of `#2d3748`.
4. **Transient Floating Overlays (`#232936`):** Command palettes, context menus, raw packet hex inspectors. Uses a solid background, a 1px border of `#2d3748`, and a dark shadow (`rgba(0, 0, 0, 0.45)` at 12px blur, 0px spread) for legibility against underlying tables.

## Shapes
Shapes emphasize functional precision through tight, understated geometries.

- **Standard Radius:** All interactive buttons, input fields, badges, and panel corners use a strict `0.25rem` (4px) corner radius.
- **Containers & Split-Panes:** Large layout panels, graph regions, and structural viewports use a crisp `0px` radius at viewport edges and `0.25rem` when contained as distinct data tiles.
- **No Circular UI:** Avoid pill buttons and fully rounded badges. Everything reflects structured, modular construction.

## Components

### Buttons & Action Controls
- **Primary:** Background `#10b981`, foreground `#0c0e11`, weight 500, radius 4px. No box shadow. Hover transitions to `#22c55e`.
- **Secondary / Ghost:** Background `transparent`, border 1px `#2d3748`, text `#f3f4f6`. Hover shifts border to `#9ca3af` and background to `#1a202c`.
- **Destructive Action:** Background `transparent`, border 1px `#ef4444`, text `#ef4444`. Hover fills with `rgba(239, 68, 68, 0.1)`.

### Chips & Evidence Badges
- Constructed with `label-caps` in JetBrains Mono.
- **Verified / Confirmed:** Border 1px `rgba(16, 185, 129, 0.3)`, text `#10b981`, background `rgba(16, 185, 129, 0.05)`.
- **Warning / Anomaly:** Border 1px `rgba(245, 158, 11, 0.3)`, text `#f59e0b`, background `rgba(245, 158, 11, 0.05)`.
- **Critical Alert:** Border 1px `rgba(239, 68, 68, 0.4)`, text `#ef4444`, background `rgba(239, 68, 68, 0.08)`.

### Input & Query Fields
- Background `#13171d`, border 1px `#232936`, radius 4px, text `#f3f4f6`.
- Focused state replaces border with `#10b981` with zero focus glow or spread rings.
- Query bars (e.g., KQL/regex builders) utilize JetBrains Mono (`code-md`) with inline syntax coloring.

### Data Tables & Log Lists
- Rows have fixed heights (36px for dense logs, 48px for entity rosters).
- Bottom borders are 1px `#232936`. Alternating row striping is omitted; depth is indicated strictly by hover fill (`#1a202c`).
- Monospace alignment: Timestamps, IP addresses, and hash values are tabular and right- or left-aligned with strict character column widths.

### Cards & Inspector Panels
- Solid `#13171d` background, 1px `#232936` frame.
- Headers are separated from card content by a continuous 1px `#232936` horizontal rule, using `headline-sm` with secondary metadata positioned to the right.

### Forensic Hex & Packet Inspectors
- Monospaced 3-column split view (Byte offset, Hex bytes, ASCII translation) rendered on `#0c0e11` with hairline dividers. Selected byte sequences highlighted in `rgba(16, 185, 129, 0.15)` with text in `#10b981`.