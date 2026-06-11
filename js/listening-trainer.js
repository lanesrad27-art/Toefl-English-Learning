// js/listening-trainer.js — Note-taking trainer (Cornell notes, symbols, practice)
import { $, $$, esc, section, card, renderQuiz } from './util.js'
import { tts } from './tts.js'
import { LISTENING } from './data/listening-transcripts.js'

const stop = () => tts.stop()

export async function render(view) {
  stop()
  view.innerHTML = section('📝 Listening Note-Taking Trainer', 'Cornell notes, abbreviation guide, and guided listening practice.') +
    `<div class="seg" id="ltTab">
      <button data-t="guide" class="active">Symbol Guide</button>
      <button data-t="cornell">Cornell Template</button>
      <button data-t="practice">Practice</button>
      <button data-t="samples">Good vs Bad Notes</button>
    </div><div id="ltBody"></div>`
  const body = $('#ltBody', view)
  const tabs = { guide: guide, cornell: cornell, practice: practice, samples: samples }
  $$('#ltTab button', view).forEach(b => b.onclick = () => { $$('#ltTab button', view).forEach(x => x.classList.remove('active')); b.classList.add('active'); stop(); tabs[b.dataset.t](body) })
  guide(body)
  return stop
}

const SYMBOLS = [
  ['→', 'leads to / causes / results in'], ['∵', 'because'], ['∴', 'therefore / so'],
  ['↑', 'increase / rise / grow'], ['↓', 'decrease / fall / drop'], ['≈', 'approximately / about'],
  ['=', 'is / equals / means'], ['≠', 'is not / differs'], ['&', 'and'], ['w/', 'with'], ['w/o', 'without'],
  ['vs', 'versus / compared to'], ['e.g.', 'for example'], ['b/c', 'because'], ['∆', 'change'], ['#', 'number'],
  ['+', 'plus / advantage'], ['—', 'minus / disadvantage'], ['1st/2nd', 'first / second point'], ['?', 'unclear / question'],
]
function guide(body) {
  body.innerHTML = card(`<h3>Abbreviation & Symbol Guide</h3><div class="sym-grid">${SYMBOLS.map(([s, m]) => `<div class="sym"><b>${esc(s)}</b><span>${esc(m)}</span></div>`).join('')}</div>`) +
    card(`<h4>💡 Note-taking strategy</h4><ul><li>Capture <b>main ideas</b> and <b>relationships</b>, not full sentences.</li><li>Use indentation to show hierarchy (main point → supporting detail).</li><li>Write only keywords + symbols; review immediately after.</li><li>Listen for signposts: “first”, “however”, “for example”, “as a result”.</li></ul>`)
}
function cornell(body) {
  const saved = localStorage.getItem('cornell_notes') || ''
  body.innerHTML = card(`<h3>Cornell Notes Template</h3>
    <div class="cornell">
      <div class="cue"><label>Cues / Questions</label><textarea id="cnCue" placeholder="Key questions, terms..."></textarea></div>
      <div class="notes"><label>Notes</label><textarea id="cnNotes" placeholder="Main ideas & details during the lecture...">${esc(saved)}</textarea></div>
      <div class="summary"><label>Summary</label><textarea id="cnSum" placeholder="Summarize in 2-3 sentences after listening..."></textarea></div>
    </div>
    <button class="btn ghost sm" id="cnSave">💾 Save notes</button>`)
  $('#cnSave', body).onclick = () => { localStorage.setItem('cornell_notes', $('#cnNotes', body).value); $('#cnSave', body).textContent = '✅ Saved' }
}
function practice(body) {
  let si = 0
  const draw = () => {
    const s = LISTENING[si]
    body.innerHTML = card(`<div class="test-top"><b>${esc(s.title)} (${si + 1}/${LISTENING.length})</b><span class="pill">${s.kind}</span>${speed()}</div>
      <div class="btn-row"><button class="btn" id="ltPlay">▶️ Play audio</button><button class="btn ghost" id="ltStop">⏹ Stop</button><button class="btn ghost" id="ltNext">Next →</button></div>
      <div class="wave" id="ltWave">${'<i></i>'.repeat(24)}</div>`) +
      card(`<h4>Your notes</h4><textarea class="notearea" id="ltNotes" placeholder="Take notes while listening. Questions appear after the audio."></textarea>`) +
      `<div id="ltQ"></div>`
    const play = () => {
      tts.stop(); $('#ltWave', body).classList.add('play')
      tts.speakDialogue(s.lines, parseFloat($('#ltSpeed', body).value)).then(() => { const w = $('#ltWave', body); if (w) w.classList.remove('play'); showQ() })
    }
    $('#ltPlay', body).onclick = play
    $('#ltStop', body).onclick = () => { tts.stop(); $('#ltWave', body).classList.remove('play') }
    $('#ltNext', body).onclick = () => { si = (si + 1) % LISTENING.length; draw() }
    function showQ() {
      $('#ltQ', body).innerHTML = '<div class="card"><h4>Questions</h4><div id="ltQz"></div></div>'
      renderQuiz(s.questions.map(q => ({ q: q.q, opts: q.opts, a: q.a, expl: q.expl, tip: q.tip, time: q.time, type: q.type, category: 'Listening' })), { container: $('#ltQz', body), category: 'Listening', section: 'listening' })
    }
  }
  draw()
}
function speed() { return `<label class="sel-label">Speed <select id="ltSpeed"><option value="0.7">Slow</option><option value="0.85" selected>Medium</option><option value="1">Fast</option></select></label>` }
function samples(body) {
  body.innerHTML = card(`<h3>Good vs Bad Notes (same lecture)</h3>
    <div class="twocol">
      <div><h4 class="ok">✅ Good notes</h4><pre class="notes-sample">Photosynthesis
  = plants make food w/ sunlight
  needs: CO2 + H2O + light
  → glucose + O2
  2 stages:
   1st light rxn (in thylakoid)
   2nd Calvin cycle (in stroma)
  ∵ base of food chain</pre></div>
      <div><h4 class="no">❌ Poor notes</h4><pre class="notes-sample">The professor said that photosynthesis is
the process by which plants make their
own food using sunlight and it has two
stages which are very important...</pre><p class="muted">Too wordy, no structure, can’t review quickly.</p></div>
    </div>`)
}

export const meta = { label: 'Listening Trainer', icon: '📝' }
