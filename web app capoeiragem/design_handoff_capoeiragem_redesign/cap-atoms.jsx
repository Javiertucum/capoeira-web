/* eslint-disable react/prop-types */
/* Shared atoms used across all artboards */
const { useState } = React;

// --- Icons (minimal stroke) ---
function Icon({ d, size = 16, sw = 1.6, className = "", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      {typeof d === "string" ? <path d={d} /> : d}
    </svg>
  );
}
const I = {
  search: (p) => <Icon {...p} d="M11 4a7 7 0 1 0 4.95 11.95L20 20m-4.05-4.05A7 7 0 0 0 11 4z" />,
  pin: (p) => <Icon {...p} d={<g><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5"/></g>} />,
  arrow: (p) => <Icon {...p} d="M5 12h14M13 6l6 6-6 6" />,
  arrowL: (p) => <Icon {...p} d="M19 12H5M11 6l-6 6 6 6" />,
  globe: (p) => <Icon {...p} d={<g><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></g>} />,
  check: (p) => <Icon {...p} d="M4 12l5 5L20 6" />,
  user: (p) => <Icon {...p} d={<g><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></g>} />,
  users: (p) => <Icon {...p} d={<g><circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="3"/><path d="M22 20a6 6 0 0 0-7-5.9"/></g>} />,
  calendar: (p) => <Icon {...p} d={<g><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></g>} />,
  clock: (p) => <Icon {...p} d={<g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>} />,
  list: (p) => <Icon {...p} d="M4 6h16M4 12h16M4 18h16" />,
  map: (p) => <Icon {...p} d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />,
  menu: (p) => <Icon {...p} d="M4 7h16M4 12h16M4 17h16" />,
  close: (p) => <Icon {...p} d="M6 6l12 12M18 6L6 18" />,
  whatsapp: (p) => <Icon {...p} d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />,
  ig: (p) => <Icon {...p} d={<g><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="0.6" fill="currentColor"/></g>} />,
  yt: (p) => <Icon {...p} d={<g><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></g>} />,
  link: (p) => <Icon {...p} d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />,
  filter: (p) => <Icon {...p} d="M3 5h18M6 12h12M10 19h4" />,
  sparkle: (p) => <Icon {...p} d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />,
  plus: (p) => <Icon {...p} d="M12 5v14M5 12h14" />,
  music: (p) => <Icon {...p} d={<g><path d="M9 17V5l11-2v12"/><circle cx="6" cy="17" r="3"/><circle cx="17" cy="15" r="3"/></g>} />,
};

// --- Berimbau line separator ---
function BerimbauRule({ style }) {
  return <div className="berimbau-line" style={style} />;
}

// --- Logo ---
function Logo({ size = "md", inverted = false }) {
  const big = size === "lg";
  return (
    <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: big ? 40 : 32, height: big ? 40 : 32, borderRadius: 10,
        background: inverted ? "var(--bg)" : "var(--ink)",
        color: inverted ? "var(--ink)" : "var(--bg)",
        display: "grid", placeItems: "center",
        fontFamily: "var(--font-display)", fontSize: big ? 22 : 18, lineHeight: 1, fontWeight: 400,
        letterSpacing: "-0.04em",
      }}>
        a<span style={{ color: "var(--accent)", marginLeft: -2 }}>·</span>c
      </div>
      <div style={{ lineHeight: 1.05 }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
          Capoeira directory
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: big ? 22 : 18, color: "var(--ink)", letterSpacing: "-0.02em" }}>
          Agenda Capoeiragem
        </div>
      </div>
    </a>
  );
}

