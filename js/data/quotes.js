// js/data/quotes.js — motivational quotes. Dashboard picks index = day-of-year % length.
// Representative set; expand the array freely to reach 365.
export const QUOTES = [
  { t: 'The secret of getting ahead is getting started.', a: 'Mark Twain' },
  { t: 'It always seems impossible until it is done.', a: 'Nelson Mandela' },
  { t: 'Success is the sum of small efforts repeated day in and day out.', a: 'Robert Collier' },
  { t: 'A little progress each day adds up to big results.', a: 'Satya Nani' },
  { t: 'Don\u2019t watch the clock; do what it does. Keep going.', a: 'Sam Levenson' },
  { t: 'Learning never exhausts the mind.', a: 'Leonardo da Vinci' },
  { t: 'The expert in anything was once a beginner.', a: 'Helen Hayes' },
  { t: 'Quality is not an act, it is a habit.', a: 'Aristotle' },
  { t: 'Strive for progress, not perfection.', a: 'Unknown' },
  { t: 'The beautiful thing about learning is that no one can take it away from you.', a: 'B.B. King' },
  { t: 'Push yourself, because no one else is going to do it for you.', a: 'Unknown' },
  { t: 'Great things are done by a series of small things brought together.', a: 'Vincent van Gogh' },
  { t: 'Believe you can and you are halfway there.', a: 'Theodore Roosevelt' },
  { t: 'Practice isn\u2019t the thing you do once you are good. It is the thing that makes you good.', a: 'Malcolm Gladwell' },
  { t: 'Fluency comes from speaking, not from waiting until you are ready.', a: 'Unknown' },
  { t: 'Mistakes are proof that you are trying.', a: 'Unknown' },
  { t: 'The difference between ordinary and extraordinary is that little extra.', a: 'Jimmy Johnson' },
  { t: 'Energy and persistence conquer all things.', a: 'Benjamin Franklin' },
  { t: 'You don\u2019t have to be great to start, but you have to start to be great.', a: 'Zig Ziglar' },
  { t: 'One language sets you in a corridor for life. Two languages open every door along the way.', a: 'Frank Smith' },
  { t: 'Today a reader, tomorrow a leader.', a: 'Margaret Fuller' },
  { t: 'Continuous improvement is better than delayed perfection.', a: 'Mark Twain' },
  { t: 'The only way to learn a language is to use it.', a: 'Unknown' },
  { t: 'Discipline is choosing between what you want now and what you want most.', a: 'Abraham Lincoln' },
  { t: 'Small daily improvements over time lead to stunning results.', a: 'Robin Sharma' },
  { t: 'Knowledge speaks, but wisdom listens.', a: 'Jimi Hendrix' },
  { t: 'If you are not willing to learn, no one can help you.', a: 'Unknown' },
  { t: 'Dripping water hollows out stone, not through force but through persistence.', a: 'Ovid' },
  { t: 'The roots of education are bitter, but the fruit is sweet.', a: 'Aristotle' },
  { t: 'Courage is the most important of all the virtues.', a: 'Maya Angelou' },
  { t: 'Your limitation is only your imagination.', a: 'Unknown' },
  { t: 'Do something today that your future self will thank you for.', a: 'Sean Patrick Flanery' },
  { t: 'Repetition is the mother of learning.', a: 'Latin Proverb' },
  { t: 'The future depends on what you do today.', a: 'Mahatma Gandhi' },
  { t: 'Learning is a treasure that will follow its owner everywhere.', a: 'Chinese Proverb' },
  { t: 'It does not matter how slowly you go as long as you do not stop.', a: 'Confucius' },
  { t: 'Action is the foundational key to all success.', a: 'Pablo Picasso' },
  { t: 'Confidence comes from preparation.', a: 'Unknown' },
  { t: 'Every accomplishment starts with the decision to try.', a: 'Unknown' },
  { t: 'Words are free. It is how you use them that may cost you.', a: 'Unknown' },
]

export function quoteOfTheDay() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const day = Math.floor((now - start) / 86400000)
  return QUOTES[day % QUOTES.length]
}
