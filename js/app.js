// js/app.js — application bootstrap for app.html
import { Auth } from './supabase.js'
import { Router } from './router.js'
import { getStreak, t } from './util.js'

// Feature modules
import * as dashboard from './dashboard.js'
import * as toeflIbt from './toefl-ibt.js'
import * as toeflPbt from './toefl-pbt.js'
import * as dailyPractice from './daily-practice.js'
import * as vocabulary from './vocabulary.js'
import * as vocabByTopic from './vocab-by-topic.js'
import * as grammar from './grammar.js'
import * as conversation from './conversation.js'
import * as thinkInEnglish from './think-in-english.js'
import * as speakingLab from './speaking-lab.js'
import * as listeningTrainer from './listening-trainer.js'
import * as writingLab from './writing-lab.js'
import * as integratedPlanner from './integrated-planner.js'
import * as pronunciation from './pronunciation.js'
import * as dailyJournal from './daily-journal.js'
import * as errorJournal from './error-journal.js'
import * as studyPlan from './study-plan.js'
import * as analytics from './analytics.js'

// route order = sidebar order, grouped by section
const GROUPS = [
  { title: 'Overview', items: [['dashboard', dashboard]] },
  { title: 'TOEFL Tests', items: [['toefl-ibt', toeflIbt], ['toefl-pbt', toeflPbt], ['daily-practice', dailyPractice]] },
  { title: 'Skills', items: [['speaking-lab', speakingLab], ['listening-trainer', listeningTrainer], ['writing-lab', writingLab], ['integrated-planner', integratedPlanner], ['pronunciation', pronunciation]] },
  { title: 'Vocabulary & Grammar', items: [['vocabulary', vocabulary], ['vocab-by-topic', vocabByTopic], ['grammar', grammar]] },
  { title: 'Fluency ⭐', items: [['conversation', conversation], ['think-in-english', thinkInEnglish], ['daily-journal', dailyJournal]] },
  { title: 'Tracking', items: [['error-journal', errorJournal], ['study-plan', studyPlan], ['analytics', analytics]] },
]

function applySettings() {
  const dark = localStorage.getItem('dark_mode') === '1'
  document.documentElement.classList.toggle('dark', dark)
  const font = localStorage.getItem('font_size') || 'md'
  document.documentElement.dataset.font = font
  document.documentElement.classList.toggle('high-contrast', localStorage.getItem('high_contrast') === '1')
  document.documentElement.classList.toggle('english-only', localStorage.getItem('english_only_mode') === '1')
  const tg = document.getElementById('themeToggle'); if (tg) tg.textContent = dark ? '☀️' : '🌙'
  const eo = document.getElementById('eoToggle'); if (eo) eo.classList.toggle('on', localStorage.getItem('english_only_mode') === '1')
}

function buildNav() {
  const nav = document.getElementById('sbnav')
  nav.innerHTML = GROUPS.map(g => `
    <div class="nav-group"><div class="nav-group-title">${g.title}</div>
    ${g.items.map(([route, mod]) => {
      const m = mod.meta || { label: route, icon: '•' }
      return `<a class="nav-item" data-route="${route}" href="#${route}"><span class="nav-ico">${m.icon || '•'}</span><span class="nav-label">${m.label || route}</span></a>`
    }).join('')}</div>`).join('')
}

async function boot() {
  const user = await Auth.requireAuth()
  if (!user) return // redirected

  // register modules
  GROUPS.forEach(g => g.items.forEach(([route, mod]) => Router.register(route, mod.render, mod.meta)))
  buildNav()
  applySettings()

  // header user info
  const name = user.full_name || user.user_metadata?.full_name || (user.email || 'Guest').split('@')[0]
  const un = document.getElementById('userName'); if (un) un.textContent = name
  const ua = document.getElementById('userAvatar'); if (ua) ua.textContent = (name[0] || 'U').toUpperCase()
  const st = document.getElementById('streakCount'); if (st) { const sd = await getStreak(); st.textContent = sd.current_streak || 0 }

  // controls
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    localStorage.setItem('dark_mode', localStorage.getItem('dark_mode') === '1' ? '0' : '1'); applySettings()
  })
  document.getElementById('eoToggle')?.addEventListener('click', () => {
    localStorage.setItem('english_only_mode', localStorage.getItem('english_only_mode') === '1' ? '0' : '1'); applySettings()
  })
  const fontSel = document.getElementById('fontSel')
  if (fontSel) { fontSel.value = localStorage.getItem('font_size') || 'md'; fontSel.addEventListener('change', () => { localStorage.setItem('font_size', fontSel.value); applySettings() }) }
  document.getElementById('logoutBtn')?.addEventListener('click', async () => { await Auth.signOut(); location.href = 'index.html' })

  // mobile sidebar
  document.getElementById('menuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.add('mobile-open')
    document.getElementById('overlay')?.classList.add('show')
  })
  document.getElementById('overlay')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('mobile-open')
    document.getElementById('overlay')?.classList.remove('show')
  })

  Router.start('dashboard')
}

boot().catch(function (err) {
  console.error('boot() failed:', err)
  var v = document.getElementById('view')
  if (v) v.innerHTML = '<div style="padding:24px;color:#900"><h3>⚠️ Gagal memuat dashboard</h3><pre style="white-space:pre-wrap;background:#fff;border:1px solid #eee;padding:10px;border-radius:8px;font-size:12px">' + String((err && (err.stack || err.message)) || err).replace(/</g, '&lt;') + '</pre></div>'
})