// --- Top nav (desktop) ---
function NavBar({ active = "map", onCmdK }) {
  const links = [
    { id: "map", label: "Mapa" },
    { id: "groups", label: "Grupos" },
    { id: "educators", label: "Educadores" },
    { id: "app", label: "App" },
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 5,
      background: "color-mix(in srgb, var(--bg) 88%, transparent)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--line-soft)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72, padding: "0 32px" }}>
        <Logo />
        <nav style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999, padding: 4 }}>
          {links.map((l) => (
            <a key={l.id} href="#"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                height: 36, padding: "0 14px", borderRadius: 999,
                background: active === l.id ? "var(--ink)" : "transparent",
                color: active === l.id ? "var(--bg)" : "var(--ink-2)",
                fontSize: 13, fontWeight: 500,
              }}>
              {l.label}
              {l.soon && <span className="mono" style={{ fontSize: 9, opacity: 0.6, letterSpacing: "0.1em" }}>SOON</span>}
            </a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onCmdK} className="btn btn-ghost btn-sm" style={{ paddingLeft: 12, paddingRight: 8, gap: 12 }}>
            <I.search size={14} />
            <span style={{ color: "var(--ink-3)", fontSize: 12 }}>Buscar ciudad o grupo</span>
            <span className="mono" style={{ fontSize: 10, padding: "3px 6px", border: "1px solid var(--line)", borderRadius: 4, color: "var(--ink-3)" }}>⌘K</span>
          </button>
          <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 999, padding: 3, background: "var(--surface)" }}>
            {["es", "pt", "en"].map((l) => (
              <button key={l} className="mono" style={{
                width: 32, height: 30, borderRadius: 999,
                background: l === "es" ? "var(--ink)" : "transparent",
                color: l === "es" ? "var(--bg)" : "var(--ink-3)",
                fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em",
                border: "none", cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

// --- Mobile nav ---
function NavBarMobile({ active = "map", title }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 5,
      background: "color-mix(in srgb, var(--bg) 92%, transparent)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--line-soft)",
      padding: "0 18px", height: 60,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Logo />
      <button style={{ width: 40, height: 40, border: "1px solid var(--line)", background: "var(--surface)", borderRadius: 12, display: "grid", placeItems: "center", color: "var(--ink)" }}>
        <I.menu size={18} />
      </button>
    </header>
  );
}

// --- Mobile bottom tab bar ---
function BottomTabs({ active = "map" }) {
  const tabs = [
    { id: "home", label: "Inicio", icon: I.sparkle },
    { id: "map", label: "Mapa", icon: I.map },
    { id: "groups", label: "Grupos", icon: I.users },
    { id: "profile", label: "Perfil", icon: I.user },
  ];
  return (
    <div style={{
      position: "absolute", left: 12, right: 12, bottom: 12,
      background: "var(--ink)", color: "var(--bg)",
      borderRadius: 999, padding: 6,
      display: "flex", justifyContent: "space-between",
      boxShadow: "0 12px 32px rgba(20,17,13,0.25)",
    }}>
      {tabs.map(t => (
        <button key={t.id} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          height: 44, borderRadius: 999, border: "none",
          background: t.id === active ? "var(--accent)" : "transparent",
          color: t.id === active ? "white" : "color-mix(in srgb, var(--bg) 70%, transparent)",
          fontSize: 12, fontWeight: 500,
        }}>
          <t.icon size={16} />
          {t.id === active && <span>{t.label}</span>}
        </button>
      ))}
    </div>
  );
}

// --- Search bar (large) ---
function HeroSearchBar({ value = "", placeholder = "Ciudad, país, grupo…" }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: 999,
      padding: 6,
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: "var(--shadow-md)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 16px 0 18px", flex: 1, height: 56 }}>
        <I.search size={18} style={{ color: "var(--ink-3)" }} />
        <input
          defaultValue={value}
          placeholder={placeholder}
          style={{
            border: "none", outline: "none", background: "transparent",
            font: "400 17px/1 var(--font-body)", color: "var(--ink)", flex: 1,
          }}
        />
      </div>
      <div style={{ width: 1, height: 28, background: "var(--line)" }} />
      <button style={{
        height: 56, padding: "0 18px",
        border: "none", background: "transparent",
        display: "flex", alignItems: "center", gap: 8,
        fontSize: 14, color: "var(--ink-2)", cursor: "pointer",
      }}>
        <I.pin size={16} style={{ color: "var(--ink-3)" }} />
        Cerca de mí
      </button>
      <button className="btn btn-accent btn-lg" style={{ height: 56, paddingLeft: 26, paddingRight: 26 }}>
        Buscar
      </button>
    </div>
  );
}

