// js/util.js — shared helpers used by every feature module.
import { DB, Auth } from './supabase.js'
import { tts } from './tts.js'

// ---------- DOM ----------
export const $ = (sel, root = document) => root.querySelector(sel)
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel))
export function el(tag, attrs = {}, html = '') {
  const n = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v
    else if (k === 'style') n.style.cssText = v
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v)
    else n.setAttribute(k, v)
  }
  if (html) n.innerHTML = html
  return n
}
export const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
export const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }
export const rnd = a => a[Math.floor(Math.random() * a.length)]
export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

// ---------- i18n (English Only Mode) ----------
export function englishOnly() { return localStorage.getItem('english_only_mode') === '1' }
const I18N = {
  correct: ['Benar!', 'Correct!'], wrong: ['Salah', 'Incorrect'],
  why_correct: ['Mengapa benar', 'Why this is correct'], why_wrong: ['Mengapa pilihan lain salah', 'Why the others are wrong'],
  tip: ['Tips', 'Tip'], rule: ['Aturan', 'Rule'], target_time: ['Target waktu', 'Target time'],
  submit: ['Kirim', 'Submit'], next: ['Lanjut', 'Next'], finish: ['Selesai', 'Finish'], score: ['Skor', 'Score'],
}
export function t(key) { const p = I18N[key]; return p ? p[englishOnly() ? 1 : 0] : key }

// ---------- toast & confetti ----------
export function toast(msg, type = '') {
  let host = $('#toast'); if (!host) { host = el('div', { id: 'toast' }); document.body.appendChild(host) }
  const node = el('div', { class: 'toast-item ' + type }, esc(msg))
  host.appendChild(node)
  requestAnimationFrame(() => node.classList.add('show'))
  setTimeout(() => { node.classList.remove('show'); setTimeout(() => node.remove(), 300) }, 2600)
}
export function confetti() {
  const host = el('div', { class: 'confetti' }); document.body.appendChild(host)
  const colors = ['#1a237e', '#4caf50', '#ffc107', '#f44336', '#283593']
  for (let i = 0; i < 90; i++) {
    const p = el('i'); p.style.left = Math.random() * 100 + 'vw'
    p.style.background = rnd(colors); p.style.animationDelay = (Math.random() * 0.5) + 's'
    p.style.transform = `rotate(${Math.random() * 360}deg)`; host.appendChild(p)
  }
  setTimeout(() => host.remove(), 2600)
}

// ---------- speak helper ----------
export function say(text, gender = 'female', rate = 0.92) { tts.speak(text, gender, rate) }

// ---------- progress / streak / scores ----------
export const SECTIONS = ['Reading', 'Listening', 'Speaking', 'Writing', 'Structure', 'Vocabulary']

export async function recordProgress(section, score, total, timeSpent = 0) {
  await DB.insert('user_progress', { section: section.toLowerCase(), score, total_questions: total, time_spent: timeSpent })
  await bumpStreak()
}

export async function bumpStreak() {
  const today = new Date().toISOString().slice(0, 10)
  const rows = await DB.select('user_streak')
  let s = rows[0] || { current_streak: 0, longest_streak: 0, last_activity_date: null }
  if (s.last_activity_date === today) return s
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  s.current_streak = (s.last_activity_date === y) ? (s.current_streak + 1) : 1
  s.longest_streak = Math.max(s.longest_streak || 0, s.current_streak)
  s.last_activity_date = today
  await DB.upsert('user_streak', { current_streak: s.current_streak, longest_streak: s.longest_streak, last_activity_date: today })
  return s
}

export async function getStreak() {
  const rows = await DB.select('user_streak')
  return rows[0] || { current_streak: 0, longest_streak: 0, last_activity_date: null }
}

export async function logError(item) {
  await DB.insert('error_journal', {
    question_id: item.question_id || '', question_text: item.question_text || '',
    user_answer: item.user_answer || '', correct_answer: item.correct_answer || '',
    explanation: item.explanation || '', category: item.category || 'General',
    reviewed: false, correct_count: 0,
  })
}

// Skill mastery 0..100 derived from recent progress rows.
export async function skillScores() {
  const rows = await DB.select('user_progress')
  const out = {}; SECTIONS.forEach(s => out[s] = { pct: 0, n: 0 })
  for (const r of rows) {
    const key = SECTIONS.find(s => s.toLowerCase() === (r.section || '').toLowerCase())
    if (!key) continue
    const pct = r.total_questions ? (r.score / r.total_questions) * 100 : 0
    out[key].pct += pct; out[key].n += 1
  }
  SECTIONS.forEach(s => out[s] = out[s].n ? Math.round(out[s].pct / out[s].n) : 0)
  return out
}

// Score predictor: maps average skill mastery to iBT (0..120) & PBT (310..677).
export async function predictScores() {
  const sk = await skillScores()
  const core = ['Reading', 'Listening', 'Speaking', 'Writing']
  const vals = core.map(s => sk[s] || 0)
  const avg = vals.reduce((a, b) => a + b, 0) / core.length
  const ibtPer = {}; core.forEach(s => ibtPer[s] = Math.round((sk[s] || 0) / 100 * 30))
  const ibt = core.reduce((a, s) => a + ibtPer[s], 0)
  const pbt = Math.round(310 + (avg / 100) * (677 - 310))
  const dataPoints = (await DB.select('user_progress')).length
  const confidence = dataPoints >= 10 ? 'High' : dataPoints >= 4 ? 'Medium' : 'Low'
  return { ibt, ibtPer, pbt, avg: Math.round(avg), confidence, sk }
}

