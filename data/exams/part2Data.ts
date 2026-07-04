import type { ExamSituation, ExamVersion } from "@/lib/exams/types";
import { PART2_RECOMMENDED_NOTES } from "@/data/exams/part2RecommendedNotes";

function withRecommendedNotes(situations: ExamSituation[]): ExamSituation[] {
  return situations.map((s) => ({
    ...s,
    recommendedNotes: PART2_RECOMMENDED_NOTES[s.id] ?? s.recommendedNotes,
  }));
}

const CALLSIGN = "ANAC 123";

export const EXAM_23C_SITUATIONS: ExamSituation[] = [
  {
    id: "23C-s1",
    examVersion: "23C",
    situationNumber: 1,
    title: "Oakland departure — gear problem",
    context: "You have just taken off from Metropolitan Oakland Airport.",
    readback: {
      atcFacility: "NorCal Departure",
      atcMessage:
        "ANAC 123, squawk ident, maintain runway heading, climb and maintain five thousand feet, expect six thousand after Sierra Alpha Uniform VOR.",
      modelReadback:
        "Squawk ident, maintain runway heading, climb and maintain five thousand feet, expect six thousand after SAU VOR, ANAC 123.",
      audioTrack: 2,
    },
    interaction: {
      prompt:
        "Your main landing gear does not retract properly. Contact NorCal Departure, report your problem and request to hold in order to try to solve the problem.",
      modelReport:
        "NorCal Departure, ANAC 123, my main landing gear does not retract properly. Request to hold in order to try to solve the problem.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, roger. I copied you have a problem with your gear and are requesting to hold to check out your problem. Confirm?",
      modelCorrection: "AFFIRM, ANAC 123.",
      audioTrack: 3,
      correctionType: "AFFIRM",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller said that I had a problem with my gear and that I was requesting to hold to check out my problem, and asked me to confirm.",
    },
  },
  {
    id: "23C-s2",
    examVersion: "23C",
    situationNumber: 2,
    title: "Manaus — fire in the cabin",
    context: "You have just taken off from Manaus Airport.",
    readback: {
      atcFacility: "Manaus Tower",
      atcMessage:
        "ANAC 123, airborne at two six. Maintain runway heading until passing three thousand feet. Contact Manaus Departure on frequency one one niner decimal two five.",
      modelReadback:
        "Maintain runway heading until passing three thousand feet. Contact Manaus Departure on one one niner decimal two five, ANAC 123.",
      audioTrack: 4,
    },
    interaction: {
      prompt:
        "You realize that you have fire in the cabin. Contact Manaus Approach Control to report your problem and request to return.",
      modelReport:
        "Mayday Mayday Mayday, Manaus Approach, ANAC 123. Fire in the cabin. Request return to Manaus.",
      urgency: "MAYDAY",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, descend at your discretion to flight level zero five zero, turn right heading zero six zero. No reported traffic. Confirm you have an engine fire.",
      modelCorrection:
        "NEGATIVE, we have fire in the cabin. Descending to flight level zero five zero. Turn right heading zero six zero, ANAC 123.",
      audioTrack: 5,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to descend at my discretion to flight level zero five zero and turn right heading zero six zero. There was no reported traffic. The controller asked me to confirm if I had an engine fire.",
    },
  },
  {
    id: "23C-s3",
    examVersion: "23C",
    situationNumber: 3,
    title: "Bogotá — cabin pressure loss",
    context: "You are taking off from Bogota El Dorado Airport.",
    readback: {
      atcFacility: "Bogota Ground",
      atcMessage:
        "ANAC 123, taxi via Romeo, Foxtrot and hold short of Bravo. Expect to backtrack runway three one right. Stand by for El Dorado Tower on frequency one one eight decimal one.",
      modelReadback:
        "Taxi via Romeo, Foxtrot and hold short of Bravo. Expect backtrack runway three one right. Stand by for Tower on one one eight decimal one, ANAC 123.",
      audioTrack: 6,
    },
    interaction: {
      prompt:
        "After takeoff, you start losing cabin pressure. You decide to return to Bogota, but first you must burn some fuel. Call Bogota Approach to explain and request a twenty-minute hold.",
      modelReport:
        "Pan Pan Pan, Bogota Approach, ANAC 123, we are losing cabin pressure. We need to return to Bogota. Request a two zero-minute hold to burn some fuel before landing.",
      urgency: "PAN-PAN",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, squawk seven seven zero zero. I understand you need to return to Bogota immediately. Descend to one five thousand feet and fly direct to Bogota VOR. Expect to land in ten minutes.",
      modelCorrection:
        "NEGATIVE. I need to hold for two zero minutes before landing in order to burn some fuel. Squawk seven seven zero zero, ANAC 123.",
      audioTrack: 7,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to squawk seven seven zero zero, descend to one five thousand feet and fly direct to Bogota VOR. The controller understood that I needed to return to Bogota immediately and expected me to land in ten minutes.",
    },
  },
  {
    id: "23C-s4",
    examVersion: "23C",
    situationNumber: 4,
    title: "Santiago — hot air balloon",
    context: "You are going to land at Santiago Airport.",
    readback: {
      atcFacility: "Santiago Approach",
      atcMessage:
        "ANAC 123, radar contact, turn right heading one niner zero, descend to four thousand feet, report passing eight thousand feet, and expect VOR approach to runway three five right.",
      modelReadback:
        "Turn right heading one niner zero, descend to four thousand feet, report passing eight thousand feet, and expect VOR approach runway three five right, ANAC 123.",
      audioTrack: 8,
    },
    interaction: {
      prompt:
        "During approach, you see a hot air balloon ahead of you. Call Santiago Approach to report the situation and request deviation.",
      modelReport:
        "Santiago Approach, ANAC 123, there is a hot air balloon ahead of us. Request deviation.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, turn three zero degrees left. Confirm the hot air balloon is at your three o'clock position.",
      modelCorrection:
        "NEGATIVE. The hot air balloon is ahead of us. Turn three zero degrees left, ANAC 123.",
      audioTrack: 9,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to turn three zero degrees left and asked me to confirm if the hot air balloon was at my three o'clock position.",
    },
  },
  {
    id: "23C-s5",
    examVersion: "23C",
    situationNumber: 5,
    title: "Miami RNAV — GPS failure",
    context: "You have just taken off from Miami Airport using RNAV.",
    readback: {
      atcFacility: "Miami Tower",
      atcMessage:
        "ANAC 123, climb and maintain five thousand feet, squawk three four three two, and proceed to Fox Lima Lima VORTAC. Call Miami Departure on frequency one one niner point four five.",
      modelReadback:
        "Climb and maintain five thousand feet, squawk three four three two, proceed to FLL VORTAC. Call Miami Departure on one one niner point four five, ANAC 123.",
      audioTrack: 10,
    },
    interaction: {
      prompt:
        "You lost your GPS. Call Miami Tower to inform them about your problem and say your intentions.",
      modelReport:
        "Miami Tower, ANAC 123, we have lost our GPS. We would like to continue using conventional navigation.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, confirm you are experiencing problems with your GPS system and say again your intention.",
      modelCorrection: "AFFIRM. We have lost our GPS. We would like to continue using conventional navigation, ANAC 123.",
      audioTrack: 11,
      correctionType: "AFFIRM",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller asked me to confirm that I was experiencing problems with my GPS system and to say again my intention.",
    },
  },
];

