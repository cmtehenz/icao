import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import type { CuratedWordContent } from "@/lib/wordMission/lesson/enrichment";

const CURATED: Record<string, CuratedWordContent> = {
  "fly direct": {
    missionBrief:
      "Today's mission focuses on one of the most common ATC clearances you'll hear during navigation.",
    meaningEn: "To fly straight to a waypoint without following intermediate routes.",
    meaningPt: "Voar diretamente para um ponto.",
    operationalContext: "ATC uses this when traffic allows a shorter route.",
    whoSaysIt: "Approach or Center — occasionally Tower on departure.",
    whenUsed: "When ATC wants to shorten your track to a fix or destination.",
    whyUsed: "It saves time and fuel when separation allows a direct routing.",
    towerLine: "Helicopter ANAC123, fly direct NITUX.",
    towerExplanation:
      "Instead of following the published route, ATC is shortening your flight to the NITUX waypoint.",
    pronunciationChunks: ["Fly...", "Direct...", "Fly direct."],
    commonMistakes: [
      "Brazilian pilots sometimes stress the wrong syllable on DIRECT.",
      "Many students confuse 'Fly direct' with 'Direct climb' — different clearances.",
    ],
    didYouKnow:
      "Fly direct doesn't always mean flying in a perfectly straight line — ATC may still vector you around traffic.",
    comparePairs: [
      { a: "Fly direct", b: "Proceed direct", note: "Both route to a fix — phraseology varies by unit." },
      { a: "Fly direct", b: "Direct climb", note: "Direct climb is about altitude, not navigation." },
    ],
    captainStory:
      "I remember ATC giving me a direct routing after weather forced us away from the planned track — one short call saved ten minutes.",
    icaoConnection:
      "You may hear this in Part 2 when answering questions about navigation or describing a flight.",
    conversationPrompts: [
      "When do you think ATC would use this clearance?",
      "If you were the pilot, what would you read back?",
    ],
    microChallenges: [
      "Repeat the Tower line — callsign, fly direct, waypoint.",
      "Use 'fly direct' in your own sentence as pilot.",
      "Answer in twenty seconds — explain it to a passenger.",
    ],
  },
  heading: {
    missionBrief:
      "Today's mission focuses on heading — one of the first clearances every pilot reads back after departure.",
    meaningEn: "The direction the aircraft nose is pointing, measured in degrees.",
    meaningPt: "A proa ou direção do nariz da aeronave, em graus.",
    operationalContext: "Tower and Approach assign headings to separate traffic and guide departures.",
    whoSaysIt: "Tower on departure, Approach in the circuit.",
    whenUsed: "Immediately after takeoff and during vectoring.",
    whyUsed: "Headings keep you clear of other traffic until you can resume navigation.",
    towerLine: "Helicopter ANAC123, fly heading zero nine zero.",
    towerExplanation: "Tower is assigning a magnetic heading — read back the heading and your callsign.",
    pronunciationChunks: ["Heading...", "Zero nine zero.", "Fly heading zero nine zero."],
    commonMistakes: [
      "Don't say 'oh nine oh' — use 'zero nine zero' on radio.",
      "Stress HEAD-ing — not head-ING like a body part.",
    ],
    didYouKnow: "Heading is magnetic direction — track is your path over the ground; they differ in wind.",
    comparePairs: [
      { a: "Fly heading", b: "Turn left heading", note: "Turn calls include direction plus heading." },
      { a: "Heading", b: "Track", note: "Heading is where the nose points; track is ground path." },
    ],
    captainStory:
      "On a busy departure, Tower changed my heading twice in one minute — calm readbacks kept the frequency clean.",
    icaoConnection: "Part 2 often tests whether you can describe a departure and read back headings clearly.",
    conversationPrompts: [
      "What would ATC expect in your readback?",
      "Have you ever heard a heading change right after takeoff?",
    ],
    microChallenges: [
      "Read back: fly heading zero nine zero.",
      "Respond as pilot — full readback, twenty seconds.",
    ],
  },
  divert: {
    missionBrief: "Today's mission is about diversion — when plans change and ATC needs your intention fast.",
    meaningEn: "To change destination and land at an alternate airport or helipad.",
    meaningPt: "Desviar para um aeródromo ou heliponto alternativo.",
    operationalContext: "Used when weather, fuel, or aircraft problems require a new landing site.",
    whoSaysIt: "Pilot to ATC — you request; ATC may suggest.",
    whenUsed: "Low fuel, weather below minima, system failures, medical emergencies.",
    whyUsed: "Clear intention keeps ATC and crew aligned under pressure.",
    towerLine: "ANAC123, say intentions.",
    towerExplanation: "ATC needs your plan — divert, fuel state, souls on board, in one calm call.",
    pronunciationChunks: ["Di...", "Vert...", "We would like to divert."],
    commonMistakes: [
      "Don't confuse 'divert' with 'deviate' — deviate is off course; divert is new destination.",
      "Long explanations on frequency — state intention first, details second.",
    ],
    didYouKnow: "In HEMS, diversion decisions often happen with the medical crew — CRM language matters.",
    comparePairs: [
      { a: "Divert", b: "Proceed to alternate", note: "Similar intention — read back the alternate clearly." },
      { a: "Divert", b: "Hold", note: "Hold is delay; divert is new destination." },
    ],
    captainStory:
      "Once hydraulic pressure dropped offshore — one clear divert call got us vectors to the nearest rig helipad.",
    icaoConnection: "Part 2 emergency scenarios often require explaining why you diverted.",
    conversationPrompts: ["What would you say to Approach if you need to divert?", "What information does ATC need first?"],
    microChallenges: ["Request diversion in one operational sentence.", "Explain divert to a nervous passenger."],
  },
  "engine failure": {
    missionBrief: "Today's mission covers engine failure — language every helicopter pilot must say calmly.",
    meaningEn: "Complete or partial loss of engine power or thrust.",
    meaningPt: "Falha ou perda de potência do motor.",
    operationalContext: "Declared to ATC and crew when power is lost or unstable.",
    whoSaysIt: "Pilot to ATC — Mayday or Pan Pan depending on severity.",
    whenUsed: "Power loss, flameout, compressor stall with no recovery.",
    whyUsed: "Priority handling and crew coordination depend on clear, short English.",
    towerLine: "ANAC123, say again your emergency.",
    towerExplanation: "ATC needs your nature of emergency and intentions — engine failure, souls, fuel, intentions.",
    pronunciationChunks: ["Engine...", "Failure...", "We have an engine failure."],
    commonMistakes: [
      "Rushing the call — breathe, then: Mayday, callsign, nature, intention.",
      "Saying 'engine stop' instead of 'engine failure' — use standard phraseology.",
    ],
    didYouKnow: "In ICAO English, clarity beats speed — controllers need the nature of emergency first.",
    comparePairs: [
      { a: "Engine failure", b: "Engine flameout", note: "Flameout is specific; failure covers broader loss." },
      { a: "Mayday", b: "Pan Pan", note: "Mayday is grave danger; Pan Pan is urgent but not immediate grave." },
    ],
    captainStory:
      "Training sortie — simulated engine failure at 800 feet. One calm Mayday call is what the examiner listens for.",
    icaoConnection: "Part 2 emergencies frequently use engine failure scenarios — practice the full call structure.",
    conversationPrompts: ["What would you say first on the radio?", "Mayday or Pan Pan — how do you decide?"],
    microChallenges: ["Full emergency call — twenty seconds.", "Explain engine failure to your copilot."],
  },
  "line up and wait": {
    missionBrief: "Today's mission is line up and wait — a clearance you must never confuse with takeoff.",
    meaningEn: "Position on the runway and wait — do not take off.",
    meaningPt: "Alinhar na pista e aguardar — não decolar.",
    operationalContext: "Tower clears you onto the runway but holds takeoff clearance.",
    whoSaysIt: "Tower to aircraft on ground frequency.",
    whenUsed: "Runway occupancy, sequencing departures, wake turbulence separation.",
    whyUsed: "Positions you for immediate departure when traffic allows.",
    towerLine: "ANAC123, runway three six, line up and wait.",
    towerExplanation: "You may enter the runway — but you must not take off until cleared.",
    pronunciationChunks: ["Line up...", "And wait.", "Line up and wait runway three six."],
    commonMistakes: [
      "Taking off after line up and wait — critical error.",
      "Confusing with 'cleared for takeoff'.",
    ],
    didYouKnow: "This phrase appears frequently in IFR and busy VFR operations worldwide.",
    comparePairs: [
      { a: "Line up and wait", b: "Cleared for takeoff", note: "Only the second authorizes departure." },
      { a: "Hold short", b: "Line up and wait", note: "Hold short stays off runway; line up enters runway." },
    ],
    icaoConnection: "You may hear this expression in Part 2 when describing ground operations.",
    conversationPrompts: ["What is your readback?", "Why would Tower use this instead of immediate takeoff?"],
    microChallenges: ["Read back the full clearance.", "Explain line up and wait to a student pilot."],
  },
};

