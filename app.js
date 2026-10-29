* {
  box-sizing: border-box;
}

:root {
  --bg: #0f172a;
  --panel: #111827;
  --panel-alt: #1f2937;
  --panel-soft: #0b1220;
  --text: #f8fafc;
  --muted: #cbd5e1;
  --accent: #38bdf8;
  --accent-strong: #0ea5e9;
  --success: #22c55e;
  --warning: #f59e0b;
  --border: rgba(148, 163, 184, 0.2);
  --shadow: 0 20px 50px rgba(15, 23, 42, 0.5);
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  background: linear-gradient(135deg, #020817 0%, #0f172a 45%, #111827 100%);
  color: var(--text);
}

body {
  padding: 32px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow);
  padding: 24px;
  backdrop-filter: blur(12px);
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border);
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3rem);
}

.mode-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease, background 0.15s ease;
}

button:hover {
  transform: translateY(-1px);
}

.mode-button {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.2);
  color: var(--text);
}

.mode-button.active {
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: #04263c;
}

.secondary-btn {
  background: rgba(148, 163, 184, 0.12);
  color: var(--text);
  border: 1px solid rgba(148, 163, 184, 0.15);
}

#convertBtn {
  background: linear-gradient(135deg, var(--success), #16a34a);
  color: #06210f;
}

.workspace {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.panel {
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  min-height: 540px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

label {
  font-weight: 700;
  color: var(--muted);
}

textarea {
  width: 100%;
  min-height: 430px;
  resize: vertical;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(2, 6, 23, 0.9);
  color: var(--text);
  font-family: "Consolas", "Monaco", monospace;
  font-size: 0.92rem;
  line-height: 1.5;
  padding: 16px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

@media (max-width: 820px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .workspace {
    grid-template-columns: 1fr;
  }
}
