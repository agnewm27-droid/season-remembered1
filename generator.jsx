import { useState } from "react";

const SPORTS = ["Baseball", "Softball", "Soccer", "Football", "Basketball", "Lacrosse", "Hockey", "Volleyball"];
const THEMES = [
  { id: "baseball", label: "⚾ Diamond Dirt", colors: ["#8B4513", "#F5DEB3", "#1a3a5c"] },
  { id: "soccer", label: "⚽ Clean Modern", colors: ["#16a34a", "#ffffff", "#1e293b"] },
  { id: "football", label: "🏈 Bold & Gold", colors: ["#b45309", "#fbbf24", "#1c1917"] },
  { id: "basketball", label: "🏀 Court Culture", colors: ["#ea580c", "#1e293b", "#f8fafc"] },
];

const emptyPlayer = () => ({ name: "", number: "", position: "", stat: "", fact1: "", fact2: "", fact3: "", parentQuote: "" });

const SYSTEM_PROMPT = `You are a warm, talented sports writer who specializes in youth sports memory books. Your job is to write heartfelt, specific, and celebratory player profiles for end-of-season memory books. 

RULES:
- Write 150-180 words per player profile
- Use the player's name naturally throughout
- Reference their position, number, and stats specifically
- Weave in the fun facts in a natural, not listy way
- End with the parent quote integrated beautifully if provided
- Tone: warm, celebratory, slightly poetic — like the best coach speech you ever heard
- Never be generic. Every profile must feel written specifically for THAT kid
- Use active, vivid language. "She sprinted past defenders" not "she was fast"
- Return ONLY a JSON object with player names as keys and profile text as values. No markdown, no preamble.`;

function buildPrompt(teamData) {
  const playerList = teamData.players.map(p => `
Player: ${p.name}
Jersey #${p.number} | Position: ${p.position}
Season stat/highlight: ${p.stat}
Fun facts: (1) ${p.fact1} | (2) ${p.fact2} | (3) ${p.fact3}
Parent quote: "${p.parentQuote}"
`).join("\n---\n");

  return `Write player profiles for the ${teamData.teamName} ${teamData.sport} team, coached by ${teamData.coachName}. Season: ${teamData.season}. Team record: ${teamData.record}.

${playerList}

Return JSON only: { "PlayerName": "profile text", ... }`;
}

// ── Stepper UI ──────────────────────────────────────────────────────────────

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 28 : 10, height: 10, borderRadius: 5,
          background: i === current ? "#f59e0b" : i < current ? "#78716c" : "#292524",
          transition: "all 0.3s ease"
        }} />
      ))}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", small }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#a8a29e", textTransform: "uppercase" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: "#1c1917", border: "1px solid #292524", borderRadius: 8,
          padding: small ? "8px 12px" : "12px 14px", color: "#fafaf9",
          fontSize: small ? 13 : 15, fontFamily: "inherit", outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = "#f59e0b"}
        onBlur={e => e.target.style.borderColor = "#292524"}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#a8a29e", textTransform: "uppercase" }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        background: "#1c1917", border: "1px solid #292524", borderRadius: 8,
        padding: "12px 14px", color: value ? "#fafaf9" : "#57534e",
        fontSize: 15, fontFamily: "inherit", outline: "none", cursor: "pointer"
      }}>
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Step 1: Team Info ────────────────────────────────────────────────────────

function Step1({ data, setData, onNext }) {
  const valid = data.teamName && data.sport && data.coachName && data.season;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fafaf9", margin: 0 }}>Team Info</h2>
        <p style={{ color: "#78716c", marginTop: 6, fontSize: 14 }}>Tell us about this season's squad</p>
      </div>
      <Input label="Team Name" value={data.teamName} onChange={v => setData({ ...data, teamName: v })} placeholder="e.g. Fort Atkinson Fury" />
      <Select label="Sport" value={data.sport} onChange={v => setData({ ...data, sport: v })} options={SPORTS} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Input label="Coach Name" value={data.coachName} onChange={v => setData({ ...data, coachName: v })} placeholder="Coach Smith" />
        <Input label="Season" value={data.season} onChange={v => setData({ ...data, season: v })} placeholder="Spring 2025" />
      </div>
      <Input label="Team Record (optional)" value={data.record} onChange={v => setData({ ...data, record: v })} placeholder="e.g. 12-3, District Champions" />
      <button onClick={onNext} disabled={!valid} style={{
        marginTop: 8, padding: "14px 0", borderRadius: 10, border: "none",
        background: valid ? "#f59e0b" : "#292524", color: valid ? "#1c1917" : "#57534e",
        fontWeight: 800, fontSize: 16, cursor: valid ? "pointer" : "not-allowed",
        fontFamily: "inherit", letterSpacing: "0.02em", transition: "all 0.2s"
      }}>
        Add Players →
      </button>
    </div>
  );
}

