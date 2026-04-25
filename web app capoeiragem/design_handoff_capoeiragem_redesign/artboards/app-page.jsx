/* eslint-disable react/prop-types */
/* /app — companion / download page */
const A6 = window.CapAtoms;

function AppPageArtboard() {
  const features = [
    { tag: "Para educadores", t: "Crea y gestiona tus núcleos", d: "Horarios, ubicación, equipo. Tu núcleo aparece publicado en la web automáticamente." },
    { tag: "Para grupos", t: "Tu sistema de cordas, tu linaje", d: "Define tu propia graduación. Asigna cordas a tus alumnos. Reconoce tu historia visualmente." },
    { tag: "Para todos", t: "Agenda de eventos privada", d: "Batizados, encuentros, workshops. Co-organiza con otros educadores. Visible solo dentro de la app." },
    { tag: "Comunidad", t: "Perfil, contactos, mensajes", d: "Conecta con educadores de tu linaje, sin pasar por redes sociales." },
  ];
  return (
    <div className="cap" style={{ width: 1280, minHeight: 1320 }}>
      <A6.NavBar active="app" />

      {/* HERO con phone mockup */}
      <section style={{ padding: "56px 64px 48px", display: "grid", gridTemplateColumns: "1fr 460px", gap: 64, alignItems: "center" }}>
        <div>
          <span className="eyebrow acc">Companion móvil · Agenda Capoeiragem</span>
          <h1 style={{ fontSize: 80, lineHeight: 0.94, letterSpacing: "-0.03em", marginTop: 18 }}>
            La <em style={{ color: "var(--accent)", fontStyle: "italic" }}>app</em> es donde<br/>
            la comunidad se organiza.
          </h1>
          <p style={{ fontSize: 18, color: "var(--ink-2)", lineHeight: 1.6, marginTop: 20, maxWidth: 540 }}>
            Esta web es la <strong>cara pública</strong> del directorio: cualquiera puede encontrar
            un núcleo, un educador o un grupo. La app es la <strong>cocina</strong>: ahí los
            educadores publican y mantienen sus datos, gestionan cordas, organizan eventos
            y conectan entre sí.
          </p>

          <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <a className="btn btn-primary btn-lg" style={{ paddingLeft: 22, paddingRight: 26, gap: 14 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 20.5V3.5L17 12 3.5 20.5zM4.5 5.3v13.4L15.2 12 4.5 5.3z"/><path d="M3.5 3.5l11 7.6 3.5-2 .5-.3a1 1 0 0 0 0-1.7l-.5-.3-3.5-2L3.5 3.5z" opacity="0.7"/></svg>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                <span className="mono" style={{ fontSize: 9, opacity: 0.7, letterSpacing: "0.16em", textTransform: "uppercase" }}>Disponible en</span>
                <span style={{ fontSize: 16 }}>Google Play</span>
              </span>
            </a>
            <a className="btn btn-ghost btn-lg" style={{ paddingLeft: 22, paddingRight: 26, gap: 14 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 1.5a4.5 4.5 0 0 0-3 1.7c-.7.9-1.3 2.1-1.1 3.3 1.3 0 2.5-.8 3.2-1.7.7-.9 1.2-2.1.9-3.3zM20 17.5c-.5 1.1-1.2 2.2-2 3-1 1-2.2 2-3.7 2-1.4 0-1.9-.9-3.5-.9-1.7 0-2.2.9-3.6.9-1.5 0-2.6-1.1-3.6-2.1C1.4 18.2.4 14 2 11.2c1-2 3-3.3 5-3.3 1.5 0 2.9.9 3.7.9.8 0 2.5-1.1 4.3-1 .8 0 3 .3 4.4 2.4-3.7 2-3.1 7.4.6 7.3z"/></svg>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                <span className="mono" style={{ fontSize: 9, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Próximamente</span>
                <span style={{ fontSize: 16 }}>App Store</span>
              </span>
            </a>
          </div>

          <div style={{ marginTop: 40, display: "flex", gap: 32 }}>
            <A6.Stat n="2.4k" label="Practicantes" />
            <A6.Stat n="312" label="Núcleos publicados" />
            <A6.Stat n="44" label="Países" />
          </div>
        </div>

        {/* phone mockup column */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div style={{
            position: "absolute", inset: -40, background: "var(--accent-soft)",
            borderRadius: "50%", filter: "blur(40px)", opacity: 0.6, zIndex: 0,
          }} />
          <div style={{ position: "relative", zIndex: 1, transform: "rotate(-3deg)" }}>
            <div style={{
              width: 280, height: 560,
              background: "var(--ink)", borderRadius: 38, padding: 8,
              boxShadow: "0 30px 80px rgba(40,28,12,0.25), 0 6px 20px rgba(40,28,12,0.15)",
            }}>
              <div style={{ background: "var(--bg)", borderRadius: 30, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "28px 18px 12px" }}>
                  <span className="eyebrow acc" style={{ fontSize: 9 }}>Mi núcleo · Hoy</span>
                  <h3 style={{ fontSize: 24, marginTop: 6, lineHeight: 1.05 }}>Pelourinho</h3>
                </div>
                <div className="img-ph" style={{ height: 140, margin: "0 14px", borderRadius: 14 }}>foto</div>
                <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ padding: 12, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12 }}>
                    <div className="mono" style={{ fontSize: 9, color: "var(--accent-ink)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Próximo treino</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>Hoy 19:00 · Adultos</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>14 confirmados</div>
                  </div>
                  <div style={{ padding: 12, background: "var(--ink)", color: "var(--bg)", borderRadius: 12 }}>
                    <div className="mono" style={{ fontSize: 9, opacity: 0.7, letterSpacing: "0.16em", textTransform: "uppercase" }}>Evento privado</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>Batizado 2026</div>
                    <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>14–16 marzo · 28 anotados</div>
                  </div>
                </div>
              </div>
            </div>
            {/* sticker */}
            <div style={{
              position: "absolute", top: -16, right: -28,
              background: "var(--accent)", color: "white",
              borderRadius: 999, padding: "10px 18px",
              transform: "rotate(8deg)",
              boxShadow: "var(--shadow-md)",
            }}>
              <span className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>v1.0 · gratis</span>
            </div>
          </div>
        </div>
      </section>

      <div style={{ padding: "0 64px" }}><A6.BerimbauRule /></div>

      {/* split: web vs app */}
      <section style={{ padding: "56px 64px 32px" }}>
        <div className="section-head">
          <span className="num">01 / Diferencias</span>
          <h2>Una sola base de datos, dos puertas.</h2>
          <span className="rule" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div className="card" style={{ padding: 28 }}>
            <span className="tag-mono">Web pública</span>
            <h3 style={{ fontSize: 32, marginTop: 14 }}>Para encontrar.</h3>
            <p style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 10, lineHeight: 1.6 }}>
              Sin login. Indexable. Para alguien que llega a una ciudad nueva, o
              que recién quiere empezar y busca un espacio cerca.
            </p>
            <ul style={{ marginTop: 22, listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Mapa y directorio de núcleos", "Perfiles públicos de educadores", "Información de grupos y linajes", "Contacto directo (WhatsApp, IG)"].map((it, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--ink-2)" }}>
                  <A6.I.check size={16} style={{ color: "var(--green)", marginTop: 2 }} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-ink" style={{ padding: 28 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.75 }}>App móvil</span>
            <h3 style={{ fontSize: 32, marginTop: 14, color: "var(--bg)" }}>Para participar.</h3>
            <p style={{ fontSize: 14, opacity: 0.78, marginTop: 10, lineHeight: 1.6 }}>
              Con cuenta. Donde la comunidad publica, organiza, gestiona cordas
              y se conecta sin pasar por redes sociales.
            </p>
            <ul style={{ marginTop: 22, listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Crear y gestionar núcleos", "Sistema de cordas personalizable", "Agenda de eventos privada", "Co-organización entre educadores", "Mensajes y comunidad"].map((it, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, opacity: 0.85 }}>
                  <A6.I.check size={16} style={{ color: "var(--accent)", marginTop: 2 }} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section style={{ padding: "12px 64px 56px" }}>
        <div className="section-head">
          <span className="num">02 / Lo que hace la app</span>
          <h2>Pensada por practicantes y educadores.</h2>
          <span className="rule" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
          {features.map((f, i) => (
            <div key={i} className="card-paper" style={{ padding: 26 }}>
              <span className="tag-mono">{f.tag}</span>
              <h3 style={{ fontSize: 24, marginTop: 12, fontFamily: "var(--font-body)", fontWeight: 600, letterSpacing: "-0.01em" }}>{f.t}</h3>
              <p style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 10, lineHeight: 1.6 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section style={{ padding: "0 64px 64px" }}>
        <div className="card" style={{ padding: "36px 44px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32 }}>
          <div style={{ maxWidth: 580 }}>
            <span className="eyebrow acc">Para educadores</span>
            <h3 style={{ fontSize: 32, marginTop: 12 }}>¿Tu núcleo todavía no aparece en la web?</h3>
            <p style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 8, lineHeight: 1.6 }}>
              Descarga la app, registra tu núcleo en 3 minutos, y aparece publicado
              automáticamente en este directorio. Verificación humana, gratis.
            </p>
          </div>
          <button className="btn btn-accent btn-lg" style={{ flexShrink: 0 }}>Descargar app <A6.I.arrow size={14} /></button>
        </div>
      </section>
    </div>
  );
}

window.AppPageArtboard = AppPageArtboard;
