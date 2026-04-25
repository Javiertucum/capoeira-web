/* eslint-disable react/prop-types */
/* App / Mobile artboards (pinned to phone width) */
const A5 = window.CapAtoms;

function MobileFrame({ children, label, height = 780 }) {
  return (
    <div style={{
      width: 390, height,
      background: "var(--bg)",
      borderRadius: 38, overflow: "hidden", position: "relative",
      border: "1px solid var(--line)", boxShadow: "var(--shadow-md)",
    }}>
      <div style={{ height: 32, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>
        <span>9:41</span>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ width: 18, height: 9, border: "1px solid var(--ink)", borderRadius: 2, position: "relative" }}>
            <span style={{ position: "absolute", inset: 1, background: "var(--ink)", borderRadius: 1 }} />
          </span>
        </span>
      </div>
      <div className="cap" style={{ height: height - 32, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
        {children}
      </div>
    </div>
  );
}

function MobileMapArtboard() {
  return (
    <MobileFrame label="m-map">
      <A5.NavBarMobile />
      <div style={{ padding: "12px 16px 6px" }}>
        <h1 style={{ fontSize: 30, lineHeight: 1, letterSpacing: "-0.02em" }}>312 núcleos cerca</h1>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999, height: 44, padding: "0 14px" }}>
          <A5.I.search size={16} style={{ color: "var(--ink-3)" }} />
          <input placeholder="Salvador" style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, flex: 1 }} />
          <A5.I.filter size={16} style={{ color: "var(--ink-3)" }} />
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 6, overflowX: "auto" }}>
          {["Cerca", "Adultos", "Infantil", "Roda", "Verificado"].map((c, i) => (
            <span key={i} className={`chip sm ${i === 0 ? "active" : ""}`}>{c}</span>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", padding: "10px 16px 0" }}>
        <A5.MapStub height={320} pins={[
          { x: 50, y: 45, label: "Pelourinho" }, { x: 38, y: 60 }, { x: 62, y: 55 }, { x: 28, y: 72 },
        ]} active={0} />
      </div>
      {/* sheet */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderRadius: "20px 20px 0 0", padding: "10px 16px 80px", boxShadow: "0 -8px 24px rgba(40,28,12,0.05)" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--line)", margin: "0 auto 12px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ fontSize: 18, fontFamily: "var(--font-body)", fontWeight: 600 }}>Núcleo Pelourinho</h3>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>0,8 km</span>
        </div>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 4 }}>Mestre Bimba</div>
        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span className="chip sm acc">Hoy 19:00</span>
          <span className="chip sm green"><A5.I.check size={10} />Verificado</span>
          <span className="chip sm">Roda sáb</span>
        </div>
      </div>
      <A5.BottomTabs active="map" />
    </MobileFrame>
  );
}

function MobileEducatorArtboard() {
  return (
    <MobileFrame label="m-edu">
      <A5.NavBarMobile />
      <div className="img-ph" style={{ height: 220, margin: "12px 16px 0", borderRadius: 18 }}>portrait</div>
      <div style={{ padding: "16px 20px 12px" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--accent-ink)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Mestre · 28 años</div>
        <h1 style={{ fontSize: 32, marginTop: 6 }}>Mestre Faísca</h1>
        <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>Salvador, BA · Mestre Bimba</div>
        <div style={{ marginTop: 14 }}><A5.Corda c1="#1A1814" c2="#1A1814" tip="#C99A3A" w={120} /></div>
      </div>
      <div style={{ padding: "0 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button className="btn btn-primary"><A5.I.whatsapp size={14} />Mensaje</button>
        <button className="btn btn-ghost"><A5.I.ig size={14} />Instagram</button>
      </div>
      <div style={{ padding: "20px 20px", flex: 1, overflow: "auto" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Donde enseña</div>
        <div style={{ marginTop: 10, padding: 14, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Núcleo Pelourinho</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>Lun · Mié · Sáb</div>
        </div>
      </div>
      <A5.BottomTabs active="profile" />
    </MobileFrame>
  );
}

function MobileHomeArtboard() {
  return (
    <MobileFrame label="m-home">
      <A5.NavBarMobile />
      <div style={{ padding: "16px 20px 0" }}>
        <span className="eyebrow acc">Buen día · Domingo</span>
        <h1 style={{ fontSize: 40, marginTop: 8, lineHeight: 0.96, letterSpacing: "-0.025em" }}>
          Encuentra <em style={{ color: "var(--accent)", fontStyle: "italic" }}>capoeira</em> cerca.
        </h1>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 999, height: 48, padding: "0 16px" }}>
          <A5.I.search size={16} style={{ color: "var(--ink-3)" }} />
          <span style={{ fontSize: 14, color: "var(--ink-3)" }}>Buscar núcleos cerca…</span>
        </div>
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Hoy en tu ciudad</div>
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { t: "19:00 · Adultos", n: "Núcleo Pelourinho" },
            { t: "19:30 · Infantil", n: "Forte da Capoeira" },
          ].map((it, i) => (
            <div key={i} style={{ padding: 14, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{it.n}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--accent-ink)", marginTop: 4 }}>{it.t}</div>
              </div>
              <A5.I.arrow size={14} style={{ color: "var(--ink-3)" }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <A5.BottomTabs active="home" />
    </MobileFrame>
  );
}

window.MobileMapArtboard = MobileMapArtboard;
window.MobileEducatorArtboard = MobileEducatorArtboard;
window.MobileHomeArtboard = MobileHomeArtboard;