// ── Step 2: Players ──────────────────────────────────────────────────────────

function PlayerCard({ player, index, onChange, onRemove }) {
  const [open, setOpen] = useState(index === 0);
  const f = (field, val) => onChange({ ...player, [field]: val });

  return (
    <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 18px", cursor: "pointer"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: player.name ? "#f59e0b" : "#292524",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: player.name ? "#1c1917" : "#57534e"
          }}>
            {player.number || (index + 1)}
          </div>
          <span style={{ fontWeight: 700, color: player.name ? "#fafaf9" : "#57534e" }}>
            {player.name || `Player ${index + 1}`}
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {index > 0 && <span onClick={e => { e.stopPropagation(); onRemove(); }} style={{ color: "#57534e", cursor: "pointer", fontSize: 18 }}>×</span>}
          <span style={{ color: "#78716c", fontSize: 12 }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 12 }}>
            <Input small label="Full Name" value={player.name} onChange={v => f("name", v)} placeholder="Alex Johnson" />
            <Input small label="Jersey #" value={player.number} onChange={v => f("number", v)} placeholder="12" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input small label="Position" value={player.position} onChange={v => f("position", v)} placeholder="Center Field" />
            <Input small label="Season Highlight / Stat" value={player.stat} onChange={v => f("stat", v)} placeholder="Hit .420, 3 home runs" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#a8a29e", textTransform: "uppercase" }}>3 Fun Facts</label>
            {["fact1", "fact2", "fact3"].map((f2, fi) => (
              <input key={f2} value={player[f2]} onChange={e => f(f2, e.target.value)}
                placeholder={["Loves pizza after every game", "Has a lucky batting glove ritual", "Dreams of playing in college"][fi]}
                style={{
                  background: "#0c0a09", border: "1px solid #292524", borderRadius: 8,
                  padding: "9px 12px", color: "#fafaf9", fontSize: 13, fontFamily: "inherit", outline: "none"
                }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#a8a29e", textTransform: "uppercase" }}>Parent Quote (optional)</label>
            <textarea value={player.parentQuote} onChange={e => f("parentQuote", e.target.value)}
              placeholder="We are so proud of how hard you worked this season..."
              rows={2}
              style={{
                background: "#0c0a09", border: "1px solid #292524", borderRadius: 8,
                padding: "9px 12px", color: "#fafaf9", fontSize: 13, fontFamily: "inherit",
                outline: "none", resize: "vertical"
              }} />
          </div>
        </div>
      )}
    </div>
  );
}

