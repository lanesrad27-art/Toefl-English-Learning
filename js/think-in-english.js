// js/think-in-english.js — Think in English Trainer (fluency)
import { $, $$, esc, section, card, rnd, toast, recordProgress } from './util.js'
import { THINK_PROMPTS } from './data/conversations.js'
import { SpeechRecognizer } from './speech-recognition.js'

let timer = null
const stop = () => { if (timer) { clearInterval(timer); timer = null } }

export async function render(view) {
  stop()
  view.innerHTML = section('🧠 Think in English Trainer', 'Train your brain to think directly in English — no translating.') +
    `<div class="seg" id="teTab">
      <button data-t="picture" class="active">Picture Description</button>
      <button data-t="rapid">Rapid Response</button>
      <button data-t="assoc">Word Association</button>
      <button data-t="situation">Situation Reaction</button>
      <button data-t="monologue">Inner Monologue</button>
      <button data-t="dream">Dream / Day Journal</button>
    </div><div id="teBody"></div>`
  const body = $('#teBody', view)
  const tabs = { picture, rapid, assoc, situation, monologue, dream }
  $$('#teTab button', view).forEach(b => b.onclick = () => { $$('#teTab button', view).forEach(x => x.classList.remove('active')); b.classList.add('active'); stop(); tabs[b.dataset.t](body) })
  picture(body)
  return stop
}

const SCENES = [
  { svg: sceneCity(), hint: 'A busy city street' },
  { svg: sceneNature(), hint: 'A quiet mountain lake' },
  { svg: sceneRoom(), hint: 'A cozy study room' },
]
function picture(body) {
  let i = 0
  const draw = () => {
    const s = SCENES[i]
    body.innerHTML = card(`<h3>Describe what you see — in English only</h3>
      <div class="scene">${s.svg}</div>
      <p class="muted">Scene: ${esc(s.hint)}. Describe it out loud for 30 seconds, then write 3 sentences.</p>
      <textarea class="notearea" id="teDesc" placeholder="It looks like... There is/are... I can see..."></textarea>
      <div class="btn-row"><button class="btn" id="teSave">✓ Done</button><button class="btn ghost" id="teNext">Next scene →</button></div>`)
    $('#teNext', body).onclick = () => { i = (i + 1) % SCENES.length; draw() }
    $('#teSave', body).onclick = () => { recordProgress('speaking', 1, 1, 30).catch(() => {}); toast('Nice! Thinking in English 💪') }
  }
  draw()
}
function rapid(body) {
  const draw = () => {
    const q = rnd(THINK_PROMPTS)
    body.innerHTML = card(`<h3>Rapid Response — answer in 10 seconds</h3>
      <p class="big-text">${esc(q)}</p>
      <div class="btn-row"><button class="btn" id="teGo">▶️ Start 10s</button><button class="btn ghost" id="teNew">🔄 New</button><span class="timer" id="teT">00:10</span></div>
      <p class="muted">No pausing to translate. Speak the first natural English answer that comes to mind.</p>`)
    $('#teNew', body).onclick = draw
    $('#teGo', body).onclick = () => {
      stop(); let left = 10; const tn = $('#teT', body)
      timer = setInterval(() => { left--; tn.textContent = '00:' + String(left).padStart(2, '0'); tn.classList.toggle('danger', left <= 3); if (left <= 0) { stop(); tn.textContent = '⏰ Time!'; recordProgress('speaking', 1, 1, 10).catch(() => {}) } }, 1000)
    }
  }
  draw()
}
function assoc(body) {
  const seeds = ['ocean', 'school', 'travel', 'music', 'food', 'technology', 'family', 'city', 'sport', 'weather']
  const draw = () => {
    const seed = rnd(seeds)
    body.innerHTML = card(`<h3>Word Association Chain</h3>
      <p>Seed word: <span class="pill navy big">${esc(seed)}</span></p>
      <p class="muted">Type 10 English words you immediately associate — fast, no translating!</p>
      <div class="assoc-grid" id="teAssoc">${Array.from({ length: 10 }, (_, n) => `<input class="assoc-in" placeholder="${n + 1}">`).join('')}</div>
      <div class="btn-row"><button class="btn" id="teCheck">Check</button><button class="btn ghost" id="teNew">🔄 New seed</button></div>
      <div id="teAssocR"></div>`)
    $('#teNew', body).onclick = draw
    $('#teCheck', body).onclick = () => {
      const filled = $$('.assoc-in', body).filter(i => i.value.trim()).length
      $('#teAssocR', body).innerHTML = `<div class="ex-row ${filled >= 8 ? 'ok' : 'info'}">You produced ${filled}/10 words. ${filled >= 8 ? 'Excellent fluency!' : 'Keep practicing for speed.'}</div>`
      if (filled >= 8) recordProgress('vocabulary', filled, 10, 0).catch(() => {})
    }
  }
  draw()
}
function situation(body) {
  const draw = () => {
    const q = rnd(THINK_PROMPTS)
    body.innerHTML = card(`<h3>Situation Reaction</h3><p class="big-text">${esc(q)}</p>
      <textarea class="notearea" id="teSit" placeholder="What do you think, say, and do? Respond naturally in English."></textarea>
      <div class="btn-row"><button class="btn" id="teSave">✓ Done</button><button class="btn ghost" id="teNew">🔄 New situation</button></div>`)
    $('#teNew', body).onclick = draw
    $('#teSave', body).onclick = () => { recordProgress('writing', 1, 1, 0).catch(() => {}); toast('Saved — great reaction!') }
  }
  draw()
}
function monologue(body) {
  const topics = ['your morning routine', 'what you plan to do today', 'a problem you are solving', 'your surroundings right now', 'your goals this month']
  body.innerHTML = card(`<h3>Inner Monologue</h3>
    <p>Narrate <b>${esc(rnd(topics))}</b> as if you were thinking in English.</p>
    <p class="muted">Example: “Okay, first I need to… then I’ll… I wonder if…” Keep an internal English voice running for 1–2 minutes.</p>
    <textarea class="notearea" id="teMono" placeholder="Write your inner monologue..."></textarea>
    <button class="btn" id="teSave">✓ Done</button>`)
  $('#teSave', body).onclick = () => { recordProgress('speaking', 1, 1, 60).catch(() => {}); toast('Well done 🧠') }
}
function dream(body) {
  const key = 'think_dream_journal'
  const entries = JSON.parse(localStorage.getItem(key) || '[]')
  body.innerHTML = card(`<h3>English Dream / Day Journal</h3>
    <p class="muted">Describe something that happened today (or a dream) entirely in English.</p>
    <textarea class="notearea" id="teDream" placeholder="Today I..."></textarea>
    <button class="btn" id="teSave">💾 Save entry</button>`) +
    card(`<h4>Past entries (${entries.length})</h4><div id="teList">${entries.map(e => `<div class="journal-entry"><span class="muted">${esc(e.date)}</span><p>${esc(e.text)}</p></div>`).join('') || '<p class="muted">No entries yet.</p>'}</div>`)
  $('#teSave', body).onclick = () => {
    const text = $('#teDream', body).value.trim(); if (!text) return
    entries.unshift({ date: new Date().toLocaleString(), text })
    localStorage.setItem(key, JSON.stringify(entries)); dream(body); toast('Entry saved ✨')
  }
}

