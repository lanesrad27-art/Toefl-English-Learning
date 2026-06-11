// js/supabase.js
// Config + Auth + Data layer.
// Works with Supabase when configured, otherwise falls back to a local
// (localStorage) guest mode so the app runs immediately after drag-drop.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 1) Paste your Supabase project credentials here -----------------
const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'
// -----------------------------------------------------------------

export const IS_CONFIGURED =
  /^https:\/\/.+\.supabase\.co/.test(SUPABASE_URL) &&
  SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20 &&
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'

export const supabase = IS_CONFIGURED
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// ================= AUTH =================
const LS_GUEST = 'toefl_guest_user'

export const Auth = {
  configured: IS_CONFIGURED,

  async signUp({ email, password, full_name, target_score, current_level }) {
    if (IS_CONFIGURED) {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name, target_score, current_level } },
      })
      if (error) throw error
      if (data.user) {
        await supabase.from('users_profile').upsert({
          id: data.user.id, full_name, target_score, current_level,
        })
      }
      return data.user
    }
    // guest fallback
    const user = { id: 'guest', email, full_name, target_score, current_level }
    localStorage.setItem(LS_GUEST, JSON.stringify(user))
    return user
  },

  async signIn({ email, password }) {
    if (IS_CONFIGURED) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data.user
    }
    const user = { id: 'guest', email, full_name: email.split('@')[0] }
    localStorage.setItem(LS_GUEST, JSON.stringify(user))
    return user
  },

  async signInWithGoogle() {
    if (!IS_CONFIGURED) throw new Error('Hubungkan Supabase dulu untuk login Google.')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: location.origin + '/app.html' },
    })
    if (error) throw error
  },

  async resetPassword(email) {
    if (!IS_CONFIGURED) throw new Error('Reset password butuh Supabase aktif.')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: location.origin + '/index.html',
    })
    if (error) throw error
  },

  async signOut() {
    if (IS_CONFIGURED) await supabase.auth.signOut()
    localStorage.removeItem(LS_GUEST)
  },

  async getUser() {
    if (IS_CONFIGURED) {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return null
      const { data: prof } = await supabase
        .from('users_profile').select('*').eq('id', data.user.id).single()
      return { ...data.user, ...(prof || {}) }
    }
    const raw = localStorage.getItem(LS_GUEST)
    return raw ? JSON.parse(raw) : null
  },

  // Redirect to landing page if not authenticated.
  async requireAuth() {
    const u = await this.getUser()
    if (!u) { location.href = 'index.html'; return null }
    return u
  },
}

// ================= DB LAYER =================
// Uniform helpers that use Supabase tables when configured, else localStorage.
// Each "table" in guest mode is an array under key  toefl_db_<table>.
function lsKey(table) { return 'toefl_db_' + table }
function lsRead(table) { try { return JSON.parse(localStorage.getItem(lsKey(table)) || '[]') } catch { return [] } }
function lsWrite(table, rows) { localStorage.setItem(lsKey(table), JSON.stringify(rows)) }
function uid() { return 'r-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }

export const DB = {
  async userId() {
    const u = await Auth.getUser()
    return u ? u.id : 'guest'
  },

  // Insert a row.
  async insert(table, row) {
    const user_id = await this.userId()
    const full = { id: uid(), user_id, created_at: new Date().toISOString(), ...row }
    if (IS_CONFIGURED) {
      const { data, error } = await supabase.from(table).insert(full).select().single()
      if (error) { console.warn('insert', table, error.message); return full }
      return data
    }
    const rows = lsRead(table); rows.push(full); lsWrite(table, rows); return full
  },

  // Select rows for the current user (optionally filtered by eq map).
  async select(table, eq = {}) {
    const user_id = await this.userId()
    if (IS_CONFIGURED) {
      let q = supabase.from(table).select('*').eq('user_id', user_id)
      for (const [k, v] of Object.entries(eq)) q = q.eq(k, v)
      const { data, error } = await q
      if (error) { console.warn('select', table, error.message); return [] }
      return data || []
    }
    return lsRead(table).filter(r =>
      r.user_id === user_id && Object.entries(eq).every(([k, v]) => r[k] === v))
  },

  // Upsert a single keyed row (used for streak, study_plan).
  async upsert(table, row, key = 'user_id') {
    const user_id = await this.userId()
    const full = { user_id, ...row }
    if (IS_CONFIGURED) {
      const { data, error } = await supabase.from(table).upsert(full).select().single()
      if (error) { console.warn('upsert', table, error.message); return full }
      return data
    }
    const rows = lsRead(table)
    const i = rows.findIndex(r => r[key] === full[key])
    if (i >= 0) rows[i] = { ...rows[i], ...full }; else rows.push({ id: uid(), ...full })
    lsWrite(table, rows); return full
  },

  async update(table, id, patch) {
    if (IS_CONFIGURED) {
      const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single()
      if (error) { console.warn('update', table, error.message) }
      return data
    }
    const rows = lsRead(table); const i = rows.findIndex(r => r.id === id)
    if (i >= 0) { rows[i] = { ...rows[i], ...patch }; lsWrite(table, rows); return rows[i] }
  },

  async remove(table, id) {
    if (IS_CONFIGURED) { await supabase.from(table).delete().eq('id', id); return }
    lsWrite(table, lsRead(table).filter(r => r.id !== id))
  },
}
