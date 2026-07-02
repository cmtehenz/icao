#!/usr/bin/env node
/**
 * Enriquece os 12 cards com modo ICAO 4 fácil: level4Steps, studyTips, memoryIcons, etc.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cardsPath = join(root, "cards.json");

/** @type {Record<string, object>} */
const ENRICH = {
  "01": {
    memory: "Clear → Information → Risk → Team",
    memoryLabels: ["Clear", "Information", "Risk", "Team"],
    keywords: ["Clear", "Information", "Risk", "Team"],
    memoryIcons: ["📋", "🌤️", "⚠️", "👥"],
    answerLevel4:
      "In my opinion, an effective briefing is clear, complete and focused on safety. It must include weather, landing site conditions, fuel and aircraft status. It should also discuss risks, obstacles and emergency options. As a result, the whole crew is aligned before departure.",
    answerLevel5:
      "In my opinion, an effective helicopter briefing is clear, complete and focused on safety. First of all, it must include weather, wind, landing site conditions, aircraft status, fuel and route limitations. Additionally, it should discuss power margins, obstacles, emergency landing areas and abnormal procedures. Finally, it aligns the crew and gives everyone the chance to clarify doubts before operations. For example, if wind or visibility may affect the landing site, the crew should discuss alternate options before takeoff. Overall, an effective briefing improves coordination and enhances flight safety.",
    level4Example:
      "For example, if wind or visibility may affect the landing site, the crew should discuss alternate options before takeoff.",
    level4Steps: [
      { label: "Clear", sentence: "An effective briefing is clear, complete and focused on safety." },
      { label: "Information", sentence: "It must include weather, landing site conditions, fuel and aircraft status." },
      { label: "Risk", sentence: "It should also discuss risks, obstacles and emergency options." },
      { label: "Team", sentence: "As a result, the whole crew is aligned before departure." },
    ],
    studyTips:
      "Palavras-chave para decorar: Clear → Information → Risk → Team\n\nSequência lógica:\n\n• O que é? → Briefing claro e completo.\n• O que inclui? → Weather, site, fuel, aircraft.\n• O que antecipa? → Riscos e emergências.\n• Qual o resultado? → Crew alinhada.\n\nConectores fáceis: Also, / It also / As a result,\n\nCom essas quatro ideias você fala 45–60 segundos sem decorar texto inteiro.",
  },
  "02": {
    memoryLabels: ["Situation", "Actions", "Lesson"],
    keywords: ["Situation", "Actions", "Lesson"],
    memoryIcons: ["🌧️", "✈️", "💡"],
    answerLevel4:
      "One difficult situation I had was related to weather and visibility near the landing site. The visibility decreased and the workload increased quickly. I stayed calm, communicated clearly and chose the safest option. That experience taught me to prepare better and divert when necessary.",
    answerLevel5:
      "One of the most difficult situations I have had in helicopter flight was related to weather and visibility near the landing site. First of all, the visibility started to decrease and the workload increased quickly during the final phase of flight. Additionally, I had to stay calm, monitor power and wind, communicate clearly and choose the safest option. Finally, that experience reinforced the importance of preparation, conservative decisions and knowing when to divert. For example, instead of forcing a landing in deteriorating conditions, a pilot should be ready to delay, divert or return to a safer area. Overall, difficult situations help pilots become more disciplined and safety-oriented.",
    level4Example:
      "For example, instead of forcing a landing in bad conditions, I was ready to divert to a safer area.",
    level4Steps: [
      { label: "Situation", sentence: "One difficult situation I had was related to weather and visibility near the landing site." },
      { label: "Actions", sentence: "I stayed calm, communicated clearly and chose the safest option." },
      { label: "Lesson", sentence: "That experience taught me to prepare better and divert when necessary." },
    ],
    studyTips:
      "Palavras-chave para decorar: Situation → Actions → Lesson\n\nHistória em 3 partes (STAR simplificado):\n\n• Situation → O que aconteceu? (weather, visibility)\n• Actions → O que você fez? (calm, communicate, decide)\n• Lesson → O que aprendeu? (prepare, divert, safety)\n\nConectores: First, / Also, / Finally, / For example,\n\nConte como uma história real — não precisa decorar palavra por palavra.",
  },
  "03": {
    memoryLabels: ["Preparation", "Calmness", "Safety"],
    keywords: ["Preparation", "Calmness", "Safety"],
    memoryIcons: ["📖", "😌", "🛡️"],
    answerLevel4:
      "Before my first check ride, my instructor gave me important advice. He told me to review procedures and emergency actions. He also advised me to stay calm during hover and maneuvers. Finally, he said safety and good judgment are more important than looking perfect.",
    answerLevel5:
      "Before my first helicopter check ride, my instructor gave me advice that I still remember today. First of all, he told me to review procedures, performance limits and emergency actions for the helicopter. Additionally, he advised me to stay calm during hover, transitions and maneuvering under evaluation. Finally, he said that safety and good judgment were more important than trying to look perfect. For example, if a maneuver did not go exactly as planned, I should correct it calmly, communicate and keep flying safely. Overall, his advice helped me understand that a good pilot is prepared, calm and focused on safety.",
    level4Example:
      "For example, if a maneuver did not go as planned, I should correct it calmly and keep flying safely.",
    level4Steps: [
      { label: "Preparation", sentence: "He told me to review procedures and emergency actions." },
      { label: "Calmness", sentence: "He advised me to stay calm during hover and maneuvers." },
      { label: "Safety", sentence: "Safety and good judgment are more important than looking perfect." },
    ],
    studyTips:
      "Palavras-chave: Preparation → Calmness → Safety\n\n• O que estudar? → Procedures e emergências.\n• Como agir? → Stay calm no hover.\n• O que importa? → Safety first, not ego.\n\nConectores: He told me... / He also... / Finally,\n\nPergunta pessoal — use experiência real do seu check ride.",
  },
  "04": {
    memory: "Physical → Mental → Safety",
    memoryLabels: ["Physical", "Mental", "Safety"],
    keywords: ["Physical", "Mental", "Safety"],
    memoryIcons: ["💪", "🧠", "✈️"],
    answerLevel4:
      "Medical exams are extremely important for pilots. They help identify physical conditions early and keep pilots fit to fly. They also monitor stress, fatigue and concentration. As a result, they protect the pilot, passengers and flight safety.",
    answerLevel5:
      "In my opinion, medical exams are extremely important for helicopter pilots. First of all, they help identify medical conditions early and keep pilots fit for demanding helicopter operations. Additionally, they help monitor stress, fatigue and concentration, which are critical in single-pilot helicopter flights. Finally, they ensure the pilot is medically fit to manage hover, low-level flying and high workload safely. For example, a pilot with undetected fatigue may have slower reactions during approach and landing. Overall, regular medical exams protect the pilot, passengers and flight safety.",
    level4Example:
      "For example, a pilot with undetected fatigue may have slower reactions during approach and landing.",
    level4Steps: [
      { label: "Physical", sentence: "Medical exams identify physical conditions and keep pilots fit to fly." },
      { label: "Mental", sentence: "They also monitor stress, fatigue and concentration." },
      { label: "Safety", sentence: "As a result, they protect the pilot, passengers and flight safety." },
    ],
    studyTips:
      "Palavras-chave: Physical → Mental → Safety (lembre H-M-S)\n\n• Physical → Fit to fly, condições médicas.\n• Mental → Stress, fatigue, concentração.\n• Safety → Protege piloto, passageiros e operação.\n\nConectores: They help... / They also... / As a result,\n\nPergunta factual — 3 frases bastam para ICAO 4.",
  },
  "05": {
    memory: "Digital → AI → Radio → Safety",
    memoryLabels: ["Digital", "AI", "Radio", "Safety"],
    keywords: ["Digital", "AI", "Radio", "Safety"],
    memoryIcons: ["📱", "🤖", "📻", "🛡️"],
    answerLevel5:
      "In my opinion, communication between pilots and ATC will become more digital in the next ten years. First of all, AI will probably help pilots and controllers with routine tasks and reduce workload on standard clearances. Additionally, pilots and ATC will still communicate by radio, especially during emergencies when clear and immediate contact is critical. Finally, human communication will remain essential because flight safety depends on judgment, confirmation and teamwork. For example, AI may support routine clearances, but during an emergency pilots still need direct voice contact with ATC. Overall, technology will support communication, but human interaction will always be essential for flight safety.",
    level4Example:
      "For example, AI may support routine clearances, but during an emergency pilots still need direct voice contact with ATC.",
    level4Steps: [
      { label: "Digital", sentence: "Communication will become more digital in the future." },
      { label: "AI", sentence: "AI will probably help pilots and controllers with routine tasks." },
      { label: "Radio", sentence: "However, pilots and ATC will still communicate by radio, especially during emergencies." },
      { label: "Safety", sentence: "Human communication will always be essential for flight safety." },
    ],
    studyTips:
      "Palavras-chave: Digital → AI → Radio → Safety\n\n• Futuro → Mais digital.\n• Tecnologia → AI ajuda rotina.\n• Emergência → Radio continua essencial.\n• Resultado → Human safety sempre.\n\nConector importante: However, (contraste entre AI e radio)\n\nPergunta de opinião/futuro — use In my opinion, no início.",
  },
  "06": {
    memoryLabels: ["Standard", "Clear", "Safety"],
    keywords: ["Standard", "Clear", "Safety"],
    memoryIcons: ["🌍", "💬", "🛡️"],
    answerLevel5:
      "In my opinion, ICAO phraseology is essential for aviation communication. First of all, it is standard around the world, so pilots and controllers can understand each other in any country. Additionally, it makes communication clear and easy to understand, especially during high workload. Finally, it reduces misunderstandings between pilots and controllers and improves flight safety. For example, when pilots use standard phraseology, ATC can understand instructions quickly even in busy airspace. Overall, ICAO phraseology improves flight safety through clear and standardized communication.",
    level4Example:
      "For example, when pilots use standard phraseology, ATC can understand instructions quickly even in busy airspace.",
    level4Steps: [
      { label: "Standard", sentence: "ICAO phraseology is standard around the world." },
      { label: "Clear", sentence: "It makes communication clear and easy to understand." },
      { label: "Safety", sentence: "As a result, it improves flight safety." },
    ],
    studyTips:
      "Palavras-chave: Standard → Clear → Safety\n\n• Por quê? → Padrão mundial (worldwide).\n• O que faz? → Communication clara.\n• Resultado → Menos erros, mais safety.\n\nConectores: It also / As a result,\n\nResposta curta e objetiva — uma das mais fáceis do exame.",
  },
  "07": {
    studyTips:
      "Palavras-chave: Young → Helicopters → Training → Career\n\nSua história pessoal em 4 passos:\n\n• Quando? → Very young.\n• O quê fascinou? → Helicopters.\n• O que fez? → Flight training.\n• Hoje? → Helicopter pilot career.\n\nConectores: Later, / Today,\n\nConte com emoção real — examinador gosta de resposta autêntica.",
  },
  "08": {
    studyTips:
      "Palavras-chave: Unsafe → Weather → Runway → Try again\n\n• Quando? → Not safe to land.\n• Por quê? → Weather, traffic, obstruction.\n• O que fazer? → Follow procedure / ATC.\n• Depois? → Another approach or divert.\n\nConectores: This may happen... / Then,\n\nProcedimento técnico — fale com calma e clareza.",
  },
  "09": {
    studyTips:
      "Palavras-chave: Safe → Practice → Emergencies → Confidence\n\n• Onde? → Safe environment.\n• O que faz? → Practice emergencies.\n• O que melhora? → Decision-making.\n• Resultado? → Confidence e safety.\n\nConectores: It also / As a result,\n\nUma das mais fáceis de memorizar — sequência lógica.",
  },
  "10": {
    memoryLabels: ["Discipline", "Limits", "Safety"],
    keywords: ["Discipline", "Limits", "Safety"],
    memoryIcons: ["📋", "⚖️", "🛡️"],
    answerLevel4:
      "During my training, my instructor gave me advice I still follow today. He told me to respect procedures, checklists and standard calls. He also advised me to know the aircraft limits, especially power and weather. Finally, he said safety and good judgment are always more important than speed or ego.",
    answerLevel5:
      "During my helicopter training, my instructor gave me several pieces of advice that I still follow today. First of all, he told me to respect procedures, checklists and standard calls in every phase of flight. Additionally, he advised me to know the aircraft limits, especially power, weight and weather limitations. Finally, he said that safety and good judgment are always more important than speed or ego. For example, he always told me not to rush a hover or landing just because someone was waiting on the ground. Overall, the best advice was to stay disciplined, know my limits and make conservative decisions as a helicopter pilot.",
    level4Example:
      "For example, he told me not to rush a hover or landing just because someone was waiting on the ground.",
    level4Steps: [
      { label: "Discipline", sentence: "He told me to respect procedures, checklists and standard calls." },
      { label: "Limits", sentence: "He advised me to know the aircraft limits, especially power and weather." },
      { label: "Safety", sentence: "Safety and good judgment are more important than speed or ego." },
    ],
    studyTips:
      "Palavras-chave: Discipline → Limits → Safety\n\n• Discipline → Procedures e checklists.\n• Limits → Power, weight, weather.\n• Safety → Judgment over ego.\n\nConectores: He told me... / He also... / Finally,\n\nSimilar ao card 03 — use conselhos reais do seu instrutor.",
  },
  "11": {
    memoryLabels: ["Technology", "Growth", "Safety"],
    keywords: ["Technology", "Growth", "Safety"],
    memoryIcons: ["🔧", "📈", "🛡️"],
    answerLevel4:
      "From my point of view, Brazilian aviation will continue to grow and modernize. Helicopters and navigation systems will become more technological and connected. Regional and offshore operations may also expand. As a result, training and safety culture will probably continue to improve.",
    answerLevel5:
      "From my point of view, Brazilian aviation, especially helicopter operations, will continue to grow and modernize. First of all, helicopters, helipads and navigation systems will become more technological and connected. Additionally, regional and offshore helicopter operations may expand because Brazil is a large country with diverse missions. Finally, training, regulation and safety culture in rotary-wing aviation will probably continue to improve. For example, better helipad infrastructure and more modern helicopters can support offshore, HEMS and executive operations more safely. Overall, I believe Brazilian helicopter aviation has a strong future if technology and safety continue improving together.",
    level4Example:
      "For example, better helipad infrastructure can support offshore and HEMS operations more safely.",
    level4Steps: [
      { label: "Technology", sentence: "Helicopters and navigation systems will become more technological and connected." },
      { label: "Growth", sentence: "Regional and offshore operations may expand in Brazil." },
      { label: "Safety", sentence: "Training and safety culture will probably continue to improve." },
    ],
    studyTips:
      "Palavras-chave: Technology → Growth → Safety\n\n• Futuro técnico → Mais tecnologia.\n• Mercado → Crescimento offshore/HEMS.\n• Resultado → Safety culture melhora.\n\nConectores: From my point of view, / Additionally, / As a result,\n\nMencione Brasil e helicópteros — personalize com o que você vê no mercado.",
  },
  "12": {
    memoryLabels: ["Location", "Operations", "Experience"],
    keywords: ["Location", "Operations", "Experience"],
    memoryIcons: ["📍", "🛫", "⭐"],
    answerLevel4:
      "The airport I operate at the most is where I have built solid experience as a helicopter pilot. It is in a region with specific weather patterns and terrain. It has particular procedures, helipads and traffic patterns that I know well. Operating there regularly improves my familiarity, confidence and safety.",
    answerLevel5:
      "The airport I operate at the most is one where I have built solid experience as a helicopter pilot. First of all, it is located in a region where I frequently conduct helicopter operations, with specific weather patterns and terrain features. Additionally, it has particular procedures, runways or helipads, traffic patterns and restrictions that I know very well. Finally, my regular operations there have helped me understand local ATC, common delays and the safest approaches. For example, because I operate there often, I know the typical wind direction, the busiest periods and the best alternate options if weather deteriorates. Overall, operating regularly at the same airport improves familiarity, confidence and safety in helicopter operations.",
    level4Example:
      "For example, I know the typical wind direction, the busiest periods and the best alternate options if weather deteriorates.",
    level4Steps: [
      { label: "Location", sentence: "It is in a region with specific weather patterns and terrain." },
      { label: "Operations", sentence: "It has particular procedures, helipads and traffic patterns that I know well." },
      { label: "Experience", sentence: "Operating there regularly improves my familiarity, confidence and safety." },
    ],
    studyTips:
      "Palavras-chave: Location → Operations → Experience\n\n• Onde? → Região, weather, terrain.\n• Como opera? → Procedures, helipad, traffic.\n• Por que importa? → Familiarity e confidence.\n\nConectores: First of all, / Additionally, / Finally,\n\nDescreva SEU aeroporto real — examinador valoriza detalhes concretos.",
  },
};

const cards = JSON.parse(readFileSync(cardsPath, "utf8"));

for (const card of cards) {
  const patch = ENRICH[card.num];
  if (!patch) continue;
  Object.assign(card, patch);
}

writeFileSync(cardsPath, JSON.stringify(cards, null, 2) + "\n");
console.log(`Enriched ${Object.keys(ENRICH).length} cards in cards.json`);
