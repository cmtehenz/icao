import { CARDS } from "@/lib/cards";
import type { Category } from "@/lib/categories";
import type { DifficultyArea } from "@/lib/difficultyInsights";

export type IcaoFlixVideoLinks = {
  part1Cards?: string[];
  part2Situations?: string[];
  difficultyAreas?: DifficultyArea[];
};

export type IcaoFlixVideo = {
  id: string;
  youtubeId: string;
  title: string;
  source: string;
  why: string;
  category: Category;
  tags: string[];
  links: IcaoFlixVideoLinks;
  durationMin?: number;
};

/** Part 1 brief context — lead line and SKYbrary links (videos live in ICAO_FLIX_VIDEOS). */
export type Part1BriefMeta = {
  lead: string;
  links: { title: string; source: string; href: string; why: string }[];
};

const CARD_CATEGORY: Record<string, Category> = Object.fromEntries(
  CARDS.map((c) => [c.num.padStart(2, "0"), c.category as Category]),
);

/** Semantic category per Part 1 card — maps exam topics to ICAOFlix filters. */
const CARD_FLIX_CATEGORY: Partial<Record<string, Category>> = {
  "02": "personal",
  "03": "airports",
  "04": "general",
  "05": "future",
  "06": "general",
  "08": "personal",
  "12": "future",
};

/** Fix category after dedupe merge (first-card category is not always correct). */
const VIDEO_CATEGORY_OVERRIDES: Partial<Record<string, Category>> = {
  tXWnj0odAeo: "airports",
  oQjOxHqBV8Q: "airports",
  nR1NJ_OmLnE: "personal",
  dosTAQRpXII: "personal",
  UOhPvJfPsCw: "personal",
  mphVLIg1LxM: "personal",
  jE2AbA8bpSQ: "personal",
  jMsAv5dgGNg: "future",
  n3VAmMmSeNo: "future",
  KJZlRR2dl9Q: "future",
  HICmgQlXGqI: "general",
  "7t09BvoU7I4": "general",
  "P5jAqp-I_tk": "general",
};

