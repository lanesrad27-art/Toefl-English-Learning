// js/speaking-lab.js — Speaking Lab: shadowing, pronunciation check, tongue twisters, fluency drills
import { $, $$, esc, section, card, rnd } from './util.js'
import { tts } from './tts.js'
import { SHADOWING, TONGUE_TWISTERS, SPEAKING_PROMPTS } from './data/speaking-prompts.js'
import { SpeechRecognizer, scorePronunciation } from './speech-recognition.js'

let timer = null
const stop = () => { if (timer) { clearInterval(timer); timer = null } tts.stop() }

export async function render(view) {
  stop()
  view.innerHTML = section('🎙️ Speaking Lab', 'Shadowing, pronunciation feedback, tongue twisters, and 60-second fluency drills.') +
    `<div class="seg" id="slTab">
      <button data-t="shadow" class="active">Shadowing</button>
      <button data-t="pron">Pronunciation Check</button>
      <button data-t="tongue">Tongue Twisters</button>
      <button data-t="fluency">Fluency Drill</button>
      <button data-t="templates">Speaking Templates</button>
    </div><div id="slBody"></div>`
  const body = $('#slBody', view)
  const tabs = { shadow: shadowing, pron: pronCheck, tongue: tongue, fluency: fluency, templates: templates }
  $$('#slTab button', view).forEach(b => b.onclick = () => { $$('#slTab button', view).forEach(x => x.classList.remove('active')); b.classList.add('active'); stop(); tabs[b.dataset.t](body) })
  shadowing(body)
  return stop
}

function speedControl(id) {
  return `<label class="sel-label">Speed <select id="${id}"><option value="0.6">0.6×</option><option value="0.8">0.8×</option><option value="0.9" selected>0.9×</option><option value="1">1.0×</option><option value="1.2">1.2×</option></select></label>`
}

function shadowing(body) {
  let i = 0
  const draw = () => {
    const text = SHADOWING[i]
    body.innerHTML = card(`<div class="test-top"><b>Shadowing ${i + 1}/${SHADOWING.length}</b>${speedControl('shSpeed')}</div>
      <p class="big-text">${esc(text)}</p>
      <div class="btn-row"><button class="btn" id="shPlay">🔊 Listen</button><button class="btn ghost" id="shPrev">← Prev</button><button class="btn ghost" id="shNext">Next →</button></div>
      <p class="muted">Listen, then repeat immediately, mimicking rhythm and intonation. Try to overlap with the audio.</p>`)
    $('#shPlay', body).onclick = () => tts.speak(text, 'female', parseFloat($('#shSpeed', body).value))
    $('#shPrev', body).onclick = () => { i = (i - 1 + SHADOWING.length) % SHADOWING.length; draw() }
    $('#shNext', body).onclick = () => { i = (i + 1) % SHADOWING.length; draw() }
  }
  draw()
}

function pronCheck(body) {
  const rec = new SpeechRecognizer()
  let target = rnd(SHADOWING)
  const draw = () => {
    body.innerHTML = card(`<h3>Pronunciation Check</h3>
      ${rec.supported ? '' : '<p class="ex-row no">⚠️ Speech recognition needs Chrome or Edge.</p>'}
      <p class="big-text" id="pcTarget">${esc(target)}</p>
      <div class="btn-row"><button class="btn ghost" id="pcHear">🔊 Hear it</button><button class="btn" id="pcRec" ${rec.supported ? '' : 'disabled'}>🎙️ Start speaking</button><button class="btn ghost" id="pcNew">🔄 New sentence</button></div>
      <div id="pcResult"></div>`)
    $('#pcHear', body).onclick = () => tts.speak(target, 'female', 0.9)
    $('#pcNew', body).onclick = () => { target = rnd(SHADOWING); draw() }
    const recBtn = $('#pcRec', body)
    recBtn.onclick = () => {
      if (rec.listening) { rec.stop(); return }
      recBtn.textContent = '⏹ Stop'
      rec.start({
        onResult: (txt) => { $('#pcResult', body).innerHTML = `<p class="muted">Heard: “${esc(txt)}”</p>` },
        onError: (m) => { $('#pcResult', body).innerHTML = `<p class="ex-row no">${esc(m)}</p>`; recBtn.textContent = '🎙️ Start speaking' },
        onEnd: (txt) => {
          recBtn.textContent = '🎙️ Start speaking'
          const { words, pct } = scorePronunciation(target, txt)
          $('#pcResult', body).innerHTML = `<div class="result-card"><h2>${pct >= 80 ? '🏆' : '💪'} Accuracy: ${pct}%</h2></div>
            <p class="pron-words">${words.map(w => `<span class="${w.ok ? 'ok' : 'no'}">${esc(w.word)}</span>`).join(' ')}</p>
            <p class="muted">Green = recognized clearly, red = unclear or missed.</p>`
        },
      })
    }
  }
  draw()
}

