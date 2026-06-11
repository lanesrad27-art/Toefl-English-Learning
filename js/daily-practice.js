// js/daily-practice.js
import { $, $$, el, esc, section, card, renderQuiz, shuffle } from './util.js'
import { STRUCTURE, WRITTEN_EXPRESSION } from './data/questions-structure.js'
import { READING_PASSAGES } from './data/questions-reading.js'
import { VOCABULARY } from './data/vocabulary.js'
import { GRAMMAR } from './data/grammar-lessons.js'

// Build a unified question pool tagged by category.
function structureItems() {
  return STRUCTURE.map(s => ({ id: s.id, q: s.q, opts: s.opts, a: s.a, expl: s.rule, example: s.example, tip: s.tip, rule: s.rule, time: s.time, type: s.topic, category: 'Structure' }))
}
function weItems() {
  return WRITTEN_EXPRESSION.map(w => {
    const q = 'Find the error: ' + w.parts.map((p, i) => `(${'ABCD'[i]}) ${p}`).join('  ')
    const sentence = w.sentence.replace(/\{(\d)\}/g, (_, i) => `[${'ABCD'[+i]}] ${w.parts[+i]}`)
    return { id: w.id, q: sentence + '\n\nWhich underlined part is incorrect?', opts: w.parts.map((p, i) => `${'ABCD'[i]}: ${p}`), a: w.a, expl: `Correct form: "${w.correction}". ${w.rule}`, example: w.example, tip: w.tip, rule: w.rule, time: w.time, type: w.topic, category: 'Written Expression' }
  })
}
function readingItems() {
  const out = []
  READING_PASSAGES.forEach(p => p.questions.forEach((qq, i) => out.push({ id: p.id + '-' + i, q: `[${esc(p.title)}] ${qq.q}`, opts: qq.opts, a: qq.a, expl: qq.expl, wrong: qq.wrong, tip: qq.tip, time: qq.time, type: qq.type, category: 'Reading' })))
  return out
}
function vocabItems() {
  return VOCABULARY.filter(w => w.group !== 'idiom').map(w => {
    const others = shuffle(VOCABULARY.filter(x => x.id !== w.id)).slice(0, 3).map(x => x.def)
    const opts = shuffle([w.def, ...others])
    return { id: w.id, q: `What is the meaning of "${w.word}"?`, opts, a: opts.indexOf(w.def), expl: `${w.word}: ${w.def}`, example: w.example, tip: 'Use context clues and word roots to guess unfamiliar words.', time: 25, type: 'Vocabulary', category: 'Vocabulary' }
  })
}
function grammarItems() {
  const out = []
  GRAMMAR.forEach(g => g.exercises.forEach((ex, i) => out.push({ id: g.id + '-' + i, q: `[${esc(g.title)}] ${ex.q}`, opts: ex.opts, a: ex.a, expl: ex.expl, tip: g.tips[0], rule: g.en, time: 25, type: g.title, category: 'Grammar' })))
  return out
}

const POOLS = {
  Reading: readingItems, Structure: structureItems, 'Written Expression': weItems,
  Vocabulary: vocabItems, Grammar: grammarItems,
}
const CATS = ['Mixed', 'Reading', 'Structure', 'Written Expression', 'Vocabulary', 'Grammar']

// Rotation: don't repeat until pool exhausted (tracked in localStorage).
function drawDaily(cat, n) {
  let pool = []
  if (cat === 'Mixed') Object.values(POOLS).forEach(fn => pool.push(...fn()))
  else pool = POOLS[cat] ? POOLS[cat]() : []
  const key = 'daily_seen_' + cat
  let seen = JSON.parse(localStorage.getItem(key) || '[]')
  let remaining = pool.filter(q => !seen.includes(q.id))
  if (remaining.length < n) { seen = []; remaining = pool }
  const chosen = shuffle(remaining).slice(0, Math.min(n, remaining.length))
  seen = seen.concat(chosen.map(c => c.id))
  localStorage.setItem(key, JSON.stringify(seen))
  return chosen
}

export async function render(view) {
  view.innerHTML = section('\ud83d\udcc5 Daily Practice', 'Adaptive question sets that rotate so you never repeat until the pool is exhausted.') +
    card(`<div class="toolbar">
      <label>Category <select id="dpCat">${CATS.map(c => `<option>${c}</option>`).join('')}</select></label>
      <label>Questions <select id="dpN"><option>10</option><option>15</option><option>20</option></select></label>
      <label class="check"><input type="checkbox" id="dpTimer"> Per-question timer</label>
      <button class="btn" id="dpStart">Start</button>
    </div>`) +
    `<div id="dpArea"></div>`
  $('#dpN', view).value = '15'
  $('#dpStart', view).addEventListener('click', () => {
    const cat = $('#dpCat', view).value
    const n = parseInt($('#dpN', view).value, 10)
    const items = drawDaily(cat, n)
    const area = $('#dpArea', view)
    if (!items.length) { area.innerHTML = card('<p>No questions available for this category yet.</p>'); return }
    area.innerHTML = '<div class="card" id="dpQuiz"></div>'
    renderQuiz(items, { container: $('#dpQuiz', view), category: cat === 'Mixed' ? 'Reading' : cat, section: cat === 'Mixed' ? 'reading' : cat })
  })
}

export const meta = { label: 'Daily Practice', icon: '\ud83d\udcc5' }
