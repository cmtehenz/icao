import type { VocabCategoryId, VocabularyTerm } from "@/lib/part2/types";

export type VocabCategory = {
  id: VocabCategoryId;
  label: string;
  importance: 3 | 4 | 5;
  description: string;
};

export const VOCAB_CATEGORIES: VocabCategory[] = [
  {
    id: "atc",
    label: "ATC Instructions",
    importance: 5,
    description: "Você vai ouvir isso em praticamente toda prova.",
  },
  {
    id: "emergencies",
    label: "Emergências",
    importance: 5,
    description: "As que mais aparecem na Parte 2.",
  },
  {
    id: "landing-gear",
    label: "Landing Gear",
    importance: 4,
    description: "Problemas de trem de pouso.",
  },
  {
    id: "weather",
    label: "Meteorologia",
    importance: 4,
    description: "Condições meteorológicas em voo.",
  },
  {
    id: "navigation",
    label: "Navegação",
    importance: 4,
    description: "Aproximações, procedimentos e navaids.",
  },
  {
    id: "passengers",
    label: "Passageiros",
    importance: 3,
    description: "Tripulação de cabine e passageiros.",
  },
  {
    id: "score-phrases",
    label: "Frases nota 4",
    importance: 5,
    description: "Estruturas que elevam sua nota na Parte 2.",
  },
  {
    id: "reported-speech",
    label: "Reported Speech",
    importance: 5,
    description: "Praticamente garantem a Parte 2.",
  },
];

function t(
  id: string,
  category: VocabCategoryId,
  importance: 3 | 4 | 5,
  term: string,
  meaning: string,
  definition: string,
  example: string,
): VocabularyTerm {
  return { id, term, meaning, definition, example, category, importance };
}

