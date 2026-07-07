#!/usr/bin/env node
/** Premium batch-03 weather & operations — trusted refs only (ICAO, FAA, SKYbrary, EASA) */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "knowledge/drafts/batch-03");

const FAA_AIM_WX = "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap7_section_1.html";
const FAA_AIM_RWY = "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap4_section_3.html";
const FAA_AIM_APP = "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap5_section_4.html";
const FAA_AIM_EMERG = "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap6_section_1.html";
const FAA_AIM_UAS = "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap11_section_1.html";
const FAA_PCG = "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/glossary.html";
const ICAO_DOC4444 = "https://www.icao.int/safety/airnavigation/pages/doc4444.aspx";
const ICAO_RUNWAY_SAFETY = "https://www.icao.int/safety/runwaysafety/pages/default.aspx";
const EASA_SAFETY = "https://www.easa.europa.eu/en/domains/safety";
const SKYBRARY_WX = "https://skybrary.aero/articles/weather";

const CATEGORIES = {
  "0041": "Weather",
  "0042": "Weather",
  "0043": "Weather",
  "0044": "Weather",
  "0045": "Weather",
  "0046": "Weather",
  "0047": "Weather",
  "0048": "Weather",
  "0049": "Weather",
  "0050": "Airport Operations",
  "0051": "Airport Operations",
  "0052": "Airport Operations",
  "0053": "Airport Operations",
  "0054": "Ground Operations",
  "0055": "Airport Operations",
  "0056": "Airport Operations",
  "0057": "Airspace",
  "0058": "Approach",
  "0059": "Approach",
  "0060": "Approach",
};

