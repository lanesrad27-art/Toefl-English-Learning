// js/error-journal.js — Error Journal: review, filters, mastery, weekly digest, export
import { $, $$, esc, section, card, LETTERS, toast, DB } from './util.js'

export async function render(view) {
  view.innerHTML = section('📒 Error Journal', 'Every mistake from practice and tests, ready to review until mastered.')+ '<div id="ejBody"><div class="card"><p class="muted">Loading…</p></div></div>'
  await draw($('#ejBody', view))
}

async function draw(body, filter = {}) {
  let rows = await DB.select('error_journal')
  rows.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  const cats = [...new Set(rows.map(r => r.category).filter(Boolean))]
  const filtered = rows.filter(r =>
    (!filter.category || r.category === filter.category) &&
    (!filter.status || (filter.status === 'mastered' ? (r.correct_count >= 3) : (r.correct_count < 3))))
  body.innerHTML =
    card(`<div class="toolbar">
      <label class="sel-label">Category <select id="ejCat"><option value="">All</option>${cats.map(c => `<option ${filter.category === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
      <label class="sel-label">Status <select id="ejStatus"><option value="">All</option><option value="learning" ${filter.status === 'learning' ? 'selected' : ''}>Still learning</option><option value="mastered" ${filter.status === 'mastered' ? 'selected' : ''}>Mastered</option></select></label>
      <button class="btn ghost sm" id="ejExport">⬇️ Export</button>
    </div>`) +
    digest(rows) +
    (filtered.length ? filtered.map(card_).join('') : card('<p class="muted">No errors here. 🎉 Keep practicing!</p>'))
  $('#ejCat', body).onchange = e => draw(body, { ...filter, category: e.target.value })
  $('#ejStatus', body).onchange = e => draw(body, { ...filter, status: e.target.value })
  $('#ejExport', body).onclick = () => exportTxt(filtered)
  $$('[data-correct]', body).forEach(b => b.onclick = async () => {
    const id = b.dataset.correct; const row = rows.find(r => r.id === id)
    const cc = (row.correct_count || 0) + 1
    await DB.update('error_journal', id, { correct_count: cc, reviewed: cc >= 3 })
    toast(cc >= 3 ? 'Mastered! 🏆' : `Correct ×${cc} — ${3 - cc} more to master`); draw(body, filter)
  })
  $$('[data-del]', body).forEach(b => b.onclick = async () => { await DB.remove('error_journal', b.dataset.del); draw(body, filter) })
}
function card_(r) {
  const mastered = (r.correct_count || 0) >= 3
  return card(`<div class="quiz-head"><span class="pill navy">${esc(r.category || 'General')}</span>${mastered ? '<span class="pill green">✓ Mastered</span>' : `<span class="pill gold">${r.correct_count || 0}/3</span>`}</div>
    <div class="qtext">${esc(r.question_text)}</div>
    <div class="ex-row no">❌ Your answer: ${esc(r.user_answer || '—')}</div>
    <div class="ex-row ok">✅ Correct: ${esc(r.correct_answer || '—')}</div>
    ${r.explanation ? `<div class="ex-row info">📖 ${esc(r.explanation)}</div>` : ''}
    <div class="btn-row"><button class="btn sm" data-correct="${r.id}">✓ I got it right</button><button class="btn ghost sm" data-del="${r.id}">🗑 Remove</button></div>`)
}
function digest(rows) {
  if (!rows.length) return ''
  const byCat = {}; rows.forEach(r => { byCat[r.category || 'General'] = (byCat[r.category || 'General'] || 0) + 1 })
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const mastered = rows.filter(r => (r.correct_count || 0) >= 3).length
  return card(`<h3>📊 Weekly Digest</h3>
    <p>${rows.length} total errors · ${mastered} mastered · ${rows.length - mastered} to review.</p>
    <h4>Most frequent error types</h4>
    ${top.map(([c, n]) => `<div class="bar-row"><span>${esc(c)}</span><div class="bar"><i style="width:${Math.round(n / rows.length * 100)}%"></i></div><b>${n}</b></div>`).join('')}
    <p class="muted">Focus your next sessions on the top categories above.</p>`)
}
function exportTxt(rows) {
  const txt = rows.map((r, i) => `${i + 1}. [${r.category}] ${r.question_text}\n   Your answer: ${r.user_answer}\n   Correct: ${r.correct_answer}\n   ${r.explanation || ''}\n`).join('\n')
  const blob = new Blob([txt || 'No errors.'], { type: 'text/plain' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'error-journal.txt'; a.click()
}

export const meta = { label: 'Error Journal', icon: '📒' }
