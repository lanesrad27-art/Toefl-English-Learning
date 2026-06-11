// js/daily-journal.js — Daily Journal (English diary + speaking journal)
import { $, $$, esc, section, card, rnd, toast, DB } from './util.js'
import { tts } from './tts.js'
import { JOURNAL_TOPICS } from './data/speaking-prompts.js'
import { SpeechRecognizer } from './speech-recognition.js'

export async function render(view) {
  view.innerHTML = section('📔 Daily Journal', 'Write an English diary and record a speaking journal to build daily fluency.') +
    `<div class="seg" id="djTab"><button data-t="diary" class="active">✍️ English Diary</button><button data-t="speaking">🎙️ Speaking Journal</button></div>
    <div id="djBody"></div>`
  const body = $('#djBody', view)
  const tabs = { diary, speaking }
  $$('#djTab button', view).forEach(b => b.onclick = () => { $$('#djTab button', view).forEach(x => x.classList.remove('active')); b.classList.add('active'); tts.stop(); tabs[b.dataset.t](body) })
  await diary(body)
  return () => tts.stop()
}

async function diary(body) {
  body.innerHTML = '<div class="card"><p class="muted">Loading entries…</p></div>'
  const entries = (await DB.select('daily_journal')).filter(e => e.entry_text).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  body.innerHTML = card(`<h3>Today’s entry</h3>
    <p class="muted">Write at least 5 sentences in English about your day.</p>
    <textarea class="essay" id="djText" placeholder="Dear diary, today..."></textarea>
    <div class="toolbar"><span id="djStats">0 words · 0 sentences</span><button class="btn" id="djSave">💾 Save entry</button></div>
    <div id="djFeedback"></div>`) +
    onThisDay(entries) +
    card(`<h4>Timeline (${entries.length})</h4><div id="djList">${entries.map(timelineItem).join('') || '<p class="muted">No entries yet — start today!</p>'}</div>`)
  const ta = $('#djText', body)
  const update = () => {
    const words = ta.value.trim().split(/\s+/).filter(Boolean)
    const sentences = ta.value.split(/[.!?]+/).filter(s => s.trim())
    $('#djStats', body).textContent = `${words.length} words · ${sentences.length} sentences`
    const short = sentences.filter(s => s.trim().split(/\s+/).length < 4).length
    $('#djFeedback', body).innerHTML =
      (sentences.length >= 5 ? '<div class="ex-row ok">✅ 5+ sentences — great!</div>' : `<div class="ex-row info">✍️ ${5 - sentences.length} more sentence(s) to go.</div>`) +
      (short ? `<div class="ex-row tip">💡 ${short} very short sentence(s) — try adding detail.</div>` : '')
  }
  ta.addEventListener('input', update); update()
  $('#djSave', body).onclick = async () => {
    const text = ta.value.trim(); if (!text) return
    await DB.insert('daily_journal', { entry_text: text, speaking_recording_url: '' })
    toast('Diary entry saved 📔'); await diary(body)
  }
}
function timelineItem(e) {
  const d = e.created_at ? new Date(e.created_at).toLocaleDateString() : ''
  return `<div class="journal-entry"><span class="muted">${esc(d)}</span><p>${esc(e.entry_text)}</p></div>`
}
function onThisDay(entries) {
  const wk = Date.now() - 7 * 86400000
  const hit = entries.find(e => { const t = new Date(e.created_at).getTime(); return Math.abs(t - wk) < 86400000 })
  if (!hit) return ''
  return card(`<h4>📆 On this day last week</h4><p>${esc(hit.entry_text)}</p>`, 'onthisday')
}

function speaking(body) {
  const rec = new SpeechRecognizer()
  let topic = rnd(JOURNAL_TOPICS)
  let mediaRec, chunks = [], url = null, timer = null
  const draw = () => {
    body.innerHTML = card(`<h3>Speaking Journal</h3>
      <p>Topic: <b class="big-text">${esc(topic)}</b></p>
      <div class="btn-row"><button class="btn" id="sjRec">🎙️ Record (1–2 min)</button><button class="btn ghost" id="sjPlay" disabled>▶️ Playback</button><button class="btn ghost" id="sjNew">🔄 New topic</button><span class="timer" id="sjT">00:00</span></div>
      <div id="sjTrans"></div>
      <p class="muted">Speak freely. ${rec.supported ? 'A live transcript will appear if your browser supports it.' : 'Transcript unavailable in this browser (try Chrome/Edge).'}</p>`)
    $('#sjNew', body).onclick = () => { topic = rnd(JOURNAL_TOPICS); draw() }
    const recBtn = $('#sjRec', body), playBtn = $('#sjPlay', body), tn = $('#sjT', body)
    recBtn.onclick = async () => {
      if (mediaRec && mediaRec.state === 'recording') { mediaRec.stop(); return }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRec = new MediaRecorder(stream); chunks = []
        mediaRec.ondataavailable = e => chunks.push(e.data)
        let secs = 0; timer = setInterval(() => { secs++; tn.textContent = '00:' + String(secs).padStart(2, '0') }, 1000)
        mediaRec.onstop = () => { clearInterval(timer); url = URL.createObjectURL(new Blob(chunks, { type: 'audio/webm' })); playBtn.disabled = false; recBtn.textContent = '🎙️ Record (1–2 min)'; stream.getTracks().forEach(t => t.stop()); rec.stop() }
        mediaRec.start(); recBtn.textContent = '⏹ Stop'
        if (rec.supported) rec.start({ onResult: (txt) => $('#sjTrans', body).innerHTML = `<div class="ex-row info">📝 ${esc(txt)}</div>` })
      } catch (e) { alert('Microphone access denied or unsupported.') }
    }
    playBtn.onclick = () => { if (url) new Audio(url).play() }
  }
  draw()
}

export const meta = { label: 'Daily Journal', icon: '📔' }