const CONCEPTS = [
  {
    id: "0041",
    concept: "Windshear on Final",
    slug: "windshear-on-final",
    meaning: "Sudden change in wind speed or direction encountered on final approach.",
    operational:
      "Immediate crew action — add power, go around if needed, and report to ATC so following traffic is warned.",
    when: "Final approach below 1,000 feet AGL when micro-scale wind shifts affect airspeed and glide path.",
    who: "Pilots report to Tower; ATC may issue windshear alerts and ask for pilot reports.",
    atc: [
      "ANAC 123, windshear alert, runway two seven.",
      "ANAC 123, report airspeed fluctuations on final.",
      "ANAC 123, go around if unable to continue approach.",
      "ANAC 123, previous aircraft reported windshear on short final.",
      "ANAC 123, cleared to land runway two seven, wind two four zero at one zero.",
    ],
    pilot: [
      "Windshear alert on final!",
      "We encountered windshear on final approach.",
      "Tower, ANAC 123, windshear on short final, going around.",
      "ANAC 123, airspeed fluctuating, executing go-around.",
      "ANAC 123, windshear passed, continuing approach.",
    ],
    questions: [
      "What would you tell Tower immediately after encountering windshear on final?",
      "When would windshear require a go-around instead of continuing the approach?",
      "How would you report airspeed fluctuations caused by windshear?",
    ],
    brazilian: [
      "Saying wind change instead of windshear — use standard term.",
      "Not reporting windshear to ATC — following traffic needs the alert.",
      "Continuing approach without adding power after windshear warning.",
    ],
    pronunciation: [
      "Windshear — WIND-shear, two words.",
      "Final — FY-nal, stress first syllable.",
      "Fluctuating — FLUC-tu-a-ting.",
    ],
    captain:
      "Students material uses Windshear alert on final! — teach immediate power and go-around decision before lengthy explanation.",
    memory: "SHEAR — Slow/add power, Hold altitude, Explain to ATC, Assess go-around, Report for next aircraft.",
    related: ["Microburst on Final", "Go Around", "Severe Turbulence", "Continue Approach"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary — windshear", "data/part2Vocabulary.ts"],
      ["ICAO Delta vocabulary — windshear", "data/icaoVocabulary.ts"],
      ["SKYbrary — Windshear", "https://skybrary.aero/articles/windshear"],
      ["FAA AIM — Weather", FAA_AIM_WX],
    ],
  },
  {
    id: "0042",
    concept: "Microburst on Final",
    slug: "microburst-on-final",
    meaning: "Intense localized downdraft near the ground, often associated with thunderstorms.",
    operational:
      "Mayday-level encounter on final; crew executes escape maneuver and reports immediately.",
    when: "Approach under convective weather when strong downdraft pushes aircraft below glide path.",
    who: "Pilots declare to Tower; ATC halts departures and arrivals on affected runway.",
    atc: [
      "ANAC 123, go around immediately, fly runway heading.",
      "ANAC 123, all departures hold, microburst reported on final.",
      "ANAC 123, say altitude and intentions.",
      "ANAC 123, turn left heading two seven zero, vectors for another approach.",
      "ANAC 123, previous aircraft reported microburst encounter on runway one eight.",
    ],
    pilot: [
      "MAYDAY, microburst encounter!",
      "We experienced a microburst on approach.",
      "Tower, ANAC 123, microburst on final, going around.",
      "ANAC 123, lost five hundred feet, recovering.",
      "ANAC 123, clear of microburst, request vectors.",
    ],
    questions: [
      "Why is a microburst on final often declared as Mayday?",
      "What escape maneuver would you describe to ATC after a microburst?",
      "How is microburst different from windshear in your report?",
    ],
    brazilian: [
      "Confusing microburst with general turbulence.",
      "Not declaring urgency — microburst can be unrecoverable if not acted on immediately.",
      "Saying micro explosion — use microburst.",
    ],
    pronunciation: [
      "Microburst — MY-cro-burst.",
      "Encounter — en-COUN-ter.",
      "Downdraft — DOWN-draft.",
    ],
    captain:
      "Students material uses MAYDAY, microburst encounter! — pair with windshear training but stress greater severity.",
    memory: "BURST — Build power, Urgent Mayday, Recover altitude, Say position, Turn away from storm.",
    related: ["Windshear on Final", "Thunderstorm Avoidance", "Go Around", "Mayday Distress Call"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta vocabulary — microburst", "data/icaoVocabulary.ts"],
      ["SKYbrary — Microburst", "https://skybrary.aero/articles/microburst"],
      ["FAA AIM — Weather", FAA_AIM_WX],
    ],
  },
  {
    id: "0043",
    concept: "Severe Turbulence",
    slug: "severe-turbulence",
    meaning: "Strong turbulence that may cause large abrupt changes in altitude or attitude.",
    operational:
      "Mayday when occupants injured or aircraft control is affected; ATC needs PIREP for traffic separation.",
    when: "Clear air turbulence, thunderstorm proximity, or mountain wave causing violent aircraft movement.",
    who: "Pilots report to ATC; ATC issues urgent PIREPs and may reroute traffic.",
    atc: [
      "ANAC 123, urgent PIREP, severe turbulence.",
      "ANAC 123, descend to flight level three three zero, report when clear of turbulence.",
      "ANAC 123, turn thirty degrees left for smoother ride.",
      "ANAC 123, say number of injuries.",
      "ANAC 123, medical assistance available on arrival.",
    ],
    pilot: [
      "MAYDAY, severe turbulence!",
      "We are in severe turbulence, passengers injured.",
      "Center, ANAC 123, severe turbulence at flight level three five zero.",
      "ANAC 123, unable to maintain altitude in severe turbulence.",
      "ANAC 123, clear of severe turbulence, maintaining flight level three three zero.",
    ],
    questions: [
      "When would severe turbulence justify Mayday?",
      "How would you give a PIREP for severe turbulence?",
      "What would you tell ATC if passengers are injured during turbulence?",
    ],
    brazilian: [
      "Saying strong turbulence instead of severe turbulence.",
      "Not securing cabin before reporting — aviate first.",
      "Under-reporting injuries to ATC.",
    ],
    pronunciation: [
      "Severe — se-VERE.",
      "Turbulence — TUR-bu-lence.",
      "Injured — IN-jured.",
    ],
    captain:
      "Students material uses MAYDAY, severe turbulence! — teach PIREP format and when injuries escalate to Mayday.",
    memory: "TURB — Tell ATC severity, Unbelted secured, Report injuries, Best altitude/speed.",
    related: ["Moderate Turbulence", "Weather Deviation", "Mayday Distress Call", "Passenger Injuries"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary — severe turbulence", "data/part2Vocabulary.ts"],
      ["SKYbrary — Turbulence", "https://skybrary.aero/articles/turbulence"],
      ["FAA AIM — Weather", FAA_AIM_WX],
    ],
  },
  {
    id: "0044",
    concept: "Moderate Turbulence",
    slug: "moderate-turbulence",
    meaning: "Noticeable turbulence with changes in altitude or attitude, but aircraft remains in control.",
    operational:
      "Routine PIREP; crew adjusts speed and notifies ATC; usually no emergency declaration.",
    when: "Jet streams, building cumulus, or reported PIREPs from traffic ahead.",
    who: "Pilots report; ATC passes PIREPs to following aircraft.",
    atc: [
      "ANAC 123, PIREP, moderate turbulence at flight level three two zero.",
      "ANAC 123, expect moderate turbulence for the next two zero miles.",
      "ANAC 123, report when clear of turbulence.",
      "ANAC 123, turn right heading zero nine zero for smoother ride.",
      "ANAC 123, roger moderate turbulence report.",
    ],
    pilot: [
      "Experiencing moderate turbulence!",
      "We expect moderate turbulence ahead.",
      "ANAC 123, moderate turbulence at flight level three two zero.",
      "ANAC 123, because of severe turbulence we slowed down.",
      "ANAC 123, clear of moderate turbulence.",
    ],
    questions: [
      "How would you report moderate turbulence without declaring an emergency?",
      "What is the difference between moderate and severe turbulence in your PIREP?",
      "When would you request a different altitude because of turbulence?",
    ],
    brazilian: [
      "Declaring Mayday for moderate turbulence — reserve Mayday for severe.",
      "Saying a little turbulence instead of moderate.",
      "Not giving altitude in PIREP.",
    ],
    pronunciation: [
      "Moderate — MOD-er-ate.",
      "Experiencing — ex-PEER-ee-en-sing.",
      "PIREP — PIE-rep, pilot report.",
    ],
    captain:
      "Students material uses Experiencing moderate turbulence! — contrast clearly with Mayday-level severe.",
    memory: "MOD — Mention altitude, Observe seatbelt sign, Describe intensity, Done when clear.",
    related: ["Severe Turbulence", "Weather Deviation", "Expect Turbulence", "Maintain Altitude"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary — moderate turbulence", "data/part2Vocabulary.ts"],
      ["SKYbrary — Turbulence", "https://skybrary.aero/articles/turbulence"],
      ["FAA AIM — Weather", FAA_AIM_WX],
    ],
  },
  {
    id: "0045",
    concept: "Thunderstorm Avoidance",
    slug: "thunderstorm-avoidance",
    meaning: "Deliberate route or altitude change to stay clear of convective weather.",
    operational:
      "Crew requests deviation before entering cells; ATC clears offset or alternate routing.",
    when: "En route or approach when radar, visual, or METAR shows thunderstorm activity on path.",
    who: "Pilots request deviation; Center/Approach clears weather avoidance routing.",
    atc: [
      "N456NO cleared to deviate left for weather avoidance.",
      "ANAC 123, when able, proceed direct to the next waypoint.",
      "ANAC 123, deviation approved, report clear of weather.",
      "ANAC 123, unable deviation right, turn left heading two seven zero.",
      "ANAC 123, thunderstorm activity west of the field.",
    ],
    pilot: [
      "PAN-PAN, severe thunderstorm!",
      "PAN-PAN, deviating for weather.",
      "Confirming reroute for weather.",
      "N456NO cleared to deviate left for weather avoidance.",
      "ANAC 123, request deviation left of course for thunderstorm avoidance.",
    ],
    questions: [
      "How would you request a weather deviation before entering a thunderstorm?",
      "What would you say to confirm ATC approved your deviation?",
      "When would thunderstorm avoidance require Pan Pan?",
    ],
    brazilian: [
      "Entering cells without asking ATC — deviation needs clearance when in controlled airspace.",
      "Saying storm instead of thunderstorm in formal report.",
      "Not confirming when back on assigned route.",
    ],
    pronunciation: [
      "Thunderstorm — THUN-der-storm.",
      "Deviation — dee-vee-AY-shun.",
      "Avoidance — a-VOID-ance.",
    ],
    captain:
      "Combine cleared to deviate and PAN-PAN, deviating for weather — teach request, clearance, and confirm back on route.",
    memory: "STORM — See cells early, Tell ATC, Obtain clearance, Route around, Monitor METAR/radar.",
    related: ["Weather Deviation", "Thunderstorm", "Microburst on Final", "Divert to Alternate"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary — thunderstorm", "data/part2Vocabulary.ts"],
      ["SKYbrary — Thunderstorm", "https://skybrary.aero/articles/thunderstorm"],
      ["FAA AIM — Weather", FAA_AIM_WX],
    ],
  },
  {
    id: "0046",
    concept: "Icing Conditions",
    slug: "icing-conditions",
    meaning: "Atmospheric conditions where ice accumulates on aircraft surfaces.",
    operational:
      "Pan Pan when severe; crew requests altitude change, anti-ice on, and diversion if accumulation continues.",
    when: "Flight in visible moisture between zero and minus twenty degrees Celsius.",
    who: "Pilots report; ATC offers different altitude or routing out of icing.",
    atc: [
      "ANAC 123, descend to flight level one eight zero, report icing intensity.",
      "ANAC 123, turn left heading three six zero, vectors clear of icing.",
      "ANAC 123, PIREP received, moderate icing between flight level one two zero and one six zero.",
      "ANAC 123, say equipment operational.",
      "ANAC 123, cleared to divert to alternate.",
    ],
    pilot: [
      "PAN-PAN, severe icing!",
      "We are entering icing conditions.",
      "We are experiencing icing conditions at this altitude.",
      "We are picking up icing at this altitude.",
      "ANAC 123, request lower altitude, moderate icing.",
    ],
    questions: [
      "What would you report when entering icing conditions?",
      "When does icing justify Pan Pan?",
      "How would you request a different altitude because of icing?",
    ],
    brazilian: [
      "Saying ice on wings instead of icing conditions.",
      "Not mentioning anti-ice status when reporting.",
      "Staying at altitude with severe icing — request change immediately.",
    ],
    pronunciation: [
      "Icing — EYE-sing.",
      "Conditions — con-DI-tions.",
      "Accumulation — a-cyoo-myu-LAY-shun.",
    ],
    captain:
      "Students material uses PAN-PAN, severe icing! — link to icaoVocabulary Part 3 example at altitude.",
    memory: "ICE — Identify moisture/temp, Communicate, Exit altitude or area.",
    related: ["De-Icing System Failure", "Weather Deviation", "Pan Pan Urgency Call", "Cabin Depressurization"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta vocabulary — icing conditions", "data/icaoVocabulary.ts"],
      ["ICAO Delta Part 2 vocabulary — icing", "data/part2Vocabulary.ts"],
      ["SKYbrary — In-Flight Icing", "https://skybrary.aero/articles/in-flight-icing"],
      ["FAA AIM — Weather", FAA_AIM_WX],
    ],
  },
  {
    id: "0047",
    concept: "Weather Deviation",
    slug: "weather-deviation",
    meaning: "Authorized departure from assigned route or heading to avoid adverse weather.",
    operational:
      "Pilot requests, ATC clears, pilot executes and reports clear of weather.",
    when: "En route when thunderstorms, turbulence, or icing block the cleared route.",
    who: "Pilots request from Center; ATC clears deviation and monitors separation.",
    atc: [
      "N456NO cleared to deviate left for weather avoidance.",
      "ANAC 123, deviation approved, report back on course.",
      "ANAC 123, unable deviation, turn left heading two seven zero.",
      "ANAC 123, when able, proceed direct BETA waypoint.",
      "ANAC 123, traffic twelve o'clock, advise when clear of weather.",
    ],
    pilot: [
      "PAN-PAN, deviating for weather.",
      "Confirming weather deviation approved.",
      "N456NO cleared to deviate left for weather avoidance.",
      "ANAC 123, request deviation right of track, two zero miles.",
      "ANAC 123, clear of weather, returning to course.",
    ],
    questions: [
      "What is the correct sequence: request, clearance, deviation, report?",
      "How would you confirm ATC approved your weather deviation?",
      "What would you say when back on the assigned route?",
    ],
    brazilian: [
      "Deviating without clearance in controlled airspace.",
      "Not reporting clear of weather when returning to course.",
      "Confusing deviation with diversion to alternate.",
    ],
    pronunciation: [
      "Deviation — dee-vee-AY-shun.",
      "Approved — ap-PROVED.",
      "Clear of weather — speak distinctly.",
    ],
    captain:
      "Students material has request, clearance, and confirming phrases — teach all three steps for exam readbacks.",
    memory: "DEVIATE — Declare need, Expect clearance, Vector as cleared, Inform when clear, Apply back to route, Track again.",
    related: ["Thunderstorm Avoidance", "Confirm Deviation", "Divert to Alternate", "Cleared to Deviate"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["SKYbrary — Weather", SKYBRARY_WX],
      ["ICAO Doc 4444 — Air Traffic Management", ICAO_DOC4444],
      ["FAA AIM — Weather", FAA_AIM_WX],
    ],
  },
  {
    id: "0048",
    concept: "Weather Deterioration",
    slug: "weather-deterioration",
    meaning: "Meteorological conditions at the airport or along route becoming worse.",
    operational:
      "Crew requests latest METAR, may hold, divert, or go around if minimums threatened.",
    when: "Approach when ceiling lowers, visibility drops, or convective activity builds.",
    who: "Pilots report observations; ATC issues advisories and updated weather.",
    atc: [
      "ANAC 123, warning, conditions deteriorating.",
      "ANAC 123, ATIS reports light shower.",
      "ANAC 123, say intentions.",
      "ANAC 123, expect holding, weather below minimums.",
      "ANAC 123, cleared to divert to alternate.",
    ],
    pilot: [
      "Warning, conditions deteriorating.",
      "Weather deteriorating, request latest METAR.",
      "Fog reducing visibility at the airport.",
      "Visibility reducing to two thousand meters.",
      "ANAC 123, request diversion, weather deteriorating at destination.",
    ],
    questions: [
      "How would you tell ATC that weather at the airport is deteriorating?",
      "What would you request when visibility is reducing on final?",
      "When would deteriorating weather trigger a diversion?",
    ],
    brazilian: [
      "Saying weather bad instead of deteriorating or visibility reducing.",
      "Not requesting latest METAR when conditions change.",
      "Continuing approach below personal minimums without informing ATC.",
    ],
    pronunciation: [
      "Deteriorating — di-TIER-ee-or-ating.",
      "Visibility — vis-i-BIL-i-ty.",
      "METAR — MEE-tar.",
    ],
    captain:
      "Combine Warning, conditions deteriorating with Part 2 visibility examples — common Part 3 narrative topic.",
    memory: "WX DOWN — Watch METAR, eXplain to ATC, Divert or hold, Own minimums, Wait for improvement, Notify passengers.",
    related: ["Low Visibility Operations", "Go Around", "Divert to Alternate", "Fog"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary — weather deteriorating, fog, visibility", "data/part2Vocabulary.ts"],
      ["SKYbrary — Weather", SKYBRARY_WX],
      ["FAA AIM — Weather", FAA_AIM_WX],
    ],
  },
  {
    id: "0049",
    concept: "Low Visibility Operations",
    slug: "low-visibility-operations",
    meaning: "Flight or ground movement when visibility or ceiling is below normal VMC limits.",
    operational:
      "Crew uses published low-visibility procedures, confirms runway in sight, and may need Cat II/III or taxi guidance.",
    when: "Fog, heavy rain, or haze reduces visibility below approach or taxi minimums.",
    who: "Pilots report visibility; Tower issues RVR if available; Ground may use follow-me for taxi.",
    atc: [
      "ANAC 123, visibility two thousand meters.",
      "ANAC 123, confirm runway in sight.",
      "ANAC 123, continue approach runway two seven.",
      "ANAC 123, low visibility procedures in effect.",
      "ANAC 123, taxi with caution, visibility reducing.",
    ],
    pilot: [
      "Fog reducing visibility at the airport.",
      "Visibility reducing to two thousand meters.",
      "N567MN confirming runway 12 in sight.",
      "ANAC 123, runway not in sight, going around.",
      "ANAC 123, request latest visibility for runway two seven.",
    ],
    questions: [
      "How would you report reduced visibility to Tower on approach?",
      "What would you say if you lose sight of the runway on final?",
      "How does confirming runway in sight relate to low visibility operations?",
    ],
    brazilian: [
      "Saying I cannot see instead of runway not in sight.",
      "Not requesting current visibility in metres.",
      "Continuing visual approach without runway in sight.",
    ],
    pronunciation: [
      "Visibility — vis-i-BIL-i-ty.",
      "Fog — FOG, short and clear.",
      "Runway in sight — RUN-way in SIGHT.",
    ],
    captain:
      "Use fog and visibility vocabulary plus confirm runway in sight — Ezeiza 25C context mentions poor visibility on ground.",
    memory: "LOW VIS — Look for runway, Obtain RVR/ATIS, When lost sight go around, Verify minimums, Inform ATC, Stop taxi if unsure.",
    related: ["Confirm Runway in Sight", "Weather Deterioration", "Go Around", "Continue Approach"],
    refs: [
      ["ICAO Delta Part 2 vocabulary — fog, visibility", "data/part2Vocabulary.ts"],
      ["ICAO Delta Exam 25C — poor visibility context", "data/exams/part2Data.ts"],
      ["SKYbrary — Low Visibility Operations", "https://skybrary.aero/articles/low-visibility-operations-lvo"],
      ["FAA AIM — Weather", FAA_AIM_WX],
    ],
  },
  {
    id: "0050",
    concept: "Runway Incursion",
    slug: "runway-incursion",
    meaning: "Incorrect presence of aircraft, vehicle, or person on the protected area of a runway.",
    operational:
      "Pilot going around or holding short; ATC alerts traffic and stops runway operations.",
    when: "Landing roll or final when vehicle, aircraft, or animal enters runway; or taxi when crossing without clearance.",
    who: "Pilots and Ground report; Tower stops landings and departures.",
    atc: [
      "ANAC 123, are you going around because of a runway incursion? Confirm.",
      "ANAC 123, turn left, report downwind leg runway three six.",
      "ANAC 123, hold short runway one eight, traffic on the runway.",
      "ANAC 123, runway two seven closed, expect delay.",
      "ANAC 123, incursion cleared, runway available.",
    ],
    pilot: [
      "Ground, possible runway incursion at intersection Delta.",
      "Recife Tower, ANAC 123, there is a truck on the runway. Going around, missed approach.",
      "AFFIRM. We are going around because of a runway incursion.",
      "ANAC 123, holding short, possible incursion ahead.",
      "ANAC 123, runway clear, ready to continue approach.",
    ],
    questions: [
      "What would you tell Tower if you see a vehicle on the runway on final?",
      "How would you confirm ATC's question about a runway incursion?",
      "What is the difference between reporting an incursion and going around?",
    ],
    brazilian: [
      "Saying truck on runway without using incursion when ATC asks.",
      "Landing despite obstacle — 24C/25C Recife teaches go-around.",
      "Confusing runway incursion with runway excursion.",
    ],
    pronunciation: [
      "Incursion — in-CUR-zhun.",
      "Intersection — in-ter-SEK-shun.",
      "Going around — GO-ing a-ROUND.",
    ],
    captain:
      "24C Recife truck-on-runway scenario is the anchor — going around, then AFFIRM runway incursion when asked.",
    memory: "INCUR — Identify hazard, No landing, Call Tower, Urgent go-around, Report incursion, Run missed approach.",
    related: ["Go Around", "Hold Short", "FOD on Runway", "Wreckage on Runway"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Exam 24C/25C — truck on runway", "data/exams/part2Data.ts"],
      ["SKYbrary — Runway Incursion", "https://skybrary.aero/articles/runway-incursion"],
      ["FAA AIM — Runway Incursion", "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap4_section_3.html"],
    ],
  },
  {
    id: "0051",
    concept: "Runway Excursion",
    slug: "runway-excursion",
    meaning: "Aircraft departing the side of the runway surface during takeoff or landing.",
    operational:
      "Post-event report to Tower; may block runway and require emergency services.",
    when: "Wet runway, crosswind, or hydroplaning causes aircraft to leave paved surface.",
    who: "Pilots report after stopping; Tower closes runway and alerts rescue.",
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
      "What is the difference between runway excursion and runway overrun?",
      "How would you report that your aircraft has left the runway pavement?",
      "When would runway excursion affect other traffic?",
    ],
    brazilian: [
      "Confusing excursion with incursion — excursion is leaving runway sides.",
      "RESEARCH REQUIRED",
      "RESEARCH REQUIRED",
    ],
    pronunciation: [
      "Excursion — ex-CUR-zhun.",
      "Pavement — PAYV-ment.",
      "Hydroplaning — HY-dro-play-ning.",
    ],
    captain:
      "Concept not in Students material phraseology table — teach definition using SKYbrary/FAA; mark phraseology RESEARCH REQUIRED until verified.",
    memory: "SIDE — Stay calm, Inform Tower, Describe position, Evacuate if needed.",
    related: ["Runway Overrun", "Runway Incursion", "Rejected Takeoff", "Emergency Landing"],
    refs: [
      ["SKYbrary — Runway Excursion", "https://skybrary.aero/articles/runway-excursion"],
      ["FAA Pilot/Controller Glossary", FAA_PCG],
      ["FAA AIM — Runway Safety", "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap4_section_3.html"],
    ],
  },
  {
    id: "0052",
    concept: "Runway Overrun",
    slug: "runway-overrun",
    meaning: "Aircraft passing beyond the end of the runway during landing or rejected takeoff.",
    operational:
      "Serious runway safety event; crew reports position; runway closed for inspection.",
    when: "Late braking, wet runway, or high approach speed causes aircraft to exceed runway end.",
    who: "Pilots report to Tower; ATC alerts emergency services and closes runway.",
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
      "What is the difference between runway overrun and runway excursion?",
      "What factors would you report to ATC after an overrun?",
      "How does runway condition affect overrun risk?",
    ],
    brazilian: [
      "Confusing overrun with go-around.",
      "RESEARCH REQUIRED",
      "RESEARCH REQUIRED",
    ],
    pronunciation: [
      "Overrun — O-ver-run.",
      "Threshold — THRESH-old.",
      "Braking — BRAKE-ing.",
    ],
    captain:
      "Part 3 discussion concept — no verified ICAO Delta phraseology yet; use SKYbrary for operational meaning only.",
    memory: "END — Evaluate speed, Needed distance, Decide go-around early.",
    related: ["Runway Excursion", "Rejected Takeoff", "Go Around", "Runway Incursion"],
    refs: [
      ["SKYbrary — Runway Overrun", "https://skybrary.aero/articles/runway-overrun"],
      ["FAA Pilot/Controller Glossary", FAA_PCG],
      ["FAA AIM — Runway Safety", "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap4_section_3.html"],
    ],
  },
  {
    id: "0053",
    concept: "FOD on Runway",
    slug: "fod-on-runway",
    meaning: "Foreign object debris on the runway that may damage aircraft or require go-around.",
    operational:
      "Pilot reports FOD or debris; Tower inspects runway and may cancel landing clearance.",
    when: "Takeoff roll, landing, or taxi when objects are seen on runway surface.",
    who: "Pilots report to Tower; airport operations remove debris.",
    atc: [
      "ANAC 123, runway inspection in progress.",
      "ANAC 123, cancel landing clearance, climb to three thousand feet.",
      "ANAC 123, report FOD location on runway.",
      "ANAC 123, runway two seven clear of debris, cleared to land.",
      "ANAC 123, hold position, FOD reported on runway.",
    ],
    pilot: [
      "Aircraft debris on runway.",
      "FOD reported on ramp area.",
      "Tower, ANAC 123, debris on runway, going around.",
      "ANAC 123, FOD on runway two seven, request runway inspection.",
      "ANAC 123, negative FOD, runway appears clear.",
    ],
    questions: [
      "What would you tell Tower if you see debris on the runway on short final?",
      "What is FOD and why must it be reported immediately?",
      "How would you respond if ATC asks you to confirm FOD on the runway?",
    ],
    brazilian: [
      "Saying trash on runway instead of FOD or debris.",
      "Landing over known debris — request inspection or go around.",
      "Confusing FOD on runway with debris on taxiway.",
    ],
    pronunciation: [
      "FOD — F-O-D, spell or say foreign object debris.",
      "Debris — DEB-ree or day-BREE in aviation English.",
      "Inspection — in-SPEK-shun.",
    ],
    captain:
      "Students material uses Aircraft debris on runway and FOD reported — pair with Recife truck scenario for go-around discipline.",
    memory: "FOD — Find it, Out loud to Tower, Delay landing until clear.",
    related: ["Wreckage on Runway", "Debris on Taxiway", "Runway Incursion", "Go Around"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Exam 24C/25C — runway obstruction", "data/exams/part2Data.ts"],
      ["SKYbrary — Foreign Object Debris", "https://skybrary.aero/articles/foreign-object-debris-fod"],
      ["FAA AIM — Airport Operations", "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap4_section_3.html"],
    ],
  },
  {
    id: "0054",
    concept: "Debris on Taxiway",
    slug: "debris-on-taxiway",
    meaning: "Foreign object or material on a taxiway that may damage aircraft or block movement.",
    operational:
      "Pilot holds position and reports to Ground; airport staff remove debris before taxi continues.",
    when: "Taxi when equipment, parts, or FOD is visible on taxiway surface.",
    who: "Pilots report to Ground; Ground alerts airport operations.",
    atc: [
      "ANAC 123, hold position.",
      "ANAC 123, is there debris near your aircraft?",
      "ANAC 123, maintenance dispatched to taxiway Bravo.",
      "ANAC 123, taxi with caution, work in progress near taxiway.",
      "ANAC 123, proceed when debris cleared.",
    ],
    pilot: [
      "FOD observed on taxiway.",
      "Ground, ANAC 123, debris on taxiway Bravo, holding position.",
      "NEGATIVE. There is a drone flying near my aircraft. Holding position, ANAC 123.",
      "ANAC 123, request airport authority, debris on taxiway.",
      "ANAC 123, debris cleared, ready to continue taxi.",
    ],
    questions: [
      "How would you report debris seen while taxiing?",
      "What would you do before continuing taxi past debris?",
      "How would you correct ATC if they confuse debris with another hazard?",
    ],
    brazilian: [
      "Continuing taxi over debris without reporting.",
      "Saying garbage instead of FOD or debris.",
      "Not holding position when Ground instructs.",
    ],
    pronunciation: [
      "Taxiway — TAX-ee-way.",
      "Observed — ob-ZERVD.",
      "Bravo — BRAH-vo for taxiway designator.",
    ],
    captain:
      "Students material FOD observed on taxiway — San Francisco drone exam shows NEGATIVE correction when ATC asks about debris.",
    memory: "TAXI FOD — Stop, Announce to Ground, eXamine, Inform when safe.",
    related: ["FOD on Runway", "Hold Position", "Work in Progress", "Drone Near Airport"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Exam 24C — drone/debris confusion", "data/exams/part2Data.ts"],
      ["SKYbrary — Foreign Object Debris", "https://skybrary.aero/articles/foreign-object-debris-fod"],
      ["FAA AIM — Airport Operations", "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap4_section_3.html"],
    ],
  },
  {
    id: "0055",
    concept: "Wreckage on Runway",
    slug: "wreckage-on-runway",
    meaning: "Aircraft parts or wreckage obstructing the runway after an accident or incident.",
    operational:
      "Immediate go-around or hold; Tower closes runway until wreckage removed.",
    when: "After accident, gear failure, or engine debris on runway; pilot sees wreckage on approach.",
    who: "Pilots report to Tower; airport authority coordinates runway closure.",
    atc: [
      "ANAC 123, go around, aircraft debris on runway.",
      "ANAC 123, runway closed, expect holding instructions.",
      "ANAC 123, say when runway in sight.",
      "ANAC 123, emergency services on the runway.",
      "ANAC 123, alternate runway two seven available.",
    ],
    pilot: [
      "Aircraft debris on runway.",
      "Tower, ANAC 123, wreckage on runway, going around.",
      "ANAC 123, unable to land, debris on runway one eight.",
      "ANAC 123, request longest available runway, previous runway blocked.",
      "ANAC 123, runway clear of wreckage, ready for approach.",
    ],
    questions: [
      "What would you report if you see aircraft wreckage on the runway?",
      "How is wreckage on runway different from FOD?",
      "What would you request if your assigned runway has wreckage?",
    ],
    brazilian: [
      "Saying broken plane instead of aircraft debris or wreckage.",
      "Attempting to land on occupied runway.",
      "Not requesting alternate runway.",
    ],
    pronunciation: [
      "Wreckage — REK-ij.",
      "Debris — DEB-ree.",
      "Blocked — BLOCKT.",
    ],
    captain:
      "Students material phrase is Aircraft debris on runway — use for exam; wreckage is acceptable descriptive term in report.",
    memory: "WRECK — Warn Tower, Run missed approach, Expect alternate runway, Call souls/fuel if damaged, Keep holding.",
    related: ["FOD on Runway", "Runway Incursion", "Emergency Landing", "Go Around"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Exam 24C/25C — runway obstruction", "data/exams/part2Data.ts"],
      ["SKYbrary — Runway Incursion", "https://skybrary.aero/articles/runway-incursion"],
      ["FAA AIM — Airport Operations", "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap4_section_3.html"],
    ],
  },
  {
    id: "0056",
    concept: "Drone Near Airport",
    slug: "drone-near-airport",
    meaning: "Unmanned aircraft sighted near airport or aircraft, posing collision risk.",
    operational:
      "Pilot holds or reports immediately; ATC alerts traffic and may stop operations.",
    when: "Taxi, departure, or approach when drone is observed near airfield or aircraft.",
    who: "Pilots report to Tower or Ground; ATC issues traffic advisories.",
    atc: [
      "ANAC 123, hold position.",
      "ANAC 123, is there debris near your aircraft?",
      "ANAC 123, drone activity reported north of the field.",
      "ANAC 123, say position of the drone.",
      "ANAC 123, proceed when able, drone cleared from area.",
    ],
    pilot: [
      "Drone sighting north of airfield.",
      "San Francisco Ground, ANAC 123, there is a drone flying near my aircraft. Request instructions.",
      "NEGATIVE. There is a drone flying near my aircraft. Holding position, ANAC 123.",
      "ANAC 123, drone at two o'clock, one mile.",
      "ANAC 123, drone no longer in sight, ready to taxi.",
    ],
    questions: [
      "How would you report a drone near your aircraft while taxiing?",
      "What would you say if ATC asks about debris but you see a drone?",
      "Why must drone sightings be reported immediately?",
    ],
    brazilian: [
      "Confusing drone with bird — report drone specifically.",
      "Continuing taxi without holding when drone is near.",
      "Saying helicopter toy instead of drone.",
    ],
    pronunciation: [
      "Drone — DRONE, one syllable.",
      "Sighting — SIGHT-ing.",
      "Airfield — AIR-field.",
    ],
    captain:
      "24C San Francisco drone scenario — hold position, NEGATIVE to debris question, specify drone.",
    memory: "DRONE — Detect, Report immediately, Observe position, No movement until cleared, Explain to Ground.",
    related: ["Debris on Taxiway", "Bird Strike", "Traffic Alert", "Hold Position"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Exam 24C — drone near aircraft", "data/exams/part2Data.ts"],
      ["SKYbrary — Unmanned Aerial Systems", "https://skybrary.aero/articles/unmanned-aerial-systems-uas"],
      ["FAA AIM — UAS", "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap11_section_1.html"],
    ],
  },
  {
    id: "0057",
    concept: "Hot Air Balloon Traffic",
    slug: "hot-air-balloon-traffic",
    meaning: "Unpowered balloon traffic in vicinity of aircraft flight path.",
    operational:
      "Pilot reports traffic and requests deviation; ATC vectors around balloon.",
    when: "Visual approach or VFR segment when balloon drifts into aircraft path.",
    who: "Pilots report to Approach; ATC issues traffic alerts and heading changes.",
    atc: [
      "ANAC 123, turn three zero degrees left.",
      "ANAC 123, confirm the hot air balloon is at your twelve o'clock position.",
      "ANAC 123, turn two zero degrees left.",
      "ANAC 123, traffic alert, balloon twelve o'clock.",
      "ANAC 123, report clear of balloon traffic.",
    ],
    pilot: [
      "Traffic, balloon drifting northeast.",
      "Traffic alert, balloon 12 o'clock.",
      "Santiago Approach, ANAC 123, there is a hot air balloon ahead of us. Request deviation.",
      "NEGATIVE. The hot air balloon is ahead of us. Turn three zero degrees left, ANAC 123.",
      "AFFIRM. The hot air balloon is at our twelve o'clock position. Turn two zero degrees left, ANAC 123.",
    ],
    questions: [
      "How would you request deviation for a hot air balloon ahead?",
      "What would you say if ATC asks to confirm balloon position?",
      "How would you correct ATC if balloon position is wrong?",
    ],
    brazilian: [
      "Saying baloon with one l — balloon.",
      "Accepting turn without reporting balloon ahead — 23C/25C Santiago tests NEGATIVE.",
      "Not using clock position for traffic.",
    ],
    pronunciation: [
      "Balloon — ba-LOON.",
      "Twelve o'clock — TWELVE o-CLOCK.",
      "Deviation — dee-vee-AY-shun.",
    ],
    captain:
      "23C and 25C Santiago balloon scenarios — request deviation, confirm position, NEGATIVE if balloon is ahead not three o'clock.",
    memory: "BALLOON — Balloon in sight, Alert ATC, Left/right turn as cleared, Look out, Out of conflict, Notify clear.",
    related: ["Traffic Alert", "Weather Deviation", "Visual Approach", "See and Avoid"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Exam 23C/25C — hot air balloon", "data/exams/part2Data.ts"],
      ["SKYbrary — Hot Air Balloon", "https://skybrary.aero/articles/hot-air-balloon"],
      ["FAA AIM — Balloon Operations", FAA_AIM_WX],
    ],
  },
  {
    id: "0058",
    concept: "Confirm Runway in Sight",
    slug: "confirm-runway-in-sight",
    meaning: "ATC request or pilot report verifying visual acquisition of the landing runway.",
    operational:
      "Required for visual approaches and some radar vectors to final; pilot must confirm honestly.",
    when: "Vector to final, visual approach clearance, or low visibility when ATC needs visual confirmation.",
    who: "ATC asks; pilot confirms or reports runway not in sight.",
    atc: [
      "ANAC 123, confirm runway in sight.",
      "ANAC 123, report runway in sight.",
      "ANAC 123, runway one two in sight?",
      "ANAC 123, traffic in sight, follow the traffic.",
      "ANAC 123, cleared visual approach runway two seven, report runway in sight.",
    ],
    pilot: [
      "N567MN confirming runway 12 in sight.",
      "ANAC 123, runway two seven in sight.",
      "ANAC 123, negative, runway not in sight.",
      "ANAC 123, airport in sight, not the runway.",
      "Finally, he asked me if I had the runway in sight.",
    ],
    questions: [
      "How would you confirm runway in sight to Tower?",
      "What would you say if you have the airport but not the runway?",
      "When must you report negative runway in sight?",
    ],
    brazilian: [
      "Saying I see the runway without standard confirming phrase.",
      "Confirming runway in sight when only airport is visible.",
      "Not reporting negative when runway is obscured.",
    ],
    pronunciation: [
      "Confirming — con-FIRM-ing.",
      "In sight — in SIGHT.",
      "Runway — RUN-way.",
    ],
    captain:
      "Students material N567MN confirming runway 12 in sight — teach honest negative if not visual.",
    memory: "SIGHT — See runway clearly, If not say negative, Go around when required, Honest report, Transmit confirming.",
    related: ["Low Visibility Operations", "Visual Approach", "Number One for Landing", "Continue Approach"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary — runway in sight", "data/part2Vocabulary.ts"],
      ["SKYbrary — Visual Approach", "https://skybrary.aero/articles/visual-approach"],
      ["FAA AIM — Approach Procedures", "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap5_section_4.html"],
    ],
  },
  {
    id: "0059",
    concept: "Number One for Landing",
    slug: "number-one-for-landing",
    meaning: "Pilot report or ATC acknowledgment that aircraft is first in landing sequence.",
    operational:
      "Confirms sequence position; pilot monitors traffic and prepares for landing clearance.",
    when: "Downwind, base, or final when pilot believes they are first to land.",
    who: "Pilot reports to Tower; Tower may confirm or correct sequence.",
    atc: [
      "ANAC 123, number one, runway two one, cleared to land.",
      "ANAC 123, number two, follow the traffic on final.",
      "ANAC 123, extend downwind, traffic on a two mile final.",
      "ANAC 123, confirm you are number one for landing.",
      "ANAC 123, wind two one zero at one two, runway two one.",
    ],
    pilot: [
      "Tower, N123QR number one for landing runway 21.",
      "ANAC 123, number one for landing runway two one.",
      "ANAC 123, traffic in sight, number one.",
      "ANAC 123, confirm number one for landing.",
      "ANAC 123, not number one, traffic ahead in sight.",
    ],
    questions: [
      "How would you tell Tower you are number one for landing?",
      "What would you do if Tower says you are number two?",
      "When is it appropriate to report number one for landing?",
    ],
    brazilian: [
      "Saying first to land instead of number one for landing.",
      "Assuming number one without Tower confirmation.",
      "Not saying runway number in the report.",
    ],
    pronunciation: [
      "Number one — NUM-ber ONE.",
      "Landing — LAN-ding.",
      "Sequence — SEE-kwence.",
    ],
    captain:
      "Students material Tower, N123QR number one for landing runway 21 — always include runway designator.",
    memory: "ONE — Only report when sure, Name runway, Expect Tower correction if wrong.",
    related: ["Confirm Runway in Sight", "Cleared to Land", "Report Final", "Traffic in Sight"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["SKYbrary — Landing Sequence", "https://skybrary.aero/articles/landing-sequence"],
      ["FAA AIM — Approach Procedures", "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap5_section_4.html"],
    ],
  },
  {
    id: "0060",
    concept: "Priority Landing",
    slug: "priority-landing",
    meaning: "Request for preferential ATC handling to land before other traffic due to urgency.",
    operational:
      "Used with Pan Pan, Mayday, low fuel, or medical — ATC sequences aircraft first for landing.",
    when: "Emergency, urgency, or time-critical situation requiring landing ahead of traffic.",
    who: "Pilots request from Approach or Tower; ATC clears priority approach.",
    atc: [
      "ANAC 123, cleared priority approach runway two seven.",
      "ANAC 123, number one, all traffic hold.",
      "ANAC 123, say nature of emergency.",
      "ANAC 123, runway two seven cleared to land, traffic holding.",
      "ANAC 123, emergency services standing by.",
    ],
    pilot: [
      "N890OP requesting priority to land due to emergency.",
      "We request priority landing.",
      "We would like priority landing.",
      "Pan Pan Pan, Control, ANAC 123, medical emergency on board. Request priority handling and vectors for the nearest suitable airport.",
      "ANAC 123, because of low fuel we need priority landing.",
    ],
    questions: [
      "When would you request priority landing?",
      "What is the difference between priority landing and Mayday?",
      "How would you request priority handling for a medical emergency?",
    ],
    brazilian: [
      "Saying I need to land first instead of request priority landing.",
      "Requesting priority without stating reason.",
      "Confusing priority with emergency landing execution call.",
    ],
    pronunciation: [
      "Priority — pry-OR-i-tee.",
      "Handling — HAND-ling.",
      "Emergency — e-MER-gen-cy.",
    ],
    captain:
      "Students material priority to land plus Part 3 Pan Pan medical priority — teach pairing request with reason.",
    memory: "PRIORITY — Problem stated, Request clearly, Inform urgency, Order from ATC, Ready for straight-in, Identify nature, Touch down expeditiously.",
    related: ["Mayday Distress Call", "Pan Pan Urgency Call", "Emergency Landing", "Low Fuel"],
    refs: [
      ["ICAO Delta Students material", "Students material.pdf"],
      ["ICAO Delta Part 2 vocabulary — priority", "data/part2Vocabulary.ts"],
      ["ICAO Delta Part 3 simulado — medical priority", "data/simulado/part3Data.ts"],
      ["SKYbrary — Emergency Communications", "https://skybrary.aero/articles/emergency-communications"],
      ["ICAO Doc 4444 — Radiotelephony", ICAO_DOC4444],
    ],
  },
];

