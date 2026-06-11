// js/grammar.js — Grammar & Structure Center
import { $, $$, esc, section, card, renderQuiz, englishOnly } from './util.js'
import { GRAMMAR } from './data/grammar-lessons.js'

const LEVELS = ['Basic', 'Intermediate', 'Advanced']

export async function render(view) {
  view.innerHTML = section('📐 Grammar & Structure Center', 'Bilingual lessons, color-coded examples, and interactive exercises across three levels.') +
    card(`<div class="seg" id="glvl">${LEVELS.map((l, i) => `<button data-l="${l}" class="${i === 0 ? 'active' : ''}">${l}</button>`).join('')}</div>
      <label class="sel-label">Lesson <select id="gsel"></select></label>`) +
    `<div id="gArea"></div>`
  const sel = $('#gsel', view), area = $('#gArea', view)

  function fillSelect(level) {
    const list = GRAMMAR.filter(g => g.level === level)
    sel.innerHTML = list.map(g => `<option value="${g.id}">${esc(g.title)}</option>`).join('')
    if (list[0]) renderLesson(list[0].id)
  }
  function renderLesson(id) {
    const g = GRAMMAR.find(x => x.id === id); if (!g) return
    const exHtml = g.examples.map(e => {
      let txt = esc(e.text)
      ;(e.hl || []).forEach(h => { txt = txt.replace(esc(h), `<mark>${esc(h)}</mark>`) })
      return `<li>${txt}</li>`
    }).join('')
    area.innerHTML =
      card(`<h2>${esc(g.title)} <span class="pill navy">${g.level}</span></h2>
        <p>${esc(g.en)}</p>
        ${!englishOnly() && g.idn ? `<p class="muted">🇮🇩 ${esc(g.idn)}</p>` : ''}`) +
      card(`<h3>✍️ Examples</h3><ul class="hl-list">${exHtml}</ul>`) +
      card(`<h3>⚠️ Common Mistakes (Indonesia)</h3>${g.mistakes.map(m => `<div class="mistake"><div class="bad">❌ ${esc(m.wrong)}</div><div class="good">✅ ${esc(m.right)}</div><div class="muted">${esc(m.note)}</div></div>`).join('')}`) +
      card(`<h3>🎓 TOEFL Relevance</h3><p>${esc(g.toefl)}</p><h4>💡 Tips</h4><ul>${g.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`) +
      card(`<h3>📝 Practice (${g.exercises.length} questions)</h3><button class="btn" id="gQuizStart">Start exercises</button><div id="gQuiz"></div>`)
    $('#gQuizStart', area).addEventListener('click', () => {
      const items = g.exercises.map(ex => ({ q: ex.q, opts: ex.opts, a: ex.a, expl: ex.expl, rule: g.en, tip: g.tips[0], time: 25, type: g.title, category: 'Grammar' }))
      $('#gQuiz', area).innerHTML = '<div class="card" id="gQz"></div>'
      renderQuiz(items, { container: $('#gQz', area), category: 'Grammar', section: 'structure' })
    })
  }
  $$('#glvl button', view).forEach(b => b.addEventListener('click', () => {
    $$('#glvl button', view).forEach(x => x.classList.remove('active')); b.classList.add('active')
    fillSelect(b.dataset.l)
  }))
  sel.addEventListener('change', () => renderLesson(sel.value))
  fillSelect('Basic')
}

export const meta = { label: 'Grammar & Structure', icon: '📐' }