/** Curated Part 1 brief packs — leads and article links only. */
export const PART1_BRIEF_META: Record<string, Part1BriefMeta> = {
  "01": {
    lead:
      "Watch before you build your answer — FAA helicopter briefing practice and crew resource management.",
    links: [
      {
        title: "Flight Preparation and Effective Briefings",
        source: "SKYbrary OGHFA",
        href: "https://skybrary.aero/articles/flight-preparation-and-conducting-effective-briefings-oghfa-bn",
        why: "Industry reference for high-quality preflight briefings and crew synergy.",
      },
    ],
  },
  "02": {
    lead:
      "This question asks for a real operational story — weather pressure, rising workload, and a conservative decision.",
    links: [
      {
        title: "Decision Making (OGHFA)",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/decision-making-oghfa-bn",
        why: "How examiners expect structured aeronautical decision making in your narrative.",
      },
    ],
  },
  "03": {
    lead:
      "This is a personal description question — name your airport, traffic mix, facilities, and what makes operations challenging (weather, season, ATC).",
    links: [
      {
        title: "Aerodrome Traffic Circuit",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/aerodrome-traffic-circuit",
        why: "Helicopters often use separate circuits — useful when describing how traffic works at your base.",
      },
      {
        title: "Final Approach and Takeoff Area (FATO)",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/final-approach-and-takeoff-area-fato",
        why: "Heliport/landing-area layout — how to describe where helicopters operate at an aerodrome.",
      },
      {
        title: "Aerodrome Lighting",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/aerodrome-lighting",
        why: "Heliport beacon (white, yellow, green) and airport lighting — optional detail for a richer description.",
      },
    ],
  },
  "04": {
    lead:
      "Medical exams protect fitness to fly — physical health, fatigue, and day-to-day self-assessment.",
    links: [
      {
        title: "Pilot Fitness to Fly",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/pilot-fitness-fly",
        why: "Why aviation medical standards exist and what examiners expect you to know.",
      },
    ],
  },
  "05": {
    lead:
      "More digital tools ahead — but standard radio phraseology and read-back stay essential in emergencies.",
    links: [
      {
        title: "Air-Ground Voice Communications",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/air-ground-voice-communications",
        why: "Human voice comms, standard phraseology, and why they will not disappear.",
      },
    ],
  },
  "06": {
    lead:
      "Check ride mindset — know the ACS, stay calm under evaluation, and prioritize safety over ego.",
    links: [
      {
        title: "Line-Oriented Flight Training",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/line-oriented-flight-training",
        why: "How structured training and debrief culture prepare you for evaluation flights.",
      },
    ],
  },
  "07": {
    lead:
      "ICAO phraseology is the global standard — clear, brief, and designed to prevent misunderstandings.",
    links: [
      {
        title: "Read-back or Hear-back",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/read-back-or-hear-back",
        why: "Why standardized comms and confirmation loops improve flight safety.",
      },
      {
        title: "Communication Error",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/communication-error",
        why: "What goes wrong when phraseology is non-standard or incomplete.",
      },
    ],
  },
  "08": {
    lead:
      "A personal story question — why aviation, why helicopters, and what still motivates you to learn.",
    links: [
      {
        title: "Point-in-Space (PinS) Helicopter Operations",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/point-space-pins-helicopter-operations",
        why: "Modern helicopter capability beyond traditional runways.",
      },
    ],
  },
  "09": {
    lead:
      "Missed approach = safe decision when landing cannot be completed — know triggers, procedure, and comms.",
    links: [
      {
        title: "Go-Around Decision Making",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/go-around-decision-making",
        why: "When and why pilots must abandon an approach.",
      },
      {
        title: "Missed Approach RTF Communications",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/missed-approach-rtf-communications",
        why: "Standard phraseology for going around and coordinating with ATC.",
      },
    ],
  },
  "10": {
    lead:
      "Simulators let you rehearse emergencies safely — repetition builds procedures and confidence.",
    links: [
      {
        title: "Line-Oriented Flight Training",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/line-oriented-flight-training",
        why: "How LOFT in simulators trains emergency decision-making and CRM.",
      },
    ],
  },
  "11": {
    lead:
      "Instructor wisdom — discipline with procedures, respect aircraft limits, and conservative judgment.",
    links: [
      {
        title: "Decision Making Training (OGHFA)",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/decision-making-training-oghfa-bn",
        why: "How CRM and disciplined habits from training carry into line flying.",
      },
    ],
  },
  "12": {
    lead:
      "Future of Brazilian rotary-wing ops — technology, market growth, and improving safety culture.",
    links: [
      {
        title: "Unmanned Aerial Systems (UAS)",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/unmanned-aerial-systems-uas",
        why: "Integrating new traffic into helicopter operations safely.",
      },
      {
        title: "Point-in-Space (PinS) Helicopter Operations",
        source: "SKYbrary",
        href: "https://skybrary.aero/articles/point-space-pins-helicopter-operations",
        why: "Modern GNSS-based helicopter procedures and infrastructure trends.",
      },
    ],
  },
};

type RawBriefVideo = {
  cardNum: string;
  title: string;
  source: string;
  youtubeId: string;
  why: string;
  tags?: string[];
};