export const EXAM_24C_SITUATIONS: ExamSituation[] = [
  {
    id: "24C-s1",
    examVersion: "24C",
    situationNumber: 1,
    title: "Heathrow — low fuel",
    context: "You are going to land at Heathrow Airport.",
    readback: {
      atcFacility: "London Control",
      atcMessage:
        "ANAC 123, turn left heading zero one zero degrees, descend to flight level zero eight zero and reduce speed to one two zero knots.",
      modelReadback:
        "Turn left heading zero one zero, descend to flight level zero eight zero and reduce speed to one two zero knots, ANAC 123.",
      audioTrack: 2,
    },
    interaction: {
      prompt:
        "You have been in a holding pattern and are running low on fuel. Call London Control and inform them you need to land in fifteen minutes.",
      modelReport:
        "Pan Pan Pan, London Control, ANAC 123, we are running low on fuel and need to land within one five minutes.",
      urgency: "PAN-PAN",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, exit hold now heading one three five. Expect vectors to intercept ILS two seven right. Confirm you need to land in five zero minutes.",
      modelCorrection:
        "NEGATIVE. I need to land in one five minutes. Exiting hold heading one three five. Expect vectors to intercept ILS two seven right, ANAC 123.",
      audioTrack: 3,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to exit hold now heading one three five and expect vectors to intercept ILS two seven right. The controller asked me to confirm if I needed to land in five zero minutes.",
    },
  },
  {
    id: "24C-s2",
    examVersion: "24C",
    situationNumber: 2,
    title: "Manchester — engine vibration",
    context: "You are going to land at Manchester Airport.",
    readback: {
      atcFacility: "Manchester Control",
      atcMessage:
        "ANAC 123, Manchester Control, descend to flight level zero six zero, turn right heading one six zero, expect one zero minute hold at Whiskey Hotel India VOR.",
      modelReadback:
        "Descend to flight level zero six zero, right turn heading one six zero, expecting one zero minute hold at WHI VOR, ANAC 123.",
      audioTrack: 4,
    },
    interaction: {
      prompt:
        "You are experiencing engine high vibration and need to land as soon as possible. Contact Manchester Control to report and say your intentions.",
      modelReport:
        "Pan Pan Pan, Manchester Control, ANAC 123, we have an engine high vibration. We need to land as soon as possible.",
      urgency: "PAN-PAN",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, fly direct to Manchester VOR and expect direct approach to runway zero five left. I understand you lost your left engine. Confirm?",
      modelCorrection:
        "NEGATIVE. I did not lose an engine. I am experiencing high vibration. Fly direct to Manchester VOR and expect direct approach to runway zero five left, ANAC 123.",
      audioTrack: 5,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to fly direct to Manchester VOR and expect direct approach to runway zero five left. The controller understood that I had lost my left engine and asked me to confirm.",
    },
  },
  {
    id: "24C-s3",
    examVersion: "24C",
    situationNumber: 3,
    title: "Vitória — minor passed out",
    context: "You are at Vitoria Airport.",
    readback: {
      atcFacility: "Vitoria Tower",
      atcMessage:
        "ANAC 123, cleared to backtrack, line up and wait runway two four. Report ready for takeoff.",
      modelReadback:
        "Cleared to backtrack, line up and wait runway two four, report ready for takeoff, ANAC 123.",
      audioTrack: 6,
    },
    interaction: {
      prompt:
        "A flight attendant tells you an unaccompanied minor has passed out. Call Vitoria Tower, explain and request medical assistance.",
      modelReport:
        "Vitoria Tower, ANAC 123, an unaccompanied minor has passed out onboard. Request medical assistance.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, vacate the runway at taxiway Charlie and return to parking spot number three. Does the minor need assistance?",
      modelCorrection:
        "AFFIRM. The minor needs medical assistance. Vacate the runway at Charlie and return to parking spot number three, ANAC 123.",
      audioTrack: 7,
      correctionType: "AFFIRM",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to vacate the runway at taxiway Charlie and return to parking spot number three. The controller asked if the minor needed assistance.",
    },
  },
  {
    id: "24C-s4",
    examVersion: "24C",
    situationNumber: 4,
    title: "Recife — truck on runway",
    context: "You are going to land at Guararapes Airport.",
    readback: {
      atcFacility: "Recife Tower",
      atcMessage:
        "ANAC 123, continue your approach to runway one eight followed by circling to runway three six. Report downwind leg.",
      modelReadback:
        "Continue approach runway one eight, followed by circling to runway three six. Report downwind leg, ANAC 123.",
      audioTrack: 8,
    },
    interaction: {
      prompt:
        "You are cleared to land and see a truck on the runway. Call Recife Tower to report and say your intentions.",
      modelReport:
        "Recife Tower, ANAC 123, there is a truck on the runway. Going around, missed approach.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, turn left, report downwind leg runway three six. Are you going around because of a runway incursion? Confirm.",
      modelCorrection:
        "AFFIRM. We are going around because of a runway incursion. Turn left. Report downwind leg runway three six, ANAC 123.",
      audioTrack: 9,
      correctionType: "AFFIRM",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to turn left and report downwind leg runway three six. The controller asked if I was going around because of a runway incursion and asked me to confirm.",
    },
  },
  {
    id: "24C-s5",
    examVersion: "24C",
    situationNumber: 5,
    title: "San Francisco — drone near aircraft",
    context: "You are at San Francisco Airport.",
    readback: {
      atcFacility: "San Francisco Ground",
      atcMessage:
        "ANAC 123, approved taxi to the holding point, runway zero one right, via taxiways Golf, Bravo and Alpha. Approaching holding point monitor Tower on one one eight point eight five. Number six for departure.",
      modelReadback:
        "Taxi to the holding point runway zero one right, via taxiways Golf, Bravo and Alpha. Monitor Tower on one one eight point eight five, ANAC 123.",
      audioTrack: 10,
    },
    interaction: {
      prompt:
        "During taxi, you see a drone flying near your aircraft. Call San Francisco Ground to inform them.",
      modelReport:
        "San Francisco Ground, ANAC 123, there is a drone flying near my aircraft. Request instructions.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage: "ANAC 123, hold position. Please confirm. Is there debris near your aircraft?",
      modelCorrection:
        "NEGATIVE. There is a drone flying near my aircraft. Holding position, ANAC 123.",
      audioTrack: 11,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to hold position and asked me to confirm. The controller asked if there was debris near my aircraft.",
    },
  },
];

