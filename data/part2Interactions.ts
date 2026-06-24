import type { InteractionScenario } from "@/lib/part2/types";

export const INTERACTION_SCENARIOS: InteractionScenario[] = [
  {
    id: "int01",
    title: "Engine failure after takeoff",
    flightPhase: "Initial climb",
    situation: "Possible engine failure shortly after takeoff with passengers on board.",
    atcName: "Tower",
    callsign: "Helicol One Two Three",
    urgency: "PAN-PAN",
    problem:
      "We are experiencing a possible engine failure with vibrations and decreasing rotor RPM.",
    intention: "We would like to return to the departure helipad immediately.",
    request: "Request priority handling and vectors back to the helipad.",
    modelReport:
      "São Paulo Tower, Helicol One Two Three, PAN-PAN PAN-PAN PAN-PAN, we are experiencing a possible engine failure with vibrations and decreasing rotor RPM. We would like to return to the departure helipad immediately. Request priority handling and vectors back to the helipad.",
  },
  {
    id: "int02",
    title: "Hydraulic leak in cruise",
    flightPhase: "Cruise",
    situation: "Low hydraulic pressure warning during offshore transit.",
    atcName: "Control",
    callsign: "Helicol Four Five Six",
    urgency: "PAN-PAN",
    problem: "We are experiencing a hydraulic leak and low hydraulic pressure.",
    intention: "We would like to divert to the nearest suitable helipad.",
    request: "Request vectors to Hotel Bravo helipad and emergency services on arrival.",
    modelReport:
      "Offshore Control, Helicol Four Five Six, PAN-PAN PAN-PAN PAN-PAN, we are experiencing a hydraulic leak and low hydraulic pressure. We would like to divert to the nearest suitable helipad. Request vectors to Hotel Bravo helipad and emergency services on arrival.",
  },
  {
    id: "int03",
    title: "Smoke in the cabin",
    flightPhase: "Approach",
    situation: "Smoke detected in the passenger cabin during final approach.",
    atcName: "Approach",
    callsign: "Helicol Seven Eight Nine",
    urgency: "MAYDAY",
    problem: "We are experiencing smoke in the cabin and an electrical burning smell.",
    intention: "We would like to continue the approach and land immediately.",
    request: "Request fire services and medical assistance on landing.",
    modelReport:
      "Approach, Helicol Seven Eight Nine, MAYDAY MAYDAY MAYDAY, we are experiencing smoke in the cabin and an electrical burning smell. We would like to continue the approach and land immediately. Request fire services and medical assistance on landing.",
  },
  {
    id: "int04",
    title: "Bird strike on departure",
    flightPhase: "Departure",
    situation: "Bird strike during climb with minor vibrations.",
    atcName: "Tower",
    callsign: "Helicol Two Two Two",
    urgency: "PAN-PAN",
    problem: "We are experiencing a bird strike with minor vibrations and a small power fluctuation.",
    intention: "We would like to level off and assess the aircraft condition.",
    request: "Request holding at present position and priority return if required.",
    modelReport:
      "Tower, Helicol Two Two Two, PAN-PAN PAN-PAN PAN-PAN, we are experiencing a bird strike with minor vibrations and a small power fluctuation. We would like to level off and assess the aircraft condition. Request holding at present position and priority return if required.",
  },
  {
    id: "int05",
    title: "Low fuel offshore",
    flightPhase: "Cruise",
    situation: "Fuel quantity lower than planned due to stronger headwinds.",
    atcName: "Control",
    callsign: "Helicol Three Three Three",
    urgency: "PAN-PAN",
    problem: "We are experiencing lower fuel reserves than planned.",
    intention: "We would like to proceed direct to the platform and shorten the route.",
    request: "Request direct routing and priority landing at the offshore helideck.",
    modelReport:
      "Offshore Control, Helicol Three Three Three, PAN-PAN PAN-PAN PAN-PAN, we are experiencing lower fuel reserves than planned. We would like to proceed direct to the platform and shorten the route. Request direct routing and priority landing at the offshore helideck.",
  },
  {
    id: "int06",
    title: "Pilot incapacitation",
    flightPhase: "Cruise",
    situation: "Co-pilot reports feeling unwell and unable to continue duties.",
    atcName: "Control",
    callsign: "Helicol Five Five Five",
    urgency: "PAN-PAN",
    problem: "We are experiencing pilot incapacitation in the right seat.",
    intention: "We would like to divert to the nearest airport with medical facilities.",
    request: "Request vectors, priority landing, and medical assistance on arrival.",
    modelReport:
      "Control, Helicol Five Five Five, PAN-PAN PAN-PAN PAN-PAN, we are experiencing pilot incapacitation in the right seat. We would like to divert to the nearest airport with medical facilities. Request vectors, priority landing, and medical assistance on arrival.",
  },
];
