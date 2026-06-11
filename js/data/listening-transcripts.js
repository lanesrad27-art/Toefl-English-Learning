// js/data/listening-transcripts.js
// Lectures (single speaker) and conversations (two speakers, gender-tagged for TTS).
// Each item: { id, kind:'lecture'|'conversation', title, topic, lines:[{gender,text}], questions:[...] , notesGuide? }

export const LISTENING = [
  {
    id: 'l1', kind: 'conversation', title: 'Asking About a Research Paper', topic: 'Campus Life',
    lines: [
      { gender: 'female', text: 'Hi Professor Lee, do you have a minute? I wanted to ask about the research paper that\u2019s due next month.' },
      { gender: 'male', text: 'Of course, come in. What\u2019s on your mind?' },
      { gender: 'female', text: 'Well, I\u2019m really interested in renewable energy, but I\u2019m worried the topic is too broad for a ten-page paper.' },
      { gender: 'male', text: 'That\u2019s a sensible concern. Renewable energy covers everything from solar panels to wind turbines to policy. You\u2019ll want to narrow it down.' },
      { gender: 'female', text: 'Right. Maybe I could focus on just solar power?' },
      { gender: 'male', text: 'You could, but even solar is large. What if you examined one question, such as why solar adoption is faster in some regions than others?' },
      { gender: 'female', text: 'Oh, I like that. It would let me compare a few countries instead of trying to cover the whole field.' },
      { gender: 'male', text: 'Exactly. And it gives you a clear argument. Just make sure you use peer-reviewed sources, not random websites.' },
      { gender: 'female', text: 'Got it. Should I email you my thesis statement before I start writing?' },
      { gender: 'male', text: 'Please do. I\u2019m happy to give feedback before you commit to the full draft.' },
    ],
    questions: [
      { q: 'Why does the student visit the professor?', opts: ['To ask for an extension', 'To get help narrowing her paper topic', 'To complain about a grade', 'To borrow a book'], a: 1, type: 'Main Idea', expl: 'She is worried her topic is too broad and seeks help focusing it.', wrong: { 0: 'No extension is requested.', 2: 'No grade is discussed.', 3: 'No book is mentioned.' }, tip: 'The opening lines usually reveal the purpose of a conversation.', time: 35 },
      { q: 'What does the professor suggest she do?', opts: ['Cover all of renewable energy', 'Focus on a single comparative question', 'Switch to wind power', 'Write fifteen pages'], a: 1, type: 'Detail', expl: 'He recommends examining why adoption differs between regions.', wrong: { 0: 'He warns against breadth.', 2: 'Wind power is only an example of breadth.', 3: 'Length is not increased.' }, tip: 'Listen for the professor\u2019s concrete recommendation.', time: 35 },
      { q: 'What can be inferred about the professor\u2019s attitude?', opts: ['He is annoyed by the visit.', 'He is supportive and willing to help.', 'He thinks the topic is hopeless.', 'He prefers she choose a different field.'], a: 1, type: 'Attitude', expl: 'He invites her in and offers feedback, showing support.', wrong: { 0: 'He welcomes her warmly.', 2: 'He guides rather than dismisses.', 3: 'He keeps her in renewable energy.' }, tip: 'Tone and offers of help signal attitude.', time: 35 },
      { q: 'Why does the professor mention peer-reviewed sources?', opts: ['To warn against unreliable websites', 'To suggest she avoid the library', 'To require more pages', 'To change the deadline'], a: 0, type: 'Function', expl: 'He stresses credible sources over random websites.', wrong: { 1: 'The library is not discouraged.', 2: 'Page count is unchanged.', 3: 'No deadline change.' }, tip: 'Function questions ask why a speaker says something.', time: 35 },
    ],
  },
  {
    id: 'l2', kind: 'lecture', title: 'How Memory Works', topic: 'Psychology',
    lines: [
      { gender: 'male', text: 'Today we\u2019re going to talk about memory, and I want to start by dispelling a common myth. Many people think memory works like a video recorder, capturing events exactly as they happened. In reality, memory is reconstructive.' },
      { gender: 'male', text: 'What do I mean by that? Each time you recall an event, your brain rebuilds it from fragments\u2014pieces of sights, sounds, and emotions. And during that rebuilding, errors can slip in. You might add details that were never there.' },
      { gender: 'male', text: 'Psychologists divide memory into stages. First, encoding: information enters through the senses. Then storage: the information is held over time. Finally, retrieval: we bring the information back into awareness.' },
      { gender: 'male', text: 'Here\u2019s a key point for your exam. The way we encode information strongly affects how well we remember it. If you process material deeply\u2014say, by connecting it to something you already know\u2014you\u2019ll recall it far better than if you simply repeat it mechanically.' },
      { gender: 'male', text: 'There\u2019s a famous study where participants saw a simulated car accident. When researchers later asked how fast the cars were going when they smashed into each other, people estimated higher speeds than when the word hit was used instead. The wording actually reshaped their memory.' },
      { gender: 'male', text: 'So the takeaway is this: memory is not a perfect archive. It is an active, sometimes unreliable process\u2014and understanding that has huge implications, from eyewitness testimony to how you study for this course.' },
    ],
    notesGuide: ['Memory = reconstructive (not a recorder)', 'Stages: encoding → storage → retrieval', 'Deep processing improves recall', 'Study: wording changed speed estimates', 'Implication: eyewitness testimony unreliable'],
    questions: [
      { q: 'What is the main idea of the lecture?', opts: ['Memory records events perfectly.', 'Memory is an active, reconstructive process that can be unreliable.', 'Memory has only one stage.', 'Memory cannot be improved.'], a: 1, type: 'Main Idea', expl: 'The professor argues memory is reconstructive and can contain errors.', wrong: { 0: 'He dispels this myth.', 2: 'He names three stages.', 3: 'Deep processing improves it.' }, tip: 'The thesis often appears at the start and is restated at the end.', time: 40 },
      { q: 'According to the professor, what are the three stages of memory?', opts: ['Input, output, deletion', 'Encoding, storage, retrieval', 'Seeing, hearing, feeling', 'Short, medium, long'], a: 1, type: 'Detail', expl: 'He lists encoding, storage, and retrieval.', wrong: { 0: 'Not the terms used.', 2: 'These are senses, not stages.', 3: 'Not the classification given.' }, tip: 'Note ordered lists; they are common detail questions.', time: 35 },
      { q: 'Why does the professor describe the car accident study?', opts: ['To show that wording can reshape memory', 'To prove memory is perfect', 'To explain how cars work', 'To criticize drivers'], a: 0, type: 'Function', expl: 'The study illustrates how the word smashed vs hit changed recall.', wrong: { 1: 'It shows the opposite.', 2: 'Cars are not the topic.', 3: 'Drivers are not judged.' }, tip: 'Examples usually support the speaker\u2019s main claim.', time: 40 },
      { q: 'What study tip does the professor imply?', opts: ['Repeat material mechanically', 'Connect new material to what you already know', 'Avoid taking notes', 'Study only before sleep'], a: 1, type: 'Inference', expl: 'Deep processing\u2014linking to prior knowledge\u2014improves recall.', wrong: { 0: 'Mechanical repetition is weaker.', 2: 'Notes are not discouraged.', 3: 'Sleep timing is not discussed.' }, tip: 'Turn the professor\u2019s point about deep processing into advice.', time: 40 },
    ],
  },
  {
    id: 'l3', kind: 'lecture', title: 'Why the Sky Appears Blue', topic: 'Physics',
    lines: [
      { gender: 'male', text: 'Let\u2019s tackle a question children ask all the time, but that actually involves some elegant physics: why is the sky blue?' },
      { gender: 'male', text: 'Sunlight looks white, but it\u2019s really a mix of all colors, each with a different wavelength. Blue and violet light have short wavelengths; red light has long wavelengths.' },
      { gender: 'male', text: 'When sunlight enters the atmosphere, it collides with tiny gas molecules. These molecules scatter shorter wavelengths much more strongly than longer ones. This is called Rayleigh scattering.' },
      { gender: 'male', text: 'Because blue light is scattered in all directions across the sky, that scattered blue is what reaches your eyes from every direction. So the whole sky takes on a blue tone.' },
      { gender: 'male', text: 'Now, you might ask, why not violet, which scatters even more? Two reasons: the sun emits less violet, and our eyes are more sensitive to blue. So we perceive the sky as blue rather than violet.' },
      { gender: 'male', text: 'And at sunset, light travels through much more atmosphere, so the blue is scattered away before it reaches you, leaving the reds and oranges. That\u2019s the same physics, just a longer path.' },
    ],
    notesGuide: ['Sunlight = all colors / wavelengths', 'Blue = short wavelength, scattered more', 'Rayleigh scattering by gas molecules', 'Sky blue not violet: sun emits less violet + eyes more blue-sensitive', 'Sunset red = longer path scatters blue away'],
    questions: [
      { q: 'What causes the sky to appear blue?', opts: ['Reflection off the ocean', 'Stronger scattering of short-wavelength blue light', 'Blue gases in the air', 'The color of the sun'], a: 1, type: 'Main Idea', expl: 'Rayleigh scattering scatters short blue wavelengths more strongly.', wrong: { 0: 'Ocean reflection is a myth.', 2: 'Gases are colorless; scattering matters.', 3: 'Sunlight is white.' }, tip: 'Identify the central mechanism the lecture explains.', time: 40 },
      { q: 'Why does the sky look blue rather than violet?', opts: ['Violet does not exist in sunlight', 'The sun emits less violet and our eyes favor blue', 'Violet has a longer wavelength', 'Violet is too bright'], a: 1, type: 'Detail', expl: 'The professor gives two reasons: less violet emitted and eye sensitivity.', wrong: { 0: 'Violet is present.', 2: 'Violet is shorter, not longer.', 3: 'Brightness is not the reason.' }, tip: 'When a speaker says "two reasons," expect a detail question.', time: 40 },
      { q: 'Why is the sky red at sunset?', opts: ['The sun changes color', 'Light travels through more atmosphere, scattering blue away', 'Clouds turn red', 'Rayleigh scattering stops'], a: 1, type: 'Connecting Content', expl: 'A longer atmospheric path scatters blue away, leaving reds.', wrong: { 0: 'The sun is unchanged.', 2: 'Clouds are not the cause given.', 3: 'Scattering continues.' }, tip: 'Link the sunset case to the same scattering principle.', time: 40 },
    ],
  },
]
