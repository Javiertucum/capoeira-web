/* eslint-disable react/prop-types */
const A3 = window.CapAtoms;

function EducatorsArtboard() {
  const eds = [
    { nick: "Mestre Faísca", name: "Antônio Carvalho", country: "Brasil 🇧🇷", group: "Mestre Bimba", c1: "#F5E6C8", c2: "#A07843", tip: "#1A1814", years: 28, ig: "@mestre.faisca", spots: 4 },
    { nick: "Contramestra Lua", name: "Mariana Souza", country: "Argentina 🇦🇷", group: "Cordão de Ouro", c1: "#E5D7B0", c2: "#5A4023", tip: "#5A4023", years: 14, ig: "@contramestra.lua", spots: 2 },
    { nick: "Professor Caju", name: "Jorge Méndez", country: "México 🇲🇽", group: "Brasil Tropical", c1: "#F1C977", c2: "#3B7B3F", tip: "#3B7B3F", years: 9, ig: "@prof.caju", spots: 3 },
    { nick: "Instrutora Vento", name: "Aitana Ríos", country: "España 🇪🇸", group: "Senzala", c1: "#FFF1D6", c2: "#3B6BB7", tip: "#3B6BB7", years: 6, ig: "@instr.vento", spots: 2 },
    { nick: "Mestre Tigre", name: "Ricardo Pessoa", country: "Brasil 🇧🇷", group: "Angola Palmares", c1: "#1A1814", c2: "#1A1814", tip: "#C99A3A", years: 35, ig: "@mestre.tigre", spots: 5 },
    { nick: "Profesor Pelé", name: "Mateo Linares", country: "Chile 🇨🇱", group: "GCAP", c1: "#F1C977", c2: "#A04A2A", tip: "#A04A2A", years: 11, ig: "@prof.pele", spots: 2 },
    { nick: "Aluna Borboleta", name: "Sofia Karam", country: "Alemania 🇩🇪", group: "Senzala", c1: "#F4EFE6", c2: "#3B6BB7", tip: "#3B6BB7", years: 4, ig: "@borboleta.cap", spots: 1 },
    { nick: "Mestre Raio", name: "Edson Pinto", country: "Portugal 🇵🇹", group: "Mestre Bimba", c1: "#1A1814", c2: "#A07843", tip: "#C99A3A", years: 42, ig: "@mestre.raio", spots: 3 },
  ];
  return (
    <div className="cap" style={{ width: 1280, minHeight: 900 }}>
      <A3.NavBar active="educators" />
      <section style={{ padding: "44px 64px 24px" }}>
        <span className="eyebrow">Personas · Maestros, profesores, instructores</span>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, marginTop: 12 }}>
          <h1 style={{ fontSize: 76, lineHeight: 0.94, letterSpacing: "-0.03em", maxWidth: 760 }}>
            1.248 educadoras y educadores con <em style={{ color: "var(--accent)", fontStyle: "italic" }}>nombre</em> y contacto.
          </h1>
          <div style={{ display: "flex", gap: 18 }}>
            <A3.Stat n="1.2k" label="Activos" />
            <A3.Stat n="44" label="Países" />
            <A3.Stat n="68" label="Grupos" />
          </div>
        </div>
        <div style={{ marginTop: 28 }}><A3.HeroSearchBar placeholder="Apodo, nombre, grupo o país…" /></div>
        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span className="chip active">Todos</span>
          <span className="chip">Mestres</span>
          <span className="chip">Contramestres</span>
          <span className="chip">Profesores</span>
          <span className="chip">Instructores</span>
          <span style={{ width: 1, alignSelf: "stretch", background: "var(--line)", margin: "0 4px" }} />
          <span className="chip">🇧🇷 Brasil</span>
          <span className="chip">🇦🇷 Argentina</span>
          <span className="chip">🇪🇸 España</span>
          <span className="chip">+ país</span>
        </div>
      </section>

      <section style={{ padding: "16px 64px 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {eds.map((e, i) => (
            <article key={i} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div className="img-ph" style={{ height: 160, position: "relative" }}>
                portrait · {e.nick.toLowerCase().split(" ").slice(-1)}
                <div style={{ position: "absolute", top: 12, right: 12 }}>
                  <span className="chip sm" style={{ background: "rgba(255,255,255,0.92)" }}>{e.country}</span>
                </div>
                <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 6 }}>
                  <A3.Corda c1={e.c1} c2={e.c2} tip={e.tip} w={64} />
                </div>
              </div>
              <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ fontSize: 19, fontFamily: "var(--font-body)", fontWeight: 600, letterSpacing: "-0.01em" }}>{e.nick}</h3>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{e.name}</div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line-soft)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                  <span style={{ color: "var(--ink-2)" }}>{e.group}</span>
                  <span className="mono" style={{ color: "var(--ink-3)", fontSize: 11 }}>{e.years}y · {e.spots} sedes</span>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
                  <span className="chip sm"><A3.I.ig size={10} />IG</span>
                  <span className="chip sm"><A3.I.whatsapp size={10} />WA</span>
                  <span className="chip sm green"><A3.I.check size={10} />Verificado</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function GroupArtboard() {
  return (
    <div className="cap" style={{ width: 1280, minHeight: 1100 }}>
      <A3.NavBar active="groups" />
      <div style={{ padding: "20px 64px" }}>
        <a href="#" style={{ display: "inline-flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--ink-3)" }}><A3.I.arrowL size={14} /> Volver al directorio</a>
      </div>
      {/* HERO BANNER editorial */}
      <section style={{ padding: "12px 64px 32px" }}>
        <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 0 }}>
            <div className="img-ph" style={{ height: 280, borderRadius: 0 }}>group logo</div>
            <div style={{ padding: "32px 40px", position: "relative" }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" }}>Comunidad · Fundada en 1968</div>
              <h1 style={{ fontSize: 72, marginTop: 10, lineHeight: 0.94 }}>Mestre Bimba</h1>
              <p style={{ fontSize: 16, color: "var(--ink-2)", marginTop: 14, maxWidth: 580, lineHeight: 1.55 }}>
                Linaje de Capoeira Regional. 28 núcleos activos en 9 países, 7 sistemas de graduación reconocidos.
              </p>
              <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span className="chip green"><A3.I.check size={11} /> Verificado</span>
                <span className="chip">Capoeira Regional</span>
                <span className="chip">Roda abierta</span>
                <span className="chip">Adultos · Infantil · Juvenil</span>
              </div>
              <div style={{ position: "absolute", right: 32, top: 32, display: "flex", gap: 8 }}>
                <button className="btn btn-ghost btn-sm"><A3.I.link size={14} /> Compartir</button>
                <button className="btn btn-primary btn-sm">Contacto <A3.I.arrow size={12} /></button>
              </div>
            </div>
          </div>
          {/* stat strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderTop: "1px solid var(--line-soft)" }}>
            {[
              { n: "1,240", l: "Miembros" },
              { n: "28", l: "Núcleos" },
              { n: "9", l: "Países" },
              { n: "62", l: "Educadores" },
              { n: "1968", l: "Fundación" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "20px 24px", borderRight: i < 4 ? "1px solid var(--line-soft)" : "none" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{s.l}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 32, marginTop: 4 }}>{s.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* tabs */}
      <div style={{ padding: "0 64px", borderBottom: "1px solid var(--line-soft)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["Resumen", "Núcleos · 28", "Educadores · 62", "Graduación"].map((t, i) => (
            <a key={t} href="#" style={{
              padding: "16px 6px", margin: "0 14px", fontSize: 14,
              borderBottom: i === 0 ? "2px solid var(--ink)" : "2px solid transparent",
              color: i === 0 ? "var(--ink)" : "var(--ink-3)", fontWeight: i === 0 ? 600 : 400,
            }}>{t}</a>
          ))}
        </div>
      </div>

      {/* Body grid */}
      <section style={{ padding: "32px 64px 64px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
        <div>
          <div className="section-head"><span className="num">01</span><h2>Núcleos activos</h2><span className="rule" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { c: "Salvador, BA", n: "Pelourinho", t: "Lun · Mié · Sáb", r: "M. Faísca" },
              { c: "Rio, RJ", n: "Lapa", t: "Mar · Jue", r: "M. Tigre" },
              { c: "Madrid, ES", n: "Lavapiés", t: "Lun · Vie", r: "Prof. Vento" },
              { c: "Buenos Aires, AR", n: "Palermo", t: "Mar · Jue · Sáb", r: "CM. Lua" },
            ].map((nu, i) => (
              <a key={i} href="#" className="card" style={{ padding: 18, display: "block" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{nu.c}</div>
                <h3 style={{ fontSize: 19, fontFamily: "var(--font-body)", fontWeight: 600, marginTop: 6 }}>{nu.n}</h3>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 6 }}><A3.I.clock size={12} /> {nu.t}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-3)" }}>{nu.r}</div>
              </a>
            ))}
          </div>

          <div className="section-head" style={{ marginTop: 40 }}><span className="num">02</span><h2>Educadores responsables</h2><span className="rule" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[
              { n: "M. Faísca", c1: "#F5E6C8", c2: "#A07843", tip: "#1A1814" },
              { n: "M. Tigre", c1: "#1A1814", c2: "#1A1814", tip: "#C99A3A" },
              { n: "CM. Lua", c1: "#E5D7B0", c2: "#5A4023", tip: "#5A4023" },
            ].map((p, i) => (
              <a key={i} href="#" className="card-paper" style={{ padding: 18, display: "flex", gap: 14, alignItems: "center" }}>
                <div className="img-ph" style={{ width: 56, height: 56, borderRadius: 999 }}>img</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600 }}>{p.n}</h4>
                  <div style={{ marginTop: 8 }}><A3.Corda c1={p.c1} c2={p.c2} tip={p.tip} w={70} /></div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 22 }}>
            <span className="tag-mono">Sistema de graduación</span>
            <h3 style={{ fontSize: 22, marginTop: 12 }}>Cordas Regional</h3>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { n: "Aluno", c1: "#F4EFE6", c2: "#F4EFE6", tip: "#9A9388" },
                { n: "Aluno graduado", c1: "#F4EFE6", c2: "#F4EFE6", tip: "#A07843" },
                { n: "Monitor", c1: "#F5E6C8", c2: "#F5E6C8", tip: "#A07843" },
                { n: "Instrutor", c1: "#A07843", c2: "#A07843", tip: "#1A1814" },
                { n: "Professor", c1: "#3B7B3F", c2: "#3B7B3F", tip: "#1A1814" },
                { n: "Contramestre", c1: "#5A4023", c2: "#5A4023", tip: "#C99A3A" },
                { n: "Mestre", c1: "#1A1814", c2: "#1A1814", tip: "#C99A3A" },
              ].map((g, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <A3.Corda c1={g.c1} c2={g.c2} tip={g.tip} w={70} />
                  <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{g.n}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-ink" style={{ padding: 22 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>De viaje</span>
            <h3 style={{ fontSize: 22, color: "var(--bg)", marginTop: 10 }}>9 países, 28 núcleos</h3>
            <p style={{ fontSize: 13, opacity: 0.75, marginTop: 8, lineHeight: 1.5 }}>Si ya practicas con este linaje, encuentra un núcleo afiliado dondequiera que estés.</p>
            <button className="btn btn-accent btn-sm" style={{ marginTop: 16 }}>Ver núcleos <A3.I.arrow size={12} /></button>
          </div>
        </aside>
      </section>
    </div>
  );
}

window.EducatorsArtboard = EducatorsArtboard;
window.GroupArtboard = GroupArtboard;
