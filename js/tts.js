// js/tts.js
// Robust Text-to-Speech engine with two distinct voices (male/female),
// US/UK preference, rate control, and sequential dialogue playback.

export class TTSEngine {
  constructor() {
    this.voices = []
    this.maleVoice = null
    this.femaleVoice = null
    this.ukVoice = null
    this.isReady = false
    this.accent = 'US' // 'US' | 'UK'
    this.init()
  }

  init() {
    return new Promise((resolve) => {
      const load = () => {
        this.voices = speechSynthesis.getVoices()
        const maleNames = ['David', 'Daniel', 'Alex', 'Fred', 'Mark', 'James', 'Ryan', 'Aaron', 'Google US English']
        const femaleNames = ['Samantha', 'Karen', 'Zira', 'Susan', 'Victoria', 'Moira', 'Tessa', 'Allison', 'Google US English']
        const us = v => v.lang === 'en-US'
        const gb = v => v.lang === 'en-GB'
        this.maleVoice = this.voices.find(v => us(v) && maleNames.some(n => v.name.includes(n)))
          || this.voices.find(us) || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0] || null
        this.femaleVoice = this.voices.find(v => us(v) && femaleNames.some(n => v.name.includes(n)))
          || this.voices.find(v => us(v) && v !== this.maleVoice) || this.voices.find(gb) || this.maleVoice
        this.ukVoice = this.voices.find(gb) || this.femaleVoice
        this.isReady = true
        resolve()
      }
      if (typeof speechSynthesis === 'undefined') { this.isReady = false; resolve(); return }
      if (speechSynthesis.getVoices().length > 0) load()
      else speechSynthesis.onvoiceschanged = load
    })
  }

  _pick(gender) {
    if (this.accent === 'UK' && this.ukVoice) return this.ukVoice
    return gender === 'male' ? this.maleVoice : this.femaleVoice
  }

  speak(text, gender = 'female', rate = 0.92, onEnd = null) {
    if (typeof speechSynthesis === 'undefined') { if (onEnd) onEnd(); return }
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    const v = this._pick(gender)
    if (v) u.voice = v
    u.rate = rate
    u.pitch = gender === 'male' ? 0.85 : 1.05
    u.volume = 1.0
    if (onEnd) u.onend = onEnd
    speechSynthesis.speak(u)
  }

  // lines = [{ gender:'male', text:'...' }, ...]
  // onLine(index) fires as each line begins (for transcript highlighting).
  async speakDialogue(lines, rate = 0.9, onLine = null) {
    for (let i = 0; i < lines.length; i++) {
      if (this._stopped) { this._stopped = false; break }
      if (onLine) onLine(i)
      await new Promise(res => this.speak(lines[i].text, lines[i].gender, rate, res))
      await new Promise(r => setTimeout(r, 350))
    }
  }

  setAccent(a) { this.accent = a === 'UK' ? 'UK' : 'US' }
  stop() { this._stopped = true; if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel() }
  pause() { if (typeof speechSynthesis !== 'undefined') speechSynthesis.pause() }
  resume() { if (typeof speechSynthesis !== 'undefined') speechSynthesis.resume() }
  get supported() { return typeof speechSynthesis !== 'undefined' }
}

// Shared singleton used across modules.
export const tts = new TTSEngine()
