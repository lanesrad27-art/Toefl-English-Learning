// js/vocab-by-topic.js
import { $, $$, el, esc, section, card, shuffle, say, renderQuiz } from './util.js'
import { TOPIC_VOCAB, TOPIC_READINGS } from './data/vocabulary.js'

export async function render(view) {
  const topics = Object.keys(TOPIC_VOCAB)
  view.innerHTML = section('\ud83d\uddc2\ufe0f Vocabulary by Topic', '10 academic themes with definitions, IPA, context reading, and a mini quiz.') +
    card(`<label>Topic <select id="tvSel">${topics.map(t => `<option>${esc(t)}</option>`).join('')}</select></label>`) +
    `<div id="tvArea"></div>`
  const area = $('#tvArea', view)
  const renderTopic = (name) => {
    const words = TOPIC_VOCAB[name]
    const reading = TOPIC_READINGS[name]
    area.innerHTML =
      card(`<h3>${esc(name)} \u2014 ${words.length} words</h3><div class="word-list">` +
        words.map(w => `<div class="word-row"><div><b>${esc(w.word)}</b> <span class="muted">${esc(w.ipa)}</span><br>${esc(w.def)}<br><i class="muted">${esc(w.example)}</i></div><button class="btn ghost sm say" data-w="${esc(w.word)}">\ud83d\udd0a</button></div>`).join('') + `</div>`) +
      (reading ? card(`<h3>\ud83d\udcd6 Context Reading</h3><p>${esc(reading)}</p><button class="btn ghost sm" id="readSay">\ud83d\udd0a Read aloud</button>`) : '') +
      card(`<h3>\ud83d\udcdd Mini Quiz</h3><button class="btn" id="tvQuizStart">Start 10-question quiz</button><div id="tvQuiz"></div>`)
    $$('.say', area).forEach(b => b.addEventListener('click', () => say(b.dataset.w, 'female', 0.9)))
    $('#readSay', area)?.addEventListener('click', () => say(reading, 'female', 0.92))
    $('#tvQuizStart', area).addEventListener('click', () => {
      const items = shuffle(words).slice(0, Math.min(10, words.length)).map(w => {
        const opts = shuffle([w.def, ...shuffle(words.filter(x => x.word !== w.word)).slice(0, 3).map(x => x.def)])
        return { q: `Meaning of "${w.word}"?`, opts, a: opts.indexOf(w.def), expl: `${w.word}: ${w.def}`, example: w.example, time: 25, type: name, category: 'Vocabulary' }
      })
      $('#tvQuiz', area).innerHTML = '<div class="card" id="tvQz"></div>'
      renderQuiz(items, { container: $('#tvQz', area), category: 'Vocabulary', section: 'vocabulary' })
    })
  }
  $('#tvSel', view).addEventListener('change', e => renderTopic(e.target.value))
  renderTopic(topics[0])
}

export const meta = { label: 'Vocabulary by Topic', icon: '\ud83d\uddc2\ufe0f' }
