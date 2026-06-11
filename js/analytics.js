// js/analytics.js — Analytics & Score Predictor
import { $, $$, esc, section, card, DB, predictScores, skillScores, SECTIONS, getStreak } from './util.js'

export async function render(view) {
  view.innerHTML = section('📈 Analytics & Score Predictor', 'Track progress, predict your TOEFL score, and find skill gaps.') + '<div id="anBody"><div class="card"><p class="muted">Crunching numbers…</p></div></div>'
  const body = $('#anBody', view)
  let pred = { ibt: 0, ibtPer: {}, pbt: 0, avg: 0, confidence: 'low', sk: {} }
  try { pred = await predictScores() } catch {}
  let sk = {}; try { sk = await skillScores() } catch {}
  let streak = { current_streak: 0 }; try { streak = await getStreak() } catch {}
  const progress = await DB.select('user_progress').catch(() => [])
  const errors = await DB.select('error_journal').catch(() => [])

  body.innerHTML =
    card(`<h3>🔮 Predicted scores</h3>
      <div class="grid g3">
        <div class="tile big"><div class="tile-ico">🌐</div><b class="score-big">${pred.ibt}</b><span>TOEFL iBT (/120)</span></div>
        <div class="tile big"><div class="tile-ico">📝</div><b class="score-big">${pred.pbt}</b><span>TOEFL PBT (310–677)</span></div>
        <div class="tile big"><div class="tile-ico">🎯</div><b class="score-big">${pred.avg}%</b><span>Avg accuracy</span></div>
      </div>
      <p class="muted">Confidence: <span class="pill ${pred.confidence === 'high' ? 'green' : pred.confidence === 'medium' ? 'gold' : 'red'}">${esc(pred.confidence)}</span> — based on ${progress.length} recorded sessions. More practice → more accurate prediction.</p>`) +
    card(`<h3>📊 iBT section breakdown (/30)</h3>${SECTIONS.filter(s => ['Reading', 'Listening', 'Speaking', 'Writing'].includes(s)).map(s => barRow(s, pred.ibtPer?.[s] ?? 0, 30)).join('')}`) +
    card(`<h3>💪 Skill mastery (%)</h3>${SECTIONS.map(s => barRow(s, Math.round(sk[s] ?? 0), 100)).join('')}`) +
    gapAnalysis(sk, errors) +
    trend(progress) +
    card(`<h3>🔥 Consistency</h3><p>Current streak: <b>${streak.current_streak || 0} day(s)</b> · Total sessions: <b>${progress.length}</b> · Errors logged: <b>${errors.length}</b></p>`)
}

function barRow(label, val, max) {
  const pct = Math.round(val / max * 100)
  const cls = pct >= 75 ? 'green' : pct >= 50 ? 'gold' : 'red'
  return `<div class="bar-row"><span class="bar-label">${esc(label)}</span><div class="bar"><i class="${cls}" style="width:${pct}%"></i></div><b>${val}${max === 30 ? '/30' : '%'}</b></div>`
}
function gapAnalysis(sk, errors) {
  const ranked = SECTIONS.map(s => ({ s, v: sk[s] ?? 0 })).sort((a, b) => a.v - b.v)
  const weakest = ranked.slice(0, 2)
  const byCat = {}; errors.forEach(e => { byCat[e.category || 'General'] = (byCat[e.category || 'General'] || 0) + 1 })
  const topErr = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 3)
  return card(`<h3>🎯 Gap analysis & recommendations</h3>
    <p>Focus areas: ${weakest.map(w => `<span class="pill red">${esc(w.s)} (${Math.round(w.v)}%)</span>`).join(' ')}</p>
    ${topErr.length ? `<p>Frequent error types: ${topErr.map(([c, n]) => `<span class="pill gold">${esc(c)} ×${n}</span>`).join(' ')}</p>` : ''}
    <ul class="reco-list">${weakest.map(w => `<li>Schedule extra ${esc(w.s)} practice and review related items in the Error Journal.</li>`).join('')}</ul>`)
}
function trend(progress) {
  if (!progress.length) return card('<h3>📈 Score trend</h3><p class="muted">No sessions yet. Complete practice to see your trend.</p>')
  const last = progress.slice(-14).map(p => Math.round((p.score / (p.total || 1)) * 100))
  const max = 100
  return card(`<h3>📈 Accuracy trend (last ${last.length})</h3>
    <div class="sparkline">${last.map(v => `<div class="spark" style="height:${Math.max(4, v)}%" title="${v}%"></div>`).join('')}</div>
    <p class="muted">Each bar is one session’s accuracy. Aim for an upward trend.</p>`)
}

export const meta = { label: 'Analytics & Predictor', icon: '📈' }
