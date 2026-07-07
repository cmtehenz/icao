#!/usr/bin/env node
/** Premium batch-01 emergency concepts 0021–0040 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "knowledge/drafts/batch-01");

const FAA_AIM_EMERG = "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap6_section_1.html";
const FAA_PCG = "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/glossary.html";
const ICAO_DOC4444 = "https://www.icao.int/safety/airnavigation/pages/doc4444.aspx";
const EASA_SAFETY = "https://www.easa.europa.eu/en/domains/safety";

const CATEGORIES = {
  "0021": "Emergency", "0022": "Emergency", "0023": "Emergency", "0024": "Emergency",
  "0025": "Emergency", "0026": "Emergency", "0027": "Emergency", "0028": "Emergency",
  "0029": "Emergency", "0030": "Emergency", "0031": "Emergency", "0032": "Emergency",
  "0033": "Emergency", "0034": "Aircraft Systems", "0035": "Aircraft Systems",
  "0036": "Aircraft Systems", "0037": "Aircraft Systems", "0038": "Emergency",
  "0039": "Emergency", "0040": "Radio Communication",
};

const CONCEPTS = [
  {
    id: "0021",
    concept: "Engine Failure",
    slug: "engine-failure",
    meaning: "Complete or partial loss of engine power — the engine stops producing usable thrust.",
    operational:
      "A life-threatening event requiring immediate crew action, ATC notification, and often a Mayday if continued safe flight is in doubt.",
    when: "After takeoff, during climb, cruise, or approach when an engine stops or cannot maintain power.",
    who: "Flight crew declares to ATC; Approach/Departure/Tower coordinate priority handling and vectors.",
    atc: [
      "ANAC 123, descend at your discretion to flight level zero five zero, turn right heading zero six zero. No reported traffic.",
      "ANAC 123, fly direct to Manchester VOR and expect direct approach to runway zero five left.",
      "ANAC 123, say souls on board and fuel remaining.",
      "ANAC 123, runway two seven cleared to land, wind calm.",
      "ANAC 123, contact emergency services on the ground.",
    ],
    pilot: [
      "Mayday Mayday Mayday, Manaus Approach, ANAC 123. Fire in the cabin. Request return to Manaus.",
      "Departure, ANAC 123, Mayday Mayday Mayday, we have an engine failure and request immediate return.",
      "Tower, N234GH lost engine number one!",
      "We have an engine failure on the left engine.",
      "NEGATIVE. I did not lose an engine. I am experiencing high vibration. Fly direct to Manchester VOR, ANAC 123.",
    ],
    questions: [
      "What would you tell ATC immediately after an engine failure on departure?",
      "When would you declare Mayday for an engine failure?",
      "How would you report your intentions after losing one engine in a twin?",
    ],
    brazilian: [
      "Saying engine stopped instead of engine failure — use standard phraseology.",
      "Declaring Mayday before securing the aircraft and assessing controllability.",
      "Forgetting to state souls on board and fuel when ATC asks.",
    ],
    pronunciation: [
      "Engine failure — stress FAIL-ure, three syllables.",
      "Mayday — say three times clearly: MAY-DAY MAY-DAY MAY-DAY.",
      "Left engine — do not say motor esquerdo on frequency.",
    ],
    captain:
      "Teach the ICAO Delta sequence: aviate, navigate, communicate. Mayday only when justified. 23C Manaus uses fire, but engine failure follows the same urgency structure.",
    memory: "FAIL = Fly the aircraft, Assess, Inform ATC, Land or Loiter as required.",
    related: ["Mayday Distress Call", "Loss of Power", "Emergency Landing", "Go Around"],
    refs: [
      ["ICAO Delta Students material — engine failure phraseology", "Students material.pdf"],
      ["ICAO Delta Exam 24C — engine vibration scenario", "data/exams/part2Data.ts"],
      ["SKYbrary — Engine Failure and Damage", "https://skybrary.aero/articles/engine-failure-and-damage"],
      ["FAA AIM — Emergency Procedures", FAA_AIM_EMERG],
      ["ICAO Doc 4444 — Air Traffic Management", ICAO_DOC4444],
    ],
  },
  {
    id: "0022",
    concept: "Engine Flameout",
    slug: "engine-flameout",
    meaning: "Sudden loss of engine combustion — flame extinguishes in the engine.",
    operational:
      "May be recoverable with relight procedures; crew must report to ATC and state whether restart is in progress.",
    when: "High altitude, fuel interruption, icing, or compressor issues causing combustion to stop.",
    who: "Pilots report; ATC provides vectors, altitude, and priority if aircraft is unable to maintain altitude.",
    atc: [
      "ANAC 123, descend to flight level one zero zero, report if able to restart.",
      "ANAC 123, turn right heading two seven zero, vectors to the field.",
      "ANAC 123, say intentions.",
      "ANAC 123, nearest airport is one five miles at your twelve o'clock.",
      "ANAC 123, roger flame out, standby for vectors.",
    ],
    pilot: [
      "Center, N567IJ right engine flame out!",
      "N890KL declaring emergency, engine flame out!",
      "Pan Pan Pan, ANAC 123, right engine flame out, attempting relight.",
      "ANAC 123, negative restart, request vectors to the nearest airport.",
      "ANAC 123, engine relit, maintaining altitude.",
    ],
    questions: [
      "How is an engine flameout different from engine failure in your report to ATC?",
      "What would you say while attempting an engine relight?",
      "When would flameout justify Pan Pan instead of Mayday?",
    ],
    brazilian: [
      "Confusing flameout with engine stall — different mechanisms, same urgency to report.",
      "Not telling ATC whether restart is being attempted.",
      "Using flame out as one word without clear engine identification.",
    ],
    pronunciation: [
      "Flame out — two words: FLAME OUT.",
      "Relight — RE-LIGHT, not re-lite.",
      "Right engine — specify which engine.",
    ],
    captain:
      "Students material uses flame out on the right engine. Teach that flameout may be transient — keep ATC updated every thirty seconds during restart.",
    memory: "FLAME OUT — Fuel? Logs? Attempt relight? Monitor? Explain to ATC?",
    related: ["Engine Failure", "Loss of Thrust", "Loss of Power", "Emergency Landing"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["SKYbrary — Engine Failure and Damage", "https://skybrary.aero/articles/engine-failure-and-damage"],
      ["FAA AIM — Emergency Procedures", FAA_AIM_EMERG],
      ["EASA Safety", EASA_SAFETY],
    ],
  },
  {
    id: "0023",
    concept: "Loss of Power",
    slug: "loss-of-power",
    meaning: "Reduction or complete loss of engine thrust output.",
    operational:
      "Broader than flameout — includes partial power loss. Crew reports which engine and ability to maintain altitude.",
    when: "Engine malfunction, fuel control issue, or throttle problem causing insufficient thrust.",
    who: "Pilots declare urgency or distress; ATC assigns altitude and routing.",
    atc: [
      "MAYDAY, N789EF complete loss of power!",
      "ANAC 123, say which engine and ability to maintain altitude.",
      "ANAC 123, descend at pilot's discretion.",
      "ANAC 123, vectors to the nearest suitable airport.",
      "ANAC 123, all traffic cleared from your route.",
    ],
    pilot: [
      "MAYDAY, N789EF complete loss of power!",
      "We have a loss of power on the right engine.",
      "Pan Pan Pan, ANAC 123, loss of power on engine two, maintaining altitude.",
      "ANAC 123, unable to maintain flight level two five zero, request lower.",
      "ANAC 123, single-engine approach inbound.",
    ],
    questions: [
      "How would you describe loss of power versus complete engine failure?",
      "What information should ATC know about which engine is affected?",
      "When would loss of power require immediate descent?",
    ],
    brazilian: [
      "Saying no power instead of loss of power.",
      "Not specifying which engine when multiple engines are installed.",
      "Confusing loss of power with electrical power loss.",
    ],
    pronunciation: [
      "Loss of POWER — stress power.",
      "Engine two — digit by digit if using numbers.",
      "Maintain altitude — main-TAIN.",
    ],
    captain: "Loss of power can be partial. Teach students to quantify: able or unable to maintain altitude.",
    memory: "POWER — Position, Observe engine, Which engine, Explain, Request.",
    related: ["Loss of Thrust", "Engine Failure", "Fuel Starvation", "Mayday Distress Call"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary", "data/part2Vocabulary.ts"],
      ["FAA Pilot/Controller Glossary", FAA_PCG],
      ["SKYbrary — Engine Failure and Damage", "https://skybrary.aero/articles/engine-failure-and-damage"],
    ],
  },
  {
    id: "0024",
    concept: "Loss of Thrust",
    slug: "loss-of-thrust",
    meaning: "Engine is running but not producing expected thrust.",
    operational:
      "Often reported as Pan Pan when aircraft can still fly; may precede full engine failure.",
    when: "Compressor stall recovery, degraded engine performance, or thrust lever mismatch.",
    who: "Pilots report; ATC may offer vectors, hold, or priority landing.",
    atc: [
      "PAN-PAN, N456CD loss of thrust in engine two!",
      "ANAC 123, say again amount of thrust available.",
      "ANAC 123, recommend descent to flight level two zero zero.",
      "ANAC 123, traffic no factor, continue present heading.",
      "ANAC 123, cleared direct to the airport.",
    ],
    pilot: [
      "PAN-PAN, N456CD loss of thrust in engine two!",
      "We are experiencing a loss of thrust.",
      "Pan Pan Pan, ANAC 123, loss of thrust, request priority landing.",
      "ANAC 123, thrust improving, continuing to destination.",
      "ANAC 123, request vectors, unable to maintain speed on approach.",
    ],
    questions: [
      "Why might loss of thrust be Pan Pan rather than Mayday?",
      "What would you tell ATC if thrust is degrading during climb?",
      "How do you distinguish loss of thrust from engine failure?",
    ],
    brazilian: [
      "Using loss of power and loss of thrust interchangeably — be precise.",
      "Over-declaring Mayday when aircraft is still controllable.",
      "Omitting engine number in the initial call.",
    ],
    pronunciation: [
      "Loss of THRUST — one syllable thrust.",
      "Pan Pan Pan — three times, rhymes with bonbon.",
      "Engine two — not engine too.",
    ],
    captain: "Pan Pan in students material for loss of thrust — teach urgency without overstating distress.",
    memory: "THRUST down — Tell ATC, Hold altitude if able, Reduce workload, Understand engine, Safe airport, Talk updates.",
    related: ["Engine Surge", "Engine Failure", "Loss of Power", "Pan Pan Urgency Call"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary", "data/part2Vocabulary.ts"],
      ["FAA AIM", FAA_AIM_EMERG],
      ["SKYbrary — Engine Failure and Damage", "https://skybrary.aero/articles/engine-failure-and-damage"],
    ],
  },
  {
    id: "0025",
    concept: "Bird Strike",
    slug: "bird-strike",
    meaning: "Collision between aircraft and one or more birds.",
    operational:
      "Report immediately after impact; crew assesses engine vibration, smell, and parameters before declaring emergency.",
    when: "Takeoff, climb, approach, and landing near airports with bird activity.",
    who: "Pilots report to Tower or Departure; ATC may alert following traffic and request runway inspection.",
    atc: [
      "ANAC 123, roger bird strike, say intentions.",
      "ANAC 123, caution birds in the vicinity of the airport.",
      "ANAC 123, runway inspection in progress.",
      "ANAC 123, cleared to land runway two seven, wind two four zero at one zero.",
      "ANAC 123, report any abnormal indications.",
    ],
    pilot: [
      "MAYDAY, bird strike!",
      "Departure, ANAC 123, we may have had a bird strike after takeoff. We are assessing the situation and would like to level off at five thousand feet while we run the checklist.",
      "We had a bird strike on departure.",
      "Tower, ANAC 123, bird strike on final, going around.",
      "ANAC 123, checklist complete, no damage, continuing.",
    ],
    questions: [
      "What would you report to ATC immediately after a bird strike on takeoff?",
      "When would a bird strike require a go-around?",
      "How would you describe your assessment to ATC while running the checklist?",
    ],
    brazilian: [
      "Declaring Mayday before completing initial assessment — ICAO Delta 23C Part 3 uses cautious language first.",
      "Saying we hit birds only in Portuguese.",
      "Forgetting to state intentions: level off, return, or continue.",
    ],
    pronunciation: [
      "Bird strike — BIRD STRIKE, equal stress.",
      "Assessing — a-SSES-sing, not a-sess-ING.",
      "Checklist — CHECK-list.",
    ],
    captain:
      "23C Part 3 model: possible bird strike, assessing, level off — teach graded urgency. Mayday only if damage confirmed.",
    memory: "BIRD — Brief ATC, Inspect engines, Run checklist, Decide return or continue.",
    related: ["Engine Failure", "Go Around", "Emergency Landing", "Mayday Distress Call"],
    refs: [
      ["ICAO Delta Exam 23C Part 3 — bird strike", "data/simulado/part3Data.ts"],
      ["ICAO Delta Students material", "Students material.pdf"],
      ["SKYbrary — Bird Strike", "https://skybrary.aero/articles/bird-strike"],
      ["FAA AIM — Bird Hazards", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0026",
    concept: "Fire on Board",
    slug: "fire-on-board",
    meaning: "Fire exists inside the aircraft — cabin, cockpit, or cargo area.",
    operational:
      "Immediate Mayday; crew executes fire checklist, diverts, and prepares for emergency landing and evacuation.",
    when: "Smoke smell with flames, cargo fire warning, galley fire, or electrical fire.",
    who: "Pilots declare Mayday; ATC clears traffic, assigns descent, and alerts fire services.",
    atc: [
      "ANAC 123, descend at your discretion to flight level zero five zero, turn right heading zero six zero.",
      "ANAC 123, confirm you have an engine fire.",
      "ANAC 123, runway three six cleared to land, fire services alerted.",
      "ANAC 123, squawk seven seven zero zero.",
      "ANAC 123, say souls on board and fuel remaining.",
    ],
    pilot: [
      "Mayday Mayday Mayday, Manaus Approach, ANAC 123. Fire in the cabin. Request return to Manaus.",
      "Mayday, we have fire on board.",
      "Emergency, fire in cabin!",
      "NEGATIVE, we have fire in the cabin. Descending to flight level zero five zero, ANAC 123.",
      "MAYDAY, uncontrollable fire!",
    ],
    questions: [
      "What is the difference between fire on board and fire in the cabin when reporting?",
      "How would you correct ATC if they assume engine fire instead of cabin fire?",
      "What information must follow a Mayday for fire on board?",
    ],
    brazilian: [
      "Saying fire in the airplane vaguely — specify cabin, cockpit, or cargo.",
      "Accepting ATC assumption of engine fire without correction — 23C Manaus tests NEGATIVE.",
      "Delaying Mayday to finish checklist items below ten thousand feet.",
    ],
    pronunciation: [
      "Fire in the CABIN — clear three-word phrase.",
      "Mayday — three times before facility name.",
      "NEGATIVE — NEG-a-tive, firm correction.",
    ],
    captain:
      "23C Situation 2 is the gold standard: Mayday, fire in the cabin, request return, then NEGATIVE to engine fire assumption.",
    memory: "FIRE — First declare Mayday, Inform location, Request return, Extinguish/evacuate plan.",
    related: ["Smoke in the Cabin", "Fumes in the Cabin", "Mayday Distress Call", "Emergency Evacuation"],
    refs: [
      ["ICAO Delta Exam 23C Situation 2 — fire in cabin", "data/exams/part2Data.ts"],
      ["ICAO Delta Students material", "Students material.pdf"],
      ["SKYbrary — In-Flight Fire", "https://skybrary.aero/articles/in-flight-fire"],
      ["FAA AIM — Emergency Procedures", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0027",
    concept: "Smoke in the Cabin",
    slug: "smoke-in-the-cabin",
    meaning: "Visible smoke present in the passenger cabin.",
    operational:
      "Urgent situation — may escalate to Mayday. Crew dons oxygen, descends, and diverts.",
    when: "Electrical smoke, galley smoke, or unknown source during flight.",
    who: "Pilots report Pan Pan or Mayday; ATC provides priority handling.",
    atc: [
      "ANAC 123, descend immediately, turn left heading two seven zero.",
      "ANAC 123, nearest airport one two o'clock, one five miles.",
      "ANAC 123, runway cleared to land, fire services standing by.",
      "ANAC 123, say souls on board.",
      "ANAC 123, report smoke dissipating or continuing.",
    ],
    pilot: [
      "Emergency, smoke in the cabin!",
      "We have smoke in the cabin, request immediate descent.",
      "Mayday Mayday Mayday, Approach, ANAC 123, smoke in the cockpit. Request immediate vectors to land on the nearest runway.",
      "Pan Pan Pan, ANAC 123, smoke in the cabin, descending.",
      "ANAC 123, smoke dissipating, request vectors to departure airport.",
    ],
    questions: [
      "When would smoke in the cabin require Mayday versus Pan Pan?",
      "What would you request from ATC on first report of smoke?",
      "How would you report smoke dissipating after checklist action?",
    ],
    brazilian: [
      "Saying only smoke without specifying cabin or cockpit.",
      "Requesting descent without declaring urgency level.",
      "Using fumaça in English transmission.",
    ],
    pronunciation: [
      "Smoke in the cabin — steady pace, do not rush.",
      "Immediate descent — im-ME-di-ate.",
      "Vectors — VEC-tors.",
    ],
    captain: "Part 3 simulado uses smoke in cockpit with Mayday and vectors — cabin smoke uses similar urgency.",
    memory: "SMOKE — Source?, Mask on, Oxygen, Keep ATC informed, Expedite landing.",
    related: ["Fire on Board", "Fumes in the Cabin", "Emergency Landing", "Mayday Distress Call"],
    refs: [
      ["ICAO Delta Part 3 simulado — smoke", "data/simulado/part3Data.ts"],
      ["ICAO Delta Students material", "Students material.pdf"],
      ["SKYbrary — In-Flight Fire", "https://skybrary.aero/articles/in-flight-fire"],
      ["FAA AIM", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0028",
    concept: "Fumes in the Cabin",
    slug: "fumes-in-the-cabin",
    meaning: "Unidentified vapours or smells in cabin or cockpit without visible smoke.",
    operational:
      "Often Pan Pan initially; crew investigates source, may use oxygen and divert.",
    when: "Oil fumes, electrical smell, or unknown odour during flight.",
    who: "Pilots report; ATC coordinates descent and priority if requested.",
    atc: [
      "ANAC 123, descend to one zero thousand, report fumes status.",
      "ANAC 123, turn right direct airport.",
      "ANAC 123, medical advice available on arrival.",
      "ANAC 123, say number of crew affected.",
      "ANAC 123, cleared priority approach.",
    ],
    pilot: [
      "PAN-PAN, strong fumes in the cockpit!",
      "We smell fumes in the cockpit.",
      "Pan Pan Pan, ANAC 123, fumes in the cabin, request descent.",
      "ANAC 123, fumes increasing, request immediate landing.",
      "ANAC 123, fumes dissipated, continuing with caution.",
    ],
    questions: [
      "How are fumes different from smoke in your report to ATC?",
      "What urgency call is appropriate for strong unknown fumes?",
      "What would you tell ATC if cabin crew report passengers smelling fumes?",
    ],
    brazilian: [
      "Saying smell bad instead of fumes or unknown odour.",
      "Underestimating fumes — oil fumes can incapacitate crew.",
      "Not mentioning cockpit versus cabin.",
    ],
    pronunciation: [
      "Fumes — FYOOMZ, one syllable.",
      "Cockpit — COCK-pit, not cockpit with silent t.",
      "Odour — OH-dur in ICAO English discussions.",
    ],
    captain: "Students material uses Pan Pan for strong fumes in cockpit — teach that fumes can be as dangerous as visible smoke.",
    memory: "FUMES — Find source if safe, Use O2, Monitor crew, Expedite if worsening, Say status to ATC.",
    related: ["Smoke in the Cabin", "Fire on Board", "Pilot Incapacitation", "Pan Pan Urgency Call"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary — fumes", "data/part2Vocabulary.ts"],
      ["SKYbrary — Fumes and Smoke", "https://skybrary.aero/articles/fumes"],
      ["FAA AIM", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0029",
    concept: "Emergency Landing",
    slug: "emergency-landing",
    meaning: "Landing made when aircraft safety or occupants are at serious risk.",
    operational:
      "Crew informs ATC of intention; ATC clears priority approach and alerts ground services.",
    when: "After Mayday or Pan Pan when continuing flight is unsafe and immediate landing is required.",
    who: "Pilots request; Tower/Approach clear runway and coordinate emergency services.",
    atc: [
      "ANAC 123, cleared straight-in approach runway one eight.",
      "ANAC 123, runway three six cleared to land, fire services alerted.",
      "ANAC 123, say intentions for landing.",
      "ANAC 123, longest runway available is runway two seven.",
      "ANAC 123, emergency services standing by.",
    ],
    pilot: [
      "Executing emergency landing!",
      "Performing emergency landing!",
      "We need an emergency landing at the nearest airport.",
      "Requesting the longest available runway for emergency landing.",
      "ANAC 123, one five miles final, emergency landing inbound.",
    ],
    questions: [
      "What would you request from ATC when you need an emergency landing?",
      "How is emergency landing different from precautionary landing?",
      "What runway information would you request for an overweight or damaged aircraft?",
    ],
    brazilian: [
      "Saying emergency landing without stating the underlying problem.",
      "Confusing emergency landing with go-around.",
      "Not requesting longest runway when gear status uncertain.",
    ],
    pronunciation: [
      "Emergency landing — e-MER-gen-cy LAN-ding.",
      "Nearest airport — NEAR-est.",
      "Longest available runway — speak slowly.",
    ],
    captain: "Pair emergency landing with the underlying event — fire, gear, engine — in the same transmission.",
    memory: "LAND SAFE — Locate airport, Announce emergency, Notify services, Descend, Secure approach, Approach brief, Final call, Evacuate if needed.",
    related: ["Mayday Distress Call", "Precautionary Landing", "Priority Landing", "Emergency Services"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary", "data/part2Vocabulary.ts"],
      ["SKYbrary — Emergency Landing", "https://skybrary.aero/articles/emergency-landing"],
      ["FAA AIM", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0030",
    concept: "Precautionary Landing",
    slug: "precautionary-landing",
    meaning: "Landing when a potential emergency exists but immediate danger is not yet confirmed.",
    operational:
      "Crew lands at a suitable airport to inspect a problem — less urgent than emergency landing.",
    when: "Doubtful gear indication, unusual smell, or vibration that requires ground inspection.",
    who: "Pilots inform ATC; ATC may assign holding or vectors without full emergency response.",
    atc: [
      "RESEARCH REQUIRED",
      "RESEARCH REQUIRED",
      "RESEARCH REQUIRED",
      "RESEARCH REQUIRED",
      "RESEARCH REQUIRED",
    ],
    pilot: [
      "RESEARCH REQUIRED",
      "RESEARCH REQUIRED",
      "RESEARCH REQUIRED",
      "RESEARCH REQUIRED",
      "RESEARCH REQUIRED",
    ],
    questions: [
      "What is the difference between precautionary and emergency landing?",
      "When would you choose a precautionary landing after a bird strike assessment?",
      "How would you inform ATC without declaring Mayday?",
    ],
    brazilian: [
      "Using emergency landing for every abnormal indication.",
      "Not knowing the precautionary landing concept in English.",
      "RESEARCH REQUIRED",
    ],
    pronunciation: [
      "Precautionary — pre-CAU-tion-ar-y, five syllables.",
      "RESEARCH REQUIRED",
      "RESEARCH REQUIRED",
    ],
    captain:
      "Concept not in Students material phraseology table — teach distinction from emergency landing using FAA/EASA definitions only until verified phrases are added.",
    memory: "When in doubt on the ground is safer than doubt in the air — but verify phraseology before exam use.",
    related: ["Emergency Landing", "Bird Strike", "Landing Gear Malfunction", "Pan Pan Urgency Call"],
    refs: [
      ["FAA Pilot/Controller Glossary — Precautionary Landing", FAA_PCG],
      ["FAA AIM — Emergency Procedures", FAA_AIM_EMERG],
      ["EASA Safety", EASA_SAFETY],
    ],
  },
  {
    id: "0031",
    concept: "Low Fuel",
    slug: "low-fuel",
    meaning: "Fuel quantity is below planned reserves or minimum required for destination plus reserve.",
    operational:
      "Pan Pan or priority request; crew states fuel remaining in time or quantity and need to land.",
    when: "Extended hold, diversion, or fuel leak reduces reserves below comfort level.",
    who: "Pilots declare urgency; ATC expedites approach and may clear other traffic.",
    atc: [
      "ANAC 123, exit hold now heading one three five. Expect vectors to intercept ILS two seven right.",
      "ANAC 123, confirm you need to land in five zero minutes.",
      "ANAC 123, cleared direct to the airport.",
      "ANAC 123, number one for landing.",
      "ANAC 123, say fuel remaining in hours.",
    ],
    pilot: [
      "PAN-PAN, low fuel state!",
      "Pan Pan Pan, London Control, ANAC 123, we are running low on fuel and need to land within one five minutes.",
      "We are low on fuel and need priority.",
      "NEGATIVE. I need to land in one five minutes. Exiting hold heading one three five, ANAC 123.",
      "ANAC 123, three zero minutes fuel remaining.",
    ],
    questions: [
      "How would you report low fuel during a holding pattern?",
      "What is the difference between low fuel and fuel starvation?",
      "How would you correct ATC if they misunderstand your landing time requirement?",
    ],
    brazilian: [
      "Saying no fuel instead of low fuel — low fuel means urgency, not empty tanks.",
      "Accepting hold extension when fuel is critical — 24C Heathrow tests NEGATIVE.",
      "Reporting fuel only in kilograms without time remaining.",
    ],
    pronunciation: [
      "Low fuel — LOW FYOO-el.",
      "One five minutes — digits, not fifteen minutes in casual speech.",
      "Fuel remaining — FUEL re-MAIN-ing.",
    ],
    captain: "24C Heathrow low fuel scenario is essential — Pan Pan, land in fifteen minutes, NEGATIVE to fifty minutes.",
    memory: "FUEL — Figure time remaining, Urgency level, Explain to ATC, Land soon.",
    related: ["Fuel Starvation", "Fuel Dumping", "Pan Pan Urgency Call", "Emergency Landing"],
    refs: [
      ["ICAO Delta Exam 24C Situation 1 — low fuel", "data/exams/part2Data.ts"],
      ["ICAO Delta Students material", "Students material.pdf"],
      ["SKYbrary — Fuel Emergencies", "https://skybrary.aero/articles/fuel-emergencies"],
      ["FAA AIM", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0032",
    concept: "Fuel Starvation",
    slug: "fuel-starvation",
    meaning: "Engines starved of fuel despite fuel possibly remaining in tanks — delivery failure.",
    operational:
      "Mayday situation if both engines affected; crew attempts fuel system checklist and declares intentions.",
    when: "Fuel selector error, crossfeed issue, or blockage with fuel quantity showing on gauges.",
    who: "Pilots declare Mayday; ATC provides vectors to nearest airport.",
    atc: [
      "ANAC 123, descend immediately, vectors to the field.",
      "ANAC 123, runway cleared to land any runway.",
      "ANAC 123, say souls on board.",
      "ANAC 123, all traffic cleared from your approach path.",
      "ANAC 123, fire services on standby.",
    ],
    pilot: [
      "MAYDAY, fuel starvation imminent!",
      "We suspect fuel starvation on engine two.",
      "Mayday Mayday Mayday, ANAC 123, fuel starvation, both engines fluctuating.",
      "ANAC 123, engine one relit after fuel selector change.",
      "ANAC 123, single engine, continuing to nearest airport.",
    ],
    questions: [
      "How is fuel starvation different from low fuel?",
      "What would you tell ATC if gauges show fuel but engines are starving?",
      "When would fuel starvation require Mayday?",
    ],
    brazilian: [
      "Confusing fuel starvation with low fuel.",
      "Not attempting fuel system checklist before declaring.",
      "Saying no fuel when starvation is the technical issue.",
    ],
    pronunciation: [
      "Fuel starvation — star-VA-tion, four syllables.",
      "Imminent — IM-i-nent.",
      "Selector — SE-lec-tor.",
    ],
    captain: "Teach technical precision — starvation means fuel on board but not reaching engines.",
    memory: "STARVE — Selector check, Tell ATC Mayday if needed, Assess gauges, Remain calm, Verify crossfeed, Expedite landing.",
    related: ["Low Fuel", "Engine Failure", "Mayday Distress Call", "Emergency Landing"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary", "data/part2Vocabulary.ts"],
      ["SKYbrary — Fuel Emergencies", "https://skybrary.aero/articles/fuel-emergencies"],
      ["FAA AIM", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0033",
    concept: "Fuel Dumping",
    slug: "fuel-dumping",
    meaning: "Intentional release of fuel to reduce landing weight.",
    operational:
      "Crew requests dumping area and altitude; ATC separates traffic and clears block altitude.",
    when: "Overweight landing after emergency takeoff or return shortly after departure with full tanks.",
    who: "Pilots request; ATC assigns area, altitude, and notifies other aircraft.",
    atc: [
      "ANAC 123, cleared to dump fuel between flight level one zero zero and flight level one five zero.",
      "ANAC 123, report fuel dumping complete.",
      "ANAC 123, traffic cleared from your area.",
      "ANAC 123, descend when able after dump complete.",
      "ANAC 123, runway cleared to land when ready.",
    ],
    pilot: [
      "MAYDAY, requesting fuel dump!",
      "Requesting fuel dumping area!",
      "We need to dump fuel before returning.",
      "ANAC 123, fuel dumping complete, request descent.",
      "Pan Pan Pan, ANAC 123, need to dump fuel before overweight landing.",
    ],
    questions: [
      "Why would a crew dump fuel before returning to the departure airport?",
      "What would you request from ATC before starting fuel dump?",
      "How would you report when fuel dumping is complete?",
    ],
    brazilian: [
      "Not informing ATC before dumping — ATC must clear traffic.",
      "Saying throw fuel instead of dump fuel.",
      "Forgetting to report dump complete before descent.",
    ],
    pronunciation: [
      "Fuel dumping — DUMP-ing.",
      "Overweight — O-ver-weight.",
      "Dump complete — clear two-word report.",
    ],
    captain: "23C Bogota cabin pressure scenario includes hold to burn fuel — related concept, different procedure from jettison valves on jets.",
    memory: "DUMP — Declare need, Use assigned area, Monitor weight, Proceed to land, Complete call to ATC.",
    related: ["Low Fuel", "Emergency Landing", "Cabin Depressurization", "Mayday Distress Call"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Exam 23C Situation 3 — burn fuel hold", "data/exams/part2Data.ts"],
      ["SKYbrary — Fuel Dumping", "https://skybrary.aero/articles/fuel-dumping"],
      ["FAA AIM", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0034",
    concept: "Hydraulic Failure",
    slug: "hydraulic-failure",
    meaning: "Loss of hydraulic system pressure or fluid affecting flight controls or landing gear.",
    operational:
      "Pan Pan common; crew may need alternate gear extension and higher approach speed.",
    when: "Leak, pump failure, or loss of one or more hydraulic systems.",
    who: "Pilots report; ATC assigns lower altitude, speed control, and priority approach.",
    atc: [
      "ANAC 123, descend to two thousand feet and say your indicated airspeed.",
      "ANAC 123, do you have a problem with your autopilot? Confirm.",
      "ANAC 123, cleared direct approach runway three zero left.",
      "ANAC 123, emergency services standing by.",
      "ANAC 123, say souls on board and fuel remaining.",
    ],
    pilot: [
      "MAYDAY, N890WX hydraulic fluid leak!",
      "PAN-PAN, N123YZ hydraulic pressure decreasing!",
      "Pan Pan Pan, Dubai Approach, ANAC 123, we have lost our left hydraulic system.",
      "NEGATIVE. We had hydraulic failure. Descending to two thousand feet. Speed one two zero knots, ANAC 123.",
      "Recife Approach, ANAC 123, we would like to divert to Salvador due to a hydraulic leak.",
    ],
    questions: [
      "What would you report if hydraulic failure affects landing gear extension?",
      "How would you correct ATC if they assume autopilot problem instead of hydraulic?",
      "When is hydraulic failure Pan Pan versus Mayday?",
    ],
    brazilian: [
      "Saying hydraulic problem without specifying leak or pressure loss.",
      "Accepting ATC assumption about autopilot without correction — 26C Dubai tests NEGATIVE.",
      "Not stating approach speed if unable to fly normal profile.",
    ],
    pronunciation: [
      "Hydraulic — hy-DRAW-lic.",
      "Pressure decreasing — digit-by-digit if quoting values.",
      "Indicated airspeed — IN-di-cated AIR-speed.",
    ],
    captain: "26C Dubai hydraulic scenario is the teaching anchor — Pan Pan, gear extension, NEGATIVE to autopilot assumption.",
    memory: "HYDRAULIC — How many systems, Yield status, Declare Pan/Mayday, Approach speed, ULtimate gear plan, Inform ATC, Checklist.",
    related: ["Landing Gear Malfunction", "Emergency Landing", "Pan Pan Urgency Call", "Divert to Alternate"],
    refs: [
      ["ICAO Delta Exam 26C Situation 1 — hydraulic", "data/exams/part2Data.ts"],
      ["ICAO Delta Students material", "Students material.pdf"],
      ["SKYbrary — Hydraulic Problems", "https://skybrary.aero/articles/hydraulic-problems"],
      ["FAA AIM", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0035",
    concept: "Electrical Failure",
    slug: "electrical-failure",
    meaning: "Loss of electrical power generation or distribution — partial or total.",
    operational:
      "Mayday if on battery only; crew sheds load, may lose radios or transponder partially.",
    when: "Generator failure, alternator failure, or smoke from electrical source.",
    who: "Pilots declare; ATC may lose radar contact or radio — squawk 7600 procedures apply if comm lost.",
    atc: [
      "ANAC 123, squawk seven six zero zero if radio unreliable.",
      "ANAC 123, descend to flight level one zero zero.",
      "ANAC 123, say equipment operational.",
      "ANAC 123, vectors to the nearest airport.",
      "ANAC 123, runway cleared to land, wind calm.",
    ],
    pilot: [
      "MAYDAY, N456AB total electrical failure!",
      "N789CD switching to battery power!",
      "Pan Pan Pan, ANAC 123, total electrical failure, partial panel.",
      "ANAC 123, on battery power only, request vectors.",
      "Assessing electrical system.",
    ],
    questions: [
      "What would you tell ATC if you are on battery power only?",
      "How does total electrical failure affect your radio call?",
      "What transponder code applies if radio fails after electrical failure?",
    ],
    brazilian: [
      "Confusing electrical failure with GPS or FMS failure.",
      "Not mentioning partial panel capabilities.",
      "Forgetting squawk 7600 if comm unreliable.",
    ],
    pronunciation: [
      "Electrical — e-LEC-tri-cal.",
      "Battery power — BAT-te-ry POW-er.",
      "Partial panel — PAR-tial PAN-el.",
    ],
    captain: "Students material has total electrical failure as Mayday and battery power as follow-up report.",
    memory: "ELECTRICS — Essential buses, Load shed, Communicate, Transponder, Radios check, Instruments, Call Mayday if needed, Stay VFR if possible.",
    related: ["GPS Inoperative", "Radio Failure", "Smoke in the Cabin", "Mayday Distress Call"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary", "data/part2Vocabulary.ts"],
      ["SKYbrary — Electrical Problems", "https://skybrary.aero/articles/electrical-problems"],
      ["FAA AIM — Communication Failure", "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap6_section_2.html"],
    ],
  },
  {
    id: "0036",
    concept: "GPS Inoperative",
    slug: "gps-inoperative",
    meaning: "GPS navigation is unavailable or unreliable.",
    operational:
      "Pilot reports to ATC; may request conventional navigation, vectors, or VOR routing.",
    when: "RAIM loss, antenna failure, or interference after departure on RNAV procedure.",
    who: "Pilots inform Tower or Approach; ATC clears non-RNAV routing or vectors.",
    atc: [
      "ANAC 123, confirm you are experiencing problems with your GPS system and say again your intention.",
      "ANAC 123, cleared direct FLL VORTAC, climb and maintain five thousand.",
      "ANAC 123, expect vectors for ILS approach.",
      "ANAC 123, resume own navigation when able.",
      "ANAC 123, roger GPS inoperative.",
    ],
    pilot: [
      "N890IJ GPS navigation lost!",
      "Miami Tower, ANAC 123, we have lost our GPS. We would like to continue using conventional navigation.",
      "AFFIRM. We have lost our GPS. We would like to continue using conventional navigation, ANAC 123.",
      "Our GPS is inoperative, request radar vectors.",
      "ANAC 123, GPS restored, proceeding RNAV.",
    ],
    questions: [
      "What would you tell Tower after losing GPS on an RNAV departure?",
      "How would you respond when ATC asks you to confirm GPS problems?",
      "What navigation method would you request if GPS fails in IMC?",
    ],
    brazilian: [
      "Saying GPS broken instead of GPS inoperative.",
      "Continuing RNAV approach without confirming GPS available.",
      "Not stating intention — conventional nav or vectors.",
    ],
    pronunciation: [
      "GPS — G-P-S, each letter.",
      "Inoperative — in-OP-er-a-tive.",
      "Conventional navigation — clear three-word phrase.",
    ],
    captain: "23C Situation 5 Miami GPS failure — AFFIRM follow-up is classic ICAO Delta pattern.",
    memory: "GPS lost — Go conventional, Position report, State intentions to ATC.",
    related: ["Resume Own Navigation", "Radar Vectors", "FMS Failure", "Electronic Navigation Failure"],
    refs: [
      ["ICAO Delta Exam 23C Situation 5 — GPS failure", "data/exams/part2Data.ts"],
      ["ICAO Delta Students material", "Students material.pdf"],
      ["FAA AIM — GPS Operations", "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap1_section_1.html"],
      ["SKYbrary — GNSS", "https://skybrary.aero/articles/global-navigation-satellite-system-gnss"],
    ],
  },
  {
    id: "0037",
    concept: "Landing Gear Malfunction",
    slug: "landing-gear-malfunction",
    meaning: "Landing gear does not extend, retract, or indicate safe — unsafe gear condition.",
    operational:
      "Crew holds, runs checklist, may request burn fuel or emergency gear extension before approach.",
    when: "Gear stuck after takeoff, unsafe indication, or hydraulic failure affecting gear.",
    who: "Pilots report to Departure or Approach; ATC assigns hold, vectors, and alerts fire services.",
    atc: [
      "ANAC 123, roger. I copied you have a problem with your gear and are requesting to hold to check out your problem. Confirm?",
      "ANAC 123, hold east of Oakland, expect approach in two zero minutes.",
      "ANAC 123, say souls on board and fuel remaining.",
      "ANAC 123, emergency services standing by.",
      "ANAC 123, cleared to land runway two seven, gear appears down.",
    ],
    pilot: [
      "PAN-PAN, N234QR landing gear unsafe!",
      "NorCal Departure, ANAC 123, my main landing gear does not retract properly. Request to hold in order to try to solve the problem.",
      "AFFIRM, ANAC 123.",
      "Tower, N789OP main gear stuck!",
      "Unfortunately we cannot extend the landing gear.",
    ],
    questions: [
      "What would you tell Departure if gear does not retract after takeoff?",
      "How would you respond when ATC asks you to confirm gear problem and hold request?",
      "What would you request before attempting an overweight landing with gear uncertainty?",
    ],
    brazilian: [
      "Vague gear problem instead of landing gear does not retract or unsafe indication.",
      "Saying affirm when ATC summary is wrong — read carefully.",
      "Not requesting hold time to run checklist.",
    ],
    pronunciation: [
      "Landing gear — two words, LAN-ding GEAR.",
      "Does not retract — clear verb phrase.",
      "Unsafe indication — un-SAFE in-di-CA-tion.",
    ],
    captain: "23C Situation 1 Oakland gear — hold request and AFFIRM confirmation is the exam gold standard.",
    memory: "GEAR — Gear status, Explain to ATC, Attempt checklist, Announce if manual extension needed, Request services.",
    related: ["Hydraulic Failure", "Emergency Landing", "Hold", "Wheels-Up Landing"],
    refs: [
      ["ICAO Delta Exam 23C Situation 1 — gear malfunction", "data/exams/part2Data.ts"],
      ["ICAO Delta Students material", "Students material.pdf"],
      ["SKYbrary — Landing Gear Problems", "https://skybrary.aero/articles/landing-gear-problems"],
      ["FAA AIM", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0038",
    concept: "Cabin Depressurization",
    slug: "cabin-depressurization",
    meaning: "Loss of cabin pressure requiring emergency descent and oxygen use.",
    operational:
      "Mayday or Pan Pan; crew dons masks, descends to ten thousand feet or MEA, diverts.",
    when: "Pressurization failure, door seal leak, or sudden explosive decompression.",
    who: "Pilots declare; ATC clears descent and priority routing.",
    atc: [
      "ANAC 123, squawk seven seven zero zero. Descend to one five thousand feet and fly direct to Bogota VOR.",
      "ANAC 123, expect to land in ten minutes.",
      "ANAC 123, traffic cleared from your descent path.",
      "ANAC 123, say souls on board.",
      "ANAC 123, emergency descent approved.",
    ],
    pilot: [
      "MAYDAY, rapid decompression!",
      "PAN-PAN, sudden decompression!",
      "Pan Pan Pan, Bogota Approach, ANAC 123, we are losing cabin pressure. We need to return to Bogota. Request a two zero-minute hold to burn some fuel before landing.",
      "NEGATIVE. I need to hold for two zero minutes before landing in order to burn some fuel. Squawk seven seven zero zero, ANAC 123.",
      "Requesting lower altitude, pressurization issue!",
    ],
    questions: [
      "What would you tell ATC during cabin pressure loss on departure?",
      "How would you respond if ATC expects immediate landing but you need to burn fuel?",
      "When is cabin depressurization Mayday versus Pan Pan?",
    ],
    brazilian: [
      "Not donning oxygen before long radio call.",
      "Saying depressurization without requesting descent.",
      "Accepting immediate landing clearance when overweight — 23C Bogota NEGATIVE.",
    ],
    pronunciation: [
      "Depressurization — de-PRES-sur-i-ZA-tion.",
      "Rapid decompression — RAP-id.",
      "Cabin pressure — CAB-in PRES-sure.",
    ],
    captain: "23C Bogota is the master scenario — Pan Pan, return, hold to burn fuel, NEGATIVE to immediate landing.",
    memory: "MASKS ON FIRST — then Mayday/Pan Pan, Emergency descent, State souls on board, Keep ATC updated.",
    related: ["Fuel Dumping", "Emergency Landing", "Squawk 7700", "Pan Pan Urgency Call"],
    refs: [
      ["ICAO Delta Exam 23C Situation 3 — cabin pressure", "data/exams/part2Data.ts"],
      ["ICAO Delta Students material", "Students material.pdf"],
      ["SKYbrary — Loss of Cabin Pressurization", "https://skybrary.aero/articles/loss-cabin-pressurization"],
      ["FAA AIM", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0039",
    concept: "Pilot Incapacitation",
    slug: "pilot-incapacitation",
    meaning: "A pilot cannot continue flight duties due to medical or physical incapacity.",
    operational:
      "Surviving pilot flies, declares Pan Pan or Mayday, requests vectors and priority landing.",
    when: "Heart attack, sudden illness, hypoxia, or incapacitation without warning in cockpit.",
    who: "Remaining pilot declares; ATC provides assistance and may coordinate with cabin crew reports.",
    atc: [
      "ANAC 123, vectors to the nearest airport, descend pilot's discretion.",
      "ANAC 123, say souls on board and if you need assistance on arrival.",
      "ANAC 123, cleared priority approach.",
      "ANAC 123, medical assistance standing by.",
      "ANAC 123, say who is flying the aircraft.",
    ],
    pilot: [
      "MAYDAY, captain incapacitated, FO assuming control",
      "Declaring emergency, pilot medical emergency",
      "Departure, ANAC 123, Pan Pan Pan, pilot incapacitation in the cockpit, requesting priority to land.",
      "ANAC 123, single-pilot operation, request vectors ILS.",
      "ANAC 123, captain conscious again, continuing with caution.",
    ],
    questions: [
      "What would you tell ATC if the captain becomes incapacitated during cruise?",
      "Who should communicate with ATC — PM or PF — during pilot incapacitation?",
      "What assistance would you request on arrival?",
    ],
    brazilian: [
      "Long explanation before declaring Pan Pan — state incapacitation and request first.",
      "Not stating who has control of the aircraft.",
      "Forgetting to request medical assistance on arrival.",
    ],
    pronunciation: [
      "Incapacitation — in-ca-pa-ci-TA-tion.",
      "Assuming control — a-SU-ming con-TROL.",
      "Medical assistance — MED-i-cal as-SIS-tance.",
    ],
    captain: "Students material and icaoVocabulary use Pan Pan for pilot incapacitation — less urgency than fire but still priority.",
    memory: "AVIATE first — then Pan Pan, Identify who flies, Notify ATC, Coordinate cabin, Assist sick pilot after stable.",
    related: ["Mayday Distress Call", "Pan Pan Urgency Call", "Medical Emergency on Board", "Emergency Landing"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta icaoVocabulary", "data/icaoVocabulary.ts"],
      ["SKYbrary — Pilot Incapacitation", "https://skybrary.aero/articles/pilot-incapacitation"],
      ["FAA AIM", FAA_AIM_EMERG],
    ],
  },
  {
    id: "0040",
    concept: "Mayday Distress Call",
    slug: "mayday-distress-call",
    meaning: "International distress signal — grave and imminent danger requiring immediate assistance.",
    operational:
      "Spoken three times at start of call; all stations cease non-urgent traffic; ATC provides maximum assistance.",
    when: "Fire, uncontrollable aircraft, engine failure on single-engine, or any immediate danger to life.",
    who: "Pilot in command declares; any ATC facility responds and coordinates.",
    atc: [
      "ANAC 123, roger Mayday, all traffic cleared from your route.",
      "ANAC 123, descend at your discretion, squawk seven seven zero zero.",
      "ANAC 123, say nature of emergency and intentions.",
      "ANAC 123, nearest airport bearing zero nine zero, one five miles.",
      "ANAC 123, emergency services alerted.",
    ],
    pilot: [
      "MAYDAY MAYDAY MAYDAY!",
      "Mayday Mayday Mayday, ANAC 123, fire on board.",
      "Mayday Mayday Mayday, Manaus Approach, ANAC 123. Fire in the cabin. Request return to Manaus.",
      "Mayday Mayday Mayday, ANAC 123, we have an engine failure and request immediate return.",
      "Mayday Mayday Mayday, Approach, ANAC 123, smoke in the cockpit. Request immediate vectors to land on the nearest runway.",
    ],
    questions: [
      "When should you use Mayday instead of Pan Pan?",
      "What three pieces of information follow Mayday in the distress call?",
      "How many times must you say Mayday at the start of the call?",
    ],
    brazilian: [
      "Using Mayday for every abnormal situation — reserve for distress.",
      "Saying Mayday only once.",
      "Using SOS or help instead of Mayday on aviation frequency.",
    ],
    pronunciation: [
      "MAYDAY — French m'aider; say MAY-DAY, three times.",
      "Pause after third Mayday before facility name.",
      "Do not slur into MaydayMaydayMayday.",
    ],
    captain: "Teach Mayday vs Pan Pan every lesson. Mayday = distress; Pan Pan = urgency. Three times, then callsign, then nature and intentions.",
    memory: "THREE — Three Maydays, Then callsign, Help me state nature, Intentions, Rescue services.",
    related: ["Pan Pan Urgency Call", "Emergency Landing", "Distress Call", "Squawk 7700"],
    refs: [
      ["ICAO Delta Students material — distress call", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary — MAYDAY", "data/part2Vocabulary.ts"],
      ["SKYbrary — Emergency Communications", "https://skybrary.aero/articles/emergency-communications"],
      ["ICAO Doc 4444 — Radiotelephony", ICAO_DOC4444],
      ["FAA AIM — Emergency Procedures", FAA_AIM_EMERG],
    ],
  },
];

function render(c) {
  const atc = c.atc.map((x) => `- ${x}`).join("\n");
  const pilot = c.pilot.map((x) => `- ${x}`).join("\n");
  const questions = c.questions.map((x) => `- ${x}`).join("\n");
  const brazilian = c.brazilian.map((x) => `- ${x}`).join("\n");
  const pronunciation = c.pronunciation.map((x) => `- ${x}`).join("\n");
  const related = c.related.map((x) => `- ${x}`).join("\n");
  const refs = c.refs
    .map(([title, url]) => (url.startsWith("http") ? `- [${title}](${url})` : `- ${title} (\`${url}\`)`))
    .join("\n");

  return `# ${c.concept}

**Catalog ID:** ${c.id}  
**Category:** ${CATEGORIES[c.id]}  
**Draft:** Premium batch-01 — working document (not consumed by Captain)

## Meaning

${c.meaning}

## Operational Meaning

${c.operational}

## When Used

${c.when}

## Who Uses It

${c.who}

## Real ATC Phraseology

${atc}

## Real Pilot Readbacks

${pilot}

## Common ICAO Speaking Questions

${questions}

## Common Brazilian Mistakes

${brazilian}

## Pronunciation Coaching

${pronunciation}

## Captain Teaching Notes

${c.captain}

## Memory Trick

${c.memory}

## Related Concepts

${related}

## References

${refs}
`;
}

mkdirSync(OUT, { recursive: true });
for (const c of CONCEPTS) {
  writeFileSync(path.join(OUT, `${c.slug}.md`), render(c), "utf8");
}
writeFileSync(
  path.join(OUT, "manifest.json"),
  JSON.stringify(
    {
      batch: "batch-01-emergencies",
      generatedAt: new Date().toISOString().slice(0, 10),
      conceptCount: CONCEPTS.length,
      concepts: CONCEPTS.map((c) => ({ id: c.id, concept: c.concept, slug: c.slug })),
    },
    null,
    2,
  ),
);
console.log(`Generated ${CONCEPTS.length} premium drafts in ${OUT}`);
