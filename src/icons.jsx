/* Inline SVG icons. Stroke-based, 1.5px, 24px viewport. */
const I = ({children, size=18, color='currentColor', sw=1.5, fill='none'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const Icon = {
  ArrowRight: (p)=> <I {...p}><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></I>,
  Play:       (p)=> <I {...p} fill="currentColor" sw={0}><path d="M7 5l12 7-12 7V5z"/></I>,
  Plug:       (p)=> <I {...p}><path d="M9 7V3"/><path d="M15 7V3"/><path d="M7 7h10v4a5 5 0 0 1-10 0V7z"/><path d="M12 16v5"/></I>,
  Brain:      (p)=> <I {...p}><path d="M9 4a3 3 0 0 0-3 3v.5A3 3 0 0 0 4 10v2a3 3 0 0 0 1 2.2A3 3 0 0 0 7 19a3 3 0 0 0 5-1.5"/><path d="M15 4a3 3 0 0 1 3 3v.5A3 3 0 0 1 20 10v2a3 3 0 0 1-1 2.2A3 3 0 0 1 17 19a3 3 0 0 1-5-1.5"/><path d="M12 4v15"/></I>,
  ShieldCheck:(p)=> <I {...p}><path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"/><path d="M9 12l2 2 4-4"/></I>,
  Layers:     (p)=> <I {...p}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 18l9 5 9-5"/></I>,
  Clock:      (p)=> <I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M3 8a9 9 0 0 1 4-5"/></I>,
  Journal:    (p)=> <I {...p}><path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4z"/><path d="M5 18h14"/><path d="M9 8h6"/><path d="M9 12h4"/></I>,
  Gauge:      (p)=> <I {...p}><path d="M3 13a9 9 0 1 1 18 0"/><path d="M12 13l5-3"/><circle cx="12" cy="13" r="1.6" fill="currentColor"/></I>,
  Bolt:       (p)=> <I {...p}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z"/></I>,
  Lock:       (p)=> <I {...p}><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></I>,
  ChartBar:   (p)=> <I {...p}><path d="M3 21h18"/><path d="M6 17v-6"/><path d="M11 17V7"/><path d="M16 17v-9"/></I>,
  Broken:     (p)=> <I {...p}><path d="M3 17l4-5 3 3 4-7 3 4 4-3"/><path d="M3 21h18"/><path d="M14 9l-2 2"/></I>,
  Check:      (p)=> <I {...p} sw={2.2}><path d="M5 12l5 5 9-11"/></I>,
  X:          (p)=> <I {...p} sw={2}><path d="M6 6l12 12"/><path d="M18 6L6 18"/></I>,
  Tilde:      (p)=> <I {...p} sw={2}><path d="M5 13c2-3 4-3 6 0s4 3 6 0"/></I>,
  Dash:       (p)=> <I {...p} sw={2}><path d="M7 12h10"/></I>,
  Logo:       (p)=> (
    <svg width={p.size||28} height={p.size||28} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" fill="#0E1116" stroke="#1E2330"/>
      <text x="6.5" y="22.5" fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700" fill="#00D4FF">S</text>
      <text x="16" y="22.5" fontFamily="'JetBrains Mono', monospace" fontSize="15" fontWeight="700" fill="#FFFFFF">T</text>
    </svg>
  ),
  XSocial:    (p)=> <I {...p} sw={1.8}><path d="M4 4l16 16"/><path d="M20 4L4 20"/></I>,
  GH:         (p)=> <I {...p}><path d="M9 19c-4 1-4-2-6-2"/><path d="M15 21v-3.5a3 3 0 0 0-.8-2.1c2.6-.3 5.3-1.3 5.3-5.7 0-1.1-.4-2.1-1.1-2.9.1-.3.5-1.4-.1-2.9 0 0-.9-.3-3 1.1a10 10 0 0 0-5.6 0C7.6 3.6 6.7 3.9 6.7 3.9c-.6 1.5-.2 2.6-.1 2.9-.7.8-1.1 1.8-1.1 2.9 0 4.3 2.7 5.4 5.3 5.7-.3.3-.6.8-.7 1.4-.6.3-2.2.7-3.1-.9 0 0-.6-1.1-1.7-1.2 0 0-1 0 0 .6 0 0 .7.4 1.2 1.6 0 0 .6 2 3.6 1.4V21"/></I>,
  Linked:     (p)=> <I {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v8"/><circle cx="8" cy="6.5" r="1.2" fill="currentColor"/><path d="M12 18v-5a3 3 0 0 1 6 0v5"/><path d="M12 10v8"/></I>,
};

window.Icon = Icon;