/** Fundamental Part 2 vocabulary — SDEA exams 23C–26C. */
export const VOCABULARY_TERMS: VocabularyTerm[] = [
  // ── 1. ATC Instructions (30) ──────────────────────────────────────────────
  t("atc-01", "atc", 5, "maintain", "manter", "Keep current altitude, heading or speed.", "Maintain flight level three five zero, ANAC 123."),
  t("atc-02", "atc", 5, "climb", "subir", "Increase altitude.", "Climb to flight level two eight zero."),
  t("atc-03", "atc", 5, "descend", "descer", "Decrease altitude.", "Descend to three thousand feet, QNH one zero one three."),
  t("atc-04", "atc", 5, "turn left", "virar à esquerda", "Change heading to the left.", "Turn left heading two seven zero."),
  t("atc-05", "atc", 5, "turn right", "virar à direita", "Change heading to the right.", "Turn right heading one six zero."),
  t("atc-06", "atc", 5, "heading", "proa", "Magnetic direction the aircraft is flying.", "Fly heading zero nine zero."),
  t("atc-07", "atc", 5, "flight level", "nível de voo", "Altitude based on standard pressure (1013 hPa).", "Descend to flight level zero five zero."),
  t("atc-08", "atc", 5, "altitude", "altitude", "Height above mean sea level.", "Maintain altitude one zero thousand feet."),
  t("atc-09", "atc", 5, "hold", "espera", "Remain in a holding pattern or position.", "Hold at waypoint ALFA."),
  t("atc-10", "atc", 5, "holding point", "ponto de espera", "Designated point where aircraft must wait.", "Taxi to holding point runway two four."),
  t("atc-11", "atc", 5, "holding short", "manter antes da pista", "Stop before entering the runway.", "Taxi via Romeo and hold short of runway one eight."),
  t("atc-12", "atc", 5, "line up and wait", "alinhar e aguardar", "Position on runway and await takeoff clearance.", "Cleared to line up and wait runway three six."),
  t("atc-13", "atc", 5, "cleared", "autorizado", "ATC authorization to proceed.", "Cleared for takeoff runway two four."),
  t("atc-14", "atc", 5, "proceed", "prosseguir", "Continue as instructed.", "Proceed direct to waypoint BRAVO."),
  t("atc-15", "atc", 5, "fly direct", "voar direto", "Navigate straight to a fix or airport.", "Fly direct Galeao."),
  t("atc-16", "atc", 5, "vectors", "vetoração", "ATC-assigned headings to guide the aircraft.", "Request vectors to the ILS runway one eight."),
  t("atc-17", "atc", 5, "expect", "espere", "Anticipate a future clearance.", "Expect descent after passing waypoint CHARLIE."),
  t("atc-18", "atc", 5, "continue", "continue", "Keep doing what you are doing.", "Continue approach runway one eight."),
  t("atc-19", "atc", 5, "report", "reporte", "Inform ATC when a condition is met.", "Report passing flight level one zero zero."),
  t("atc-20", "atc", 5, "contact", "contate", "Change radio frequency to another unit.", "Contact Recife Approach on one two four decimal three."),
  t("atc-21", "atc", 5, "frequency", "frequência", "Radio channel for ATC communication.", "Monitor tower frequency one one eight decimal seven."),
  t("atc-22", "atc", 5, "squawk", "código transponder", "Set transponder code.", "Squawk four six three two."),
  t("atc-23", "atc", 5, "ident", "identificação", "Activate transponder ident function.", "Squawk ident, maintain runway heading."),
  t("atc-24", "atc", 5, "runway", "pista", "Surface for takeoff and landing.", "Cleared to land runway three six."),
  t("atc-25", "atc", 5, "taxiway", "taxiway", "Ground route between apron and runway.", "Taxi via taxiway Bravo and Charlie."),
  t("atc-26", "atc", 5, "vacate", "liberar pista", "Exit the runway after landing.", "Vacate runway via taxiway Delta."),
  t("atc-27", "atc", 5, "backtrack", "retornar pela pista", "Taxi along the runway in use.", "Cleared to backtrack runway two four."),
  t("atc-28", "atc", 5, "maintain position", "manter posição", "Stop and remain in current place.", "Maintain position, ANAC 123."),
  t("atc-29", "atc", 5, "resume own navigation", "retomar navegação", "Resume self-navigation after vectors.", "Resume own navigation to destination."),
  t("atc-30", "atc", 5, "at your discretion", "à sua discrição", "Pilot may choose timing or method.", "Descend at your discretion to flight level one zero zero."),

  // ── 2. Emergências (40) ───────────────────────────────────────────────────
  t("emg-01", "emergencies", 5, "engine failure", "falha de motor", "Complete or partial loss of engine power.", "We have an engine failure on the left engine."),
  t("emg-02", "emergencies", 5, "engine stall", "compressor stall", "Engine airflow disruption causing power loss.", "We experienced an engine stall during climb."),
  t("emg-03", "emergencies", 5, "engine surge", "surto de motor", "Unstable engine operation with thrust fluctuations.", "We have an engine surge on engine number two."),
  t("emg-04", "emergencies", 5, "loss of power", "perda de potência", "Reduction or loss of engine thrust.", "We have a loss of power on the right engine."),
  t("emg-05", "emergencies", 5, "loss of thrust", "perda de empuxo", "Engine not producing expected thrust.", "We are experiencing a loss of thrust."),
  t("emg-06", "emergencies", 5, "low oil pressure", "pressão de óleo baixa", "Engine oil pressure below limits.", "We have low oil pressure on engine one."),
  t("emg-07", "emergencies", 5, "high oil temperature", "temperatura de óleo alta", "Engine oil temperature above limits.", "We have high oil temperature on the left engine."),
  t("emg-08", "emergencies", 5, "hydraulic leak", "vazamento hidráulico", "Loss of hydraulic fluid from the system.", "We have a hydraulic leak in the green system."),
  t("emg-09", "emergencies", 5, "hydraulic pressure", "pressão hidráulica", "Hydraulic system pressure status.", "We lost hydraulic pressure on the left system."),
  t("emg-10", "emergencies", 5, "smoke in the cabin", "fumaça na cabine", "Smoke present in passenger cabin.", "We have smoke in the cabin, request immediate descent."),
  t("emg-11", "emergencies", 5, "fumes", "vapores", "Unidentified vapours in cockpit or cabin.", "We smell fumes in the cockpit."),
  t("emg-12", "emergencies", 5, "fire on board", "incêndio a bordo", "Fire inside the aircraft.", "Mayday, we have fire on board."),
  t("emg-13", "emergencies", 5, "fire in the hold", "incêndio no porão", "Fire in cargo compartment.", "We have fire in the hold, request priority landing."),
  t("emg-14", "emergencies", 5, "bird strike", "colisão com aves", "Impact with birds during flight.", "We had a bird strike on departure."),
  t("emg-15", "emergencies", 5, "hit birds", "atingiu aves", "Aircraft collided with birds.", "We hit birds during takeoff."),
  t("emg-16", "emergencies", 5, "windshear", "cisalhamento de vento", "Sudden change in wind speed or direction.", "We encountered windshear on final approach."),
  t("emg-17", "emergencies", 5, "microburst", "microexplosão", "Intense downdraft near the ground.", "We experienced a microburst on approach."),
  t("emg-18", "emergencies", 5, "turbulence", "turbulência", "Irregular air movement affecting the aircraft.", "We are encountering turbulence."),
  t("emg-19", "emergencies", 5, "severe turbulence", "turbulência severa", "Strong turbulence requiring caution.", "We are in severe turbulence, passengers injured."),
  t("emg-20", "emergencies", 5, "moderate turbulence", "turbulência moderada", "Noticeable but manageable turbulence.", "We expect moderate turbulence ahead."),
  t("emg-21", "emergencies", 5, "icing", "gelo", "Ice accumulation on aircraft surfaces.", "We are picking up icing at this altitude."),
  t("emg-22", "emergencies", 5, "low fuel", "combustível baixo", "Fuel below planned reserves.", "We are low on fuel and need priority."),
  t("emg-23", "emergencies", 5, "fuel starvation", "falta de combustível", "Engines starved of fuel despite quantity on board.", "We suspect fuel starvation on engine two."),
  t("emg-24", "emergencies", 5, "fuel dumping", "descarte de combustível", "Releasing fuel to reduce landing weight.", "We need to dump fuel before returning."),
  t("emg-25", "emergencies", 5, "total electrical failure", "falha elétrica total", "Loss of main electrical power.", "We have a total electrical failure."),
  t("emg-26", "emergencies", 5, "battery power", "energia da bateria", "Operating on battery backup only.", "We are on battery power only."),
  t("emg-27", "emergencies", 5, "GPS inoperative", "GPS inoperante", "GPS navigation unavailable.", "Our GPS is inoperative, request radar vectors."),
  t("emg-28", "emergencies", 5, "FMS failure", "falha do FMS", "Flight Management System not working.", "We have an FMS failure."),
  t("emg-29", "emergencies", 5, "pilot incapacitation", "incapacitação do piloto", "Pilot unable to perform duties.", "We have pilot incapacitation in the cockpit."),
  t("emg-30", "emergencies", 5, "passenger passed out", "passageiro desmaiou", "Passenger lost consciousness.", "A passenger passed out in row twelve."),
  t("emg-31", "emergencies", 5, "heart attack", "ataque cardíaco", "Suspected cardiac emergency on board.", "We have a passenger with a suspected heart attack on board."),
  t("emg-32", "emergencies", 5, "seizure", "convulsão", "Passenger having a seizure.", "A passenger is having a seizure."),
  t("emg-33", "emergencies", 5, "emergency landing", "pouso de emergência", "Landing due to urgent situation.", "We need an emergency landing at the nearest airport."),
  t("emg-34", "emergencies", 5, "emergency evacuation", "evacuação de emergência", "Rapid exit of all persons from aircraft.", "We may need an emergency evacuation on the ground."),
  t("emg-35", "emergencies", 5, "MAYDAY", "MAYDAY", "Distress call — grave and imminent danger.", "Mayday Mayday Mayday, ANAC 123, fire on board."),
  t("emg-36", "emergencies", 5, "PAN PAN", "PAN PAN", "Urgency call — safety issue not yet distress.", "Pan Pan Pan, ANAC 123, hydraulic problem."),
  t("emg-37", "emergencies", 5, "assistance", "assistência", "Request for help from ATC or services.", "We request medical assistance on arrival."),
  t("emg-38", "emergencies", 5, "divert", "desviar", "Change destination to alternate airport.", "We need to divert to Salvador."),
  t("emg-39", "emergencies", 5, "nearest airport", "aeroporto mais próximo", "Closest suitable airport for landing.", "Vectors to the nearest airport, please."),
  t("emg-40", "emergencies", 5, "priority", "prioridade", "Preferential handling by ATC.", "We request priority landing."),

  // ── 3. Landing Gear (10) ───────────────────────────────────────────────────
  t("gear-01", "landing-gear", 4, "landing gear", "trem de pouso", "Undercarriage for takeoff and landing.", "We have a problem with the landing gear."),
  t("gear-02", "landing-gear", 4, "main gear", "trem principal", "Main landing gear wheels.", "The main gear is not extending."),
  t("gear-03", "landing-gear", 4, "nose gear", "trem dianteiro", "Nose wheel landing gear.", "The nose gear is stuck."),
  t("gear-04", "landing-gear", 4, "stuck", "travado", "Gear or mechanism will not move.", "The landing gear is stuck in the up position."),
  t("gear-05", "landing-gear", 4, "collapsed", "colapsado", "Landing gear failed and collapsed.", "We suspect the gear collapsed on landing."),
  t("gear-06", "landing-gear", 4, "extended", "estendido", "Landing gear is down and locked.", "Gear extended, three green."),
  t("gear-07", "landing-gear", 4, "retracted", "retraído", "Landing gear is up.", "Gear retracted after takeoff."),
  t("gear-08", "landing-gear", 4, "twisted", "torcido", "Gear or wheels misaligned.", "We have a twisted nose gear."),
  t("gear-09", "landing-gear", 4, "wheels-up landing", "pouso sem trem", "Landing with gear not extended.", "We are preparing for a wheels-up landing."),
  t("gear-10", "landing-gear", 4, "belly landing", "pouso de barriga", "Landing on fuselage without gear.", "We need to make a belly landing."),

  // ── 4. Meteorologia (13 — sem duplicar emergências) ───────────────────────
  t("wx-01", "weather", 4, "thunderstorm", "trovoada", "Storm with thunder, lightning and heavy rain.", "Thunderstorm activity west of the field."),
  t("wx-02", "weather", 4, "cloud", "nuvem", "Visible moisture in the atmosphere.", "Broken clouds at three thousand feet."),
  t("wx-03", "weather", 4, "visibility", "visibilidade", "Distance at which objects can be seen.", "Visibility reducing to two thousand meters."),
  t("wx-04", "weather", 4, "ceiling", "teto", "Height of lowest cloud layer covering more than half the sky.", "Ceiling one thousand five hundred feet."),
  t("wx-05", "weather", 4, "rain", "chuva", "Precipitation in liquid form.", "Heavy rain on final approach."),
  t("wx-06", "weather", 4, "fog", "névoa", "Low visibility due to condensed water vapour.", "Fog reducing visibility at the airport."),
  t("wx-07", "weather", 4, "gust", "rajada", "Sudden brief increase in wind speed.", "Wind gusting to three five knots."),
  t("wx-08", "weather", 4, "crosswind", "vento cruzado", "Wind blowing across the runway.", "Crosswind component two zero knots."),
  t("wx-09", "weather", 4, "tailwind", "vento de cauda", "Wind from behind the aircraft.", "Tailwind on runway two four."),
  t("wx-10", "weather", 4, "headwind", "vento de proa", "Wind from the front of the aircraft.", "Headwind one five knots."),
  t("wx-11", "weather", 4, "lightning", "raio", "Electrical discharge in a storm.", "Lightning observed near the airport."),
  t("wx-12", "weather", 4, "shower", "chuva passageira", "Short period of rain.", "Showers in the vicinity of the aerodrome."),
  t("wx-13", "weather", 4, "weather deteriorating", "tempo piorando", "Conditions becoming worse.", "Weather deteriorating, request latest METAR."),

  // ── 5. Navegação (15) ────────────────────────────────────────────────────
  t("nav-01", "navigation", 4, "VOR", "VOR", "VHF omnidirectional radio range navaid.", "Proceed to the VOR and hold."),
  t("nav-02", "navigation", 4, "VORTAC", "VORTAC", "Combined VOR and TACAN station.", "Fly direct to the VORTAC."),
  t("nav-03", "navigation", 4, "ILS", "ILS", "Instrument Landing System approach.", "Cleared ILS runway one eight approach."),
  t("nav-04", "navigation", 4, "RNAV", "RNAV", "Area navigation using waypoints.", "Cleared RNAV approach runway three six."),
  t("nav-05", "navigation", 4, "visual approach", "aproximação visual", "Approach by visual reference to terrain.", "Cleared visual approach runway two four."),
  t("nav-06", "navigation", 4, "straight-in approach", "aproximação reta", "Final approach aligned with runway.", "Cleared straight-in approach runway one eight."),
  t("nav-07", "navigation", 4, "missed approach", "aproximação frustrada", "Procedure when landing cannot be completed.", "Going around, missed approach runway three six."),
  t("nav-08", "navigation", 4, "go around", "arremeter", "Abort landing and climb away.", "Recife Tower, go around, truck on the runway."),
  t("nav-09", "navigation", 4, "downwind", "vento de cauda (perna)", "Leg of traffic pattern parallel to runway.", "Enter downwind runway two four."),
  t("nav-10", "navigation", 4, "base", "base", "Leg turning from downwind to final.", "Turn base runway one eight."),
  t("nav-11", "navigation", 4, "final", "final", "Leg aligned with runway for landing.", "Cleared to land, wind calm, final runway three six."),
  t("nav-12", "navigation", 4, "intercept", "interceptar", "Join a course, localizer or glide path.", "Intercept the localizer runway one eight."),
  t("nav-13", "navigation", 4, "localizer", "localizador", "ILS lateral guidance beam.", "Established on the localizer."),
  t("nav-14", "navigation", 4, "glide slope", "glide path", "ILS vertical guidance beam.", "Glide slope captured."),
  t("nav-15", "navigation", 4, "waypoint", "ponto de rota", "Defined geographic point for navigation.", "Proceed direct to waypoint DELTA."),

  // ── 6. Passageiros (11) ──────────────────────────────────────────────────
  t("pax-01", "passengers", 3, "passengers", "passageiros", "People on board other than crew.", "We have one two zero passengers on board."),
  t("pax-02", "passengers", 3, "crew", "tripulação", "Flight deck and cabin crew.", "All crew members are accounted for."),
  t("pax-03", "passengers", 3, "souls on board", "pessoas a bordo", "Total persons on aircraft including crew.", "One two five souls on board."),
  t("pax-04", "passengers", 3, "people on board", "pessoas a bordo", "Total number of persons on the aircraft.", "We have one three zero people on board."),
  t("pax-05", "passengers", 3, "flight attendant", "comissário de bordo", "Cabin crew member.", "The flight attendant reports smoke in the galley."),
  t("pax-06", "passengers", 3, "stewardess", "comissária", "Female cabin crew member.", "The stewardess is assisting the passenger."),
  t("pax-07", "passengers", 3, "purser", "chefe de cabine", "Senior cabin crew member.", "The purser reports an unruly passenger."),
  t("pax-08", "passengers", 3, "disembark", "desembarcar", "Passengers leaving the aircraft.", "Passengers will disembark via stairs."),
  t("pax-09", "passengers", 3, "unconscious", "inconsciente", "Not awake or responsive.", "We have an unconscious passenger in seat four alpha."),
  t("pax-10", "passengers", 3, "injured", "ferido", "Hurt or wounded.", "Two passengers injured during turbulence."),
  t("pax-11", "passengers", 3, "medical assistance", "assistência médica", "Medical help on arrival.", "Request medical assistance on landing."),

  // ── 7. Frases nota 4 (19) ────────────────────────────────────────────────
  t("phr-01", "score-phrases", 5, "We are experiencing", "estamos enfrentando", "Opening phrase to describe a problem.", "We are experiencing engine vibration."),
  t("phr-02", "score-phrases", 5, "It appears that", "parece que", "Tentative description of a situation.", "It appears that we have a hydraulic leak."),
  t("phr-03", "score-phrases", 5, "It seems that", "parece que", "Softer way to describe a problem.", "It seems that our GPS is not working."),
  t("phr-04", "score-phrases", 5, "We would like to", "gostaríamos de", "Polite way to state intention.", "We would like to return to the departure airport."),
  t("phr-05", "score-phrases", 5, "We would prefer to", "preferiríamos", "Express preference to ATC.", "We would prefer to divert to Confins."),
  t("phr-06", "score-phrases", 5, "Request", "solicito", "Formal way to ask ATC for something.", "Request vectors to the ILS."),
  t("phr-07", "score-phrases", 5, "We would appreciate", "agradeceríamos", "Polite request for assistance.", "We would appreciate priority handling."),
  t("phr-08", "score-phrases", 5, "We would like priority", "gostaríamos de prioridade", "Request preferential ATC handling.", "We would like priority landing."),
  t("phr-09", "score-phrases", 5, "We would like vectors", "gostaríamos de vetoração", "Request heading guidance.", "We would like vectors to the field."),
  t("phr-10", "score-phrases", 5, "We would like to return", "gostaríamos de retornar", "Request to go back to departure or nearby.", "We would like to return to Brasilia."),
  t("phr-11", "score-phrases", 5, "We would like to divert", "gostaríamos de desviar", "Request alternate airport.", "We would like to divert to Recife."),
  t("phr-12", "score-phrases", 5, "Due to", "devido a", "Explain reason for action.", "Due to a medical emergency on board."),
  t("phr-13", "score-phrases", 5, "Because of", "por causa de", "Explain cause of problem.", "Because of severe turbulence we slowed down."),
  t("phr-14", "score-phrases", 5, "For safety reasons", "por razões de segurança", "Justify precautionary action.", "For safety reasons we are returning."),
  t("phr-15", "score-phrases", 5, "As a precaution", "por precaução", "Explain preventive measure.", "As a precaution we are dumping fuel."),
  t("phr-16", "score-phrases", 5, "At the moment", "no momento", "Describe current situation.", "At the moment we are stable at flight level three five zero."),
  t("phr-17", "score-phrases", 5, "Currently", "atualmente", "Present status update.", "Currently we have no navigation available."),
  t("phr-18", "score-phrases", 5, "Fortunately", "felizmente", "Positive turn in the situation.", "Fortunately the smoke is dissipating."),
  t("phr-19", "score-phrases", 5, "Unfortunately", "infelizmente", "Negative turn in the situation.", "Unfortunately we cannot extend the landing gear."),

  // ── 8. Reported Speech (9) ───────────────────────────────────────────────
  t("rep-01", "reported-speech", 5, "The controller instructed me to", "o controlador me instruiu a", "Report ATC instruction in past tense.", "The controller instructed me to turn right heading one six zero."),
  t("rep-02", "reported-speech", 5, "The controller asked me to", "o controlador me pediu para", "Report ATC question or request.", "The controller asked me to confirm my altitude."),
  t("rep-03", "reported-speech", 5, "The controller informed me that", "o controlador me informou que", "Report information from ATC.", "The controller informed me that runway two four was closed."),
  t("rep-04", "reported-speech", 5, "The controller cleared me to", "o controlador me autorizou a", "Report ATC clearance.", "The controller cleared me to land runway three six."),
  t("rep-05", "reported-speech", 5, "The controller advised me to", "o controlador me aconselhou a", "Report ATC advice.", "The controller advised me to slow down."),
  t("rep-06", "reported-speech", 5, "The pilot informed ATC that", "o piloto informou ao ATC que", "Report what the pilot told ATC.", "The pilot informed ATC that they had smoke in the cabin."),
  t("rep-07", "reported-speech", 5, "The pilot requested", "o piloto solicitou", "Report pilot request to ATC.", "The pilot requested vectors to the nearest airport."),
  t("rep-08", "reported-speech", 5, "He also said that", "ele também disse que", "Add further reported information.", "He also said that we should expect delay."),
  t("rep-09", "reported-speech", 5, "Finally, he asked me if", "por fim, ele me perguntou se", "Closing reported speech question.", "Finally, he asked me if I had the runway in sight."),
];

export function getVocabCategory(id: VocabCategoryId): VocabCategory {
  return VOCAB_CATEGORIES.find((c) => c.id === id)!;
}

export function termsByCategory(categoryId: VocabCategoryId): VocabularyTerm[] {
  return VOCABULARY_TERMS.filter((term) => term.category === categoryId);
}

export function categoryStars(importance: number): string {
  return "★".repeat(importance) + "☆".repeat(5 - importance);
}
