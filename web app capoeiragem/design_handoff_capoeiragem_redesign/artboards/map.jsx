/* eslint-disable react/prop-types */
/* Map + List redesign */
const A2 = window.CapAtoms;

function MapArtboard() {
  const items = [
    { name: "Núcleo Pelourinho", group: "Mestre Bimba", city: "Salvador", country: "Brasil", schedule: "Lun · Mié · Sáb", count: 4, badges: ["Adultos", "Infantil", "Roda"], active: true },
    { name: "Sede Forte da Capoeira", group: "Angola Palmares", city: "Salvador", country: "Brasil", schedule: "Mar · Jue · Sáb", count: 3, badges: ["Angola", "Roda"] },
    { name: "Núcleo Rio Vermelho", group: "GCAP", city: "Salvador", country: "Brasil", schedule: "Lun · Vie", count: 2, badges: ["Adultos", "Verificado"] },
    { name: "Casa Capoeira Palermo", group: "Cordão de Ouro", city: "Buenos Aires", country: "Argentina", schedule: "Mar · Jue · Sáb", count: 5, badges: ["Adultos", "Infantil"] },
    { name: "Espacio Lavapiés", group: "Senzala", city: "Madrid", country: "España", schedule: "Lun · Mié", count: 2, badges: ["Adultos"] },
    { name: "Capoeira Coyoacán", group: "Brasil Tropical", city: "CDMX", country: "México", schedule: "Mar · Jue", count: 3, badges: ["Infantil", "Roda"] },
  ];
  return (
    <div className="cap" style={{ width: 1280, minHeight: 900 }}>
      <A2.NavBar active="map" />

      {/* compact hero strip */}
      <div style={{ padding: "28px 64px 18px", borderBottom: "1px solid var(--line-soft)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32 }}>
          <div>
            <span className="eyebrow">Directorio público · Núcleos y grupos</span>
            <h1 style={{ fontSize: 44, marginTop: 10, lineHeight: 1 }}>Mapa de la capoeira en el mundo</h1>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            <A2.Stat n="312" label="Núcleos" />
            <A2.Stat n="68" label="Grupos" />
            <A2.Stat n="44" label="Países" />
          </div>
        </div>
        <div style={{ marginTop: 22, display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ flex: 1 }}><A2.HeroSearchBar value="Salvador" /></div>
          <button className="btn btn-ghost btn-lg" style={{ height: 64 }}>
            <A2.I.filter size={16} /> Filtros <span className="chip sm acc" style={{ marginLeft: 4 }}>3</span>
          </button>
        </div>
        {/* filter chips */}
        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span className="chip active">Núcleos</span>
          <span className="chip">Grupos</span>
          <span className="chip">Educadores</span>
          <span style={{ width: 1, alignSelf: "stretch", background: "var(--line)", margin: "0 4px" }} />
          <span className="chip acc">Salvador ×</span>
          <span className="chip acc">Adultos ×</span>
          <span className="chip acc">Roda abierta ×</span>
          <span className="chip">Infantil</span>
          <span className="chip">+ Día de la semana</span>
        </div>
      </div>

      {/* split view */}
      <div style={{ display: "grid", gridTemplateColumns: "440px 1fr", height: 720 }}>
        {/* LIST */}
        <div style={{ borderRight: "1px solid var(--line-soft)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line-soft)" }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Resultados</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, marginTop: 4 }}>312 núcleos</div>
            </div>
            <select style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "8px 14px", fontSize: 13, background: "var(--surface)", color: "var(--ink-2)" }}>
              <option>Más cercano</option>
              <option>A–Z</option>
              <option>Más reciente</option>
            </select>
          </div>
          <div style={{ overflow: "auto", flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((it, i) => (
              <article key={i} className={it.active ? "card" : "card-paper"} style={{
                padding: 16,
                borderColor: it.active ? "var(--ink)" : "var(--line)",
                boxShadow: it.active ? "var(--shadow-md)" : "none",
                cursor: "pointer", position: "relative",
              }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: it.active ? "var(--accent)" : "var(--ink)", color: it.active ? "white" : "var(--bg)", display: "grid", placeItems: "center", flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{it.group}</div>
                    <h3 style={{ fontSize: 18, marginTop: 4, fontFamily: "var(--font-body)", fontWeight: 600, letterSpacing: "-0.01em" }}>{it.name}</h3>
                    <div style={{ marginTop: 6, fontSize: 13, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}>
                      <A2.I.pin size={12} style={{ color: "var(--ink-3)" }} />
                      {it.city}, {it.country}
                    </div>
                    <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 6 }}>
                      <A2.I.clock size={12} />
                      {it.schedule} <span style={{ color: "var(--ink-4)" }}>· {it.count} clases/sem</span>
                    </div>
                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {it.badges.map((b, j) => (
                        <span key={j} className={`chip sm ${b === "Verificado" ? "green" : ""}`}>
                          {b === "Verificado" && <A2.I.check size={10} />}
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* MAP */}
        <div style={{ position: "relative", padding: 16 }}>
          <A2.MapStub
            height={688}
            pins={[
              { x: 32, y: 56, label: "Núcleo Pelourinho · Salvador" },
              { x: 36, y: 60 }, { x: 30, y: 62 },
              { x: 24, y: 70 }, { x: 28, y: 75 },
              { x: 52, y: 38 },
              { x: 76, y: 32 },
              { x: 18, y: 44 },
              { x: 80, y: 60 },
            ]}
            active={0}
          />
          {/* selection callout */}
          <div className="card" style={{
            position: "absolute", left: 32, bottom: 32, width: 360, padding: 20, boxShadow: "var(--shadow-lg)",
          }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-ink)", display: "flex", alignItems: "center", gap: 6 }}>
              <span className="berimbau-dot" /> Seleccionado
            </div>
            <h3 style={{ fontSize: 22, fontFamily: "var(--font-body)", fontWeight: 600, marginTop: 8, letterSpacing: "-0.01em" }}>Núcleo Pelourinho</h3>
            <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4 }}>Mestre Bimba · Salvador, BA</p>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <a className="btn btn-primary btn-sm">Ver núcleo <A2.I.arrow size={12} /></a>
              <a className="btn btn-ghost btn-sm"><A2.I.whatsapp size={14} /> Contacto</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.MapArtboard = MapArtboard;