function categoryBrief(item: IcaoVocabularyItem): string {
  if (item.categoryId === "atc") {
    return `Today's mission focuses on ATC language — "${item.term}" on a real frequency.`;
  }
  if (item.categoryId === "emergencies") {
    return `Today's mission covers emergency communication — "${item.term}" under pressure.`;
  }
  if (item.categoryId === "landing-gear") {
    return `Today's mission is landing gear operations — "${item.term}" in a abnormal situation.`;
  }
  return `Today's mission focuses on operational English — how pilots use "${item.term}" on frequency.`;
}

function splitMeaning(meaning: string): { en: string; pt: string } {
  const parts = meaning.split(" — ");
  if (parts.length >= 2) return { en: parts[0]!.trim(), pt: parts.slice(1).join(" — ").trim() };
  const isPt = /[áàâãéêíóôõúç]/i.test(meaning);
  if (isPt) return { en: meaning, pt: meaning };
  return { en: meaning, pt: meaning };
}

/** Build curated content from vocabulary item when no hand-authored entry exists. */
export function buildFallbackCuratedContent(item: IcaoVocabularyItem): CuratedWordContent {
  const { en, pt } = splitMeaning(item.meaning);
  const term = item.term;
  return {
    missionBrief: categoryBrief(item),
    meaningEn: en,
    meaningPt: pt,
    operationalContext: `Pilots use "${term}" in ${item.category.toLowerCase()} — on radio, not in a textbook.`,
    whoSaysIt: item.categoryId === "atc" ? "ATC to pilot, or pilot readback." : "Pilot to ATC or crew.",
    whenUsed: `During ${item.category.toLowerCase()} — see your example scenario.`,
    whyUsed: "Clear English keeps crew and ATC aligned in real operations.",
    towerLine: `ANAC123, ${getLevelTextSafe(item, 2)}`,
    towerExplanation: item.example || `This is how "${term}" appears in operational context.`,
    pronunciationChunks: term.split(" ").length > 1
      ? [...term.split(" ").map((w) => `${cap(w)}...`), cap(term) + "."]
      : [`${cap(term)}...`, `${cap(term)}.`],
    commonMistakes: [
      `Brazilian pilots sometimes rush "${term}" — slow down on radio.`,
      "Don't translate word-for-word from Portuguese — use the operational phrase.",
    ],
    didYouKnow: `"${term}" appears in ICAO and SDEA exam preparation — learn it as pilots use it.`,
    comparePairs: [{ a: term, b: "Similar clearance", note: "Verify exact phraseology with your operator manual." }],
    icaoConnection:
      item.categoryId === "atc"
        ? "You may hear this in Part 2 when describing ATC instructions."
        : "You can use this in Part 2 emergency or technical scenarios.",
    conversationPrompts: [
      `When would a pilot say "${term}"?`,
      "What would ATC expect in response?",
      "If you were the pilot, what would you say?",
    ],
    microChallenges: [
      `Repeat "${term}" — calm radio pace.`,
      `Use "${term}" in your own operational sentence.`,
      "Answer in twenty seconds.",
    ],
  };
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getLevelTextSafe(item: IcaoVocabularyItem, level: 1 | 2 | 3 | 4): string {
  return item.levels[level];
}

export function getCuratedContent(term: string, item?: IcaoVocabularyItem): CuratedWordContent {
  const key = term.trim().toLowerCase();
  const hand = CURATED[key];
  if (hand) return hand;
  if (item) return buildFallbackCuratedContent(item);
  return buildFallbackFromTerm(term);
}

function buildFallbackFromTerm(term: string): CuratedWordContent {
  return {
    missionBrief: `Today's mission focuses on how pilots use "${term}" on frequency.`,
    meaningEn: `Operational use of "${term}" in aviation communication.`,
    meaningPt: `Uso operacional de "${term}" na comunicação aeronáutica.`,
    operationalContext: "Used in real helicopter and ATC operations — verify with your flight manual.",
    whoSaysIt: "Pilot or ATC depending on context.",
    whenUsed: "During operational radio calls.",
    whyUsed: "Standard phraseology keeps communication clear.",
    towerLine: `ANAC123, ${term}.`,
    towerExplanation: `Listen for "${term}" in context — then read back essentials.`,
    pronunciationChunks: [term, term],
    commonMistakes: ["Speak slowly — quality before speed on radio."],
    didYouKnow: "This expression is part of professional pilot English — not dictionary vocabulary.",
    comparePairs: [],
    icaoConnection: "You may use this in ICAO Part 2 speaking scenarios.",
    conversationPrompts: [`When would ATC use "${term}"?`, "What would you say as pilot?"],
    microChallenges: [`Repeat "${term}" with calm confidence.`, "Explain it in twenty seconds."],
  };
}

export function listCuratedTerms(): string[] {
  return Object.keys(CURATED);
}