// --- Stat ---
function Stat({ n, label, mono }) {
  return (
    <div>
      <div style={{
        fontFamily: mono ? "var(--font-mono)" : "var(--font-display)",
        fontSize: 36, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--ink)",
      }}>{n}</div>
      <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 6 }}>
        {label}
      </div>
    </div>
  );
}

// --- Corda visual (graduation cord) ---
function Corda({ c1 = "#F1E2C2", c2 = "#A07843", tip = "#1A1814", w = 80 }) {
  return (
    <div className="corda" style={{
      "--c1": c1, "--c2": c2, "--tip": tip, width: w,
    }} />
  );
}

// --- Map placeholder (stylized SVG) ---
function MapStub({ pins = [], active = 0, dark = false, height = 420, dense = true }) {
  const ink = dark ? "#1F1B16" : "#FFFFFF";
  const land = dark ? "#25201A" : "#EDE6D8";
  const line = dark ? "#2D2820" : "#D9CFBE";
  const water = dark ? "#14110D" : "#F4EFE6";
  return (
    <div style={{ position: "relative", width: "100%", height, borderRadius: "var(--radius-lg)", overflow: "hidden", background: water, border: `1px solid var(--line)` }}>
      <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block" }}>
        {/* graticule */}
        <g stroke={line} strokeWidth="0.5" opacity="0.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={"v" + i} x1={i * 50} y1="0" x2={i * 50} y2="420" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={"h" + i} x1="0" y1={i * 50} x2="600" y2={i * 50} />
          ))}
        </g>
        {/* abstract continents */}
        <g fill={land} stroke={line}>
          <path d="M40,90 Q90,60 150,75 Q210,55 260,90 Q300,120 280,170 Q300,210 260,250 Q200,280 150,260 Q100,290 70,260 Q30,220 40,180 Q20,140 40,90 Z" />
          <path d="M340,60 Q400,50 460,90 Q510,80 540,130 Q560,170 520,210 Q500,260 440,260 Q400,290 370,260 Q330,250 320,200 Q310,150 340,120 Z" />
          <path d="M120,310 Q170,300 220,330 Q260,360 230,395 Q180,410 130,395 Q100,370 110,340 Z" />
          <path d="M390,310 Q450,300 500,330 Q540,360 510,395 Q460,410 410,395 Q380,370 390,340 Z" />
        </g>
      </svg>
      {/* pins */}
      {pins.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -100%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          {p.label && i === active && (
            <div style={{
              padding: "6px 10px", background: "var(--ink)", color: "var(--bg)",
              borderRadius: 8, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap",
              boxShadow: "var(--shadow-md)",
            }}>{p.label}</div>
          )}
          <div style={{
            width: i === active ? 18 : 12, height: i === active ? 18 : 12,
            borderRadius: 999,
            background: i === active ? "var(--accent)" : ink,
            border: i === active ? "3px solid white" : `2px solid ${line}`,
            boxShadow: i === active ? "0 6px 16px rgba(217,84,43,0.4)" : "0 2px 4px rgba(0,0,0,0.15)",
          }} />
        </div>
      ))}
      {/* zoom controls */}
      <div style={{ position: "absolute", right: 14, bottom: 14, display: "flex", flexDirection: "column", background: ink, border: `1px solid ${line}`, borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
        <button style={{ width: 36, height: 36, border: "none", background: "transparent", color: dark ? "#F4EFE6" : "#1A1814", display: "grid", placeItems: "center", borderBottom: `1px solid ${line}` }}><I.plus size={14} /></button>
        <button style={{ width: 36, height: 36, border: "none", background: "transparent", color: dark ? "#F4EFE6" : "#1A1814", display: "grid", placeItems: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
        </button>
      </div>
    </div>
  );
}

window.CapAtoms = {
  Icon, I, BerimbauRule, Logo, NavBar, NavBarMobile, BottomTabs,
  HeroSearchBar, Stat, Corda, MapStub,
};