/** All Part 1 brief videos — deduped into ICAO_FLIX_VIDEOS at build time. */
const RAW_BRIEF_VIDEOS: RawBriefVideo[] = [
  { cardNum: "01", title: "Preflighting Your Passengers", source: "FAA Rotorcraft Collective", youtubeId: "xpMQNHvxC7c", why: "FAA best practices for a structured, safety-focused helicopter briefing before flight.", tags: ["crm", "briefing"] },
  { cardNum: "01", title: "Communication, CRM & Cockpit Safety", source: "Brian Schiff", youtubeId: "gnSCpa2weUs", why: "Why interactive crew briefings and shared mental models matter (CRM).", tags: ["crm"] },
  { cardNum: "02", title: "Beware of the Green Dot Syndrome", source: "FAA Rotorcraft Collective", youtubeId: "UOhPvJfPsCw", why: "Weather can look acceptable on paper while approach workload and visibility deteriorate.", tags: ["weather", "decision-making"] },
  { cardNum: "02", title: "Just Say No!", source: "FAA Rotorcraft Collective", youtubeId: "mphVLIg1LxM", why: "Personal minimums and saying no when conditions are not safe — core to a good difficult-flight story.", tags: ["decision-making"] },
  { cardNum: "03", title: "From the Flight Deck – Dekalb-Peachtree Airport (PDK)", source: "FAA", youtubeId: "tXWnj0odAeo", why: "Busy GA airport with airlines, business jets, and a strong helicopter community — a model for describing mixed traffic.", tags: ["airport"] },
  { cardNum: "03", title: "From the Flight Deck – Van Nuys Airport (VNY)", source: "FAA", youtubeId: "oQjOxHqBV8Q", why: "One of the busiest GA airports — helicopter tours, training, and daily traffic; vocabulary for infrastructure and complexity.", tags: ["airport"] },
  { cardNum: "04", title: "Fuel Yourself for a Safe Flight", source: "FAA Rotorcraft Collective", youtubeId: "7t09BvoU7I4", why: "Pilot as the critical system — nutrition, hydration, and mental readiness.", tags: ["fitness"] },
  { cardNum: "04", title: "Don't Fly Fatigued", source: "FAA Rotorcraft Collective", youtubeId: "P5jAqp-I_tk", why: "Fatigue monitoring is a major reason recurrent medical checks matter.", tags: ["fatigue", "fitness"] },
  { cardNum: "05", title: "CPDLC — Controller-Pilot Datalink Communication", source: "Aviation Explained", youtubeId: "jMsAv5dgGNg", why: "How digital clearance delivery is changing routine pilot–ATC workflow.", tags: ["phraseology", "technology"] },
  { cardNum: "05", title: "From the Flight Deck – Phraseology", source: "FAA", youtubeId: "1D8-_p4f34I", why: "Why disciplined standard phraseology remains the baseline for safety.", tags: ["phraseology"] },
  { cardNum: "06", title: "Master the Helicopter ACS", source: "FAA Rotorcraft Collective", youtubeId: "HICmgQlXGqI", why: "What the practical test standard expects before your first check ride.", tags: ["exam-tips"] },
  { cardNum: "06", title: "Feeling the Pressure to Fly", source: "FAA Rotorcraft Collective", youtubeId: "jE2AbA8bpSQ", why: "Instructor advice often starts with resisting self-induced pressure to perform.", tags: ["decision-making"] },
  { cardNum: "07", title: "From the Flight Deck – Phraseology", source: "FAA", youtubeId: "1D8-_p4f34I", why: "Standard RT phraseology in practice — what examiners mean by clarity.", tags: ["phraseology"] },
  { cardNum: "08", title: "How to Become a Helicopter Pilot", source: "Helicopter Training Podcast", youtubeId: "nR1NJ_OmLnE", why: "Typical path into rotary-wing flying — useful framing before you tell your own story.", tags: ["motivation"] },
  { cardNum: "08", title: "Flying in the Unforgiving Wire Environment", source: "FAA Rotorcraft Collective", youtubeId: "dosTAQRpXII", why: "Helicopter versatility and unique missions — why many pilots choose rotors over fixed-wing.", tags: ["helicopter"] },
  { cardNum: "09", title: "Always Put Your Flightpath First", source: "FAA Rotorcraft Collective", youtubeId: "tWM5FMf5RCA", why: "Go-arounds and flightpath management when the approach becomes unstable.", tags: ["go-around", "procedures"] },
  { cardNum: "09", title: "Just Say No!", source: "FAA Rotorcraft Collective", youtubeId: "mphVLIg1LxM", why: "Do not force a landing — divert or try again when conditions are unsafe.", tags: ["decision-making"] },
  { cardNum: "10", title: "Master Your Mission in a Sim First", source: "FAA Rotorcraft Collective", youtubeId: "8aYPK6KQZ28", why: "Scenario-based sim training for risk management before the real aircraft.", tags: ["simulator", "emergency"] },
  { cardNum: "10", title: "Recognize the Early Signs of an Undesired Aircraft State", source: "FAA Rotorcraft Collective", youtubeId: "VdeuOVQyMlI", why: "Why sim practice helps you catch loss-of-control precursors early.", tags: ["emergency"] },
  { cardNum: "11", title: "Performance Planning & Power Management", source: "FAA Rotorcraft Collective", youtubeId: "9rMzjpNg5LQ", why: "Know power, weight, and performance limits — a classic instructor theme.", tags: ["performance"] },
  { cardNum: "11", title: "Feeling the Pressure to Fly", source: "FAA Rotorcraft Collective", youtubeId: "jE2AbA8bpSQ", why: "Safety and judgment beat speed, ego, or external pressure.", tags: ["decision-making"] },
  { cardNum: "12", title: "Sharing the Airspace with Drones", source: "FAA Rotorcraft Collective", youtubeId: "n3VAmMmSeNo", why: "Modern airspace is getting more complex — tech and vigilance together.", tags: ["technology"] },
  { cardNum: "12", title: "Practice Flying into IMC in a Sim", source: "FAA Rotorcraft Collective", youtubeId: "KJZlRR2dl9Q", why: "Training and simulation investment reflect where aviation is heading.", tags: ["simulator"] },
];

