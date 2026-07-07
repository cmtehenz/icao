#!/usr/bin/env node
/**
 * ICAO Delta — Knowledge Factory auto-enrichment (Batch 01).
 * Generates knowledge/drafts/<concept-slug>.md from master catalog.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, "knowledge/master/icao_master_catalog.md");
const DRAFTS_DIR = path.join(ROOT, "knowledge/drafts");
const PHRASEOLOGY_PATH = path.join(ROOT, "knowledge/drafts/sources/students-phraseology.json");
const VOCAB_DIR = path.join(ROOT, "knowledge/vocabulary");
const PART2_PATH = path.join(ROOT, "data/part2Vocabulary.ts");
const ICAO_VOCAB_PATH = path.join(ROOT, "data/icaoVocabulary.ts");

const RESEARCH = "RESEARCH REQUIRED";
const FAA_PCG = "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/glossary.html";
const FAA_AIM = "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/";

const SKYBRARY = {
  "runway incursion": "https://skybrary.aero/articles/runway-incursion",
  "bird strike": "https://skybrary.aero/articles/bird-strike",
  "windshear": "https://skybrary.aero/articles/wind-shear",
  "microburst": "https://skybrary.aero/articles/microburst",
  "cabin depressurization": "https://skybrary.aero/articles/loss-cabin-pressurization",
  "pressurization problem": "https://skybrary.aero/articles/loss-cabin-pressurization",
  "fire on board": "https://skybrary.aero/articles/in-flight-fire",
  "smoke in the cabin": "https://skybrary.aero/articles/in-flight-fire",
  "fumes in the cabin": "https://skybrary.aero/articles/in-flight-fire",
  "pilot incapacitation": "https://skybrary.aero/articles/pilot-incapacitation",
  "go around": "https://skybrary.aero/articles/go-around",
  "missed approach": "https://skybrary.aero/articles/missed-approach",
  "fuel dumping": "https://skybrary.aero/articles/fuel-dumping",
  "icing conditions": "https://skybrary.aero/articles/airframe-icing",
  "thunderstorm": "https://skybrary.aero/articles/thunderstorm",
  "radio failure": "https://skybrary.aero/articles/communication-failure",
  "engine failure": "https://skybrary.aero/articles/engine-failure-and-damage",
  "low fuel": "https://skybrary.aero/articles/fuel-emergencies",
};

const CONCEPT_ALIASES = {
  "maintain position": ["maintain position"],
  "hold position": ["hold position"],
  "hold short": ["holding short", "hold short"],
  "line up and wait": ["line up and wait"],
  "cleared straight-in approach": ["cleared straight in approach"],
  "continue approach": ["continue approach"],
  "cleared to divert": ["cleared to divert"],
  "cleared to deviate": ["cleared to deviate"],
  "follow traffic ahead": ["follow the traffic ahead of you", "follow traffic ahead"],
  "proceed to vor": ["proceed to afa vor", "proceed to afa vor afa vortac", "proceed to vor"],
  "fly direct": ["fly direct"],
  "resume own navigation": ["resume own navigation"],
  "resume conventional navigation": ["resume conventional navigation"],
  "squawk ident": ["squawk ident"],
  "exit hold": ["exit hold now", "exit hold"],
  "expect hold": ["expect hold"],
  "expect circling": ["expect circling"],
  "expect vectors to intercept": ["expect vector to intercept", "expect vectors to intercept"],
  "vectors to final": ["vectors to final approach", "vectors to final"],
  "maintain own separation": ["maintain own separation"],
  "fly en route": ["fly en route"],
  "maintain runway heading": ["maintain rwy heading", "maintain runway heading"],
  "left-hand pattern": ["left hand pattern"],
  "pattern work": ["pattern work"],
  "reduce speed": ["reduce speed to 230 kt", "reduce speed to mach 0.75", "reduce speed"],
  "descend at your discretion": ["descend at your discretion"],
  "drift down procedure": ["drift down procedure"],
  "maximum altitude capability": ["maximum altitude capability"],
  "level at flight level": ["leveled at flight level 200", "level at flight level"],
  "steep descent": ["steep descent"],
  "vacate runway": ["vacate rwy", "vacate runway"],
  "runway incursion": ["rwy incursion", "runway incursion"],
  "cross runway": ["cross rwy", "cross runway"],
  "backtrack": ["back track", "backtrack"],
  "cleared for immediate takeoff": ["cleared for immediate takeoff"],
  "immediate takeoff": ["immediate takeoff"],
  "rejected takeoff": ["reject take-off", "reject takeoff"],
  "go around": ["going around", "go around"],
  "missed approach": ["follow missed approach procedure", "missed approach"],
  "longest available runway": ["longest available rwy"],
  "direct approach": ["direct approach"],
  "expect approach": ["expect approach"],
  "expect ils approach": ["expect ils approach"],
  "expect rnav approach": ["expect rnav rwy 20 approach", "expect rnav approach"],
  "straight-in approach": ["straight in approach"],
  "downwind leg": ["downwind leg"],
  "visual approach": ["on the visual", "visual approach"],
  "runway in sight": ["confirm rwy in sight", "runway in sight"],
  "priority landing": ["priority to land", "priority landing"],
  "number one for landing": ["number one for landing"],
  "taxi with caution": ["taxi with caution"],
  "expedite taxi": ["expedite taxi"],
  "taxi via": ["via taxiway l", "taxi via"],
  "taxi to gate": ["taxi to gate 5", "taxi to gate"],
  "taxi to ramp": ["taxi to the ramp", "taxi to ramp"],
  "approved taxi": ["approved taxi"],
  "pushback": ["push back tow truck", "pushback"],
  "tow truck": ["push back tow truck", "tow truck"],
  "tow bar": ["push back tow bar", "tow bar"],
  "at your discretion": ["at your discretion"],
  "engine stall": ["engine stall"],
  "loss of thrust": ["loss of thrust"],
  "loss of power": ["loss of power"],
  "engine failure": ["we lost engine number 1", "engine failure"],
  "engine flame out": ["flame out on the right engine", "an engine flame out", "engine flame out"],
  "low oil pressure": ["engine low oil pressure", "low oil pressure"],
  "high oil temperature": ["engine high temperature", "high oil temperature"],
  "engine surge": ["engine surge"],
  "hydraulic leak": ["hydraulic fluid leak", "hydraulic leak"],
  "hydraulic pressure dropping": ["hydraulic pressure indication is dropping"],
  "total electrical failure": ["total electrical failure"],
  "battery power": ["battery power"],
  "partial panel": ["partial panel"],
  "fms failure": ["fms went blank", "fms failure"],
  "gps inoperative": ["gps inoperative"],
  "electronic navigation failure": ["electronic navigation capability"],
  "propeller failure": ["neither of propellers is working", "propeller failure"],
  "landing gear stuck": ["main gear is stuck", "landing gear stuck"],
  "landing gear unsafe indication": ["landing gear bugged down"],
  "left main landing gear problem": ["left main landing gear"],
  "main landing gear collapsed": ["main landing gear collapsed"],
  "landing gear retraction failure": ["main landing gear retracted"],
  "main landing gear twisted": ["main landing gear twisted"],
  "gear down and locked": ["main landing gear extended"],
  "wheels-up landing": ["wheels up landing"],
  "belly landing": ["belly landing"],
  "flaps-up landing": ["flaps up landing"],
  "cabin depressurization": ["air cabin depressurization", "sudden decompression"],
  "pressurization problem": ["due to pressurization problem"],
  "fire in the hold": ["fire in the hold"],
  "fire on board": ["fire on board"],
  "fire in the wheel well": ["fire in the wheel well"],
  "galley fire": ["fire in the catering"],
  "uncontrollable fire": ["uncontrollable fire"],
  "smoke in the cabin": ["smoke in the cabin"],
  "fumes in the cabin": ["fumes in the cabin"],
  "cargo door separated": ["door separated from the airplane"],
  "windshield damage": ["broken windshield", "cracked windshield", "cracked windscreen", "shattered windscreen", "windscreen damaged"],
  "forward cargo door open": ["it is opened in the forward cargo hold", "it is opened in the front of the plane"],
  "aft cargo door open": ["it is opened in the aft cargo hold"],
  "thunderstorm": ["thunderstorm"],
  "severe turbulence": ["severe turbulence"],
  "moderate turbulence": ["moderate turbulence"],
  "windshear on final": ["windshear on final"],
  "microburst on final": ["microburst on final"],
  "gusty wind on final": ["gust wind on final approach"],
  "icing conditions": ["icing conditions"],
  "de-icing system failure": ["de-icing system not working properly", "de icing system not working", "de-icing system failure"],
  "fuel dumping": ["dump some fuel", "request fuel dumping"],
  "low fuel": ["facing low fuel"],
  "fuel starvation": ["facing fuel starvation"],
  "confirm fuel remaining": ["confirm fuel remaining in hours"],
  "distress call": ["distress call"],
  "emergency evacuation": ["emergency evacuation"],
  "emergency landing": ["emergency landing", "perform an emergency landing"],
  "emergency services": ["emergency services"],
  "escape slide deployed": ["scapes slides accidentally deployed"],
  "lightning strike": ["struck by lightning"],
  "bird strike": ["bird strike", "hit birds", "flock of birds on final", "vultures in the vicinity"],
  "passenger passed out": ["a person passed out"],
  "flight attendant fainted": ["the flight attendant has fainted"],
  "heart attack": ["heart attack"],
  "seizure": ["seizure", "epileptic attack"],
  "pilot incapacitation": ["pilot incapacitated", "pilot incapacitation"],
  "food poisoning": ["food poisoning"],
  "unruly passenger": ["passenger fighting on board", "passenger misbehavior", "passengers misconduct"],
  "unaccompanied minor": ["unaccompanied minor"],
  "flight attendant": ["flight attendant"],
  "flight purser": ["flight purser"],
  "stewardess": ["stewardess"],
  "aircraft towed": ["towed"],
  "disembark passengers": ["disembark passengers"],
  "give way to aircraft": ["give way to the aircraft"],
  "aircraft stuck on taxiway": ["got stuck"],
  "maintenance on the way": ["maintenance people are on the way"],
  "ground staff on the way": ["ground staff on the way"],
  "firefighters on the way": ["fire fighters are on the way"],
  "airport authority": ["airport authority"],
  "work in progress": ["work in progress"],
  "debris on taxiway": ["debris on the taxiway"],
  "wreckage on runway": ["wreckage on the rwy"],
  "fod reported": ["fod was reported"],
  "drone near airport": ["drone near the airport"],
  "tow truck collision": ["collision with a tow truck"],
  "loose animal on board": ["loose dog on board"],
  "return to parking": ["return to the parking"],
  "startup clearance": ["start up at 60", "start up and pushback approved"],
  "airport operations closed": ["operations closed"],
  "radar contact lost": ["radar contact lost"],
  "radio failure": ["radio contact lost", "loss of radio contact"],
  "transmission readable": ["transmission is readable"],
  "poor readability": ["transmission is poor", "readability is poor"],
  "blocked transmission": ["transmission is blocked", "message was blocked"],
  "garbled message": ["message was garbled"],
  "visual meteorological conditions": ["under visual meteorological conditions"],
  "under radar vectors": ["under radar vectors"],
  "top of descent": ["tod (top of descent) is close"],
  "confirm eta": ["confirm eta"],
  "confirm diversion": ["confirm diversion"],
  "confirm deviation": ["confirm deviation"],
  "confirm detour for weather": ["confirm detour due to bad weather"],
  "weather deviation": ["deviation to avoid weather"],
  "restricted area": ["restricted area"],
  "military activity": ["military activity"],
  "altimeter setting": ["altimeter setting"],
  "altimeter disagreement": ["disagreement in the altimeters"],
  "rate of descent": ["rate of descent"],
  "present heading": ["present heading"],
  "shower over the field": ["shower over the field"],
  "weather deteriorating": ["weather is deteriorating rapidly"],
  "expect moderate turbulence": ["expect moderate turbulence"],
  "expect severe turbulence": ["expect severe turbulence"],
  "hot air balloon": ["hot air balloon at 12 o'clock", "hot air balloon at 6 o'clock", "hot air balloon"],
  "cargo apron": ["cargo apron"],
  "dangerous goods on board": ["dangerous goods on board"],
  "hazmat on board": ["hazmat on board"],
  "human organ transport": ["human organ for transplant"],
  "persons on board": ["number of persons on board", "confirm people on board"],
  "confirm souls on board": ["confirm souls on board"],
  "need assistance": ["need assistance"],
  "assistance upon arrival": ["assistance upon arrival"],
  "confirm intentions": ["confirm intentions"],
  "confirm approach adequate": ["confirm if the approach is adequate"],
  "be advised": ["be advised"],
  "say indicated airspeed": ["say indicated airspeed"],
  "aileron failure": ["copied you lost ailerons"],
  "read back": ["read back all information"],
  "system assessment": ["we are assessing the system", "check out the problem", "looks like i have a failure"],
};

function slugify(concept) {
  return concept.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function loadPhraseologyIndex() {
  const raw = JSON.parse(readFileSync(PHRASEOLOGY_PATH, "utf8"));
  const map = new Map();
  for (const [key, val] of Object.entries(raw)) {
    map.set(norm(key), val.example);
    if (val.term) map.set(norm(val.term), val.example);
  }
  return map;
}

function parseCatalog(text) {
  const rows = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\| (\d{4}) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| (\w+) \|$/);
    if (m) rows.push({ id: m[1], category: m[2].trim(), concept: m[3].trim(), priority: m[4].trim(), parts: m[5].trim(), status: m[6].trim() });
  }
  return rows;
}

function parsePart2Vocabulary(text) {
  const map = new Map();
  const re = /t\("[^"]+", "[^"]+", \d+, "([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)"\)/g;
  let m;
  while ((m = re.exec(text))) map.set(norm(m[1]), { term: m[1], portuguese: m[2], definition: m[3], example: m[4] });
  return map;
}

function parseIcaoLevel4(text) {
  const map = new Map();
  const blocks = text.split(/core\(|t\(/);
  for (const block of blocks) {
    const termM = block.match(/^\s*"[^"]*",\s*"[^"]*",\s*\d+,\s*"([^"]+)"/);
    const l4M = block.match(/4:\s*"([^"]+)"/);
    if (termM && l4M && l4M[1].includes("ANAC")) map.set(norm(termM[1]), l4M[1]);
  }
  return map;
}

function lookupPhrase(map, concept) {
  for (const k of aliasKeys(concept)) {
    if (map.has(k)) return map.get(k);
  }
  return null;
}

function loadVocabulary() {
  const map = new Map();
  if (!existsSync(VOCAB_DIR)) return map;
  for (const file of readdirSync(VOCAB_DIR).filter((f) => f.endsWith(".json"))) {
    const raw = JSON.parse(readFileSync(path.join(VOCAB_DIR, file), "utf8"));
    map.set(norm(raw.term), raw);
  }
  return map;
}

function aliasKeys(concept) {
  const n = norm(concept);
  return [n, ...(CONCEPT_ALIASES[n] || []).map(norm)];
}

function lookup(map, concept) {
  for (const k of aliasKeys(concept)) if (map.has(k)) return map.get(k);
  return null;
}

function categoryDefaults(category) {
  const map = {
    "ATC Phraseology": ["Tower, Ground, Approach, or Departure; pilots read back.", "Taxi, departure, approach, landing.", "Maintains separation and predictable coordination."],
    "Airport Operations": ["Tower and Ground; pilots comply.", "Runway and movement area operations.", "Prevents incursions and surface conflicts."],
    "Ground Operations": ["Ground control and pilots.", "Taxi, pushback, parking, and gate operations.", "Safe movement on the aerodrome surface."],
    Emergency: ["Pilots declare; ATC coordinates priority.", "When safety or continued flight is at risk.", "Triggers appropriate assistance and handling."],
    "Radio Communication": ["Pilots and ATC.", "When clarity or confirmation is needed.", "Prevents misunderstanding on frequency."],
    Navigation: ["Pilots and ATC.", "En route, approach, and weather routing.", "Keeps aircraft separated and on profile."],
    Weather: ["Pilots report; ATC advises.", "When weather affects safety or routing.", "Supports avoidance and stable decisions."],
    "Aircraft Systems": ["Flight crew reports; ATC may assist.", "Abnormal indications or failures.", "Enables checklist action and ATC support."],
    Passenger: ["Cabin crew and pilots; ATC on arrival.", "Medical or behavioral events on board.", "Coordinates care and priority landing."],
    Crew: ["Cabin and flight deck crew.", "Crew illness or coordination.", "Maintains safe delegation and communication."],
  };
  const d = map[category];
  if (!d) return { who: RESEARCH, when: RESEARCH, why: RESEARCH };
  return { who: d[0], when: d[1], why: d[2] };
}

function padExamples(examples) {
  const clean = examples.filter((e) => e && e !== RESEARCH);
  while (clean.length < 5) clean.push(RESEARCH);
  return clean.slice(0, 5);
}

function padResponses(responses) {
  const clean = responses.filter((r) => r && r !== RESEARCH);
  while (clean.length < 3) clean.push(RESEARCH);
  return clean.slice(0, 3);
}

function skybraryUrl(concept) {
  const n = norm(concept);
  for (const [k, url] of Object.entries(SKYBRARY)) if (n.includes(k) || k.includes(n)) return url;
  return null;
}

function renderDraft(entry, vocab, part2, phraseEx, level4) {
  const defaults = categoryDefaults(entry.category);
  const simple = vocab?.simpleMeaning || part2?.definition || RESEARCH;
  const portuguese = vocab?.portugueseMeaning || part2?.portuguese || RESEARCH;
  const operational = vocab?.operationalMeaning || part2?.definition || RESEARCH;
  const who = vocab?.whoUsesIt || defaults.who;
  const when = vocab?.whenUsed || defaults.when;
  const why = vocab?.whyUsed || defaults.why;

  const examples = padExamples([
    ...(vocab?.realExamples?.map((e) => (typeof e === "string" ? e : e.text)) || []),
    part2?.example,
    phraseEx,
    level4,
  ].filter(Boolean));

  const pilotResponses = padResponses([
    ...(vocab?.pilotResponses || []),
    phraseEx && phraseEx.includes("ANAC") ? phraseEx : null,
    level4,
  ].filter(Boolean));

  const pronunciation = vocab?.pronunciationTips?.length ? vocab.pronunciationTips : [RESEARCH];
  const brazilianMistakes = vocab?.commonMistakes?.length ? vocab.commonMistakes : [RESEARCH];
  const related = vocab?.relatedTerms?.length ? vocab.relatedTerms : [RESEARCH];
  const compare = vocab?.compareTerms?.length ? vocab.compareTerms : null;
  const icaoQ = vocab?.icaoQuestions?.[0] || `How would you report "${entry.concept}" to ATC in an ICAO Part 2 situation?`;
  const captainNotes = vocab?.captainStory
    ? `Teach calm readback first. ${vocab.captainStory}`
    : phraseEx
      ? `Anchor on document phraseology: "${phraseEx}".`
      : RESEARCH;
  const memoryTip = vocab?.didYouKnow?.[0] || RESEARCH;

  const refs = ["- ICAO Delta Students material (phraseology document)"];
  const urls = [];
  if (vocab?.references) for (const r of vocab.references) {
    refs.push(`- ${r.title} (${r.source})`);
    if (r.url) urls.push(r.url);
  }
  if (part2) refs.push(`- ICAO Delta Part 2 vocabulary — ${part2.term}`);
  if (["ATC Phraseology", "Radio Communication", "Airport Operations", "Ground Operations"].includes(entry.category)) {
    refs.push("- FAA Pilot/Controller Glossary");
    urls.push(FAA_PCG);
  }
  const sb = skybraryUrl(entry.concept);
  if (sb) { refs.push("- SKYbrary Aviation Safety"); urls.push(sb); }
  if (entry.category === "Emergency" && !sb) { refs.push("- FAA AIM"); urls.push(FAA_AIM); }

  const researchSections = [simple, portuguese, operational, memoryTip, captainNotes,
    ...examples, ...pilotResponses, ...pronunciation, ...brazilianMistakes].filter((x) => x === RESEARCH).length;

  let confidence = "medium";
  if (vocab) confidence = "high";
  else if (phraseEx && part2 && researchSections < 4) confidence = "high";
  else if (!phraseEx && !part2 && researchSections > 8) confidence = "low";

  return {
    md: `# ${entry.concept}

**Catalog ID:** ${entry.id}  
**Category:** ${entry.category}  
**Priority:** ${entry.priority}  
**ICAO Parts:** ${entry.parts}  
**Draft status:** Working document — not consumed by Captain yet  
**Confidence:** ${confidence}

## Simple English meaning

${simple}

## Portuguese meaning

${portuguese}

## Operational meaning

${operational}

## Who normally uses it

${who}

## When it is used

${when}

## Why it is used

${why}

## 5 realistic aviation examples

${examples.map((e, i) => `${i + 1}. ${e}`).join("\n")}

## 3 realistic pilot responses

${pilotResponses.map((r, i) => `${i + 1}. ${r}`).join("\n")}

## Common pronunciation mistakes

${pronunciation.map((p) => `- ${p}`).join("\n")}

## Common Brazilian mistakes

${brazilianMistakes.map((m) => `- ${m}`).join("\n")}

## Related concepts

${Array.isArray(related) ? related.map((r) => `- ${r}`).join("\n") : RESEARCH}

## Compare with similar concepts

${compare ? compare.map((c) => `- **${c.term}:** ${c.note}`).join("\n") : RESEARCH}

## One ICAO speaking question

${icaoQ}

## Captain teaching notes

${captainNotes}

## Memory tip

${memoryTip}

## References

${refs.join("\n")}

## Source URLs

${urls.length ? [...new Set(urls)].map((u) => `- ${u}`).join("\n") : `- ${RESEARCH}`}

## Confidence level

${confidence}
`,
    confidence,
    researchSections,
  };
}

function main() {
  const catalog = parseCatalog(readFileSync(CATALOG_PATH, "utf8"));
  const phraseMap = loadPhraseologyIndex();
  const part2Map = parsePart2Vocabulary(readFileSync(PART2_PATH, "utf8"));
  const level4Map = parseIcaoLevel4(readFileSync(ICAO_VOCAB_PATH, "utf8"));
  const vocabMap = loadVocabulary();

  mkdirSync(DRAFTS_DIR, { recursive: true });

  const summary = {
    total: 0,
    skipped: [],
    researchRequired: [],
    sourcesUsed: ["Students material.pdf", "knowledge/drafts/sources/students-phraseology.json", "data/part2Vocabulary.ts", "data/icaoVocabulary.ts"],
    confidence: { high: 0, medium: 0, low: 0 },
  };

  for (const entry of catalog) {
    const vocab = lookup(vocabMap, entry.concept);
    const part2 = lookup(part2Map, entry.concept);
    const phraseEx = lookupPhrase(phraseMap, entry.concept);
    const level4 = lookup(level4Map, entry.concept);
    if (vocab) summary.sourcesUsed.push(`knowledge/vocabulary/${slugify(vocab.term)}.json`);

    const { md, confidence, researchSections } = renderDraft(entry, vocab, part2, phraseEx, level4);
    writeFileSync(path.join(DRAFTS_DIR, `${slugify(entry.concept)}.md`), md, "utf8");
    summary.total++;
    summary.confidence[confidence]++;
    if (researchSections >= 6 || confidence === "low") summary.researchRequired.push(entry.concept);
  }

  summary.sourcesUsed = [...new Set(summary.sourcesUsed)];
  writeFileSync(path.join(DRAFTS_DIR, "manifest.json"), JSON.stringify({ ...summary, generatedAt: new Date().toISOString().slice(0, 10) }, null, 2));

  console.log(JSON.stringify(summary, null, 2));
}

main();
