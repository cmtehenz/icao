/**
 * Approximate English pronunciation hints for Brazilian pilots.
 * Format: syllables separated by hyphens (e.g. "passing" → "pé-sing").
 */

const WORD_HINTS: Record<string, string> = {
  // ── Exam / ATC frequent ───────────────────────────────────────────────────
  passing: "pé-sing",
  airborne: "ÉR-born",
  departure: "di-PÁR-tchâr",
  arrival: "a-RÁI-vâl",
  maintain: "mein-TÊIN",
  runway: "RÂN-uêi",
  heading: "HÉ-ding",
  frequency: "FRÍ-quên-si",
  contact: "CÓN-tact",
  cleared: "CLÍRD",
  caution: "CÓ-shãn",
  vicinity: "vi-SÍ-ni-ti",
  aerodrome: "É-ro-drôum",
  airport: "ÉR-pórt",
  approach: "a-PRÓtch",
  tower: "TÁU-âr",
  monitor: "MÓ-ni-târ",
  decimal: "DÉ-si-mâl",
  thousand: "THÁU-zãnd",
  hundred: "HÂN-drâd",
  feet: "FÍT",
  knots: "NÓTS",
  nautical: "NÓ-ti-câl",
  miles: "MÁILZ",
  report: "ri-PÓRT",
  expect: "iks-PÉKT",
  proceed: "pro-SÍD",
  vectors: "VÉK-târz",
  descend: "di-SÉND",
  climb: "CLÁIM",
  turn: "TÉRN",
  left: "LÉFT",
  right: "RÁIT",
  direct: "di-RÉKT",
  hold: "HÔULD",
  holding: "HÔUL-ding",
  short: "XÓRT",
  position: "po-ZÍ-shãn",
  resume: "ri-ZÚM",
  navigation: "næ-vi-GÊI-shãn",
  discretion: "dis-CRÍ-shãn",
  continue: "cãn-TÍ-niu",
  vacate: "VÊI-kêit",
  backtrack: "BÉK-træk",
  taxiway: "TÉK-si-uêi",
  taxi: "TÉK-si",
  takeoff: "TÊI-kóf",
  landing: "LÉN-ding",
  line: "LÁIN",
  wait: "UÊIT",
  ident: "ÁI-dent",
  squawk: "SKUÓK",
  waypoint: "UÊI-póint",
  intercept: "in-târ-SÉPT",
  localizer: "LÔU-câ-lái-zâr",
  glide: "GLÁID",
  slope: "SLÔUP",
  final: "FÁI-nâl",
  base: "BÊIS",
  downwind: "DÁUN-uind",
  missed: "MÍST",
  around: "a-RÁUND",

  // ── Emergencies ───────────────────────────────────────────────────────────
  engine: "ÉN-djin",
  failure: "FÊI-ljâr",
  stall: "STÓL",
  surge: "SÉRDJ",
  loss: "LÓS",
  power: "PÁU-âr",
  thrust: "TRÂST",
  oil: "ÓIL",
  pressure: "PRÉ-shâr",
  temperature: "TÉM-prâ-tchâr",
  hydraulic: "rai-DRÓ-lik",
  leak: "LÍK",
  smoke: "SMÔUK",
  cabin: "KÉ-bin",
  fumes: "FIÚMZ",
  fire: "FÁI-âr",
  board: "BÓRD",
  bird: "BÉRD",
  strike: "STRÁIK",
  birds: "BÉRDZ",
  hit: "RÍT",
  windshear: "UÍND-xir",
  microburst: "MÁI-crôu-bârst",
  turbulence: "TÉR-bju-lãns",
  severe: "si-VÍR",
  moderate: "MÓ-dâ-rêit",
  icing: "ÁI-sing",
  fuel: "FIÚL",
  starvation: "star-VÊI-shãn",
  dumping: "DÂM-ping",
  total: "TÔU-tâl",
  electrical: "i-LÉK-tri-câl",
  battery: "BÉ-tâ-ri",
  inoperative: "in-Ó-pe-râ-tiv",
  incapacitation: "in-câ-pæ-si-TÊI-shãn",
  passenger: "PÉ-sên-djâr",
  passengers: "PÉ-sên-djârz",
  passed: "PÉST",
  out: "ÁUT",
  heart: "RÁRT",
  attack: "a-TÉK",
  seizure: "SÍ-zhâr",
  emergency: "i-MÉR-djên-si",
  evacuation: "i-vækju-ÊI-shãn",
  mayday: "MÊI-dêi",
  pan: "PÉN",
  assistance: "a-SÍS-tãns",
  divert: "dai-VÉRT",
  nearest: "NÍR-ist",
  priority: "prai-Ó-ri-ti",
  medical: "MÉ-di-câl",
  injured: "ÍN-djârd",
  unconscious: "ân-CÓN-shãs",

  // ── Landing gear ──────────────────────────────────────────────────────────
  gear: "GÍR",
  main: "MÊIN",
  nose: "NÔUZ",
  stuck: "STÂK",
  collapsed: "co-LÉPST",
  extended: "iks-TÉN-did",
  retracted: "ri-TRÊK-tid",
  twisted: "TUÍS-tid",
  belly: "BÉ-li",
  wheels: "UÍLZ",

  // ── Weather ───────────────────────────────────────────────────────────────
  thunderstorm: "THÂN-dâr-stórm",
  cloud: "KLÁUD",
  clouds: "KLÁUDZ",
  visibility: "vi-zi-BÍ-li-ti",
  ceiling: "SÍ-ling",
  rain: "RÊIN",
  fog: "FÓG",
  gust: "GÂST",
  gusting: "GÂS-ting",
  crosswind: "KRÓS-uind",
  tailwind: "TÊI-l-uind",
  headwind: "HÉD-uind",
  lightning: "LÁIT-ning",
  shower: "XÁU-âr",
  weather: "UÉ-dhâr",
  deteriorating: "di-TÍ-ri-ô-rêi-ting",
  broken: "BRÔU-kãn",

  // ── Navigation ────────────────────────────────────────────────────────────
  vor: "VÓR",
  vortac: "VÓR-tæk",
  ils: "I-ÉL-ÉS",
  rnav: "ÁR-næv",
  visual: "VÍ-zhu-âl",
  straight: "STRÊIT",
  go: "GÔU",

  // ── Passengers / crew ─────────────────────────────────────────────────────
  crew: "KRÚ",
  souls: "SÔULZ",
  people: "PÍ-pâl",
  attendant: "a-TÉN-dãnt",
  stewardess: "STÚ-er-dês",
  purser: "PÉR-sâr",
  disembark: "di-sem-BÁRK",
  galley: "GÉ-li",

  // ── Score phrases ─────────────────────────────────────────────────────────
  experiencing: "iks-SPÍ-ri-ên-sing",
  appears: "a-PÍRZ",
  seems: "SÍMZ",
  would: "UÚD",
  like: "LÁIK",
  prefer: "pri-FÉR",
  request: "ri-KUÉST",
  appreciate: "a-PRÍ-shi-êit",
  currently: "KÂR-ãnt-li",
  fortunately: "FÓR-tchê-na-tli",
  unfortunately: "ân-FÓR-tchê-na-tli",
  because: "bi-KÓZ",
  precaution: "pri-KÓ-shãn",
  moment: "MÔU-mãnt",
  reasons: "RÍ-zãnz",
  safety: "SÊIF-ti",

  // ── Reported speech ───────────────────────────────────────────────────────
  controller: "cãn-TRÔU-lâr",
  instructed: "in-STRÂK-tid",
  informed: "in-FÓRMD",
  advised: "âd-VÁIZD",
  asked: "ÉSKT",
  said: "SÉD",
  finally: "FÁI-nâ-li",
  also: "ÓL-sôu",
  confirm: "cãn-FÉRM",
  sight: "SÁIT",
  closed: "KLÔUZD",
  slow: "SLÔU",
  delay: "di-LÊI",

  // ── Part 1 / general aviation ─────────────────────────────────────────────
  helicopter: "HÉ-li-cóp-ter",
  phraseology: "frei-zi-O-lo-dji",
  helipad: "HÉ-li-pæd",
  offshore: "ÓF-xórf",
  hems: "HÉMS",
  aviation: "êi-vi-ÊI-shãn",
  pilot: "PÁI-lât",
  pilots: "PÁI-lâts",
  aircraft: "ÉR-kræft",
  flight: "FLÁIT",
  level: "LÉ-vâl",
  altitude: "ÁL-ti-tiud",
  hover: "HÓ-vâr",
  autorotation: "ó-tô-rô-TÊI-shãn",
  discipline: "DÍ-si-plin",
  procedures: "pro-SÍ-djârz",
  technology: "tek-NÓ-lo-dji",
  communication: "cã-miu-ni-KÊI-shãn",
  surveillance: "sâr-VÊI-lãns",
  infrastructure: "ÍN-frâ-strâk-tchâr",
  standardization: "stæn-dâr-daiz-ÊI-shãn",
  coordination: "cô-or-di-NÊI-shãn",
  preparation: "pre-pâr-ÊI-shãn",
  calmness: "CÁM-nês",
  fatigue: "fâ-TÍG",
  decision: "di-SÍ-zhãn",
  judgment: "DJÂD-jmãnt",
  training: "TRÊI-ning",
  practice: "PRÉK-tis",
  example: "ig-ZÆM-pâl",
  overall: "ÔU-vâ-rôl",
  opinion: "o-PÍ-ni-ãn",
  additionally: "a-DÍ-shãn-li",
  promote: "pro-MÔUT",
  improve: "im-PRÚV",
  reduce: "ri-DIÚS",
  prevent: "pri-VÉNT",
  ensure: "in-XÚR",
  identify: "ai-DÉN-ti-fai",
  manage: "MÉ-nidj",
  brief: "BRÍF",
  clarify: "KLÉ-ri-fai",
  anticipate: "æn-TÍ-si-pêit",
  prepare: "pri-PÉR",
  perform: "pâr-FÓRM",
  grow: "GRÔU",
  modernize: "MÓ-dâr-náiz",
  expand: "iks-PÉND",
  develop: "di-VÉ-lâp",
  dissipating: "di-SÍ-pêi-ting",
  stable: "STÊI-bâl",
  vibration: "vai-BRÊI-shãn",
  working: "UÉR-king",
  returning: "ri-TÉR-ning",

  // ── Numbers (spoken aviation) ─────────────────────────────────────────────
  zero: "ZÍ-ro",
  one: "UÂN",
  two: "TÚ",
  three: "TRÍ",
  four: "FÓR",
  five: "FÁIV",
  six: "SÍKS",
  seven: "SÉ-vãn",
  eight: "ÊIT",
  nine: "NÁIN",
  niner: "NÁI-nâr",
  tree: "TRÍ",
  wun: "UÂN",
  too: "TÚ",

  // ── Common function words (in phrases) ────────────────────────────────────
  the: "dhâ",
  a: "â",
  an: "ân",
  to: "tú",
  of: "óv",
  in: "in",
  on: "ón",
  at: "ét",
  for: "fór",
  with: "uídh",
  and: "énd",
  or: "ór",
  is: "íz",
  are: "ár",
  was: "uóz",
  were: "uér",
  have: "RÉV",
  has: "RÉZ",
  had: "RÉD",
  we: "uí",
  they: "dhêi",
  he: "rí",
  she: "xí",
  it: "ít",
  our: "ÁU-âr",
  your: "IÓR",
  my: "MÁI",
  me: "mí",
  that: "dhét",
  if: "íf",
  as: "éz",
  due: "DIÚ",
  own: "ÔUN",
  up: "ÂP",
  not: "NÓT",
  no: "NÔU",
  can: "KÉN",
  cannot: "KÉ-not",
  will: "UÍL",
  be: "bí",
  been: "bín",
  being: "BÍ-ing",
  from: "fróm",
  into: "ÍN-tu",
  after: "ÁF-târ",
  before: "bi-FÓR",
  begin: "bi-GUIN",
  beginning: "bi-GÍ-ning",
  during: "DJÚ-ring",
  while: "UÁIL",
  when: "UÉN",
  where: "UÉR",
  which: "UÍtch",
  what: "UÓT",
  how: "RÁU",
  why: "UÁI",
  all: "ÓL",
  some: "SÂM",
  any: "É-ni",
  this: "dhís",
  these: "dhíz",
  those: "dhôuz",
  there: "dhér",
  here: "RÍR",
  about: "a-BÁUT",
  over: "ÔU-vâr",
  under: "ÂN-dâr",
  between: "bi-TUÍN",
  through: "TRÚ",
  without: "uídh-ÁUT",
  within: "uídh-ÍN",
  against: "a-GÉNST",
  toward: "to-UÓRD",
  towards: "to-UÓRDZ",
  upon: "a-PÓN",
  onto: "ÓN-tu",
  off: "ÓF",
  away: "a-UÊI",
  back: "BÉK",
  down: "DÁUN",
  again: "a-GÉN",
  still: "STÍL",
  just: "DJÂST",
  only: "ÔUN-li",
  very: "VÉ-ri",
  so: "sôu",
  such: "SÂTCH",
  than: "dhén",
  then: "dhén",
  now: "NÁU",
  yet: "IÉT",
  already: "ól-RÉ-di",
  perhaps: "pâr-HÉPS",
  maybe: "MÊI-bi",
  however: "rau-É-vâr",
  therefore: "DHÉR-fó",
  otherwise: "ÂN-dâr-uáiz",
  although: "ól-DHÔU",
  though: "DHÔU",
  since: "SÍNS",
  until: "ân-TÍL",
  unless: "ân-LÉS",
  whether: "UÉ-dhâr",
  both: "BÔUTH",
  either: "Í-dhâr",
  neither: "NÍ-dhâr",
  each: "ÍTCH",
  every: "É-vâ-ri",
  another: "a-NÂ-dhâr",
  other: "Â-dhâr",
  others: "Â-dhârz",
  same: "SÊIM",
  different: "DÍ-fâ-rãnt",
  new: "NIÚ",
  old: "ÔULD",
  good: "GÚD",
  bad: "BÉD",
  great: "GRÊIT",
  small: "SMÓL",
  large: "LÁRDJ",
  long: "LÓNG",
  high: "RÁI",
  low: "LÔU",
  fast: "FÉST",
  near: "NÍR",
  far: "FÁR",
  early: "ÉR-li",
  late: "LÊIT",
  first: "FÉRST",
  last: "LÉST",
  next: "NÉKST",
  previous: "PRÍ-vi-âs",
  following: "FÓ-lo-uíng",
  available: "a-VÊI-lâ-bâl",
  unable: "ân-ÊI-bâl",
  possible: "PÓ-si-bâl",
  necessary: "NÉ-si-sâ-ri",
  important: "im-PÓR-tãnt",
  critical: "KRÍ-ti-câl",
  essential: "i-SÉN-shâl",
  appropriate: "a-PRÔU-pri-êt",
  immediate: "i-MÍ-di-êt",
  suitable: "SÚ-tâ-bâl",
};

