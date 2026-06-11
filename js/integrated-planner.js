// js/integrated-planner.js — 5-step Integrated Writing planner
import { $, $$, esc, section, card } from './util.js'
import { tts } from './tts.js'
import { WRITING_INTEGRATED } from './data/writing-prompts.js'

export async function render(view) {
  let pi = 0
  view.innerHTML = section('🧩 Integrated Writing Planner', 'Work through reading → listening → mapping → outline → draft, step by step.') +
    card(`<label class="sel-label">Prompt <select id="ipSel">${WRITING_INTEGRATED.map((w, i) => `<option value="${i}">${esc(w.topic)}</option>`).join('')}</select></label>`) +
    `<div id="ipBody"></div>`
  const body = $('#ipBody', view)
  const draw = () => {
    const w = WRITING_INTEGRATED[pi]
    const k = 'ip_' + pi
    body.innerHTML =
      step(1, 'Reading Analysis', `<div class="reading">${esc(w.reading)}</div><label>Main claim + 3 supporting points</label><textarea id="ipRead" class="notearea">${esc(localStorage.getItem(k + '_read') || '')}</textarea>`) +
      step(2, 'Listening Analysis', `<button class="btn ghost sm" id="ipPlay">🔊 Play lecture</button><div class="scrolltext collapsed">${w.lecture.map(l => `<p>${esc(l.text)}</p>`).join('')}</div><label>Lecture’s position + 3 counter-points</label><textarea id="ipListen" class="notearea">${esc(localStorage.getItem(k + '_listen') || '')}</textarea>`) +
      step(3, 'Relationship Mapper', mapper(w)) +
      step(4, 'Auto-Outline', `<button class="btn" id="ipGen">⚙️ Generate outline</button><pre class="tmpl" id="ipOutline"></pre>`) +
      step(5, 'Write Your Response', `<textarea id="ipDraft" class="essay">${esc(localStorage.getItem(k + '_draft') || '')}</textarea><div class="toolbar"><span id="ipWc">0 words</span></div><details class="sample"><summary>📄 Sample response</summary><p>${esc(w.sample)}</p></details>`)
    $('#ipPlay', body).onclick = () => tts.speakDialogue(w.lecture, 0.9)
    ;['Read', 'Listen', 'Draft'].forEach(f => { const t = $('#ip' + f, body); if (t) t.addEventListener('input', () => localStorage.setItem(k + '_' + f.toLowerCase(), t.value)) })
    const draftTa = $('#ipDraft', body)
    const wc = () => $('#ipWc', body).textContent = draftTa.value.trim().split(/\s+/).filter(Boolean).length + ' words'
    draftTa.addEventListener('input', wc); wc()
    $('#ipGen', body).onclick = () => {
      $('#ipOutline', body).textContent =
`I. Introduction
   - Topic: ${w.topic}
   - The lecturer challenges/expands the reading’s claim.
II. Point 1
   - Reading: ${($('#ipRead', body).value.split('\n')[0] || '[reading point 1]')}
   - Lecture: [counter-point 1]
III. Point 2
   - Reading: [reading point 2]
   - Lecture: [counter-point 2]
IV. Point 3
   - Reading: [reading point 3]
   - Lecture: [counter-point 3]
V. (No personal opinion — report the relationship only.)`
    }
  }
  $('#ipSel', view).onchange = e => { pi = +e.target.value; draw() }
  draw()
  return () => tts.stop()
}
function step(n, title, inner) { return card(`<div class="step-head"><span class="step-no">${n}</span><h3>${esc(title)}</h3></div>${inner}`) }
function mapper(w) {
  return `<div class="mapper">
    <div class="map-col reading-col"><h4>📖 Reading</h4><p>Claims the idea is beneficial / valid.</p></div>
    <div class="map-arrow">⇄ contradicts</div>
    <div class="map-col lecture-col"><h4>🎙️ Lecture</h4><p>Casts doubt with specific counter-evidence.</p></div>
  </div><p class="muted">Pair each reading point with the matching lecture point. They almost always oppose one another.</p>`
}

export const meta = { label: 'Integrated Planner', icon: '🧩' }