// ---------- Quiz renderer ----------
// items: [{ q, opts:[...], a:index, expl, wrong:{i:reason}, tip, rule, example, time, category, id }]
// opts: { container, onDone(result), category, perQuestionTimer }
export function renderQuiz(items, opts = {}) {
  const box = opts.container
  let idx = 0, correct = 0, started = Date.now()
  const answers = []
  function render() {
    if (idx >= items.length) return finish()
    const it = items[idx]
    box.innerHTML = ''
    const head = el('div', { class: 'quiz-head' }, `<span class="pill navy">${idx + 1} / ${items.length}</span>` +
      (it.category ? `<span class="pill gold">${esc(it.category)}</span>` : '') +
      (it.time ? `<span class="pill">\u23f1\ufe0f ${it.time}s</span>` : ''))
    box.appendChild(head)
    box.appendChild(el('div', { class: 'qtext' }, esc(it.q)))
    const optWrap = el('div', { class: 'opts' })
    it.opts.forEach((o, i) => {
      const b = el('button', { class: 'opt', type: 'button' }, `<b>${LETTERS[i]}</b> ${esc(o)}`)
      b.onclick = () => choose(i, optWrap, it)
      optWrap.appendChild(b)
    })
    box.appendChild(optWrap)
    const expl = el('div', { class: 'expl', id: 'expl' }); box.appendChild(expl)
  }
  function choose(i, wrap, it) {
    if (wrap.dataset.locked) return
    wrap.dataset.locked = '1'
    const btns = $$('.opt', wrap)
    btns.forEach((b, bi) => {
      b.classList.add('lock')
      if (bi === it.a) b.classList.add('correct')
      if (bi === i && i !== it.a) b.classList.add('wrong')
    })
    const ok = i === it.a
    if (ok) correct++
    answers.push({ item: it, chosen: i, ok })
    if (ok) { try { confetti() } catch (e) {} } else { box.classList.add('shake'); setTimeout(() => box.classList.remove('shake'), 500) }
    const expl = $('#expl', box)
    let wrongHtml = ''
    if (it.wrong) for (const [wi, reason] of Object.entries(it.wrong)) wrongHtml += `<div class="ex-row no">\u274c <b>${LETTERS[wi]}</b> \u2014 ${esc(reason)}</div>`
    expl.innerHTML =
      `<div class="ex-row ${ok ? 'ok' : 'no'}">${ok ? '\u2705 ' + t('correct') : '\u274c ' + t('wrong') + '. ' + t('correct').replace('!', '') + ': ' + LETTERS[it.a]}</div>` +
      (it.expl ? `<div class="ex-row info">\ud83d\udcd6 ${esc(it.expl)}</div>` : '') +
      wrongHtml +
      (it.rule ? `<div class="ex-row gr">\ud83d\udcda ${esc(it.rule)}</div>` : '') +
      (it.example ? `<div class="ex-row">\u270d\ufe0f <i>${esc(it.example)}</i></div>` : '') +
      (it.tip ? `<div class="ex-row tip">\ud83d\udca1 ${esc(it.tip)}</div>` : '') +
      (it.time ? `<div class="ex-row tm">\u23f1\ufe0f ${t('target_time')}: ${it.time}s</div>` : '')
    expl.classList.add('show')
    if (!ok && opts.toErrors !== false) {
      logError({ question_id: it.id || '', question_text: it.q, user_answer: it.opts[i], correct_answer: it.opts[it.a], explanation: it.expl, category: it.category || opts.category || 'General' })
    }
    const nextBtn = el('button', { class: 'btn', type: 'button' }, idx + 1 >= items.length ? t('finish') : t('next'))
    nextBtn.onclick = () => { idx++; render() }
    expl.appendChild(nextBtn)
  }
  async function finish() {
    const total = items.length
    const pct = Math.round((correct / total) * 100)
    const secs = Math.round((Date.now() - started) / 1000)
    box.classList.remove('shake')
    box.innerHTML = `<div class="result-card"><h2>${pct === 100 ? '\ud83c\udfc6' : pct >= 60 ? '\ud83c\udf89' : '\ud83d\udcaa'} ${t('score')}: ${correct}/${total} (${pct}%)</h2>` +
      `<p class="muted">${Math.floor(secs / 60)}m ${secs % 60}s</p></div>`
    // type breakdown
    const byType = {}
    answers.forEach(a => { const ty = a.item.type || a.item.category || 'General'; byType[ty] = byType[ty] || { ok: 0, n: 0 }; byType[ty].n++; if (a.ok) byType[ty].ok++ })
    const rows = Object.entries(byType).map(([ty, v]) => `<div class="list-row"><span>${esc(ty)}</span><b>${v.ok}/${v.n}</b></div>`).join('')
    box.firstChild.insertAdjacentHTML('beforeend', `<div class="breakdown">${rows}</div>`)
    if (pct === 100) { try { confetti() } catch (e) {} }
    if (opts.category || opts.section) { try { await recordProgress(opts.section || opts.category, correct, total, secs) } catch (e) {} }
    if (opts.onDone) opts.onDone({ correct, total, pct, secs })
  }
  render()
}

// Page-section helper.
export function section(title, subtitle = '') {
  return `<div class="page-head"><h1>${esc(title)}</h1>${subtitle ? `<p class="muted">${esc(subtitle)}</p>` : ''}</div>`
}
export function card(inner, cls = '') { return `<div class="card ${cls}">${inner}</div>` }

export { DB, Auth, tts }