export const EXAM_25C_SITUATIONS: ExamSituation[] = [
  {
    id: "25C-s1",
    examVersion: "25C",
    situationNumber: 1,
    title: "Ezeiza — collision with fire truck",
    context: "You have just landed at Ezeiza Airport. Visibility is poor.",
    readback: {
      atcFacility: "Ezeiza Ground",
      atcMessage:
        "ANAC 123, taxi via taxiways Hotel and Delta to gate ten. Cleared to cross runway one seven. Report vacated.",
      modelReadback:
        "Taxi via Hotel and Delta to gate ten. Cleared to cross runway one seven. Report runway vacated, ANAC 123.",
      audioTrack: 2,
    },
    interaction: {
      prompt:
        "While taxiing on taxiway Delta, you hit a fire truck and need to be towed to the hangar. Call Ground Control to explain and request assistance.",
      modelReport:
        "Ezeiza Ground, ANAC 123, we have hit a fire truck. We need to be towed to the hangar. Request assistance.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, I understand you had a collision with a truck and your helicopter is on fire. Confirm? Assistance is on the way.",
      modelCorrection:
        "NEGATIVE, Ground. We are not on fire. We have collided with a fire truck, we need to be towed to the hangar, ANAC 123.",
      audioTrack: 3,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller understood that I had a collision with a truck and that my helicopter was on fire. The controller asked me to confirm and said assistance was on the way.",
    },
  },
  {
    id: "25C-s2",
    examVersion: "25C",
    situationNumber: 2,
    title: "Gold Coast — engine oil temperature",
    context: "You are going to land at Gold Coast Airport.",
    readback: {
      atcFacility: "Brisbane Approach",
      atcMessage:
        "ANAC 123, Brisbane Approach, descend to flight level one four zero, turn right heading one six zero, expect one zero minute hold at Charlie Golf VOR.",
      modelReadback:
        "Descend to flight level one four zero, right turn heading one six zero, expecting one zero minute hold at CG VOR, ANAC 123.",
      audioTrack: 4,
    },
    interaction: {
      prompt:
        "Your left engine oil temperature has increased beyond limits so you shut it down. Contact Brisbane Approach to report and say your intentions.",
      modelReport:
        "Pan Pan Pan, Brisbane Approach, ANAC 123, we have high oil temperature in our left engine. We are shutting it down. We need to land as soon as possible.",
      urgency: "PAN-PAN",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, fly direct to Charlie Golf VOR and expect direct approach to runway one four. I understand you shut one of your engines down due to high oil temperature. Confirm?",
      modelCorrection:
        "AFFIRM. I shut my engine down. Fly direct to CG VOR and expect direct approach to runway one four, ANAC 123.",
      audioTrack: 5,
      correctionType: "AFFIRM",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to fly direct to Charlie Golf VOR and expect direct approach to runway one four. The controller understood that I had shut one engine down due to high oil temperature and asked me to confirm.",
    },
  },
  {
    id: "25C-s3",
    examVersion: "25C",
    situationNumber: 3,
    title: "Galeão — mountains ahead",
    context: "You are approaching Galeao Airport.",
    readback: {
      atcFacility: "Rio Approach",
      atcMessage:
        "ANAC 123, Rio Approach. Descend to five thousand feet, and turn left heading two seven zero degrees. Adjust speed to one one zero knots.",
      modelReadback:
        "Descend to five thousand feet, turn left heading two seven zero, speed one one zero knots, ANAC 123.",
      audioTrack: 6,
    },
    interaction: {
      prompt:
        "You notice mountains ahead and suspect ATC has forgotten about you. Call Rio Approach, explain and ask for new vectors to Galeao.",
      modelReport:
        "Rio Approach, ANAC 123, I see mountains ahead of me. Request vectors to Galeao.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, turn right heading one zero zero degrees. Do you intend to divert to Santos Dumont Airport?",
      modelCorrection:
        "NEGATIVE, we intend to land at Galeao Airport. Turn right heading one zero zero degrees, ANAC 123.",
      audioTrack: 7,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to turn right heading one zero zero degrees and asked if I intended to divert to Santos Dumont Airport.",
    },
  },
  {
    id: "25C-s4",
    examVersion: "25C",
    situationNumber: 4,
    title: "Recife — truck on runway",
    context: "You are going to land at Guararapes Airport.",
    readback: {
      atcFacility: "Recife Tower",
      atcMessage:
        "ANAC 123, continue your approach to runway one eight followed by circling to runway three six. Report downwind leg.",
      modelReadback:
        "Continue approach runway one eight, followed by circling to runway three six. Report downwind leg, ANAC 123.",
      audioTrack: 8,
    },
    interaction: {
      prompt:
        "You are cleared to land and see a truck on the runway. Call Recife Tower to report and say your intentions.",
      modelReport:
        "Recife Tower, ANAC 123, there is a truck on the runway. Going around, missed approach.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, turn left, report downwind leg runway three six. Are you going around because your main gear is stuck? Confirm.",
      modelCorrection:
        "NEGATIVE. We are going around because there is a truck on the runway. Turn left. Report downwind leg runway three six, ANAC 123.",
      audioTrack: 9,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to turn left and report downwind leg runway three six. The controller asked if I was going around because my main gear was stuck and asked me to confirm.",
    },
  },
  {
    id: "25C-s5",
    examVersion: "25C",
    situationNumber: 5,
    title: "Santiago — hot air balloon (12 o'clock)",
    context: "You are approaching Santiago Airport.",
    readback: {
      atcFacility: "Santiago Approach",
      atcMessage:
        "ANAC 123, radar contact, turn right heading three four zero, descend to five thousand feet, report passing niner thousand feet, and expect ILS runway one seven left.",
      modelReadback:
        "Turn right heading three four zero, descend to five thousand feet, report passing niner thousand feet, and expect ILS runway one seven left, ANAC 123.",
      audioTrack: 10,
    },
    interaction: {
      prompt:
        "During approach you see a hot air balloon right ahead. Call Santiago Approach to report and request deviation.",
      modelReport:
        "Santiago Approach, there is a hot air balloon ahead of us. Request deviation, ANAC 123.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, turn two zero degrees left. Confirm the hot air balloon is at your twelve o'clock position.",
      modelCorrection:
        "AFFIRM. The hot air balloon is at our twelve o'clock position. Turn two zero degrees left, ANAC 123.",
      audioTrack: 11,
      correctionType: "AFFIRM",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to turn two zero degrees left and asked me to confirm if the hot air balloon was at my twelve o'clock position.",
    },
  },
];