/** Extra curated videos for difficulty-area recommendations (Part 2 / vocabulary / pronunciation). */
const EXTRA_VIDEOS: Omit<IcaoFlixVideo, "id">[] = [
  {
    youtubeId: "1D8-_p4f34I",
    title: "From the Flight Deck – Phraseology",
    source: "FAA",
    why: "Standard RT phraseology — essential for Part 2 readback and interaction clarity.",
    category: "procedures",
    tags: ["phraseology", "part2-phraseology", "readback"],
    links: { difficultyAreas: ["part2"] },
  },
  {
    youtubeId: "gnSCpa2weUs",
    title: "Communication, CRM & Cockpit Safety",
    source: "Brian Schiff",
    why: "CRM and clear comms underpin every Part 2 abnormal situation report.",
    category: "safety_crm",
    tags: ["crm", "part2-interaction"],
    links: { difficultyAreas: ["part2"] },
  },
  {
    youtubeId: "xpMQNHvxC7c",
    title: "Preflighting Your Passengers",
    source: "FAA Rotorcraft Collective",
    why: "Structured briefing vocabulary — useful when building operational English fluency.",
    category: "helicopter",
    tags: ["vocabulary", "briefing"],
    links: { difficultyAreas: ["vocabulary"] },
  },
  {
    youtubeId: "HICmgQlXGqI",
    title: "Master the Helicopter ACS",
    source: "FAA Rotorcraft Collective",
    why: "Exam mindset and clear English under evaluation pressure.",
    category: "procedures",
    tags: ["exam-tips", "pronunciation"],
    links: { difficultyAreas: ["pronunciation"] },
  },
];

export const EUROSAFETY_CHANNEL_URL = "https://www.youtube.com/@EUROSAFETYTRAINING";
export const EUROSAFETY_SOURCE = "EuroSafety Training";

