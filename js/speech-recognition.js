// js/speech-recognition.js
// Thin wrapper over the Web Speech Recognition API with graceful fallback.

export class SpeechRecognizer {
  constructor() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    this.supported = !!SR
    this.SR = SR
    this.rec = null
    this.listening = false
  }

  // onResult(transcript, isFinal); onEnd(); onError(msg)
  start({ lang = 'en-US', interim = true, onResult, onEnd, onError } = {}) {
    if (!this.supported) { if (onError) onError('Browser tidak mendukung Speech Recognition. Coba Chrome/Edge.'); return }
    const rec = new this.SR()
    this.rec = rec
    rec.lang = lang
    rec.continuous = true
    rec.interimResults = interim
    let finalText = ''
    rec.onresult = (e) => {
      let interimText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalText += t + ' '
        else interimText += t
      }
      if (onResult) onResult((finalText + interimText).trim(), !!e.results[e.results.length - 1].isFinal)
    }
    rec.onerror = (e) => { if (onError) onError(e.error || 'speech error') }
    rec.onend = () => { this.listening = false; if (onEnd) onEnd(finalText.trim()) }
    this.listening = true
    rec.start()
  }

  stop() { if (this.rec && this.listening) this.rec.stop() }
}

// Compare a spoken transcript to a target sentence; returns per-word accuracy.
export function scorePronunciation(target, spoken) {
  const norm = s => s.toLowerCase().replace(/[^a-z' ]/g, '').split(/\s+/).filter(Boolean)
  const tw = norm(target), sw = new Set(norm(spoken))
  const words = tw.map(w => ({ word: w, ok: sw.has(w) }))
  const hit = words.filter(w => w.ok).length
  const pct = tw.length ? Math.round((hit / tw.length) * 100) : 0
  return { words, pct }
}
