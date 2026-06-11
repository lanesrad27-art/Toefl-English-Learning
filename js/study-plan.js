// js/study-plan.js — Study Plan Generator
import { $, $$, esc, section, card, toast, DB, predictScores, SECTIONS } from './util.js'

export async function render(view) {
  view.innerHTML = section('🗓️ Study Plan Generator', 'Build a personalized day-by-day plan toward your target score and exam date.') + '<div id="spBody"><div class="card"><p class="muted">Loading…</p></div></div>'
  const body = $('#spBody', view)
  const saved = (await DB.select('study_plans'))[0]
  form(body, saved)
}

function form(body, saved) {
  const today = new Date().toISOString().slice(0, 10)
  const def = saved && saved.plan_data ? JSON.parse(typeof saved.plan_data === 'string' ? saved.plan_data : JSON.stringify(saved.plan_data)) : null
  body.innerHTML = card(`<h3>Your goals</h3>
    <div class="form-grid">
      <label>Target score (0–120)<input type="number" id="spTarget" min="0" max="120" value="${def?.target || 100}"></label>
      <label>Exam date<input type="date" id="spDate" min="${today}" value="${def?.examDate || ''}"></label>
      <label>Hours per day<input type="number" id="spHours" min="0.5" max="12" step="0.5" value="${def?.hours || 2}"></label>
      <label>Current level<select id="spLevel"><option ${def?.level === 'Beginner' ? 'selected' : ''}>Beginner</option><option ${!def || def?.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option><option ${def?.level === 'Advanced' ? 'selected' : ''}>Advanced</option></select></label>
    </div>
    <button class="btn" id="spGen">⚙️ Generate plan</button>`) + '<div id="spPlan"></div>'
  $('#spGen', body).onclick = async () => {
    const cfg = { target: +$('#spTarget', body).value, examDate: $('#spDate', body).value, hours: +$('#spHours', body).value, level: $('#spLevel', body).value }
    if (!cfg.examDate) { toast('Please choose an exam date.'); return }
    const plan = await generate(cfg)
    await DB.upsert('study_plans', { plan_data: JSON.stringify({ ...cfg, plan }), target_date: cfg.examDate, daily_hours: cfg.hours })
    renderPlan($('#spPlan', body), cfg, plan)
    toast('Plan saved ✅')
  }
  if (def?.plan) renderPlan($('#spPlan', body), def, def.plan)
}

async function generate(cfg) {
  const days = Math.max(1, Math.ceil((new Date(cfg.examDate) - new Date()) / 86400000))
  let pred = { sk: {} }; try { pred = predictScores() } catch {}
  // Weakest skills first
  const weak = SECTIONS.map(s => ({ s, v: pred.sk?.[s] ?? 50 })).sort((a, b) => a.v - b.v).map(x => x.s)
  const focusByPhase = days > 60 ? ['Foundation', 'Skill-building', 'Practice tests', 'Final review']
    : days > 21 ? ['Skill-building', 'Practice tests', 'Final review'] : ['Intensive practice', 'Final review']
  const phaseLen = Math.ceil(days / focusByPhase.length)
  const activities = {
    Reading: ['Reading passage + questions', 'Skimming & scanning drills', 'Vocabulary in context'],
    Listening: ['Lecture + notes (Cornell)', 'Conversation listening', 'Dictation practice'],
    Speaking: ['Independent task (45s)', 'Integrated task', 'Shadowing + pronunciation'],
    Writing: ['Independent essay', 'Integrated essay', 'Transitions & grammar review'],
    Structure: ['Structure questions', 'Written Expression error-spotting'],
    Vocabulary: ['20 SRS flashcards', 'Topic vocabulary set'],
  }
  const plan = []
  for (let d = 0; d < Math.min(days, 90); d++) {
    const phase = focusByPhase[Math.min(focusByPhase.length - 1, Math.floor(d / phaseLen))]
    const primary = weak[d % weak.length], secondary = weak[(d + 1) % weak.length]
    const tasks = [
      `${primary}: ${pick(activities[primary], d)}`,
      `${secondary}: ${pick(activities[secondary], d + 1)}`,
      'Vocabulary: ' + pick(activities.Vocabulary, d),
      'Review error journal (10 min)',
    ]
    if (phase.includes('test') && d % 7 === 0) tasks.push('📝 Full practice test')
    plan.push({ day: d + 1, phase, date: new Date(Date.now() + d * 86400000).toISOString().slice(0, 10), tasks })
  }
  return plan
}
function pick(arr, i) { return arr[i % arr.length] }

function renderPlan(host, cfg, plan) {
  const phases = [...new Set(plan.map(p => p.phase))]
  host.innerHTML = card(`<h3>🎯 Plan summary</h3>
    <div class="grid g4">
      <div class="tile"><div class="tile-ico">🎯</div><b>${cfg.target}</b><span>Target</span></div>
      <div class="tile"><div class="tile-ico">📅</div><b>${plan.length}</b><span>Days planned</span></div>
      <div class="tile"><div class="tile-ico">⏱️</div><b>${cfg.hours}h</b><span>Per day</span></div>
      <div class="tile"><div class="tile-ico">📚</div><b>${(cfg.hours * plan.length).toFixed(0)}h</b><span>Total</span></div>
    </div>
    <p class="muted">Phases: ${phases.map(p => `<span class="pill navy">${esc(p)}</span>`).join(' ')}</p>`) +
    card(`<h3>Daily schedule</h3><div class="plan-list">${plan.map(d => `
      <details class="plan-day"><summary><b>Day ${d.day}</b> · <span class="muted">${esc(d.date)}</span> · <span class="pill gold">${esc(d.phase)}</span></summary>
      <ul>${d.tasks.map(t => `<li>${esc(t)}</li>`).join('')}</ul></details>`).join('')}</div>`)
}

export const meta = { label: 'Study Plan', icon: '🗓️' }