const PHRASE_HINTS: Record<string, string> = {
  "flight level": "fláit lé-vâl",
  "holding point": "hôul-ding póint",
  "holding short": "hôul-ding xórt",
  "line up and wait": "láin âp énd uêit",
  "fly direct": "flái di-rékt",
  "maintain position": "mein-têin po-zí-shãn",
  "resume own navigation": "ri-zúm ôun næ-vi-gêi-shãn",
  "at your discretion": "ét iór dis-crí-shãn",
  "engine failure": "én-djin fêi-ljâr",
  "engine stall": "én-djin stól",
  "engine surge": "én-djin sérdj",
  "loss of power": "lós óv páu-âr",
  "loss of thrust": "lós óv trâst",
  "low oil pressure": "lôu óil pré-shâr",
  "high oil temperature": "rái óil tém-prâ-tchâr",
  "hydraulic leak": "rai-dró-lik lík",
  "hydraulic pressure": "rai-dró-lik pré-shâr",
  "smoke in the cabin": "smôuk in dhâ ké-bin",
  "fire on board": "fái-âr ón bórd",
  "fire in the hold": "fái-âr in dhâ hôuld",
  "bird strike": "bérd stráik",
  "hit birds": "rít bérdz",
  "severe turbulence": "si-vír tér-bju-lãns",
  "moderate turbulence": "mó-dâ-rêit tér-bju-lãns",
  "low fuel": "lôu fiúl",
  "fuel starvation": "fiúl star-vêi-shãn",
  "fuel dumping": "fiúl dâm-ping",
  "total electrical failure": "tôu-tâl i-lék-tri-câl fêi-ljâr",
  "battery power": "bé-tâ-ri páu-âr",
  "gps inoperative": "djí-pí-és in-ó-pe-râ-tiv",
  "fms failure": "éf-ém-és fêi-ljâr",
  "pilot incapacitation": "pái-lât in-câ-pæ-si-têi-shãn",
  "passenger passed out": "pé-sên-djâr pést áut",
  "heart attack": "rárt a-ték",
  "emergency landing": "i-mér-djên-si lén-ding",
  "emergency evacuation": "i-mér-djên-si i-vækju-êi-shãn",
  "nearest airport": "nír-ist ér-pórt",
  "landing gear": "lén-ding gír",
  "main gear": "mêin gír",
  "nose gear": "nôuz gír",
  "wheels-up landing": "uílz-âp lén-ding",
  "belly landing": "bé-li lén-ding",
  "weather deteriorating": "ué-dhâr di-tí-ri-ô-rêi-ting",
  "visual approach": "ví-zhu-âl a-prótch",
  "straight-in approach": "strêit-in a-prótch",
  "missed approach": "míst a-prótch",
  "go around": "gôu a-ráund",
  "glide slope": "gláid slôup",
  "souls on board": "sôulz ón bórd",
  "people on board": "pí-pâl ón bórd",
  "flight attendant": "fláit a-tén-dãnt",
  "medical assistance": "mé-di-câl a-sís-tãns",
  "we are experiencing": "uí ár iks-spí-ri-ên-sing",
  "it appears that": "ít a-pírz dhét",
  "it seems that": "ít símz dhét",
  "we would like to": "uí uúd láik tú",
  "we would prefer to": "uí uúd pri-fér tú",
  "we would appreciate": "uí uúd a-prí-shi-êit",
  "we would like priority": "uí uúd láik prai-ó-ri-ti",
  "we would like vectors": "uí uúd láik vék-târz",
  "we would like to return": "uí uúd láik tú ri-térn",
  "we would like to divert": "uí uúd láik tú dai-vért",
  "due to": "diú tú",
  "because of": "bi-kóz óv",
  "for safety reasons": "fór sêif-ti rí-zãnz",
  "as a precaution": "éz â pri-kó-shãn",
  "at the moment": "ét dhâ môu-mãnt",
  "the controller instructed me to": "dhâ cãn-trôu-lâr in-strâk-tid mí tú",
  "the controller asked me to": "dhâ cãn-trôu-lâr éskt mí tú",
  "the controller informed me that": "dhâ cãn-trôu-lâr in-fórmd mí dhét",
  "the controller cleared me to": "dhâ cãn-trôu-lâr klírd mí tú",
  "the controller advised me to": "dhâ cãn-trôu-lâr âd-váizd mí tú",
  "the pilot informed atc that": "dhâ pái-lât in-fórmd êi-tí-sí dhét",
  "the pilot requested": "dhâ pái-lât ri-kuést",
  "he also said that": "rí ól-sôu séd dhét",
  "finally, he asked me if": "fái-nâ-li, rí éskt mí íf",
  "maintain runway heading": "mein-têin rân-uêi hé-ding",
  "turn left": "térn léft",
  "turn right": "térn ráit",
  "pan pan": "pén pén",
  "mayday mayday mayday": "mêi-dêi mêi-dêi mêi-dêi",
};