function Step2({ players, setPlayers, onNext, onBack }) {
  const valid = players.every(p => p.name && p.position);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fafaf9", margin: 0 }}>Player Roster</h2>
        <p style={{ color: "#78716c", marginTop: 6, fontSize: 14 }}>Add each player — the more detail, the better the profiles</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
        {players.map((p, i) => (
          <PlayerCard key={i} player={p} index={i}
            onChange={updated => setPlayers(players.map((pl, idx) => idx === i ? updated : pl))}
            onRemove={() => setPlayers(players.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>
      <button onClick={() => setPlayers([...players, emptyPlayer()])} style={{
        padding: "11px 0", borderRadius: 10, border: "1px dashed #292524",
        background: "transparent", color: "#78716c", fontWeight: 700, fontSize: 14,
        cursor: "pointer", fontFamily: "inherit"
      }}>
        + Add Player
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
        <button onClick={onBack} style={{
          padding: "14px 0", borderRadius: 10, border: "1px solid #292524",
          background: "transparent", color: "#a8a29e", fontWeight: 700, fontSize: 15,
          cursor: "pointer", fontFamily: "inherit"
        }}>← Back</button>
        <button onClick={onNext} disabled={!valid} style={{
          padding: "14px 0", borderRadius: 10, border: "none",
          background: valid ? "#f59e0b" : "#292524", color: valid ? "#1c1917" : "#57534e",
          fontWeight: 800, fontSize: 16, cursor: valid ? "pointer" : "not-allowed", fontFamily: "inherit"
        }}>Choose Theme →</button>
      </div>
    </div>
  );
}

// ── Step 3: Theme ────────────────────────────────────────────────────────────

function Step3({ theme, setTheme, onGenerate, onBack, loading }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fafaf9", margin: 0 }}>Pick Your Theme</h2>
        <p style={{ color: "#78716c", marginTop: 6, fontSize: 14 }}>Sets the color palette for your printed book</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {THEMES.map(t => (
          <div key={t.id} onClick={() => setTheme(t.id)} style={{
            padding: "16px", borderRadius: 12, cursor: "pointer",
            border: `2px solid ${theme === t.id ? "#f59e0b" : "#292524"}`,
            background: theme === t.id ? "#1c1917" : "#0c0a09",
            transition: "all 0.2s"
          }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              {t.colors.map((c, ci) => (
                <div key={ci} style={{ flex: 1, height: 8, borderRadius: 4, background: c }} />
              ))}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#fafaf9" }}>{t.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 12, color: "#a8a29e", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>What gets generated</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {["Personalized 150-word profile for every player", "Coach intro letter written in your voice", "Season recap narrative", "Print-ready PDF layout guide"].map(item => (
            <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#a8a29e" }}>
              <span style={{ color: "#f59e0b", marginTop: 1 }}>✓</span> {item}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
        <button onClick={onBack} style={{
          padding: "14px 0", borderRadius: 10, border: "1px solid #292524",
          background: "transparent", color: "#a8a29e", fontWeight: 700, fontSize: 15,
          cursor: "pointer", fontFamily: "inherit"
        }}>← Back</button>
        <button onClick={onGenerate} disabled={loading} style={{
          padding: "14px 0", borderRadius: 10, border: "none",
          background: loading ? "#292524" : "#f59e0b",
          color: loading ? "#57534e" : "#1c1917",
          fontWeight: 800, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          {loading ? (
            <><Spinner /> Generating profiles...</>
          ) : "✨ Generate Memory Book"}
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 16, height: 16, border: "2px solid #57534e",
      borderTop: "2px solid #a8a29e", borderRadius: "50%",
      animation: "spin 0.8s linear infinite"
    }} />
  );
}

// ── Step 4: Results ──────────────────────────────────────────────────────────

function Step4({ profiles, teamData, players, onReset }) {
  const [selected, setSelected] = useState(players[0]?.name || "");
  const playerNames = players.map(p => p.name).filter(Boolean);

  const copyAll = () => {
    const text = playerNames.map(name => `${name}\n${"─".repeat(40)}\n${profiles[name] || ""}`).join("\n\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fafaf9", margin: 0 }}>Your Memory Book</h2>
          <p style={{ color: "#78716c", marginTop: 6, fontSize: 14 }}>{teamData.teamName} · {teamData.season}</p>
        </div>
        <button onClick={copyAll} style={{
          padding: "9px 16px", borderRadius: 8, border: "1px solid #292524",
          background: "transparent", color: "#a8a29e", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit"
        }}>Copy All</button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {playerNames.map(name => (
          <button key={name} onClick={() => setSelected(name)} style={{
            padding: "7px 14px", borderRadius: 20, border: "none", fontFamily: "inherit",
            background: selected === name ? "#f59e0b" : "#1c1917",
            color: selected === name ? "#1c1917" : "#a8a29e",
            fontSize: 13, fontWeight: 700, cursor: "pointer"
          }}>{name}</button>
        ))}
      </div>

      {selected && profiles[selected] && (
        <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#fafaf9" }}>{selected}</div>
              <div style={{ fontSize: 12, color: "#78716c", marginTop: 2 }}>
                #{players.find(p => p.name === selected)?.number} · {players.find(p => p.name === selected)?.position}
              </div>
            </div>
            <button onClick={() => navigator.clipboard.writeText(profiles[selected])} style={{
              padding: "6px 12px", borderRadius: 8, border: "1px solid #292524",
              background: "transparent", color: "#78716c", fontSize: 12, cursor: "pointer", fontFamily: "inherit"
            }}>Copy</button>
          </div>
          <p style={{ color: "#d4cfc9", fontSize: 15, lineHeight: 1.75, margin: 0 }}>{profiles[selected]}</p>
        </div>
      )}

      <div style={{ background: "#0c0a09", border: "1px solid #1c1917", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 12, color: "#57534e", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Next Steps</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            "Copy all profiles above into your design tool (Canva works great)",
            "Use the theme colors you picked for backgrounds and accents",
            "Add team photo to the cover page",
            "Print at Staples or upload to Shutterfly for professional prints"
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "#78716c" }}>
              <span style={{ color: "#f59e0b", fontWeight: 800, minWidth: 16 }}>{i + 1}.</span> {step}
            </div>
          ))}
        </div>
      </div>

      <button onClick={onReset} style={{
        padding: "12px 0", borderRadius: 10, border: "1px solid #292524",
        background: "transparent", color: "#a8a29e", fontWeight: 700, fontSize: 14,
        cursor: "pointer", fontFamily: "inherit"
      }}>← Start New Book</button>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState(0);
  const [teamData, setTeamData] = useState({ teamName: "", sport: "", coachName: "", season: "", record: "" });
  const [players, setPlayers] = useState([emptyPlayer(), emptyPlayer(), emptyPlayer()]);
  const [theme, setTheme] = useState("baseball");
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: buildPrompt({ ...teamData, players: players.filter(p => p.name) }) }]
        })
      });
      const data = await response.json();
      const text = data.content.map(b => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setProfiles(parsed);
      setStep(3);
    } catch (e) {
      setError("Something went wrong generating profiles. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setTeamData({ teamName: "", sport: "", coachName: "", season: "", record: "" });
    setPlayers([emptyPlayer(), emptyPlayer(), emptyPlayer()]);
    setTheme("baseball");
    setProfiles({});
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0c0a09; font-family: 'DM Sans', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0c0a09; } ::-webkit-scrollbar-thumb { background: #292524; border-radius: 2px; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#0c0a09",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "40px 16px"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40, animation: "fadeUp 0.5s ease" }}>
          <div style={{ fontSize: 13, letterSpacing: "0.2em", color: "#f59e0b", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>
            ⚡ Youth Sports Memory Books
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(42px, 8vw, 72px)",
            color: "#fafaf9", margin: 0, letterSpacing: "0.04em", lineHeight: 1
          }}>
            SEASON<br />REMEMBERED
          </h1>
          <p style={{ color: "#78716c", marginTop: 12, fontSize: 15, maxWidth: 400 }}>
            Personalized memory books every player will keep forever
          </p>
        </div>

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: 520,
          background: "#111110", border: "1px solid #1c1917",
          borderRadius: 20, padding: "32px 28px",
          animation: "fadeUp 0.5s ease 0.1s both",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)"
        }}>
          {step < 3 && <StepIndicator current={step} total={3} />}

          {step === 0 && <Step1 data={teamData} setData={setTeamData} onNext={() => setStep(1)} />}
          {step === 1 && <Step2 players={players} setPlayers={setPlayers} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
          {step === 2 && <Step3 theme={theme} setTheme={setTheme} onGenerate={generate} onBack={() => setStep(1)} loading={loading} />}
          {step === 3 && <Step4 profiles={profiles} teamData={teamData} players={players.filter(p => p.name)} onReset={reset} />}

          {error && <div style={{ marginTop: 12, padding: 12, background: "#1c0a0a", border: "1px solid #7f1d1d", borderRadius: 8, color: "#fca5a5", fontSize: 13 }}>{error}</div>}
        </div>

        <div style={{ marginTop: 24, fontSize: 12, color: "#292524" }}>
          Built for coaches, parents, and kids who deserve to be remembered
        </div>
      </div>
    </>
  );
}