export const EXAM_26C_SITUATIONS: ExamSituation[] = [
  {
    id: "26C-s1",
    examVersion: "26C",
    situationNumber: 1,
    title: "Dubai — hydraulic failure",
    context: "You are approaching Dubai Airport.",
    readback: {
      atcFacility: "Dubai Approach",
      atcMessage:
        "ANAC 123, cleared Arrival. Descend and maintain four thousand feet. Report passing six thousand. QNH one zero one three. Caution, birds in the vicinity of the airport.",
      modelReadback:
        "Cleared Arrival. Descend and maintain four thousand feet. Report passing six thousand. QNH one zero one three, ANAC 123.",
      audioTrack: 2,
    },
    interaction: {
      prompt:
        "You lost your left hydraulic system and need the emergency hydraulic system to lower the landing gear. Call Dubai Approach to inform and say your intentions.",
      modelReport:
        "Pan Pan Pan, Dubai Approach, ANAC 123, we have lost our left hydraulic system. We will need to use the emergency hydraulic system to lower the landing gear.",
      urgency: "PAN-PAN",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, descend to two thousand feet and say your indicated airspeed. Do you have a problem with your autopilot? Confirm.",
      modelCorrection:
        "NEGATIVE. We had hydraulic failure. Descending to two thousand feet. Speed one two zero knots, ANAC 123.",
      audioTrack: 3,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to descend to two thousand feet and say my indicated airspeed. The controller asked if I had a problem with my autopilot and asked me to confirm.",
    },
  },
  {
    id: "26C-s2",
    examVersion: "26C",
    situationNumber: 2,
    title: "Vitória — minor passed out",
    context: "You are at Vitoria Airport.",
    readback: {
      atcFacility: "Vitoria Tower",
      atcMessage:
        "ANAC 123, cleared to backtrack, line up and wait runway two four. Report ready for takeoff.",
      modelReadback:
        "Cleared to backtrack, line up and wait runway two four, report ready for takeoff, ANAC 123.",
      audioTrack: 4,
    },
    interaction: {
      prompt:
        "A flight attendant tells you an unaccompanied minor has passed out. Call Vitoria Tower to report and request assistance.",
      modelReport:
        "Vitoria Tower, ANAC 123, an unaccompanied minor has passed out. Request medical assistance.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, vacate the runway at taxiway Bravo and hold. An ambulance will be sent straight away. I understand the first officer has fainted. Confirm?",
      modelCorrection: "NEGATIVE. A minor has passed out, ANAC 123.",
      audioTrack: 5,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to vacate the runway at taxiway Bravo and hold. An ambulance would be sent straight away. The controller understood that the first officer had fainted and asked me to confirm.",
    },
  },
  {
    id: "26C-s3",
    examVersion: "26C",
    situationNumber: 3,
    title: "Toronto — request runway 15L",
    context: "You are going to land at Toronto Airport.",
    readback: {
      atcFacility: "Toronto Arrival",
      atcMessage:
        "ANAC 123, Toronto Arrival Control. Expect visual approach, runway zero five. Descend to five thousand feet.",
      modelReadback:
        "Expect visual approach runway zero five, descend to five thousand feet, ANAC 123.",
      audioTrack: 6,
    },
    interaction: {
      prompt:
        "ATIS informs work in progress on several taxiways. Call Toronto Arrival to request landing on runway one five left, closest to your company's gates.",
      modelReport:
        "Toronto Arrival, ANAC 123, request landing on runway one five left, closest to our company gates.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, stop your descent at six thousand feet and reduce speed to eight zero knots. Are you requesting to land on runway one five left? Confirm.",
      modelCorrection:
        "AFFIRM, request landing on runway one five left. Stop descent at six thousand feet and reduce speed to eight zero knots, ANAC 123.",
      audioTrack: 7,
      correctionType: "AFFIRM",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to stop my descent at six thousand feet and reduce speed to eight zero knots. The controller asked if I was requesting to land on runway one five left and asked me to confirm.",
    },
  },
  {
    id: "26C-s4",
    examVersion: "26C",
    situationNumber: 4,
    title: "Miami RNAV — GPS failure",
    context: "You have just taken off from Miami Airport using RNAV.",
    readback: {
      atcFacility: "Miami Tower",
      atcMessage:
        "ANAC 123, climb and maintain five thousand feet, squawk three four three two, and proceed to Fox Lima Lima VORTAC. Call Miami Departure on frequency one one niner point four five.",
      modelReadback:
        "Climb and maintain five thousand feet, squawk three four three two, proceed to FLL VORTAC. Call Miami Departure on one one niner point four five, ANAC 123.",
      audioTrack: 8,
    },
    interaction: {
      prompt: "You lost your GPS. Call Miami Tower to inform them about your problem.",
      modelReport:
        "Miami Tower, ANAC 123, we have lost our GPS. We would like to continue using conventional navigation.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, your transmission is readable but with difficulty. I understand you are having problems with your GPWS. Is that it? How do you read me?",
      modelCorrection:
        "NEGATIVE. We are having problems with our GPS. Readability three, ANAC 123.",
      audioTrack: 9,
      correctionType: "NEGATIVE",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller said my transmission was readable but with difficulty. The controller understood that I was having problems with my GPWS and asked if that was correct. The controller also asked how I read them.",
    },
  },
  {
    id: "26C-s5",
    examVersion: "26C",
    situationNumber: 5,
    title: "Salvador — dog on taxiway",
    context: "You are at Salvador Airport.",
    readback: {
      atcFacility: "Salvador Ground",
      atcMessage:
        "ANAC 123, approved taxi to holding point runway one zero, via taxiways Juliet and Bravo, follow Cessna Citation ahead of you, approaching holding point contact Tower on frequency one one eight decimal six zero.",
      modelReadback:
        "Taxi to holding point runway one zero, via taxiways Juliet and Bravo. Follow Citation. Approaching holding point will contact Tower on one one eight decimal six zero, ANAC 123.",
      audioTrack: 10,
    },
    interaction: {
      prompt:
        "While taxiing on taxiway Bravo, you see a loose dog close to the taxiway. Call Salvador Ground to report.",
      modelReport:
        "Salvador Ground, ANAC 123. There is a loose dog close to taxiway Bravo.",
      urgency: "routine",
    },
    atcFollowUp: {
      atcMessage:
        "ANAC 123, hold position. Confirm there is a dog by taxiway Bravo. Ground staff is on the way.",
      modelCorrection:
        "AFFIRM, there is a loose dog close to taxiway Bravo. Hold position, ANAC 123.",
      audioTrack: 11,
      correctionType: "AFFIRM",
    },
    reportedSpeech: {
      modelAnswer:
        "The controller instructed me to hold position and asked me to confirm if there was a dog by taxiway Bravo. The controller said ground staff was on the way.",
    },
  },
];

const RAW_EXAM_SITUATIONS: ExamSituation[] = [
  ...EXAM_23C_SITUATIONS,
  ...EXAM_24C_SITUATIONS,
  ...EXAM_25C_SITUATIONS,
  ...EXAM_26C_SITUATIONS,
];

export const ALL_EXAM_SITUATIONS: ExamSituation[] = withRecommendedNotes(RAW_EXAM_SITUATIONS);

export function getSituationsByExam(version: ExamVersion): ExamSituation[] {
  return ALL_EXAM_SITUATIONS.filter((s) => s.examVersion === version);
}

export { CALLSIGN };
