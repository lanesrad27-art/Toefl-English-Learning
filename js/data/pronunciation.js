// js/data/pronunciation.js

export const IPA_CHART = [
  { s: '/i\u02d0/', ex: 'see, machine', mouth: 'Lidah tinggi-depan, bibir lebar' },
  { s: '/\u026a/', ex: 'sit, bit', mouth: 'Lebih rileks dari /i\u02d0/' },
  { s: '/\u00e6/', ex: 'cat, map', mouth: 'Mulut terbuka lebar, lidah rendah-depan' },
  { s: '/\u028c/', ex: 'cup, luck', mouth: 'Pusat mulut, pendek' },
  { s: '/\u0251\u02d0/', ex: 'car, father', mouth: 'Mulut terbuka, lidah belakang' },
  { s: '/\u0254\u02d0/', ex: 'thought, law', mouth: 'Bibir membulat sedang' },
  { s: '/\u028a/', ex: 'put, book', mouth: 'Bibir membulat, pendek' },
  { s: '/u\u02d0/', ex: 'blue, food', mouth: 'Bibir membulat ketat, lidah belakang' },
  { s: '/\u0259/', ex: 'about, sofa', mouth: 'Schwa, vokal netral lemah' },
  { s: '/e\u026a/', ex: 'day, rain', mouth: 'Diftong dari /e/ ke /\u026a/' },
  { s: '/a\u026a/', ex: 'my, time', mouth: 'Diftong dari /a/ ke /\u026a/' },
  { s: '/\u0254\u026a/', ex: 'boy, coin', mouth: 'Diftong dari /\u0254/ ke /\u026a/' },
  { s: '/a\u028a/', ex: 'now, house', mouth: 'Diftong dari /a/ ke /\u028a/' },
  { s: '/o\u028a/', ex: 'go, boat', mouth: 'Diftong dari /o/ ke /\u028a/' },
  { s: '/\u03b8/', ex: 'think, bath', mouth: 'Lidah di antara gigi, tak bersuara' },
  { s: '/\u00f0/', ex: 'this, mother', mouth: 'Lidah di antara gigi, bersuara' },
  { s: '/\u0283/', ex: 'she, ship', mouth: 'Bibir maju, desis lembut' },
  { s: '/t\u0283/', ex: 'church, watch', mouth: 'Letup + desis' },
  { s: '/d\u0292/', ex: 'judge, age', mouth: 'Letup bersuara + desis' },
  { s: '/\u014b/', ex: 'sing, long', mouth: 'Sengau belakang' },
  { s: '/r/', ex: 'red, car', mouth: 'Lidah tidak menyentuh langit-langit' },
  { s: '/v/', ex: 'very, love', mouth: 'Gigi atas di bibir bawah, bersuara' },
]

export const MINIMAL_PAIRS = [
  ['ship', 'sheep', '/\u026a/ vs /i\u02d0/'], ['bit', 'beat', '/\u026a/ vs /i\u02d0/'], ['think', 'sink', '/\u03b8/ vs /s/'],
  ['live', 'leave', '/\u026a/ vs /i\u02d0/'], ['full', 'fool', '/\u028a/ vs /u\u02d0/'], ['cat', 'cut', '/\u00e6/ vs /\u028c/'],
  ['bad', 'bed', '/\u00e6/ vs /e/'], ['rice', 'lice', '/r/ vs /l/'], ['very', 'berry', '/v/ vs /b/'],
  ['thin', 'tin', '/\u03b8/ vs /t/'], ['vine', 'wine', '/v/ vs /w/'], ['pull', 'pool', '/\u028a/ vs /u\u02d0/'],
  ['cap', 'cup', '/\u00e6/ vs /\u028c/'], ['seat', 'sit', '/i\u02d0/ vs /\u026a/'], ['fan', 'van', '/f/ vs /v/'],
  ['three', 'tree', '/\u03b8/ vs /t/'], ['cold', 'called', '/o\u028a/ vs /\u0254\u02d0/'], ['walk', 'work', '/\u0254\u02d0/ vs /\u025c\u02d0/'],
  ['light', 'right', '/l/ vs /r/'], ['day', 'they', '/d/ vs /\u00f0/'], ['boat', 'bought', '/o\u028a/ vs /\u0254\u02d0/'],
  ['mouse', 'mouth', '/s/ vs /\u03b8/'], ['glass', 'grass', '/l/ vs /r/'], ['pin', 'pen', '/\u026a/ vs /e/'],
  ['hat', 'hut', '/\u00e6/ vs /\u028c/'], ['wet', 'wait', '/e/ vs /e\u026a/'], ['cheap', 'cheep', '/i\u02d0/'],
  ['back', 'bag', '/k/ vs /g/'], ['leaf', 'leave', '/f/ vs /v/'], ['sue', 'zoo', '/s/ vs /z/'],
]

