// js/pronunciation.js — Pronunciation Trainer (IPA, minimal pairs, mispronunciations, AmE/BrE, phoneme drills)
import { $, $$, esc, section, card } from './util.js'
import { tts } from './tts.js'
import { IPA_CHART, MINIMAL_PAIRS, MISPRON_ID, AME_BRE, PHONEME_DRILLS } from './data/pronunciation.js'

export async function render(view) {
  view.innerHTML = section('🔊 Pronunciation Trainer', 'IPA chart, minimal pairs, Indonesia-edition fixes, American vs British, and phoneme drills.') +
    `<div class="seg" id="prTab">
      <button data-t="ipa" class="active">IPA Chart</button>
      <button data-t="pairs">Minimal Pairs</button>
      <button data-t="drills">Phoneme Drills</button>
      <button data-t="mispron">Indonesia Edition</button>
      <button data-t="accent">American vs British</button>
    </div><div id="prBody"></div>`
  const body = $('#prBody', view)
  const tabs = { ipa, pairs, drills, mispron, accent }
  $$('#prTab button', view).forEach(b => b.onclick = () => { $$('#prTab button', view).forEach(x => x.classList.remove('active')); b.classList.add('active'); tts.stop(); tabs[b.dataset.t](body) })
  ipa(body)
  return () => tts.stop()
}

function ipa(body) {
  body.innerHTML = card(`<h3>Interactive IPA Chart</h3><p class="muted">Click any sound to hear an example word.</p>
    <div class="ipa-grid">${IPA_CHART.map((p, i) => `<button class="ipa-cell" data-i="${i}"><b>${esc(p.s)}</b><span>${esc(p.ex)}</span></button>`).join('')}</div>
    <div id="ipaInfo"></div>`)
  $$('.ipa-cell', body).forEach(c => c.onclick = () => {
    const p = IPA_CHART[+c.dataset.i]
    const firstWord = p.ex.split(',')[0].trim()
    tts.speak(firstWord, 'female', 0.85)
    $('#ipaInfo', body).innerHTML = `<div class="ex-row info">${esc(p.s)} as in <b>${esc(p.ex)}</b> — ${esc(p.mouth)}</div>`
  })
}

function pairs(body) {
  body.innerHTML = card(`<h3>Minimal Pairs (${MINIMAL_PAIRS.length})</h3><p class="muted">Two words differing by one sound. Listen and feel the contrast.</p>
    <div class="pair-list">${MINIMAL_PAIRS.map((p, i) => `<div class="pair-row"><button class="chip" data-w="${esc(p[0])}">🔊 ${esc(p[0])}</button><span class="vs">vs</span><button class="chip" data-w="${esc(p[1])}">🔊 ${esc(p[1])}</button><span class="muted">${esc(p[2] || '')}</span></div>`).join('')}</div>`)
  $$('.pair-row .chip', body).forEach(b => b.onclick = () => tts.speak(b.dataset.w, 'female', 0.8))
}

function drills(body) {
  body.innerHTML = `<div class="page-head"><p class="muted">Sounds that don’t exist in Bahasa Indonesia — practice each set slowly.</p></div>` +
    PHONEME_DRILLS.map((d, i) => card(`<h3>${esc(d.p)}</h3><p class="muted">${esc(d.tip)}</p>
      <div class="chip-row">${d.words.map(w => `<button class="chip" data-w="${esc(w)}">🔊 ${esc(w)}</button>`).join('')}</div>
      <button class="btn ghost sm" data-all="${i}">🔊 Play all</button>`)).join('')
  $$('.chip-row .chip', body).forEach(b => b.onclick = () => tts.speak(b.dataset.w, 'female', 0.8))
  $$('[data-all]', body).forEach(b => b.onclick = () => { const d = PHONEME_DRILLS[+b.dataset.all]; tts.speakDialogue(d.words.map(w => ({ text: w, gender: 'female' })), 0.8) })
}

function mispron(body) {
  body.innerHTML = card(`<h3>Common Mispronunciations — Indonesia Edition (${MISPRON_ID.length})</h3>
    <table class="data-table"><tr><th>Word</th><th>❌ Often said</th><th>✅ Correct</th><th>Note</th><th></th></tr>
    ${MISPRON_ID.map(m => `<tr><td><b>${esc(m[0])}</b></td><td class="no">${esc(m[1])}</td><td class="ok">${esc(m[2])}</td><td class="muted">${esc(m[3] || '')}</td><td><button class="chip" data-w="${esc(m[0])}">🔊</button></td></tr>`).join('')}</table>`)
  $$('.data-table .chip', body).forEach(b => b.onclick = () => tts.speak(b.dataset.w, 'female', 0.8))
}

function accent(body) {
  body.innerHTML = card(`<h3>American vs British (${AME_BRE.length})</h3>
    <table class="data-table"><tr><th>Word</th><th>🇺🇸 American</th><th>🇬🇧 British</th></tr>
    ${AME_BRE.map(a => `<tr><td><b>${esc(a[0])}</b></td><td>${esc(a[1])} <button class="chip" data-w="${esc(a[0])}" data-acc="US">🔊</button></td><td>${esc(a[2])} <button class="chip" data-w="${esc(a[0])}" data-acc="UK">🔊</button></td></tr>`).join('')}</table>`)
  $$('.data-table .chip', body).forEach(b => b.onclick = () => { tts.setAccent(b.dataset.acc); tts.speak(b.dataset.w, 'female', 0.85); setTimeout(() => tts.setAccent('US'), 1500) })
}

export const meta = { label: 'Pronunciation Trainer', icon: '🔊' }
