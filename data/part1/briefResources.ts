/** Curated brief-step media aligned with FAA, SKYbrary OGHFA, and CRM practice. */
export type Part1BriefResource = {
  title: string;
  source: string;
  youtubeId: string;
  why: string;
};

export type Part1BriefLink = {
  title: string;
  source: string;
  href: string;
  why: string;
};

export type Part1BriefPack = {
  /** Context line shown above the media for this exam question. */
  lead: string;
  videos: Part1BriefResource[];
  links: Part1BriefLink[];
};

export const PART1_BRIEF_RESOURCES: Record<string, Part1BriefPack> = {
  "01": {
    lead:
      "Watch before you build your answer — FAA helicopter briefing practice and crew resource management.",
    videos: [
      {
        title: "Preflighting Your Passengers",
        source: "FAA Rotorcraft Collective",
        youtubeId: "xpMQNHvxC7c",
        why: "FAA best practices for a structured, safety-focused helicopter briefing before flight.",
      },
      {
        title: "Communication, CRM & Cockpit Safety",
        source: "Brian Schiff",
        youtubeId: "gnSCpa2weUs",
        why: "Why interactive crew briefings and shared mental models matter (CRM).",
      },
    ],
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
    videos: [
      {
        title: "Beware of the Green Dot Syndrome",
        source: "FAA Rotorcraft Collective",
        youtubeId: "UOhPvJfPsCw",
        why: "Weather can look acceptable on paper while approach workload and visibility deteriorate.",
      },
      {
        title: "Just Say No!",
        source: "FAA Rotorcraft Collective",
        youtubeId: "mphVLIg1LxM",
        why: "Personal minimums and saying no when conditions are not safe — core to a good difficult-flight story.",
      },
    ],
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
    videos: [
      {
        title: "From the Flight Deck – Dekalb-Peachtree Airport (PDK)",
        source: "FAA",
        youtubeId: "tXWnj0odAeo",
        why: "Busy GA airport with airlines, business jets, and a strong helicopter community — a model for describing mixed traffic.",
      },
      {
        title: "From the Flight Deck – Van Nuys Airport (VNY)",
        source: "FAA",
        youtubeId: "oQjOxHqBV8Q",
        why: "One of the busiest GA airports — helicopter tours, training, and daily traffic; vocabulary for infrastructure and complexity.",
      },
    ],
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
    videos: [
      {
        title: "Fuel Yourself for a Safe Flight",
        source: "FAA Rotorcraft Collective",
        youtubeId: "7t09BvoU7I4",
        why: "Pilot as the critical system — nutrition, hydration, and mental readiness.",
      },
      {
        title: "Don't Fly Fatigued",
        source: "FAA Rotorcraft Collective",
        youtubeId: "P5jAqp-I_tk",
        why: "Fatigue monitoring is a major reason recurrent medical checks matter.",
      },
    ],
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
    videos: [
      {
        title: "CPDLC — Controller-Pilot Datalink Communication",
        source: "Aviation Explained",
        youtubeId: "jMsAv5dgGNg",
        why: "How digital clearance delivery is changing routine pilot–ATC workflow.",
      },
      {
        title: "From the Flight Deck – Phraseology",
        source: "FAA",
        youtubeId: "1D8-_p4f34I",
        why: "Why disciplined standard phraseology remains the baseline for safety.",
      },
    ],
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
    videos: [
      {
        title: "Master the Helicopter ACS",
        source: "FAA Rotorcraft Collective",
        youtubeId: "HICmgQlXGqI",
        why: "What the practical test standard expects before your first check ride.",
      },
      {
        title: "Feeling the Pressure to Fly",
        source: "FAA Rotorcraft Collective",
        youtubeId: "jE2AbA8bpSQ",
        why: "Instructor advice often starts with resisting self-induced pressure to perform.",
      },
    ],
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
    videos: [
      {
        title: "From the Flight Deck – Phraseology",
        source: "FAA",
        youtubeId: "1D8-_p4f34I",
        why: "Standard RT phraseology in practice — what examiners mean by clarity.",
      },
    ],
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
    videos: [
      {
        title: "How to Become a Helicopter Pilot",
        source: "Helicopter Training Podcast",
        youtubeId: "nR1NJ_OmLnE",
        why: "Typical path into rotary-wing flying — useful framing before you tell your own story.",
      },
      {
        title: "Flying in the Unforgiving Wire Environment",
        source: "FAA Rotorcraft Collective",
        youtubeId: "dosTAQRpXII",
        why: "Helicopter versatility and unique missions — why many pilots choose rotors over fixed-wing.",
      },
    ],
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
    videos: [
      {
        title: "Always Put Your Flightpath First",
        source: "FAA Rotorcraft Collective",
        youtubeId: "tWM5FMf5RCA",
        why: "Go-arounds and flightpath management when the approach becomes unstable.",
      },
      {
        title: "Just Say No!",
        source: "FAA Rotorcraft Collective",
        youtubeId: "mphVLIg1LxM",
        why: "Do not force a landing — divert or try again when conditions are unsafe.",
      },
    ],
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
    videos: [
      {
        title: "Master Your Mission in a Sim First",
        source: "FAA Rotorcraft Collective",
        youtubeId: "8aYPK6KQZ28",
        why: "Scenario-based sim training for risk management before the real aircraft.",
      },
      {
        title: "Recognize the Early Signs of an Undesired Aircraft State",
        source: "FAA Rotorcraft Collective",
        youtubeId: "VdeuOVQyMlI",
        why: "Why sim practice helps you catch loss-of-control precursors early.",
      },
    ],
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
    videos: [
      {
        title: "Performance Planning & Power Management",
        source: "FAA Rotorcraft Collective",
        youtubeId: "9rMzjpNg5LQ",
        why: "Know power, weight, and performance limits — a classic instructor theme.",
      },
      {
        title: "Feeling the Pressure to Fly",
        source: "FAA Rotorcraft Collective",
        youtubeId: "jE2AbA8bpSQ",
        why: "Safety and judgment beat speed, ego, or external pressure.",
      },
    ],
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
    videos: [
      {
        title: "Sharing the Airspace with Drones",
        source: "FAA Rotorcraft Collective",
        youtubeId: "n3VAmMmSeNo",
        why: "Modern airspace is getting more complex — tech and vigilance together.",
      },
      {
        title: "Practice Flying into IMC in a Sim",
        source: "FAA Rotorcraft Collective",
        youtubeId: "KJZlRR2dl9Q",
        why: "Training and simulation investment reflect where aviation is heading.",
      },
    ],
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

const ALL_PART1_CARD_NUMS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

export function getPart1BriefPack(cardNum: string): Part1BriefPack {
  const key = cardNum.padStart(2, "0");
  return (
    PART1_BRIEF_RESOURCES[key] ?? {
      lead: "Watch a reference before you build your answer — operational context, not a script.",
      videos: [],
      links: [],
    }
  );
}

/** Ensures every Part 1 bank card has at least one curated brief resource. */
export function assertPart1BriefResourcesComplete(): void {
  for (const num of ALL_PART1_CARD_NUMS) {
    const pack = PART1_BRIEF_RESOURCES[num];
    if (!pack) {
      throw new Error(`Part 1 brief resources missing card ${num}`);
    }
    if (pack.videos.length + pack.links.length === 0) {
      throw new Error(`Part 1 brief resources empty for card ${num}`);
    }
    if (!pack.lead.trim()) {
      throw new Error(`Part 1 brief lead missing for card ${num}`);
    }
  }
}
