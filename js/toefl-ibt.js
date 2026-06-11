// js/toefl-ibt.js — TOEFL iBT full test (Reading, Listening, Speaking, Writing)
import { $, $$, el, esc, section, card, LETTERS, recordProgress, confetti, say, renderQuiz } from './util.js'
import { tts } from './tts.js'
import { READING_PASSAGES } from './data/questions-reading.js'
import { LISTENING } from './data/listening-transcripts.js'
import { SPEAKING_PROMPTS } from './data/speaking-prompts.js'
import { WRITING_INTEGRATED, WRITING_INDEPENDENT } from './data/writing-prompts.js'

let activeTimer = null
function stopTimer() { if (activeTimer) { clearInterval(activeTimer); activeTimer = null } }
function fmt(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0') }
function startTimer(node, seconds, onEnd) {
  stopTimer()
  let left = seconds
  const tick = () => {
    if (!node || !node.isConnected) { stopTimer(); return }
    node.textContent = '⏱️ ' + fmt(left)
    node.classList.toggle('warn', left <= seconds * 0.25)
    node.classList.toggle('danger', left <= 30)
    if (left <= 0) { stopTimer(); if (onEnd) onEnd(); return }
    left--
  }
  tick(); activeTimer = setInterval(tick, 1000)
}

export async function render(view) {
  stopTimer(); tts.stop()
  view.innerHTML = section('🎯 TOEFL iBT Full Test', 'Internet-Based Test simulation with authentic timing and question types.') +
    `<div class="grid g4" id="ibtTiles">
      ${tile('reading', '📖', 'Reading', 'Academic passages')}
      ${tile('listening', '🎧', 'Listening', 'Lectures + conversation')}
      ${tile('speaking', '🎙️', 'Speaking', '4 tasks · record')}
      ${tile('writing', '✍️', 'Writing', 'Integrated + Independent')}
    </div><div id="ibtArea"></div>`
  const area = $('#ibtArea', view)
  const handlers = { reading: doReading, listening: doListening, speaking: doSpeaking, writing: doWriting }
  $$('[data-sec]', view).forEach(b => b.addEventListener('click', () => {
    $$('[data-sec]', view).forEach(x => x.classList.remove('active')); b.classList.add('active')
    handlers[b.dataset.sec](area)
  }))
  view.querySelector('[data-sec="reading"]').classList.add('active')
  doReading(area)
  return () => { stopTimer(); tts.stop() }
}
function tile(sec, icon, title, sub) {
  return `<button class="tile" data-sec="${sec}"><div class="tile-ico">${icon}</div><b>${title}</b><span class="muted">${sub}</span></button>`
}

// ---------- READING ----------
function doReading(area) {
  stopTimer(); tts.stop()
  const passages = READING_PASSAGES
  let pi = 0, qi = 0
  const answers = {}, flags = {}
  function render() {
    const p = passages[pi]
    area.innerHTML = `<div class="test-top"><b>Reading · Passage ${pi + 1}/${passages.length}</b><span class="timer" id="rdTimer"></span><button class="btn ghost sm" id="rdSubmit">Submit section</button></div>
      <div class="reading-split">
        <div class="passage" id="passage"><h3>${esc(p.title)}</h3>${p.text.split('\n\n').map(par => `<p>${esc(par)}</p>`).join('')}</div>
        <div class="qpane"><div class="qnav" id="qnav"></div><div id="qbody"></div></div>
      </div>`
    startTimer($('#rdTimer', area), 18 * 60, finish)
    $('#rdSubmit', area).onclick = finish
    renderNav(); renderQ()
  }
  function renderNav() {
    const p = passages[pi]
    $('#qnav', area).innerHTML = p.questions.map((_, i) => {
      const k = pi + '-' + i
      return `<button class="qn ${qi === i ? 'cur' : ''} ${answers[k] != null ? 'done' : ''} ${flags[k] ? 'flag' : ''}" data-q="${i}">${i + 1}</button>`
    }).join('')
    $$('#qnav .qn', area).forEach(b => b.onclick = () => { qi = +b.dataset.q; renderNav(); renderQ() })
  }
  function renderQ() {
    const p = passages[pi], q = p.questions[qi], k = pi + '-' + qi
    $('#qbody', area).innerHTML = `<div class="quiz-head"><span class="pill navy">Q${qi + 1}</span><span class="pill gold">${esc(q.type)}</span><button class="btn ghost sm" id="flagBtn">${flags[k] ? '🚩 Flagged' : '⚑ Flag'}</button></div>
      <div class="qtext">${esc(q.q)}</div><div class="opts">${q.opts.map((o, i) => `<button class="opt ${answers[k] === i ? 'sel' : ''}" data-i="${i}"><b>${LETTERS[i]}</b> ${esc(o)}</button>`).join('')}</div>
      <div class="btn-row"><button class="btn ghost" id="prevQ" ${qi === 0 ? 'disabled' : ''}>Prev</button><button class="btn" id="nextQ">${qi + 1 >= p.questions.length ? (pi + 1 >= passages.length ? 'Finish' : 'Next passage') : 'Next'}</button></div>`
    $$('#qbody .opt', area).forEach(b => b.onclick = () => { answers[k] = +b.dataset.i; renderNav(); renderQ() })
    $('#flagBtn', area).onclick = () => { flags[k] = !flags[k]; renderNav(); renderQ() }
    $('#prevQ', area).onclick = () => { if (qi > 0) { qi--; renderNav(); renderQ() } }
    $('#nextQ', area).onclick = () => { if (qi + 1 < p.questions.length) { qi++; renderNav(); renderQ() } else if (pi + 1 < passages.length) { pi++; qi = 0; render() } else finish() }
  }
  async function finish() {
    stopTimer()
    let correct = 0, total = 0
    passages.forEach((p, ppi) => p.questions.forEach((q, qqi) => { total++; if (answers[ppi + '-' + qqi] === q.a) correct++ }))
    const pct = Math.round(correct / total * 100)
    area.innerHTML = `<div class="result-card"><h2>📖 Reading: ${correct}/${total} (${pct}%)</h2></div>` +
      passages.map((p, ppi) => `<div class="card"><h3>${esc(p.title)}</h3>` + p.questions.map((q, qqi) => {
        const ch = answers[ppi + '-' + qqi], ok = ch === q.a
        return `<div class="review-q"><b>Q${qqi + 1}.</b> ${esc(q.q)}<br><span class="${ok ? 'ok' : 'no'}">${ok ? '✅' : '❌'} Your answer: ${ch != null ? LETTERS[ch] : '—'} · Correct: ${LETTERS[q.a]}</span><div class="ex-row info">📖 ${esc(q.expl)}</div>${q.tip ? `<div class="ex-row tip">💡 ${esc(q.tip)}</div>` : ''}</div>`
      }).join('') + `</div>`).join('')
    if (pct === 100) confetti()
    try { await recordProgress('reading', correct, total, 0) } catch (e) {}
  }
  render()
}

// ---------- LISTENING ----------
function doListening(area) {
  stopTimer(); tts.stop()
  const sets = LISTENING
  let si = 0
  function render() {
    const s = sets[si]
    area.innerHTML = `<div class="test-top"><b>Listening · ${esc(s.title)} (${si + 1}/${sets.length})</b><span class="pill">${s.kind}</span></div>
      ${card(`<div class="audiosim"><div class="wave" id="wave">${'<i></i>'.repeat(28)}</div><div class="audio-prog"><span id="aprog"></span></div>
        <div class="btn-row"><button class="btn" id="playAudio">▶️ Play</button><button class="btn ghost" id="replayAudio">🔁 Replay (1×)</button><button class="btn ghost" id="stopAudio">⏹ Stop</button></div>
        <div class="scrolltext collapsed" id="scroll">${s.lines.map((l, i) => `<p data-i="${i}"><b>${l.gender === 'male' ? '👨 ' : '👩 '}</b>${esc(l.text)}</p>`).join('')}</div>
        <button class="btn ghost sm" id="toggleScript">Show/hide transcript</button></div>`)}
      ${card(`<h4>📝 Note-taking</h4><textarea class="notearea" id="notes" placeholder="Jot down key points while you listen..."></textarea>`)}
      <div id="lq"></div>`
    let replayed = false
    const play = () => {
      tts.stop(); $('#wave', area).classList.add('play')
      const total = s.lines.length
      tts.speakDialogue(s.lines, s.kind === 'lecture' ? 0.85 : 0.92, (idx) => {
        $$('#scroll p', area).forEach(p => p.classList.remove('cur'))
        const cur = $(`#scroll p[data-i="${idx}"]`, area)
        if (cur) cur.classList.add('cur')
        const ap = $('#aprog', area); if (ap) ap.style.width = ((idx + 1) / total * 100) + '%'
      }).then(() => { const w = $('#wave', area); if (w) w.classList.remove('play'); showQuestions() })
    }
    $('#playAudio', area).onclick = play
    $('#replayAudio', area).onclick = () => { if (replayed) return; replayed = true; $('#replayAudio', area).disabled = true; play() }
    $('#stopAudio', area).onclick = () => { tts.stop(); $('#wave', area).classList.remove('play') }
    $('#toggleScript', area).onclick = () => $('#scroll', area).classList.toggle('collapsed')
    function showQuestions() {
      const lq = $('#lq', area)
      lq.innerHTML = '<div class="card"><h4>Questions</h4><div id="lqQ"></div></div>'
      const items = s.questions.map(q => ({ q: q.q, opts: q.opts, a: q.a, expl: q.expl, wrong: q.wrong, tip: q.tip, time: q.time, type: q.type, category: 'Listening' }))
      renderQuiz(items, {
        container: $('#lqQ', area), category: 'Listening', section: 'listening',
        onDone: () => { if (si + 1 < sets.length) { const n = el('button', { class: 'btn' }, 'Next audio →'); n.onclick = () => { si++; render() }; $('#lqQ', area).appendChild(n) } }
      })
    }
  }
  render()
}

// ---------- SPEAKING ----------
function doSpeaking(area) {
  stopTimer(); tts.stop()
  const tasks = [
    { n: 1, name: 'Independent', prep: 15, resp: 45, prompt: SPEAKING_PROMPTS[Math.floor(Math.random() * SPEAKING_PROMPTS.length)], sample: 'I believe studying in groups is more effective because it lets students exchange ideas. For instance, when I prepared with friends, we explained difficult concepts to one another, which deepened my understanding. Therefore, collaboration improves learning.' },
    { n: 2, name: 'Integrated (Reading + Listening)', prep: 30, resp: 60, prompt: 'Read a campus announcement (45s), listen to two students discuss it, then summarize the speaker’s opinion and reasons.', sample: 'The announcement introduces a new policy. The man supports it because it saves time and reduces costs, citing his own experience as evidence.' },
    { n: 3, name: 'Integrated (Conversation)', prep: 20, resp: 60, prompt: 'Listen to a conversation about a student’s problem, then state the problem and the solution the student prefers.', sample: 'The student faces a scheduling conflict. Two solutions are offered, and she prefers dropping the class because her workload is too heavy.' },
    { n: 4, name: 'Integrated (Lecture)', prep: 20, resp: 60, prompt: 'Listen to an academic lecture, then explain the concept using the two examples the professor gives.', sample: 'The professor explains reinforcement with two examples: rewarding a dog with food, and praising a child for good behavior.' },
  ]
  area.innerHTML = tasks.map(t => `<div class="card"><span class="pill navy">Task ${t.n}</span> <b>${esc(t.name)}</b><p>${esc(t.prompt)}</p>
    <div class="btn-row"><button class="btn sm" data-prep="${t.n}">Start prep (${t.prep}s)</button><span class="timer" id="tkt-${t.n}">—</span></div>
    <div id="tkr-${t.n}"></div></div>`).join('') +
    card(`<h3>📊 Scoring Rubric</h3><ul><li><b>Delivery</b>: clarity, fluency, pronunciation</li><li><b>Language Use</b>: grammar & vocabulary range</li><li><b>Topic Development</b>: completeness & coherence</li></ul>`)
  tasks.forEach(t => {
    $(`[data-prep="${t.n}"]`, area).onclick = () => {
      const tn = $(`#tkt-${t.n}`, area)
      startTimer(tn, t.prep, () => {
        tn.textContent = '🎙️ Speak ' + t.resp + 's'
        $(`#tkr-${t.n}`, area).innerHTML = recorderUI(t)
        bindRecorder($(`#tkr-${t.n}`, area), t)
        startTimer(tn, t.resp, () => { tn.textContent = '✅ Done'; recordProgress('speaking', 4, 5, 0).catch(() => {}) })
      })
    }
  })
}
function recorderUI(t) {
  return `<div class="recorder"><div class="wave" id="rw-${t.n}">${'<i></i>'.repeat(20)}</div>
    <div class="btn-row"><button class="btn" data-rec="${t.n}">🎙️ Record</button><button class="btn ghost" data-play="${t.n}" disabled>▶️ Playback</button><button class="btn ghost" data-sample="${t.n}">🔊 Sample answer</button></div>
    <p class="muted sample-text" hidden>${esc(t.sample)}</p></div>`
}
function bindRecorder(host, t) {
  let mediaRec, chunks = [], url = null
  const recBtn = host.querySelector(`[data-rec="${t.n}"]`)
  const playBtn = host.querySelector(`[data-play="${t.n}"]`)
  host.querySelector(`[data-sample="${t.n}"]`).onclick = () => { host.querySelector('.sample-text').hidden = false; say(t.sample, 'female', 0.92) }
  recBtn.onclick = async () => {
    if (mediaRec && mediaRec.state === 'recording') { mediaRec.stop(); recBtn.textContent = '🎙️ Record'; host.querySelector('.wave').classList.remove('play'); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRec = new MediaRecorder(stream); chunks = []
      mediaRec.ondataavailable = e => chunks.push(e.data)
      mediaRec.onstop = () => { url = URL.createObjectURL(new Blob(chunks, { type: 'audio/webm' })); playBtn.disabled = false; stream.getTracks().forEach(tr => tr.stop()) }
      mediaRec.start(); recBtn.textContent = '⏹ Stop'; host.querySelector('.wave').classList.add('play')
    } catch (e) { alert('Microphone access denied or unsupported.') }
  }
  playBtn.onclick = () => { if (url) new Audio(url).play() }
}

// ---------- WRITING ----------
function doWriting(area) {
  stopTimer(); tts.stop()
  const integ = WRITING_INTEGRATED[Math.floor(Math.random() * WRITING_INTEGRATED.length)]
  const indep = WRITING_INDEPENDENT[Math.floor(Math.random() * WRITING_INDEPENDENT.length)]
  area.innerHTML = `<div class="seg" id="wTask"><button data-t="1" class="active">Task 1: Integrated</button><button data-t="2">Task 2: Independent</button></div><div id="wBody"></div>`
  const body = $('#wBody', area)
  const renderTask = (n) => {
    if (n === '1') {
      body.innerHTML = card(`<h3>Integrated Writing · ${esc(integ.topic)}</h3>
        <div class="reading"><b>Reading (3 min):</b><p>${esc(integ.reading)}</p></div>
        <button class="btn ghost sm" id="playLec">🔊 Play lecture</button>
        <div class="scrolltext collapsed" id="lec">${integ.lecture.map(l => `<p>${esc(l.text)}</p>`).join('')}</div>`) +
        writingEditor('integrated', 175, integ.sample)
      $('#playLec', body).onclick = () => tts.speakDialogue(integ.lecture, 0.9)
    } else {
      body.innerHTML = card(`<h3>Independent Writing</h3><p><b>${esc(indep)}</b></p>`) + writingEditor('independent', 300, 'A strong independent essay opens with a clear thesis, devotes one body paragraph to each reason with specific examples, and ends with a concise restatement of the position.')
    }
    bindEditor(body)
  }
  $$('#wTask button', area).forEach(b => b.onclick = () => { $$('#wTask button', area).forEach(x => x.classList.remove('active')); b.classList.add('active'); renderTask(b.dataset.t) })
  renderTask('1')
}
function writingEditor(key, target, sample) {
  return card(`<div class="test-top"><b>Target: ${target}+ words</b></div>
    <textarea class="essay" id="essay-${key}" placeholder="Start writing..."></textarea>
    <div class="toolbar"><span id="wc">0 words</span><button class="btn ghost sm" id="wCheck">Quick check</button></div>
    <div id="wFeedback"></div>
    <details class="sample"><summary>📄 Sample response</summary><p>${esc(sample)}</p></details>`)
}
function bindEditor(body) {
  const ta = body.querySelector('textarea.essay'); if (!ta) return
  const key = ta.id
  const saved = localStorage.getItem('draft_' + key); if (saved) ta.value = saved
  const wc = body.querySelector('#wc')
  const count = () => { wc.textContent = ta.value.trim().split(/\s+/).filter(Boolean).length + ' words' }
  ta.addEventListener('input', count); count()
  setInterval(() => localStorage.setItem('draft_' + key, ta.value), 30000)
  body.querySelector('#wCheck').onclick = () => {
    const txt = ta.value
    const sentences = txt.split(/[.!?]+/).filter(s => s.trim())
    const longSent = sentences.filter(s => s.trim().split(/\s+/).length > 35).length
    const words = txt.toLowerCase().match(/\b[a-z']+\b/g) || []
    const freq = {}; words.forEach(w => { if (w.length > 4) freq[w] = (freq[w] || 0) + 1 })
    const repeated = Object.entries(freq).filter(([, n]) => n >= 4).map(([w]) => w)
    body.querySelector('#wFeedback').innerHTML = `<div class="ex-row info">Sentences: ${sentences.length} · Words: ${words.length}</div>` +
      (longSent ? `<div class="ex-row no">⚠️ ${longSent} very long sentence(s) — consider splitting.</div>` : '<div class="ex-row ok">✅ Sentence length looks balanced.</div>') +
      (repeated.length ? `<div class="ex-row tip">🔁 Frequently repeated words: ${esc(repeated.join(', '))}</div>` : '')
  }
}

export const meta = { label: 'TOEFL iBT Test', icon: '🎯' }