function tongue(body) {
  let i = 0
  const draw = () => {
    const tw = TONGUE_TWISTERS[i]
    body.innerHTML = card(`<div class="test-top"><b>Tongue Twister ${i + 1}/${TONGUE_TWISTERS.length}</b><span class="pill ${tw.d >= 3 ? 'red' : tw.d === 2 ? 'gold' : 'green'}">Difficulty ${tw.d}/3</span></div>
      <p class="big-text">${esc(tw.t)}</p>
      <div class="btn-row">${speedControl('twSpeed')}<button class="btn" id="twPlay">🔊 Listen</button><button class="btn ghost" id="twPrev">←</button><button class="btn ghost" id="twNext">→</button></div>
      <p class="muted">Say it three times, getting faster each round.</p>`)
    $('#twPlay', body).onclick = () => tts.speak(tw.t, rnd(['male', 'female']), parseFloat($('#twSpeed', body).value))
    $('#twPrev', body).onclick = () => { i = (i - 1 + TONGUE_TWISTERS.length) % TONGUE_TWISTERS.length; draw() }
    $('#twNext', body).onclick = () => { i = (i + 1) % TONGUE_TWISTERS.length; draw() }
  }
  draw()
}

function fluency(body) {
  const draw = () => {
    const topic = rnd(SPEAKING_PROMPTS)
    body.innerHTML = card(`<h3>60-Second Fluency Drill</h3>
      <p class="big-text">${esc(topic)}</p>
      <div class="btn-row"><button class="btn" id="flStart">▶️ Start 60s</button><button class="btn ghost" id="flNew">🔄 New topic</button><span class="timer" id="flTimer">01:00</span></div>
      <p class="muted">Speak continuously for 60 seconds without stopping. Don’t worry about mistakes — keep going!</p>`)
    $('#flNew', body).onclick = draw
    $('#flStart', body).onclick = () => {
      let left = 60; const tn = $('#flTimer', body)
      stop()
      timer = setInterval(() => {
        left--
        tn.textContent = '00:' + String(left).padStart(2, '0')
        tn.classList.toggle('danger', left <= 10)
        if (left <= 0) { clearInterval(timer); timer = null; tn.textContent = '✅ Done!' }
      }, 1000)
    }
  }
  draw()
}

function templates(body) {
  const T = [
    { task: 'Task 1 — Independent', body: 'In my opinion, ___. I feel this way for two reasons. First, ___. For example, ___. Second, ___. To illustrate, ___. For these reasons, I believe ___.' },
    { task: 'Task 2 — Reading + Listening', body: 'The reading passage states that ___. The lecturer, however, ___. First, the speaker argues that ___, which contradicts the reading’s claim that ___. Second, ___.' },
    { task: 'Task 3 — Campus + Reading', body: 'The university announced that ___. The student thinks this is a (good/bad) idea for two reasons. First, ___. Second, ___.' },
    { task: 'Task 4 — Academic Lecture', body: 'The lecture explains the concept of ___. The professor gives two examples. First, ___. Second, ___. These examples show that ___.' },
  ]
  body.innerHTML = T.map(t => card(`<h3>${esc(t.task)}</h3><p>${esc(t.body)}</p><button class="btn ghost sm" data-say="${esc(t.body)}">🔊 Hear template</button>`)).join('')
  $$('[data-say]', body).forEach(b => b.onclick = () => tts.speak(b.dataset.say, 'female', 0.95))
}

export const meta = { label: 'Speaking Lab', icon: '🎙️' }
