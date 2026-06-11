// js/data/grammar-lessons.js
// Grammar lessons grouped by level. Each lesson has bilingual explanation,
// highlighted examples, common Indonesian mistakes, TOEFL relevance, tips, exercises.
// lesson: { id, title, level, en, id, examples:[{text, hl:[words]}], mistakes:[{wrong,right,note}], toefl, tips:[], exercises:[{q,opts,a,expl}] }

export const GRAMMAR = [
  {
    id: 'g1', title: 'Subject-Verb Agreement', level: 'Basic',
    en: 'A verb must agree with its subject in number. Singular subjects take singular verbs; plural subjects take plural verbs. Watch out for phrases between the subject and verb, and for tricky subjects like "each", "the number of", and collective nouns.',
    idn: 'Kata kerja harus sesuai dengan subjek dalam jumlah. Subjek tunggal memakai kata kerja tunggal; subjek jamak memakai kata kerja jamak. Hati-hati dengan frasa di antara subjek dan kata kerja.',
    examples: [
      { text: 'The list of items is on the desk.', hl: ['list', 'is'] },
      { text: 'Each of the students has a laptop.', hl: ['Each', 'has'] },
      { text: 'The number of applicants has increased.', hl: ['number', 'has'] },
    ],
    mistakes: [
      { wrong: 'The list of items are on the desk.', right: 'The list of items is on the desk.', note: 'Subjek = "list" (tunggal), bukan "items".' },
      { wrong: 'Everyone have finished.', right: 'Everyone has finished.', note: '"Everyone" selalu tunggal.' },
    ],
    toefl: 'Frequently tested in Written Expression: an intervening phrase hides the true subject.',
    tips: ['Find the real subject, ignore phrases like "of items".', '"Each/every/everyone" = singular.', '"The number of" = singular; "a number of" = plural.'],
    exercises: [
      { q: 'Choose: The team ____ practicing hard.', opts: ['are', 'is'], a: 1, expl: '"Team" as a single unit takes "is".' },
      { q: 'Choose: Neither of the answers ____ correct.', opts: ['is', 'are'], a: 0, expl: '"Neither" is singular.' },
      { q: 'Choose: The books on the shelf ____ dusty.', opts: ['is', 'are'], a: 1, expl: 'Subject "books" is plural.' },
      { q: 'Choose: Mathematics ____ my favorite subject.', opts: ['is', 'are'], a: 0, expl: '"Mathematics" is singular.' },
      { q: 'Choose: Each of the rooms ____ a window.', opts: ['have', 'has'], a: 1, expl: '"Each" is singular.' },
    ],
  },
  {
    id: 'g2', title: 'The 12 English Tenses', level: 'Basic',
    en: 'English has three time frames (past, present, future) each with four aspects (simple, continuous, perfect, perfect continuous). Choosing the right tense communicates exactly when and how an action happens.',
    idn: 'Bahasa Inggris memiliki tiga kerangka waktu (lampau, sekarang, depan) masing-masing dengan empat aspek (simple, continuous, perfect, perfect continuous).',
    examples: [
      { text: 'She has lived here since 2020.', hl: ['has lived', 'since'] },
      { text: 'They were studying when I called.', hl: ['were studying', 'when'] },
      { text: 'By next year, he will have graduated.', hl: ['will have graduated'] },
    ],
    mistakes: [
      { wrong: 'I am living here since 2020.', right: 'I have lived here since 2020.', note: '"Since" + titik waktu butuh present perfect.' },
      { wrong: 'Yesterday I have gone to the market.', right: 'Yesterday I went to the market.', note: 'Waktu lampau spesifik pakai past simple.' },
    ],
    toefl: 'Verb tense consistency is a top Written Expression error category.',
    tips: ['"Since/for" + duration often signals present perfect.', 'A finished time word (yesterday, in 2010) takes past simple.', 'Keep tenses consistent within a sentence.'],
    exercises: [
      { q: 'Choose: By the time we arrived, the film ____.', opts: ['had started', 'has started'], a: 0, expl: 'Earlier past action → past perfect.' },
      { q: 'Choose: Water ____ at 100 degrees Celsius.', opts: ['boils', 'is boiling'], a: 0, expl: 'General truth → present simple.' },
      { q: 'Choose: I ____ my keys; I can\u2019t find them.', opts: ['lost', 'have lost'], a: 1, expl: 'Past action with present result → present perfect.' },
      { q: 'Choose: This time tomorrow, we ____ over the ocean.', opts: ['will fly', 'will be flying'], a: 1, expl: 'Action in progress at a future time → future continuous.' },
      { q: 'Choose: She ____ for hours before the rescue came.', opts: ['had been waiting', 'was waiting'], a: 0, expl: 'Duration before a past point → past perfect continuous.' },
    ],
  },
  {
    id: 'g3', title: 'Articles: a / an / the / zero', level: 'Basic',
    en: 'Use "a/an" for a non-specific singular countable noun, "the" for something specific or already mentioned, and no article (zero) for general plural or uncountable nouns.',
    idn: 'Gunakan "a/an" untuk benda tunggal yang belum spesifik, "the" untuk yang spesifik, dan tanpa artikel untuk benda jamak/umum atau tak terhitung.',
    examples: [
      { text: 'I saw a movie. The movie was great.', hl: ['a', 'The'] },
      { text: 'Water is essential for life.', hl: ['Water'] },
      { text: 'She is an honest person.', hl: ['an'] },
    ],
    mistakes: [
      { wrong: 'I need the advice.', right: 'I need advice.', note: '"Advice" tak terhitung dan umum → tanpa artikel.' },
      { wrong: 'He is a engineer.', right: 'He is an engineer.', note: 'Bunyi vokal → "an".' },
    ],
    toefl: 'Article errors are common in Written Expression, especially with uncountable nouns.',
    tips: ['"an" before vowel sounds (an hour, an MBA).', 'No article for general uncountables (information, advice).', 'Use "the" for unique things (the sun).'],
    exercises: [
      { q: 'Choose: She plays ____ violin beautifully.', opts: ['the', 'a'], a: 0, expl: 'Instruments take "the".' },
      { q: 'Choose: ____ honesty is important.', opts: ['The', '(no article)'], a: 1, expl: 'Abstract general noun → zero article.' },
      { q: 'Choose: I bought ____ umbrella.', opts: ['a', 'an'], a: 1, expl: '"Umbrella" starts with a vowel sound.' },
      { q: 'Choose: ____ Mount Everest is the tallest peak.', opts: ['The', '(no article)'], a: 1, expl: 'Single mountains take zero article.' },
      { q: 'Choose: Can you pass me ____ salt?', opts: ['the', 'a'], a: 0, expl: 'Specific, shared context → "the".' },
    ],
  },
  {
    id: 'g4', title: 'Relative Clauses', level: 'Intermediate',
    en: 'Relative clauses add information about a noun using who, which, that, whose, where, or when. Defining clauses are essential and take no commas; non-defining clauses add extra information and require commas.',
    idn: 'Klausa relatif menambah informasi tentang kata benda memakai who, which, that, dll. Klausa defining penting (tanpa koma); non-defining tambahan (pakai koma).',
    examples: [
      { text: 'The scientist who discovered it won a prize.', hl: ['who'] },
      { text: 'Paris, which is in France, is beautiful.', hl: ['which'] },
      { text: 'This is the house where I grew up.', hl: ['where'] },
    ],
    mistakes: [
      { wrong: 'The book who I read was long.', right: 'The book that I read was long.', note: '"who" untuk orang; benda pakai that/which.' },
      { wrong: 'My brother, that lives in Bali, called.', right: 'My brother, who lives in Bali, called.', note: 'Klausa non-defining tidak pakai "that".' },
    ],
    toefl: 'Tested in both Structure and Written Expression; watch pronoun choice and commas.',
    tips: ['People → who; things → which/that.', 'Use commas for extra (non-essential) info.', 'Avoid "that" in non-defining clauses.'],
    exercises: [
      { q: 'Choose: The car ____ he bought is electric.', opts: ['who', 'that'], a: 1, expl: 'A car is a thing → that.' },
      { q: 'Choose: My teacher, ____ is from Canada, is kind.', opts: ['who', 'which'], a: 0, expl: 'A person in a non-defining clause → who.' },
      { q: 'Choose: That\u2019s the town ____ I was born.', opts: ['which', 'where'], a: 1, expl: 'Place → where.' },
      { q: 'Choose: The student ____ phone rang left.', opts: ['whose', 'who'], a: 0, expl: 'Possession → whose.' },
      { q: 'Choose: 2020 was the year ____ everything changed.', opts: ['when', 'which'], a: 0, expl: 'Time → when.' },
    ],
  },
  {
    id: 'g5', title: 'Conditionals (0,1,2,3, mixed)', level: 'Intermediate',
    en: 'Conditionals express how one event depends on another. Zero = general truths; First = real future; Second = unreal present; Third = unreal past; Mixed = past condition with present result.',
    idn: 'Conditional menyatakan ketergantungan antar peristiwa. Zero = fakta umum; First = masa depan nyata; Second = present tak nyata; Third = lampau tak nyata.',
    examples: [
      { text: 'If you heat ice, it melts.', hl: ['heat', 'melts'] },
      { text: 'If it rains, we will stay home.', hl: ['rains', 'will stay'] },
      { text: 'If I were rich, I would travel.', hl: ['were', 'would travel'] },
      { text: 'If she had studied, she would have passed.', hl: ['had studied', 'would have passed'] },
    ],
    mistakes: [
      { wrong: 'If I would know, I would tell you.', right: 'If I knew, I would tell you.', note: 'Jangan pakai "would" di klausa if.' },
      { wrong: 'If he will come, call me.', right: 'If he comes, call me.', note: 'First conditional: present di klausa if.' },
    ],
    toefl: 'Conditional structure errors appear in Structure questions and inversions.',
    tips: ['No "will/would" in the if-clause.', 'Second: if + past, would + base.', 'Third: if + had + p.p., would have + p.p.'],
    exercises: [
      { q: 'Choose: If I ____ you, I would apologize.', opts: ['was', 'were'], a: 1, expl: 'Subjunctive "were" in second conditional.' },
      { q: 'Choose: If water ____ to 0°C, it freezes.', opts: ['cools', 'will cool'], a: 0, expl: 'Zero conditional uses present.' },
      { q: 'Choose: If they ____ earlier, they would have caught the train.', opts: ['had left', 'left'], a: 0, expl: 'Third conditional: had + p.p.' },
      { q: 'Choose: If you press this, the machine ____.', opts: ['starts', 'would start'], a: 0, expl: 'General/zero conditional → present.' },
      { q: 'Choose: If I had saved money, I ____ comfortable now.', opts: ['would be', 'would have been'], a: 0, expl: 'Mixed: past condition, present result.' },
    ],
  },
  {
    id: 'g6', title: 'Gerund vs Infinitive', level: 'Intermediate',
    en: 'Some verbs are followed by a gerund (-ing), others by an infinitive (to + base). Prepositions are always followed by gerunds. A few verbs change meaning depending on which form follows.',
    idn: 'Beberapa kata kerja diikuti gerund (-ing), lainnya infinitive (to + base). Setelah preposisi selalu gerund.',
    examples: [
      { text: 'I enjoy reading at night.', hl: ['enjoy', 'reading'] },
      { text: 'She decided to leave early.', hl: ['decided', 'to leave'] },
      { text: 'He is interested in learning Spanish.', hl: ['in', 'learning'] },
    ],
    mistakes: [
      { wrong: 'I look forward to meet you.', right: 'I look forward to meeting you.', note: '"to" di sini preposisi → gerund.' },
      { wrong: 'She avoided to answer.', right: 'She avoided answering.', note: '"avoid" + gerund.' },
    ],
    toefl: 'Common Structure trap: choosing the wrong verb form after a verb or preposition.',
    tips: ['enjoy/avoid/finish/suggest + gerund.', 'decide/want/hope/agree + infinitive.', 'Preposition + gerund, always.'],
    exercises: [
      { q: 'Choose: They agreed ____ the contract.', opts: ['signing', 'to sign'], a: 1, expl: '"agree" + infinitive.' },
      { q: 'Choose: I can\u2019t help ____ at his jokes.', opts: ['laughing', 'to laugh'], a: 0, expl: '"can\u2019t help" + gerund.' },
      { q: 'Choose: She is good at ____ problems.', opts: ['solving', 'to solve'], a: 0, expl: 'Preposition "at" + gerund.' },
      { q: 'Choose: We hope ____ you soon.', opts: ['seeing', 'to see'], a: 1, expl: '"hope" + infinitive.' },
      { q: 'Choose: He finished ____ the report.', opts: ['writing', 'to write'], a: 0, expl: '"finish" + gerund.' },
    ],
  },
  {
    id: 'g7', title: 'Inversion (Negative Adverbials)', level: 'Advanced',
    en: 'When a negative or limiting adverbial begins a sentence for emphasis, the subject and auxiliary verb invert, just like in a question. This is a formal, TOEFL-favored structure.',
    idn: 'Ketika adverbial negatif/pembatas di awal kalimat untuk penekanan, subjek dan kata bantu dibalik seperti dalam pertanyaan.',
    examples: [
      { text: 'Never have I seen such a sight.', hl: ['Never', 'have I'] },
      { text: 'Not only did she win, but she also set a record.', hl: ['Not only', 'did she'] },
      { text: 'Rarely do we encounter such talent.', hl: ['Rarely', 'do we'] },
    ],
    mistakes: [
      { wrong: 'Never I have seen this.', right: 'Never have I seen this.', note: 'Harus inversi: aux + subject.' },
      { wrong: 'Not only she sings, but she dances.', right: 'Not only does she sing, but she also dances.', note: 'Tambahkan auxiliary + inversi.' },
    ],
    toefl: 'A classic Structure item: identify the inverted word order after a negative adverbial.',
    tips: ['Triggers: Never, Rarely, Seldom, Not until, Hardly, No sooner.', 'Invert: auxiliary + subject + main verb.', 'Add "do/does/did" if there is no other auxiliary.'],
    exercises: [
      { q: 'Choose: Seldom ____ such dedication.', opts: ['we see', 'do we see'], a: 1, expl: 'Inversion after "Seldom".' },
      { q: 'Choose: Not until midnight ____ home.', opts: ['he came', 'did he come'], a: 1, expl: '"Not until" triggers inversion.' },
      { q: 'Choose: Hardly ____ when it rang.', opts: ['had I sat', 'I had sat'], a: 0, expl: 'Inversion with "Hardly".' },
      { q: 'Choose: No sooner ____ than they left.', opts: ['we arrived', 'did we arrive'], a: 1, expl: '"No sooner" requires inversion.' },
      { q: 'Choose: Only after the test ____ relieved.', opts: ['did she feel', 'she felt'], a: 0, expl: 'Front "Only after" triggers inversion.' },
    ],
  },
  {
    id: 'g8', title: 'Parallel Structure', level: 'Advanced',
    en: 'Items joined by coordinating conjunctions or in a list must share the same grammatical form\u2014all nouns, all gerunds, or all clauses. Parallelism makes writing clear and is heavily tested.',
    idn: 'Unsur yang digabung konjungsi atau dalam daftar harus berbentuk gramatikal sama (semua kata benda, semua gerund, dll).',
    examples: [
      { text: 'She likes hiking, swimming, and cycling.', hl: ['hiking', 'swimming', 'cycling'] },
      { text: 'The job requires patience, skill, and creativity.', hl: ['patience', 'skill', 'creativity'] },
      { text: 'He came not to argue but to listen.', hl: ['to argue', 'to listen'] },
    ],
    mistakes: [
      { wrong: 'She likes hiking, to swim, and cycling.', right: 'She likes hiking, swimming, and cycling.', note: 'Samakan bentuk: semua gerund.' },
      { wrong: 'The report was clear, concise, and written well.', right: 'The report was clear, concise, and well written.', note: 'Samakan bentuk: semua adjektiva.' },
    ],
    toefl: 'Parallelism is one of the most frequent Written Expression error types.',
    tips: ['Match forms across "and/or/but".', 'Keep correlative pairs parallel (not only ... but also).', 'List items should be the same part of speech.'],
    exercises: [
      { q: 'Choose the parallel option: He is smart, kind, and ____.', opts: ['works hard', 'hardworking'], a: 1, expl: 'Adjective to match "smart, kind".' },
      { q: 'Choose: They enjoy reading and ____.', opts: ['to write', 'writing'], a: 1, expl: 'Match gerund "reading".' },
      { q: 'Choose: The plan is to cut costs and ____ quality.', opts: ['improving', 'to improve'], a: 1, expl: 'Match infinitive "to cut".' },
      { q: 'Choose: She spoke clearly, calmly, and ____.', opts: ['with confidence', 'confidently'], a: 1, expl: 'Match adverb series.' },
      { q: 'Choose: We value honesty, loyalty, and ____.', opts: ['being respectful', 'respect'], a: 1, expl: 'Match noun series.' },
    ],
  },
]