const PHRASE_CACHE = new Map<string, string>();

function normalizeKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function capitalizeSyllable(syllable: string): string {
  if (!syllable) return syllable;
  return syllable.charAt(0).toUpperCase() + syllable.slice(1);
}

/** Rough syllable split for unknown words — better than nothing for vault outliers. */
function splitSyllables(word: string): string[] {
  const chunks: string[] = [];
  let current = "";
  const vowelGroup = /[aeiouáéíóúâêîôûãõ]+/i;

  for (let i = 0; i < word.length; i++) {
    current += word[i];
    const next = word[i + 1];
    const isVowel = vowelGroup.test(word[i] ?? "");
    const nextIsVowel = next ? vowelGroup.test(next) : false;
    if (isVowel && next && !nextIsVowel && i < word.length - 2) {
      chunks.push(current);
      current = "";
    }
  }
  if (current) chunks.push(current);
  return chunks.length ? chunks : [word];
}

function applyPhoneticRules(word: string): string {
  let h = word.toLowerCase();
  h = h.replace(/^kn/, "n");
  h = h.replace(/^wr/, "r");
  h = h.replace(/mb$/, "m");
  h = h.replace(/ght/g, "áit");
  h = h.replace(/ough$/g, "óf");
  h = h.replace(/aught$/g, "ót");
  h = h.replace(/tion$/g, "txãn");
  h = h.replace(/sion$/g, "txãn");
  h = h.replace(/ture$/g, "txâr");
  h = h.replace(/ph/g, "f");
  h = h.replace(/sh/g, "x");
  h = h.replace(/ch/g, "tch");
  h = h.replace(/th/g, "t");
  h = h.replace(/qu/g, "qu");
  h = h.replace(/ee/g, "í");
  h = h.replace(/ea/g, "í");
  h = h.replace(/oo/g, "ú");
  h = h.replace(/oa/g, "ôu");
  h = h.replace(/ou/g, "áu");
  h = h.replace(/ow$/g, "áu");
  h = h.replace(/air/g, "ér");
  return h;
}

function hintForToken(token: string): string {
  const key = token.toLowerCase().replace(/[^a-z0-9'-]/g, "");
  if (!key) return token;
  if (WORD_HINTS[key]) return WORD_HINTS[key];

  const transformed = applyPhoneticRules(key);
  const syllables = splitSyllables(transformed);
  return syllables.map((s) => capitalizeSyllable(s)).join("-");
}

/**
 * Returns a Brazilian-friendly pronunciation hint for an English word or phrase.
 * Always returns a non-empty string for non-empty input.
 */
export function getPhoneticHint(text: string): string {
  const key = normalizeKey(text);
  if (!key) return "";

  const cached = PHRASE_CACHE.get(key);
  if (cached) return cached;

  if (PHRASE_HINTS[key]) {
    PHRASE_CACHE.set(key, PHRASE_HINTS[key]!);
    return PHRASE_HINTS[key]!;
  }

  const tokens = key.split(/[\s/]+/).filter(Boolean);
  if (tokens.length === 1) {
    const hint = hintForToken(tokens[0]!);
    PHRASE_CACHE.set(key, hint);
    return hint;
  }

  const hint = tokens.map((t) => hintForToken(t)).join(" ");
  PHRASE_CACHE.set(key, hint);
  return hint;
}
