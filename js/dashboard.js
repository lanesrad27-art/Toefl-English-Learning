// js/dashboard.js
import { $, $$, el, esc, section, card, SECTIONS, getStreak, predictScores, say } from './util.js'
import { Auth, DB } from './supabase.js'
import { quoteOfTheDay } from './data/quotes.js'
import { Router } from './router.js'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

function ring(label, pct) {
  const color = pct >= 75 ? '#4caf50' : pct >= 40 ? '#ffc107' : '#f44336'
  return `<div class="ring-box">
    <div class="ring" style="--p:${pct};--c:${color}"><span>${pct}%</span></div>
    <div class="ring-label">${esc(label)}</div></div>`
}

function calendar(activeDays) {
  const now = new Date(), y = now.getFullYear(), m = now.getMonth()
  const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate()
  const today = now.getDate()
  let cells = ''
  for (let i = 0; i < first; i++) cells += '<div class="cal-cell empty"></div>'
  for (let d = 1; d <= days; d++) {
    const iso = new Date(y, m, d).toISOString().slice(0, 10)
    const on = activeDays.includes(iso)
    cells += `<div class="cal-cell ${on ? 'active' : ''} ${d === today ? 'today' : ''}">${d}</div>`
  }
  const mn = now.toLocaleString('en-US', { month: 'long' })
  return `<div class="cal"><div class="cal-title">${mn} ${y}</div>
    <div class="cal-grid head">${['S','M','T','W','T','F','S'].map(d=>`<div>${d}</div>`).join('')}</div>
    <div class="cal-grid">${cells}</div></div>`
}

export async function render(view) {
  const user = await Auth.getUser()
  const name = (user && (user.full_name || user.email)) ? (user.full_name || user.email.split('@')[0]) : 'Learner'
  const streak = await getStreak()
  const pred = await predictScores()
  const q = quoteOfTheDay()
  const progress = await DB.select('user_progress')
  const activeDays = [...new Set(progress.map(p => (p.created_at || '').slice(0, 10)).filter(Boolean))]
  // weakest skill recommendation from error journal
  const errors = await DB.select('error_journal')
  const byCat = {}
  errors.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + 1 })
  const weakest = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]
  // weekly goal
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekCount = progress.filter(p => new Date(p.created_at) >= weekStart).length
  const weekGoal = 7
  const last = localStorage.getItem('last_module')

  view.innerHTML = section(`${greeting()}, ${esc(name)}! \ud83d\udc4b`, 'Ready for today\u2019s practice?') +
    `<div class="dash-top">
      <div class="card streak-card">
        <div class="flame">\ud83d\udd25</div>
        <div><div class="big-num">${streak.current_streak}</div><div class="muted">day streak \u00b7 best ${streak.longest_streak}</div></div>
      </div>
      <div class="card predictor">
        <h3>\ud83c\udfaf TOEFL Score Predictor</h3>
        <div class="pred-row"><div><div class="big-num">${pred.ibt}</div><div class="muted">iBT (0\u2013120)</div></div>
        <div><div class="big-num">${pred.pbt}</div><div class="muted">PBT (310\u2013677)</div></div>
        <div><span class="pill ${pred.confidence==='High'?'green':pred.confidence==='Medium'?'gold':''}">${pred.confidence} confidence</span></div></div>
      </div>
    </div>` +
    card(`<h3>\ud83d\udcca Skill Progress</h3><div class="rings">${SECTIONS.map(s => ring(s, pred.sk[s] || 0)).join('')}</div>`) +
    `<div class="two-col">
      ${card(`<h3>\ud83d\udcc5 Study Calendar</h3>${calendar(activeDays)}`)}
      <div>
        ${card(`<h3>\u26a1 Today\u2019s Challenge</h3><p class="muted">5 quick mixed questions to keep your streak alive.</p><button class="btn" id="todayChallenge">Start challenge</button>`)}
        ${card(`<h3>\ud83c\udfaf Weekly Goal</h3><div class="progbar"><span style="width:${Math.min(100, weekCount / weekGoal * 100)}%"></span></div><p class="muted">${weekCount} / ${weekGoal} sessions this week</p>`)}
        ${last ? card(`<h3>\u25b6\ufe0f Continue</h3><p class="muted">Pick up where you left off.</p><button class="btn ghost" id="continueBtn">Resume ${esc(last)}</button>`) : ''}
      </div>
    </div>` +
    `<div class="two-col">
      ${card(`<h3>\ud83d\udca1 Recommended Today</h3>${weakest ? `<p>You\u2019ve been missing questions in <b>${esc(weakest[0])}</b> (${weakest[1]}\u00d7). Focus there today.</p><button class="btn ghost" data-go="daily">Practice now</button>` : '<p class="muted">Complete a few questions and personalized recommendations will appear here.</p>'}`)}
      ${card(`<blockquote class="quote">\u201c${esc(q.t)}\u201d<footer>\u2014 ${esc(q.a)}</footer></blockquote><button class="btn ghost sm" id="sayQuote">\ud83d\udd0a Listen</button>`, 'quote-card')}
    </div>`

  $('#todayChallenge', view)?.addEventListener('click', () => Router.go('daily'))
  $('#continueBtn', view)?.addEventListener('click', () => Router.go(last))
  $('#sayQuote', view)?.addEventListener('click', () => say(q.t + '. ' + q.a, 'female', 0.95))
  $$('[data-go]', view).forEach(b => b.addEventListener('click', () => Router.go(b.dataset.go)))
}

export const meta = { label: 'Dashboard', icon: '\ud83c\udfe0' }
