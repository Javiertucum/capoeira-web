/* eslint-disable react/prop-types */
/* Home / Hero — desktop */
const A = window.CapAtoms;

function HomeArtboard() {
  return (
    <div className="cap" style={{ width: 1280, minHeight: 900 }}>
      <A.NavBar active="home" />

      {/* HERO */}
      <section style={{ padding: "56px 64px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 56, alignItems: "end" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <span className="berimbau-dot" />
              <span className="eyebrow acc">Directorio global · Capoeira viva</span>
            </div>
            <h1 style={{ fontSize: 92, lineHeight: 0.92, letterSpacing: "-0.035em" }}>
              Encuentra <em style={{ color: "var(--accent)", fontStyle: "italic" }}>capoeira</em><br />
              cerca de tu casa.
            </h1>
            <p style={{ fontSize: 18, color: "var(--ink-2)", lineHeight: 1.55, maxWidth: 480, marginTop: 24 }}>
              Núcleos, grupos y educadores en 44 países. Para empezar de cero,
              o para no perder el ritmo cuando estás de viaje.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
            {/* live counter */}
            <div className="card" style={{ padding: 22, width: 320 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.18em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--green)", boxShadow: "0 0 0 4px var(--green-soft)" }} />
                En vivo · actualizado hoy
              </div>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
                <A.Stat n="312" label="Núcleos" />
                <A.Stat n="68" label="Grupos" />
                <A.Stat n="1.2k" label="Educadores" />
                <A.Stat n="44" label="Países" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <A.HeroSearchBar />
          <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase", marginRight: 6 }}>Atajos</span>
            {[
              { l: "Buenos Aires", n: 22 },
              { l: "Madrid", n: 18 },
              { l: "São Paulo", n: 41 },
              { l: "Ciudad de México", n: 14 },
              { l: "Berlín", n: 9 },
              { l: "Infantil", n: 76 },
              { l: "Roda abierta", n: 38 },
            ].map((c, i) => (
              <span key={i} className="chip">{c.l} <span style={{ color: "var(--ink-4)", fontSize: 11 }}>{c.n}</span></span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ padding: "0 64px", marginTop: 48 }}><A.BerimbauRule /></div>

      {/* THREE LANES */}
      <section style={{ padding: "48px 64px" }}>
        <div className="section-head">
          <span className="num">01 / Explorar</span>
          <h2>Tres puertas de entrada al directorio.</h2>
          <span className="rule" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {[
            {
              tag: "Mapa", n: 312, name: "Núcleos",
              desc: "Espacios donde se entrena. Dirección, horarios, responsable y contacto directo.",
              tone: "#FBE7DC", icon: <A.I.pin size={20} />,
            },
            {
              tag: "Comunidades", n: 68, name: "Grupos",
              desc: "La organización detrás del cordel. Sistema de graduación, países y núcleos asociados.",
              tone: "#DDE8DD", icon: <A.I.users size={20} />,
            },
            {
              tag: "Personas", n: 1248, name: "Educadores",
              desc: "Maestros y profesores con su corda, su núcleo y un canal real de contacto.",
              tone: "#F0E5C8", icon: <A.I.user size={20} />,
            },
          ].map((c, i) => (
            <a key={i} href="#" className="card" style={{ padding: 28, display: "block", position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: 999,
                background: c.tone, opacity: 0.6,
              }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="tag-mono">{c.tag}</span>
                  <span style={{ width: 38, height: 38, borderRadius: 12, background: "var(--ink)", color: "var(--bg)", display: "grid", placeItems: "center" }}>{c.icon}</span>
                </div>
                <div style={{ marginTop: 32 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 56, lineHeight: 0.9, letterSpacing: "-0.03em" }}>{c.n.toLocaleString()}</div>
                  <h3 style={{ fontSize: 26, marginTop: 8 }}>{c.name}</h3>
                </div>
                <p style={{ marginTop: 14, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>{c.desc}</p>
                <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 8, color: "var(--accent-ink)", fontSize: 13, fontWeight: 500 }}>
                  Abrir directorio <A.I.arrow size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* MAP TEASER + FEATURED CITY */}
      <section style={{ padding: "12px 64px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28 }}>
          <div className="card" style={{ padding: 22, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <span className="tag-mono">Mapa global</span>
                <h3 style={{ fontSize: 24, marginTop: 10 }}>312 núcleos en 44 países.</h3>
              </div>
              <a href="#" className="btn btn-ghost btn-sm">Abrir mapa <A.I.arrow size={12} /></a>
            </div>
            <A.MapStub pins={[
              { x: 22, y: 35, label: "Salvador (BA)" },
              { x: 26, y: 50 },
              { x: 31, y: 60 },
              { x: 19, y: 28 },
              { x: 48, y: 30 },
              { x: 52, y: 26 },
              { x: 75, y: 32 },
              { x: 70, y: 70 },
            ]} active={0} height={300} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card-paper" style={{ padding: 24 }}>
              <span className="tag-mono">Ciudad de la semana</span>
              <h3 style={{ fontSize: 32, marginTop: 12 }}>Salvador, BA</h3>
              <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 6 }}>17 núcleos · 9 grupos representados</p>
              <div className="berimbau-line" style={{ margin: "20px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["Pelourinho · Mestre Bimba", "Forte da Capoeira · Angola Palmares", "Rio Vermelho · GCAP"].map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14 }}>{l}</span>
                    <A.I.arrow size={14} style={{ color: "var(--ink-3)" }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="card-ink" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.7 }}>
                <A.I.music size={14} />
                <span className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>Para educadores</span>
              </div>
              <h3 style={{ fontSize: 26, marginTop: 14, color: "var(--bg)" }}>¿Tu núcleo no está en el mapa?</h3>
              <p style={{ fontSize: 14, color: "color-mix(in srgb, var(--bg) 75%, transparent)", marginTop: 10, lineHeight: 1.55 }}>
                Descarga la app, registra tu núcleo en 3 minutos y aparece aquí.
                Verificación humana, gratis.
              </p>
              <button className="btn btn-accent" style={{ marginTop: 20 }}>Descargar app <A.I.arrow size={14} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 64px 32px", borderTop: "1px solid var(--line-soft)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32 }}>
          <div style={{ maxWidth: 420 }}>
            <A.Logo />
            <p style={{ marginTop: 14, fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6 }}>
              Datos curados con la comunidad. Sin algoritmo, sin ranking pago. Si quieres
              corregir algo, escríbenos.
            </p>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 12, color: "var(--ink-3)" }}>
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
            <a href="#">Contacto</a>
            <span className="mono">© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

window.HomeArtboard = HomeArtboard;
