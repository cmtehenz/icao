/** Auto-generated from knowledge/premium — run: node scripts/generate-dev-knowledge-entries.mjs */
import type { DevKnowledgeEntry } from "@/lib/knowledge/devKnowledge/types";

export const BATCH01_DEV_ENTRIES: DevKnowledgeEntry[] = [
  {
    "catalogId": "0001",
    "id": "0001",
    "displayTerm": "Fly Direct",
    "term": "fly direct",
    "slug": "fly-direct",
    "category": "ATC Phraseology",
    "meaningEn": "Fly directly toward a specified waypoint, navigation aid, airport, or fix.",
    "meaningPt": "Voe diretamente para um ponto específico.",
    "whenUsed": "A Fly Direct clearance changes your navigation.",
    "example": "ANAC123, fly direct NITUX.",
    "sayPhrase": "Flying direct NITUX, ANAC123.",
    "icaoQuestion": "When would ATC instruct an aircraft to fly direct?",
    "icaoSpeakText": "ATC may instruct an aircraft to fly direct when they want to shorten the route, improve traffic flow, reduce delays, or help the aircraft avoid weather. It is a common instruction in both IFR and VFR operations.",
    "missionBrief": "Today you'll learn one of the most common ATC instructions used worldwide.\n\nFly Direct is a navigation clearance that allows an aircraft to proceed directly to a specified waypoint, navigation aid, airport, or fix instead of following the originally planned route.\n\nProfessional pilots hear this instruction every day because it saves time, reduces controller workload, and improves traffic flow.",
    "captainTeaching": "Gustavo, imagine you're driving with Google Maps. The GPS originally planned a route through several streets. Suddenly, it finds a faster way and tells you to turn immediately toward your destination. That's exactly what Fly Direct means in aviation.\n\nIt is one of the simplest and most common ATC shortcuts. Your responsibility is to acknowledge the clearance, read back the waypoint correctly, and navigate directly to it while continuing to comply with every other clearance already in effect.\n\nRemember: Fly Direct changes your route—not your altitude, speed, or other instructions.",
    "operationalContext": "You're flying an H130 from Ituporanga (SSKG) to Balneário Camboriú.\n\nOriginally your GPS route contains six waypoints.\n\nATC sees there is no conflicting traffic and says:\n\n\"ANAC123, fly direct Balneário.\"\n\nInstead of continuing through every waypoint, you simply navigate directly toward Balneário while complying with every other ATC clearance.\n\nNothing else changes.\n\nYour altitude remains the same.\n\nYour transponder remains the same.\n\nYour frequency remains the same.\n\nOnly your navigation changes.",
    "sayItCoach": "Fly Direct.",
    "icaoModelAnswer": "ATC may instruct an aircraft to fly direct when they want to shorten the route, improve traffic flow, reduce delays, or help the aircraft avoid weather. It is a common instruction in both IFR and VFR operations.",
    "memoryTrick": "Imagine drawing a straight line on your GPS.\n\nNo airways. No extra turns. No intermediate fixes.\n\nJust one straight line.\n\nFly Direct = Straight to the point.",
    "operationalMeaning": "A Fly Direct clearance changes your navigation.\n\nInstead of following the published airway, SID, STAR, or flight plan, ATC authorizes you to fly in a straight line to a designated point.\n\nThe clearance does not cancel any previous altitude, speed, frequency, or other ATC restrictions.",
    "whyAtcUsesIt": [
      "shorten the route",
      "reduce controller workload",
      "improve traffic flow",
      "avoid weather",
      "reduce airborne delays",
      "provide efficient sequencing",
      "reduce fuel consumption"
    ],
    "atcPhraseology": [
      "ANAC123, fly direct NITUX.",
      "ANAC123, cleared direct AFA VOR.",
      "ANAC123, fly direct present position to waypoint BRAVO.",
      "ANAC123, proceed direct REKPA.",
      "ANAC123, fly direct the airport."
    ],
    "pilotReadbacks": [
      "Flying direct NITUX, ANAC123.",
      "Cleared direct AFA VOR, ANAC123.",
      "Direct BRAVO, ANAC123.",
      "Proceeding direct REKPA, ANAC123.",
      "Flying direct the airport, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Saying: Go direct.  \n  ✔ Prefer: Fly direct. or Proceed direct.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Flying direct NITUX, ANAC123.\n\n- ❌ Turning immediately without understanding the destination waypoint.  \n  Always identify the correct fix before changing course.\n\n- ❌ Thinking Fly Direct cancels previous clearances.  \n  It doesn't. Maintain altitude, speed and frequency unless instructed otherwise.",
    "pronunciationCoaching": "**Fly Direct** (flai dih-REKT)\n\n**Word Stress**\n\n- Fly → clear and short\n- Direct → stress the second syllable: di-RECT (not DI-rect)\n\nPractice slowly:\n\nFly... Direct...\n\nNow together:\n\nFly Direct.\n\nThen inside a complete transmission:\n\nFlying direct NITUX, ANAC123.",
    "relatedConcepts": [
      "Resume Own Navigation",
      "Radar Vectors",
      "Fly Heading",
      "Waypoint",
      "RNAV",
      "VOR",
      "GPS Navigation"
    ],
    "references": [
      {
        "label": "FAA Pilot/Controller Glossary — Direct",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA AIM (Aeronautical Information Manual) — ATC Clearances and Route Amendments",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management Phraseology",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Standard Radiotelephony Phraseology"
      },
      {
        "label": "SKYbrary — Air Traffic Control Phraseology and Navigation Concepts",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0002",
    "id": "0002",
    "displayTerm": "Hold Short",
    "term": "hold short",
    "slug": "hold-short",
    "category": "ATC Phraseology",
    "meaningEn": "Stop before a runway, taxiway, or designated holding position.",
    "meaningPt": "Pare antes da pista ou do ponto de espera indicado.\n\nNão avance sem autorização.",
    "whenUsed": "A Hold Short instruction requires the aircraft to stop before reaching a runway, taxiway, or any specified holding point.",
    "example": "ANAC123, hold short runway one eight.",
    "sayPhrase": "Holding short runway one eight, ANAC123.",
    "icaoQuestion": "Why is it important to read back Hold Short instructions?",
    "icaoSpeakText": "Hold Short instructions protect active runways. Reading them back correctly confirms that the pilot understood the restriction and helps prevent runway incursions.",
    "missionBrief": "Today you'll learn one of the most important safety instructions in aviation.\n\nEvery year, runway incursions occur because a pilot misunderstood—or ignored—a simple instruction:\n\nHold Short.\n\nProfessional pilots treat these two words with absolute respect because they protect aircraft during takeoff and landing.",
    "captainTeaching": "Gustavo, imagine you're approaching a railroad crossing. The gates are down, but you can't see the train yet. You don't cross just because it looks safe—you wait until it's truly safe.\n\nA Hold Short instruction works the same way. ATC has a complete picture of the airport that you may not have from the cockpit.\n\nNever guess.\n\nNever assume.\n\nNever cross until the controller clearly authorizes you.\n\nRemember: A taxi clearance is not a runway crossing clearance.",
    "operationalContext": "You're taxiing your H130 for departure.\n\nGround instructs:\n\n\"ANAC123, taxi via Alpha, hold short runway one eight.\"\n\nAs you approach the holding position, you notice the runway looks completely empty.\n\nYou do not cross.\n\nA few seconds later, an Embraer 195 lands at high speed.\n\nIf you had crossed without clearance, the consequences could have been catastrophic.\n\nProfessional pilots never assume.\n\nThey wait for the clearance.",
    "sayItCoach": "Hold Short.",
    "icaoModelAnswer": "Hold Short instructions protect active runways. Reading them back correctly confirms that the pilot understood the restriction and helps prevent runway incursions.",
    "memoryTrick": "Imagine a red stop sign painted across the taxiway.\n\nYou stop.\n\nYou wait.\n\nYou do not cross until someone removes the stop sign.\n\nThat's exactly what Hold Short means.",
    "operationalMeaning": "A Hold Short instruction requires the aircraft to stop before reaching a runway, taxiway, or any specified holding point.\n\nEven if the runway appears empty, the pilot must not cross until receiving an explicit crossing or takeoff clearance.\n\nThis instruction is one of the most critical barriers against runway incursions.",
    "whyAtcUsesIt": [
      "protect landing traffic",
      "protect departing traffic",
      "prevent runway incursions",
      "separate aircraft safely",
      "coordinate ground movement",
      "maintain airport safety",
      "sequence arrivals and departures"
    ],
    "atcPhraseology": [
      "ANAC123, hold short runway one eight.",
      "ANAC123, taxi via Alpha, hold short runway two seven.",
      "ANAC123, hold short the active runway.",
      "ANAC123, cross runway zero niner, hold short runway one eight.",
      "ANAC123, hold short taxiway Bravo."
    ],
    "pilotReadbacks": [
      "Holding short runway one eight, ANAC123.",
      "Taxi via Alpha, holding short runway two seven, ANAC123.",
      "Holding short the active runway, ANAC123.",
      "Crossing runway zero niner, holding short runway one eight, ANAC123.",
      "Holding short taxiway Bravo, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Reading back only: Roger.  \n  ✔ Correct: Holding short runway one eight, ANAC123.\n\n- ❌ Saying: Holding position.  \n  ✔ Better: Holding short runway one eight.\n\n- ❌ Assuming a taxi clearance allows runway crossing.  \n  It doesn't. Runway crossings require an explicit clearance.\n\n- ❌ Forgetting the runway number in the readback.  \n  Always include the runway or holding point whenever possible.",
    "pronunciationCoaching": "**Hold Short** (hold short)\n\n**Word Stress**\n\n- Hold → strong\n- Short → clear but lighter\n\nPractice:\n\nHold... Short...\n\nTogether:\n\nHold Short.\n\nNow inside a transmission:\n\nANAC123, hold short runway one eight.",
    "relatedConcepts": [
      "Line Up and Wait",
      "Taxi Via",
      "Cross Runway",
      "Runway Incursion",
      "Cleared for Takeoff",
      "Ground Control"
    ],
    "references": [
      {
        "label": "FAA JO 7110.65 — Air Traffic Control Procedures (Taxi and Hold Short Instructions)",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Airport Operations",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Hold Short",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Standard Radiotelephony Phraseology",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "SKYbrary — Runway Incursion Prevention and Ground Operations",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0003",
    "id": "0003",
    "displayTerm": "Line Up and Wait",
    "term": "line up and wait",
    "slug": "line-up-and-wait",
    "category": "ATC Phraseology",
    "meaningEn": "Enter the runway, align the aircraft with the runway centerline, and wait for takeoff clearance.",
    "meaningPt": "Alinhe na pista e aguarde autorização para decolar.",
    "whenUsed": "A Line Up and Wait (LUAW) clearance authorizes the aircraft to enter the active runway and position itself for departure.",
    "example": "ANAC123, runway one eight, line up and wait.",
    "sayPhrase": "Line up and wait runway one eight, ANAC123.",
    "icaoQuestion": "What is the difference between \"Line Up and Wait\" and \"Cleared for Takeoff\"?",
    "icaoSpeakText": "\"Line Up and Wait\" allows the aircraft to enter the runway and prepare for departure, but the pilot must remain stopped. \"Cleared for Takeoff\" is the instruction that authorizes the aircraft to begin the takeoff roll.",
    "missionBrief": "Today's lesson covers one of the most safety-critical runway instructions you'll ever receive.\n\nMany runway incursions and serious accidents have happened because pilots misunderstood the difference between:\n\nProfessional pilots never confuse these two clearances.",
    "captainTeaching": "Gustavo, imagine you're first in line at a traffic light.\n\nThe light is still red.\n\nYou move your car up to the stop line because you're next.\n\nBut you don't drive through the intersection.\n\nThat's exactly what Line Up and Wait means.\n\nATC is positioning you so departure can happen quickly, but the runway is not yet yours.\n\nNever assume that entering the runway means you're cleared to depart.\n\nIn aviation, one extra second of patience is much safer than one second of assumption.",
    "operationalContext": "You're flying your H130 at a controlled airport.\n\nGround has already transferred you to Tower.\n\nTower says:\n\n\"ANAC123, runway one eight, line up and wait.\"\n\nYou taxi onto the runway.\n\nAlign with the centerline.\n\nComplete your final checks.\n\nBut you do not begin the takeoff roll.\n\nA Boeing 737 is still on short final.\n\nOnly after it lands and clears the runway will Tower say:\n\n\"ANAC123, runway one eight, cleared for takeoff.\"\n\nOnly then do you begin your departure.",
    "sayItCoach": "Line up and wait.",
    "icaoModelAnswer": "\"Line Up and Wait\" allows the aircraft to enter the runway and prepare for departure, but the pilot must remain stopped. \"Cleared for Takeoff\" is the instruction that authorizes the aircraft to begin the takeoff roll.",
    "memoryTrick": "Think of a sprinter at the Olympic Games.\n\nThe athlete is already in position.\n\nHands on the ground.\n\nFeet in the blocks.\n\nReady to run.\n\nBut movement only begins when the starter says:\n\nGo.\n\nLine Up and Wait puts you in position.\n\nCleared for Takeoff is the \"Go.\"",
    "operationalMeaning": "A Line Up and Wait (LUAW) clearance authorizes the aircraft to enter the active runway and position itself for departure.\n\nIt does NOT authorize the takeoff roll.\n\nThe aircraft must remain stopped on the runway centerline until ATC issues:\n\n\"Cleared for Takeoff.\"",
    "whyAtcUsesIt": [
      "reduce runway occupancy time",
      "improve departure efficiency",
      "prepare aircraft for immediate departure",
      "sequence arriving and departing traffic",
      "minimize delays during busy operations"
    ],
    "atcPhraseology": [
      "ANAC123, runway one eight, line up and wait.",
      "ANAC123, line up and wait runway two seven.",
      "ANAC123, line up and wait behind landing traffic.",
      "ANAC123, runway one eight, line up and wait, traffic departing.",
      "ANAC123, line up and wait, expect immediate departure."
    ],
    "pilotReadbacks": [
      "Line up and wait runway one eight, ANAC123.",
      "Lining up and waiting runway two seven, ANAC123.",
      "Line up and wait behind landing traffic, ANAC123.",
      "Runway one eight, line up and wait, ANAC123.",
      "Line up and wait, expecting immediate departure, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Believing Line Up and Wait authorizes takeoff.  \n  ✔ It only authorizes runway entry.\n\n- ❌ Beginning the takeoff roll after hearing: \"...behind landing traffic...\"  \n  ✔ Wait for: Cleared for Takeoff.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Line up and wait runway one eight, ANAC123.\n\n- ❌ Forgetting the runway number.  \n  Always include the assigned runway in your readback.",
    "pronunciationCoaching": "**Target Phrase:** Line Up and Wait\n\n**Pronunciation:** LAIN up and WAIT\n\n**Word Stress**\n\n- Line → strong\n- Wait → strong\n\nDo not rush the phrase.\n\nPractice:\n\nLine... Up... And... Wait...\n\nNow naturally:\n\nLine up and wait.\n\nThen inside a transmission:\n\nANAC123, runway one eight, line up and wait.",
    "relatedConcepts": [
      "Cleared for Takeoff",
      "Hold Short",
      "Runway Incursion",
      "Taxi Via",
      "Cross Runway",
      "Number One for Departure"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Standard Radiotelephony Phraseology",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA JO 7110.65 — Air Traffic Control Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Line Up and Wait",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Airport Operations",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — Line Up and Wait / Runway Safety",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0004",
    "id": "0004",
    "displayTerm": "Cleared for Takeoff",
    "term": "cleared for takeoff",
    "slug": "cleared-for-takeoff",
    "category": "ATC Phraseology",
    "meaningEn": "ATC authorizes the aircraft to begin the takeoff roll on the assigned runway.",
    "meaningPt": "Autorizado para decolagem.",
    "whenUsed": "A Cleared for Takeoff clearance gives the pilot legal and operational authorization to begin the takeoff.",
    "example": "ANAC123, runway zero seven, cleared for takeoff.",
    "sayPhrase": "Runway zero seven, cleared for takeoff, ANAC123.",
    "icaoQuestion": "Why is it dangerous to assume you are cleared for takeoff?",
    "icaoSpeakText": "Assuming takeoff clearance can lead to a runway incursion or collision with another aircraft. Pilots should begin the takeoff roll only after hearing the explicit instruction \"Cleared for Takeoff.\"",
    "missionBrief": "Today you'll learn one of the most important phrases in aviation.\n\nThere is only one instruction that authorizes an aircraft to begin its takeoff roll:\n\nCleared for Takeoff\n\nProfessional pilots never assume they have takeoff clearance. They wait to hear these exact words.",
    "captainTeaching": "Gustavo, this is one of the most disciplined moments in every flight.\n\nImagine you've completed every checklist.\n\nThe helicopter is perfectly aligned.\n\nThe engine instruments are normal.\n\nThe runway is completely empty.\n\nYou are ready.\n\nBut you still do not move.\n\nWhy?\n\nBecause in aviation, being ready is not enough.\n\nYou need authorization.\n\nProfessional pilots never take off because the runway looks clear.\n\nThey take off because ATC has officially transferred the runway to them.\n\nThat's why you'll hear experienced pilots say:\n\n\"No clearance, no takeoff.\"",
    "operationalContext": "You're flying your H130 from Navegantes Airport.\n\nTower previously instructed:\n\n\"ANAC123, runway zero seven, line up and wait.\"\n\nYou enter the runway and align with the centerline.\n\nA commercial jet lands ahead of you and vacates the runway.\n\nThe controller then says:\n\n\"ANAC123, runway zero seven, cleared for takeoff.\"\n\nOnly now do you:\n\nThe runway became yours only after hearing those words.",
    "sayItCoach": "",
    "icaoModelAnswer": "Assuming takeoff clearance can lead to a runway incursion or collision with another aircraft. Pilots should begin the takeoff roll only after hearing the explicit instruction \"Cleared for Takeoff.\"",
    "memoryTrick": "Imagine an airport runway as a stage.\n\nMany aircraft may be waiting behind the curtain.\n\nOnly one actor is invited onto the stage.\n\nThe invitation is:\n\nCleared for Takeoff.\n\nWithout the invitation, the show never begins.",
    "operationalMeaning": "A Cleared for Takeoff clearance gives the pilot legal and operational authorization to begin the takeoff.\n\nIt follows only after the controller has confirmed that:\n\nUntil these words are spoken, the aircraft must remain stationary, even if it is already lined up on the runway.",
    "whyAtcUsesIt": [
      "authorize departure",
      "ensure runway separation",
      "coordinate arrivals and departures",
      "maintain traffic flow",
      "guarantee runway safety",
      "comply with ICAO and FAA separation standards"
    ],
    "atcPhraseology": [
      "ANAC123, runway zero seven, cleared for takeoff.",
      "ANAC123, wind zero eight zero at six knots, runway one eight, cleared for takeoff.",
      "ANAC123, cleared for immediate takeoff.",
      "ANAC123, runway two seven, cleared for takeoff, traffic departing parallel runway.",
      "ANAC123, after departure fly runway heading, runway one eight, cleared for takeoff."
    ],
    "pilotReadbacks": [
      "Runway zero seven, cleared for takeoff, ANAC123.",
      "Cleared for takeoff runway one eight, ANAC123.",
      "Immediate takeoff approved, ANAC123.",
      "Cleared for takeoff, runway two seven, ANAC123.",
      "Runway heading after departure, cleared for takeoff, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Confusing Line Up and Wait with Cleared for Takeoff.  \n  Only the second authorizes departure.\n\n- ❌ Starting the takeoff because the runway appears empty.  \n  Visual observation never replaces ATC clearance.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Cleared for takeoff runway one eight, ANAC123.\n\n- ❌ Forgetting the runway number.  \n  Always include the runway in your readback.",
    "pronunciationCoaching": "**Target Phrase:** Cleared for Takeoff\n\n**Pronunciation:** kleerd for TAKE-off\n\n**Word Stress**\n\n- Cleared → clear and confident\n- Takeoff → stress TAKE\n\nDo not split it unnaturally into: Take... off...\n\nInstead, say it smoothly: Takeoff.\n\nPractice:\n\nCleared... Cleared for... Cleared for Takeoff.\n\nThen inside a complete transmission:\n\nRunway zero seven, cleared for takeoff, ANAC123.",
    "relatedConcepts": [
      "Line Up and Wait",
      "Hold Short",
      "Maintain Runway Heading",
      "Initial Climb",
      "Rejected Takeoff",
      "Immediate Takeoff"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management Phraseology",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65 — Air Traffic Control",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — ATC Clearance",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Airport Operations",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — Runway Safety and Standard Phraseology",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0005",
    "id": "0005",
    "displayTerm": "Cleared to Land",
    "term": "cleared to land",
    "slug": "cleared-to-land",
    "category": "ATC Phraseology",
    "meaningEn": "ATC authorizes the aircraft to land on the specified runway.",
    "meaningPt": "Autorizado para pouso.",
    "whenUsed": "A Cleared to Land clearance authorizes the pilot to complete the landing on the assigned runway.",
    "example": "ANAC123, runway zero seven, cleared to land.",
    "sayPhrase": "Runway zero seven, cleared to land, ANAC123.",
    "icaoQuestion": "What should a pilot do if the runway is in sight but landing clearance has not been received?",
    "icaoSpeakText": "The pilot should continue the approach while monitoring the radio and be prepared to follow ATC instructions. If landing clearance is not received in time, or if the approach becomes unsafe, the pilot should perform a go-around in accordance with ATC instructions or standard procedures.",
    "missionBrief": "Landing is one of the busiest phases of flight, and one of the easiest moments to make assumptions.\n\nToday you'll learn an essential rule:\n\nSeeing the runway does NOT mean you're authorized to land.\n\nAt a controlled airport, the landing is only authorized when Tower says:\n\n\"Cleared to Land.\"\n\nThese three words transfer the runway to you.",
    "captainTeaching": "Gustavo, imagine you're arriving at a hotel.\n\nYou can see your room.\n\nYour luggage is ready.\n\nThe door is right in front of you.\n\nBut you still don't enter until the receptionist hands you the key.\n\nCleared to Land is the key.\n\nThe runway may look empty from your cockpit, but ATC has a complete picture of the airport.\n\nThere may be a vehicle crossing.\n\nAnother aircraft may still be vacating.\n\nOr a departure may be rolling.\n\nProfessional pilots never land because they think it's safe.\n\nThey land because the controller has transferred the runway to them.",
    "operationalContext": "You're approaching Navegantes Airport in your H130.\n\nTower instructs:\n\n\"ANAC123, continue approach.\"\n\nYou continue descending.\n\nThe runway is clearly visible.\n\nEverything looks perfect.\n\nHowever, an aircraft is still backtracking on the runway.\n\nOnly after the runway becomes available does Tower transmit:\n\n\"ANAC123, runway zero seven, cleared to land.\"\n\nNow the runway is officially yours.\n\nYou continue the landing.",
    "sayItCoach": "",
    "icaoModelAnswer": "The pilot should continue the approach while monitoring the radio and be prepared to follow ATC instructions. If landing clearance is not received in time, or if the approach becomes unsafe, the pilot should perform a go-around in accordance with ATC instructions or standard procedures.",
    "memoryTrick": "Imagine the runway is a parking space reserved just for you.\n\nYou may see it.\n\nYou may be close to it.\n\nBut it only becomes yours when someone hands you the permission.\n\nThat permission is:\n\nCleared to Land.",
    "operationalMeaning": "A Cleared to Land clearance authorizes the pilot to complete the landing on the assigned runway.\n\nUntil this clearance is received, the pilot must continue the approach and remain prepared to:\n\nEven if the runway appears empty, the aircraft is not authorized to land without the appropriate clearance at a controlled airport.",
    "whyAtcUsesIt": [
      "authorize runway occupancy",
      "ensure runway separation",
      "protect departing aircraft",
      "coordinate runway crossings",
      "maintain airport safety",
      "sequence arriving traffic"
    ],
    "atcPhraseology": [
      "ANAC123, runway zero seven, cleared to land.",
      "ANAC123, wind zero eight zero at seven knots, runway one eight, cleared to land.",
      "ANAC123, number one, runway two seven, cleared to land.",
      "ANAC123, runway zero seven, cleared to land, caution wake turbulence.",
      "ANAC123, cleared to land, traffic vacating the runway."
    ],
    "pilotReadbacks": [
      "Runway zero seven, cleared to land, ANAC123.",
      "Cleared to land runway one eight, ANAC123.",
      "Number one, cleared to land runway two seven, ANAC123.",
      "Cleared to land, caution wake turbulence acknowledged, ANAC123.",
      "Cleared to land, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Confusing Continue Approach with Cleared to Land.  \n  They are completely different clearances.\n\n- ❌ Assuming an empty runway means landing is authorized.  \n  Only ATC can issue landing clearance at a controlled airport.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Cleared to land runway zero seven, ANAC123.\n\n- ❌ Forgetting the runway number.  \n  Whenever practical, include the runway in the readback.",
    "pronunciationCoaching": "**Target Phrase:** Cleared to Land\n\n**Pronunciation:** kleerd tə LAND\n\n**Word Stress**\n\n- Cleared → clear and positive\n- Land → strongest word in the phrase\n\nPractice:\n\nCleared... To land... Cleared to land.\n\nNow inside a complete transmission:\n\nANAC123, runway zero seven, cleared to land.\n\nSpeak smoothly, avoiding long pauses between the words.",
    "relatedConcepts": [
      "Continue Approach",
      "Go Around",
      "Missed Approach",
      "Visual Approach",
      "Number One for Landing",
      "Hold Short",
      "Runway Occupancy"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management and Standard Phraseology",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65 — Air Traffic Control",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — ATC Clearance",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Arrival and Landing Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — Standard Phraseology and Runway Safety",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0006",
    "id": "0006",
    "displayTerm": "Continue Approach",
    "term": "continue approach",
    "slug": "continue-approach",
    "category": "ATC Phraseology",
    "meaningEn": "Continue flying the approach toward the runway while awaiting further instructions.",
    "meaningPt": "Continue a aproximação.",
    "whenUsed": "A Continue Approach instruction tells the pilot to keep flying the current approach.",
    "example": "ANAC123, continue approach.",
    "sayPhrase": "Continuing approach, ANAC123.",
    "icaoQuestion": "What is the difference between Continue Approach and Cleared to Land?",
    "icaoSpeakText": "Continue Approach instructs the pilot to keep flying the approach while waiting for further instructions. Cleared to Land authorizes the aircraft to land on the assigned runway. The first is not a landing clearance.",
    "missionBrief": "Today's lesson covers one of the most misunderstood instructions in aviation.\n\nMany pilots believe that if Tower tells them to Continue Approach, they are automatically cleared to land.\n\nThat is incorrect.\n\nA professional pilot understands the difference immediately.",
    "captainTeaching": "Gustavo, imagine you're walking toward the gate at an airport.\n\nThe security guard says:\n\n\"Keep walking.\"\n\nThat doesn't mean you can enter.\n\nIt only means continue until I tell you otherwise.\n\nContinue Approach works exactly the same way.\n\nYou're still approaching.\n\nYou're still descending.\n\nYou're still preparing to land.\n\nBut the runway does not belong to you yet.\n\nOnly one instruction transfers the runway to you:\n\nCleared to Land.\n\nUntil then, keep flying the approach professionally and always be ready to execute a Go Around if instructed.",
    "operationalContext": "You're flying an H130 to Florianópolis International Airport.\n\nTower says:\n\n\"ANAC123, continue approach.\"\n\nThe runway is clearly visible.\n\nEverything looks normal.\n\nHowever, a business jet has just landed and is still slowing down on the runway.\n\nInstead of clearing you to land immediately, Tower keeps you on the approach while waiting for the runway to become available.\n\nA few moments later:\n\n\"ANAC123, runway one four, cleared to land.\"\n\nOnly now is the landing authorized.",
    "sayItCoach": "Continue Approach.",
    "icaoModelAnswer": "Continue Approach instructs the pilot to keep flying the approach while waiting for further instructions. Cleared to Land authorizes the aircraft to land on the assigned runway. The first is not a landing clearance.",
    "memoryTrick": "Think of a traffic light turning yellow.\n\nYou're allowed to continue moving.\n\nBut you don't yet have complete freedom.\n\nThat's exactly what Continue Approach means.\n\nYou are still approaching.\n\nThe runway is not yet yours.",
    "operationalMeaning": "A Continue Approach instruction tells the pilot to keep flying the current approach.\n\nIt is not a landing clearance.\n\nThe aircraft should continue descending and configuring for landing while remaining prepared to receive:\n\nThe pilot must never assume landing authorization.",
    "whyAtcUsesIt": [
      "keep arriving traffic flowing",
      "allow another aircraft to vacate the runway",
      "wait for a vehicle to clear the runway",
      "complete runway inspections",
      "sequence multiple arrivals",
      "delay landing clearance until the runway becomes available"
    ],
    "atcPhraseology": [
      "ANAC123, continue approach.",
      "ANAC123, continue approach, traffic vacating the runway.",
      "ANAC123, continue approach, expect late landing clearance.",
      "ANAC123, continue approach, number two behind the Airbus A320.",
      "ANAC123, continue approach, caution wake turbulence."
    ],
    "pilotReadbacks": [
      "Continuing approach, ANAC123.",
      "Continuing approach, number two, ANAC123.",
      "Continuing approach behind the Airbus, ANAC123.",
      "Continuing approach, expecting landing clearance, ANAC123.",
      "Continuing approach, caution wake turbulence acknowledged, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Assuming Continue Approach means landing is approved.  \n  ✔ Continue flying. Wait for: Cleared to Land.\n\n- ❌ Stopping the landing checklist while waiting.  \n  Continue normal approach procedures.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Continuing approach, ANAC123.\n\n- ❌ Becoming fixated on the runway.  \n  Continue monitoring the radio because ATC may issue Go Around, Continue Approach, or Cleared to Land at any moment.",
    "pronunciationCoaching": "**Target Phrase:** Continue Approach\n\n**Pronunciation:** kun-TIN-yoo uh-PROACH\n\n**Word Stress**\n\n- Continue → stress the second syllable\n- Approach → stress the second syllable\n\nPractice slowly:\n\nContinue... Approach...\n\nTogether:\n\nContinue Approach.\n\nNow inside a transmission:\n\nANAC123, continue approach.",
    "relatedConcepts": [
      "Cleared to Land",
      "Go Around",
      "Missed Approach",
      "Visual Approach",
      "Number One for Landing",
      "Radar Vectors"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM)",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM)",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — Standard Radiotelephony Phraseology",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0007",
    "id": "0007",
    "displayTerm": "Go Around",
    "term": "go around",
    "slug": "go-around",
    "category": "ATC Phraseology",
    "meaningEn": "A Go Around is the decision or instruction to discontinue the landing and climb away for another approach.",
    "meaningPt": "Arremeter.\n\nInterromper o pouso e iniciar uma nova aproximação.",
    "whenUsed": "A Go Around may be:",
    "example": "ANAC123, Go Around.",
    "sayPhrase": "Going around, ANAC123.",
    "icaoQuestion": "When would you decide to perform a Go Around?",
    "icaoSpeakText": "I would perform a Go Around whenever the approach became unstable or the landing could no longer be completed safely. For example, if another aircraft was still on the runway, if I experienced windshear, if I lost visual references, or if ATC instructed me to Go Around.",
    "missionBrief": "Every professional pilot performs Go Arounds.\n\nA Go Around is not a mistake.\n\nIt is not a failed landing.\n\nIt is one of the safest decisions a pilot can make.\n\nGood pilots know how to land.\n\nExcellent pilots know when not to land.\n\nToday you'll learn one of the most important safety maneuvers in aviation.",
    "captainTeaching": "Gustavo, imagine you're driving toward a parking space.\n\nJust as you're about to park, another car suddenly reverses into the space.\n\nYou don't force your way in.\n\nYou simply drive around the block and try again.\n\nAviation works the same way.\n\nA Go Around isn't about proving you can land.\n\nIt's about proving you know when not to.\n\nSome pilots think a Go Around is embarrassing.\n\nExperienced captains think exactly the opposite.\n\nEvery Go Around means someone made a professional decision before a situation became dangerous.\n\nIf you ever feel uncomfortable during the approach, remember this:\n\nThere is no shame in going around.\n\nThere is risk in continuing an unsafe landing.",
    "operationalContext": "You're flying your H130 into Florianópolis Airport.\n\nEverything looks perfect.\n\nThe runway is in sight.\n\nLanding checklist complete.\n\nAt approximately 200 feet AGL, Tower suddenly transmits:\n\n\"ANAC123, Go Around, traffic still on the runway.\"\n\nWithout hesitation you:\n\nThe passengers may wonder why.\n\nA professional pilot knows:\n\nThe safest landing is sometimes the one you don't complete.",
    "sayItCoach": "Going around, ANAC123.",
    "icaoModelAnswer": "I would perform a Go Around whenever the approach became unstable or the landing could no longer be completed safely. For example, if another aircraft was still on the runway, if I experienced windshear, if I lost visual references, or if ATC instructed me to Go Around.",
    "memoryTrick": "Imagine you're walking toward an elevator.\n\nJust before the doors close, someone steps inside carrying a large box.\n\nThere isn't enough space.\n\nDo you squeeze in?\n\nNo.\n\nYou simply wait for the next elevator.\n\nThat's exactly what a Go Around is.\n\nYou're choosing the next safe opportunity instead of forcing the current one.",
    "operationalMeaning": "A Go Around may be:\n\nThe objective is simple:\n\nDo not continue an unsafe landing.\n\nCommon reasons include:\n\nA Go Around is considered a normal maneuver, not an emergency.",
    "whyAtcUsesIt": [
      "maintain runway separation",
      "prevent collisions",
      "protect runway occupancy",
      "resolve traffic conflicts",
      "avoid unstable approaches",
      "respond to unexpected runway events"
    ],
    "atcPhraseology": [
      "ANAC123, Go Around.",
      "ANAC123, Go Around, traffic on the runway.",
      "ANAC123, Go Around, unstable spacing.",
      "ANAC123, Go Around, runway occupied.",
      "ANAC123, Go Around, windshear reported on final."
    ],
    "pilotReadbacks": [
      "Going around, ANAC123.",
      "ANAC123 going around.",
      "Going around due traffic, ANAC123.",
      "Going around, runway occupied, ANAC123.",
      "Going around, following published missed approach, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Thinking Go Around is an emergency.  \n  ✔ It is a normal safety maneuver.\n\n- ❌ Trying to \"save\" a bad landing.  \n  Professional pilots don't save unstable approaches. They discontinue them.\n\n- ❌ Saying: Abort landing.  \n  Although understandable, standard phraseology is: Going Around.\n\n- ❌ Delaying the decision.  \n  Every second spent trying to \"fix\" an unstable approach increases the risk.",
    "pronunciationCoaching": "**Target Phrase:** Go Around\n\n**Pronunciation:** GO uh-ROUND\n\n**Word Stress**\n\n- GO\n- Around (second syllable stronger)\n\nPractice:\n\nGo... Around... Go Around.\n\nNow naturally:\n\nGoing around, ANAC123.\n\nAvoid saying: Goooo Around\n\nKeep the rhythm natural and confident.",
    "relatedConcepts": [
      "Continue Approach",
      "Cleared to Land",
      "Missed Approach",
      "Windshear",
      "Unstable Approach",
      "Priority Landing",
      "Runway Occupancy"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM)",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM)",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Airplane Flying Handbook"
      },
      {
        "label": "FAA Pilot/Controller Glossary",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Go Around",
        "href": "https://skybrary.aero"
      },
      {
        "label": "SKYbrary — Stabilized Approach",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0008",
    "id": "0008",
    "displayTerm": "Missed Approach",
    "term": "missed approach",
    "slug": "missed-approach",
    "category": "ATC Phraseology",
    "meaningEn": "A Missed Approach is the published or assigned procedure followed when an aircraft cannot complete an instrument approach and landing.",
    "meaningPt": "Procedimento de aproximação perdida.\n\nÉ a rota publicada que o piloto deve seguir quando o pouso não pode ser completado.",
    "whenUsed": "Every IFR approach includes a Missed Approach Procedure (MAP).",
    "example": "ANAC123, execute published missed approach.",
    "sayPhrase": "Executing published missed approach, ANAC123.",
    "icaoQuestion": "What is the difference between a Go Around and a Missed Approach?",
    "icaoSpeakText": "A Go Around is the decision to discontinue a landing. A Missed Approach is the published or assigned IFR procedure followed after discontinuing an instrument approach. Every Missed Approach is a Go Around, but not every Go Around becomes a published Missed Approach.",
    "missionBrief": "Today's lesson explains one of the most misunderstood concepts in instrument flying.\n\nMany pilots use Go Around and Missed Approach as if they meant exactly the same thing.\n\nThey don't.\n\nA professional pilot understands the difference immediately.\n\nToday you'll learn when a Go Around becomes a Missed Approach and why every instrument approach already includes an escape plan before the flight even begins.",
    "captainTeaching": "Gustavo, think of climbing a mountain.\n\nBefore you start, you already know the escape trail if the weather suddenly gets worse.\n\nYou don't invent the escape route while you're in trouble.\n\nYou already know it.\n\nThat's exactly how a Missed Approach works.\n\nBefore flying the approach, every professional pilot studies the Missed Approach Procedure.\n\nIf the landing cannot be completed, there is no hesitation.\n\nNo discussion.\n\nNo improvisation.\n\nSimply fly the published procedure.\n\nThe procedure was designed long before your flight to keep you clear of terrain and other aircraft.\n\nThat's why experienced IFR pilots always brief the Missed Approach before beginning the descent.",
    "operationalContext": "You're flying your H130 on an IFR approach into Curitiba.\n\nWeather is poor.\n\nVisibility is close to minimums.\n\nAs you reach Decision Altitude, you still cannot see the runway.\n\nInstead of descending further, you immediately initiate the published Missed Approach Procedure.\n\nYou begin climbing.\n\nFollow the published heading.\n\nNavigate toward the holding fix.\n\nAdvise ATC.\n\nThe approach was unsuccessful, but the procedure worked exactly as designed.\n\nThis is a completely normal IFR operation.",
    "sayItCoach": "Missed Approach.",
    "icaoModelAnswer": "A Go Around is the decision to discontinue a landing. A Missed Approach is the published or assigned IFR procedure followed after discontinuing an instrument approach. Every Missed Approach is a Go Around, but not every Go Around becomes a published Missed Approach.",
    "memoryTrick": "Imagine climbing a building.\n\nBefore entering, you already know where the emergency exit is.\n\nIf something goes wrong, you don't search for the exit.\n\nYou follow the planned escape route.\n\nA Missed Approach is exactly that:\n\nThe escape route designed before the approach even begins.",
    "operationalMeaning": "Every IFR approach includes a Missed Approach Procedure (MAP).\n\nThis procedure guarantees:\n\nA Missed Approach may occur because:\n\nUnlike a simple Go Around, a Missed Approach follows a published procedure unless ATC assigns different instructions.",
    "whyAtcUsesIt": [
      "maintain IFR separation",
      "protect obstacle clearance",
      "sequence arriving traffic",
      "manage weather-related operations",
      "organize another approach safely"
    ],
    "atcPhraseology": [
      "ANAC123, execute published missed approach.",
      "ANAC123, fly runway heading, climb three thousand.",
      "ANAC123, execute missed approach, contact Departure.",
      "ANAC123, climb and maintain four thousand after the missed approach.",
      "ANAC123, report established in the published hold."
    ],
    "pilotReadbacks": [
      "Executing published missed approach, ANAC123.",
      "Runway heading, climb three thousand, ANAC123.",
      "Missed approach, contacting Departure, ANAC123.",
      "Climbing four thousand after missed approach, ANAC123.",
      "Will report established in the hold, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Using Go Around and Missed Approach as identical terms.  \n  ✔ They are closely related but not identical.\n\n- ❌ Forgetting to brief the Missed Approach before starting the approach.  \n  Professional crews always review it during the approach briefing.\n\n- ❌ Trying to decide what to do after reaching minimums.  \n  The decision should already be planned.\n\n- ❌ Believing a Missed Approach means something went wrong.  \n  Many Missed Approaches occur simply because weather is below landing minimums. They are normal IFR procedures.",
    "pronunciationCoaching": "**Target Phrase:** Missed Approach\n\n**Pronunciation:** MISST uh-PROACH\n\n**Word Stress**\n\n- Missed\n- Approach (second syllable stronger)\n\nPractice:\n\nMissed... Approach...\n\nTogether:\n\nMissed Approach.\n\nThen inside a complete transmission:\n\nExecuting published missed approach, ANAC123.\n\nKeep the phrase smooth and confident.",
    "relatedConcepts": [
      "Go Around",
      "Continue Approach",
      "Cleared to Land",
      "Instrument Approach",
      "Decision Altitude",
      "Holding Pattern",
      "Radar Vectors"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM)",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Doc 8168 (PANS-OPS)"
      },
      {
        "label": "FAA Instrument Flying Handbook"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM)",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Missed Approach",
        "href": "https://skybrary.aero"
      },
      {
        "label": "SKYbrary — Instrument Approach Procedures",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0009",
    "id": "0009",
    "displayTerm": "Visual Approach",
    "term": "visual approach",
    "slug": "visual-approach",
    "category": "ATC Phraseology",
    "meaningEn": "A Visual Approach is an ATC-authorized approach conducted with visual reference to the airport or the preceding aircraft while remaining under ATC control.",
    "meaningPt": "Aproximação visual.\n\nUma aproximação autorizada pelo controle utilizando referências visuais para prosseguir até o pouso.",
    "whenUsed": "A Visual Approach allows the pilot to complete the approach using visual references instead of flying every segment of the published instrument procedure.",
    "example": "Approach: ANAC123, report airport in sight.",
    "sayPhrase": "Airport in sight, ANAC123.",
    "icaoQuestion": "When may ATC clear an aircraft for a Visual Approach?",
    "icaoSpeakText": "ATC may clear an aircraft for a visual approach when weather conditions permit visual navigation and the pilot has the airport or the preceding aircraft in sight. Even during a visual approach, the pilot must continue following ATC instructions and wait for landing clearance.",
    "missionBrief": "Today's lesson covers one of the most common clearances issued in good weather.\n\nMany pilots believe a Visual Approach means they are flying under VFR.\n\nThat is not correct.\n\nA Visual Approach is still an ATC-authorized approach, and the pilot must continue to comply with all ATC instructions.\n\nUnderstanding this difference is essential for both the ICAO test and real-world operations.",
    "captainTeaching": "Imagine you're driving to a friend's house.\n\nNormally, you follow your GPS turn by turn.\n\nBut when you finally see the house at the end of the street, you don't need every remaining instruction from the GPS.\n\nYou simply continue visually until you arrive.\n\nA Visual Approach works in a similar way.\n\nInstead of following every published instrument segment, you're allowed to continue using visual references.\n\nBut here's the important difference:\n\nYou're still under ATC control.\n\nThe controller is still sequencing traffic.\n\nThe controller is still protecting separation.\n\nAnd you still need a separate landing clearance.\n\nMany ICAO candidates incorrectly think:\n\n\"Visual Approach means I can land whenever I want.\"\n\nThat's wrong.\n\nThe approach becomes visual.\n\nThe rules do not disappear.",
    "operationalContext": "You're arriving at Florianópolis on a clear afternoon.\n\nVisibility is excellent.\n\nThe airport is already in sight more than ten miles away.\n\nApproach says:\n\n\"ANAC123, report the airport in sight.\"\n\nYou reply:\n\n\"Airport in sight, ANAC123.\"\n\nA few moments later:\n\n\"ANAC123, cleared visual approach runway one four.\"\n\nYou continue visually toward the runway.\n\nEven though you're navigating visually, ATC still controls your arrival.\n\nOnly later does Tower transmit:\n\n\"ANAC123, runway one four, cleared to land.\"",
    "sayItCoach": "Cleared visual approach runway one four, ANAC123.",
    "icaoModelAnswer": "ATC may clear an aircraft for a visual approach when weather conditions permit visual navigation and the pilot has the airport or the preceding aircraft in sight. Even during a visual approach, the pilot must continue following ATC instructions and wait for landing clearance.",
    "memoryTrick": "Imagine you're hiking with a guide.\n\nAt first, you follow the map carefully.\n\nThen you finally see the cabin where you're going.\n\nYou stop looking at the map every few seconds because you can already see the destination.\n\nThe guide is still with you.\n\nThe journey simply became visual.\n\nThat's exactly what a Visual Approach is.",
    "operationalMeaning": "A Visual Approach allows the pilot to complete the approach using visual references instead of flying every segment of the published instrument procedure.\n\nHowever:\n\nThe pilot may be instructed to maintain visual separation from another aircraft or report the airport in sight before receiving the clearance.",
    "whyAtcUsesIt": [
      "reduce approach time",
      "improve airport capacity",
      "simplify traffic sequencing",
      "avoid unnecessary instrument procedures",
      "reduce pilot and controller workload",
      "maintain efficient traffic flow in good weather"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, report airport in sight.",
      "Approach: ANAC123, cleared visual approach runway one four.",
      "Approach: ANAC123, maintain visual separation from preceding traffic.",
      "Tower: ANAC123, continue visual approach.",
      "Tower: ANAC123, runway one four, cleared to land."
    ],
    "pilotReadbacks": [
      "Airport in sight, ANAC123.",
      "Cleared visual approach runway one four, ANAC123.",
      "Maintaining visual separation, ANAC123.",
      "Continuing visual approach, ANAC123.",
      "Cleared to land runway one four, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Confusing Visual Approach with VFR flight.  \n  A Visual Approach may occur during an IFR flight.\n\n- ❌ Thinking a Visual Approach includes landing clearance.  \n  Landing clearance is issued separately.\n\n- ❌ Forgetting to report: Airport in sight.  \n  When ATC requests it, this report is essential.\n\n- ❌ Believing ATC no longer controls the flight.  \n  During a Visual Approach, ATC continues providing separation and sequencing unless responsibilities are specifically transferred.",
    "pronunciationCoaching": "**Target Phrase:** Visual Approach\n\n**Pronunciation:** VIZH-oo-ul uh-PROACH\n\n**Word Stress**\n\n- Visual → stress the first syllable\n- Approach → stress the second syllable\n\nPractice:\n\nVisual... Approach...\n\nNow together:\n\nVisual Approach.\n\nThen practice in a full transmission:\n\nCleared visual approach runway one four, ANAC123.\n\nKeep the rhythm natural and avoid separating the two words excessively.",
    "relatedConcepts": [
      "Continue Approach",
      "Cleared to Land",
      "Go Around",
      "Missed Approach",
      "Radar Vectors",
      "Airport in Sight",
      "Maintain Visual Separation"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65 — Air Traffic Control",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Visual Approach",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Visual Approaches",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — Visual Approach Procedures",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0010",
    "id": "0010",
    "displayTerm": "Radar Vectors",
    "term": "radar vectors",
    "slug": "radar-vectors",
    "category": "Navigation",
    "meaningEn": "Radar Vectors are navigational instructions issued by Air Traffic Control, usually in the form of magnetic headings, to guide an aircraft toward a specific route, approach, or destination.",
    "meaningPt": "Vetoração radar.\n\nInstruções de rumo fornecidas pelo controle para conduzir a aeronave até uma rota, aproximação ou posição desejada.",
    "whenUsed": "When an aircraft is under Radar Vectors, ATC temporarily assumes responsibility for lateral navigation.",
    "example": "Approach: ANAC123, fly heading zero niner zero.",
    "sayPhrase": "Heading zero niner zero, ANAC123.",
    "icaoQuestion": "Why would ATC provide radar vectors to an aircraft?",
    "icaoSpeakText": "ATC provides radar vectors to simplify navigation, sequence arriving traffic, maintain separation between aircraft, avoid weather, or position an aircraft for an instrument approach. The pilot follows the assigned headings until receiving further instructions.",
    "missionBrief": "Today's lesson covers one of the most common services provided by Air Traffic Control.\n\nImagine you're approaching an unfamiliar airport in poor weather. Instead of navigating every waypoint yourself, ATC begins giving you headings one by one.\n\nThis is called Radar Vectors.\n\nUnderstanding this concept is essential because it appears frequently in real operations and is a common topic during ICAO English assessments.",
    "captainTeaching": "Imagine you're driving in a city you've never visited before.\n\nNormally, you follow your GPS.\n\nBut suddenly, a police officer begins directing traffic because there's a major accident ahead.\n\nInstead of following the GPS, you follow the officer's hand signals.\n\nRadar Vectors work exactly like that.\n\nATC temporarily becomes your navigator.\n\nYou stop following the published route and simply fly the headings they assign.\n\nWhen the controller says:\n\n\"Fly heading zero niner zero.\"\n\nYour job is simple.\n\nTurn to that heading.\n\nMaintain the assigned altitude.\n\nContinue listening carefully for the next instruction.\n\nEventually, ATC will guide you back onto the published approach or route.",
    "operationalContext": "You're flying your H130 toward Navegantes Airport.\n\nWeather conditions are marginal, and several aircraft are arriving simultaneously.\n\nInstead of instructing you to fly the complete published arrival, Approach says:\n\n\"ANAC123, fly heading zero niner zero.\"\n\nA few minutes later:\n\n\"ANAC123, turn left heading zero six zero.\"\n\nThen:\n\n\"ANAC123, five miles from the final approach fix, cleared ILS approach runway zero seven.\"\n\nDuring this entire sequence, ATC is navigating your aircraft using radar vectors.\n\nYou simply fly the assigned headings until cleared for the approach.",
    "sayItCoach": "Expecting radar vectors for the ILS approach, ANAC123.",
    "icaoModelAnswer": "ATC provides radar vectors to simplify navigation, sequence arriving traffic, maintain separation between aircraft, avoid weather, or position an aircraft for an instrument approach. The pilot follows the assigned headings until receiving further instructions.",
    "memoryTrick": "Imagine ATC holding an invisible string attached to your helicopter.\n\nInstead of choosing your own path, the controller gently guides you turn by turn.\n\nEach heading is another pull on the string.\n\nThat's what Radar Vectors are:\n\nATC is temporarily guiding your navigation.",
    "operationalMeaning": "When an aircraft is under Radar Vectors, ATC temporarily assumes responsibility for lateral navigation.\n\nInstead of navigating by GPS, VOR, RNAV, or published procedures, the pilot follows the headings assigned by the controller.\n\nRadar vectors are commonly used for:\n\nThe pilot must continue to comply with assigned altitudes, speeds and other ATC instructions.",
    "whyAtcUsesIt": [
      "establish aircraft on final approach",
      "provide traffic separation",
      "reduce pilot workload",
      "sequence arrivals efficiently",
      "reroute aircraft around weather",
      "assist aircraft with navigation difficulties",
      "expedite traffic flow"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, fly heading zero niner zero.",
      "Approach: ANAC123, turn left heading zero six zero.",
      "Approach: ANAC123, turn right heading one two zero.",
      "Approach: ANAC123, expect radar vectors for the ILS approach.",
      "Approach: ANAC123, radar vectors to final."
    ],
    "pilotReadbacks": [
      "Heading zero niner zero, ANAC123.",
      "Left heading zero six zero, ANAC123.",
      "Right heading one two zero, ANAC123.",
      "Expecting radar vectors for the ILS, ANAC123.",
      "Radar vectors to final, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Thinking Radar Vectors cancel altitude restrictions.  \n  They don't. Continue complying with all assigned altitudes unless ATC changes them.\n\n- ❌ Returning to the GPS route without authorization.  \n  Remain on the assigned heading until ATC issues another instruction or clears you to resume own navigation.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Heading zero niner zero, ANAC123.\n\n- ❌ Confusing \"heading\" with \"course.\"  \n  A heading is the direction the aircraft's nose is pointing. A course is the intended path over the ground.",
    "pronunciationCoaching": "**Target Phrase:** Radar Vectors\n\n**Pronunciation:** RAY-dar VEK-tərz\n\n**Word Stress**\n\n- Radar → stress the first syllable\n- Vectors → stress the first syllable\n\nPractice:\n\nRadar... Vectors...\n\nTogether:\n\nRadar Vectors.\n\nNow practice inside a transmission:\n\nExpecting radar vectors for the ILS approach, ANAC123.",
    "relatedConcepts": [
      "Fly Heading",
      "Resume Own Navigation",
      "Visual Approach",
      "Instrument Approach",
      "ILS Approach",
      "RNAV Approach",
      "Holding Pattern"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65 — Air Traffic Control",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Radar Vector",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Instrument Flying Handbook"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Radar Services",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — Radar Vectoring and ATC Procedures",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0011",
    "id": "0011",
    "displayTerm": "Resume Own Navigation",
    "term": "resume own navigation",
    "slug": "resume-own-navigation",
    "category": "Navigation",
    "meaningEn": "Resume Own Navigation instructs the pilot to stop following ATC vectors and continue navigating according to the flight plan, cleared route, or published procedure.",
    "meaningPt": "Retome sua própria navegação.\n\nVolte a seguir sua rota, procedimento ou plano de voo utilizando seus próprios meios de navegação.",
    "whenUsed": "When ATC says Resume Own Navigation, the aircraft is no longer being radar vectored.",
    "example": "Approach: ANAC123, resume own navigation.",
    "sayPhrase": "Resuming own navigation, ANAC123.",
    "icaoQuestion": "When would ATC instruct an aircraft to resume own navigation?",
    "icaoSpeakText": "ATC normally issues Resume Own Navigation after radar vectoring is no longer necessary. The pilot then resumes following the cleared route or flight plan using the aircraft's navigation systems.",
    "missionBrief": "Today's lesson explains one of the most important transitions between ATC guidance and pilot navigation.\n\nDuring radar vectoring, ATC temporarily tells you where to fly.\n\nEventually, the controller will say:\n\n\"Resume Own Navigation.\"\n\nAt that moment, responsibility for lateral navigation returns to the pilot.\n\nUnderstanding exactly when and how this happens is essential for both real-world operations and the ICAO English test.",
    "captainTeaching": "Imagine you're driving with a police escort through heavy traffic.\n\nFor a while, you simply follow the police vehicle.\n\nYou don't choose your own turns.\n\nThen the officer reaches the highway entrance and says:\n\n\"From here, you're on your own.\"\n\nYou thank the officer and continue using your GPS.\n\nThat's exactly what Resume Own Navigation means.\n\nDuring radar vectors, ATC is your temporary navigator.\n\nOnce the controller says Resume Own Navigation, the responsibility returns to you.\n\nProfessional pilots immediately understand that the last assigned heading is no longer the primary reference.\n\nThe flight plan becomes the reference again.",
    "operationalContext": "You're flying your H130 toward Curitiba Airport.\n\nBecause of heavy traffic, Approach has been providing radar vectors for the last ten minutes.\n\nYou have flown several assigned headings.\n\nOnce spacing has been achieved, the controller says:\n\n\"ANAC123, resume own navigation direct REKPA.\"\n\nYou immediately stop following the previous heading.\n\nYour GPS already displays REKPA.\n\nYou turn toward the waypoint and continue the flight along your cleared route.\n\nNavigation is now your responsibility again.",
    "sayItCoach": "Resuming own navigation, ANAC123.",
    "icaoModelAnswer": "ATC normally issues Resume Own Navigation after radar vectoring is no longer necessary. The pilot then resumes following the cleared route or flight plan using the aircraft's navigation systems.",
    "memoryTrick": "Imagine someone borrowing the steering wheel of your car for a few minutes.\n\nWhen they give it back, you're driving again.\n\nRadar Vectors are ATC holding the steering wheel.\n\nResume Own Navigation is ATC handing it back to you.",
    "operationalMeaning": "When ATC says Resume Own Navigation, the aircraft is no longer being radar vectored.\n\nFrom that moment, the pilot resumes navigating using:\n\nThe pilot must not continue flying the last assigned heading unless it remains consistent with the intended route.\n\nAll previously assigned altitude, speed, and frequency restrictions remain in effect unless specifically changed.",
    "whyAtcUsesIt": [
      "end radar vectoring",
      "return navigation responsibility to the pilot",
      "rejoin the planned route",
      "simplify ATC workload",
      "position aircraft after weather deviations",
      "transition from vectoring to published procedures"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, resume own navigation.",
      "Approach: ANAC123, resume own navigation direct REKPA.",
      "Approach: ANAC123, resume own navigation and proceed to AFA VOR.",
      "Approach: ANAC123, resume own navigation, cleared direct NITUX.",
      "Approach: ANAC123, resume own navigation after the weather deviation."
    ],
    "pilotReadbacks": [
      "Resuming own navigation, ANAC123.",
      "Direct REKPA, resuming own navigation, ANAC123.",
      "Proceeding to AFA VOR, ANAC123.",
      "Cleared direct NITUX, resuming own navigation, ANAC123.",
      "Resuming own navigation after the deviation, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Continuing to fly the last assigned heading.  \n  Once instructed to resume own navigation, return to the cleared route.\n\n- ❌ Thinking altitude restrictions are cancelled.  \n  Only navigation responsibility changes. Altitude and speed restrictions remain unless ATC changes them.\n\n- ❌ Waiting for another heading.  \n  Resume navigation immediately unless clarification is required.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Resuming own navigation, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Resume Own Navigation\n\n**Pronunciation:** ri-ZOOM own nav-uh-GAY-shun\n\n**Word Stress**\n\n- Resume → second syllable\n- Navigation → third syllable\n\nPractice:\n\nResume... Own Navigation...\n\nNow together:\n\nResume Own Navigation.\n\nThen practice inside a complete transmission:\n\nResuming own navigation, ANAC123.\n\nSpeak smoothly and confidently.",
    "relatedConcepts": [
      "Radar Vectors",
      "Fly Heading",
      "Fly Direct",
      "RNAV Navigation",
      "VOR Navigation",
      "Instrument Approach",
      "Flight Plan"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65 — Air Traffic Control",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Radar Vector / Resume Own Navigation",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Instrument Flying Handbook"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM)",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — Radar Vectoring and Navigation",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0012",
    "id": "0012",
    "displayTerm": "Maintain Runway Heading",
    "term": "maintain runway heading",
    "slug": "maintain-runway-heading",
    "category": "ATC Phraseology",
    "meaningEn": "Maintain Runway Heading means continue flying the magnetic heading of the departure runway after takeoff until ATC gives another instruction.",
    "meaningPt": "Mantenha o rumo da pista.\n\nApós a decolagem, continue voando no rumo magnético da pista até receber nova autorização.",
    "whenUsed": "When ATC instructs Maintain Runway Heading, the pilot must continue climbing while maintaining the magnetic heading of the departure runway.",
    "example": "Tower: ANAC123, runway zero seven, cleared for takeoff. Maintain runway heading.",
    "sayPhrase": "Cleared for takeoff, maintaining runway heading, ANAC123.",
    "icaoQuestion": "Why would ATC instruct an aircraft to maintain runway heading after departure?",
    "icaoSpeakText": "ATC may instruct an aircraft to maintain runway heading to ensure safe separation from other traffic, simplify departure sequencing, and position the aircraft for radar vectors or another clearance. The pilot should maintain the assigned heading until receiving further instructions.",
    "missionBrief": "Today's lesson covers one of the first instructions you'll hear immediately after departure.\n\nMany pilots instinctively want to turn toward their destination after takeoff.\n\nHowever, if ATC instructs:\n\n\"Maintain runway heading.\"\n\nYour responsibility is simple:\n\nContinue flying the runway heading until another clearance is issued.\n\nThis instruction is extremely common during IFR departures and at busy controlled airports where aircraft must be separated immediately after takeoff.",
    "captainTeaching": "Imagine you're leaving a hospital parking lot.\n\nThe exit lane is narrow and carefully designed to keep every vehicle separated from incoming traffic.\n\nIf you decide to turn early because you know where you're going, you could create a dangerous conflict.\n\nThat's exactly why ATC sometimes says:\n\nMaintain runway heading.\n\nThe controller already has the complete traffic picture.\n\nThere may be another aircraft climbing nearby.\n\nAnother aircraft may be approaching to land.\n\nOr another departure may be joining a different route.\n\nYour destination isn't the priority yet.\n\nSafe separation is.\n\nProfessional pilots don't anticipate turns.\n\nThey wait for the clearance.",
    "operationalContext": "You're departing Navegantes Airport on runway 07 in your H130.\n\nTower clears you for takeoff:\n\nTower: ANAC123, runway zero seven, cleared for takeoff. Maintain runway heading.\n\nA crosswind from the south begins pushing the helicopter sideways.\n\nInstead of correcting toward your planned GPS route, you continue flying the assigned magnetic heading.\n\nAbout one minute later, Departure transmits:\n\nDeparture: ANAC123, turn right heading one two zero.\n\nOnly now do you begin the turn.\n\nUntil that instruction, your only responsibility was to maintain the runway heading.",
    "sayItCoach": "Cleared for takeoff, maintaining runway heading, ANAC123.",
    "icaoModelAnswer": "ATC may instruct an aircraft to maintain runway heading to ensure safe separation from other traffic, simplify departure sequencing, and position the aircraft for radar vectors or another clearance. The pilot should maintain the assigned heading until receiving further instructions.",
    "memoryTrick": "Imagine you're leaving an airport parking garage.\n\nThere are arrows painted on the exit lane.\n\nYou don't choose your own direction until you're safely outside.\n\nATC is doing the same thing.\n\nThe runway heading is your exit lane.\n\nFollow it until the controller tells you it's time to turn.",
    "operationalMeaning": "When ATC instructs Maintain Runway Heading, the pilot must continue climbing while maintaining the magnetic heading of the departure runway.\n\nThis instruction does not mean:\n\nIt simply means:\n\nKeep the assigned heading until ATC tells you otherwise.\n\nRemember:\n\nHeading is the direction the aircraft's nose is pointing.\n\nStrong crosswinds may cause the aircraft's ground track to differ from the runway centerline.\n\nThis is expected.",
    "whyAtcUsesIt": [
      "establish radar separation",
      "sequence departures safely",
      "avoid conflicts with arriving traffic",
      "position aircraft for radar vectors",
      "simplify departure procedures",
      "reduce controller workload"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, runway zero seven, cleared for takeoff. Maintain runway heading.",
      "Departure: ANAC123, maintain runway heading, climb and maintain three thousand.",
      "Departure: ANAC123, maintain runway heading, expect radar vectors.",
      "Departure: ANAC123, maintain runway heading until advised.",
      "Departure: ANAC123, maintain runway heading, contact Departure on one two four decimal seven."
    ],
    "pilotReadbacks": [
      "Cleared for takeoff, maintaining runway heading, ANAC123.",
      "Maintaining runway heading, climbing three thousand, ANAC123.",
      "Maintaining runway heading, expecting radar vectors, ANAC123.",
      "Maintaining runway heading until advised, ANAC123.",
      "Maintaining runway heading, switching to Departure one two four decimal seven, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Turning toward the first waypoint immediately after takeoff.  \n  ✔ Wait for another ATC instruction.\n\n- ❌ Thinking runway heading means following the runway centerline exactly.  \n  ✔ Runway heading refers to magnetic heading. Wind may cause drift.\n\n- ❌ Returning to the GPS route automatically.  \n  ✔ Continue flying the assigned heading until ATC changes it.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Maintaining runway heading, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Maintain Runway Heading\n\n**Pronunciation:** main-TAIN RUN-way HED-ing\n\n**Word Stress**\n\n- Maintain → stress the second syllable\n- Runway → stress the first syllable\n- Heading → stress the first syllable\n\nPractice:\n\nMaintain... Runway... Heading...\n\nNow naturally:\n\nMaintaining runway heading.\n\nThen practice the full readback:\n\nCleared for takeoff, maintaining runway heading, ANAC123.\n\nKeep a steady rhythm and pronounce heading clearly, without dropping the final \"-ing.\"",
    "relatedConcepts": [
      "Radar Vectors",
      "Resume Own Navigation",
      "Fly Heading",
      "Cleared for Takeoff",
      "Initial Climb",
      "Standard Instrument Departure (SID)"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65 — Air Traffic Control",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Runway Heading",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Instrument Flying Handbook"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Departure Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — IFR Departure Procedures and Radar Separation",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0013",
    "id": "0013",
    "displayTerm": "Fly Heading",
    "term": "fly heading",
    "slug": "fly-heading",
    "category": "ATC Phraseology",
    "meaningEn": "Fly Heading instructs the pilot to turn to and maintain a specific magnetic heading assigned by Air Traffic Control.",
    "meaningPt": "Voe no rumo indicado.\n\nO piloto deve ajustar a aeronave para o rumo magnético informado pelo controlador e mantê-lo até receber nova instrução.",
    "whenUsed": "When ATC issues a Fly Heading instruction, the pilot must:",
    "example": "Approach: ANAC123, fly heading zero niner zero.",
    "sayPhrase": "Heading zero niner zero, ANAC123.",
    "icaoQuestion": "Why would ATC instruct an aircraft to fly a specific heading?",
    "icaoSpeakText": "ATC may assign a specific heading to provide radar vectors, separate aircraft, sequence traffic, avoid weather, or position the aircraft for an instrument approach. The pilot should maintain the assigned heading until receiving another clearance.",
    "missionBrief": "Today's lesson introduces one of the most common ATC instructions you'll hear while under radar control.\n\nUnlike Maintain Runway Heading, which keeps you on the departure heading, Fly Heading instructs you to turn to a specific magnetic heading assigned by ATC.\n\nThis instruction is used every day to sequence traffic, avoid conflicts, and guide aircraft safely through controlled airspace.",
    "captainTeaching": "Imagine you're following your GPS on a road trip.\n\nSuddenly, a police officer closes the highway and points you toward a detour.\n\nFor the next few kilometers, you stop following your GPS and simply follow the officer's directions.\n\nThat's exactly what happens when ATC says:\n\nFly heading zero niner zero.\n\nFor a short period, the controller becomes your navigator.\n\nYour responsibility is not to question the route.\n\nYour responsibility is to fly the assigned heading accurately until a new clearance is issued.\n\nProfessional pilots understand that precision matters.\n\nBeing five or ten degrees off the assigned heading may reduce the separation ATC is trying to create.",
    "operationalContext": "You're flying your H130 toward Curitiba Airport.\n\nApproach is sequencing several arriving aircraft.\n\nInstead of allowing you to continue directly to the next waypoint, the controller transmits:\n\nApproach: ANAC123, fly heading zero niner zero.\n\nYou immediately turn to heading 090° and maintain it.\n\nA few minutes later, the controller says:\n\nApproach: ANAC123, turn right heading one three zero.\n\nYou comply with the new heading.\n\nFinally, ATC instructs:\n\nApproach: ANAC123, resume own navigation direct REKPA.\n\nOnly then do you return to your planned route.",
    "sayItCoach": "Heading zero niner zero, ANAC123.",
    "icaoModelAnswer": "ATC may assign a specific heading to provide radar vectors, separate aircraft, sequence traffic, avoid weather, or position the aircraft for an instrument approach. The pilot should maintain the assigned heading until receiving another clearance.",
    "memoryTrick": "Imagine ATC is drawing a compass on your windshield.\n\nInstead of saying \"Go over there,\" the controller points to one exact direction.\n\nYour job is simply to keep the nose of the aircraft pointing there until told otherwise.\n\nThat's what Fly Heading means.",
    "operationalMeaning": "When ATC issues a Fly Heading instruction, the pilot must:\n\nA Fly Heading instruction temporarily replaces the aircraft's planned lateral navigation.\n\nDo not continue toward the GPS route unless instructed to Resume Own Navigation or given another clearance.",
    "whyAtcUsesIt": [
      "provide radar vectors",
      "sequence arrivals",
      "separate aircraft",
      "avoid weather",
      "position aircraft for an instrument approach",
      "simplify traffic management",
      "resolve conflicts efficiently"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, fly heading zero niner zero.",
      "Approach: ANAC123, fly heading one eight zero.",
      "Approach: ANAC123, fly heading two four zero, vectors for the ILS.",
      "Departure: ANAC123, fly heading three one zero.",
      "Approach: ANAC123, fly heading zero six zero to avoid weather."
    ],
    "pilotReadbacks": [
      "Heading zero niner zero, ANAC123.",
      "Heading one eight zero, ANAC123.",
      "Heading two four zero, vectors for the ILS, ANAC123.",
      "Heading three one zero, ANAC123.",
      "Heading zero six zero to avoid weather, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Turning approximately to the assigned heading.  \n  ✔ Fly the assigned heading accurately.\n\n- ❌ Returning to the GPS route without authorization.  \n  ✔ Continue on the assigned heading until instructed otherwise.\n\n- ❌ Confusing Heading with Course.  \n  ✔ Heading is where the aircraft's nose points.  \n  ✔ Course is the intended path over the ground.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Heading zero niner zero, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Fly Heading\n\n**Pronunciation:** FLY HED-ing\n\n**Word Stress**\n\n- Fly → strong and clear\n- Heading → stress the first syllable\n\nPractice:\n\nFly... Heading...\n\nNow together:\n\nFly Heading.\n\nThen practice inside a complete transmission:\n\nHeading zero niner zero, ANAC123.\n\nSpeak each number clearly and at a steady pace.",
    "relatedConcepts": [
      "Maintain Runway Heading",
      "Radar Vectors",
      "Resume Own Navigation",
      "Turn Left Heading",
      "Turn Right Heading",
      "Instrument Approach",
      "Heading vs Course"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65 — Air Traffic Control",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Heading",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Instrument Flying Handbook"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM)",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — Radar Vectoring and ATC Procedures",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0014",
    "id": "0014",
    "displayTerm": "Climb and Maintain",
    "term": "climb and maintain",
    "slug": "climb-and-maintain",
    "category": "ATC Phraseology",
    "meaningEn": "Climb and Maintain instructs the pilot to climb immediately and maintain the assigned altitude until receiving further ATC instructions.",
    "meaningPt": "Suba e mantenha.\n\nInicie a subida imediatamente e nivele na altitude autorizada.",
    "whenUsed": "When ATC issues Climb and Maintain, the pilot must:",
    "example": "Departure: ANAC123, climb and maintain three thousand feet.",
    "sayPhrase": "Climbing to three thousand, ANAC123.",
    "icaoQuestion": "Why is it important to maintain the assigned altitude accurately?",
    "icaoSpeakText": "Maintaining the assigned altitude ensures safe separation from other aircraft and allows ATC to manage traffic efficiently. Climbing above or below the assigned altitude may create a conflict with nearby traffic.",
    "missionBrief": "Today's lesson covers one of the most common ATC climb instructions issued after departure.\n\nMany new pilots focus only on the altitude.\n\nProfessional pilots understand that this clearance contains two separate instructions:\n\nBegin the climb immediately.\n\nLevel off exactly at the assigned altitude.\n\nAccuracy is essential. Stopping early or climbing above the assigned altitude can create a serious loss of separation.",
    "captainTeaching": "Imagine you're taking an elevator to the eighth floor.\n\nYou don't stop at the sixth floor because it looks close enough.\n\nAnd you certainly don't continue to the tenth floor.\n\nYou stop exactly where you were instructed.\n\nAltitude assignments work exactly the same way.\n\nWhen ATC says:\n\nClimb and maintain four thousand.\n\nYour mission isn't simply to climb.\n\nYour mission is to stop precisely at 4,000 feet.\n\nProfessional pilots know that altitude accuracy is one of the foundations of safe IFR flying.\n\nEven a deviation of a few hundred feet can reduce the separation ATC is trying to maintain.",
    "operationalContext": "You're departing Florianópolis Airport on an IFR flight.\n\nAfter takeoff, Departure contacts you:\n\nDeparture: ANAC123, climb and maintain four thousand feet.\n\nYou immediately begin climbing.\n\nYour current heading remains unchanged.\n\nAt 4,000 feet, you smoothly level off.\n\nA few minutes later:\n\nDeparture: ANAC123, climb and maintain seven thousand feet.\n\nYou continue the climb.\n\nThroughout the departure, every altitude change is issued by ATC.",
    "sayItCoach": "Climb and maintain four thousand, ANAC123.",
    "icaoModelAnswer": "Maintaining the assigned altitude ensures safe separation from other aircraft and allows ATC to manage traffic efficiently. Climbing above or below the assigned altitude may create a conflict with nearby traffic.",
    "memoryTrick": "Imagine filling a glass with water.\n\nYou pour until the water reaches a marked line.\n\nYou don't stop below it.\n\nYou don't overflow it.\n\nThe assigned altitude is that line.\n\nClimb to it.\n\nMaintain it.",
    "operationalMeaning": "When ATC issues Climb and Maintain, the pilot must:\n\nThis instruction changes only the altitude.\n\nIt does not cancel:",
    "whyAtcUsesIt": [
      "provide vertical separation",
      "clear aircraft above terrain",
      "organize departure traffic",
      "sequence arrivals and departures",
      "transition aircraft to en-route altitudes",
      "reduce controller workload"
    ],
    "atcPhraseology": [
      "Departure: ANAC123, climb and maintain three thousand feet.",
      "Departure: ANAC123, climb and maintain five thousand feet.",
      "Departure: ANAC123, climb and maintain flight level one eight zero.",
      "Departure: ANAC123, climb and maintain four thousand, fly heading zero niner zero.",
      "Departure: ANAC123, climb and maintain six thousand, expect higher in ten minutes."
    ],
    "pilotReadbacks": [
      "Climbing to three thousand, ANAC123.",
      "Climb and maintain five thousand, ANAC123.",
      "Flight level one eight zero, ANAC123.",
      "Climb and maintain four thousand, heading zero niner zero, ANAC123.",
      "Climbing six thousand, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Continuing the climb above the assigned altitude.  \n  ✔ Level off exactly at the cleared altitude.\n\n- ❌ Delaying the climb unnecessarily.  \n  ✔ Begin climbing promptly after receiving the clearance.\n\n- ❌ Thinking the heading also changes.  \n  ✔ The instruction changes only the altitude unless ATC says otherwise.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Climb and maintain four thousand, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Climb and Maintain\n\n**Pronunciation:** KLAIM and main-TAIN\n\n**Word Stress**\n\n- Climb → strong\n- Maintain → stress the second syllable\n\nPractice:\n\nClimb... Maintain...\n\nTogether:\n\nClimb and Maintain.\n\nNow practice in a complete transmission:\n\nClimb and maintain four thousand, ANAC123.\n\nSpeak the altitude clearly and avoid rushing the numbers.",
    "relatedConcepts": [
      "Descend and Maintain",
      "Maintain Altitude",
      "Fly Heading",
      "Maintain Runway Heading",
      "Radar Vectors",
      "Flight Level",
      "Initial Climb"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65 — Air Traffic Control",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Climb and Maintain",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Instrument Flying Handbook"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM)",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — ATC Phraseology and Altitude Assignments",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0015",
    "id": "0015",
    "displayTerm": "Descend and Maintain",
    "term": "descend and maintain",
    "slug": "descend-and-maintain",
    "category": "ATC Phraseology",
    "meaningEn": "Descend and Maintain instructs the pilot to descend immediately and level off at the assigned altitude.",
    "meaningPt": "Desça e mantenha.\n\nInicie a descida imediatamente e nivele exatamente na altitude autorizada.",
    "whenUsed": "When ATC issues Descend and Maintain, the pilot must:",
    "example": "Approach: ANAC123, descend and maintain four thousand feet.",
    "sayPhrase": "Descending to four thousand, ANAC123.",
    "icaoQuestion": "Why is it important to stop exactly at the assigned altitude?",
    "icaoSpeakText": "Because ATC uses altitude assignments to maintain safe vertical separation between aircraft. Descending below the assigned altitude may create a conflict with other traffic and reduce safety.",
    "missionBrief": "Today's lesson covers one of the most common descent clearances issued by Air Traffic Control.\n\nJust like Climb and Maintain, this clearance contains two actions:\n\nBegin the descent immediately.\n\nStop exactly at the assigned altitude.\n\nProfessional pilots understand that descending below the assigned altitude is just as dangerous as climbing above a cleared altitude.",
    "captainTeaching": "Imagine you're taking an elevator down.\n\nYou press the button for the fourth floor.\n\nYou don't stop at the fifth.\n\nYou don't continue to the third.\n\nYou stop exactly where you were instructed.\n\nAltitude works exactly the same way.\n\nProfessional pilots don't \"approximate\" an altitude.\n\nThey capture it precisely.\n\nEvery altitude assignment protects another aircraft somewhere nearby.",
    "operationalContext": "You're approaching Curitiba Airport at 8,000 feet.\n\nApproach instructs:\n\nApproach: ANAC123, descend and maintain four thousand feet.\n\nYou immediately begin descending.\n\nYour assigned heading remains unchanged.\n\nAs you approach 4,000 feet, you smoothly level off and continue waiting for the next clearance.\n\nA few minutes later:\n\nApproach: ANAC123, cleared ILS approach runway one five.\n\nThe descent clearance positioned you perfectly for the approach.",
    "sayItCoach": "Descending to four thousand, ANAC123.",
    "icaoModelAnswer": "Because ATC uses altitude assignments to maintain safe vertical separation between aircraft. Descending below the assigned altitude may create a conflict with other traffic and reduce safety.",
    "memoryTrick": "Think of parking on the third floor of a building.\n\nYou don't stop on the fourth.\n\nYou don't continue to the second.\n\nThe assigned altitude is your parking floor.",
    "operationalMeaning": "When ATC issues Descend and Maintain, the pilot must:\n\nThis instruction changes only the altitude.\n\nIt does not cancel headings, vectors, speed restrictions, or navigation clearances.",
    "whyAtcUsesIt": [
      "sequence arriving aircraft",
      "establish vertical separation",
      "position aircraft for approach",
      "reduce arrival delays",
      "coordinate crossing traffic",
      "prepare aircraft for instrument or visual approaches"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, descend and maintain four thousand feet.",
      "Approach: ANAC123, descend and maintain two thousand five hundred feet.",
      "Center: ANAC123, descend and maintain flight level one two zero.",
      "Approach: ANAC123, descend and maintain three thousand, expect ILS runway zero seven.",
      "Approach: ANAC123, descend and maintain five thousand due crossing traffic."
    ],
    "pilotReadbacks": [
      "Descending to four thousand, ANAC123.",
      "Descend and maintain two thousand five hundred, ANAC123.",
      "Leaving flight level one eight zero for flight level one two zero, ANAC123.",
      "Descending three thousand, ANAC123.",
      "Descending five thousand, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Descending below the assigned altitude.  \n  ✔ Level off precisely.\n\n- ❌ Delaying the descent unnecessarily.  \n  ✔ Begin descending promptly.\n\n- ❌ Assuming another altitude is expected.  \n  ✔ Fly the clearance you have—not the one you expect.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Descending to four thousand, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Descend and Maintain\n\n**Pronunciation:** dih-SEND and main-TAIN\n\n**Word Stress**\n\n- Descend → second syllable\n- Maintain → second syllable\n\nPractice:\n\nDescend... Maintain...\n\nTogether:\n\nDescend and Maintain.\n\nThen practice:\n\nDescending to four thousand, ANAC123.",
    "relatedConcepts": [
      "Climb and Maintain",
      "Maintain Altitude",
      "Cleared for Approach",
      "Instrument Approach",
      "Flight Level",
      "Vertical Separation"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM)",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA AIM",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Instrument Flying Handbook"
      },
      {
        "label": "SKYbrary – ATC Altitude Clearances",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0016",
    "id": "0016",
    "displayTerm": "Maintain Altitude",
    "term": "maintain altitude",
    "slug": "maintain-altitude",
    "category": "ATC Phraseology",
    "meaningEn": "Maintain Altitude instructs the pilot to continue flying at the current assigned altitude until receiving another ATC clearance.",
    "meaningPt": "Mantenha a altitude.\n\nContinue voando exatamente na altitude autorizada.",
    "whenUsed": "When ATC issues Maintain Altitude, the pilot must:",
    "example": "Departure: ANAC123, maintain four thousand feet.",
    "sayPhrase": "Maintaining four thousand, ANAC123.",
    "icaoQuestion": "Why is maintaining the assigned altitude important?",
    "icaoSpeakText": "Maintaining the assigned altitude helps ATC keep safe vertical separation between aircraft. Deviating from the assigned altitude may create a conflict with nearby traffic and reduce overall flight safety.",
    "missionBrief": "Today's lesson covers one of the simplest ATC instructions—and one of the easiest to misunderstand.\n\nWhen a controller says:\n\n\"Maintain altitude.\"\n\nThe instruction is not telling you to climb.\n\nIt is not telling you to descend.\n\nIt simply means:\n\nStay exactly where you are vertically until further instructed.\n\nProfessional pilots know that altitude discipline is one of the foundations of safe flight.",
    "captainTeaching": "Imagine you're standing on the fifth floor of a building waiting for an elevator.\n\nSomeone tells you:\n\n\"Stay right there.\"\n\nThey don't want you to go up.\n\nThey don't want you to go down.\n\nThey simply want you to remain exactly where you are.\n\nAltitude instructions work the same way.\n\nWhen ATC says:\n\nMaintain altitude\n\nthere is only one correct response:\n\nStay exactly at the assigned altitude until another clearance is received.\n\nProfessional pilots constantly monitor the altimeter because holding altitude accurately is just as important as flying the correct heading.",
    "operationalContext": "You're flying your H130 at 4,000 feet.\n\nAnother aircraft is climbing through 3,000 feet beneath you.\n\nDeparture says:\n\nDeparture: ANAC123, maintain four thousand feet.\n\nYou keep your current altitude.\n\nA few moments later, after the conflicting aircraft has passed, ATC transmits:\n\nDeparture: ANAC123, climb and maintain six thousand feet.\n\nOnly then do you begin climbing.",
    "sayItCoach": "Maintaining four thousand, ANAC123.",
    "icaoModelAnswer": "Maintaining the assigned altitude helps ATC keep safe vertical separation between aircraft. Deviating from the assigned altitude may create a conflict with nearby traffic and reduce overall flight safety.",
    "memoryTrick": "Imagine cruise control in your car.\n\nOnce set, the speed remains constant until you deliberately change it.\n\nMaintain Altitude is cruise control for your altitude.\n\nDon't climb.\n\nDon't descend.\n\nStay exactly where ATC placed you.",
    "operationalMeaning": "When ATC issues Maintain Altitude, the pilot must:\n\nThis instruction protects vertical separation between aircraft.\n\nEven a deviation of a few hundred feet may create a traffic conflict.",
    "whyAtcUsesIt": [
      "preserve vertical separation",
      "organize arriving and departing traffic",
      "prevent altitude conflicts",
      "delay climbs or descents",
      "coordinate crossing traffic",
      "simplify traffic management"
    ],
    "atcPhraseology": [
      "Departure: ANAC123, maintain four thousand feet.",
      "Approach: ANAC123, maintain present altitude.",
      "Departure: ANAC123, maintain five thousand until advised.",
      "Approach: ANAC123, maintain altitude due crossing traffic.",
      "Center: ANAC123, maintain flight level one zero zero."
    ],
    "pilotReadbacks": [
      "Maintaining four thousand, ANAC123.",
      "Maintaining present altitude, ANAC123.",
      "Maintaining five thousand until advised, ANAC123.",
      "Maintaining altitude, ANAC123.",
      "Maintaining flight level one zero zero, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Beginning a climb because the next cruise altitude is known.  \n  ✔ Wait for an altitude clearance.\n\n- ❌ Descending early before receiving clearance.  \n  ✔ Maintain the assigned altitude.\n\n- ❌ Focusing only on navigation.  \n  ✔ Monitor altitude continuously.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Maintaining four thousand, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Maintain Altitude\n\n**Pronunciation:** main-TAIN AL-ti-tood\n\n**Word Stress**\n\n- Maintain → second syllable\n- Altitude → first syllable\n\nPractice:\n\nMaintain... Altitude...\n\nTogether:\n\nMaintain Altitude.\n\nNow practice:\n\nMaintaining four thousand, ANAC123.",
    "relatedConcepts": [
      "Climb and Maintain",
      "Descend and Maintain",
      "Maintain Present Heading",
      "Fly Heading",
      "Flight Level",
      "Vertical Separation"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM)",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Instrument Flying Handbook"
      },
      {
        "label": "FAA AIM",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary – Altitude Separation",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0017",
    "id": "0017",
    "displayTerm": "Maintain Present Heading",
    "term": "maintain present heading",
    "slug": "maintain-present-heading",
    "category": "ATC Phraseology",
    "meaningEn": "Maintain Present Heading instructs the pilot to continue flying the current magnetic heading until receiving another ATC clearance.",
    "meaningPt": "Mantenha o rumo atual.\n\nContinue voando exatamente no rumo em que a aeronave já está.",
    "whenUsed": "When ATC says Maintain Present Heading, the pilot should:",
    "example": "Departure: ANAC123, maintain present heading.",
    "sayPhrase": "Maintaining present heading, ANAC123.",
    "icaoQuestion": "What is the difference between \"Maintain Present Heading\" and \"Fly Heading 090\"?",
    "icaoSpeakText": "Maintain Present Heading means I continue flying my current heading without turning. Fly Heading 090 instructs me to turn, if necessary, and establish heading zero niner zero.",
    "missionBrief": "Today's lesson explains a subtle but important ATC instruction.\n\nUnlike Fly Heading, which tells you to turn to a new heading,\n\nMaintain Present Heading means:\n\nDo not turn. Continue flying exactly the heading you already have.\n\nThis instruction is commonly used during departures, arrivals, and radar vectoring.",
    "captainTeaching": "Imagine you're driving through an intersection.\n\nJust before you turn, a police officer raises a hand and says:\n\n\"Keep going straight.\"\n\nHe doesn't tell you where you'll turn next.\n\nHe simply tells you not to turn yet.\n\nThat's exactly what Maintain Present Heading means.\n\nProfessional pilots understand that doing nothing can be just as important as making a maneuver.\n\nSometimes the safest action is simply to continue exactly as you are.",
    "operationalContext": "You're climbing after departure.\n\nDeparture intends to vector you left.\n\nHowever, another aircraft is crossing ahead.\n\nInstead of issuing the turn immediately, ATC says:\n\nDeparture: ANAC123, maintain present heading.\n\nYou continue straight ahead.\n\nAfter the traffic passes:\n\nDeparture: ANAC123, turn left heading zero six zero.\n\nNow you begin the turn.",
    "sayItCoach": "Maintain Present Heading.",
    "icaoModelAnswer": "Maintain Present Heading means I continue flying my current heading without turning. Fly Heading 090 instructs me to turn, if necessary, and establish heading zero niner zero.",
    "memoryTrick": "Imagine pressing the pause button.\n\nNothing changes.\n\nYou simply continue exactly as you are until someone tells you to do something different.",
    "operationalMeaning": "When ATC says Maintain Present Heading, the pilot should:\n\nThis differs from Fly Heading, which requires turning to a new heading.",
    "whyAtcUsesIt": [
      "preserve radar separation",
      "stabilize traffic flow",
      "delay turns until traffic clears",
      "simplify sequencing",
      "avoid conflicting aircraft"
    ],
    "atcPhraseology": [
      "Departure: ANAC123, maintain present heading.",
      "Approach: ANAC123, maintain present heading due traffic.",
      "Departure: ANAC123, maintain present heading, expect vectors shortly.",
      "Center: ANAC123, maintain present heading and maintain five thousand.",
      "Approach: ANAC123, maintain present heading until advised."
    ],
    "pilotReadbacks": [
      "Maintaining present heading, ANAC123.",
      "Present heading due traffic, ANAC123.",
      "Maintaining present heading, expecting vectors, ANAC123.",
      "Maintaining present heading and five thousand, ANAC123.",
      "Maintaining present heading until advised, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Beginning a turn because you expect one.  \n  ✔ Continue straight.\n\n- ❌ Confusing Present Heading with Resume Own Navigation.  \n  ✔ Navigation responsibility does not change.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Maintaining present heading, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Maintain Present Heading\n\n**Pronunciation:** main-TAIN PREZ-ent HED-ing\n\nPractice:\n\nMaintain... Present... Heading...\n\nNow together:\n\nMaintain Present Heading.",
    "relatedConcepts": [
      "Fly Heading",
      "Maintain Runway Heading",
      "Radar Vectors",
      "Resume Own Navigation",
      "Climb and Maintain",
      "Maintain Altitude"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM)",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA JO 7110.65",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA AIM",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary – Radar Vectoring",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0018",
    "id": "0018",
    "displayTerm": "Maintain Present Speed",
    "term": "maintain present speed",
    "slug": "maintain-present-speed",
    "category": "ATC Phraseology",
    "meaningEn": "Maintain Present Speed instructs the pilot to continue flying at the aircraft's current indicated airspeed unless another speed is assigned.",
    "meaningPt": "Mantenha a velocidade atual.\n\nContinue voando na velocidade indicada atual até receber nova instrução do controle.",
    "whenUsed": "When ATC issues Maintain Present Speed, the pilot should:",
    "example": "Approach: ANAC123, maintain present speed.",
    "sayPhrase": "Maintaining present speed, ANAC123.",
    "icaoQuestion": "Why would ATC instruct an aircraft to maintain its present speed?",
    "icaoSpeakText": "ATC may instruct an aircraft to maintain its present speed to preserve safe spacing between aircraft, improve traffic sequencing, and reduce the need for additional vectoring. The pilot should continue flying at the current speed until another clearance is received.",
    "missionBrief": "Today's lesson covers an instruction that controllers use every day to sequence traffic safely.\n\nSometimes ATC does not want you to accelerate.\n\nSometimes ATC does not want you to slow down.\n\nInstead, the controller simply says:\n\n\"Maintain Present Speed.\"\n\nThis instruction helps keep predictable spacing between aircraft.\n\nProfessional pilots understand that maintaining a stable speed is just as important as maintaining an assigned altitude or heading.",
    "captainTeaching": "Imagine you're driving on a highway.\n\nThe car in front of you is moving at exactly the right speed.\n\nIf you suddenly accelerate, you'll reduce the safety distance.\n\nIf you brake unnecessarily, you'll affect the traffic behind you.\n\nThe safest action is simply to keep the same speed.\n\nThat's exactly what ATC wants.\n\nWhen the controller says:\n\nMaintain Present Speed\n\nthey're not concerned with your aircraft's performance.\n\nThey're managing the entire traffic flow.\n\nProfessional pilots understand that speed is one of the controller's most valuable tools for maintaining safe separation.",
    "operationalContext": "You're flying your H130 toward Florianópolis Airport.\n\nAnother helicopter is three miles ahead on the same approach.\n\nApproach wants to keep the spacing constant.\n\nThe controller transmits:\n\nApproach: ANAC123, maintain present speed.\n\nYou continue flying at your current approach speed.\n\nA few minutes later, after the preceding helicopter lands, ATC says:\n\nApproach: ANAC123, reduce speed at your discretion.\n\nOnly then do you adjust your speed.\n\nMaintaining your original speed helped preserve safe separation.",
    "sayItCoach": "Maintaining present speed, ANAC123.",
    "icaoModelAnswer": "ATC may instruct an aircraft to maintain its present speed to preserve safe spacing between aircraft, improve traffic sequencing, and reduce the need for additional vectoring. The pilot should continue flying at the current speed until another clearance is received.",
    "memoryTrick": "Imagine you're walking through a crowded airport terminal.\n\nEveryone is moving smoothly.\n\nIf you suddenly speed up, you'll bump into someone.\n\nIf you suddenly stop, people behind you may collide with you.\n\nThe safest action is to continue at the same pace.\n\nThat's exactly what Maintain Present Speed means.",
    "operationalMeaning": "When ATC issues Maintain Present Speed, the pilot should:\n\nThe instruction is intended to preserve traffic spacing and sequencing.\n\nIt does not modify:\n\nOnly the speed is affected.",
    "whyAtcUsesIt": [
      "maintain spacing between aircraft",
      "sequence arrivals efficiently",
      "avoid overtaking slower traffic",
      "prevent compression of traffic on final",
      "reduce workload",
      "stabilize traffic flow"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, maintain present speed.",
      "Approach: ANAC123, maintain present speed until five-mile final.",
      "Center: ANAC123, maintain present speed due traffic.",
      "Approach: ANAC123, maintain present speed, expect further clearance shortly.",
      "Tower: ANAC123, maintain present speed, number two following traffic."
    ],
    "pilotReadbacks": [
      "Maintaining present speed, ANAC123.",
      "Maintaining present speed until five-mile final, ANAC123.",
      "Maintaining present speed due traffic, ANAC123.",
      "Maintaining present speed, ANAC123.",
      "Number two, maintaining present speed, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Reducing speed because the airport is close.  \n  ✔ Continue at the present speed until ATC changes the instruction.\n\n- ❌ Increasing speed to \"help\" the controller.  \n  ✔ Maintain the assigned speed unless instructed otherwise.\n\n- ❌ Forgetting that helicopters may also receive speed instructions.  \n  ✔ Although helicopters have different operating characteristics, speed control is still an important ATC tool.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Maintaining present speed, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Maintain Present Speed\n\n**Pronunciation:** main-TAIN PREZ-ent SPEED\n\n**Word Stress**\n\n- Maintain → second syllable\n- Present → first syllable\n- Speed → strong final word\n\nPractice:\n\nMaintain... Present... Speed...\n\nNow together:\n\nMaintain Present Speed.\n\nThen practice:\n\nMaintaining present speed, ANAC123.\n\nKeep speed short and clear—avoid stretching the vowel.",
    "relatedConcepts": [
      "Maintain Present Heading",
      "Maintain Altitude",
      "Climb and Maintain",
      "Descend and Maintain",
      "Radar Vectors",
      "Reduce Speed",
      "Increase Speed"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65 — Air Traffic Control",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Speed Control",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM)",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — ATC Speed Control and Traffic Sequencing",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0019",
    "id": "0019",
    "displayTerm": "Report Position",
    "term": "report position",
    "slug": "report-position",
    "category": "ATC Phraseology",
    "meaningEn": "Report Position instructs the pilot to advise ATC of the aircraft's current position when requested or upon reaching a specified point.",
    "meaningPt": "Reporte sua posição.\n\nInforme ao controle a posição atual da aeronave ou quando atingir um ponto determinado.",
    "whenUsed": "When ATC issues Report Position, the pilot should report the aircraft's location using an appropriate reference, such as:",
    "example": "Approach: ANAC123, report position.",
    "sayPhrase": "ANAC123 is five miles south of Navegantes, maintaining two thousand feet.",
    "icaoQuestion": "Why are position reports still important even when aircraft have GPS and radar?",
    "icaoSpeakText": "Position reports help ATC confirm an aircraft's location, especially in areas with limited radar coverage or during VFR operations. They also improve situational awareness and help controllers provide safe traffic separation.",
    "missionBrief": "Today's lesson covers one of the oldest and most important reporting instructions in aviation.\n\nEven with modern surveillance systems like ADS-B and radar, pilots are still frequently instructed to report their position.\n\nA position report allows ATC to confirm where an aircraft is, improve situational awareness, and coordinate traffic safely.\n\nKnowing how and when to make a position report is an essential ICAO communication skill.",
    "captainTeaching": "Imagine a friend asks where you are while driving.\n\nYou wouldn't answer:\n\n\"I'm somewhere on the highway.\"\n\nInstead, you'd say:\n\n\"I'm five kilometers from the next exit.\"\n\nATC expects the same precision.\n\nA good position report helps the controller understand exactly where you are without asking additional questions.\n\nProfessional pilots always know their position.\n\nThat's why one of the first questions during any abnormal situation is often:\n\n\"Say your position.\"\n\nIf you immediately know the answer, you're maintaining excellent situational awareness.",
    "operationalContext": "You're flying your H130 along the coast toward Balneário Camboriú.\n\nRadar coverage becomes intermittent due to terrain.\n\nApproach requests:\n\nApproach: ANAC123, report position.\n\nYou verify your GPS and reply:\n\nPilot: ANAC123 is five miles south of Navegantes, maintaining two thousand feet.\n\nThe controller now has an accurate picture of your location and continues providing the service safely.",
    "sayItCoach": "ANAC123 is five miles south of Navegantes, maintaining two thousand feet.",
    "icaoModelAnswer": "Position reports help ATC confirm an aircraft's location, especially in areas with limited radar coverage or during VFR operations. They also improve situational awareness and help controllers provide safe traffic separation.",
    "memoryTrick": "Imagine dropping a pin on a digital map.\n\nWhen ATC asks for your position, you're simply telling the controller:\n\n\"This is where my pin is right now.\"\n\nThe more accurate the pin, the easier it is for ATC to manage traffic safely.",
    "operationalMeaning": "When ATC issues Report Position, the pilot should report the aircraft's location using an appropriate reference, such as:\n\nThe report should be accurate, concise, and use standard ICAO phraseology.\n\nPosition reports are especially common:",
    "whyAtcUsesIt": [
      "confirm aircraft location",
      "improve traffic awareness",
      "provide separation when radar is unavailable",
      "monitor flight progress",
      "coordinate subsequent clearances",
      "enhance operational safety"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, report position.",
      "Center: ANAC123, report overhead AFA VOR.",
      "Approach: ANAC123, report five-mile final.",
      "Tower: ANAC123, report left downwind.",
      "Center: ANAC123, report passing REKPA."
    ],
    "pilotReadbacks": [
      "ANAC123 is five miles south of Navegantes, maintaining two thousand feet.",
      "Wilco, ANAC123.",
      "Will report overhead AFA VOR, ANAC123.",
      "Will report five-mile final, ANAC123.",
      "Will report left downwind, ANAC123.",
      "Will report passing REKPA, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Giving a vague answer: \"I'm near the airport.\"  \n  ✔ Use a precise reference: \"Five miles north of the airport.\"\n\n- ❌ Forgetting altitude.  \n  Whenever appropriate, include altitude with the position.\n\n- ❌ Speaking too much.  \n  Position reports should be concise and standardized.\n\n- ❌ Waiting until ATC asks again.  \n  If instructed to report a specific point, do so promptly upon reaching it.",
    "pronunciationCoaching": "**Target Phrase:** Report Position\n\n**Pronunciation:** ri-PORT puh-ZISH-un\n\n**Word Stress**\n\n- Report → second syllable\n- Position → second syllable\n\nPractice:\n\nReport... Position...\n\nTogether:\n\nReport Position.\n\nNow practice:\n\nANAC123 is five miles south of Navegantes, maintaining two thousand feet.\n\nSpeak clearly and keep a natural rhythm.",
    "relatedConcepts": [
      "Report Final",
      "Report Downwind",
      "Report Base",
      "Radar Vectors",
      "Resume Own Navigation",
      "Fly Direct",
      "Situational Awareness"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Position Reporting",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Position Report",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Pilot's Handbook of Aeronautical Knowledge",
        "href": "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak/"
      },
      {
        "label": "SKYbrary — Position Reporting and Situational Awareness",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0020",
    "id": "0020",
    "displayTerm": "Maintain Own Separation",
    "term": "maintain own separation",
    "slug": "maintain-own-separation",
    "category": "ATC Phraseology",
    "meaningEn": "Maintain Own Separation instructs the pilot to assume responsibility for maintaining safe separation from specified traffic or obstacles while continuing the flight under ATC clearance.",
    "meaningPt": "Mantenha sua própria separação.\n\nO piloto assume a responsabilidade por manter separação segura em relação ao tráfego ou à aeronave especificada.",
    "whenUsed": "When instructed to Maintain Own Separation, the pilot becomes responsible for visually maintaining safe separation from the identified aircraft or traffic.",
    "example": "Approach: ANAC123, maintain own separation from the preceding helicopter.",
    "sayPhrase": "Traffic in sight, maintaining own separation, ANAC123.",
    "icaoQuestion": "When might ATC ask a pilot to maintain their own separation?",
    "icaoSpeakText": "ATC may issue this instruction during visual operations when the pilot has the other aircraft in sight. It allows the pilot to maintain safe spacing while ATC continues managing the overall traffic flow.",
    "missionBrief": "Today's lesson introduces a phrase that places additional responsibility on the pilot.\n\nNormally, ATC is responsible for separating aircraft operating under its control.\n\nHowever, in certain situations, ATC may instruct a pilot to:\n\n\"Maintain Own Separation.\"\n\nThis means the pilot accepts responsibility for maintaining safe separation from specific traffic while continuing to comply with other ATC instructions.\n\nUnderstanding exactly when and why this instruction is used is an important operational skill.",
    "captainTeaching": "Imagine you're walking through a busy airport terminal.\n\nNormally, security barriers organize everyone's movement.\n\nNow imagine those barriers are removed.\n\nYou can still walk safely, but you must pay much closer attention to the people around you.\n\nThat's what Maintain Own Separation means.\n\nATC is no longer providing separation from that specific traffic.\n\nInstead, the controller knows you have visual contact and trusts you to maintain a safe distance.\n\nProfessional pilots never become complacent during visual operations.\n\nWhen separation becomes your responsibility, your situational awareness must increase—not decrease.",
    "operationalContext": "You're approaching Florianópolis Airport in your H130.\n\nWeather conditions are excellent.\n\nYou have another helicopter clearly in sight ahead of you.\n\nApproach says:\n\nApproach: ANAC123, traffic twelve o'clock, one mile, same altitude. Maintain own separation and follow the traffic.\n\nYou report the traffic in sight.\n\nFrom that moment, you maintain a safe distance while continuing the approach.\n\nTower later clears you to land.",
    "sayItCoach": "Traffic in sight, maintaining own separation, ANAC123.",
    "icaoModelAnswer": "ATC may issue this instruction during visual operations when the pilot has the other aircraft in sight. It allows the pilot to maintain safe spacing while ATC continues managing the overall traffic flow.",
    "memoryTrick": "Imagine riding a bicycle behind a friend.\n\nThere are no traffic lights telling you how far to stay back.\n\nYou naturally keep a safe distance by watching the rider ahead.\n\nThat's exactly what Maintain Own Separation means.\n\nATC is no longer measuring the distance for you.\n\nYou are.",
    "operationalMeaning": "When instructed to Maintain Own Separation, the pilot becomes responsible for visually maintaining safe separation from the identified aircraft or traffic.\n\nThis instruction is commonly associated with:\n\nAlthough separation responsibility changes, the pilot must still comply with:",
    "whyAtcUsesIt": [
      "improve traffic flow",
      "reduce unnecessary delays",
      "allow visual sequencing",
      "increase airport capacity in VMC",
      "simplify helicopter traffic management",
      "permit visual operations while maintaining safety"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, maintain own separation from the preceding helicopter.",
      "Approach: ANAC123, traffic in sight, maintain own separation.",
      "Tower: ANAC123, maintain own separation and follow the traffic.",
      "Approach: ANAC123, maintain own separation during the visual approach.",
      "Approach: ANAC123, maintain own separation until established on final."
    ],
    "pilotReadbacks": [
      "Traffic in sight, maintaining own separation, ANAC123.",
      "Maintaining own separation from the preceding helicopter, ANAC123.",
      "Wilco, maintaining own separation, ANAC123.",
      "Following the traffic, maintaining own separation, ANAC123.",
      "Maintaining own separation until final, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Accepting the instruction without seeing the traffic.  \n  ✔ If you do not have the traffic in sight, advise ATC immediately.\n\n- ❌ Assuming ATC is still providing visual separation.  \n  ✔ Once accepted, you are responsible for maintaining separation from the specified traffic.\n\n- ❌ Focusing only on the aircraft ahead.  \n  ✔ Continue monitoring altitude, heading, airspeed, and other traffic.\n\n- ❌ Reading back only: Roger.  \n  ✔ Correct: Traffic in sight, maintaining own separation, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Maintain Own Separation\n\n**Pronunciation:** main-TAIN own sep-uh-RAY-shun\n\n**Word Stress**\n\n- Maintain → second syllable\n- Own → strong\n- Separation → third syllable\n\nPractice:\n\nMaintain... Own... Separation...\n\nNow together:\n\nMaintain Own Separation.\n\nThen practice:\n\nTraffic in sight, maintaining own separation, ANAC123.\n\nSpeak smoothly without rushing the word separation.",
    "relatedConcepts": [
      "Visual Approach",
      "Follow Traffic",
      "Traffic in Sight",
      "Cleared to Land",
      "Radar Vectors",
      "Situational Awareness",
      "See and Avoid"
    ],
    "references": [
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA JO 7110.65 — Air Traffic Control",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Visual Separation",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Visual Operations",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "SKYbrary — Visual Separation and See-and-Avoid",
        "href": "https://skybrary.aero"
      }
    ]
  }
];