// Common mispronunciations for Indonesian speakers: [word, wrong, right, note]
export const MISPRON_ID = [
  ['comfortable', 'kom-FOR-ta-bel', 'KUMF-ta-bul', 'Stres di suku pertama; "for" hampir hilang.'],
  ['vegetable', 've-ge-TA-bel', 'VEJ-ta-bul', 'Tiga suku, bukan empat.'],
  ['Wednesday', 'wed-NES-day', 'WENZ-day', 'Huruf "d" pertama tidak diucapkan.'],
  ['island', 'IS-land', 'EYE-lund', 'Huruf "s" diam.'],
  ['receipt', 're-SEPT', 're-SEET', 'Huruf "p" diam.'],
  ['determine', 'de-ter-MINE', 'de-TER-min', 'Akhiran seperti "min", bukan "main".'],
  ['vehicle', 've-HI-kel', 'VEE-i-kul', 'Huruf "h" hampir diam.'],
  ['clothes', 'klo-thes', 'klohz', 'Satu suku, /\u00f0z/ di akhir.'],
  ['government', 'go-ver-men', 'GUV-er-ment', '"n" pertama sering hilang oleh natif.'],
  ['February', 'feb-RU-a-ri', 'FEB-yu-er-i', '"r" pertama sering disederhanakan.'],
  ['photograph', 'photo-GRAPH', 'FOH-tuh-graf', 'Stres di suku pertama.'],
  ['photographer', 'photo-GRAPH-er', 'fuh-TOG-ruh-fer', 'Stres pindah ke suku kedua.'],
  ['chocolate', 'cho-co-LATE', 'CHOK-lit', 'Tiga huruf, dua suku.'],
  ['recipe', 're-SIPE', 'RES-i-pee', 'Tiga suku; "e" akhir dibaca.'],
  ['analysis', 'a-na-LY-sis', 'uh-NAL-uh-sis', 'Stres di suku kedua.'],
  ['develop', 'de-ve-LOP', 'di-VEL-up', 'Stres di tengah, bukan akhir.'],
  ['determine', 'de-ter-MINE', 'di-TUR-min', 'Akhir tidak seperti "mine".'],
  ['focus', 'fo-KUS', 'FOH-kus', 'Stres di awal.'],
  ['idea', 'i-DE-a', 'eye-DEE-uh', 'Tiga suku.'],
  ['cupboard', 'cup-board', 'KUB-erd', '"p" diam, satu kata.'],
  ['salmon', 'sal-mon', 'SAM-un', '"l" diam.'],
  ['debt', 'debt', 'det', '"b" diam.'],
  ['subtle', 'sub-tle', 'SUT-ul', '"b" diam.'],
  ['knowledge', 'know-ledge', 'NOL-ij', '"k" diam, vokal pendek.'],
  ['height', 'heyt', 'hyte', 'Berima dengan "light", bukan "weight".'],
  ['suite', 'su-ite', 'sweet', 'Diucapkan seperti "sweet".'],
  ['colonel', 'co-lo-nel', 'KER-nul', 'Diucapkan seperti "kernel".'],
  ['mortgage', 'mort-gage', 'MOR-gij', '"t" diam.'],
  ['often', 'OF-ten', 'OF-un', '"t" sering diam.'],
  ['castle', 'cas-tle', 'KAS-ul', '"t" diam.'],
]

// American vs British examples: [word, US, UK]
export const AME_BRE = [
  ['schedule', 'SKEJ-ool', 'SHED-yool'], ['tomato', 'tuh-MAY-toh', 'tuh-MAH-toh'],
  ['water', 'WAH-ter', 'WAW-tuh'], ['advertisement', 'AD-ver-ties-ment', 'ad-VER-tis-ment'],
  ['privacy', 'PRY-vuh-see', 'PRIV-uh-see'], ['vitamin', 'VY-tuh-min', 'VIT-uh-min'],
  ['garage', 'guh-RAHZH', 'GA-rij'], ['mobile', 'MOH-bul', 'MOH-byle'],
  ['herb', 'erb (h diam)', 'herb (h diucap)'], ['leisure', 'LEE-zher', 'LEZH-uh'],
  ['either', 'EE-ther', 'EYE-ther'], ['route', 'rowt / root', 'root'],
  ['data', 'DAY-tuh', 'DAH-tuh'], ['address', 'AD-ress', 'uh-DRESS'],
  ['aluminum', 'uh-LOO-mi-num', 'al-yoo-MIN-ium'], ['dance', 'danss', 'dahnss'],
]

// Phoneme drills for sounds tricky for Indonesian speakers.
export const PHONEME_DRILLS = [
  { p: '/\u03b8/', tip: 'Letakkan ujung lidah di antara gigi, hembuskan udara tanpa suara.', words: ['think', 'three', 'bath', 'thank', 'month'] },
  { p: '/\u00f0/', tip: 'Sama seperti /\u03b8/ tetapi pita suara bergetar.', words: ['this', 'that', 'mother', 'breathe', 'they'] },
  { p: '/v/', tip: 'Gigi atas menyentuh bibir bawah, bersuara (bukan /f/ atau /b/).', words: ['very', 'love', 'van', 'voice', 'over'] },
  { p: '/\u00e6/', tip: 'Buka mulut lebar, lidah rendah dan maju.', words: ['cat', 'map', 'bad', 'hand', 'apple'] },
  { p: '/\u028c/', tip: 'Vokal pendek di tengah mulut.', words: ['cup', 'luck', 'sun', 'much', 'under'] },
  { p: '/r/', tip: 'Lidah melengkung tanpa menyentuh langit-langit; jangan digetarkan.', words: ['red', 'right', 'car', 'sorry', 'around'] },
  { p: '/l/', tip: 'Ujung lidah menyentuh belakang gigi atas.', words: ['light', 'low', 'feel', 'yellow', 'class'] },
  { p: '/z/', tip: 'Seperti /s/ tapi bersuara.', words: ['zoo', 'buzz', 'rise', 'lazy', 'zero'] },
]