/** Curated helicopter training videos from @EUROSAFETYTRAINING. */
const EUROSAFETY_VIDEOS: Omit<IcaoFlixVideo, "id">[] = [
  {
    youtubeId: "SznLydO9DTE",
    title: "Garmin 750 Radio Frequencies: ATIS, UNICOM & Swaps",
    source: EUROSAFETY_SOURCE,
    why: "Real cockpit radio workflow — ATIS, UNICOM and frequency changes; vocabulary for Part 2 and clear readbacks.",
    category: "procedures",
    tags: ["phraseology", "part2-phraseology", "radio", "eurosafety"],
    links: { difficultyAreas: ["part2", "part1"], part1Cards: ["07"] },
    durationMin: 12,
  },
  {
    youtubeId: "MYSxozdCS0s",
    title: "EC130T2 Complete Preflight: Step-by-Step Walk",
    source: EUROSAFETY_SOURCE,
    why: "Structured preflight from a working helicopter base — context before briefing and CRM questions.",
    category: "helicopter",
    tags: ["briefing", "procedures", "eurosafety"],
    links: { difficultyAreas: ["part1", "vocabulary"], part1Cards: ["01"] },
    durationMin: 18,
  },
  {
    youtubeId: "REn3SZQS2Mo",
    title: "Helicopter Engine Failure: In-Flight Demo",
    source: EUROSAFETY_SOURCE,
    why: "See how a real engine failure unfolds — describe emergencies with operational detail in Part 1 and Part 2.",
    category: "safety_crm",
    tags: ["emergency", "part2-interaction", "eurosafety"],
    links: { difficultyAreas: ["part2", "part1"], part1Cards: ["10"] },
    durationMin: 8,
  },
  {
    youtubeId: "jWQuaE3hmdY",
    title: "Servo Transparency (Jack Stall): How It Happens",
    source: EUROSAFETY_SOURCE,
    why: "Technical hazard explained clearly — model for a difficult-flight story with cause, risk and conservative action.",
    category: "safety_crm",
    tags: ["decision-making", "helicopter", "eurosafety"],
    links: { difficultyAreas: ["part1"], part1Cards: ["02", "11"] },
    durationMin: 10,
  },
  {
    youtubeId: "_oMA3_-jH_8",
    title: "AS350B3e Cockpit Introduction: VEMD and Layout",
    source: EUROSAFETY_SOURCE,
    why: "Helicopter systems vocabulary in a real cockpit — describe aircraft, airport and daily operations.",
    category: "aircraft_tech",
    tags: ["helicopter", "vocabulary", "eurosafety"],
    links: { difficultyAreas: ["part1", "vocabulary"], part1Cards: ["03", "08"] },
    durationMin: 14,
  },
  {
    youtubeId: "2oCEWNGo3s8",
    title: "Helionix in the H145: Avionics Suite Intro",
    source: EUROSAFETY_SOURCE,
    why: "Modern avionics and digital workflow — vocabulary for future-of-aviation and technology questions.",
    category: "future",
    tags: ["technology", "eurosafety"],
    links: { difficultyAreas: ["part1"], part1Cards: ["05", "12"] },
    durationMin: 11,
  },
  {
    youtubeId: "t-4UrAS3l6Y",
    title: "AS350B3 Start with Checklist: Arriel 2B1 Procedure",
    source: EUROSAFETY_SOURCE,
    why: "Disciplined checklist culture from a professional training organisation — examiner-friendly procedure vocabulary.",
    category: "procedures",
    tags: ["procedures", "checklist", "eurosafety"],
    links: { difficultyAreas: ["part1", "vocabulary"], part1Cards: ["01", "11"] },
    durationMin: 9,
  },
  {
    youtubeId: "NnVJmEMu1z4",
    title: "EC130 Stuck Pedal Landing: Fenestron Procedure",
    source: EUROSAFETY_SOURCE,
    why: "Emergency procedure walkthrough — how to talk about abnormal situations, intentions and ATC coordination.",
    category: "procedures",
    tags: ["emergency", "go-around", "part2-interaction", "eurosafety"],
    links: { difficultyAreas: ["part2", "part1"], part1Cards: ["09", "10"] },
    durationMin: 7,
  },
  {
    youtubeId: "LlZFq_0eFPg",
    title: "AS350 Component Review: Major Systems Walk-Through",
    source: EUROSAFETY_SOURCE,
    why: "Helicopter systems overview — technical vocabulary examiners expect in aircraft and procedure answers.",
    category: "aircraft_tech",
    tags: ["helicopter", "vocabulary", "eurosafety"],
    links: { difficultyAreas: ["part1", "vocabulary"], part1Cards: ["03"] },
    durationMin: 16,
  },
  {
    youtubeId: "xoW9fRJ2EsY",
    title: "EC130T2 Interior: 1-Minute Walkthrough",
    source: EUROSAFETY_SOURCE,
    why: "Quick cabin and cockpit tour — describe helicopter layout, passenger briefing and operational context.",
    category: "helicopter",
    tags: ["briefing", "helicopter", "eurosafety"],
    links: { difficultyAreas: ["part1", "vocabulary"], part1Cards: ["01", "03"] },
    durationMin: 1,
  },
];

