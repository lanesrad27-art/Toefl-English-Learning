// js/conversation.js — Daily Conversation Practice (fluency)
import { $, $$, esc, section, card, toast } from './util.js'
import { tts } from './tts.js'
import { CONVERSATIONS } from './data/conversations.js'

export async function render(view) {
  let ci = 0
  view.innerHTML = section('💬 Daily Conversation Practice', 'Real-life dialogues with two voices, adjustable speed, natural phrases, and role-play.') +
    card(`<label class="sel-label">Scenario <select id="cvSel">${CONVERSATIONS.map((c, i) => `<option value="${i}">${esc(c.title)} (${c.level})</option>`).join('')}</select></label>`) +
    `<div id="cvBody"></div>`
  const body = $('#cvBody', view)
  const draw = () => {
    const c = CONVERSATIONS[ci]
    const roles = [...new Set(c.lines.map(l => l.name))]
    body.innerHTML =
      card(`<div class="test-top"><b>${esc(c.title)}</b><span class="pill navy">${c.level}</span></div>
        <div class="btn-row">
          <label class="sel-label">Speed <select id="cvSpeed"><option value="0.6">0.6×</option><option value="0.8">0.8×</option><option value="1" selected>1.0×</option><option value="1.2">1.2×</option></select></label>
          <button class="btn" id="cvPlay">▶️ Play dialogue</button>
          <button class="btn ghost" id="cvStop">⏹ Stop</button>
          <label class="sel-label">Role-play as <select id="cvRole"><option value="">— off —</option>${roles.map(r => `<option value="${esc(r)}">${esc(r)}</option>`).join('')}</select></label>
        </div>
        <div class="dialogue" id="cvDialogue">${c.lines.map((l, i) => lineHtml(l, i)).join('')}</div>`) +
      card(`<h3>✨ Natural phrases native speakers use</h3>${c.natural.map(n => `<div class="phrase"><b>“${esc(n.phrase)}”</b><p class="muted">${esc(n.why)}</p></div>`).join('')}`) +
      card(`<h3>📖 Vocabulary from this dialogue</h3><div class="vocab-mini">${c.vocab.map(v => `<div class="list-row"><b>${esc(v.word)}</b><span>${esc(v.def)}</span></div>`).join('')}</div>`)
    const speed = () => parseFloat($('#cvSpeed', body).value)
    $('#cvPlay', body).onclick = () => {
      tts.stop()
      tts.speakDialogue(c.lines, speed(), (idx) => {
        $$('#cvDialogue .line', body).forEach(p => p.classList.remove('cur'))
        const cur = $(`#cvDialogue .line[data-i="${idx}"]`, body); if (cur) cur.classList.add('cur')
      })
    }
    $('#cvStop', body).onclick = () => tts.stop()
    $('#cvRole', body).onchange = e => applyRole(e.target.value)
    $$('#cvDialogue .play-line', body).forEach(b => b.onclick = () => { const l = c.lines[+b.dataset.i]; tts.speak(l.text, l.gender, speed()) })
    function applyRole(role) {
      $$('#cvDialogue .line', body).forEach((p, i) => {
        const l = c.lines[i]
        const bubble = p.querySelector('.bubble')
        if (role && l.name === role) { bubble.classList.add('hidden-role'); bubble.dataset.text = l.text; bubble.innerHTML = '<i class="muted">[your line — say it, then click to reveal]</i>' }
        else { bubble.classList.remove('hidden-role'); bubble.innerHTML = esc(l.text) }
      })
      if (role) toast('Role-play on: respond as ' + role + ' before revealing.')
    }
    $$('#cvDialogue .bubble', body).forEach(b => b.onclick = () => { if (b.classList.contains('hidden-role')) { b.innerHTML = esc(b.dataset.text); b.classList.remove('hidden-role') } })
  }
  $('#cvSel', view).onchange = e => { ci = +e.target.value; draw() }
  draw()
  return () => tts.stop()
}
function lineHtml(l, i) {
  return `<div class="line ${l.gender}" data-i="${i}"><span class="who">${l.gender === 'male' ? '👨' : '👩'} ${esc(l.name)}</span><span class="bubble">${esc(l.text)}</span><button class="play-line" data-i="${i}" title="Play line">🔊</button></div>`
}

export const meta = { label: 'Conversation Practice', icon: '💬' }