// --- tiny inline SVG scenes ---
function sceneCity() { return `<svg viewBox="0 0 300 160" class="scene-svg"><rect width="300" height="160" fill="#cfe3ff"/><rect y="120" width="300" height="40" fill="#7d8aa0"/><rect x="30" y="50" width="40" height="70" fill="#3949ab"/><rect x="90" y="30" width="45" height="90" fill="#1a237e"/><rect x="155" y="60" width="40" height="60" fill="#5c6bc0"/><rect x="215" y="40" width="50" height="80" fill="#283593"/><circle cx="255" cy="30" r="14" fill="#ffc107"/></svg>` }
function sceneNature() { return `<svg viewBox="0 0 300 160" class="scene-svg"><rect width="300" height="160" fill="#d6f0ff"/><polygon points="60,120 120,40 180,120" fill="#8d99ae"/><polygon points="150,120 210,30 270,120" fill="#6b7a99"/><rect y="120" width="300" height="40" fill="#4caf50"/><rect y="110" width="300" height="14" fill="#64b5f6"/><circle cx="40" cy="35" r="16" fill="#ffc107"/></svg>` }
function sceneRoom() { return `<svg viewBox="0 0 300 160" class="scene-svg"><rect width="300" height="160" fill="#fff3e0"/><rect y="120" width="300" height="40" fill="#a1887f"/><rect x="40" y="70" width="80" height="50" fill="#8d6e63"/><rect x="50" y="55" width="60" height="18" fill="#3949ab"/><rect x="180" y="40" width="70" height="80" fill="#bcaaa4"/><rect x="190" y="50" width="50" height="22" fill="#4caf50"/><circle cx="215" cy="95" r="10" fill="#ffc107"/></svg>` }

export const meta = { label: 'Think in English', icon: '🧠' }
