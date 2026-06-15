import fs from "fs";

const path = new URL("../cards.json", import.meta.url);
const cards = JSON.parse(fs.readFileSync(path, "utf8"));

function rebuild(card) {
  card.answer = [card.opener, ...card.ideas, card.example, card.conclusion].join(" ");
  card.targetWords = card.answer.split(/\s+/).filter(Boolean).length;
  card.category = "helicopter";
  card.tags = ["helicopter", card.difficulty.toLowerCase(), ...(card.tags || []).filter((t) => t !== "personal" && t !== "future" && t !== "procedures" && t !== "safety crm")].slice(0, 3);
  if (!card.tags.includes("helicopter")) card.tags.unshift("helicopter");
  if (!card.memoryLabels) {
    card.memoryLabels = card.memory.includes("→")
      ? card.memory.split("→").map((x) => x.trim())
      : card.ideas.map((idea) => {
          const m = idea.match(/^[0-9] - ([^:]+):/);
          return m ? m[1].trim() : idea;
        });
  }
  return card;
}

const updates = {
  "03": {
    question: "Why do pilots need to take medical exams?",
    memory: "H-M-S",
    opener: "In my opinion, medical exams are extremely important for helicopter pilots.",
    ideas: [
      "1 - PHYSICAL HEALTH: First of all, they help identify medical conditions early and keep pilots fit for demanding helicopter operations.",
      "2 - MENTAL HEALTH: Additionally, they help monitor stress, fatigue and concentration, which are critical in single-pilot helicopter flights.",
      "3 - FLIGHT SAFETY: Finally, they ensure the pilot is medically fit to manage hover, low-level flying and high workload safely.",
    ],
    example:
      "For example, a pilot with undetected fatigue or balance problems may have slower reactions during approach and landing to a confined helipad.",
    conclusion:
      "Overall, regular medical exams protect the pilot, passengers and flight safety in helicopter operations.",
    verbs: ["perform", "identify", "monitor", "prevent", "ensure"],
    vocab: ["medical exams", "fatigue", "fit to fly", "helicopter operations", "flight safety"],
    difficulty: "Easy",
  },
  "11": {
    question: "How did you become interested in aviation?",
    memory: "C-I-P",
    opener: "I became interested in aviation because helicopters and aircraft have always caught my attention.",
    ideas: [
      "1 - CHILDHOOD: First of all, when I was younger, I used to admire helicopters and the way pilots operated them with precision.",
      "2 - INSPIRATION: Additionally, I was fascinated by the responsibility, technology and freedom involved in rotary-wing flying.",
      "3 - PROFESSION: Finally, over time, that interest became a real goal to become a professional helicopter pilot.",
    ],
    example:
      "For example, every time I saw a helicopter taking off vertically, I wanted to understand how pilots managed control, power and situational awareness.",
    conclusion: "Overall, my interest in aviation started as curiosity and became a lifelong helicopter career.",
    verbs: ["become", "admire", "learn", "develop", "choose"],
    vocab: ["aviation", "helicopters", "rotary-wing", "interest", "career"],
    difficulty: "Easy",
  },
  "31": {
    question: "In your opinion, what makes a briefing effective?",
    memory: "Information → Risk Awareness → Team Coordination",
    opener: "In my opinion, an effective helicopter briefing is clear, complete and focused on safety.",
    ideas: [
      "1 - INFORMATION: First of all, it must include weather, wind, landing site conditions, aircraft status, fuel, passengers and route limitations.",
      "2 - RISK AWARENESS: Additionally, it should discuss power margins, obstacles, emergency landing areas and abnormal procedures before departure.",
      "3 - TEAM COORDINATION: Finally, it aligns the crew and gives everyone the chance to clarify doubts before helicopter operations.",
    ],
    example:
      "For example, if wind or visibility may affect the landing site, the crew should discuss alternate options and decision points before takeoff.",
    conclusion: "Overall, an effective briefing improves coordination, reduces uncertainty and enhances helicopter flight safety.",
    verbs: ["brief", "clarify", "coordinate", "anticipate", "prepare"],
    vocab: ["briefing", "landing site", "weather", "power margin", "helicopter"],
    difficulty: "Easy",
  },
  "32": {
    question: "What was the most difficult situation you have had in a flight?",
    memory: "Situation → Actions → Lesson",
    opener: "One of the most difficult situations I have had in helicopter flight was related to weather and visibility near the landing site.",
    ideas: [
      "1 - SITUATION: First of all, the visibility started to decrease and the workload increased quickly during the final phase of flight.",
      "2 - ACTIONS: Additionally, I had to stay calm, monitor power and wind, communicate clearly and choose the safest option.",
      "3 - LESSON: Finally, that experience reinforced the importance of preparation, conservative decisions and knowing when to divert.",
    ],
    example:
      "For example, instead of forcing a landing in deteriorating conditions, a helicopter pilot should be ready to delay, divert or return to a safer area.",
    conclusion:
      "Overall, difficult situations are challenging, but they help helicopter pilots become more disciplined and safety-oriented.",
    verbs: ["face", "manage", "communicate", "decide", "learn"],
    vocab: ["difficult situation", "visibility", "landing site", "workload", "divert"],
    difficulty: "Hard",
  },
  "33": {
    question: "What advice did your instructor give you before your first check ride?",
    memory: "Preparation → Calmness → Safety",
    opener: "Before my first helicopter check ride, my instructor gave me advice that I still remember today.",
    ideas: [
      "1 - PREPARATION: First of all, he told me to review procedures, performance limits and emergency actions for the helicopter.",
      "2 - CALMNESS: Additionally, he advised me to stay calm during hover, transitions and maneuvering under evaluation.",
      "3 - SAFETY: Finally, he said that safety and good judgment were more important than trying to look perfect.",
    ],
    example:
      "For example, if a maneuver did not go exactly as planned, I should correct it calmly, communicate and keep flying safely.",
    conclusion:
      "Overall, his advice helped me understand that a good helicopter pilot is prepared, calm and focused on safety.",
    verbs: ["prepare", "trust", "focus", "follow", "demonstrate"],
    vocab: ["check ride", "instructor", "hover", "procedures", "safety"],
    difficulty: "Easy",
  },
  "34": {
    question: "What will communications between pilots and ATC be like in ten years?",
    memory: "Technology → Clarity → Safety",
    opener:
      "In my opinion, communication between helicopter pilots and ATC will become more technological in the next ten years.",
    ideas: [
      "1 - TECHNOLOGY: First of all, digital systems and better surveillance may improve coordination for helicopters and helipad operations.",
      "2 - CLARITY: Additionally, standard phraseology will still be essential because pilots and controllers need clear and fast communication.",
      "3 - SAFETY: Finally, technology may reduce misunderstandings during busy airspace and low-level helicopter operations.",
    ],
    example:
      "For example, digital clearances and better helipad information may help, but pilots will still need to read back and confirm instructions correctly.",
    conclusion:
      "Overall, ATC communication will become more advanced, but clarity and discipline will remain essential for helicopter pilots.",
    verbs: ["change", "support", "communicate", "reduce", "improve"],
    vocab: ["ATC", "helicopter", "phraseology", "helipad", "communication"],
    difficulty: "Medium",
  },
  "35": {
    question: "Why is the use of ICAO phraseology important?",
    memory: "Standardization → Communication → Safety",
    opener: "In my opinion, ICAO phraseology is essential because helicopter operations also depend on clear communication.",
    ideas: [
      "1 - STANDARDIZATION: First of all, it creates a standard language that pilots and controllers can understand worldwide.",
      "2 - COMMUNICATION: Additionally, it makes radio calls shorter, clearer and more objective, especially during high workload in the cockpit.",
      "3 - SAFETY: Finally, it reduces misunderstandings during hover, departure, approach and emergency situations.",
    ],
    example:
      "For example, during an emergency in a busy area, standard phraseology helps ATC understand the helicopter position and intention quickly.",
    conclusion:
      "Overall, ICAO phraseology improves communication, reduces confusion and plays a crucial role in helicopter flight safety.",
    verbs: ["standardize", "clarify", "reduce", "prevent", "ensure"],
    vocab: ["ICAO phraseology", "ATC", "helicopter", "communication", "flight safety"],
    difficulty: "Medium",
  },
  "36": {
    question: "When should a pilot perform a missed approach procedure?",
    memory: "Unstable → Weather → Safety",
    opener:
      "In helicopter operations, a pilot should discontinue the approach whenever the landing cannot be continued safely.",
    ideas: [
      "1 - UNSTABLE APPROACH: First of all, if the approach is unstable, speed, alignment or power are not correct, the safest decision is to go around.",
      "2 - WEATHER: Additionally, poor visibility, strong wind or an obscured landing site may require a missed approach.",
      "3 - SAFETY: Finally, pilots should never force a landing just because they are close to the landing area.",
    ],
    example:
      "For example, if the landing site is blocked, power margin is insufficient or the approach becomes unstable, the pilot should climb away and reassess.",
    conclusion:
      "Overall, a missed approach is not a failure; it is a safe and professional decision in helicopter operations.",
    verbs: ["perform", "continue", "go around", "assess", "discontinue"],
    vocab: ["missed approach", "landing site", "power margin", "visibility", "safety"],
    difficulty: "Hard",
  },
  "37": {
    question: "How does a flight simulator help a pilot train for emergencies?",
    memory: "Practice → Emergency → Decision Making",
    opener: "In my opinion, a helicopter flight simulator is one of the best tools for emergency training.",
    ideas: [
      "1 - PRACTICE: First of all, it allows pilots to practice abnormal situations without putting anyone at risk.",
      "2 - EMERGENCY: Additionally, pilots can train engine failure, hydraulics off, bad weather and emergency landing procedures.",
      "3 - DECISION MAKING: Finally, simulators improve reaction time, confidence and decision making under pressure.",
    ],
    example:
      "For example, a pilot can practice autorotation and engine failure after takeoff several times until the correct response becomes more natural.",
    conclusion:
      "Overall, helicopter simulator training improves preparation, reduces stress and enhances flight safety.",
    verbs: ["train", "practice", "simulate", "react", "improve"],
    vocab: ["flight simulator", "autorotation", "engine failure", "emergency training", "decision making"],
    difficulty: "Hard",
  },
  "38": {
    question: "How do you think Brazilian aviation will change in the near future?",
    memory: "Technology → Growth → Safety",
    opener:
      "From my point of view, Brazilian aviation, especially helicopter operations, will continue to grow and modernize.",
    ideas: [
      "1 - TECHNOLOGY: First of all, helicopters, helipads and navigation systems will become more technological and connected.",
      "2 - GROWTH: Additionally, regional and offshore helicopter operations may expand because Brazil is a large country with diverse missions.",
      "3 - SAFETY: Finally, training, regulation and safety culture in rotary-wing aviation will probably continue to improve.",
    ],
    example:
      "For example, better helipad infrastructure and more modern helicopters can support offshore, HEMS and executive operations more safely.",
    conclusion:
      "Overall, I believe Brazilian helicopter aviation has a strong future if technology and safety continue improving together.",
    verbs: ["grow", "modernize", "improve", "expand", "develop"],
    vocab: ["Brazilian aviation", "helicopter", "offshore", "HEMS", "helipad"],
    difficulty: "Medium",
  },
};

