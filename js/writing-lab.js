// js/writing-lab.js — Writing Lab: templates, sample essays, outline builder, transitions, live feedback
import { $, $$, esc, section, card, rnd } from './util.js'
import { WRITING_INDEPENDENT, WRITING_INTEGRATED, TRANSITIONS } from './data/writing-prompts.js'

export async function render(view) {
  view.innerHTML = section('✍️ Writing Lab', 'Templates, annotated samples, an outline builder, transition bank, and live feedback.') +
    `<div class="seg" id="wlTab">
      <button data-t="editor" class="active">Writing Editor</button>
      <button data-t="templates">Templates</button>
      <button data-t="samples">Annotated Samples</button>
      <button data-t="prompts">Prompt Bank</button>
    </div><div id="wlBody"></div>`
  const body = $('#wlBody', view)
  const tabs = { editor, templates, samples, prompts }
  $$('#wlTab button', view).forEach(b => b.onclick = () => { $$('#wlTab button', view).forEach(x => x.classList.remove('active')); b.classList.add('active'); tabs[b.dataset.t](body) })
  editor(body)
}

function editor(body) {
  const prompt = rnd(WRITING_INDEPENDENT)
  body.innerHTML = card(`<h3>Independent Essay</h3><p class="prompt"><b>${esc(prompt)}</b></p>
      <button class="btn ghost sm" id="wlNewPrompt">🔄 New prompt</button>`) +
    `<div class="twocol">
      <div>${card(`<label>Transition bank — click to insert</label><div class="trans-bank" id="transBank">${Object.entries(TRANSITIONS).map(([cat, ws]) => `<div class="trans-cat"><b>${esc(cat)}</b>${ws.map(w => `<button class="chip" data-w="${esc(w)}">${esc(w)}</button>`).join('')}</div>`).join('')}</div>`)}</div>
      <div>${card(`<textarea class="essay" id="wlEssay" placeholder="Write your essay here..."></textarea>
        <div class="toolbar"><span id="wlStats">0 words · 0 sentences</span></div>
        <div id="wlFeedback"></div>`)}</div>
    </div>`
  const ta = $('#wlEssay', body)
  const saved = localStorage.getItem('draft_wl_essay'); if (saved) ta.value = saved
  const update = () => {
    const txt = ta.value
    const words = txt.trim().split(/\s+/).filter(Boolean)
    const sentences = txt.split(/[.!?]+/).filter(s => s.trim())
    $('#wlStats', body).textContent = `${words.length} words · ${sentences.length} sentences`
    const freq = {}; (txt.toLowerCase().match(/\b[a-z']+\b/g) || []).forEach(w => { if (w.length > 4) freq[w] = (freq[w] || 0) + 1 })
    const repeated = Object.entries(freq).filter(([, n]) => n >= 4).map(([w]) => w)
    const longSent = sentences.filter(s => s.trim().split(/\s+/).length > 35).length
    $('#wlFeedback', body).innerHTML =
      (words.length >= 300 ? '<div class="ex-row ok">✅ Length goal reached (300+).</div>' : `<div class="ex-row info">✍️ ${300 - words.length} more words to reach 300.</div>`) +
      (longSent ? `<div class="ex-row no">⚠️ ${longSent} overly long sentence(s).</div>` : '') +
      (repeated.length ? `<div class="ex-row tip">🔁 Overused: ${esc(repeated.join(', '))}</div>` : '')
    localStorage.setItem('draft_wl_essay', txt)
  }
  ta.addEventListener('input', update); update()
  $('#wlNewPrompt', body).onclick = () => editor(body)
  $$('#transBank .chip', body).forEach(c => c.onclick = () => {
    const w = c.dataset.w
    const start = ta.selectionStart
    ta.value = ta.value.slice(0, start) + w + ' ' + ta.value.slice(start)
    ta.focus(); update()
  })
}

function templates(body) {
  const T = [
    { name: 'Independent (Agree/Disagree)', body: 'Intro: hook + paraphrase prompt + clear thesis (your position).\nBody 1: First reason + explanation + specific example.\nBody 2: Second reason + explanation + specific example.\nBody 3 (optional): Concession + rebuttal.\nConclusion: restate thesis + summarize reasons.' },
    { name: 'Integrated', body: 'Intro: state the topic + that the lecture (casts doubt on / supports) the reading.\nBody 1: Lecture point 1 vs reading point 1.\nBody 2: Lecture point 2 vs reading point 2.\nBody 3: Lecture point 3 vs reading point 3.\n(No personal opinion; report only.)' },
    { name: 'Problem-Solution', body: 'Intro: describe the problem + its significance.\nBody 1: Cause(s).\nBody 2: Solution 1 + how it helps.\nBody 3: Solution 2 + how it helps.\nConclusion: best solution + outlook.' },
    { name: 'Argument', body: 'Intro: claim.\nBody: evidence 1, evidence 2, evidence 3 (data, example, expert).\nCounter: acknowledge + refute.\nConclusion: reinforce claim.' },
  ]
  body.innerHTML = T.map(t => card(`<h3>${esc(t.name)}</h3><pre class="tmpl">${esc(t.body)}</pre>`)).join('')
}

function samples(body) {
  body.innerHTML = card(`<h3>Annotated Sample (Independent)</h3>
    <p class="prompt"><b>Do you agree or disagree: Technology has made people less social?</b></p>
    <p><span class="anno thesis">While some argue technology isolates us, I firmly disagree; used wisely, it strengthens our social bonds.</span> <span class="anno tip">[Clear thesis]</span></p>
    <p><span class="anno topic">First, technology connects people across distances.</span> For instance, video calls let me speak with my grandparents abroad every week—something impossible a generation ago. <span class="anno tip">[Reason + concrete example]</span></p>
    <p><span class="anno topic">Moreover, online communities help people find others who share their interests.</span> A friend who felt isolated found a supportive group of fellow musicians online and now performs with them in person. <span class="anno tip">[Transition + example]</span></p>
    <p><span class="anno conc">In conclusion, technology is a tool; whether it isolates or unites depends on how we use it.</span> <span class="anno tip">[Restate position]</span></p>`) +
    card(`<h4>Legend</h4><p><span class="anno thesis">Thesis</span> <span class="anno topic">Topic sentence</span> <span class="anno conc">Conclusion</span> <span class="anno tip">Annotation</span></p>`)
}

function prompts(body) {
  body.innerHTML = card(`<h3>Independent Prompts (${WRITING_INDEPENDENT.length})</h3><ol class="prompt-list">${WRITING_INDEPENDENT.map(p => `<li>${esc(p)}</li>`).join('')}</ol>`) +
    card(`<h3>Integrated Prompts (${WRITING_INTEGRATED.length})</h3><ol class="prompt-list">${WRITING_INTEGRATED.map(p => `<li>${esc(p.topic)}</li>`).join('')}</ol>`)
}

export const meta = { label: 'Writing Lab', icon: '✍️' }