/** Extra videos to fill Personal, Airports, Future and General filters. */
const CATEGORY_SPOTLIGHT_VIDEOS: Omit<IcaoFlixVideo, "id">[] = [
  // Airports
  {
    youtubeId: "3RdAi9rmIPE",
    title: "From the Flight Deck – Centennial Airport (APA)",
    source: "FAA",
    why: "Busy GA airport with mixed traffic — vocabulary for describing facilities, runways and daily helicopter operations.",
    category: "airports",
    tags: ["airport", "traffic", "infrastructure"],
    links: { difficultyAreas: ["part1", "vocabulary"], part1Cards: ["03"] },
    durationMin: 8,
  },
  {
    youtubeId: "3w5MGOZzLxs",
    title: "From the Flight Deck – Manassas Regional Airport (HEF)",
    source: "FAA",
    why: "Regional airport layout and traffic patterns — model for describing where you operate and what makes it challenging.",
    category: "airports",
    tags: ["airport", "regional", "traffic"],
    links: { difficultyAreas: ["part1"], part1Cards: ["03"] },
    durationMin: 7,
  },
  {
    youtubeId: "69htdEOPy-I",
    title: "From the Flight Deck – Eastern Iowa Airport (CID)",
    source: "FAA",
    why: "Commercial and GA mix at a regional airport — useful detail for the 'describe your airport' Part 1 answer.",
    category: "airports",
    tags: ["airport", "commercial", "GA"],
    links: { difficultyAreas: ["part1"], part1Cards: ["03"] },
    durationMin: 9,
  },
  {
    youtubeId: "37Ih-ZkeWls",
    title: "From the Flight Deck – Waukesha County Airport (UES)",
    source: "FAA",
    why: "Smaller airport environment — contrast busy vs. quiet bases when describing your operating locations.",
    category: "airports",
    tags: ["airport", "regional"],
    links: { difficultyAreas: ["part1", "vocabulary"], part1Cards: ["03"] },
    durationMin: 6,
  },
  {
    youtubeId: "7DAeSNy_YUw",
    title: "From the Flight Deck – Runway Incursion Avoidance",
    source: "FAA",
    why: "Ground operations, taxiways and runway awareness — essential context for airport description and safety stories.",
    category: "airports",
    tags: ["airport", "safety", "ground-ops"],
    links: { difficultyAreas: ["part1", "part2"], part1Cards: ["03", "09"] },
    durationMin: 5,
  },
  // Personal
  {
    youtubeId: "3mnV2BKBRIg",
    title: "How to Become an Offshore Helicopter Pilot",
    source: "Aviation Career Guide",
    why: "Career path narrative — framing for 'why aviation' and 'how you became interested' personal questions.",
    category: "personal",
    tags: ["career", "motivation", "offshore"],
    links: { difficultyAreas: ["part1"], part1Cards: ["08"] },
    durationMin: 10,
  },
  {
    youtubeId: "0I6hc8Nkes0",
    title: "How to Be a Pilot — Guide to Helicopter Careers",
    source: "Aviation Career Guide",
    why: "Overview of helicopter career options — helps you speak naturally about your path into aviation.",
    category: "personal",
    tags: ["career", "motivation"],
    links: { difficultyAreas: ["part1"], part1Cards: ["08"] },
    durationMin: 12,
  },
  {
    youtubeId: "5SwqL_nuQsE",
    title: "Helicopter Pilot Jobs — 18 Positions Explained",
    source: "Aviation Career Guide",
    why: "Mission types and career diversity — rich vocabulary for personal story and future-of-aviation answers.",
    category: "personal",
    tags: ["career", "missions", "motivation"],
    links: { difficultyAreas: ["part1", "vocabulary"], part1Cards: ["08", "12"] },
    durationMin: 14,
  },
  // Future
  {
    youtubeId: "1sfVuJlPQoY",
    title: "A New Era of Aviation — Advanced Air Mobility Webinar",
    source: "FAA",
    why: "eVTOL, AAM and regulatory evolution — strong reference for how Brazilian aviation may change.",
    category: "future",
    tags: ["technology", "AAM", "eVTOL"],
    links: { difficultyAreas: ["part1"], part1Cards: ["05", "12"] },
    durationMin: 60,
  },
  {
    youtubeId: "3HLF7ZnM4c4",
    title: "Safety First — FAA's Role in Shaping the AAM Landscape",
    source: "FAA",
    why: "How new aircraft types integrate safely — technology + safety culture for future aviation answers.",
    category: "future",
    tags: ["technology", "AAM", "safety"],
    links: { difficultyAreas: ["part1"], part1Cards: ["12"] },
    durationMin: 15,
  },
  {
    youtubeId: "5Hhw5yeWQ-M",
    title: "Recreational Drone Pilot Test (FAA TRUST)",
    source: "FAA",
    why: "Drones sharing airspace with helicopters — concrete example for future airspace complexity (Q12).",
    category: "future",
    tags: ["technology", "drone", "UAS"],
    links: { difficultyAreas: ["part1"], part1Cards: ["12"] },
    durationMin: 6,
  },
  {
    youtubeId: "3bA2YLFhSXI",
    title: "First eVTOL Flight Between Public Airports — Joby Aviation",
    source: "Joby Aviation",
    why: "Real AAM milestone — cite as evidence that aviation technology is changing fast.",
    category: "future",
    tags: ["technology", "eVTOL", "AAM"],
    links: { difficultyAreas: ["part1"], part1Cards: ["12"] },
    durationMin: 3,
  },
  // General
  {
    youtubeId: "03OYoMmuGPo",
    title: "5 Ways Pilots Fail Their Checkride — Avoid These Mistakes",
    source: "FAA Safety",
    why: "Examiner mindset and common errors — pairs with instructor-advice and check-ride preparation questions.",
    category: "general",
    tags: ["exam-tips", "checkride"],
    links: { difficultyAreas: ["part1", "pronunciation"], part1Cards: ["06"] },
    durationMin: 8,
  },
  {
    youtubeId: "303Pd_2UAmU",
    title: "From the Flight Deck — Human Factors: The Myth of Multitasking",
    source: "FAA",
    why: "Workload and human limits — general aviation knowledge that supports medical, CRM and safety answers.",
    category: "general",
    tags: ["human-factors", "workload"],
    links: { difficultyAreas: ["part1"], part1Cards: ["04", "06"] },
    durationMin: 4,
  },
  {
    youtubeId: "2xSZIETO_l8",
    title: "Don't Forget to See and Avoid Other Aircraft",
    source: "FAA Rotorcraft Collective",
    why: "Fundamental airmanship — general safety awareness applicable across Part 1 topics.",
    category: "general",
    tags: ["safety", "see-and-avoid"],
    links: { difficultyAreas: ["part1"], part1Cards: ["06"] },
    durationMin: 3,
  },
  {
    youtubeId: "7ZYxyF-5KPI",
    title: "How the FAA Responds to Severe Weather",
    source: "FAA",
    why: "Weather decision-making at system level — supports difficult-flight stories and airport weather challenges.",
    category: "general",
    tags: ["weather", "decision-making"],
    links: { difficultyAreas: ["part1"], part1Cards: ["02", "03"] },
    durationMin: 5,
  },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function mergeVideoIntoCatalog(
  byYoutube: Map<string, IcaoFlixVideo>,
  incoming: Omit<IcaoFlixVideo, "id">,
  idPrefix: string,
): void {
  const existing = byYoutube.get(incoming.youtubeId);

  if (existing) {
    const cards = new Set([...(existing.links.part1Cards ?? []), ...(incoming.links.part1Cards ?? [])]);
    if (cards.size) existing.links.part1Cards = [...cards].sort();
    const areas = new Set([...(existing.links.difficultyAreas ?? []), ...(incoming.links.difficultyAreas ?? [])]);
    if (areas.size) existing.links.difficultyAreas = [...areas];
    existing.tags = [...new Set([...existing.tags, ...incoming.tags])];
    if (incoming.durationMin && !existing.durationMin) existing.durationMin = incoming.durationMin;
    return;
  }

  byYoutube.set(incoming.youtubeId, {
    ...incoming,
    id: `${idPrefix}-${slugify(incoming.title)}`,
  });
}

function buildCatalog(): IcaoFlixVideo[] {
  const byYoutube = new Map<string, IcaoFlixVideo>();

  for (const raw of RAW_BRIEF_VIDEOS) {
    const card = raw.cardNum.padStart(2, "0");
    const category = CARD_FLIX_CATEGORY[card] ?? CARD_CATEGORY[card] ?? "general";
    mergeVideoIntoCatalog(
      byYoutube,
      {
        youtubeId: raw.youtubeId,
        title: raw.title,
        source: raw.source,
        why: raw.why,
        category,
        tags: raw.tags ?? [],
        links: { part1Cards: [card], difficultyAreas: ["part1"] },
      },
      `brief-${card}`,
    );
  }

  for (const extra of EXTRA_VIDEOS) {
    mergeVideoIntoCatalog(byYoutube, extra, "extra");
  }

  for (const euro of EUROSAFETY_VIDEOS) {
    mergeVideoIntoCatalog(byYoutube, euro, "euro");
  }

  for (const spotlight of CATEGORY_SPOTLIGHT_VIDEOS) {
    mergeVideoIntoCatalog(byYoutube, spotlight, "spot");
  }

  return applyCategoryOverrides([...byYoutube.values()]).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

function applyCategoryOverrides(videos: IcaoFlixVideo[]): IcaoFlixVideo[] {
  return videos.map((video) => {
    const override = VIDEO_CATEGORY_OVERRIDES[video.youtubeId];
    return override ? { ...video, category: override } : video;
  });
}

export const ICAO_FLIX_VIDEOS: IcaoFlixVideo[] = buildCatalog();

export function getIcaoFlixVideo(id: string): IcaoFlixVideo | undefined {
  return ICAO_FLIX_VIDEOS.find((v) => v.id === id);
}

export function getVideosForPart1Card(cardNum: string): IcaoFlixVideo[] {
  const key = cardNum.padStart(2, "0");
  return ICAO_FLIX_VIDEOS.filter((v) => v.links.part1Cards?.includes(key));
}

export function getVideosByCategory(category: Category | "all"): IcaoFlixVideo[] {
  if (category === "all") return ICAO_FLIX_VIDEOS;
  return ICAO_FLIX_VIDEOS.filter((v) => v.category === category);
}

export function getEuroSafetyVideos(): IcaoFlixVideo[] {
  return ICAO_FLIX_VIDEOS.filter((v) => v.source === EUROSAFETY_SOURCE);
}

export function isEuroSafetyVideo(video: IcaoFlixVideo): boolean {
  return video.source === EUROSAFETY_SOURCE;
}

export function youtubeThumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
}