const TRUSTED_REFS = {
  "windshear-on-final": [
    ["SKYbrary — Windshear", "https://skybrary.aero/articles/windshear"],
    ["FAA AIM — Weather", FAA_AIM_WX],
    ["ICAO Doc 4444 — Air Traffic Management", ICAO_DOC4444],
    ["EASA Safety", EASA_SAFETY],
  ],
  "microburst-on-final": [
    ["SKYbrary — Microburst", "https://skybrary.aero/articles/microburst"],
    ["FAA AIM — Weather", FAA_AIM_WX],
    ["ICAO Doc 4444 — Air Traffic Management", ICAO_DOC4444],
    ["EASA Safety", EASA_SAFETY],
  ],
  "severe-turbulence": [
    ["SKYbrary — Turbulence", "https://skybrary.aero/articles/turbulence"],
    ["FAA AIM — Weather", FAA_AIM_WX],
    ["ICAO Doc 4444 — Air Traffic Management", ICAO_DOC4444],
    ["EASA Safety", EASA_SAFETY],
  ],
  "moderate-turbulence": [
    ["SKYbrary — Turbulence", "https://skybrary.aero/articles/turbulence"],
    ["FAA AIM — Weather", FAA_AIM_WX],
    ["EASA Safety", EASA_SAFETY],
  ],
  "thunderstorm-avoidance": [
    ["SKYbrary — Thunderstorm", "https://skybrary.aero/articles/thunderstorm"],
    ["FAA AIM — Weather", FAA_AIM_WX],
    ["ICAO Doc 4444 — Air Traffic Management", ICAO_DOC4444],
    ["EASA Safety", EASA_SAFETY],
  ],
  "icing-conditions": [
    ["SKYbrary — In-Flight Icing", "https://skybrary.aero/articles/in-flight-icing"],
    ["FAA AIM — Weather", FAA_AIM_WX],
    ["EASA Safety", EASA_SAFETY],
  ],
  "weather-deviation": [
    ["SKYbrary — Weather", SKYBRARY_WX],
    ["ICAO Doc 4444 — Air Traffic Management", ICAO_DOC4444],
    ["FAA AIM — Weather", FAA_AIM_WX],
    ["EASA Safety", EASA_SAFETY],
  ],
  "weather-deterioration": [
    ["SKYbrary — Weather", SKYBRARY_WX],
    ["FAA AIM — Weather", FAA_AIM_WX],
    ["EASA Safety", EASA_SAFETY],
  ],
  "low-visibility-operations": [
    ["SKYbrary — Low Visibility Operations", "https://skybrary.aero/articles/low-visibility-operations-lvo"],
    ["FAA AIM — Weather", FAA_AIM_WX],
    ["ICAO Doc 4444 — Air Traffic Management", ICAO_DOC4444],
    ["EASA Safety", EASA_SAFETY],
  ],
  "runway-incursion": [
    ["SKYbrary — Runway Incursion", "https://skybrary.aero/articles/runway-incursion"],
    ["ICAO Runway Safety", ICAO_RUNWAY_SAFETY],
    ["FAA AIM — Runway Incursion", FAA_AIM_RWY],
    ["EASA Safety", EASA_SAFETY],
  ],
  "runway-excursion": [
    ["SKYbrary — Runway Excursion", "https://skybrary.aero/articles/runway-excursion"],
    ["FAA Pilot/Controller Glossary", FAA_PCG],
    ["FAA AIM — Runway Safety", FAA_AIM_RWY],
    ["EASA Safety", EASA_SAFETY],
  ],
  "runway-overrun": [
    ["SKYbrary — Runway Overrun", "https://skybrary.aero/articles/runway-overrun"],
    ["FAA Pilot/Controller Glossary", FAA_PCG],
    ["FAA AIM — Runway Safety", FAA_AIM_RWY],
    ["EASA Safety", EASA_SAFETY],
  ],
  "fod-on-runway": [
    ["SKYbrary — Foreign Object Debris", "https://skybrary.aero/articles/foreign-object-debris-fod"],
    ["ICAO Runway Safety", ICAO_RUNWAY_SAFETY],
    ["FAA AIM — Airport Operations", FAA_AIM_RWY],
    ["EASA Safety", EASA_SAFETY],
  ],
  "debris-on-taxiway": [
    ["SKYbrary — Foreign Object Debris", "https://skybrary.aero/articles/foreign-object-debris-fod"],
    ["FAA AIM — Airport Operations", FAA_AIM_RWY],
    ["EASA Safety", EASA_SAFETY],
  ],
  "wreckage-on-runway": [
    ["SKYbrary — Runway Incursion", "https://skybrary.aero/articles/runway-incursion"],
    ["ICAO Runway Safety", ICAO_RUNWAY_SAFETY],
    ["FAA AIM — Airport Operations", FAA_AIM_RWY],
    ["EASA Safety", EASA_SAFETY],
  ],
  "drone-near-airport": [
    ["SKYbrary — Unmanned Aerial Systems", "https://skybrary.aero/articles/unmanned-aerial-systems-uas"],
    ["FAA AIM — UAS", FAA_AIM_UAS],
    ["EASA Safety", EASA_SAFETY],
  ],
  "hot-air-balloon-traffic": [
    ["SKYbrary — Hot Air Balloon", "https://skybrary.aero/articles/hot-air-balloon"],
    ["FAA AIM — Weather & Balloon Operations", FAA_AIM_WX],
    ["EASA Safety", EASA_SAFETY],
  ],
  "confirm-runway-in-sight": [
    ["SKYbrary — Visual Approach", "https://skybrary.aero/articles/visual-approach"],
    ["FAA AIM — Approach Procedures", FAA_AIM_APP],
    ["ICAO Doc 4444 — Air Traffic Management", ICAO_DOC4444],
    ["EASA Safety", EASA_SAFETY],
  ],
  "number-one-for-landing": [
    ["SKYbrary — Landing Sequence", "https://skybrary.aero/articles/landing-sequence"],
    ["FAA AIM — Approach Procedures", FAA_AIM_APP],
    ["EASA Safety", EASA_SAFETY],
  ],
  "priority-landing": [
    ["SKYbrary — Emergency Communications", "https://skybrary.aero/articles/emergency-communications"],
    ["ICAO Doc 4444 — Radiotelephony", ICAO_DOC4444],
    ["FAA AIM — Emergency Procedures", FAA_AIM_EMERG],
    ["EASA Safety", EASA_SAFETY],
  ],
};

for (const c of CONCEPTS) {
  c.refs = TRUSTED_REFS[c.slug];
}

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
**Draft:** Premium batch-03 — working document (not consumed by Captain)

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
      batch: "batch-03-weather-ops",
      generatedAt: new Date().toISOString().slice(0, 10),
      conceptCount: CONCEPTS.length,
      concepts: CONCEPTS.map((c) => ({ id: c.id, concept: c.concept, slug: c.slug })),
    },
    null,
    2,
  ),
);
console.log(`Generated ${CONCEPTS.length} premium drafts in ${OUT}`);
