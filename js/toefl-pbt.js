// js/toefl-pbt.js — TOEFL PBT: Structure & Written Expression
import { $, $$, esc, section, card, LETTERS, renderQuiz, shuffle } from './util.js'
import { STRUCTURE, WRITTEN_EXPRESSION } from './data/questions-structure.js'

// Build a renderable quiz item from a Written Expression entry.
function weToItem(we) {
  let display = we.sentence
  we.parts.forEach((p, i) => {
    display = display.replace('{' + i + '}', `(${LETTERS[i]}) ̲${p}̲`)
  })
  return {
    q: 'Identify the underlined part that is grammatically INCORRECT:\n' + display,
    opts: we.parts.map((p, i) => `(${LETTERS[i]}) ${p}`),
    a: we.a,
    expl: `Correct form: “${we.correction}”. ${we.rule}`,
    rule: we.rule, example: we.example, tip: we.tip, time: we.time,
    type: we.topic, category: 'Written Expression', id: we.id,
  }
}
function structToItem(s) {
  return { q: s.q, opts: s.opts, a: s.a, expl: s.rule, rule: s.rule, example: s.example, tip: s.tip, time: s.time, type: s.topic, category: 'Structure', id: s.id }
}

export async function render(view) {
  view.innerHTML = section('📝 TOEFL PBT — Structure & Written Expression', 'Paper-Based Test grammar section. Section 2 of the TOEFL ITP/PBT.') +
    `<div class="grid g3">
      ${tile('full', '🎯', 'Full Section', 'Structure + Written Expression, timed 25 min')}
      ${tile('structure', '🧩', 'Structure Drill', STRUCTURE.length + ' sentence-completion items')}
      ${tile('we', '🔍', 'Written Expression Drill', WRITTEN_EXPRESSION.length + ' error-identification items')}
    </div><div id="pbtArea"></div>`
  const area = $('#pbtArea', view)
  $$('[data-mode]', view).forEach(b => b.onclick = () => {
    $$('[data-mode]', view).forEach(x => x.classList.remove('active')); b.classList.add('active')
    start(b.dataset.mode, area)
  })
  view.querySelector('[data-mode="full"]').classList.add('active')
  start('full', area)
}
function tile(mode, icon, title, sub) {
  return `<button class="tile" data-mode="${mode}"><div class="tile-ico">${icon}</div><b>${title}</b><span class="muted">${sub}</span></button>`
}
function start(mode, area) {
  let items = []
  if (mode === 'structure') items = STRUCTURE.map(structToItem)
  else if (mode === 'we') items = WRITTEN_EXPRESSION.map(weToItem)
  else items = shuffle([...STRUCTURE.map(structToItem), ...WRITTEN_EXPRESSION.map(weToItem)])
  area.innerHTML = card(`<p class="muted">${items.length} questions. Read each explanation — grammar rule, example, and a strategy tip are included.</p><div id="pbtQuiz"></div>`)
  renderQuiz(items, { container: $('#pbtQuiz', area), category: mode === 'we' ? 'Written Expression' : 'Structure', section: 'structure' })
}

export const meta = { label: 'TOEFL PBT Structure', icon: '📝' }
