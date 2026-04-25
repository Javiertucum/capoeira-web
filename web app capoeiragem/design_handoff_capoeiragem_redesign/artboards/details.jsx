/* eslint-disable react/prop-types */
const A4 = window.CapAtoms;

function EducatorDetailArtboard() {
  return (
    <div className="cap" style={{ width: 1280, minHeight: 1100 }}>
      <A4.NavBar active="educators" />
      <div style={{ padding: "20px 64px" }}>
        <a href="#" style={{ display: "inline-flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--ink-3)" }}><A4.I.arrowL size={14} /> Volver al directorio</a>
      </div>
      <section style={{ padding: "8px 64px 48px", display: "grid", gridTemplateColumns: "360px 1fr", gap: 40 }}>
        {/* sticky profile column */}
        <div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="img-ph" style={{ height: 360 }}>portrait · faísca</div>
            <div style={{ padding: "20px 22px 22px" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-ink)" }}>Mestre · 28 años de práctica</div>
              <h1 style={{ fontSize: 36, marginTop: 8, lineHeight: 1 }}>Mestre Faísca</h1>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>Antônio Carvalho · Salvador, BA</div>
              <div style={{ marginTop: 18, padding: 14, background: "var(--bg-elev)", borderRadius: 12 }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Graduación</div>
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
                  <A4.Corda c1="#1A1814" c2="#1A1814" tip="#C99A3A" w={88} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Mestre</span>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: 14, background: "var(--bg-elev)", borderRadius: 12 }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Grupo</div>
                <a href="#" style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="img-ph" style={{ width: 40, height: 40, borderRadius: 10 }}>l</div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Mestre Bimba</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* contact channels */}
          <div>
            <div className="section-head"><span className="num">01</span><h2>Contacto directo</h2><span className="rule" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { l: "WhatsApp", v: "+55 71 9...", icon: <A4.I.whatsapp size={18} />, c: "#25D366" },
                { l: "Instagram", v: "@mestre.faisca", icon: <A4.I.ig size={18} />, c: "#E4405F" },
                { l: "YouTube", v: "Faísca Capoeira", icon: <A4.I.yt size={18} />, c: "#FF0000" },
                { l: "Sitio", v: "faisca.cap", icon: <A4.I.link size={18} />, c: "var(--ink)" },
              ].map((s, i) => (
                <a key={i} href="#" className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface-muted)", color: s.c, display: "grid", placeItems: "center" }}>{s.icon}</span>
                  <div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{s.l}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{s.v}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* nucleos */}
          <div>
            <div className="section-head"><span className="num">02</span><h2>Espacios donde enseña</h2><span className="rule" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { n: "Núcleo Pelourinho", c: "Salvador, BA", days: ["Lun 19:00", "Mié 19:00", "Sáb 10:00"] },
                { n: "Núcleo Forte", c: "Salvador, BA", days: ["Mar 18:30", "Jue 18:30"] },
              ].map((n, i) => (
                <div key={i} className="card" style={{ padding: 18 }}>
                  <h3 style={{ fontSize: 18, fontFamily: "var(--font-body)", fontWeight: 600 }}>{n.n}</h3>
                  <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}><A4.I.pin size={12} /> {n.c}</div>
                  <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {n.days.map((d, j) => <span key={j} className="chip sm">{d}</span>)}
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }}>Ver núcleo <A4.I.arrow size={12} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* bio */}
          <div>
            <div className="section-head"><span className="num">03</span><h2>Biografía</h2><span className="rule" /></div>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-2)", maxWidth: 640 }}>
              Empezó la capoeira en Itapuã a los 9 años con Mestre Suassuna. Recibió la corda
              de mestre en 2012 después de una década formando núcleos en Argentina y México.
              Hoy enseña entre Salvador y proyectos itinerantes con jóvenes del Pelourinho.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function NucleoDetailArtboard() {
  return (
    <div className="cap" style={{ width: 1280, minHeight: 1000 }}>
      <A4.NavBar active="map" />
      <div style={{ padding: "20px 64px" }}>
        <a href="#" style={{ fontSize: 13, color: "var(--ink-3)", display: "inline-flex", alignItems: "center", gap: 8 }}><A4.I.arrowL size={14} /> Mapa / Mestre Bimba / Núcleo Pelourinho</a>
      </div>
      <section style={{ padding: "12px 64px 32px" }}>
        <div className="card" style={{ padding: 0, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 480px" }}>
          <div style={{ padding: "32px 36px" }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" }}>Espacio de treino · Mestre Bimba</div>
            <h1 style={{ fontSize: 64, marginTop: 8, lineHeight: 0.96 }}>Núcleo Pelourinho</h1>
            <p style={{ fontSize: 16, color: "var(--ink-2)", marginTop: 14 }}>Rua Gregório de Mattos 27, Pelourinho, Salvador — BA, Brasil</p>
            <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="chip green"><A4.I.check size={11} /> Verificado</span>
              <span className="chip">Adultos · Infantil</span>
              <span className="chip">Roda abierta los sábados</span>
              <span className="chip">Acceso libre</span>
            </div>
            <div style={{ marginTop: 22, display: "flex", gap: 8 }}>
              <button className="btn btn-primary"><A4.I.whatsapp size={14} /> Escribir al núcleo</button>
              <button className="btn btn-ghost"><A4.I.pin size={14} /> Cómo llegar</button>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <A4.MapStub height={320} pins={[{ x: 50, y: 55, label: "Estás aquí" }]} active={0} />
          </div>
        </div>
      </section>

      <section style={{ padding: "0 64px 48px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
        <div>
          <div className="section-head"><span className="num">01</span><h2>Horarios de la semana</h2><span className="rule" /></div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {[
              { d: "Lunes", c: ["19:00 · Adultos", "20:30 · Avanzados"] },
              { d: "Martes", c: ["—"] },
              { d: "Miércoles", c: ["18:30 · Infantil", "19:30 · Adultos"] },
              { d: "Jueves", c: ["—"] },
              { d: "Viernes", c: ["19:00 · Adultos"] },
              { d: "Sábado", c: ["10:00 · Roda abierta"] },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", padding: "14px 22px", borderTop: i ? "1px solid var(--line-soft)" : "none", alignItems: "center" }}>
                <div className="mono" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: row.c[0] === "—" ? "var(--ink-4)" : "var(--ink-2)" }}>{row.d}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {row.c.map((c, j) => <span key={j} className={`chip sm ${c === "—" ? "" : "acc"}`}>{c}</span>)}
                </div>
              </div>
            ))}
          </div>

          <div className="section-head" style={{ marginTop: 36 }}><span className="num">02</span><h2>Equipo</h2><span className="rule" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { n: "M. Faísca", r: "Responsable", c1: "#1A1814", c2: "#1A1814", tip: "#C99A3A" },
              { n: "Prof. Caju", r: "Co-educador", c1: "#F1C977", c2: "#3B7B3F", tip: "#3B7B3F" },
              { n: "Aluna Borboleta", r: "Asistente", c1: "#F4EFE6", c2: "#3B6BB7", tip: "#3B6BB7" },
            ].map((p, i) => (
              <div key={i} className="card-paper" style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
                <div className="img-ph" style={{ width: 48, height: 48, borderRadius: 999 }}>i</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.n}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 2 }}>{p.r}</div>
                  <div style={{ marginTop: 8 }}><A4.Corda c1={p.c1} c2={p.c2} tip={p.tip} w={56} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 18 }}>
            <span className="tag-mono">Práctico</span>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["Primera clase", "Gratuita"],
                ["Mensualidad", "R$ 180"],
                ["Idiomas", "PT · ES · EN"],
                ["Edad mínima", "5 años"],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, paddingBottom: 12, borderBottom: i < 3 ? "1px solid var(--line-soft)" : "none" }}>
                  <span style={{ color: "var(--ink-3)" }}>{k}</span>
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card-ink" style={{ padding: 18 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>Próxima roda</span>
            <h3 style={{ fontSize: 22, color: "var(--bg)", marginTop: 8 }}>Sábado · 10:00</h3>
            <p style={{ fontSize: 13, opacity: 0.75, marginTop: 6 }}>Abierta a visitantes. Lleva ropa cómoda.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

window.EducatorDetailArtboard = EducatorDetailArtboard;
window.NucleoDetailArtboard = NucleoDetailArtboard;
