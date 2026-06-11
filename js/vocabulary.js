// js/vocabulary.js — Vocabulary Builder with SRS + 5 study modes.
import { $, $$, el, esc, section, card, shuffle, say, confetti, toast } from './util.js'
import { DB } from './supabase.js'
import { tts } from './tts.js'
import { VOCABULARY } from './data/vocabulary.js'

const SRS_STEPS = [1, 3, 7, 14] // days; after last → mastered

async function srsMap() {
  const rows = await DB.select('vocabulary_srs')
  const m = {}; rows.forEach(r => m[r.word_id] = r); return m
}
async function reviewWord(wordId, remembered) {
  const rows = await DB.select('vocabulary_srs', { word_id: wordId })
  let row = rows[0]
  if (!row) { row = await DB.insert('vocabulary_srs', { word_id: wordId, interval_days: 1, repetitions: 0, ease_factor: 2.5, next_review: today(1) }) }
  let reps = (row.repetitions || 0)
  if (remembered) reps = Math.min(reps + 1, SRS_STEPS.length)
  else reps = Math.max(0, reps - 1)
  const interval = reps >= SRS_STEPS.length ? 9999 : SRS_STEPS[reps]
  await DB.update('vocabulary_srs', row.id, { repetitions: reps, interval_days: interval, next_review: today(interval) })
}
function today(plus = 0) { const d = new Date(Date.now() + plus * 86400000); return d.toISOString().slice(0, 10) }

export async function render(view) {
  const m = await srsMap()
  const mastered = Object.values(m).filter(r => (r.repetitions || 0) >= SRS_STEPS.length).length
  const learning = Object.values(m).filter(r => (r.repetitions || 0) > 0 && (r.repetitions || 0) < SRS_STEPS.length).length
  const fresh = VOCABULARY.length - mastered - learning
  view.innerHTML = section('\ud83d\udcd6 Vocabulary Builder', `${VOCABULARY.length} words \u00b7 spaced repetition`) +
    card(`<div class="stat3"><div><b>${fresh}</b><span>New</span></div><div><b>${learning}</b><span>Learning</span></div><div><b>${mastered}</b><span>Mastered</span></div></div>
      <div class="seg" id="vMode">
        <button data-m="flash" class="active">Flashcards</button><button data-m="mcq">Multiple Choice</button>
        <button data-m="fill">Fill Blank</button><button data-m="match">Matching</button><button data-m="spell">Spelling</button>
      </div>
      <div class="toolbar"><label class="check"><input type="checkbox" id="ukVoice"> UK voice</label></div>`) +
    `<div id="vArea"></div>`
  $('#ukVoice', view).addEventListener('change', e => tts.setAccent(e.target.checked ? 'UK' : 'US'))
  const area = $('#vArea', view)
  $$('#vMode button', view).forEach(b => b.addEventListener('click', () => {
    $$('#vMode button', view).forEach(x => x.classList.remove('active')); b.classList.add('active')
    modes[b.dataset.m](area)
  }))
  const modes = { flash: flashMode, mcq: mcqMode, fill: fillMode, match: matchMode, spell: spellMode }
  flashMode(area)
}

function flashMode(area) {
  let i = 0; const deck = shuffle(VOCABULARY)
  function show() {
    const w = deck[i]
    area.innerHTML = `<div class="flash" id="flash"><div class="flash-inner">
      <div class="flash-face front"><div class="fw">${esc(w.word)}</div><div class="muted">${esc(w.ipa)}</div><button class="btn ghost sm" id="fsay">\ud83d\udd0a</button></div>
      <div class="flash-face back"><p><b>${esc(w.pos)}</b> \u2014 ${esc(w.def)}</p><p><i>${esc(w.example)}</i></p>${w.syn ? `<p class="muted">syn: ${esc(w.syn)}${w.ant ? ' \u00b7 ant: ' + esc(w.ant) : ''}</p>` : ''}</div>
    </div></div>
    <div class="btn-row"><button class="btn ghost" id="fForgot">\u274c Forgot</button><button class="btn" id="fKnew">\u2705 Knew it</button></div>
    <p class="muted center">${i + 1} / ${deck.length}</p>`
    const fl = $('#flash', area)
    fl.addEventListener('click', e => { if (e.target.id !== 'fsay') fl.classList.toggle('flip') })
    $('#fsay', area).addEventListener('click', e => { e.stopPropagation(); say(deck[i].word, 'female', 0.9) })
    $('#fKnew', area).addEventListener('click', async () => { await reviewWord(w.id, true); next() })
    $('#fForgot', area).addEventListener('click', async () => { await reviewWord(w.id, false); next() })
  }
  function next() { i++; if (i >= deck.length) { confetti(); area.innerHTML = card('<h3>\ud83c\udf89 Deck complete!</h3>'); return } show() }
  show()
}