for (const [num, patch] of Object.entries(updates)) {
  const idx = cards.findIndex((c) => c.num === num);
  if (idx === -1) throw new Error(`Card ${num} not found`);
  cards[idx] = rebuild({ ...cards[idx], ...patch });
}

const card43 = rebuild({
  num: "43",
  question: "What were the best pieces of advice your instructor gave you?",
  memory: "Discipline → Limits → Safety",
  opener: "During my helicopter training, my instructor gave me several pieces of advice that I still follow today.",
  ideas: [
    "1 - DISCIPLINE: First of all, he told me to respect procedures, checklists and standard calls in every phase of flight.",
    "2 - LIMITS: Additionally, he advised me to know the aircraft limits, especially power, weight and weather limitations.",
    "3 - SAFETY: Finally, he said that safety and good judgment are always more important than speed or ego.",
  ],
  example:
    "For example, he always told me not to rush a hover or landing just because someone was waiting on the ground.",
  conclusion:
    "Overall, the best advice was to stay disciplined, know my limits and make conservative decisions as a helicopter pilot.",
  verbs: ["respect", "know", "follow", "decide", "learn"],
  vocab: ["instructor", "discipline", "limits", "hover", "safety"],
  difficulty: "Easy",
});

if (cards.some((c) => c.num === "43")) {
  cards.splice(
    cards.findIndex((c) => c.num === "43"),
    1,
    card43,
  );
} else {
  cards.push(card43);
}

fs.writeFileSync(path, JSON.stringify(cards, null, 2) + "\n");
console.log("Updated helicopter cards:", Object.keys(updates).concat("43").join(", "));
console.log("Total cards:", cards.length);
