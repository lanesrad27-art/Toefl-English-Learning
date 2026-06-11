// js/router.js
// Minimal hash-based SPA router for app.html.
// Modules register a render function; the router swaps the #view container,
// updates the active sidebar item, breadcrumb, and remembers last module.

const routes = {}
let currentCleanup = null

export const Router = {
  register(name, renderFn, meta = {}) {
    routes[name] = { render: renderFn, meta }
  },

  list() { return Object.entries(routes).map(([k, v]) => ({ name: k, ...v.meta })) },

  async go(name) {
    if (!routes[name]) name = 'dashboard'
    location.hash = '#' + name
  },

  async _render(name) {
    const view = document.getElementById('view')
    if (!routes[name]) name = routes['dashboard'] ? 'dashboard' : Object.keys(routes)[0]
    const route = routes[name]
    if (!route) return
    // cleanup previous (e.g. stop timers/audio)
    if (typeof currentCleanup === 'function') { try { currentCleanup() } catch (e) {} }
    currentCleanup = null
    localStorage.setItem('last_module', name)
    // breadcrumb + active nav
    const crumb = document.getElementById('crumb')
    if (crumb) crumb.textContent = route.meta.label || name
    document.querySelectorAll('.nav-item').forEach(el =>
      el.classList.toggle('active', el.dataset.route === name))
    // render (show skeleton first)
    view.innerHTML = '<div class="skeleton-page"><div class="sk-line"></div><div class="sk-line"></div><div class="sk-card"></div></div>'
    view.scrollTop = 0
    try {
      const cleanup = await route.render(view)
      if (typeof cleanup === 'function') currentCleanup = cleanup
    } catch (err) {
      console.error(err)
      view.innerHTML = '<div class="card"><h3>\u26a0\ufe0f Terjadi kesalahan saat memuat modul</h3><pre style="white-space:pre-wrap">' + (err && err.message) + '</pre></div>'
    }
    // close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('mobile-open')
    document.getElementById('overlay')?.classList.remove('show')
  },

  start(defaultRoute = 'dashboard') {
    window.addEventListener('hashchange', () => this._render(location.hash.slice(1)))
    const initial = location.hash.slice(1) || localStorage.getItem('last_module') || defaultRoute
    this._render(initial)
  },
}