function mcqMode(area) {
  const deck = shuffle(VOCABULARY).slice(0, 12); let i = 0, score = 0
  function show() {
    if (i >= deck.length) { area.innerHTML = card(`<h3>Score: ${score}/${deck.length}</h3>`); if (score === deck.length) confetti(); return }
    const w = deck[i]
    const opts = shuffle([w.def, ...shuffle(VOCABULARY.filter(x => x.id !== w.id)).slice(0, 3).map(x => x.def)])
    area.innerHTML = card(`<div class="qtext">Meaning of <b>${esc(w.word)}</b>?</div><div class="opts">${opts.map(o => `<button class="opt">${esc(o)}</button>`).join('')}</div><p class="muted">${i + 1}/${deck.length}</p>`)
    $$('.opt', area).forEach(b => b.addEventListener('click', () => {
      const ok = b.textContent === w.def
      $$('.opt', area).forEach(x => { x.classList.add('lock'); if (x.textContent === w.def) x.classList.add('correct') })
      if (ok) { b.classList.add('correct'); score++ } else b.classList.add('wrong')
      reviewWord(w.id, ok)
      setTimeout(() => { i++; show() }, 900)
    }))
  }
  show()
}

function fillMode(area) {
  const deck = shuffle(VOCABULARY.filter(w => w.example && w.group !== 'idiom')).slice(0, 10); let i = 0, score = 0
  function show() {
    if (i >= deck.length) { area.innerHTML = card(`<h3>Score: ${score}/${deck.length}</h3>`); return }
    const w = deck[i]
    const blanked = w.example.replace(new RegExp(w.word, 'i'), '_____')
    area.innerHTML = card(`<div class="qtext">Fill the blank:</div><p><i>${esc(blanked)}</i></p><input class="input" id="fillIn" placeholder="type the word"><button class="btn" id="fillCheck">Check</button><div id="fillR"></div><p class="muted">${i + 1}/${deck.length}</p>`)
    $('#fillCheck', area).addEventListener('click', () => {
      const val = $('#fillIn', area).value.trim().toLowerCase()
      const ok = val === w.word.toLowerCase()
      if (ok) score++
      reviewWord(w.id, ok)
      $('#fillR', area).innerHTML = `<div class="ex-row ${ok ? 'ok' : 'no'}">${ok ? '\u2705 Correct!' : '\u274c Answer: ' + esc(w.word)}</div>`
      setTimeout(() => { i++; show() }, 1100)
    })
  }
  show()
}

function matchMode(area) {
  const pick = shuffle(VOCABULARY).slice(0, 6)
  const left = shuffle(pick), right = shuffle(pick)
  let selectedWord = null, done = 0
  area.innerHTML = card(`<p class="muted">Match each word to its definition.</p><div class="match-grid">
    <div class="match-col">${left.map(w => `<button class="match-item word" data-id="${w.id}">${esc(w.word)}</button>`).join('')}</div>
    <div class="match-col">${right.map(w => `<button class="match-item def" data-id="${w.id}">${esc(w.def)}</button>`).join('')}</div></div>`)
  $$('.match-item.word', area).forEach(b => b.addEventListener('click', () => {
    $$('.match-item.word', area).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); selectedWord = b
  }))
  $$('.match-item.def', area).forEach(b => b.addEventListener('click', () => {
    if (!selectedWord) return
    if (selectedWord.dataset.id === b.dataset.id) {
      b.classList.add('done'); selectedWord.classList.add('done'); selectedWord.classList.remove('sel'); selectedWord.disabled = b.disabled = true; selectedWord = null
      if (++done === pick.length) { confetti(); toast('All matched! \ud83c\udf89', 'ok') }
    } else { b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 500) }
  }))
}

function spellMode(area) {
  const deck = shuffle(VOCABULARY).slice(0, 10); let i = 0, score = 0
  function show() {
    if (i >= deck.length) { area.innerHTML = card(`<h3>Score: ${score}/${deck.length}</h3>`); return }
    const w = deck[i]
    area.innerHTML = card(`<p class="muted">Listen and spell the word.</p><button class="btn ghost" id="spkBtn">\ud83d\udd0a Play</button><input class="input" id="spIn" placeholder="spelling"><button class="btn" id="spChk">Check</button><div id="spR"></div><p class="muted">${i + 1}/${deck.length}</p>`)
    say(w.word, 'female', 0.85)
    $('#spkBtn', area).addEventListener('click', () => say(w.word, 'female', 0.8))
    $('#spChk', area).addEventListener('click', () => {
      const ok = $('#spIn', area).value.trim().toLowerCase() === w.word.toLowerCase()
      if (ok) score++
      reviewWord(w.id, ok)
      $('#spR', area).innerHTML = `<div class="ex-row ${ok ? 'ok' : 'no'}">${ok ? '\u2705 Correct' : '\u274c ' + esc(w.word)}</div>`
      setTimeout(() => { i++; show() }, 1100)
    })
  }
  show()
}

export const meta = { label: 'Vocabulary Builder', icon: '\ud83d\udcd6' }
