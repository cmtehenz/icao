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
  },
  {
    "catalogId": "0021",
    "id": "0021",
    "displayTerm": "Report Final",
    "term": "report final",
    "slug": "report-final",
    "category": "ATC Phraseology",
    "meaningEn": "Report Final instructs the pilot to advise ATC when the aircraft is on final approach to the assigned runway.",
    "meaningPt": "Reporte final.\n\nInforme ao controle quando a aeronave estiver estabelecida na perna final da pista designada.",
    "whenUsed": "When ATC issues Report Final, the pilot should:",
    "example": "Tower: ANAC123, report final runway one eight.",
    "sayPhrase": "Wilco, ANAC123.",
    "icaoQuestion": "What is the difference between Report Final and Cleared to Land?",
    "icaoSpeakText": "Report Final instructs the pilot to advise ATC when established on final approach. Cleared to Land authorizes the aircraft to land on the assigned runway. Reporting final does not mean landing is approved.",
    "missionBrief": "Today's lesson covers one of the most common instructions during a visual approach.\n\nWhen Tower says Report Final, the controller wants to know exactly when you are established on final approach.\n\nThis helps ATC sequence traffic, issue landing clearance at the right moment, and maintain safe spacing on the runway and in the pattern.\n\nReporting final is not the same as being cleared to land.\n\nProfessional pilots understand that difference immediately.",
    "captainTeaching": "Imagine you're waiting for a friend at a restaurant.\n\nYou don't need to know every step they took on the way.\n\nYou only need to know when they are about to arrive at the door.\n\nThat's what Report Final does for ATC.\n\nThe controller does not need to watch your entire approach.\n\nThey need one clear message at the right moment:\n\n\"I am now on final.\"\n\nUntil you report final, Tower may delay landing clearance because they cannot confirm your position in the sequence.\n\nAnd remember — reporting final is like knocking on the door.\n\nIt does not mean you are allowed to enter.\n\nLanding clearance is still required.",
    "operationalContext": "You're flying your H130 to Navegantes Airport on a clear afternoon.\n\nTower has already instructed you to join the left downwind for runway one eight.\n\nAfter you report downwind, Tower says:\n\nTower: ANAC123, number two, follow the traffic on a two-mile final. Report final runway one eight.\n\nYou acknowledge and continue the approach.\n\nWhen you turn final and the runway is clearly in sight, you report:\n\nPilot: Final runway one eight, ANAC123.\n\nTower then issues landing clearance when spacing is correct.",
    "sayItCoach": "Report Final.",
    "icaoModelAnswer": "Report Final instructs the pilot to advise ATC when established on final approach. Cleared to Land authorizes the aircraft to land on the assigned runway. Reporting final does not mean landing is approved.",
    "memoryTrick": "Think of final approach like the last corridor before the runway.\n\nReport Final is simply telling Tower:\n\n\"I have entered the corridor.\"\n\nThe door to land still requires Cleared to Land.",
    "operationalMeaning": "When ATC issues Report Final, the pilot should:\n\nA final report is commonly used:",
    "whyAtcUsesIt": [
      "sequence arriving traffic safely",
      "confirm aircraft position before issuing landing clearance",
      "manage spacing between arrivals",
      "coordinate runway occupancy",
      "maintain situational awareness in the visual circuit"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, report final runway one eight.",
      "Tower: ANAC123, report final.",
      "Tower: ANAC123, report long final runway three six.",
      "Tower: ANAC123, report three-mile final runway two seven.",
      "Tower: ANAC123, report final, number two behind the Airbus."
    ],
    "pilotReadbacks": [
      "Wilco, ANAC123.",
      "Will report final runway one eight, ANAC123.",
      "Will report final, ANAC123.",
      "Final runway one eight, ANAC123.",
      "Long final runway three six, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Assuming Report Final means cleared to land.  \n  ✔ Continue the approach and wait for explicit landing clearance.\n\n- ❌ Reporting final too early, before established on final.  \n  ✔ Report when you are actually on the final leg for the correct runway.\n\n- ❌ Forgetting the runway number.  \n  ✔ Include the runway whenever practical: Final runway one eight, ANAC123.\n\n- ❌ Reading back only: Roger.  \n  ✔ Better: Will report final runway one eight, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Report Final\n\n**Pronunciation:** ri-PORT FY-nul\n\n**Word Stress**\n\n- Report → second syllable\n- Final → first syllable\n\nPractice:\n\nReport... Final...\n\nTogether:\n\nReport Final.\n\nThen inside a complete transmission:\n\nWilco, ANAC123.\n\nSpeak the runway number clearly and keep a steady pace.",
    "relatedConcepts": [
      "Report Downwind",
      "Report Base",
      "Cleared to Land",
      "Continue Approach",
      "Visual Approach",
      "Go Around",
      "Number Two for Landing"
    ],
    "references": [
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Traffic Pattern Operations",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA AIM 4-3-2 — Airports with an Operating Control Tower",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Air Traffic Management",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Final Approach",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Read-back or Hear-back",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0022",
    "id": "0022",
    "displayTerm": "Report Downwind",
    "term": "report downwind",
    "slug": "report-downwind",
    "category": "ATC Phraseology",
    "meaningEn": "Report Downwind instructs the pilot to advise ATC when the aircraft is on the downwind leg of the traffic pattern for the assigned runway.",
    "meaningPt": "Reporte downwind.\n\nInforme ao controle quando a aeronave estiver na perna contrária à pista de pouso.",
    "whenUsed": "When ATC issues Report Downwind, the pilot should:",
    "example": "Tower: ANAC123, report downwind runway one four.",
    "sayPhrase": "Wilco, ANAC123.",
    "icaoQuestion": "Why does ATC ask pilots to report downwind during VFR operations?",
    "icaoSpeakText": "Reporting downwind helps ATC confirm that the aircraft has entered the traffic pattern correctly. It allows the controller to sequence traffic and issue further instructions for base, final, and landing clearance.",
    "missionBrief": "Today's lesson focuses on one of the first reports in a standard traffic pattern.\n\nWhen Tower instructs you to report downwind, they want to know when you are parallel to the landing runway, flying opposite to the landing direction.\n\nThis report helps ATC build the traffic sequence before base, final, and landing clearance.\n\nFor helicopter pilots, downwind reports are especially common during VFR operations at busy airports.",
    "captainTeaching": "Think of the traffic pattern like a racetrack around the airport.\n\nDownwind is the long straight section where you run parallel to the runway, but in the opposite direction of landing.\n\nWhen Tower says Report Downwind, they are asking:\n\n\"Tell me when you are on that straight section.\"\n\nWhy does it matter?\n\nBecause from downwind, ATC can see how the whole sequence will develop — who is first, who is second, and when to send you base or final.\n\nHelicopter pilots must be especially disciplined here.\n\nYou may fly a slightly different path than fixed-wing traffic, but your radio reports must still be clear and standard.",
    "operationalContext": "You're inbound to Florianópolis International Airport in your H130.\n\nTower clears you to join the circuit:\n\nTower: ANAC123, enter left downwind runway one four, report downwind.\n\nYou read back and join at pattern altitude.\n\nWhen abeam the threshold on the downwind leg, you report:\n\nPilot: Left downwind runway one four, ANAC123.\n\nTower now sequences you with other traffic and later clears you to continue the approach.",
    "sayItCoach": "Report Downwind.",
    "icaoModelAnswer": "Reporting downwind helps ATC confirm that the aircraft has entered the traffic pattern correctly. It allows the controller to sequence traffic and issue further instructions for base, final, and landing clearance.",
    "memoryTrick": "Downwind = you are **down** the runway direction, flying **wind** coming toward you (opposite landing).\n\nWhen Tower wants that leg, they say Report Downwind.\n\nSimple: parallel, opposite, report.",
    "operationalMeaning": "When ATC issues Report Downwind, the pilot should:\n\nDownwind reports are used:",
    "whyAtcUsesIt": [
      "establish traffic sequence early",
      "confirm pattern entry",
      "coordinate spacing before base and final",
      "manage mixed helicopter and fixed-wing traffic",
      "maintain runway and airspace awareness"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, report downwind runway one four.",
      "Tower: ANAC123, enter right downwind runway two seven, report downwind.",
      "Tower: ANAC123, report mid-field downwind.",
      "Tower: ANAC123, report downwind, number three in sequence.",
      "Tower: ANAC123, extend downwind, report abeam the tower."
    ],
    "pilotReadbacks": [
      "Wilco, ANAC123.",
      "Will report downwind runway one four, ANAC123.",
      "Enter left downwind, will report downwind, ANAC123.",
      "Left downwind runway one four, ANAC123.",
      "Right downwind runway two seven, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Reporting downwind before actually established on the leg.  \n  ✔ Report when you are parallel to the runway on the downwind leg.\n\n- ❌ Omitting left or right downwind when it matters.  \n  ✔ Say left downwind or right downwind clearly.\n\n- ❌ Forgetting the runway number.  \n  ✔ Include the runway: Left downwind runway one four, ANAC123.\n\n- ❌ Confusing downwind with base or final.  \n  ✔ Downwind is parallel to the runway, opposite landing direction.",
    "pronunciationCoaching": "**Target Phrase:** Report Downwind\n\n**Pronunciation:** ri-PORT DOWN-wind\n\n**Word Stress**\n\n- Report → second syllable\n- Downwind → first syllable on DOWN\n\nPractice:\n\nReport... Downwind...\n\nTogether:\n\nReport Downwind.\n\nThen inside a complete transmission:\n\nWilco, ANAC123.\n\nKeep downwind as one smooth word: DOWN-wind.",
    "relatedConcepts": [
      "Report Base",
      "Report Final",
      "Visual Approach",
      "Cleared to Land",
      "Maintain Own Separation",
      "Traffic in Sight",
      "Extend Downwind"
    ],
    "references": [
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Traffic Pattern Operations",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA AIM 4-3-2 — Airports with an Operating Control Tower",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Downwind Leg",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Read-back or Hear-back",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0023",
    "id": "0023",
    "displayTerm": "Report Base",
    "term": "report base",
    "slug": "report-base",
    "category": "ATC Phraseology",
    "meaningEn": "Report Base instructs the pilot to advise ATC when the aircraft is on the base leg of the traffic pattern for the assigned runway.",
    "meaningPt": "Reporte base.\n\nInforme ao controle quando a aeronave estiver na perna base do circuito de tráfego.",
    "whenUsed": "When ATC issues Report Base, the pilot should:",
    "example": "Tower: ANAC123, report base runway one eight.",
    "sayPhrase": "Wilco, ANAC123.",
    "icaoQuestion": "Why is the base report important for traffic separation?",
    "icaoSpeakText": "The base report helps ATC confirm when an aircraft is turning toward final approach. This allows the controller to manage spacing between aircraft and issue landing clearance or other instructions at the correct time.",
    "missionBrief": "Today's lesson covers the report that connects downwind and final.\n\nWhen Tower says Report Base, they want to know when you turn onto the base leg — the crosswind portion of the pattern that sets up your final approach.\n\nThis report helps ATC confirm spacing and decide when to issue landing clearance or further instructions.",
    "captainTeaching": "If downwind is the long parallel leg, base is the turn that points your nose toward the runway.\n\nIt's the bridge between \"I'm in the pattern\" and \"I'm on final.\"\n\nWhen ATC asks for Report Base, they want to know you've made that bridge.\n\nWhy?\n\nBecause base is where spacing problems often appear.\n\nIf you turn base too early or too late, the aircraft ahead or behind you may no longer be safely separated.\n\nA timely base report gives Tower time to react — hold you on downwind, extend, or clear you to land.",
    "operationalContext": "You are on left downwind for runway one eight at Navegantes in your H130.\n\nTower instructs:\n\nTower: ANAC123, report base runway one eight.\n\nYou continue downwind until abeam the normal turn point, then turn base.\n\nWhen established on base, you report:\n\nPilot: Base runway one eight, ANAC123.\n\nTower may then clear you to continue or instruct you to report final.",
    "sayItCoach": "Report Base.",
    "icaoModelAnswer": "The base report helps ATC confirm when an aircraft is turning toward final approach. This allows the controller to manage spacing between aircraft and issue landing clearance or other instructions at the correct time.",
    "memoryTrick": "You report when you cross the bridge from downwind toward the runway centerline.",
    "operationalMeaning": "When ATC issues Report Base, the pilot should:\n\nBase reports are common:",
    "whyAtcUsesIt": [
      "confirm the aircraft is turning from downwind toward final",
      "manage spacing between aircraft on base and final",
      "issue timely landing clearances",
      "detect early or late turns that affect separation",
      "maintain an accurate traffic picture"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, report base runway one eight.",
      "Tower: ANAC123, report base.",
      "Tower: ANAC123, report left base runway two seven.",
      "Tower: ANAC123, extend downwind, report base.",
      "Tower: ANAC123, report base, number two following traffic on final."
    ],
    "pilotReadbacks": [
      "Wilco, ANAC123.",
      "Will report base runway one eight, ANAC123.",
      "Will report base, ANAC123.",
      "Base runway one eight, ANAC123.",
      "Left base runway two seven, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Reporting base while still on downwind.  \n  ✔ Report only when established on the base leg.\n\n- ❌ Turning base without spacing awareness.  \n  ✔ Maintain visual scan and follow Tower sequencing instructions.\n\n- ❌ Omitting the runway in the report.  \n  ✔ Say: Base runway one eight, ANAC123.\n\n- ❌ Assuming base report means cleared to land.  \n  ✔ Landing clearance is still required unless already issued.",
    "pronunciationCoaching": "**Target Phrase:** Report Base\n\n**Pronunciation:** ri-PORT bays\n\n**Word Stress**\n\n- Report → second syllable\n- Base → one syllable, clear \"bays\" sound\n\nPractice:\n\nReport... Base...\n\nTogether:\n\nReport Base.\n\nThen inside a complete transmission:\n\nWilco, ANAC123.\n\nDo not rush the word base — keep it distinct from \"race.\"",
    "relatedConcepts": [
      "Report Downwind",
      "Report Final",
      "Extend Downwind",
      "Cleared to Land",
      "Visual Approach",
      "Traffic in Sight",
      "Go Around"
    ],
    "references": [
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Traffic Pattern Operations",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA AIM 4-3-2 — Airports with an Operating Control Tower",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Base Leg",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Read-back or Hear-back",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0024",
    "id": "0024",
    "displayTerm": "Taxi Via",
    "term": "taxi via",
    "slug": "taxi-via",
    "category": "Ground Operations",
    "meaningEn": "Taxi Via instructs the pilot to taxi to a destination using the specific taxiways or route stated by ATC.",
    "meaningPt": "Taxi via.\n\nSiga a rota de táxi indicada pelo controle até o ponto autorizado.",
    "whenUsed": "When ATC issues Taxi Via, the pilot should:",
    "example": "Ground: ANAC123, runway one eight, taxi via Alpha, hold short of runway two seven.",
    "sayPhrase": "Runway one eight, taxi via Alpha, hold short of runway two seven, ANAC123.",
    "icaoQuestion": "What should a pilot include in a taxi clearance readback?",
    "icaoSpeakText": "The pilot should read back the runway assignment if given, the taxi route, and any hold short or runway crossing instructions. The readback should include the aircraft identification and use standard phraseology.",
    "missionBrief": "Today's lesson moves from the air to the ground — and it is one of the most important surface instructions in aviation.\n\nWhen Ground says Taxi Via, they are giving you a specific route to follow on the airport movement area.\n\nYou must understand the route, read it back correctly, and comply with any hold short instructions along the way.\n\nRunway incursions often begin with misunderstood taxi clearances.\n\nProfessional pilots treat Taxi Via with the same discipline as a takeoff clearance.",
    "captainTeaching": "Imagine a hospital with colored lines on the floor.\n\nYou are not free to walk anywhere.\n\nYou must follow the line Ground assigns.\n\nTaxi Via is that line.\n\nIf Ground says via Alpha, Bravo, you do not shortcut across an open ramp unless cleared.\n\nAnd if they say hold short of a runway, that is a hard stop — even if the runway looks empty.\n\nThe FAA requires controllers to obtain a readback of runway hold short instructions.\n\nThat means your readback is not optional politeness.\n\nIt is part of the safety system.",
    "operationalContext": "You have just landed at Congonhas Airport in your H130.\n\nAfter vacating the runway, Ground contacts you:\n\nGround: ANAC123, taxi to the general aviation ramp via Alpha, Bravo, hold short of runway one seven left.\n\nYou read back the full route and hold short instruction, then taxi carefully using the airport diagram.\n\nAt the hold short point, you stop and wait for further clearance before crossing the active runway.",
    "sayItCoach": "Taxi Via Alpha.",
    "icaoModelAnswer": "The pilot should read back the runway assignment if given, the taxi route, and any hold short or runway crossing instructions. The readback should include the aircraft identification and use standard phraseology.",
    "memoryTrick": "Ground gives you the vector (route). You follow it exactly — no improvisation.",
    "operationalMeaning": "When ATC issues Taxi Via, the pilot should:\n\nTaxi Via clearances commonly include:",
    "whyAtcUsesIt": [
      "guide aircraft safely on the movement area",
      "prevent runway incursions",
      "sequence departures and arrivals on the ground",
      "route traffic around construction or closed taxiways",
      "coordinate traffic at complex airports"
    ],
    "atcPhraseology": [
      "Ground: ANAC123, runway one eight, taxi via Alpha, hold short of runway two seven.",
      "Ground: ANAC123, taxi to parking via Bravo, Charlie.",
      "Ground: ANAC123, taxi via Alpha, cross runway zero nine, hold short of runway one eight.",
      "Ground: ANAC123, taxi via Charlie to the helipad.",
      "Ground: ANAC123, runway three six left, taxi via Alpha, Delta, contact tower at holding point Delta two."
    ],
    "pilotReadbacks": [
      "Runway one eight, taxi via Alpha, hold short of runway two seven, ANAC123.",
      "Taxi to parking via Bravo, Charlie, ANAC123.",
      "Taxi via Alpha, cross runway zero nine, hold short of runway one eight, ANAC123.",
      "Taxi via Charlie to the helipad, ANAC123.",
      "Runway three six left, taxi via Alpha, Delta, contact tower at Delta two, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Reading back only \"Roger\" or \"Wilco\" without the route.  \n  ✔ Read back route and hold short points completely.\n\n- ❌ Omitting hold short from the readback.  \n  ✔ Always repeat hold short of runway XX when issued.\n\n- ❌ Crossing a runway without explicit clearance.  \n  ✔ Wait for cross runway or taxi instructions that authorize crossing.\n\n- ❌ Confusing taxi instruction with takeoff clearance.  \n  ✔ Taxi Via does not authorize entering the departure runway for takeoff.",
    "pronunciationCoaching": "**Target Phrase:** Taxi Via\n\n**Pronunciation:** TAK-see VY-uh\n\n**Word Stress**\n\n- Taxi → first syllable\n- Via → VY-uh (two syllables)\n\nPractice:\n\nTaxi... Via...\n\nTogether:\n\nTaxi Via Alpha.\n\nThen inside a complete transmission:\n\nRunway one eight, taxi via Alpha, hold short of runway two seven, ANAC123.\n\nSpeak taxiway letters with ICAO phonetics when needed in busy frequency environments.",
    "relatedConcepts": [
      "Hold Short",
      "Cross Runway",
      "Line Up and Wait",
      "Cleared for Takeoff",
      "Vacate Runway",
      "Runway Incursion",
      "Contact Tower"
    ],
    "references": [
      {
        "label": "FAA Aeronautical Information Manual (AIM) 4-3-18 — Taxiing",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Taxi and Ground Movement Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Ground Movement",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Taxi",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Runway Incursion",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0025",
    "id": "0025",
    "displayTerm": "Cross Runway",
    "term": "cross runway",
    "slug": "cross-runway",
    "category": "Airport Operations",
    "meaningEn": "Cross Runway instructs the pilot to taxi across the designated runway using the assigned route, after receiving explicit ATC authorization.",
    "meaningPt": "Cruze a pista.\n\nAutorização explícita para atravessar a pista indicada durante o táxi.",
    "whenUsed": "When ATC issues Cross Runway, the pilot should:",
    "example": "Ground: ANAC123, cross runway one eight, taxi via Bravo.",
    "sayPhrase": "Cross runway one eight, taxi via Bravo, ANAC123.",
    "icaoQuestion": "When is a pilot allowed to cross a runway during taxi?",
    "icaoSpeakText": "A pilot may cross a runway only after receiving explicit ATC authorization as part of a taxi instruction. If the clearance is unclear or hold short is issued, the pilot must stop and request clarification before crossing.",
    "missionBrief": "Today's lesson covers one of the highest-risk instructions on the airport surface.\n\nCross Runway authorizes an aircraft or vehicle to proceed across an active or inactive runway at a specified point.\n\nThis instruction exists because runway incursions remain one of the most serious safety risks in aviation.\n\nYou must never cross a runway without explicit authorization.",
    "captainTeaching": "A runway is not a taxiway.\n\nIt is a high-speed corridor for aircraft on takeoff and landing.\n\nWhen Ground says Cross Runway, they are opening a controlled gate for you — for a moment.\n\nBefore you enter that gate:\n\nIf anything is unclear, stop and ask.\n\nThe worst phrase on the ground is \"I thought I was cleared.\"\n\nProfessional pilots never cross on assumption.",
    "operationalContext": "You are taxiing your H130 at Navegantes after landing.\n\nGround instructs:\n\nGround: ANAC123, taxi via Bravo, cross runway one eight, hold short of runway zero seven.\n\nYou stop at runway one eight, scan left and right, confirm no landing or departing traffic, and cross when safe.\n\nAfter crossing, you continue on Bravo and hold short of runway zero seven as instructed.",
    "sayItCoach": "Cross Runway.",
    "icaoModelAnswer": "A pilot may cross a runway only after receiving explicit ATC authorization as part of a taxi instruction. If the clearance is unclear or hold short is issued, the pilot must stop and request clarification before crossing.",
    "memoryTrick": "Hold short means the door is closed.\n\nNo explicit cross = door stays closed.",
    "operationalMeaning": "When ATC issues Cross Runway, the pilot should:\n\nA pilot must not cross a runway when:",
    "whyAtcUsesIt": [
      "allow aircraft to reach departure runways or parking areas",
      "coordinate ground movement at complex airports",
      "protect active landing and departing traffic",
      "prevent runway incursions",
      "maintain orderly surface operations"
    ],
    "atcPhraseology": [
      "Ground: ANAC123, cross runway one eight, taxi via Bravo.",
      "Ground: ANAC123, taxi via Alpha, cross runway zero nine, hold short of runway one eight.",
      "Ground: ANAC123, cross runway two seven left at Bravo.",
      "Ground: ANAC123, hold short runway one eight. (No crossing — contrast instruction.)",
      "Ground: ANAC123, cross runway three six left, contact tower on the other side."
    ],
    "pilotReadbacks": [
      "Cross runway one eight, taxi via Bravo, ANAC123.",
      "Taxi via Alpha, cross runway zero nine, hold short of runway one eight, ANAC123.",
      "Cross runway two seven left at Bravo, ANAC123.",
      "Holding short runway one eight, ANAC123.",
      "Cross runway three six left, contact tower, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Crossing because the runway looks empty.  \n  ✔ Cross only with explicit ATC authorization.\n\n- ❌ Confusing hold short with cross runway.  \n  ✔ Hold short means stop before the runway. Cross runway means authorized to proceed across.\n\n- ❌ Slow unnecessary stop on the runway after crossing is authorized.  \n  ✔ Cross expeditiously — do not loiter on the runway.\n\n- ❌ Incomplete readback omitting the runway to cross.  \n  ✔ Read back: Cross runway one eight, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Cross Runway\n\n**Pronunciation:** kross RUN-way\n\n**Word Stress**\n\n- Cross → one syllable, crisp \"kross\"\n- Runway → RUN-way\n\nPractice:\n\nCross... Runway...\n\nTogether:\n\nCross Runway.\n\nThen inside a complete transmission:\n\nCross runway one eight, taxi via Bravo, ANAC123.\n\nSay the runway number distinctly — it is safety-critical.",
    "relatedConcepts": [
      "Hold Short",
      "Taxi Via",
      "Line Up and Wait",
      "Cleared for Takeoff",
      "Vacate Runway",
      "Runway Incursion",
      "LAHSO"
    ],
    "references": [
      {
        "label": "FAA Aeronautical Information Manual (AIM) 4-3-18 — Taxiing",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Taxi and Ground Movement Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Surface Movement",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Runway Crossing",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Runway Incursion",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0026",
    "id": "0026",
    "displayTerm": "Taxi to Holding Point",
    "term": "taxi to holding point",
    "slug": "taxi-to-holding-point",
    "category": "Ground Operations",
    "meaningEn": "Taxi to Holding Point instructs the pilot to taxi to a designated holding position and stop, awaiting further clearance before entering the runway.",
    "meaningPt": "Táxi até o ponto de espera.\n\nSiga a rota indicada e pare no ponto de espera designado, aguardando novas instruções.",
    "whenUsed": "When ATC issues Taxi to Holding Point, the pilot should:",
    "example": "Ground: ANAC123, taxi to holding point Charlie via Alpha, hold short of runway three five.",
    "sayPhrase": "Taxi to holding point Charlie via Alpha, hold short of runway three five, ANAC123.",
    "icaoQuestion": "What is the difference between taxi to holding point and line up and wait?",
    "icaoSpeakText": "Taxi to holding point is a ground movement instruction to taxi to a designated position and stop before the runway. Line up and wait is a tower instruction to enter the runway and position for departure without takeoff clearance. The holding point is reached on the taxiway; line up means you are on the runway.",
    "missionBrief": "Today's lesson bridges taxi clearances and runway operations.\n\nWhen Ground says Taxi to Holding Point, they are directing you to a specific position on the movement area — usually near the departure runway — where you will wait for further instructions from Tower.\n\nThis is not a takeoff clearance.\n\nIt is not permission to enter the runway.\n\nProfessional pilots understand that the holding point is a staging area where ground control hands you off to tower control.\n\nGetting this right prevents runway incursions and keeps departure sequencing safe.",
    "captainTeaching": "Think of the holding point as the waiting room before the runway.\n\nGround brings you to the door.\n\nTower decides when you may enter.\n\nMany runway incursions happen because pilots treat the holding point as optional — rolling past it because the runway looks empty.\n\nThe holding point is a hard boundary until Tower clears you forward.\n\nIn Brazil, pilots sometimes confuse taxi to holding point with line up and wait.\n\nThey are different steps in the departure sequence.\n\nAt Congonhas, with its short runways and dense traffic, discipline at the holding point is not optional.",
    "operationalContext": "You are departing Congonhas Airport in your H130.\n\nGround has cleared you from the helipad:\n\nGround: ANAC123, taxi to holding point Alpha one via Bravo, hold short of runway one seven right.\n\nYou taxi carefully along Bravo, stop at holding point Alpha one, and switch to Tower frequency as instructed.\n\nTower later clears you to line up and wait.\n\nUntil that moment, you remain stopped at the holding point.",
    "sayItCoach": "Taxi to holding point Charlie, ANAC123.",
    "icaoModelAnswer": "Taxi to holding point is a ground movement instruction to taxi to a designated position and stop before the runway. Line up and wait is a tower instruction to enter the runway and position for departure without takeoff clearance. The holding point is reached on the taxiway; line up means you are on the runway.",
    "memoryTrick": "**HOLD** at the holding point — **H**alt, **O**bserve the runway, **L**isten to tower, **D**o not enter until cleared.",
    "operationalMeaning": "When ATC issues Taxi to Holding Point, the pilot should:\n\nTaxi to Holding Point clearances commonly include:",
    "whyAtcUsesIt": [
      "position aircraft near the departure runway efficiently",
      "coordinate the handoff from Ground to Tower",
      "prevent premature runway entry",
      "sequence departures in busy traffic",
      "keep the movement area organized at complex airports"
    ],
    "atcPhraseology": [
      "Ground: ANAC123, taxi to holding point Charlie via Alpha, hold short of runway three five.",
      "Ground: ANAC123, taxi to holding point Delta two, contact tower.",
      "Ground: ANAC123, runway two seven, taxi to holding point Bravo via Alpha, Delta.",
      "Ground: ANAC123, taxi to holding point Alpha one, hold short runway one eight.",
      "Ground: ANAC123, taxi to holding point Lima, monitor tower one one eight point seven."
    ],
    "pilotReadbacks": [
      "Taxi to holding point Charlie via Alpha, hold short of runway three five, ANAC123.",
      "Taxi to holding point Delta two, contact tower, ANAC123.",
      "Runway two seven, taxi to holding point Bravo via Alpha, Delta, ANAC123.",
      "Taxi to holding point Alpha one, hold short runway one eight, ANAC123.",
      "Taxi to holding point Lima, monitoring tower, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Entering the runway after reaching the holding point without tower clearance.  \n  ✔ Stop at the holding point and wait for tower instructions.\n\n- ❌ Confusing holding point with the runway threshold.  \n  ✔ The holding point is on the taxiway, before the runway.\n\n- ❌ Omitting hold short from the readback.  \n  ✔ Always read back hold short instructions when included.\n\n- ❌ Forgetting to contact tower when instructed.  \n  ✔ Switch to tower frequency at the holding point as cleared.",
    "pronunciationCoaching": "**Target Phrase:** Taxi to Holding Point\n\n**Pronunciation:** TAK-see too HOLD-ing point\n\n**Word Stress**\n\n- Taxi → first syllable\n- Holding → first syllable\n- Point → one syllable, clear T at the end\n\nPractice:\n\nTaxi... to... Holding Point...\n\nTogether:\n\nTaxi to holding point Charlie, ANAC123.\n\nThen inside a complete transmission:\n\nTaxi to holding point Charlie via Alpha, hold short of runway three five, ANAC123.",
    "relatedConcepts": [
      "Hold Short",
      "Taxi Via",
      "Line Up and Wait",
      "Contact Tower",
      "Cross Runway",
      "Cleared for Takeoff",
      "Runway Incursion"
    ],
    "references": [
      {
        "label": "FAA Aeronautical Information Manual (AIM) 4-3-18 — Taxiing",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Taxi and Ground Movement Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Ground Movement",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Holding Point",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Runway Incursion",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0027",
    "id": "0027",
    "displayTerm": "Backtrack",
    "term": "backtrack",
    "slug": "backtrack",
    "category": "Airport Operations",
    "meaningEn": "Backtrack instructs or authorizes the pilot to taxi along the runway surface, typically toward the departure end opposite to the landing direction.",
    "meaningPt": "Retornar pela pista.\n\nTáxi ao longo da pista em uso, geralmente em sentido contrário ao pouso, para posicionar-se para decolagem.",
    "whenUsed": "When ATC authorizes Backtrack, the pilot should:",
    "example": "Tower: ANAC123, backtrack runway two seven for departure.",
    "sayPhrase": "Backtracking runway two seven for departure, ANAC123.",
    "icaoQuestion": "How would you report that you are backtracking the runway for departure?",
    "icaoSpeakText": "I would report to Tower: ANAC123 backtracking runway two seven for departure. I include my callsign, the word backtracking, the runway designator, and the purpose.",
    "missionBrief": "Today's lesson covers a surface maneuver that surprises many pilots the first time they hear it.\n\nBacktrack means taxiing on the runway itself — opposite to the landing direction — to reach the departure end for takeoff.\n\nThis is common at smaller airports and heliports where there is no parallel taxiway to the runway threshold.\n\nYou must understand when backtracking is authorized, how to report it, and why controllers need to protect the runway while you are on it.",
    "captainTeaching": "Imagine you landed on a one-way street and need to drive to the other end to depart.\n\nYou cannot use the sidewalk — you must use the street itself.\n\nThat is backtrack.\n\nThe runway is active airspace even when you are taxiing on it.\n\nTower must know you are there.\n\nOther aircraft may be on final approach.\n\nAt Brazilian coastal heliports like Balneário Camboriú, backtrack is routine.\n\nTreat it with the same alertness as a takeoff or landing roll.\n\nNever backtrack without explicit tower authorization.",
    "operationalContext": "You have just landed at Balneário Camboriú in your H130 on runway two seven.\n\nThere is no taxiway to the departure end.\n\nTower instructs you to backtrack for departure.\n\nTower: ANAC123, backtrack runway two seven for departure.\n\nYou report:\n\nTower, ANAC123 backtracking runway two seven for departure.\n\nYou taxi carefully along the runway centerline, scanning for traffic, until you reach the departure end and await further clearance.",
    "sayItCoach": "ANAC123 backtracking runway two seven for departure.",
    "icaoModelAnswer": "I would report to Tower: ANAC123 backtracking runway two seven for departure. I include my callsign, the word backtracking, the runway designator, and the purpose.",
    "memoryTrick": "**BACK** on the runway — **B**efore takeoff, **A**uthorized by tower, **C**enterline, **K**eep scanning for traffic.",
    "operationalMeaning": "When ATC authorizes Backtrack, the pilot should:\n\nBacktrack is commonly used when:",
    "whyAtcUsesIt": [
      "position aircraft at the departure end when no parallel taxiway exists",
      "coordinate runway use at airports with limited infrastructure",
      "maintain awareness of aircraft on the runway surface",
      "sequence departures after arrivals on the same runway",
      "protect landing traffic while aircraft backtrack"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, backtrack runway two seven for departure.",
      "Tower: ANAC123, cleared to backtrack runway one eight.",
      "Tower: ANAC123, backtrack runway three five, report reaching the threshold.",
      "Tower: ANAC123, expedite backtrack, traffic on a three-mile final.",
      "Tower: ANAC123, cancel backtrack, taxi via Alpha to holding point Bravo."
    ],
    "pilotReadbacks": [
      "Backtracking runway two seven for departure, ANAC123.",
      "Cleared to backtrack runway one eight, ANAC123.",
      "Backtracking runway three five, will report reaching the threshold, ANAC123.",
      "Expediting backtrack, ANAC123.",
      "Cancel backtrack, taxi via Alpha to holding point Bravo, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Backtracking without tower clearance.  \n  ✔ Wait for explicit authorization before entering the runway to backtrack.\n\n- ❌ Saying \"returning on the runway\" instead of standard phraseology.  \n  ✔ Use backtracking runway XX for departure.\n\n- ❌ Assuming backtrack includes takeoff clearance.  \n  ✔ Backtrack only positions you; you still need line up and takeoff clearance.\n\n- ❌ Moving slowly without reporting when traffic is on final.  \n  ✔ Expedite when instructed and keep tower informed of your position.",
    "pronunciationCoaching": "**Target Phrase:** Backtracking Runway Two Seven for Departure\n\n**Pronunciation:** BACK-track-ing RUN-way two SEV-en for dee-PAR-chur\n\n**Word Stress**\n\n- Backtrack → BACK-track (stress first syllable)\n- Departure → second syllable\n\nPractice:\n\nBacktrack... runway two seven...\n\nTogether:\n\nANAC123 backtracking runway two seven for departure.\n\nSpeak runway numbers digit by digit: two seven, not twenty-seven.",
    "relatedConcepts": [
      "Vacate Runway",
      "Line Up and Wait",
      "Cleared for Takeoff",
      "Hold Short",
      "Runway Incursion",
      "Expedite Taxi",
      "Contact Tower"
    ],
    "references": [
      {
        "label": "FAA Aeronautical Information Manual (AIM) 4-3-18 — Taxiing",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Runway Operations",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Aerodrome Operations",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Backtrack",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Runway Incursion",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0028",
    "id": "0028",
    "displayTerm": "Vacate Runway",
    "term": "vacate runway",
    "slug": "vacate-runway",
    "category": "Airport Operations",
    "meaningEn": "Vacate Runway instructs or requires the pilot to leave the runway surface promptly after landing and proceed to the assigned taxiway or exit point.",
    "meaningPt": "Desocupar a pista.\n\nSair da pista rapidamente após o pouso e seguir para o ponto de saída indicado.",
    "whenUsed": "When instructed or expected to Vacate Runway, the pilot should:",
    "example": "Tower: ANAC123, vacate runway zero seven at taxiway Bravo.",
    "sayPhrase": "Vacating runway zero seven at taxiway Bravo, ANAC123.",
    "icaoQuestion": "How would you report vacating the runway after landing?",
    "icaoSpeakText": "I would report to Tower: ANAC123 vacating runway zero nine at taxiway Charlie. I include my callsign, the word vacating, the runway designator, and the taxiway where I am exiting.",
    "missionBrief": "Today's lesson covers one of the most time-critical instructions after landing.\n\nVacate Runway means exit the runway promptly and completely so that other aircraft may land or take off.\n\nEvery second you remain on the runway blocks traffic and increases risk.\n\nProfessional pilots plan their exit before touchdown and report vacating without being asked.",
    "captainTeaching": "Picture a busy highway off-ramp.\n\nIf you stop in the middle of the exit lane, everyone behind you is blocked.\n\nThe runway works the same way.\n\nPlan your exit during the approach briefing.\n\nKnow which taxiway you will use before you touch down.\n\nIn helicopter operations at airports like Navegantes or Florianópolis, pilots sometimes hover-taxi after landing.\n\nYou are still on the runway until you are completely past the holding markings.\n\nReport vacating clearly — Tower may be sequencing an aircraft on short final.",
    "operationalContext": "You have just landed your H130 at Navegantes on runway zero seven.\n\nTower has another aircraft on a two-mile final.\n\nTower: ANAC123, vacate runway zero seven at taxiway Bravo, expedite.\n\nYou roll to Bravo without delay, turn off the runway, and report:\n\nTower, ANAC123 vacating runway zero seven at taxiway Bravo.\n\nOnce clear, Ground takes over your taxi instructions.",
    "sayItCoach": "Tower, ANAC123 vacating runway zero seven at taxiway Bravo.",
    "icaoModelAnswer": "I would report to Tower: ANAC123 vacating runway zero nine at taxiway Charlie. I include my callsign, the word vacating, the runway designator, and the taxiway where I am exiting.",
    "memoryTrick": "**VACATE** — **V**ehicle off the runway, **A**nnounce the taxiway, **C**lear completely, **A**llow traffic behind, **T**ower informed, **E**xpedite when told.",
    "operationalMeaning": "When instructed or expected to Vacate Runway, the pilot should:\n\nVacate Runway applies when:",
    "whyAtcUsesIt": [
      "clear the runway for landing traffic behind you",
      "protect departing aircraft waiting for runway access",
      "maintain airport capacity and traffic flow",
      "prevent go-arounds caused by runway occupancy",
      "reduce runway incursion risk"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, vacate runway zero seven at taxiway Bravo.",
      "Tower: ANAC123, expedite vacating runway one eight, traffic on short final.",
      "Tower: ANAC123, vacate runway two seven left at the next exit.",
      "Tower: ANAC123, turn left at Charlie and vacate runway three five.",
      "Tower: ANAC123, unable to vacate at Bravo, vacating at Delta."
    ],
    "pilotReadbacks": [
      "Vacating runway zero seven at taxiway Bravo, ANAC123.",
      "Expediting vacating runway one eight, ANAC123.",
      "Vacating runway two seven left at the next exit, ANAC123.",
      "Turn left at Charlie, vacating runway three five, ANAC123.",
      "Unable Bravo, vacating at Delta, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Stopping on the runway to complete after-landing checks.  \n  ✔ Clear the runway first, then complete checks on the taxiway.\n\n- ❌ Saying \"leaving the runway\" instead of standard phraseology.  \n  ✔ Use vacating runway XX at taxiway YY.\n\n- ❌ Reporting vacating before the aircraft is fully clear.  \n  ✔ Report only when completely past the runway holding markings.\n\n- ❌ Ignoring expedite when traffic is on final.  \n  ✔ Exit promptly when instructed to expedite vacating.",
    "pronunciationCoaching": "**Target Phrase:** Vacating Runway Zero Seven at Taxiway Bravo\n\n**Pronunciation:** VAY-kay-ting RUN-way zero SEV-en at TAK-see-way BRAH-voh\n\n**Word Stress**\n\n- Vacate → second syllable (vay-KATE)\n- Vacating → first syllable (VAY-kay-ting)\n- Taxiway → TAK-see-way\n\nPractice:\n\nVacating... runway zero seven...\n\nTogether:\n\nTower, ANAC123 vacating runway zero seven at taxiway Bravo.",
    "relatedConcepts": [
      "Cleared to Land",
      "Go Around",
      "Cross Runway",
      "Taxi Via",
      "Hold Short",
      "Backtrack",
      "Runway Incursion"
    ],
    "references": [
      {
        "label": "FAA Aeronautical Information Manual (AIM) 4-3-20 — Exiting the Runway",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Runway Operations",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Aerodrome Operations",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Vacate Runway",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Runway Excursion and Incursion",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0029",
    "id": "0029",
    "displayTerm": "Expedite Taxi",
    "term": "expedite taxi",
    "slug": "expedite-taxi",
    "category": "Ground Operations",
    "meaningEn": "Expedite Taxi instructs the pilot to increase taxi speed and proceed without delay to the assigned destination on the movement area.",
    "meaningPt": "Acelere o táxi.\n\nDesloque-se sem demora até o destino indicado, mantendo segurança na superfície.",
    "whenUsed": "When ATC issues Expedite Taxi, the pilot should:",
    "example": "Ground: ANAC123, expedite taxi to runway three one.",
    "sayPhrase": "Expediting taxi to runway three one, ANAC123.",
    "icaoQuestion": "What should you do when ATC instructs you to expedite taxi?",
    "icaoSpeakText": "I should increase taxi speed within safe limits and proceed to the assigned destination without unnecessary delay. I must still comply with hold short instructions and maintain situational awareness. If I cannot expedite safely, I should advise ATC immediately.",
    "missionBrief": "Today's lesson covers a ground instruction that signals urgency without panic.\n\nWhen Ground says Expedite Taxi, they need you to move faster on the movement area — safely, but without unnecessary delay.\n\nThis is not permission to rush blindly.\n\nIt is a request to increase taxi pace because traffic flow, runway sequencing, or another aircraft's needs require it.\n\nProfessional pilots expedite while maintaining situational awareness and surface safety.",
    "captainTeaching": "Imagine you are in a hospital corridor and a nurse says, \"Please hurry — the doctor is waiting.\"\n\nYou walk faster, but you do not run into other people.\n\nExpedite Taxi works the same way.\n\nMove with purpose.\n\nDo not stop for nonessential tasks.\n\nBut never sacrifice safety for speed.\n\nIn Brazil, pilots sometimes confuse expedite with emergency authority.\n\nExpedite is a normal ATC instruction for traffic flow — not a Mayday situation.\n\nIf you cannot expedite safely due to debris, construction, or a tight turn in your H130, tell Ground immediately.",
    "operationalContext": "You are taxiing your H130 at Florianópolis for departure on runway three one.\n\nGround needs to clear the taxiway for an arriving aircraft.\n\nGround: ANAC123, expedite taxi to runway three one via Alpha.\n\nYou increase your taxi pace safely along Alpha and report:\n\nANAC123 expediting taxi to runway three one.\n\nYou reach the holding point without unnecessary stops, and Tower clears you for departure shortly after.",
    "sayItCoach": "ANAC123 expediting taxi to runway three one.",
    "icaoModelAnswer": "I should increase taxi speed within safe limits and proceed to the assigned destination without unnecessary delay. I must still comply with hold short instructions and maintain situational awareness. If I cannot expedite safely, I should advise ATC immediately.",
    "memoryTrick": "**SPEED** safely — **S**ee traffic, **P**roceed directly, **E**xpedite when told, **E**xplain if unable, **D**o not skip hold shorts.",
    "operationalMeaning": "When ATC issues Expedite Taxi, the pilot should:\n\nExpedite Taxi is commonly used when:",
    "whyAtcUsesIt": [
      "maintain efficient traffic flow on the surface",
      "coordinate runway sequencing between arrivals and departures",
      "reduce delays for following traffic",
      "clear the movement area for priority aircraft",
      "meet departure time constraints"
    ],
    "atcPhraseology": [
      "Ground: ANAC123, expedite taxi to runway three one.",
      "Ground: ANAC123, expedite taxi to holding point Charlie via Bravo.",
      "Ground: ANAC123, expedite taxi to the ramp, traffic waiting.",
      "Ground: ANAC123, expedite taxi, contact tower at holding point Delta.",
      "Ground: ANAC123, expedite taxi to runway one eight, hold short runway two seven."
    ],
    "pilotReadbacks": [
      "Expediting taxi to runway three one, ANAC123.",
      "Expediting taxi to holding point Charlie via Bravo, ANAC123.",
      "Expediting taxi to the ramp, ANAC123.",
      "Expediting taxi, contact tower at Delta, ANAC123.",
      "Expediting taxi to runway one eight, hold short runway two seven, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Ignoring expedite and continuing at normal taxi pace.  \n  ✔ Increase pace promptly when instructed, within safe limits.\n\n- ❌ Treating expedite as permission to cross a runway without clearance.  \n  ✔ Hold short instructions still apply during expedited taxi.\n\n- ❌ Saying \"going faster\" instead of standard phraseology.  \n  ✔ Use expediting taxi to runway XX.\n\n- ❌ Rushing without scanning for traffic and surface hazards.  \n  ✔ Expedite safely — awareness does not decrease.",
    "pronunciationCoaching": "**Target Phrase:** Expediting Taxi to Runway Three One\n\n**Pronunciation:** EK-speh-dy-ting TAK-see too RUN-way three ONE\n\n**Word Stress**\n\n- Expedite → first syllable (EK-speh-dyt)\n- Expediting → second syllable (ek-SPEH-dy-ting)\n\nPractice:\n\nExpedite... taxi...\n\nTogether:\n\nANAC123 expediting taxi to runway three one.\n\nAvoid rushing the transmission — speak clearly even when expediting.",
    "relatedConcepts": [
      "Taxi Via",
      "Taxi to Holding Point",
      "Hold Short",
      "Contact Tower",
      "Vacate Runway",
      "Line Up and Wait",
      "Runway Incursion"
    ],
    "references": [
      {
        "label": "FAA Aeronautical Information Manual (AIM) 4-3-18 — Taxiing",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Taxi and Ground Movement Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Ground Movement",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Expedite",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Ground Operations",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0030",
    "id": "0030",
    "displayTerm": "Follow Traffic",
    "term": "follow traffic",
    "slug": "follow-traffic",
    "category": "ATC Phraseology",
    "meaningEn": "Follow Traffic instructs the pilot to visually acquire specified traffic and proceed behind it while maintaining safe separation under ATC control.",
    "meaningPt": "Siga o tráfego.\n\nMantenha contato visual com a aeronave indicada e prossiga atrás dela na sequência.",
    "whenUsed": "When instructed to Follow Traffic, the pilot should:",
    "example": "Approach: ANAC123, follow the traffic ahead, report traffic in sight.",
    "sayPhrase": "Traffic in sight, following the traffic, ANAC123.",
    "icaoQuestion": "What should you do if ATC instructs you to follow traffic but you cannot see the aircraft?",
    "icaoSpeakText": "I should immediately advise ATC that I do not have the traffic in sight. I cannot accept a follow traffic instruction until I have positive visual contact with the specified aircraft.",
    "missionBrief": "Today's lesson introduces visual sequencing — one of the most efficient tools ATC uses in good weather.\n\nWhen Tower or Approach says Follow Traffic, they are instructing you to maintain visual contact with another aircraft and proceed behind it in the landing or departure sequence.\n\nYou become responsible for seeing and following that traffic while still complying with all other ATC instructions.\n\nThis is not a clearance to land.\n\nIt is a sequencing instruction that requires positive visual contact.",
    "captainTeaching": "Imagine driving on a highway behind another car.\n\nYou can see the car ahead.\n\nYou keep a safe distance.\n\nYou do not need a traffic light telling you exactly how far back to stay — but you must pay attention.\n\nFollow Traffic works the same way in the air.\n\nATC identifies the aircraft.\n\nYou confirm visual contact.\n\nYou maintain safe spacing.\n\nAt Congonhas and Florianópolis, helicopter traffic is dense on good weather days.\n\nNever accept follow traffic if you cannot see the aircraft.\n\nAnd never assume landing clearance — follow traffic is sequencing, not authorization to land.",
    "operationalContext": "You are on approach to Florianópolis in your H130 on a clear afternoon.\n\nAnother helicopter is ahead of you on the same approach path.\n\nApproach: ANAC123, follow the traffic, report traffic in sight.\n\nYou scan ahead, acquire the traffic, and reply:\n\nTraffic in sight, ANAC123.\n\nYou maintain a safe distance behind the leading helicopter while Approach vectors you for the visual approach.\n\nTower later clears you to land after the traffic ahead has landed and vacated.",
    "sayItCoach": "ANAC123 following traffic ahead, visual contact established.",
    "icaoModelAnswer": "I should immediately advise ATC that I do not have the traffic in sight. I cannot accept a follow traffic instruction until I have positive visual contact with the specified aircraft.",
    "memoryTrick": "**FOLLOW** — **F**ind the traffic, **O**bserve continuously, **L**et ATC know if lost, **L**and only when cleared, **O**wn your separation, **W**atch your spacing.",
    "operationalMeaning": "When instructed to Follow Traffic, the pilot should:\n\nFollow Traffic is commonly used during:",
    "whyAtcUsesIt": [
      "sequence aircraft efficiently in visual conditions",
      "reduce radar vectoring and controller workload",
      "increase airport capacity in VMC",
      "simplify visual approaches and pattern operations",
      "manage helicopter traffic with visual separation"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, follow the traffic ahead, report traffic in sight.",
      "Tower: ANAC123, follow the helicopter on a two-mile final.",
      "Approach: ANAC123, follow traffic, maintain own separation.",
      "Tower: ANAC123, number two, follow the traffic on final runway one four.",
      "Approach: ANAC123, follow the traffic, cleared visual approach runway two seven."
    ],
    "pilotReadbacks": [
      "Traffic in sight, following the traffic, ANAC123.",
      "Following the helicopter on final, ANAC123.",
      "Traffic in sight, maintaining own separation, ANAC123.",
      "Number two, following the traffic on final, ANAC123.",
      "Following the traffic, cleared visual approach runway two seven, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Accepting follow traffic without visual contact.  \n  ✔ Report traffic in sight only when you have positive identification.\n\n- ❌ Assuming follow traffic includes landing clearance.  \n  ✔ Wait for cleared to land from Tower.\n\n- ❌ Losing sight of traffic without advising ATC.  \n  ✔ Report immediately if visual contact is lost.\n\n- ❌ Reading back only \"Roger\" without confirming traffic in sight.  \n  ✔ Traffic in sight, following the traffic, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Following Traffic, Visual Contact Established\n\n**Pronunciation:** FOL-oh-wing TRAF-ik, VIZH-oo-ul KON-takt es-TAB-lished\n\n**Word Stress**\n\n- Follow → first syllable\n- Traffic → first syllable\n- Visual → first syllable\n\nPractice:\n\nFollowing... traffic...\n\nTogether:\n\nANAC123 following traffic ahead, visual contact established.\n\nThen in sequence:\n\nTraffic in sight, following the traffic, ANAC123.",
    "relatedConcepts": [
      "Maintain Own Separation",
      "Traffic in Sight",
      "Visual Approach",
      "Number Two Behind Traffic",
      "Cleared to Land",
      "Continue Approach",
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
        "label": "FAA JO 7110.65 — Visual Separation",
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
  },
  {
    "catalogId": "0031",
    "id": "0031",
    "displayTerm": "Number One for Landing",
    "term": "number one for landing",
    "slug": "number-one-for-landing",
    "category": "ATC Phraseology",
    "meaningEn": "Number One for Landing indicates that the aircraft is first in the landing sequence for the specified runway.",
    "meaningPt": "Número um para pouso.\n\nA aeronave é a primeira na sequência de pouso na pista indicada.",
    "whenUsed": "When Number One for Landing applies, the pilot should:",
    "example": "Tower: ANAC123, number one, runway two one, cleared to land.",
    "sayPhrase": "Tower, ANAC123 number one for landing runway two one.",
    "icaoQuestion": "How would you tell Tower you are number one for landing?",
    "icaoSpeakText": "I would report: Tower, ANAC123 number one for landing runway two one. I include my callsign, number one for landing, and the runway designator.",
    "missionBrief": "Today's lesson covers sequence position — a simple phrase that tells you where you stand in the landing queue.\n\nNumber One for Landing means you are first in line to land.\n\nYou may report this to Tower, or Tower may confirm it to you.\n\nEither way, it is an acknowledgment of your position in the sequence — not a landing clearance by itself.\n\nProfessional pilots understand the difference between being number one and being cleared to land.",
    "captainTeaching": "Think of a bakery queue.\n\nBeing first in line does not mean you have your bread yet.\n\nYou still wait for the baker to hand it to you.\n\nNumber one for landing is your place in line.\n\nCleared to land is the baker handing you the bread.\n\nBrazilian pilots sometimes say \"first to land\" or \"primeiro da fila\" on frequency.\n\nUse standard ICAO phraseology: number one for landing runway two one.\n\nAlways include the runway designator.\n\nAnd never assume number one without Tower confirmation — they may have traffic you cannot see.",
    "operationalContext": "You are on final approach to runway two one at Navegantes in your H130.\n\nThe preceding aircraft has vacated the runway.\n\nYou report to Tower:\n\nTower, ANAC123 number one for landing runway two one.\n\nTower replies:\n\nANAC123, number one, runway two one, cleared to land.\n\nYou read back the landing clearance and complete the approach.",
    "sayItCoach": "Tower, ANAC123 number one for landing runway two one.",
    "icaoModelAnswer": "I would report: Tower, ANAC123 number one for landing runway two one. I include my callsign, number one for landing, and the runway designator.",
    "memoryTrick": "**ONE** — **O**nly report when sure, **N**ame the runway, **E**xpect Tower correction if wrong.",
    "operationalMeaning": "When Number One for Landing applies, the pilot should:\n\nNumber One for Landing is used when:",
    "whyAtcUsesIt": [
      "confirm landing sequence position",
      "reduce uncertainty in busy traffic patterns",
      "coordinate landing clearances efficiently",
      "prepare pilots for imminent landing authorization",
      "manage traffic flow at airports like Congonhas and Florianópolis"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, number one, runway two one, cleared to land.",
      "Tower: ANAC123, confirm you are number one for landing.",
      "Tower: ANAC123, number two, follow the traffic on final.",
      "Tower: ANAC123, extend downwind, traffic on a two-mile final.",
      "Tower: ANAC123, wind two one zero at one two, runway two one."
    ],
    "pilotReadbacks": [
      "Tower, ANAC123 number one for landing runway two one.",
      "ANAC123, number one for landing runway two one.",
      "ANAC123, traffic in sight, number one.",
      "ANAC123, confirm number one for landing.",
      "ANAC123, not number one, traffic ahead in sight."
    ],
    "brazilianMistakes": "- ❌ Saying \"first to land\" instead of number one for landing.  \n  ✔ Use standard phraseology: number one for landing runway XX.\n\n- ❌ Assuming number one without Tower confirmation.  \n  ✔ Wait for Tower to confirm or correct your sequence position.\n\n- ❌ Omitting the runway number in the report.  \n  ✔ Always include the runway designator.\n\n- ❌ Treating number one as landing clearance.  \n  ✔ Wait for cleared to land before landing.",
    "pronunciationCoaching": "**Target Phrase:** Number One for Landing Runway Two One\n\n**Pronunciation:** NUM-ber ONE for LAN-ding RUN-way two ONE\n\n**Word Stress**\n\n- Number → first syllable\n- Landing → first syllable\n- Runway → RUN-way\n\nPractice:\n\nNumber one... for landing...\n\nTogether:\n\nTower, ANAC123 number one for landing runway two one.\n\nSpeak runway numbers digit by digit.",
    "relatedConcepts": [
      "Cleared to Land",
      "Number Two Behind Traffic",
      "Follow Traffic",
      "Report Final",
      "Continue Approach",
      "Traffic in Sight",
      "Visual Approach"
    ],
    "references": [
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Approach Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Arrival Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Approach and Landing",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Landing Sequence",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Landing Sequence",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0032",
    "id": "0032",
    "displayTerm": "Number Two Behind Traffic",
    "term": "number two behind traffic",
    "slug": "number-two-behind-traffic",
    "category": "ATC Phraseology",
    "meaningEn": "Number Two Behind Traffic indicates the aircraft is second in the landing sequence and must follow the specified traffic on final approach.",
    "meaningPt": "Número dois atrás do tráfego.\n\nA aeronave é a segunda na sequência de pouso e deve seguir o tráfego indicado na final.",
    "whenUsed": "When instructed Number Two Behind Traffic, the pilot should:",
    "example": "Tower: ANAC123, number two, follow the traffic on final runway one eight.",
    "sayPhrase": "Number two, following the traffic on final, ANAC123.",
    "icaoQuestion": "What would you do if Tower says you are number two behind traffic on final?",
    "icaoSpeakText": "I would acknowledge number two, confirm the traffic is in sight, and follow the traffic on final at a safe distance. I would continue the approach and wait for cleared to land after the traffic ahead has landed and vacated the runway.",
    "missionBrief": "Today's lesson covers the second position in the landing sequence — a common instruction at busy airports.\n\nNumber Two Behind Traffic means you are second in line to land and must follow the aircraft ahead on final approach.\n\nYou are not cleared to land yet.\n\nYou must maintain visual contact with the traffic ahead and comply with any spacing or reporting instructions.\n\nProfessional pilots treat number two as a sequencing instruction that requires patience and situational awareness.",
    "captainTeaching": "Imagine a two-person line at a single checkout counter.\n\nYou are second.\n\nYou watch the person ahead finish before you step forward.\n\nNumber two behind traffic works the same way in the air.\n\nYou see the traffic ahead.\n\nYou follow at a safe distance.\n\nYou wait your turn.\n\nBrazilian pilots sometimes get impatient on number two and descend too close to the traffic ahead.\n\nMaintain spacing.\n\nAnd remember — continue approach and number two are not cleared to land.\n\nAt Congonhas, with its short final and dense traffic, discipline on number two prevents go-arounds and conflicts.",
    "operationalContext": "You are approaching Balneário Camboriú in your H130.\n\nAn Airbus A320 is on a two-mile final ahead of you.\n\nTower: ANAC123, number two, follow the traffic on a two-mile final. Report final runway one eight.\n\nYou reply:\n\nNumber two, following the traffic, will report final, ANAC123.\n\nYou maintain visual contact and a safe distance behind the Airbus.\n\nWhen you report final, Tower clears you to land after the traffic ahead vacates the runway.",
    "sayItCoach": "Number two, following the traffic on final, ANAC123.",
    "icaoModelAnswer": "I would acknowledge number two, confirm the traffic is in sight, and follow the traffic on final at a safe distance. I would continue the approach and wait for cleared to land after the traffic ahead has landed and vacated the runway.",
    "memoryTrick": "**TWO** — **T**raffic in sight, **W**ait for clearance, **O**bserve spacing behind the leader.",
    "operationalMeaning": "When instructed Number Two Behind Traffic, the pilot should:\n\nNumber Two Behind Traffic is commonly issued with:",
    "whyAtcUsesIt": [
      "sequence multiple aircraft on the same approach",
      "maintain safe spacing between arrivals",
      "reduce controller workload in visual conditions",
      "prepare pilots for delayed landing clearance",
      "manage busy patterns at airports like Congonhas and Florianópolis"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, number two, follow the traffic on final runway one eight.",
      "Tower: ANAC123, number two behind the Boeing seven three seven, continue approach.",
      "Tower: ANAC123, number two, follow the traffic, report final.",
      "Tower: ANAC123, number two, maintain present speed, traffic two miles ahead.",
      "Tower: ANAC123, extend downwind, you are number two, traffic on short final."
    ],
    "pilotReadbacks": [
      "Number two, following the traffic on final, ANAC123.",
      "Number two behind the Boeing seven three seven, continuing approach, ANAC123.",
      "Number two, following the traffic, will report final, ANAC123.",
      "Number two, maintaining present speed, ANAC123.",
      "Extending downwind, number two, traffic in sight, ANAC123."
    ],
    "brazilianMistakes": "- ❌ Landing without clearance because you are on final behind traffic.  \n  ✔ Wait for cleared to land even when number two on short final.\n\n- ❌ Losing sight of traffic without advising Tower.  \n  ✔ Report immediately if visual contact is lost.\n\n- ❌ Closing too close to the traffic ahead.  \n  ✔ Maintain safe visual separation throughout the approach.\n\n- ❌ Reading back only \"Roger\" without confirming number two.  \n  ✔ Number two, following the traffic, ANAC123.",
    "pronunciationCoaching": "**Target Phrase:** Number Two Behind Traffic on Final\n\n**Pronunciation:** NUM-ber TOO bee-HIND TRAF-ik on FY-nul\n\n**Word Stress**\n\n- Number → first syllable\n- Behind → second syllable (bee-HIND)\n- Final → first syllable (FY-nul)\n\nPractice:\n\nNumber two... behind traffic...\n\nTogether:\n\nNumber two, following the traffic on final, ANAC123.\n\nSpeak aircraft types clearly: Boeing seven three seven.",
    "relatedConcepts": [
      "Number One for Landing",
      "Follow Traffic",
      "Continue Approach",
      "Report Final",
      "Cleared to Land",
      "Maintain Own Separation",
      "Go Around"
    ],
    "references": [
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Approach Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Arrival Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Approach and Landing",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Landing Sequence",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Landing Sequence",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0033",
    "id": "0033",
    "displayTerm": "Priority Landing",
    "term": "priority landing",
    "slug": "priority-landing",
    "category": "ATC Phraseology",
    "meaningEn": "Priority Landing is a pilot request for preferential ATC handling to land before other traffic due to an urgent or emergency situation.",
    "meaningPt": "Pouso prioritário.\n\nSolicitação de tratamento preferencial para pousar antes dos demais tráfegos devido a situação urgente.",
    "whenUsed": "When requesting Priority Landing, the pilot should:",
    "example": "Approach: ANAC123, cleared priority approach runway two seven.",
    "sayPhrase": "Pan Pan Pan, Approach, ANAC123, medical emergency on board. Request priority landing runway one seven right.",
    "icaoQuestion": "What is the difference between priority landing and Mayday?",
    "icaoSpeakText": "Mayday declares a distress situation where immediate assistance is required because the aircraft or occupants are in grave and imminent danger. Priority landing is a request for preferential sequencing to land ahead of traffic, often used with Pan Pan for urgency or Mayday for distress. Priority landing describes what you need; Mayday describes the severity of the emergency.",
    "missionBrief": "Today's lesson covers a request that signals urgency to ATC — without always being a full distress call.\n\nPriority Landing asks ATC to sequence your aircraft ahead of other traffic because of an urgent situation.\n\nThis may involve low fuel, a medical emergency, a system malfunction, or other time-critical conditions.\n\nIt is different from Mayday, but it still requires clear communication, a stated reason, and professional cooperation with ATC.\n\nUnderstanding when and how to request priority landing is essential for ICAO Part 2 and Part 3.",
    "captainTeaching": "Think of priority landing as asking to jump the queue because something serious is happening.\n\nYou must explain why.\n\nA controller cannot prioritize you if they do not understand the situation.\n\nPan Pan signals urgency.\n\nMayday signals distress.\n\nPriority landing is the operational request that follows.\n\nIn Brazil, pilots sometimes say \"I need to land first\" on frequency.\n\nThat is not standard phraseology.\n\nSay: request priority landing, and state the reason.\n\nPair the request with Pan Pan or Mayday when the situation warrants it.\n\nATC will do their part — but clear communication starts in your cockpit.",
    "operationalContext": "You are inbound to Congonhas in your H130 with a passenger experiencing chest pain.\n\nYou declare urgency and request priority handling.\n\nApproach: ANAC123, say nature of emergency.\n\nYou reply:\n\nPan Pan Pan, Approach, ANAC123, medical emergency on board. Request priority landing runway one seven right.\n\nApproach: ANAC123, cleared priority approach runway one seven right, number one, all traffic hold.\n\nYou read back and proceed directly while ATC holds other traffic.\n\nEmergency services are standing by on arrival.",
    "sayItCoach": "Pan Pan Pan, Approach, ANAC123, medical emergency on board. Request priority landing.",
    "icaoModelAnswer": "Mayday declares a distress situation where immediate assistance is required because the aircraft or occupants are in grave and imminent danger. Priority landing is a request for preferential sequencing to land ahead of traffic, often used with Pan Pan for urgency or Mayday for distress. Priority landing describes what you need; Mayday describes the severity of the emergency.",
    "memoryTrick": "**PRIORITY** — **P**roblem stated, **R**equest clearly, **I**nform urgency, **O**rder from ATC, **R**eady for straight-in, **I**dentify nature, **T**ouch down expeditiously, **Y**ield to ATC vectors.",
    "operationalMeaning": "When requesting Priority Landing, the pilot should:\n\nPriority Landing is used when:",
    "whyAtcUsesIt": [
      "protect aircraft in urgent or emergency situations",
      "clear traffic from the landing sequence",
      "provide vectors to the nearest suitable airport",
      "alert emergency services when required",
      "minimize delay for time-critical landings"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, cleared priority approach runway two seven.",
      "Approach: ANAC123, number one, all traffic hold.",
      "Approach: ANAC123, say nature of emergency.",
      "Tower: ANAC123, runway two seven cleared to land, traffic holding.",
      "Tower: ANAC123, emergency services standing by."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan, Approach, ANAC123, medical emergency on board. Request priority landing runway one seven right.",
      "Requesting priority to land due to low fuel, ANAC123.",
      "We request priority landing, ANAC123.",
      "Cleared priority approach runway two seven, ANAC123.",
      "ANAC123, because of low fuel we need priority landing."
    ],
    "brazilianMistakes": "- ❌ Saying \"I need to land first\" instead of request priority landing.  \n  ✔ Use standard phraseology and state the reason.\n\n- ❌ Requesting priority without explaining the nature of the urgency.  \n  ✔ State medical emergency, low fuel, or the specific problem clearly.\n\n- ❌ Confusing priority landing with the emergency declaration itself.  \n  ✔ Declare Pan Pan or Mayday first, then request priority handling.\n\n- ❌ Expecting landing clearance without following ATC vectors.  \n  ✔ Comply with all ATC instructions during priority handling.",
    "pronunciationCoaching": "**Target Phrase:** Request Priority Landing\n\n**Pronunciation:** ree-KWEST pry-OR-i-tee LAN-ding\n\n**Word Stress**\n\n- Priority → second syllable (pry-OR-i-tee)\n- Request → second syllable (ree-KWEST)\n- Emergency → second syllable (e-MER-gen-cy)\n\nPractice:\n\nRequest... priority landing...\n\nTogether:\n\nPan Pan Pan, Approach, ANAC123, medical emergency on board. Request priority landing.\n\nSpeak Pan Pan three times clearly: PAN PAN PAN.",
    "relatedConcepts": [
      "Mayday Distress Call",
      "Pan Pan Urgency Call",
      "Emergency Landing",
      "Low Fuel",
      "Engine Failure",
      "Loss of Power",
      "Cleared to Land"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Priority",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Emergency Communications",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0034",
    "id": "0034",
    "displayTerm": "Engine Failure",
    "term": "engine failure",
    "slug": "engine-failure",
    "category": "Emergency",
    "meaningEn": "Engine Failure is the complete or near-complete loss of engine power, requiring immediate crew action and ATC notification.",
    "meaningPt": "Falha de motor.\n\nPerda completa ou parcial da potência do motor, exigindo ação imediata da tripulação.",
    "whenUsed": "When Engine Failure occurs, the pilot should:",
    "example": "Tower: ANAC123, roger Mayday, say souls on board and fuel remaining.",
    "sayPhrase": "Mayday Mayday Mayday, Navegantes Tower, ANAC123, engine failure, request immediate return.",
    "icaoQuestion": "What would you tell ATC immediately after an engine failure on departure?",
    "icaoSpeakText": "After securing the aircraft, I would declare Mayday Mayday Mayday, state my callsign, report engine failure, state my intentions such as immediate return or autorotation, and provide position. I would give souls on board and fuel remaining when ATC requests.",
    "missionBrief": "Today's lesson covers one of the most serious events a pilot can face.\n\nEngine Failure means the engine has stopped producing usable power — completely or to the extent that continued safe flight is in doubt.\n\nIn a single-engine helicopter like the H130, engine failure is immediately critical.\n\nYou must aviate first, then navigate, then communicate.\n\nYour radio call must be clear, standard, and timed — after you have secured the aircraft as much as possible.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Engine failure in an H130 is not a drill.\n\nIt is immediate.\n\nThe sequence every professional pilot learns:\n\nAviate. Navigate. Communicate.\n\nDo not transmit Mayday while the aircraft is out of control.\n\nEstablish autorotation first.\n\nThen speak — clearly, once, with standard words.\n\nBrazilian pilots sometimes say \"engine stopped\" or \"motor parou\" on frequency.\n\nUse engine failure — it is the ICAO standard term.\n\nFor multi-engine aircraft, specify which engine: lost engine number one.\n\nFor the H130, one engine means one chance.\n\nTrain your autorotation reflexes so your radio call comes from a stable aircraft, not a panicked voice.",
    "operationalContext": "You have just departed Navegantes in your H130 on a sightseeing flight.\n\nAt three hundred feet, the engine fails.\n\nYou lower the collective and enter autorotation toward a suitable area.\n\nWhen stable, you transmit:\n\nMayday Mayday Mayday, Navegantes Tower, ANAC123, engine failure, autorotating, one mile south of the airport.\n\nTower clears all traffic and coordinates emergency services.\n\nYou complete a controlled autorotation landing and report safe on the ground.",
    "sayItCoach": "Mayday Mayday Mayday, Navegantes Tower, ANAC123, engine failure.",
    "icaoModelAnswer": "After securing the aircraft, I would declare Mayday Mayday Mayday, state my callsign, report engine failure, state my intentions such as immediate return or autorotation, and provide position. I would give souls on board and fuel remaining when ATC requests.",
    "memoryTrick": "**FAIL** — **F**ly the aircraft first, **A**utorotate or secure, **I**nform ATC with Mayday, **L**and or loiter as required.",
    "operationalMeaning": "When Engine Failure occurs, the pilot should:\n\nEngine Failure reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear traffic from the aircraft's route",
      "provide vectors to the nearest suitable airport",
      "coordinate priority landing and emergency services",
      "request souls on board and fuel remaining",
      "alert other aircraft and airport authorities"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, roger Mayday, say souls on board and fuel remaining.",
      "Tower: ANAC123, all traffic cleared from your approach, runway zero seven cleared to land.",
      "Approach: ANAC123, turn right heading zero nine zero, descend at your discretion.",
      "Tower: ANAC123, emergency services standing by.",
      "Departure: ANAC123, radar contact, fly direct Navegantes, say intentions."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, Navegantes Tower, ANAC123, engine failure, request immediate return.",
      "Tower, ANAC123, lost engine, autorotating.",
      "We have an engine failure, ANAC123, souls on board three, fuel remaining one hour.",
      "Mayday Mayday Mayday, Departure, ANAC123, engine failure, request vectors to Florianópolis.",
      "ANAC123, engine failure, unable to maintain altitude, descending to nearest suitable area."
    ],
    "brazilianMistakes": "- ❌ Declaring Mayday before establishing aircraft control.  \n  ✔ Aviate first — autorotate or secure the aircraft, then communicate.\n\n- ❌ Saying \"engine stopped\" instead of engine failure.  \n  ✔ Use standard phraseology: engine failure or lost engine.\n\n- ❌ Forgetting to state intentions after the emergency declaration.  \n  ✔ State immediate return, autorotation, or nearest suitable airport.\n\n- ❌ Omitting souls on board and fuel when ATC asks.  \n  ✔ Provide souls on board and fuel remaining promptly.",
    "pronunciationCoaching": "**Target Phrase:** Mayday Mayday Mayday, Engine Failure\n\n**Pronunciation:** MAY-day MAY-day MAY-day, EN-jin FAIL-yur\n\n**Word Stress**\n\n- Mayday → may-DAY (say three times, clearly)\n- Engine → EN-jin\n- Failure → FAIL-yur (two syllables)\n\nPractice:\n\nMayday... Mayday... Mayday...\n\nTogether:\n\nMayday Mayday Mayday, Navegantes Tower, ANAC123, engine failure.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Mayday Distress Call",
      "Loss of Power",
      "Loss of Thrust",
      "Priority Landing",
      "Emergency Landing",
      "Autorotation",
      "Go Around"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Engine Failure",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Engine Failure and Damage",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0035",
    "id": "0035",
    "displayTerm": "Loss of Power",
    "term": "loss of power",
    "slug": "loss-of-power",
    "category": "Emergency",
    "meaningEn": "Loss of Power is a reduction or partial loss of engine thrust output, which may or may not result in complete engine failure.",
    "meaningPt": "Perda de potência.\n\nRedução da potência do motor — parcial ou completa — afetando a capacidade de manter altitude ou voo planejado.",
    "whenUsed": "When Loss of Power occurs, the pilot should:",
    "example": "Approach: ANAC123, say which engine and ability to maintain altitude.",
    "sayPhrase": "Pan Pan Pan, ANAC123, loss of power on engine two, maintaining altitude.",
    "icaoQuestion": "How would you describe loss of power versus complete engine failure?",
    "icaoSpeakText": "Loss of power means reduced engine thrust — the engine may still be running but not producing enough power. Engine failure means the engine has stopped producing usable thrust. I would report loss of power when thrust is reduced, and engine failure when the engine is not producing usable power. I also state whether I can maintain altitude.",
    "missionBrief": "Today's lesson covers a critical distinction in emergency phraseology.\n\nLoss of Power is not always the same as complete engine failure.\n\nIt may mean partial power loss — the engine is still running, but not producing enough thrust to maintain altitude or complete the flight as planned.\n\nReporting loss of power accurately helps ATC understand your situation and provide appropriate assistance.\n\nThis is essential for ICAO Part 2 vocabulary and Part 3 emergency communication — especially in helicopter operations where power margins are narrow.",
    "captainTeaching": "Imagine your car engine sputtering on a highway hill.\n\nIt is still running — but you are slowing down.\n\nThat is loss of power.\n\nComplete engine failure is the engine stopping entirely.\n\nThe distinction matters to ATC.\n\nIf you can maintain altitude, Pan Pan may be appropriate.\n\nIf you cannot, the situation may escalate to Mayday.\n\nIn the H130, even partial power loss can become critical quickly.\n\nAlways tell ATC: able or unable to maintain altitude.\n\nBrazilian pilots sometimes confuse loss of power with electrical failure or say \"no power.\"\n\nUse loss of power — and quantify your situation.\n\nPartial or complete. Able or unable. Which engine if applicable.\n\nPrecision helps controllers help you.",
    "operationalContext": "You are cruising at two thousand feet in your H130 near Florianópolis when engine power drops unexpectedly.\n\nThe engine is still running, but you cannot maintain altitude.\n\nYou declare urgency:\n\nPan Pan Pan, Florianópolis Approach, ANAC123, loss of power, unable to maintain altitude, descending.\n\nApproach: ANAC123, say which engine and ability to maintain altitude.\n\nYou reply:\n\nANAC123, single engine helicopter, loss of power, unable to maintain two thousand feet, descending to nearest suitable area, request vectors.\n\nApproach provides vectors and priority handling toward the airport.",
    "sayItCoach": "Pan Pan Pan, ANAC123, loss of power, unable to maintain altitude.",
    "icaoModelAnswer": "Loss of power means reduced engine thrust — the engine may still be running but not producing enough power. Engine failure means the engine has stopped producing usable thrust. I would report loss of power when thrust is reduced, and engine failure when the engine is not producing usable power. I also state whether I can maintain altitude.",
    "memoryTrick": "**POWER** — **P**osition and control, **O**bserve engine indications, **W**hich engine affected, **E**xplain able or unable, **R**equest vectors or priority.",
    "operationalMeaning": "When Loss of Power occurs, the pilot should:\n\nLoss of Power reporting commonly includes:",
    "whyAtcUsesIt": [
      "assign lower altitudes or vectors as needed",
      "clear traffic from the aircraft's route",
      "coordinate priority landing when required",
      "request which engine and ability to maintain altitude",
      "alert emergency services if the situation deteriorates"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, say which engine and ability to maintain altitude.",
      "Approach: ANAC123, descend at pilot's discretion.",
      "Approach: ANAC123, vectors to the nearest suitable airport.",
      "Tower: ANAC123, all traffic cleared from your route.",
      "Tower: ANAC123, runway one four cleared to land, wind calm."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan, ANAC123, loss of power on engine two, maintaining altitude.",
      "ANAC123, unable to maintain flight level two five zero, request lower.",
      "Mayday Mayday Mayday, ANAC123, complete loss of power.",
      "ANAC123, single-engine helicopter, loss of power, unable to maintain altitude, descending.",
      "ANAC123, loss of power, request vectors to Navegantes."
    ],
    "brazilianMistakes": "- ❌ Saying \"no power\" instead of loss of power.  \n  ✔ Use standard phraseology: loss of power.\n\n- ❌ Not specifying ability to maintain altitude.  \n  ✔ Report able or unable to maintain altitude clearly.\n\n- ❌ Confusing loss of power with electrical power loss.  \n  ✔ Loss of power refers to engine thrust, not electrical systems.\n\n- ❌ Using loss of power and engine failure interchangeably.  \n  ✔ Be precise — partial loss versus complete failure.",
    "pronunciationCoaching": "**Target Phrase:** Loss of Power, Unable to Maintain Altitude\n\n**Pronunciation:** LOSS ov POW-er, un-AY-bul too main-TAIN AL-ti-tude\n\n**Word Stress**\n\n- Loss → one syllable, clear S\n- Power → POW-er\n- Maintain → second syllable (main-TAIN)\n- Altitude → AL-ti-tude\n\nPractice:\n\nLoss of power...\n\nTogether:\n\nPan Pan Pan, ANAC123, loss of power, unable to maintain altitude.\n\nStress POWER in loss of power.",
    "relatedConcepts": [
      "Engine Failure",
      "Loss of Thrust",
      "Mayday Distress Call",
      "Pan Pan Urgency Call",
      "Priority Landing",
      "Emergency Landing",
      "Fuel Starvation"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Engine Power Loss",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Engine Failure and Damage",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0036",
    "id": "0036",
    "displayTerm": "Engine Flameout",
    "term": "engine flameout",
    "slug": "engine-flameout",
    "category": "Emergency",
    "meaningEn": "Engine Flameout is the sudden loss of engine combustion, where the flame extinguishes inside the engine.",
    "meaningPt": "Apagão de motor.\n\nPerda súbita da combustão no motor — a chama se apaga no interior do motor.",
    "whenUsed": "When Engine Flameout occurs, the pilot should:",
    "example": "Approach: ANAC123, roger flameout, report if able to restart.",
    "sayPhrase": "Pan Pan Pan, Florianópolis Approach, ANAC123, engine flameout, attempting relight.",
    "icaoQuestion": "How is an engine flameout different from engine failure in your report to ATC?",
    "icaoSpeakText": "Engine flameout means combustion stopped and I may attempt a relight. Engine failure means the engine is not producing usable power. I would report flameout if I am attempting restart, and engine failure if power cannot be restored. I tell ATC my restart status and whether I can maintain altitude.",
    "missionBrief": "Today's lesson covers a sudden and specific engine event.\n\nEngine Flameout means combustion has stopped in the engine — the flame has gone out.\n\nUnlike a complete mechanical failure, a flameout may be recoverable with a relight procedure.\n\nIn your H130, a flameout at altitude still demands immediate action and clear communication.\n\nYou must aviate first, attempt relight if appropriate, then inform ATC with precise phraseology.\n\nThis lesson prepares you for ICAO Part 2 vocabulary and Part 3 emergency communication.",
    "captainTeaching": "Flameout is a word many Brazilian pilots never use on frequency.\n\nThey say motor apagou or engine stopped.\n\nUse engine flameout — it tells ATC combustion stopped, not that the engine mechanically failed.\n\nThe key difference from engine failure: flameout may be transient.\n\nKeep ATC updated every thirty seconds during a relight attempt.\n\nIf you cannot maintain altitude, upgrade from Pan Pan to Mayday immediately.\n\nIn the H130, a flameout at low altitude leaves little time for restart — prioritize rotor RPM and landing area selection.\n\nAt altitude, you have more options — but never delay the first radio call while the aircraft is unstable.",
    "operationalContext": "You are cruising at four thousand feet in your H130 over the coast near Florianópolis.\n\nWithout warning, the engine flames out.\n\nYou lower the collective slightly, maintain rotor RPM, and begin the relight procedure.\n\nWhen stable, you transmit:\n\nPan Pan Pan, Florianópolis Approach, ANAC123, engine flameout, attempting relight, maintaining altitude at four thousand feet.\n\nApproach acknowledges and asks you to report restart status.\n\nThirty seconds later, the engine relights. You report positive restart and continue with caution.",
    "sayItCoach": "Pan Pan Pan, Florianópolis Approach, ANAC123, engine flameout, attempting relight.",
    "icaoModelAnswer": "Engine flameout means combustion stopped and I may attempt a relight. Engine failure means the engine is not producing usable power. I would report flameout if I am attempting restart, and engine failure if power cannot be restored. I tell ATC my restart status and whether I can maintain altitude.",
    "memoryTrick": "**FLAME** — **F**ly the aircraft, **L**ight relight attempt, **A**nnounce to ATC, **M**onitor altitude, **E**scalate to Mayday if unable to maintain.",
    "operationalMeaning": "When Engine Flameout occurs, the pilot should:\n\nEngine Flameout reporting commonly includes:",
    "whyAtcUsesIt": [
      "provide vectors to the nearest suitable airport if restart fails",
      "assign altitude blocks during relight attempts",
      "clear traffic from the aircraft's route if altitude cannot be maintained",
      "request intentions and souls on board when distress is declared",
      "coordinate priority landing if the situation escalates"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, roger flameout, report if able to restart.",
      "Approach: ANAC123, descend to flight level zero eight zero, report restart status.",
      "Approach: ANAC123, turn right heading two seven zero, vectors to the field.",
      "Approach: ANAC123, say intentions.",
      "Approach: ANAC123, nearest airport is one five miles at your twelve o'clock."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan, Florianópolis Approach, ANAC123, engine flameout, attempting relight.",
      "ANAC123, negative restart, request vectors to the nearest airport.",
      "ANAC123, engine relit, maintaining altitude.",
      "Mayday Mayday Mayday, Approach, ANAC123, engine flameout, unable to maintain altitude, descending.",
      "ANAC123, flameout, relight unsuccessful, request immediate landing at Navegantes."
    ],
    "brazilianMistakes": "- ❌ Confusing flameout with engine stall — different mechanisms, same urgency to report.  \n  ✔ Use engine flameout and state whether relight is in progress.\n\n- ❌ Not telling ATC whether restart is being attempted.  \n  ✔ Report attempting relight or negative restart on every update.\n\n- ❌ Using flame out as one vague word without clear engine identification.  \n  ✔ Say engine flameout clearly — two words, standard phraseology.\n\n- ❌ Waiting until restart fails before calling ATC.  \n  ✔ Inform ATC immediately after securing the aircraft, even during relight.",
    "pronunciationCoaching": "**Target Phrase:** Engine Flameout, Attempting Relight\n\n**Pronunciation:** EN-jin FLAME-out, a-TEMPT-ing RE-light\n\n**Word Stress**\n\n- Flameout → FLAME-out (two words)\n- Relight → RE-light (not re-lite)\n- Attempting → a-TEMPT-ing\n\nPractice:\n\nEngine flameout... attempting relight...\n\nTogether:\n\nPan Pan Pan, Florianópolis Approach, ANAC123, engine flameout, attempting relight.\n\nSpeak clearly — controllers need to know if you are recovering or descending.",
    "relatedConcepts": [
      "Engine Failure",
      "Loss of Power",
      "Loss of Thrust",
      "Emergency Landing",
      "Mayday Distress Call",
      "Pan Pan Urgency Call"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Engine Flameout",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Engine Failure and Damage",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0037",
    "id": "0037",
    "displayTerm": "Bird Strike",
    "term": "bird strike",
    "slug": "bird-strike",
    "category": "Emergency",
    "meaningEn": "Bird Strike is a collision between an aircraft and one or more birds during flight.",
    "meaningPt": "Colisão com ave.\n\nImpacto entre a aeronave e uma ou mais aves durante o voo.",
    "whenUsed": "When Bird Strike occurs, the pilot should:",
    "example": "Departure: ANAC123, roger bird strike, say intentions.",
    "sayPhrase": "Departure, ANAC123, we may have had a bird strike after takeoff. We are assessing the situation and would like to level off at three thousand feet while we run the checklist.",
    "icaoQuestion": "What would you report to ATC immediately after a bird strike on takeoff?",
    "icaoSpeakText": "I would report that we may have had a bird strike after takeoff, state that we are assessing the situation, request to level off while we run the checklist, and report any abnormal indications. I would declare Mayday only if damage is confirmed or safe flight is in doubt.",
    "missionBrief": "Today's lesson covers one of the most common wildlife hazards in aviation.\n\nBird Strike means collision between your aircraft and one or more birds.\n\nThe impact may cause engine damage, windscreen damage, or structural concerns — or it may cause no damage at all.\n\nYour first report to ATC should be measured: assess the situation before declaring full distress.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 graded urgency communication.",
    "captainTeaching": "Bird strike is where graded urgency matters most.\n\nBrazilian pilots often jump to Mayday on the first thump.\n\nThe ICAO Delta model teaches cautious language first: we may have had a bird strike, assessing.\n\nMayday comes when damage is confirmed — engine failure, severe vibration, or windscreen penetration.\n\nOn approach, a bird strike on final means go around first, then report.\n\nCongonhas and Santos Dumont have significant bird activity near water and green areas.\n\nState your intentions clearly: level off, return, or continue.\n\nRun the checklist before you make promises to ATC about landing.",
    "operationalContext": "You have just departed Congonhas in your H130 on a charter flight to the coast.\n\nAt five hundred feet, you hear a loud thump on the right side.\n\nEngine parameters look normal, but you feel slight vibration.\n\nYou level off and transmit:\n\nDeparture, ANAC123, we may have had a bird strike after takeoff. We are assessing the situation and would like to level off at three thousand feet while we run the checklist.\n\nDeparture acknowledges and asks you to report any abnormal indications.\n\nAfter the checklist, vibration has stopped. You report no damage and request return to Congonhas for inspection.",
    "sayItCoach": "Departure, ANAC123, we may have had a bird strike after takeoff. We are assessing the situation.",
    "icaoModelAnswer": "I would report that we may have had a bird strike after takeoff, state that we are assessing the situation, request to level off while we run the checklist, and report any abnormal indications. I would declare Mayday only if damage is confirmed or safe flight is in doubt.",
    "memoryTrick": "**BIRD** — **B**rief ATC, **I**nspect engines, **R**un checklist, **D**ecide return or continue.",
    "operationalMeaning": "When Bird Strike occurs, the pilot should:\n\nBird Strike reporting commonly includes:",
    "whyAtcUsesIt": [
      "request intentions: level off, return, or continue",
      "alert following traffic and coordinate runway inspection",
      "provide vectors for return or holding while assessment continues",
      "clear traffic if emergency landing is required",
      "document the event for airport wildlife management"
    ],
    "atcPhraseology": [
      "Departure: ANAC123, roger bird strike, say intentions.",
      "Tower: ANAC123, caution birds in the vicinity of the airport.",
      "Tower: ANAC123, runway inspection in progress.",
      "Tower: ANAC123, cleared to land runway three five left, wind two four zero at one zero.",
      "Departure: ANAC123, report any abnormal indications."
    ],
    "pilotReadbacks": [
      "Departure, ANAC123, we may have had a bird strike after takeoff. We are assessing the situation and would like to level off at three thousand feet while we run the checklist.",
      "Mayday Mayday Mayday, Tower, ANAC123, bird strike, engine vibration increasing.",
      "We had a bird strike on departure.",
      "Tower, ANAC123, bird strike on final, going around.",
      "ANAC123, checklist complete, no damage, continuing."
    ],
    "brazilianMistakes": "- ❌ Declaring Mayday before completing initial assessment.  \n  ✔ Use cautious language first: we may have had a bird strike, assessing.\n\n- ❌ Saying we hit birds only in Portuguese on frequency.  \n  ✔ Use bird strike — the ICAO standard term.\n\n- ❌ Forgetting to state intentions: level off, return, or continue.  \n  ✔ Always tell ATC what you plan to do next.\n\n- ❌ Continuing approach without reporting bird strike on final.  \n  ✔ Go around if needed, then report bird strike and intentions.",
    "pronunciationCoaching": "**Target Phrase:** Bird Strike, Assessing the Situation\n\n**Pronunciation:** BIRD STRIKE, a-SSES-sing the sit-u-A-tion\n\n**Word Stress**\n\n- Bird strike → BIRD STRIKE (equal stress)\n- Assessing → a-SSES-sing\n- Checklist → CHECK-list\n\nPractice:\n\nWe may have had a bird strike...\n\nTogether:\n\nDeparture, ANAC123, we may have had a bird strike after takeoff. We are assessing the situation.\n\nSpeak calmly — urgency without panic shows ICAO Level 4 competence.",
    "relatedConcepts": [
      "Engine Failure",
      "Go Around",
      "Emergency Landing",
      "Mayday Distress Call",
      "Pan Pan Urgency Call",
      "Windscreen Damage"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Bird Hazards",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Bird Strike",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Bird Strike",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0038",
    "id": "0038",
    "displayTerm": "Fire on Board",
    "term": "fire on board",
    "slug": "fire-on-board",
    "category": "Emergency",
    "meaningEn": "Fire on Board is an active fire inside the aircraft structure — cabin, cockpit, or cargo compartment.",
    "meaningPt": "Incêndio a bordo.\n\nFogo ativo no interior da aeronave — cabine, cockpit ou compartimento de carga.",
    "whenUsed": "When Fire on Board occurs, the pilot should:",
    "example": "Approach: ANAC123, descend at your discretion, turn right heading zero six zero.",
    "sayPhrase": "Mayday Mayday Mayday, Manaus Approach, ANAC123, fire in the cabin, request return to Manaus.",
    "icaoQuestion": "What is the difference between fire on board and fire in the cabin when reporting?",
    "icaoSpeakText": "Fire on board is the general emergency declaration. Fire in the cabin specifies the location. I would declare Mayday and state fire in the cabin so ATC knows it is not engine fire. If ATC assumes engine fire, I correct with NEGATIVE and restate the cabin location.",
    "missionBrief": "Today's lesson covers one of the most urgent emergencies in aviation.\n\nFire on Board means fire exists inside the aircraft — cabin, cockpit, or cargo area.\n\nThere is no time for hesitation. Mayday is immediate.\n\nIn your H130, a cabin fire demands descent, landing, and evacuation planning — all while maintaining aircraft control.\n\nYour radio call must be clear, specific, and immediate.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Fire on board is not a Pan Pan situation.\n\nIt is Mayday — three times, immediately, after you have basic aircraft control.\n\nThe most common Brazilian mistake: saying fire in the airplane vaguely.\n\nBe specific: fire in the cabin, fire in the cockpit, fire in the cargo.\n\nThe ICAO Delta exam tests NEGATIVE — when ATC assumes engine fire and you have cabin fire.\n\nDo not accept the wrong assumption. Correct firmly: NEGATIVE, we have fire in the cabin.\n\nIn the H130, cabin fire from passenger equipment or electrical fault is a real scenario.\n\nDescend first. Land fast. Evacuate when stopped.\n\nDo not delay Mayday to finish checklist items below ten thousand feet — you are already below that in a helicopter.",
    "operationalContext": "You are climbing through six thousand feet in your H130 after departure from Manaus.\n\nThe passenger behind you reports smoke and flames near the rear cabin area.\n\nYou don oxygen, declare Mayday, and turn back toward Manaus.\n\nYou transmit:\n\nMayday Mayday Mayday, Manaus Approach, ANAC123, fire in the cabin, request immediate return to Manaus.\n\nApproach clears traffic and asks you to confirm engine fire.\n\nYou respond firmly:\n\nNEGATIVE, we have fire in the cabin. Descending to three thousand feet, ANAC123.\n\nYou complete an emergency landing and evacuate on the runway.",
    "sayItCoach": "Mayday Mayday Mayday, Manaus Approach, ANAC123, fire in the cabin.",
    "icaoModelAnswer": "Fire on board is the general emergency declaration. Fire in the cabin specifies the location. I would declare Mayday and state fire in the cabin so ATC knows it is not engine fire. If ATC assumes engine fire, I correct with NEGATIVE and restate the cabin location.",
    "memoryTrick": "**FIRE** — **F**irst declare Mayday, **I**nform location, **R**equest return, **E**vacuate plan ready.",
    "operationalMeaning": "When Fire on Board occurs, the pilot should:\n\nFire on Board reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear all traffic from the aircraft's route immediately",
      "assign unrestricted descent and vectors to the nearest airport",
      "alert fire and rescue services on the ground",
      "request souls on board and fuel remaining",
      "coordinate emergency landing and evacuation support"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, descend at your discretion, turn right heading zero six zero.",
      "Approach: ANAC123, confirm you have an engine fire.",
      "Tower: ANAC123, runway three six cleared to land, fire services alerted.",
      "Approach: ANAC123, squawk seven seven zero zero.",
      "Approach: ANAC123, say souls on board and fuel remaining."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, Manaus Approach, ANAC123, fire in the cabin, request return to Manaus.",
      "Mayday, we have fire on board.",
      "Emergency, fire in cabin!",
      "NEGATIVE, we have fire in the cabin. Descending to three thousand feet, ANAC123.",
      "Mayday Mayday Mayday, ANAC123, uncontrollable fire, request immediate landing."
    ],
    "brazilianMistakes": "- ❌ Saying fire in the airplane vaguely — no location given.  \n  ✔ Specify cabin, cockpit, or cargo: fire in the cabin.\n\n- ❌ Accepting ATC assumption of engine fire without correction.  \n  ✔ Use NEGATIVE firmly and restate the correct fire location.\n\n- ❌ Delaying Mayday to finish checklist items.  \n  ✔ Declare Mayday immediately after securing basic aircraft control.\n\n- ❌ Using fogo a bordo in English transmission.  \n  ✔ Use fire on board or fire in the cabin — standard ICAO phraseology.",
    "pronunciationCoaching": "**Target Phrase:** Mayday, Fire in the Cabin\n\n**Pronunciation:** MAY-day, FYUR in the CAB-in\n\n**Word Stress**\n\n- Mayday → may-DAY (three times)\n- Cabin → CAB-in\n- NEGATIVE → NEG-a-tive (firm correction)\n\nPractice:\n\nMayday... Mayday... Mayday...\n\nTogether:\n\nMayday Mayday Mayday, Manaus Approach, ANAC123, fire in the cabin.\n\nSpeak with authority — controllers must hear every word clearly.",
    "relatedConcepts": [
      "Smoke in the Cabin",
      "Fumes in the Cabin",
      "Mayday Distress Call",
      "Emergency Landing",
      "Emergency Evacuation",
      "Uncontrollable Fire"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Fire on Board",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — In-Flight Fire",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0039",
    "id": "0039",
    "displayTerm": "Smoke in Cabin",
    "term": "smoke in cabin",
    "slug": "smoke-in-cabin",
    "category": "Emergency",
    "meaningEn": "Smoke in the Cabin is visible smoke present in the passenger cabin or cockpit during flight.",
    "meaningPt": "Fumaça na cabine.\n\nPresença de fumaça visível na cabine de passageiros ou no cockpit durante o voo.",
    "whenUsed": "When Smoke in the Cabin occurs, the pilot should:",
    "example": "Approach: ANAC123, descend immediately, turn left heading two seven zero.",
    "sayPhrase": "Emergency, smoke in the cabin!",
    "icaoQuestion": "When would smoke in the cabin require Mayday versus Pan Pan?",
    "icaoSpeakText": "I would use Pan Pan when smoke is light, source is identified, and I can maintain control. I would use Mayday when smoke is thick, source is unknown, crew is affected, or safe flight is in doubt. I always request immediate descent and vectors to the nearest runway.",
    "missionBrief": "Today's lesson covers a visible and urgent cabin emergency.\n\nSmoke in the Cabin means visible smoke is present in the passenger area or cockpit.\n\nSmoke may indicate fire, electrical fault, or overheating — and it always demands immediate action.\n\nYour urgency call depends on severity: Pan Pan for manageable smoke, Mayday when safe flight is in doubt.\n\nIn your H130, you are never far from the ground — but smoke can incapacitate the crew within minutes.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Smoke in the cabin is not a wait-and-see event.\n\nDon oxygen first. Then descend. Then speak.\n\nBrazilian pilots sometimes say only smoke — controllers need cabin or cockpit.\n\nIf smoke is in the cockpit, say smoke in the cockpit. It changes the urgency picture.\n\nPan Pan works when smoke is light and you have control.\n\nMayday when smoke is thick, source unknown, or crew affected.\n\nThe ICAO Delta Part 3 simulado uses smoke in cockpit with Mayday and vectors — same urgency applies to cabin smoke.\n\nKeep ATC updated: smoke continuing or smoke dissipating.\n\nIn the H130, electrical smoke from avionics or passenger equipment is a realistic scenario over Rio and Guanabara Bay.",
    "operationalContext": "You are cruising at five thousand feet in your H130 on a sightseeing flight near Rio de Janeiro.\n\nA passenger reports grey smoke rising from the floor near the rear seats.\n\nYou don oxygen, begin descent, and transmit:\n\nMayday Mayday Mayday, Rio Approach, ANAC123, smoke in the cabin, request immediate vectors to land on the nearest runway.\n\nApproach clears traffic and vectors you toward Santos Dumont.\n\nAfter checklist action, the smoke begins to dissipate. You update ATC:\n\nANAC123, smoke dissipating, request vectors to Santos Dumont for precautionary landing.",
    "sayItCoach": "Mayday Mayday Mayday, Rio Approach, ANAC123, smoke in the cabin, request immediate vectors to land.",
    "icaoModelAnswer": "I would use Pan Pan when smoke is light, source is identified, and I can maintain control. I would use Mayday when smoke is thick, source is unknown, crew is affected, or safe flight is in doubt. I always request immediate descent and vectors to the nearest runway.",
    "memoryTrick": "**SMOKE** — **S**ource check if safe, **M**ask on oxygen, **O**pen descent, **K**eep ATC informed, **E**xpedite landing.",
    "operationalMeaning": "When Smoke in the Cabin occurs, the pilot should:\n\nSmoke in the Cabin reporting commonly includes:",
    "whyAtcUsesIt": [
      "assign immediate descent and priority vectors",
      "clear traffic from the aircraft's approach path",
      "alert fire and rescue services on the ground",
      "request souls on board and smoke status updates",
      "coordinate emergency landing at the nearest suitable airport"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, descend immediately, turn left heading two seven zero.",
      "Approach: ANAC123, nearest airport one two o'clock, one five miles.",
      "Tower: ANAC123, runway cleared to land, fire services standing by.",
      "Approach: ANAC123, say souls on board.",
      "Approach: ANAC123, report smoke dissipating or continuing."
    ],
    "pilotReadbacks": [
      "Emergency, smoke in the cabin!",
      "We have smoke in the cabin, request immediate descent.",
      "Mayday Mayday Mayday, Approach, ANAC123, smoke in the cockpit, request immediate vectors to land on the nearest runway.",
      "Pan Pan Pan, ANAC123, smoke in the cabin, descending.",
      "ANAC123, smoke dissipating, request vectors to departure airport."
    ],
    "brazilianMistakes": "- ❌ Saying only smoke without specifying cabin or cockpit.  \n  ✔ State smoke in the cabin or smoke in the cockpit clearly.\n\n- ❌ Requesting descent without declaring urgency level.  \n  ✔ Declare Pan Pan or Mayday before requesting immediate descent.\n\n- ❌ Using fumaça in English transmission.  \n  ✔ Use smoke in the cabin — standard ICAO phraseology.\n\n- ❌ Not updating ATC when smoke dissipates or worsens.  \n  ✔ Report smoke dissipating or smoke continuing on every major change.",
    "pronunciationCoaching": "**Target Phrase:** Smoke in the Cabin, Immediate Descent\n\n**Pronunciation:** SMOKE in the CAB-in, im-ME-di-ate de-SCENT\n\n**Word Stress**\n\n- Smoke → SMOKE (one syllable)\n- Immediate → im-ME-di-ate\n- Vectors → VEC-tors\n\nPractice:\n\nSmoke in the cabin... request immediate descent...\n\nTogether:\n\nMayday Mayday Mayday, Rio Approach, ANAC123, smoke in the cabin, request immediate vectors to land.\n\nSpeak steadily — do not rush and lose clarity.",
    "relatedConcepts": [
      "Fire on Board",
      "Fumes in the Cabin",
      "Emergency Landing",
      "Mayday Distress Call",
      "Pan Pan Urgency Call",
      "Emergency Evacuation"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Smoke",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — In-Flight Fire",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0040",
    "id": "0040",
    "displayTerm": "Fumes in Cabin",
    "term": "fumes in cabin",
    "slug": "fumes-in-cabin",
    "category": "Emergency",
    "meaningEn": "Fumes in the Cabin are unidentified vapours or odours in the cabin or cockpit without visible smoke.",
    "meaningPt": "Vapores na cabine.\n\nOdores ou vapores não identificados na cabine ou cockpit, sem fumaça visível.",
    "whenUsed": "When Fumes in the Cabin occurs, the pilot should:",
    "example": "Approach: ANAC123, descend to four thousand, report fumes status.",
    "sayPhrase": "Pan Pan Pan, strong fumes in the cockpit!",
    "icaoQuestion": "How are fumes different from smoke in your report to ATC?",
    "icaoSpeakText": "Smoke means visible smoke in the cabin or cockpit. Fumes mean smell or vapour without visible smoke. I report fumes in the cockpit or fumes in the cabin specifically. Fumes can be as dangerous as smoke because they can incapacitate the crew before smoke appears.",
    "missionBrief": "Today's lesson covers an invisible but dangerous cabin emergency.\n\nFumes in the Cabin means unidentified vapours or smells without visible smoke.\n\nOil fumes, electrical odours, and unknown smells can incapacitate the crew before you see any smoke.\n\nThis is different from smoke in the cabin — and your report must reflect that distinction.\n\nPan Pan is often appropriate initially, but strong fumes demand immediate action.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Fumes versus smoke — know the difference.\n\nSmoke is visible. Fumes are smell and vapour without visible smoke.\n\nBrazilian pilots say smell bad or cheiro estranho on frequency.\n\nUse fumes in the cockpit or fumes in the cabin — standard ICAO words.\n\nThe Students material uses Pan Pan for strong fumes in the cockpit.\n\nThat is correct — but do not underestimate fumes.\n\nOil fumes from engine bleed air or electrical faults can incapacitate you in minutes.\n\nDon oxygen first. Then report.\n\nIf fumes worsen, upgrade to immediate landing without waiting for visible smoke.\n\nIn the H130, hydraulic or engine oil fumes entering the cabin through ventilation are a documented risk.\n\nSpecify cockpit versus cabin — the location tells ATC how impaired the flying pilot may be.",
    "operationalContext": "You are at six thousand feet in your H130 on a corporate flight from Brasília to Goiânia.\n\nA strong oily smell fills the cockpit. No visible smoke — but your eyes begin to water.\n\nYou don oxygen and transmit:\n\nPan Pan Pan, Brasília Approach, ANAC123, strong fumes in the cockpit, request descent to four thousand feet.\n\nApproach assigns descent and asks you to report fumes status.\n\nThe smell intensifies. You upgrade your request:\n\nANAC123, fumes increasing, request immediate landing at Brasília.\n\nYou land safely and request medical evaluation for the crew.",
    "sayItCoach": "Pan Pan Pan, Brasília Approach, ANAC123, strong fumes in the cockpit, request descent.",
    "icaoModelAnswer": "Smoke means visible smoke in the cabin or cockpit. Fumes mean smell or vapour without visible smoke. I report fumes in the cockpit or fumes in the cabin specifically. Fumes can be as dangerous as smoke because they can incapacitate the crew before smoke appears.",
    "memoryTrick": "**FUMES** — **F**ind source if safe, **U**se oxygen, **M**onitor crew, **E**xpedite if worsening, **S**ay status to ATC.",
    "operationalMeaning": "When Fumes in the Cabin occurs, the pilot should:\n\nFumes in the Cabin reporting commonly includes:",
    "whyAtcUsesIt": [
      "assign descent and priority vectors",
      "coordinate medical support on arrival if crew is affected",
      "request fumes status updates during descent",
      "clear traffic for priority approach",
      "alert ground services for possible incapacitation"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, descend to four thousand, report fumes status.",
      "Approach: ANAC123, turn right direct Brasília.",
      "Tower: ANAC123, medical advice available on arrival.",
      "Approach: ANAC123, say number of crew affected.",
      "Tower: ANAC123, cleared priority approach runway one one left."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan, strong fumes in the cockpit!",
      "We smell fumes in the cockpit.",
      "Pan Pan Pan, ANAC123, fumes in the cabin, request descent.",
      "ANAC123, fumes increasing, request immediate landing.",
      "ANAC123, fumes dissipated, continuing with caution."
    ],
    "brazilianMistakes": "- ❌ Saying smell bad instead of fumes or unknown odour.  \n  ✔ Use fumes in the cockpit or fumes in the cabin.\n\n- ❌ Underestimating fumes — treating them as minor discomfort.  \n  ✔ Don oxygen and request descent — oil fumes can incapacitate crew.\n\n- ❌ Not mentioning cockpit versus cabin location.  \n  ✔ Specify where fumes are detected — cockpit or cabin.\n\n- ❌ Waiting for visible smoke before declaring urgency.  \n  ✔ Report strong fumes with Pan Pan and upgrade if worsening.",
    "pronunciationCoaching": "**Target Phrase:** Strong Fumes in the Cockpit\n\n**Pronunciation:** STRONG FYOOMZ in the COCK-pit\n\n**Word Stress**\n\n- Fumes → FYOOMZ (one syllable)\n- Cockpit → COCK-pit\n- Odour → OH-dur\n\nPractice:\n\nPan Pan Pan... strong fumes in the cockpit...\n\nTogether:\n\nPan Pan Pan, Brasília Approach, ANAC123, strong fumes in the cockpit, request descent.\n\nSpeak clearly — fumes are invisible, so your words carry the urgency.",
    "relatedConcepts": [
      "Smoke in the Cabin",
      "Fire on Board",
      "Pilot Incapacitation",
      "Pan Pan Urgency Call",
      "Emergency Landing",
      "Cabin Air Quality"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Fumes",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Fumes and Smoke",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0041",
    "id": "0041",
    "displayTerm": "Emergency Landing",
    "term": "emergency landing",
    "slug": "emergency-landing",
    "category": "Emergency",
    "meaningEn": "Emergency Landing is a landing made when the safety of the aircraft or its occupants is at serious and immediate risk.",
    "meaningPt": "Pouso de emergência.\n\nPouso realizado quando a segurança da aeronave ou dos ocupantes está em risco sério e imediato.",
    "whenUsed": "When Emergency Landing is required, the pilot should:",
    "example": "Tower: ANAC123, cleared straight-in approach runway one eight.",
    "sayPhrase": "Executing emergency landing!",
    "icaoQuestion": "What would you request from ATC when you need an emergency landing?",
    "icaoSpeakText": "I would declare Mayday or Pan Pan for the underlying emergency, state that I am performing an emergency landing, request the nearest suitable airport, and request the longest available runway if gear status is uncertain. I would provide position, souls on board, and fuel remaining when requested.",
    "missionBrief": "Today's lesson covers the phraseology for one of aviation's most serious decisions.\n\nEmergency Landing means landing when the safety of the aircraft or occupants is at serious and immediate risk.\n\nThis is not a normal diversion. It is a declaration of intent to land immediately because continuing flight is unsafe.\n\nYour radio call must pair emergency landing with the underlying problem — fire, engine failure, gear malfunction.\n\nIn your H130, emergency landing may mean a field, a highway, or the nearest airport — but ATC must know your intention.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Emergency landing is an execution phrase — it tells ATC you are landing now, not later.\n\nBrazilian pilots often say emergency landing without stating why.\n\nAlways pair it with the underlying event: emergency landing due to engine failure, emergency landing due to fire in the cabin.\n\nThe ICAO Delta Students material uses executing emergency landing and performing emergency landing.\n\nBoth are correct. Speak with confidence.\n\nFor fixed-wing aircraft, longest available runway matters when gear status is uncertain.\n\nIn the H130, you may land on any suitable area — but still inform ATC of your intention clearly.\n\nDo not confuse emergency landing with go-around. Go-around means you are climbing away. Emergency landing means you are landing now.",
    "operationalContext": "You declared Mayday after engine failure in your H130 near Salvador.\n\nAutorotation is not required — you have partial power but safe flight is in doubt.\n\nYou are five miles from Salvador International and transmit:\n\nANAC123, one five miles final, performing emergency landing, engine failure.\n\nTower clears all traffic and alerts emergency services.\n\nYou request the longest available runway:\n\nANAC123, requesting the longest available runway for emergency landing.\n\nTower clears you to land runway one zero with fire services standing by.\n\nYou complete a safe emergency landing and report all souls safe on the ground.",
    "sayItCoach": "ANAC123, one five miles final, performing emergency landing, engine failure.",
    "icaoModelAnswer": "I would declare Mayday or Pan Pan for the underlying emergency, state that I am performing an emergency landing, request the nearest suitable airport, and request the longest available runway if gear status is uncertain. I would provide position, souls on board, and fuel remaining when requested.",
    "memoryTrick": "**LAND SAFE** — **L**ocate airport, **A**nnounce emergency, **N**otify services, **D**escend, **S**ecure approach, **A**pproach brief, **F**inal call, **E**vacuate if needed.",
    "operationalMeaning": "When Emergency Landing is required, the pilot should:\n\nEmergency Landing reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear the nearest runway immediately",
      "alert fire, rescue, and medical services",
      "provide straight-in approaches and priority handling",
      "advise on longest available runway when requested",
      "clear all traffic from the approach path"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, cleared straight-in approach runway one eight.",
      "Tower: ANAC123, runway three six cleared to land, fire services alerted.",
      "Approach: ANAC123, say intentions for landing.",
      "Tower: ANAC123, longest runway available is runway two seven.",
      "Tower: ANAC123, emergency services standing by."
    ],
    "pilotReadbacks": [
      "Executing emergency landing!",
      "Performing emergency landing!",
      "We need an emergency landing at the nearest airport.",
      "Requesting the longest available runway for emergency landing.",
      "ANAC123, one five miles final, emergency landing inbound."
    ],
    "brazilianMistakes": "- ❌ Saying emergency landing without stating the underlying problem.  \n  ✔ Pair with the event: emergency landing due to engine failure.\n\n- ❌ Confusing emergency landing with go-around.  \n  ✔ Go-around means climbing away; emergency landing means landing now.\n\n- ❌ Not requesting longest runway when gear status is uncertain.  \n  ✔ Request the longest available runway for emergency landing.\n\n- ❌ Using pouso de emergência in English transmission.  \n  ✔ Use emergency landing or performing emergency landing.",
    "pronunciationCoaching": "**Target Phrase:** Performing Emergency Landing\n\n**Pronunciation:** per-FORM-ing e-MER-gen-cy LAN-ding\n\n**Word Stress**\n\n- Emergency → e-MER-gen-cy\n- Landing → LAN-ding\n- Longest available runway → speak slowly, word by word\n\nPractice:\n\nPerforming... emergency landing...\n\nTogether:\n\nANAC123, one five miles final, performing emergency landing, engine failure.\n\nSpeak with authority — ATC must sequence traffic and services immediately.",
    "relatedConcepts": [
      "Mayday Distress Call",
      "Precautionary Landing",
      "Priority Landing",
      "Engine Failure",
      "Fire on Board",
      "Emergency Services"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Emergency Landing",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Emergency Landing",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0042",
    "id": "0042",
    "displayTerm": "Precautionary Landing",
    "term": "precautionary landing",
    "slug": "precautionary-landing",
    "category": "Emergency",
    "meaningEn": "Precautionary Landing is a landing made when a potential emergency exists but immediate danger to the aircraft or occupants is not yet confirmed.",
    "meaningPt": "Pouso precautório.\n\nPouso realizado quando existe uma possível emergência, mas o perigo imediato ainda não está confirmado.",
    "whenUsed": "When Precautionary Landing is appropriate, the pilot should:",
    "example": "Approach: ANAC123, roger precautionary landing, say nature of the problem.",
    "sayPhrase": "Pan Pan Pan, ANAC123, abnormal vibration, requesting precautionary landing for inspection.",
    "icaoQuestion": "What is the difference between precautionary and emergency landing?",
    "icaoSpeakText": "Emergency landing is when safety of the aircraft or occupants is at serious and immediate risk. Precautionary landing is when a potential problem exists but immediate danger is not confirmed. I use precautionary landing to inspect the aircraft on the ground, and emergency landing when I must land immediately due to distress.",
    "missionBrief": "Today's lesson covers a critical distinction that many pilots confuse.\n\nPrecautionary Landing means landing when a potential emergency exists, but immediate danger is not yet confirmed.\n\nThis is less urgent than emergency landing — you are choosing to land to inspect a problem on the ground.\n\nYou may use Pan Pan or simply inform ATC of your intention without declaring full distress.\n\nIn your H130, a precautionary landing might follow unusual vibration, a doubtful indication, or a bird strike assessment with no confirmed damage.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Precautionary landing is the concept many Brazilian pilots do not know in English.\n\nThey use emergency landing for every abnormal indication.\n\nThat is wrong — and it triggers full emergency response when you may not need it.\n\nPrecautionary landing means: I am not in immediate danger, but I want to land and check.\n\nEmergency landing means: I am landing now because safety is at serious risk.\n\nThe distinction matters for ATC resource allocation and for your ICAO exam.\n\nAfter a bird strike with no confirmed damage but lingering doubt — precautionary landing.\n\nWith doubtful gear indication but stable approach — precautionary landing.\n\nWith fire in the cabin — that is emergency landing, not precautionary.\n\nIn the H130, you have the flexibility to land at many suitable areas — but still use the correct phraseology.",
    "operationalContext": "You completed a bird strike checklist in your H130 after departure from Belo Horizonte.\n\nNo engine damage confirmed, but you feel slight airframe vibration that was not present before.\n\nYou decide to land and inspect rather than continue to your destination.\n\nYou transmit:\n\nPan Pan Pan, Belo Horizonte Approach, ANAC123, abnormal vibration after bird strike assessment, requesting precautionary landing at Belo Horizonte to inspect the aircraft.\n\nApproach asks you to say the nature of the problem and assigns vectors.\n\nYou land, inspect, find minor fan blade damage, and report to maintenance.\n\nNo Mayday was required — but the precautionary landing was the right decision.",
    "sayItCoach": "Pan Pan Pan, Belo Horizonte Approach, ANAC123, requesting precautionary landing to inspect the aircraft.",
    "icaoModelAnswer": "Emergency landing is when safety of the aircraft or occupants is at serious and immediate risk. Precautionary landing is when a potential problem exists but immediate danger is not confirmed. I use precautionary landing to inspect the aircraft on the ground, and emergency landing when I must land immediately due to distress.",
    "memoryTrick": "**CHECK** — **C**oncern identified, **H**ead to suitable airport, **E**xplain to ATC, **C**onfirm no immediate danger, **K**eep inspecting on the ground.",
    "operationalMeaning": "When Precautionary Landing is appropriate, the pilot should:\n\nPrecautionary Landing reporting commonly includes:",
    "whyAtcUsesIt": [
      "provide vectors to a suitable airport",
      "assign landing sequence without full emergency alert unless requested",
      "ask for the nature of the problem",
      "coordinate ground inspection support if requested",
      "maintain normal traffic flow when no distress is declared"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, roger precautionary landing, say nature of the problem.",
      "Approach: ANAC123, nearest airport twelve o'clock, one zero miles.",
      "Tower: ANAC123, cleared to land runway three zero, emergency services not required unless requested.",
      "Approach: ANAC123, maintain present altitude, say when ready for vectors.",
      "Tower: ANAC123, report gear down and locked."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan, ANAC123, abnormal vibration, requesting precautionary landing for inspection.",
      "Approach, ANAC123, precautionary landing inbound, gear indication uncertain.",
      "ANAC123, we would like to make a precautionary landing and inspect the aircraft on the ground.",
      "ANAC123, no emergency declared, precautionary landing to verify indications.",
      "ANAC123, bird strike assessment complete, requesting precautionary landing at Belo Horizonte."
    ],
    "brazilianMistakes": "- ❌ Using emergency landing for every abnormal indication.  \n  ✔ Use precautionary landing when you need to inspect, not when in immediate danger.\n\n- ❌ Not knowing the precautionary landing concept in English.  \n  ✔ Learn and use precautionary landing — it is an ICAO exam concept.\n\n- ❌ Declaring Mayday for a precautionary landing.  \n  ✔ Use Pan Pan or simply inform ATC — Mayday is for confirmed distress.\n\n- ❌ Confusing precautionary landing with normal diversion.  \n  ✔ Precautionary landing implies an abnormal condition requiring ground inspection.",
    "pronunciationCoaching": "**Target Phrase:** Precautionary Landing\n\n**Pronunciation:** pre-CAU-tion-ar-y LAN-ding\n\n**Word Stress**\n\n- Precautionary → pre-CAU-tion-ar-y (five syllables)\n- Inspection → in-SPEC-tion\n- Indication → in-di-CA-tion\n\nPractice:\n\nPrecautionary... landing...\n\nTogether:\n\nPan Pan Pan, Belo Horizonte Approach, ANAC123, requesting precautionary landing to inspect the aircraft.\n\nSpeak the five syllables clearly — examiners listen for this word.",
    "relatedConcepts": [
      "Emergency Landing",
      "Bird Strike",
      "Landing Gear Malfunction",
      "Pan Pan Urgency Call",
      "Abnormal Indication",
      "Diversion"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Precautionary Landing",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "SKYbrary — Emergency Landing",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0043",
    "id": "0043",
    "displayTerm": "Low Fuel",
    "term": "low fuel",
    "slug": "low-fuel",
    "category": "Emergency",
    "meaningEn": "Low Fuel is a fuel state where quantity is below planned reserves or minimum required for destination plus reserve.",
    "meaningPt": "Combustível baixo.\n\nQuantidade de combustível abaixo das reservas planejadas ou do mínimo necessário para destino mais reserva.",
    "whenUsed": "When Low Fuel occurs, the pilot should:",
    "example": "Approach: ANAC123, exit hold now heading one three five, expect vectors to intercept final.",
    "sayPhrase": "Pan Pan Pan, low fuel state!",
    "icaoQuestion": "What is the difference between low fuel and fuel starvation?",
    "icaoSpeakText": "Low fuel means fuel quantity is below reserves but fuel is still reaching the engine. Fuel starvation means fuel may be in the tanks but is not reaching the engine due to a delivery problem. Low fuel uses Pan Pan. Fuel starvation may require Mayday if engines are affected.",
    "missionBrief": "Today's lesson covers a fuel urgency that every pilot must communicate clearly.\n\nLow Fuel means your fuel quantity is below planned reserves or minimum required for destination plus reserve.\n\nThis is not fuel starvation — fuel is reaching the engine, but you do not have enough to continue safely.\n\nPan Pan is the standard urgency call. You must state fuel remaining in time, not just quantity.\n\nIn your H130, fuel margins on long cross-country flights over Brazil require careful planning and honest reporting.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Low fuel is one of the most tested scenarios in ICAO Delta exams.\n\nThe Heathrow 24C scenario is essential: Pan Pan, land in fifteen minutes, NEGATIVE to fifty minutes.\n\nBrazilian pilots say no fuel or sem combustível — that sounds like empty tanks.\n\nLow fuel means urgency, not zero fuel. You still have fuel — just not enough.\n\nReport time remaining: three zero minutes, one five minutes.\n\nUse digits for clarity: one five minutes, not fifteen minutes casually spoken.\n\nIf ATC offers a hold extension you cannot accept, say NEGATIVE immediately.\n\nDo not be polite when your fuel clock is running.\n\nIn the H130, monitor fuel on every cross-country leg over the Amazon and central Brazil — diversion options are limited.",
    "operationalContext": "You are holding at four thousand feet near Guarulhos in your H130 due to weather at your destination.\n\nYour fuel calculation shows thirty minutes remaining — not enough for extended holding.\n\nYou transmit:\n\nPan Pan Pan, São Paulo Approach, ANAC123, we are running low on fuel and need to land within one five minutes.\n\nApproach offers to keep you in hold for five zero minutes.\n\nYou respond firmly:\n\nNEGATIVE. I need to land in one five minutes. Request exit from hold and vectors to Guarulhos, ANAC123.\n\nApproach clears you direct and sequences you number one for landing.\n\nYou land with twenty minutes fuel remaining.",
    "sayItCoach": "Pan Pan Pan, São Paulo Approach, ANAC123, we are running low on fuel and need to land within one five minutes.",
    "icaoModelAnswer": "Low fuel means fuel quantity is below reserves but fuel is still reaching the engine. Fuel starvation means fuel may be in the tanks but is not reaching the engine due to a delivery problem. Low fuel uses Pan Pan. Fuel starvation may require Mayday if engines are affected.",
    "memoryTrick": "**FUEL** — **F**igure time remaining, **U**rgency with Pan Pan, **E**xplain landing time, **L**and soon.",
    "operationalMeaning": "When Low Fuel occurs, the pilot should:\n\nLow Fuel reporting commonly includes:",
    "whyAtcUsesIt": [
      "expedite approach and clear holding",
      "assign direct routing to the nearest suitable airport",
      "confirm landing time requirements",
      "clear other traffic for priority landing",
      "request fuel remaining in hours and minutes"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, exit hold now heading one three five, expect vectors to intercept final.",
      "Approach: ANAC123, confirm you need to land in five zero minutes.",
      "Approach: ANAC123, cleared direct to the airport.",
      "Tower: ANAC123, number one for landing.",
      "Approach: ANAC123, say fuel remaining in hours."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan, low fuel state!",
      "Pan Pan Pan, São Paulo Approach, ANAC123, we are running low on fuel and need to land within one five minutes.",
      "We are low on fuel and need priority.",
      "NEGATIVE. I need to land in one five minutes. Exiting hold heading one three five, ANAC123.",
      "ANAC123, three zero minutes fuel remaining."
    ],
    "brazilianMistakes": "- ❌ Saying no fuel instead of low fuel — sounds like empty tanks.  \n  ✔ Use low fuel state — urgency, not zero quantity.\n\n- ❌ Accepting hold extension when fuel is critical.  \n  ✔ Use NEGATIVE firmly and state your maximum landing time.\n\n- ❌ Reporting fuel only in kilograms without time remaining.  \n  ✔ Report fuel remaining in hours and minutes.\n\n- ❌ Waiting until minimum fuel before declaring urgency.  \n  ✔ Declare Pan Pan when reserves are below comfort level.",
    "pronunciationCoaching": "**Target Phrase:** Pan Pan, Low Fuel State\n\n**Pronunciation:** PAN PAN, LOW FYOO-el STATE\n\n**Word Stress**\n\n- Low fuel → LOW FYOO-el\n- One five minutes → digits, not fifteen\n- Fuel remaining → FUEL re-MAIN-ing\n\nPractice:\n\nPan Pan Pan... low fuel state...\n\nTogether:\n\nPan Pan Pan, São Paulo Approach, ANAC123, we are running low on fuel and need to land within one five minutes.\n\nSpeak time in digits — controllers record numbers, not words.",
    "relatedConcepts": [
      "Fuel Starvation",
      "Fuel Dumping",
      "Pan Pan Urgency Call",
      "Priority Landing",
      "Emergency Landing",
      "Minimum Fuel"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Fuel Emergencies",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Minimum Fuel",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Fuel Emergencies",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0044",
    "id": "0044",
    "displayTerm": "Fuel Starvation",
    "term": "fuel starvation",
    "slug": "fuel-starvation",
    "category": "Emergency",
    "meaningEn": "Fuel Starvation is a condition where engines are starved of fuel despite fuel possibly remaining in the tanks — a fuel delivery failure.",
    "meaningPt": "Inanição de combustível.\n\nOs motores ficam sem combustível apesar de haver combustível nos tanques — falha no sistema de alimentação.",
    "whenUsed": "When Fuel Starvation occurs, the pilot should:",
    "example": "Approach: ANAC123, descend immediately, vectors to the field.",
    "sayPhrase": "Mayday Mayday Mayday, fuel starvation imminent!",
    "icaoQuestion": "How is fuel starvation different from low fuel?",
    "icaoSpeakText": "Low fuel means fuel quantity is below reserves but fuel reaches the engine. Fuel starvation means fuel is in the tanks but not reaching the engine due to a delivery problem such as selector error or blockage. I use Pan Pan for low fuel and Mayday for fuel starvation when engines are affected.",
    "missionBrief": "Today's lesson covers a technical fuel emergency that many pilots confuse with low fuel.\n\nFuel Starvation means the engines are starved of fuel despite fuel possibly remaining in the tanks.\n\nThe fuel is on board — but it is not reaching the engine due to selector error, crossfeed issue, or blockage.\n\nThis is a delivery failure, not a quantity problem. Mayday may be required if engines are affected.\n\nIn your H130, a fuel selector misconfiguration can cause starvation with full tanks showing on the gauge.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Fuel starvation versus low fuel — know the difference cold.\n\nLow fuel: not enough quantity, fuel is reaching the engine. Pan Pan.\n\nFuel starvation: fuel on board, not reaching the engine. Mayday if engines affected.\n\nBrazilian pilots say no fuel when they mean starvation — that confuses ATC.\n\nSay fuel starvation — it tells ATC the gauges may show fuel but engines are dying.\n\nAttempt the fuel system checklist before or during your first transmission if possible.\n\nReport selector changes and engine restart status.\n\nIn the H130, fuel selector misconfiguration after maintenance or tank switching is a documented risk.\n\nTechnical precision on the radio helps ATC understand why your gauges do not match your emergency.",
    "operationalContext": "You are cruising at three thousand five hundred feet in your H130 near Porto Alegre.\n\nBoth engine parameters fluctuate. Fuel gauges show adequate quantity — but power is dropping.\n\nYou run the fuel system checklist and find the selector in the wrong position.\n\nYou correct it, but engine one does not recover immediately.\n\nYou transmit:\n\nMayday Mayday Mayday, Porto Alegre Approach, ANAC123, fuel starvation, both engines fluctuating, request immediate vectors to the field.\n\nApproach clears traffic and vectors you toward the airport.\n\nAfter selector correction, engine one relights. You report:\n\nANAC123, engine one relit after fuel selector change, single engine, continuing to Porto Alegre.",
    "sayItCoach": "Mayday Mayday Mayday, Porto Alegre Approach, ANAC123, fuel starvation imminent.",
    "icaoModelAnswer": "Low fuel means fuel quantity is below reserves but fuel reaches the engine. Fuel starvation means fuel is in the tanks but not reaching the engine due to a delivery problem such as selector error or blockage. I use Pan Pan for low fuel and Mayday for fuel starvation when engines are affected.",
    "memoryTrick": "**STARVE** — **S**elector check, **T**ell ATC Mayday if needed, **A**ssess gauges, **R**emain calm, **V**erify crossfeed, **E**xpedite landing.",
    "operationalMeaning": "When Fuel Starvation occurs, the pilot should:\n\nFuel Starvation reporting commonly includes:",
    "whyAtcUsesIt": [
      "provide immediate vectors to the nearest suitable airport",
      "clear all traffic from the approach path",
      "assign any runway for landing",
      "request souls on board and fuel status",
      "alert fire services for possible forced landing"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, descend immediately, vectors to the field.",
      "Tower: ANAC123, runway cleared to land any runway.",
      "Approach: ANAC123, say souls on board.",
      "Approach: ANAC123, all traffic cleared from your approach path.",
      "Tower: ANAC123, fire services on standby."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, fuel starvation imminent!",
      "We suspect fuel starvation on engine two.",
      "Mayday Mayday Mayday, ANAC123, fuel starvation, both engines fluctuating.",
      "ANAC123, engine one relit after fuel selector change.",
      "ANAC123, single engine, continuing to nearest airport."
    ],
    "brazilianMistakes": "- ❌ Confusing fuel starvation with low fuel.  \n  ✔ Use fuel starvation when delivery fails despite fuel on board.\n\n- ❌ Saying no fuel when starvation is the technical issue.  \n  ✔ Report fuel starvation — gauges may still show quantity.\n\n- ❌ Not attempting fuel system checklist before declaring.  \n  ✔ Run checklist and report actions taken to ATC.\n\n- ❌ Not reporting engine restart status after correction.  \n  ✔ Report engine relit or negative restart after selector change.",
    "pronunciationCoaching": "**Target Phrase:** Fuel Starvation Imminent\n\n**Pronunciation:** FYOO-el star-VA-tion IM-i-nent\n\n**Word Stress**\n\n- Starvation → star-VA-tion (four syllables)\n- Imminent → IM-i-nent\n- Selector → SE-lec-tor\n\nPractice:\n\nFuel starvation... imminent...\n\nTogether:\n\nMayday Mayday Mayday, Porto Alegre Approach, ANAC123, fuel starvation imminent.\n\nSpeak the technical term clearly — examiners test this distinction.",
    "relatedConcepts": [
      "Low Fuel",
      "Engine Failure",
      "Mayday Distress Call",
      "Emergency Landing",
      "Loss of Power",
      "Fuel System Malfunction"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Fuel Emergencies",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Fuel Starvation",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Fuel Emergencies",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0045",
    "id": "0045",
    "displayTerm": "Fuel Dumping",
    "term": "fuel dumping",
    "slug": "fuel-dumping",
    "category": "Emergency",
    "meaningEn": "Fuel Dumping is the intentional release of fuel from an aircraft to reduce weight for a safe landing.",
    "meaningPt": "Descarte de combustível.\n\nLiberação intencional de combustível para reduzir o peso da aeronave para pouso seguro.",
    "whenUsed": "When Fuel Dumping is required, the crew should:",
    "example": "Departure: ANAC123, cleared to dump fuel between flight level one zero zero and flight level one five zero.",
    "sayPhrase": "Mayday Mayday Mayday, requesting fuel dump!",
    "icaoQuestion": "What would you request from ATC before starting fuel dump?",
    "icaoSpeakText": "I would declare Mayday or Pan Pan for the underlying emergency, request a fuel dumping area and altitude, and wait for ATC to clear traffic before starting. I would report fuel dumping complete before requesting descent to land.",
    "missionBrief": "Today's lesson covers intentional fuel release — a procedure common on fixed-wing aircraft but rare in helicopters.\n\nFuel Dumping means deliberately releasing fuel to reduce landing weight below maximum landing weight.\n\nLarge jets use jettison systems after emergency takeoff or early return with full tanks.\n\nThe H130 does not have a fuel jettison system — helicopters rarely dump fuel.\n\nBut ICAO phraseology for fuel dumping appears on exams, and you must understand the fixed-wing context.\n\nThis lesson prepares you for ICAO Part 2 vocabulary and Part 3 emergency communication.",
    "captainTeaching": "Fuel dumping is fixed-wing territory.\n\nThe H130 has no jettison valves. You cannot dump fuel in a helicopter.\n\nBut the ICAO Delta exam tests this phraseology — know it even if you never use it in the H130.\n\nLarge jets departing Guarulhos or Galeão with full tanks may need to dump after early return.\n\nThe sequence: declare emergency, request fuel dumping area, wait for ATC clearance, dump in assigned block, report complete, then descend.\n\nNever dump without ATC clearance — other aircraft may be below you.\n\nThe related concept for helicopters is fuel burn in holding — circling to reduce weight, not jettisoning.\n\nThe Bogota cabin pressure scenario uses hold to burn fuel — different procedure, same goal: reduce weight for landing.\n\nFor your exam, know requesting fuel dump and fuel dumping complete.\n\nFor your H130 career, know that you will land overweight if needed — helicopters handle it differently.",
    "operationalContext": "You are training on ICAO phraseology in a fixed-wing simulator scenario based on a departure from Guarulhos.\n\nShortly after takeoff, the aircraft must return due to a cabin pressurization issue with full fuel tanks — overweight for landing.\n\nThe captain transmits:\n\nMayday Mayday Mayday, São Paulo Departure, ANAC123, requesting fuel dump before return to Guarulhos.\n\nDeparture assigns a fuel dumping area between flight level one zero zero and flight level one five zero.\n\nAfter fifteen minutes, the captain reports:\n\nANAC123, fuel dumping complete, request descent to Guarulhos.\n\nIn your H130 operations, you would never perform this procedure — but you may hear it on frequency near major airports.",
    "sayItCoach": "Mayday Mayday Mayday, São Paulo Departure, ANAC123, requesting fuel dump before return.",
    "icaoModelAnswer": "I would declare Mayday or Pan Pan for the underlying emergency, request a fuel dumping area and altitude, and wait for ATC to clear traffic before starting. I would report fuel dumping complete before requesting descent to land.",
    "memoryTrick": "**DUMP** — **D**eclare need, **U**se assigned area, **M**onitor weight, **P**roceed to land, report com**P**lete to ATC.",
    "operationalMeaning": "When Fuel Dumping is required, the crew should:\n\nFuel Dumping reporting commonly includes:",
    "whyAtcUsesIt": [
      "assign a designated fuel dumping area and altitude block",
      "clear traffic from the dumping area",
      "notify other aircraft in the vicinity",
      "monitor progress and request dump complete report",
      "clear the aircraft to descend and land after dump is complete"
    ],
    "atcPhraseology": [
      "Departure: ANAC123, cleared to dump fuel between flight level one zero zero and flight level one five zero.",
      "Departure: ANAC123, report fuel dumping complete.",
      "Departure: ANAC123, traffic cleared from your area.",
      "Approach: ANAC123, descend when able after dump complete.",
      "Tower: ANAC123, runway cleared to land when ready."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, requesting fuel dump!",
      "Requesting fuel dumping area!",
      "We need to dump fuel before returning.",
      "ANAC123, fuel dumping complete, request descent.",
      "Pan Pan Pan, ANAC123, need to dump fuel before overweight landing."
    ],
    "brazilianMistakes": "- ❌ Not informing ATC before dumping — ATC must clear traffic.  \n  ✔ Request fuel dumping area and wait for clearance.\n\n- ❌ Saying throw fuel instead of dump fuel.  \n  ✔ Use dump fuel or fuel dumping — standard ICAO phraseology.\n\n- ❌ Forgetting to report dump complete before descent.  \n  ✔ Report fuel dumping complete, then request descent.\n\n- ❌ Assuming helicopters dump fuel like jets.  \n  ✔ Know the H130 has no jettison system — this is fixed-wing phraseology.",
    "pronunciationCoaching": "**Target Phrase:** Requesting Fuel Dump\n\n**Pronunciation:** re-QUEST-ing FYOO-el DUMP\n\n**Word Stress**\n\n- Dumping → DUMP-ing\n- Overweight → O-ver-weight\n- Complete → com-PLETE\n\nPractice:\n\nRequesting... fuel dump...\n\nTogether:\n\nMayday Mayday Mayday, São Paulo Departure, ANAC123, requesting fuel dump before return.\n\nSpeak clearly — this phraseology is tested even for helicopter pilots.",
    "relatedConcepts": [
      "Low Fuel",
      "Emergency Landing",
      "Cabin Depressurization",
      "Mayday Distress Call",
      "Overweight Landing",
      "Pan Pan Urgency Call"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Fuel Dumping",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Fuel Dumping Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Fuel Dumping",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Fuel Dumping",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0046",
    "id": "0046",
    "displayTerm": "Hydraulic Failure",
    "term": "hydraulic failure",
    "slug": "hydraulic-failure",
    "category": "Aircraft Systems",
    "meaningEn": "Hydraulic Failure is the loss of hydraulic pressure or fluid, affecting aircraft systems that depend on hydraulic power.",
    "meaningPt": "Falha hidráulica.\n\nPerda de pressão ou fluido hidráulico, afetando sistemas que dependem de energia hidráulica.",
    "whenUsed": "When Hydraulic Failure occurs, the pilot should:",
    "example": "Approach: ANAC123, roger Pan Pan, say nature of hydraulic problem and souls on board.",
    "sayPhrase": "Pan Pan Pan Pan, Navegantes Approach, ANAC123, hydraulic pressure decreasing.",
    "icaoQuestion": "What would you tell ATC if you noticed hydraulic pressure dropping during cruise?",
    "icaoSpeakText": "After securing the aircraft, I would declare Pan Pan Pan Pan, state my callsign, report hydraulic pressure decreasing or hydraulic failure, state my position, and request vectors to the nearest suitable airport. I would upgrade to Mayday if control becomes seriously degraded. I would provide souls on board and fuel remaining when ATC requests.",
    "missionBrief": "Today's lesson covers a critical aircraft systems emergency.\n\nHydraulic Failure means the hydraulic system has lost pressure or fluid — reducing or eliminating control assistance, landing gear operation, or other hydraulically powered functions.\n\nIn the H130, hydraulic systems support flight controls and other critical components.\n\nA total hydraulic failure can make the aircraft difficult to control and may require an immediate precautionary landing.\n\nYou must aviate first, then assess severity, then communicate with the correct urgency call.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Hydraulic failure is not always immediate catastrophe.\n\nSometimes it is a slow leak.\n\nSometimes it is sudden and total.\n\nThe sequence every professional pilot learns:\n\nAviate. Assess. Communicate.\n\nDo not declare Mayday while the aircraft is unstable.\n\nEstablish control first.\n\nThen choose your urgency call.\n\nA slow pressure drop — Pan Pan.\n\nA rapid leak or loss of control — Mayday.\n\nBrazilian pilots sometimes say \"hidráulica falhou\" or \"perdeu pressão\" on frequency.\n\nUse hydraulic failure or hydraulic pressure decreasing — ICAO standard terms.\n\nIn the H130, increased control forces mean you work harder on the cyclic and collective.\n\nTrain the assessment reflex so your radio call comes from a stable aircraft, not a panicked voice.",
    "operationalContext": "You are cruising at two thousand five hundred feet in your H130 on a charter flight from Curitiba to Navegantes.\n\nThe hydraulic pressure gauge drops rapidly and a low-pressure warning activates.\n\nYou feel increased control forces but maintain stable flight.\n\nWhen stable, you transmit:\n\nPan Pan Pan Pan, Navegantes Approach, ANAC123, hydraulic pressure decreasing, request vectors to Navegantes.\n\nApproach clears traffic and provides direct routing.\n\nYou complete a precautionary landing and report safe on the ground.",
    "sayItCoach": "Pan Pan Pan Pan, Navegantes Approach, ANAC123, hydraulic pressure decreasing.",
    "icaoModelAnswer": "After securing the aircraft, I would declare Pan Pan Pan Pan, state my callsign, report hydraulic pressure decreasing or hydraulic failure, state my position, and request vectors to the nearest suitable airport. I would upgrade to Mayday if control becomes seriously degraded. I would provide souls on board and fuel remaining when ATC requests.",
    "memoryTrick": "**FLOW** — **F**ly the aircraft first, **L**ook at pressure and control forces, **O**pen with Pan Pan or Mayday, **W**ork toward the nearest suitable airport.",
    "operationalMeaning": "When Hydraulic Failure occurs, the pilot should:\n\nHydraulic Failure reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear traffic from the aircraft's route",
      "provide vectors to the nearest suitable airport",
      "coordinate priority landing and emergency services",
      "request souls on board and fuel remaining",
      "alert airport authorities and ground emergency crews"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, roger Pan Pan, say nature of hydraulic problem and souls on board.",
      "Approach: ANAC123, turn left heading two seven zero, descend at your discretion, Navegantes three zero miles.",
      "Tower: ANAC123, all traffic cleared from your approach, runway two nine cleared to land.",
      "Tower: ANAC123, emergency services standing by, wind two seven zero at one two knots.",
      "Departure: ANAC123, radar contact, say fuel remaining and intentions."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan Pan, Navegantes Approach, ANAC123, hydraulic pressure decreasing.",
      "Mayday Mayday Mayday, Curitiba Tower, ANAC123, hydraulic fluid leak, request immediate landing.",
      "Pan Pan Pan Pan, ANAC123, hydraulic failure, request vectors to Florianópolis.",
      "ANAC123, hydraulic failure, souls on board four, fuel remaining forty-five minutes.",
      "Tower, ANAC123, hydraulic pressure decreasing, unable to confirm full control authority, request priority landing."
    ],
    "brazilianMistakes": "- ❌ Declaring Mayday for a minor pressure fluctuation without assessing severity.  \n  ✔ Use Pan Pan for urgency; reserve Mayday for distress when safe flight is in doubt.\n\n- ❌ Saying \"perdeu pressão hidráulica\" instead of standard English.  \n  ✔ Use hydraulic failure or hydraulic pressure decreasing.\n\n- ❌ Forgetting to state intentions after the urgency declaration.  \n  ✔ State request for vectors, immediate landing, or nearest suitable airport.\n\n- ❌ Omitting souls on board and fuel when ATC asks.  \n  ✔ Provide souls on board and fuel remaining promptly.",
    "pronunciationCoaching": "**Target Phrase:** Pan Pan Pan Pan, Hydraulic Pressure Decreasing\n\n**Pronunciation:** pan pan pan pan, hy-DRAW-lik PRESH-er dee-KREE-sing\n\n**Word Stress**\n\n- Hydraulic → hy-DRAW-lik\n- Pressure → PRESH-er\n- Decreasing → dee-KREE-sing\n\nPractice:\n\nPan... Pan... Pan... Pan...\n\nTogether:\n\nPan Pan Pan Pan, Navegantes Approach, ANAC123, hydraulic pressure decreasing.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Pan Pan Urgency Call",
      "Mayday Distress Call",
      "Precautionary Landing",
      "Emergency Landing",
      "Priority Landing",
      "Aircraft Systems Failure"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Hydraulic System",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Hydraulic Problems",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0047",
    "id": "0047",
    "displayTerm": "Electrical Failure",
    "term": "electrical failure",
    "slug": "electrical-failure",
    "category": "Aircraft Systems",
    "meaningEn": "Electrical Failure is the partial or complete loss of aircraft electrical power, requiring alternate power sources and possible emergency procedures.",
    "meaningPt": "Falha elétrica.\n\nPerda parcial ou total da energia elétrica da aeronave, exigindo fontes alternativas de energia.",
    "whenUsed": "When Electrical Failure occurs, the pilot should:",
    "example": "Tower: ANAC123, roger Mayday, say souls on board and fuel remaining.",
    "sayPhrase": "Mayday Mayday Mayday, Santos Dumont Tower, ANAC123, total electrical failure.",
    "icaoQuestion": "What would you tell ATC after a total electrical failure on approach?",
    "icaoSpeakText": "After securing the aircraft and switching to battery power, I would declare Mayday Mayday Mayday, state my callsign, report total electrical failure, state that I am switching to battery power or flying partial panel, and request immediate landing. I would provide souls on board and fuel remaining when ATC requests.",
    "missionBrief": "Today's lesson covers one of the most disruptive aircraft systems emergencies.\n\nElectrical Failure means the aircraft has lost part or all of its electrical power — affecting avionics, instruments, lighting, and communication equipment.\n\nIn the H130, electrical power supports navigation, radios, and critical instruments.\n\nA total electrical failure can leave you on battery power with limited capability.\n\nYou must aviate first, switch to alternate power if available, then communicate.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Electrical failure can happen suddenly or gradually.\n\nThe sequence every professional pilot learns:\n\nAviate. Alternate. Communicate.\n\nDo not panic when instruments go dark.\n\nKnow your battery limitations.\n\nKnow your partial panel skills.\n\nBrazilian pilots sometimes say \"falta de energia\" or \"painel apagou\" on frequency.\n\nUse total electrical failure or switching to battery power — ICAO standard terms.\n\nFor total failure affecting safe flight — Mayday.\n\nFor partial failure with continued capability — Pan Pan.\n\nIn the H130, battery time is limited.\n\nMake your radio call count — state the problem once, clearly, with your intentions.",
    "operationalContext": "You are on approach to Santos Dumont in your H130 at one thousand two hundred feet.\n\nAll electrical busses fail simultaneously.\n\nAvionics go dark.\n\nYou switch to battery power and regain partial panel operation.\n\nWhen stable, you transmit:\n\nMayday Mayday Mayday, Santos Dumont Tower, ANAC123, total electrical failure, switching to battery power, request immediate landing.\n\nTower clears all traffic and coordinates emergency services.\n\nYou complete a visual approach and report safe on the ground.",
    "sayItCoach": "Mayday Mayday Mayday, Santos Dumont Tower, ANAC123, total electrical failure.",
    "icaoModelAnswer": "After securing the aircraft and switching to battery power, I would declare Mayday Mayday Mayday, state my callsign, report total electrical failure, state that I am switching to battery power or flying partial panel, and request immediate landing. I would provide souls on board and fuel remaining when ATC requests.",
    "memoryTrick": "**POWER** — **P**ilot flies first, **O**pen alternate source, **W**arn ATC with Mayday or Pan Pan, **E**valuate remaining equipment, **R**equest landing or vectors.",
    "operationalMeaning": "When Electrical Failure occurs, the pilot should:\n\nElectrical Failure reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear traffic from the aircraft's route",
      "provide vectors using whatever communication remains",
      "coordinate priority landing and emergency services",
      "request souls on board and fuel remaining",
      "alert other aircraft and airport authorities"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, roger Mayday, say souls on board and fuel remaining.",
      "Tower: ANAC123, runway zero two cleared to land, wind zero three zero at one zero knots.",
      "Approach: ANAC123, turn right heading three six zero, descend two thousand, say equipment operational.",
      "Tower: ANAC123, emergency services standing by.",
      "Departure: ANAC123, radar contact, say intentions and souls on board."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, Santos Dumont Tower, ANAC123, total electrical failure.",
      "ANAC123, switching to battery power, flying partial panel.",
      "Pan Pan Pan Pan, Guarulhos Approach, ANAC123, partial electrical failure, request vectors to Guarulhos.",
      "ANAC123, total electrical failure, souls on board two, fuel remaining thirty minutes.",
      "Tower, ANAC123, electrical failure, unable to confirm all navigation equipment, request immediate landing."
    ],
    "brazilianMistakes": "- ❌ Saying \"painel apagou\" instead of standard English.  \n  ✔ Use total electrical failure or partial electrical failure.\n\n- ❌ Forgetting to mention switching to battery power.  \n  ✔ Report switching to battery power — it tells ATC your capability.\n\n- ❌ Declaring Mayday for a minor generator fluctuation.  \n  ✔ Assess severity — Pan Pan for urgency, Mayday for distress.\n\n- ❌ Omitting souls on board and fuel when ATC asks.  \n  ✔ Provide souls on board and fuel remaining promptly.",
    "pronunciationCoaching": "**Target Phrase:** Mayday Mayday Mayday, Total Electrical Failure\n\n**Pronunciation:** MAY-day MAY-day MAY-day, TOH-tul ee-LEK-tri-kul FAIL-yur\n\n**Word Stress**\n\n- Total → TOH-tul\n- Electrical → ee-LEK-tri-kul\n- Failure → FAIL-yur\n\nPractice:\n\nMayday... Mayday... Mayday...\n\nTogether:\n\nMayday Mayday Mayday, Santos Dumont Tower, ANAC123, total electrical failure.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Mayday Distress Call",
      "Pan Pan Urgency Call",
      "Partial Panel",
      "Battery Power",
      "Radio Failure",
      "Lost Communications",
      "Precautionary Landing"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Electrical System",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Electrical Problems",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0048",
    "id": "0048",
    "displayTerm": "GPS Inoperative",
    "term": "gps inoperative",
    "slug": "gps-inoperative",
    "category": "Aircraft Systems",
    "meaningEn": "GPS Inoperative is the loss of GPS navigation capability, requiring the pilot to resume conventional navigation methods.",
    "meaningPt": "GPS inoperante.\n\nPerda da capacidade de navegação por GPS, exigindo métodos de navegação convencionais.",
    "whenUsed": "When GPS Inoperative occurs, the pilot should:",
    "example": "Approach: ANAC123, roger GPS inoperative, turn left heading two four zero, vectors to Florianópolis.",
    "sayPhrase": "Florianópolis Approach, ANAC123, GPS navigation lost, resuming conventional navigation.",
    "icaoQuestion": "What would you tell ATC if your GPS stopped working during en route flight?",
    "icaoSpeakText": "I would inform ATC clearly: GPS inoperative or GPS navigation lost, state my callsign and position, and report that I am resuming conventional navigation. I would request vectors if needed or state my intentions to proceed using alternate navaids. I would not declare Mayday unless safe navigation is seriously compromised.",
    "missionBrief": "Today's lesson covers a navigation systems failure every modern pilot must handle.\n\nGPS Inoperative means the Global Positioning System receiver or navigation function is no longer providing reliable position data.\n\nIn the H130, GPS is often the primary navigation source for VFR and IFR operations in Brazil.\n\nWhen GPS fails, you must revert to conventional navigation — VOR, NDB, pilotage, or dead reckoning.\n\nYou do not always need Mayday or Pan Pan — but you must inform ATC clearly.\n\nThis lesson prepares you for ICAO Part 2 phraseology and navigation communication.",
    "captainTeaching": "GPS failure is common in the ICAO exam and in real operations.\n\nThe sequence every professional pilot learns:\n\nAviate. Navigate. Communicate.\n\nDo not declare Mayday because the GPS screen went blank.\n\nThat is not distress — it is a navigation problem.\n\nInform ATC clearly.\n\nRequest vectors if you need them.\n\nBrazilian pilots sometimes say \"GPS caiu\" or \"perdeu o GPS\" on frequency.\n\nUse GPS inoperative or GPS navigation lost — ICAO standard terms.\n\nIn the H130 over Brazilian terrain, know your VOR stations and carry current charts.\n\nGPS is a tool — not your only skill.\n\nTrain conventional navigation so a blank screen does not blank your confidence.",
    "operationalContext": "You are en route from Porto Alegre to Florianópolis in your H130 at three thousand five hundred feet.\n\nThe GPS display goes blank and does not recover after reset.\n\nYou identify your position using VOR and pilotage.\n\nYou transmit:\n\nFlorianópolis Approach, ANAC123, GPS navigation lost, resuming conventional navigation, request vectors to Florianópolis.\n\nApproach provides radar vectors while you rejoin the published route.\n\nYou complete the approach and land without incident.",
    "sayItCoach": "ANAC123, GPS navigation lost, resuming conventional navigation.",
    "icaoModelAnswer": "I would inform ATC clearly: GPS inoperative or GPS navigation lost, state my callsign and position, and report that I am resuming conventional navigation. I would request vectors if needed or state my intentions to proceed using alternate navaids. I would not declare Mayday unless safe navigation is seriously compromised.",
    "memoryTrick": "**NAV** — **N**otify ATC, **A**lternate source, **V**ectors if needed.",
    "operationalMeaning": "When GPS Inoperative occurs, the pilot should:\n\nGPS Inoperative reporting commonly includes:",
    "whyAtcUsesIt": [
      "provide radar vectors when available",
      "issue conventional navigation clearances",
      "coordinate with adjacent sectors for handoff",
      "advise of available navaids in the area",
      "monitor aircraft position when pilot navigation is degraded"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, roger GPS inoperative, turn left heading two four zero, vectors to Florianópolis.",
      "Approach: ANAC123, radar contact, say position and intentions.",
      "Tower: ANAC123, GPS unavailable noted, continue approach runway three zero.",
      "Departure: ANAC123, resume own navigation when able, direct POA.",
      "Approach: ANAC123, electronic navigation capability reduced, say alternate navaids available."
    ],
    "pilotReadbacks": [
      "Florianópolis Approach, ANAC123, GPS navigation lost, resuming conventional navigation.",
      "ANAC123, GPS inoperative, request vectors to nearest suitable airport.",
      "ANAC123, electronic nav systems inoperative, proceeding VFR using pilotage.",
      "Approach, ANAC123, GPS unavailable, position ten miles south of Navegantes, request direct.",
      "ANAC123, resuming conventional navigation, GPS unavailable, maintaining three thousand five hundred."
    ],
    "brazilianMistakes": "- ❌ Saying \"GPS caiu\" or \"perdeu sinal\" instead of standard English.  \n  ✔ Use GPS inoperative or GPS navigation lost.\n\n- ❌ Declaring Mayday or Pan Pan for GPS failure alone.  \n  ✔ Inform ATC normally — urgency only if navigation safety is seriously affected.\n\n- ❌ Not informing ATC that navigation capability is reduced.  \n  ✔ Report GPS inoperative promptly so ATC can assist.\n\n- ❌ Continuing on assigned RNAV route without informing ATC.  \n  ✔ Request conventional clearance or vectors when GPS is unavailable.",
    "pronunciationCoaching": "**Target Phrase:** GPS Inoperative, Resuming Conventional Navigation\n\n**Pronunciation:** jee-pee-ess in-AH-pruh-tiv, ree-ZOOM-ing kun-VEN-shuh-nul nav-ih-GAY-shun\n\n**Word Stress**\n\n- Inoperative → in-AH-pruh-tiv\n- Conventional → kun-VEN-shuh-nul\n- Navigation → nav-ih-GAY-shun\n\nPractice:\n\nGPS... inoperative...\n\nTogether:\n\nANAC123, GPS navigation lost, resuming conventional navigation.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Resume Own Navigation",
      "Electronic Navigation Capability",
      "Radar Vectors",
      "Conventional Navigation",
      "FMS Failure",
      "Lost Communications"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Navigation Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Navigation Aids",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Navigation Services",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — GPS",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — GNSS Failure",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0049",
    "id": "0049",
    "displayTerm": "Landing Gear Malfunction",
    "term": "landing gear malfunction",
    "slug": "landing-gear-malfunction",
    "category": "Aircraft Systems",
    "meaningEn": "Landing Gear Malfunction is any abnormal condition of the landing gear or skid system that affects safe landing configuration.",
    "meaningPt": "Falha no trem de pouso.\n\nCondição anormal do trem de pouso ou sistema de patins que afeta a configuração segura para pouso.",
    "whenUsed": "When Landing Gear Malfunction occurs, the pilot should:",
    "example": "Tower: ANAC123, roger Pan Pan, cleared low pass runway zero nine left for gear inspection.",
    "sayPhrase": "Pan Pan Pan Pan, Guarulhos Tower, ANAC123, landing gear unsafe.",
    "icaoQuestion": "What would you tell ATC if you received a landing gear unsafe indication on approach?",
    "icaoSpeakText": "After maintaining aircraft control and running the emergency checklist, I would declare Pan Pan Pan Pan, state my callsign, report landing gear unsafe or main gear is stuck, and request a low pass for gear inspection or vectors to hold. I would provide souls on board and fuel remaining when ATC requests. I would upgrade to Mayday if a safe landing becomes seriously doubtful.",
    "missionBrief": "Today's lesson covers a landing gear malfunction — adapted for helicopter operations.\n\nLanding Gear Malfunction means the landing gear or skid system does not indicate safe configuration for landing.\n\nMost H130 helicopters use fixed skids — but retractable-gear helicopters and ICAO exams still require this phraseology.\n\nYou may also report skid damage, gear unsafe indications, or landing gear stuck.\n\nYou must assess the situation, prepare for landing, then communicate with the correct urgency call.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Landing gear problems create time pressure.\n\nThe sequence every professional pilot learns:\n\nAviate. Checklist. Communicate.\n\nDo not rush the landing.\n\nRun the procedure.\n\nRequest a low pass if you need visual confirmation.\n\nBrazilian pilots sometimes say \"trem não desceu\" or \"pouso inseguro\" on frequency.\n\nUse landing gear unsafe or main gear is stuck — ICAO standard terms.\n\nIn the H130 with fixed skids, you may never face retractable gear failure.\n\nBut the ICAO exam will test this phraseology.\n\nKnow the words.\n\nKnow when Pan Pan becomes Mayday.\n\nA stuck gear is urgency.\n\nA collapsed gear on rollout is distress.",
    "operationalContext": "You are on final approach to Guarulhos in a retractable-gear helicopter on a training flight, callsign ANAC123.\n\nThe gear unsafe warning illuminates and the main gear does not indicate down and locked.\n\nYou go around and enter the hold while running the emergency checklist.\n\nYou transmit:\n\nPan Pan Pan Pan, Guarulhos Tower, ANAC123, landing gear unsafe, request low pass for gear inspection.\n\nTower coordinates a low pass and emergency services.\n\nAfter confirming gear down, you land safely.",
    "sayItCoach": "Pan Pan Pan Pan, Guarulhos Tower, ANAC123, landing gear unsafe.",
    "icaoModelAnswer": "After maintaining aircraft control and running the emergency checklist, I would declare Pan Pan Pan Pan, state my callsign, report landing gear unsafe or main gear is stuck, and request a low pass for gear inspection or vectors to hold. I would provide souls on board and fuel remaining when ATC requests. I would upgrade to Mayday if a safe landing becomes seriously doubtful.",
    "memoryTrick": "**GEAR** — **G**o around if unsafe, **E**xecute checklist, **A**nnounce Pan Pan to ATC, **R**equest low pass or emergency landing.",
    "operationalMeaning": "When Landing Gear Malfunction occurs, the pilot should:\n\nLanding Gear Malfunction reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear the runway for inspection or emergency landing",
      "coordinate low pass for visual gear check",
      "alert emergency services and airport fire rescue",
      "request souls on board and fuel remaining",
      "clear traffic from the approach path"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, roger Pan Pan, cleared low pass runway zero nine left for gear inspection.",
      "Tower: ANAC123, gear appears down, cleared to land runway zero nine left.",
      "Approach: ANAC123, say souls on board and fuel remaining.",
      "Tower: ANAC123, emergency services standing by, wind two seven zero at one four knots.",
      "Tower: ANAC123, all traffic cleared from your approach, say intentions."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan Pan, Guarulhos Tower, ANAC123, landing gear unsafe.",
      "Tower, ANAC123, main gear is stuck, request low pass for gear inspection.",
      "Mayday Mayday Mayday, Congonhas Tower, ANAC123, left main gear issue, request immediate landing.",
      "ANAC123, landing gear unsafe indication, souls on board three, fuel remaining one hour.",
      "Pan Pan Pan Pan, ANAC123, preparing for precautionary landing, gear unsafe."
    ],
    "brazilianMistakes": "- ❌ Saying \"trem travado\" instead of standard English.  \n  ✔ Use landing gear unsafe or main gear is stuck.\n\n- ❌ Attempting to land without informing ATC.  \n  ✔ Declare Pan Pan and request low pass or emergency services.\n\n- ❌ Declaring Mayday for a simple unsafe indication before assessment.  \n  ✔ Use Pan Pan for urgency; Mayday when safe landing is in serious doubt.\n\n- ❌ Forgetting to request low pass for visual gear inspection.  \n  ✔ Request low pass — ATC can confirm gear position from the ground.",
    "pronunciationCoaching": "**Target Phrase:** Pan Pan Pan Pan, Landing Gear Unsafe\n\n**Pronunciation:** pan pan pan pan, LAND-ing geer un-SAYF\n\n**Word Stress**\n\n- Landing → LAND-ing\n- Gear → geer\n- Unsafe → un-SAYF\n\nPractice:\n\nPan... Pan... Pan... Pan...\n\nTogether:\n\nPan Pan Pan Pan, Guarulhos Tower, ANAC123, landing gear unsafe.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Pan Pan Urgency Call",
      "Mayday Distress Call",
      "Precautionary Landing",
      "Emergency Landing",
      "Priority Landing",
      "Low Pass"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Landing Gear",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Landing Gear Problems",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0050",
    "id": "0050",
    "displayTerm": "Cabin Depressurization",
    "term": "cabin depressurization",
    "slug": "cabin-depressurization",
    "category": "Emergency",
    "meaningEn": "Cabin Depressurization is the loss of cabin pressure, exposing occupants to altitude-related hypoxia and requiring immediate descent.",
    "meaningPt": "Despressurização da cabine.\n\nPerda de pressão na cabine, expondo ocupantes à hipóxia por altitude.",
    "whenUsed": "When Cabin Depressurization occurs, the pilot should:",
    "example": "Control: ANAC123, roger Mayday, cleared immediate descent, say souls on board.",
    "sayPhrase": "Mayday Mayday Mayday, Brasília Control, ANAC123, rapid decompression.",
    "icaoQuestion": "What would you tell ATC immediately after a rapid decompression?",
    "icaoSpeakText": "I would don oxygen immediately, initiate emergency descent, and declare Mayday Mayday Mayday. I would state my callsign, report rapid decompression, state that I am descending to ten thousand feet, and request vectors to the nearest suitable airport. I would provide souls on board when ATC requests.",
    "missionBrief": "Today's lesson covers cabin depressurization — a classic ICAO exam topic.\n\nCabin Depressurization means the pressurized cabin loses altitude equivalent pressure — rapidly or gradually.\n\nPressurized helicopters are rare, but ICAO Part 2 and Part 3 test this phraseology extensively.\n\nYou must don oxygen, descend immediately, and declare the correct urgency call.\n\nRapid decompression is distress — Mayday.\n\nGradual decompression may be urgency — Pan Pan.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Depressurization is a race against hypoxia.\n\nThe sequence every professional pilot learns:\n\nOxygen. Descend. Communicate.\n\nDo not negotiate altitude with ATC before descending.\n\nMayday first.\n\nDescend immediately.\n\nThen work the details.\n\nBrazilian pilots sometimes say \"perdeu pressurização\" or \"cabine despressurizou\" on frequency.\n\nUse rapid decompression or sudden decompression — ICAO standard terms.\n\nIn the H130, you are usually unpressurized.\n\nBut the ICAO exam will test this.\n\nKnow the words.\n\nKnow the difference between rapid and gradual.\n\nRapid — Mayday.\n\nGradual — Pan Pan.\n\nTrain the oxygen reflex before you train the radio call.",
    "operationalContext": "You are simulating a pressurized helicopter exam scenario, callsign ANAC123, cruising at flight level two five zero over Brasília.\n\nThe cabin altitude warning sounds and masks deploy.\n\nYou don oxygen and initiate emergency descent.\n\nYou transmit:\n\nMayday Mayday Mayday, Brasília Control, ANAC123, rapid decompression, descending to ten thousand feet, request vectors to Brasília.\n\nControl clears all traffic and coordinates medical services on landing.\n\nYou level at ten thousand feet and complete a priority approach.",
    "sayItCoach": "Mayday Mayday Mayday, Brasília Control, ANAC123, rapid decompression.",
    "icaoModelAnswer": "I would don oxygen immediately, initiate emergency descent, and declare Mayday Mayday Mayday. I would state my callsign, report rapid decompression, state that I am descending to ten thousand feet, and request vectors to the nearest suitable airport. I would provide souls on board when ATC requests.",
    "memoryTrick": "**DESCEND** — **D**on oxygen, **E**mergency descent, **S**ay Mayday, **C**lear altitude, **E**xecute vectors, **N**earest airport, **D**eliver souls on board count.",
    "operationalMeaning": "When Cabin Depressurization occurs, the pilot should:\n\nCabin Depressurization reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear all traffic from the aircraft's altitude and route",
      "approve immediate descent without delay",
      "coordinate priority landing and medical services",
      "request souls on board and nature of injuries",
      "alert other aircraft in the area"
    ],
    "atcPhraseology": [
      "Control: ANAC123, roger Mayday, cleared immediate descent, say souls on board.",
      "Control: ANAC123, turn left heading one eight zero, descend unrestricted, Brasília in sight.",
      "Tower: ANAC123, runway one one cleared to land, emergency services standing by.",
      "Approach: ANAC123, all traffic cleared from your altitude, say medical assistance required.",
      "Control: ANAC123, confirm you have donned oxygen and are descending."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, Brasília Control, ANAC123, rapid decompression.",
      "Pan Pan Pan Pan, ANAC123, sudden decompression, requesting lower altitude.",
      "ANAC123, requesting lower altitude, pressurization issue, descending ten thousand.",
      "Mayday Mayday Mayday, ANAC123, rapid decompression, souls on board six, request vectors Brasília.",
      "ANAC123, donning oxygen, emergency descent, due to pressurization problem."
    ],
    "brazilianMistakes": "- ❌ Requesting lower altitude before donning oxygen.  \n  ✔ Don oxygen first — hypoxia impairs judgment within seconds.\n\n- ❌ Saying \"cabine perdeu pressão\" instead of standard English.  \n  ✔ Use rapid decompression or sudden decompression.\n\n- ❌ Using Pan Pan for rapid decompression.  \n  ✔ Rapid decompression is distress — declare Mayday.\n\n- ❌ Delaying descent to complete radio calls.  \n  ✔ Descend first — communicate while descending if able.",
    "pronunciationCoaching": "**Target Phrase:** Mayday Mayday Mayday, Rapid Decompression\n\n**Pronunciation:** MAY-day MAY-day MAY-day, RAP-id dee-kom-presh-UN\n\n**Word Stress**\n\n- Rapid → RAP-id\n- Decompression → dee-kom-presh-UN\n\nPractice:\n\nMayday... Mayday... Mayday...\n\nTogether:\n\nMayday Mayday Mayday, Brasília Control, ANAC123, rapid decompression.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Mayday Distress Call",
      "Pan Pan Urgency Call",
      "Emergency Descent",
      "Priority Landing",
      "Medical Emergency",
      "Smoke in the Cabin"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Depressurization",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Loss of Cabin Pressurization",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0051",
    "id": "0051",
    "displayTerm": "Pilot Incapacitation",
    "term": "pilot incapacitation",
    "slug": "pilot-incapacitation",
    "category": "Emergency",
    "meaningEn": "Pilot Incapacitation is the inability of a flight crew member to continue performing their duties due to medical or other emergency.",
    "meaningPt": "Incapacitação do piloto.\n\nIncapacidade de um membro da tripulação de voo de continuar exercendo suas funções.",
    "whenUsed": "When Pilot Incapacitation occurs, the pilot should:",
    "example": "Approach: ANAC123, roger Mayday, say souls on board and nature of incapacitation.",
    "sayPhrase": "Mayday Mayday Mayday, Navegantes Approach, ANAC123, captain incapacitated, first officer assuming control.",
    "icaoQuestion": "What would you tell ATC if the captain became incapacitated during flight?",
    "icaoSpeakText": "After taking full control of the aircraft, I would declare Mayday Mayday Mayday, state my callsign, report captain incapacitated, state that the first officer is assuming control, and request vectors to the nearest suitable airport. I would request medical assistance on landing and provide souls on board when ATC asks.",
    "missionBrief": "Today's lesson covers one of the most serious crew emergencies.\n\nPilot Incapacitation means a flight crew member becomes unable to perform their duties — due to medical emergency, unconsciousness, or sudden illness.\n\nIn a single-pilot H130 operation, this is immediately critical.\n\nIn two-crew operations, the remaining pilot must assume full control and declare the emergency.\n\nYou must fly the aircraft first, then communicate clearly with Mayday.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Pilot incapacitation is rare but tested in every ICAO exam.\n\nThe sequence every professional pilot learns:\n\nFly. Take control. Communicate.\n\nDo not diagnose on frequency.\n\nDo not delay the Mayday to check vitals.\n\nTake the controls.\n\nDeclare Mayday.\n\nRequest vectors and medical assistance.\n\nBrazilian pilots sometimes say \"piloto passou mal\" or \"comandante desmaiou\" on frequency.\n\nUse pilot incapacitated or captain incapacitated — ICAO standard terms.\n\nState who has control: first officer assuming control.\n\nIn single-pilot H130 operations, your survival depends on training and autopilot if equipped.\n\nIn two-crew operations, the surviving pilot must act decisively.\n\nThe radio call brings help — but aircraft control saves lives.",
    "operationalContext": "You are the first officer on a two-crew helicopter training flight, callsign ANAC123, approaching Navegantes.\n\nThe captain slumps forward and does not respond.\n\nYou take full control of the aircraft.\n\nYou transmit:\n\nMayday Mayday Mayday, Navegantes Approach, ANAC123, captain incapacitated, first officer assuming control, request vectors to Navegantes.\n\nApproach clears all traffic and coordinates medical services.\n\nYou complete a priority landing and report safe on the ground.",
    "sayItCoach": "Mayday Mayday Mayday, Navegantes Approach, ANAC123, captain incapacitated, first officer assuming control.",
    "icaoModelAnswer": "After taking full control of the aircraft, I would declare Mayday Mayday Mayday, state my callsign, report captain incapacitated, state that the first officer is assuming control, and request vectors to the nearest suitable airport. I would request medical assistance on landing and provide souls on board when ATC asks.",
    "memoryTrick": "**CREW** — **C**ontrol the aircraft, **R**eport Mayday, **E**xplain who is flying, **W**ork vectors to nearest airport.",
    "operationalMeaning": "When Pilot Incapacitation occurs, the pilot should:\n\nPilot Incapacitation reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear all traffic from the aircraft's route",
      "provide vectors to the nearest suitable airport",
      "coordinate priority landing and medical services",
      "request souls on board and nature of emergency",
      "alert airport authorities and ambulance services"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, roger Mayday, say souls on board and nature of incapacitation.",
      "Approach: ANAC123, turn right heading zero nine zero, descend at your discretion, Navegantes in sight.",
      "Tower: ANAC123, runway two nine cleared to land, medical services standing by.",
      "Tower: ANAC123, emergency services alerted, wind two four zero at one zero knots.",
      "Control: ANAC123, all traffic cleared from your approach, say assistance required on ground."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, Navegantes Approach, ANAC123, captain incapacitated, first officer assuming control.",
      "Mayday Mayday Mayday, ANAC123, declaring emergency, pilot medical emergency.",
      "ANAC123, pilot incapacitated, souls on board three, request medical assistance on landing.",
      "Mayday Mayday Mayday, Congonhas Tower, ANAC123, pilot incapacitated, request immediate landing.",
      "ANAC123, captain incapacitated, first officer assuming control, request vectors to nearest suitable airport."
    ],
    "brazilianMistakes": "- ❌ Saying \"piloto passou mal\" instead of standard English.  \n  ✔ Use pilot incapacitated or captain incapacitated.\n\n- ❌ Forgetting to state who has control of the aircraft.  \n  ✔ Report first officer assuming control or pilot flying identity.\n\n- ❌ Delaying Mayday to assess the medical condition.  \n  ✔ Take control and declare Mayday immediately.\n\n- ❌ Not requesting medical assistance on landing.  \n  ✔ Request medical assistance — ATC coordinates ambulances.",
    "pronunciationCoaching": "**Target Phrase:** Mayday Mayday Mayday, Captain Incapacitated\n\n**Pronunciation:** MAY-day MAY-day MAY-day, KAP-tin in-kuh-PASS-ih-tay-ted\n\n**Word Stress**\n\n- Captain → KAP-tin\n- Incapacitated → in-kuh-PASS-ih-tay-ted\n- Assuming → uh-SOOM-ing\n\nPractice:\n\nMayday... Mayday... Mayday...\n\nTogether:\n\nMayday Mayday Mayday, Navegantes Approach, ANAC123, captain incapacitated, first officer assuming control.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Mayday Distress Call",
      "Medical Emergency",
      "Priority Landing",
      "Emergency Landing",
      "Passenger Unconscious",
      "Heart Attack Onboard"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Emergency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Pilot Incapacitation",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Pilot Incapacitation",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0052",
    "id": "0052",
    "displayTerm": "Mayday",
    "term": "mayday",
    "slug": "mayday",
    "category": "Radio Communication",
    "meaningEn": "Mayday is the radiotelephony distress signal indicating grave and imminent danger requiring immediate assistance.",
    "meaningPt": "Mayday (sinal de socorro).\n\nSinal internacional de perigo grave e iminente que requer assistência imediata.",
    "whenUsed": "When Mayday is appropriate, the pilot should:",
    "example": "Tower: ANAC123, roger Mayday, say souls on board and fuel remaining.",
    "sayPhrase": "Mayday Mayday Mayday, Florianópolis Tower, ANAC123, engine failure, autorotating.",
    "icaoQuestion": "When should you declare Mayday instead of Pan Pan?",
    "icaoSpeakText": "I would declare Mayday when the aircraft or occupants face grave and imminent danger and require immediate assistance. Examples include engine failure, fire on board, rapid decompression, and pilot incapacitation. I would use Pan Pan when the situation is urgent but does not involve grave and imminent danger, such as low fuel state or partial system failure with continued safe flight.",
    "missionBrief": "Today's lesson covers the most serious radio call in aviation.\n\nMayday is the international distress signal — used when an aircraft or occupants face grave and imminent danger and require immediate assistance.\n\nMayday overrides all other traffic.\n\nIt is not a general emergency word — it is reserved for distress only.\n\nYou must know when to use Mayday versus Pan Pan.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Mayday is the word that clears the sky.\n\nIt comes from the French m'aider — help me.\n\nSay it three times.\n\nNo variations.\n\nNo \"emergency\" instead of Mayday on international frequency.\n\nBrazilian pilots sometimes say \"emergência\" or \"socorro\" on frequency.\n\nUse Mayday Mayday Mayday — the ICAO standard distress signal.\n\nThe distinction matters:\n\nMayday — distress — grave and imminent danger.\n\nPan Pan — urgency — needs assistance but not immediate grave danger.\n\nWhen in doubt after securing the aircraft, lean toward Mayday if safe flight is seriously in doubt.\n\nControllers are trained to respond instantly to Mayday.\n\nGive them clear information: nature, intentions, position, souls on board.",
    "operationalContext": "You are departing Florianópolis in your H130, callsign ANAC123, at four hundred feet when the engine fails completely.\n\nYou enter autorotation and stabilize the aircraft.\n\nYou transmit:\n\nMayday Mayday Mayday, Florianópolis Tower, ANAC123, engine failure, autorotating, one mile south of the airport.\n\nTower ceases all other traffic and coordinates emergency services.\n\nYou complete a controlled autorotation landing and report safe on the ground.",
    "sayItCoach": "Mayday Mayday Mayday, Florianópolis Tower, ANAC123, engine failure.",
    "icaoModelAnswer": "I would declare Mayday when the aircraft or occupants face grave and imminent danger and require immediate assistance. Examples include engine failure, fire on board, rapid decompression, and pilot incapacitation. I would use Pan Pan when the situation is urgent but does not involve grave and imminent danger, such as low fuel state or partial system failure with continued safe flight.",
    "memoryTrick": "**SOS** — **S**ay Mayday three times, **O**verride all traffic, **S**tate nature and intentions.",
    "operationalMeaning": "When Mayday is appropriate, the pilot should:\n\nMayday is used for distress situations including:",
    "whyAtcUsesIt": [
      "cease all non-emergency transmissions on the frequency",
      "clear all traffic from the distressed aircraft's route",
      "provide maximum assistance without delay",
      "coordinate emergency services and priority landing",
      "request souls on board, fuel remaining, and nature of emergency"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, roger Mayday, say souls on board and fuel remaining.",
      "Tower: ANAC123, all traffic cleared from your approach, runway three zero cleared to land.",
      "Approach: ANAC123, turn left heading two seven zero, descend at your discretion.",
      "Tower: ANAC123, emergency services standing by.",
      "Control: ANAC123, Mayday acknowledged, say nature of distress and intentions."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, Florianópolis Tower, ANAC123, engine failure, autorotating.",
      "Mayday Mayday Mayday, ANAC123, complete loss of power, request immediate return.",
      "Mayday Mayday Mayday, Navegantes Approach, ANAC123, hydraulic fluid leak.",
      "Mayday Mayday Mayday, ANAC123, total electrical failure, request vectors to Congonhas.",
      "Mayday Mayday Mayday, ANAC123, captain incapacitated, first officer assuming control."
    ],
    "brazilianMistakes": "- ❌ Saying \"emergência\" or \"socorro\" instead of Mayday.  \n  ✔ Use Mayday Mayday Mayday — the international distress signal.\n\n- ❌ Using Mayday for non-distress situations like low fuel advisory.  \n  ✔ Reserve Mayday for distress; use Pan Pan for urgency.\n\n- ❌ Saying Mayday only once instead of three times.  \n  ✔ Transmit Mayday three times at the start of the message.\n\n- ❌ Declaring Mayday before securing the aircraft.  \n  ✔ Aviate first — then declare Mayday from a stable aircraft.",
    "pronunciationCoaching": "**Target Phrase:** Mayday Mayday Mayday\n\n**Pronunciation:** MAY-day MAY-day MAY-day\n\n**Word Stress**\n\n- Mayday → may-DAY (say three times, clearly and distinctly)\n\nPractice:\n\nMayday...\n\nMayday...\n\nMayday...\n\nTogether:\n\nMayday Mayday Mayday, Florianópolis Tower, ANAC123, engine failure.\n\nSpeak slowly and clearly — this word must be unmistakable.",
    "relatedConcepts": [
      "Pan Pan Urgency Call",
      "Engine Failure",
      "Fire on Board",
      "Pilot Incapacitation",
      "Priority Landing",
      "Emergency Landing",
      "Distress versus Urgency"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Distress and Urgency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Mayday",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Distress Calls",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0053",
    "id": "0053",
    "displayTerm": "Pan Pan",
    "term": "pan pan",
    "slug": "pan-pan",
    "category": "Radio Communication",
    "meaningEn": "Pan Pan is the radiotelephony urgency signal indicating a condition that requires assistance but does not constitute grave and imminent danger.",
    "meaningPt": "Pan Pan (sinal de urgência).\n\nSinal internacional de urgência indicando necessidade de assistência sem perigo grave e iminente.",
    "whenUsed": "When Pan Pan is appropriate, the pilot should:",
    "example": "Approach: ANAC123, roger Pan Pan, say souls on board and fuel remaining.",
    "sayPhrase": "Pan Pan Pan Pan, Curitiba Approach, ANAC123, hydraulic pressure decreasing.",
    "icaoQuestion": "When should you use Pan Pan instead of Mayday?",
    "icaoSpeakText": "I would use Pan Pan when the aircraft needs assistance but does not face grave and imminent danger. Examples include low fuel state, hydraulic pressure decreasing, landing gear unsafe, and passenger medical emergency. I would use Mayday when safe flight is seriously in doubt, such as engine failure, fire on board, or rapid decompression. I would upgrade to Mayday if the urgency becomes distress.",
    "missionBrief": "Today's lesson covers the urgency call every pilot must distinguish from Mayday.\n\nPan Pan is the international urgency signal — used when an aircraft needs assistance but does not face grave and imminent danger.\n\nPan Pan does not override Mayday traffic.\n\nIt requests priority handling without declaring full distress.\n\nYou must know when Pan Pan is correct and when Mayday is required.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Pan Pan is the urgency call — one step below Mayday.\n\nSay it three times.\n\nPan Pan Pan Pan.\n\nNot Pan once.\n\nNot \"urgency urgency.\"\n\nBrazilian pilots sometimes confuse Pan Pan with Mayday.\n\nKnow the difference:\n\nMayday — distress — grave and imminent danger — engine failure, fire, rapid decompression.\n\nPan Pan — urgency — needs help — low fuel, gear unsafe, slow hydraulic leak, passenger medical.\n\nWhen the situation worsens, upgrade to Mayday without hesitation.\n\nControllers treat Pan Pan seriously.\n\nGive clear information.\n\nState nature, intentions, position.\n\nDo not minimize a developing emergency — report early with Pan Pan rather than late with Mayday.",
    "operationalContext": "You are en route to Curitiba in your H130, callsign ANAC123, at two thousand feet when you notice hydraulic pressure slowly decreasing.\n\nControl remains normal but the trend is concerning.\n\nYou transmit:\n\nPan Pan Pan Pan, Curitiba Approach, ANAC123, hydraulic pressure decreasing, request vectors to Curitiba.\n\nApproach provides priority handling and clears traffic from your approach.\n\nYou complete a precautionary landing and report safe on the ground.",
    "sayItCoach": "Pan Pan Pan Pan, Curitiba Approach, ANAC123, hydraulic pressure decreasing.",
    "icaoModelAnswer": "I would use Pan Pan when the aircraft needs assistance but does not face grave and imminent danger. Examples include low fuel state, hydraulic pressure decreasing, landing gear unsafe, and passenger medical emergency. I would use Mayday when safe flight is seriously in doubt, such as engine failure, fire on board, or rapid decompression. I would upgrade to Mayday if the urgency becomes distress.",
    "memoryTrick": "**URGENT** — **U**rgency not distress, **R**eport Pan Pan three times, **G**ive nature and intentions, **E**scalate to Mayday if worsening, **N**ever confuse with Mayday, **T**ell ATC your position.",
    "operationalMeaning": "When Pan Pan is appropriate, the pilot should:\n\nPan Pan is used for urgency situations including:",
    "whyAtcUsesIt": [
      "provide priority handling over normal traffic",
      "offer vectors and assistance without full emergency response",
      "coordinate landing priority when appropriate",
      "request additional information about the urgency",
      "monitor the aircraft until the situation is resolved"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, roger Pan Pan, say souls on board and fuel remaining.",
      "Approach: ANAC123, turn right heading three six zero, descend at your discretion.",
      "Tower: ANAC123, runway one five cleared to land, wind one eight zero at one two knots.",
      "Control: ANAC123, Pan Pan acknowledged, say nature of urgency.",
      "Tower: ANAC123, traffic cleared from your approach, emergency services notified."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan Pan, Curitiba Approach, ANAC123, hydraulic pressure decreasing.",
      "Pan Pan Pan Pan, ANAC123, landing gear unsafe, request low pass for inspection.",
      "Pan Pan Pan Pan, Navegantes Tower, ANAC123, low fuel state, request priority landing.",
      "Pan Pan Pan Pan, ANAC123, sudden decompression, requesting lower altitude.",
      "Pan Pan Pan Pan, ANAC123, passenger unconscious, need medical assistance."
    ],
    "brazilianMistakes": "- ❌ Using Pan Pan and Mayday interchangeably.  \n  ✔ Pan Pan for urgency; Mayday for distress — know the difference.\n\n- ❌ Saying \"Pan\" only once instead of three times.  \n  ✔ Transmit Pan Pan three times at the start of the message.\n\n- ❌ Using Pan Pan for engine failure or fire on board.  \n  ✔ Those are distress — declare Mayday.\n\n- ❌ Waiting too long to declare Pan Pan when a problem is developing.  \n  ✔ Report early with Pan Pan — upgrade to Mayday if needed.",
    "pronunciationCoaching": "**Target Phrase:** Pan Pan Pan Pan\n\n**Pronunciation:** pan pan pan pan\n\n**Word Stress**\n\n- Pan → pan (say three times, evenly spaced, clearly)\n\nPractice:\n\nPan...\n\nPan...\n\nPan...\n\nTogether:\n\nPan Pan Pan Pan, Curitiba Approach, ANAC123, hydraulic pressure decreasing.\n\nSpeak slowly and clearly — distinguish Pan Pan from Mayday.",
    "relatedConcepts": [
      "Mayday Distress Call",
      "Low Fuel",
      "Hydraulic Failure",
      "Landing Gear Malfunction",
      "Priority Landing",
      "Precautionary Landing",
      "Distress versus Urgency"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Distress and Urgency Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Emergency and Priority Handling",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Pan Pan",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Urgency Calls",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0054",
    "id": "0054",
    "displayTerm": "Radio Failure",
    "term": "radio failure",
    "slug": "radio-failure",
    "category": "Radio Communication",
    "meaningEn": "Radio Failure is the inoperative state of aircraft radio communication equipment, requiring lost communication procedures.",
    "meaningPt": "Falha de rádio.\n\nEquipamento de comunicação por rádio inoperante, exigindo procedimentos de comunicação perdida.",
    "whenUsed": "When Radio Failure occurs, the pilot should:",
    "example": "Tower: ANAC123, radio check, how do you read?",
    "sayPhrase": "Pan Pan Pan Pan, Guarulhos Approach, ANAC123, complete radio failure.",
    "icaoQuestion": "What procedures do you follow when you experience complete radio failure?",
    "icaoSpeakText": "I would attempt to restore communication on assigned and emergency frequencies. If unsuccessful, I would squawk seven six zero zero on the transponder. I would follow my last received ATC clearance, comply with lost communication procedures, and land at the nearest suitable airport as soon as practicable. If I regain transmit capability, I would inform ATC immediately.",
    "missionBrief": "Today's lesson covers radio failure — when you cannot transmit or receive on assigned frequencies.\n\nRadio Failure means communication equipment is inoperative — complete or partial.\n\nYou must know lost communication procedures: squawk 7600, follow last clearance, and land as soon as practicable.\n\nIf you regain partial communication, declare Pan Pan or Mayday as appropriate.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Radio failure is frightening — but procedures exist.\n\nThe sequence every professional pilot learns:\n\nSquawk. Comply. Land.\n\nSquawk 7600 immediately.\n\nFollow your last clearance.\n\nLand as soon as practicable in VMC.\n\nIf you regain one radio, inform ATC at once.\n\nBrazilian pilots sometimes say \"rádio falhou\" or \"sem contato\" on frequency.\n\nUse complete radio failure or loss of radio contact — ICAO standard terms.\n\nKnow seven six zero zero — say each digit separately: seven six zero zero.\n\nIn the H130 over Brazil, know your destination alternates.\n\nLost comm is not always Mayday.\n\nIt becomes Mayday when the underlying emergency plus radio failure creates grave danger.\n\nPartial failure with one working radio — inform ATC with Pan Pan.",
    "operationalContext": "You are on approach to Porto Alegre in your H130, callsign ANAC123, when both COM radios fail.\n\nYou attempt reset without success.\n\nYou squawk 7600 and continue the published approach per your last clearance.\n\nYou land on runway one one and taxi clear.\n\nOn the ground, you contact Tower by phone to report complete radio failure.",
    "sayItCoach": "ANAC123, complete radio failure, squawking seven six zero zero.",
    "icaoModelAnswer": "I would attempt to restore communication on assigned and emergency frequencies. If unsuccessful, I would squawk seven six zero zero on the transponder. I would follow my last received ATC clearance, comply with lost communication procedures, and land at the nearest suitable airport as soon as practicable. If I regain transmit capability, I would inform ATC immediately.",
    "memoryTrick": "**7600** — **7** attempt restore, **6** squawk seven six zero zero, **0** obey last clearance, **0** land when practicable.",
    "operationalMeaning": "When Radio Failure occurs, the pilot should:\n\nRadio Failure reporting commonly includes:",
    "whyAtcUsesIt": [
      "identify the aircraft by transponder code 7600",
      "clear traffic from the aircraft's expected route",
      "monitor the aircraft visually and on radar",
      "anticipate aircraft actions per lost communication procedures",
      "coordinate with adjacent sectors for handoff"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, radio check, how do you read?",
      "Approach: ANAC123, if you read, squawk ident.",
      "Tower: ANAC123, your transmission barely readable, say again.",
      "Control: ANAC123, radar shows seven six zero zero, traffic cleared from your approach.",
      "Tower: ANAC123, if you read, cleared to land runway one one."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan Pan, Guarulhos Approach, ANAC123, complete radio failure.",
      "Mayday Mayday Mayday, ANAC123, lost radio contact, squawking seven six zero zero.",
      "ANAC123, complete radio failure, squawking seven six zero zero.",
      "Pan Pan Pan Pan, ANAC123, loss of radio contact, request vectors on this frequency.",
      "ANAC123, radio failure, your transmission readable five by five, proceeding as cleared."
    ],
    "brazilianMistakes": "- ❌ Saying \"sem rádio\" instead of standard English.  \n  ✔ Use complete radio failure or loss of radio contact.\n\n- ❌ Forgetting to squawk 7600.  \n  ✔ Squawk seven six zero zero immediately when radio failure is confirmed.\n\n- ❌ Declaring Mayday for radio failure alone without an underlying emergency.  \n  ✔ Follow lost comm procedures; use Pan Pan if partial comm is restored.\n\n- ❌ Saying \"squawk seventy-six hundred\" instead of digit by digit.  \n  ✔ Say squawking seven six zero zero — each digit separately.",
    "pronunciationCoaching": "**Target Phrase:** Squawking Seven Six Zero Zero\n\n**Pronunciation:** SKWAW-king SEV-en six ZEE-roh ZEE-roh\n\n**Word Stress**\n\n- Squawking → SKWAW-king\n- Seven → SEV-en\n- Zero → ZEE-roh (say each digit: seven, six, zero, zero)\n\nPractice:\n\nSeven... six... zero... zero...\n\nTogether:\n\nANAC123, complete radio failure, squawking seven six zero zero.\n\nSpeak each digit clearly — controllers listen for 7600.",
    "relatedConcepts": [
      "Lost Communications",
      "Squawk 7600",
      "Pan Pan Urgency Call",
      "Mayday Distress Call",
      "Transponder Codes",
      "Electrical Failure"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Lost Communication Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Radio Failure",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Lost Communication Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Radio Failure",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Loss of Communication",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0055",
    "id": "0055",
    "displayTerm": "Lost Communications",
    "term": "lost communications",
    "slug": "lost-communications",
    "category": "Radio Communication",
    "meaningEn": "Lost Communications is the state in which two-way radio contact between aircraft and ATC cannot be established or maintained.",
    "meaningPt": "Comunicações perdidas.\n\nSituação em que o contato bilateral de rádio entre aeronave e ATC não pode ser estabelecido ou mantido.",
    "whenUsed": "When Lost Communications occurs, the pilot should:",
    "example": "Approach: ANAC123, radio check, how do you read?",
    "sayPhrase": "Mayday Mayday Mayday, ANAC123, lost radio contact, squawking seven six zero zero.",
    "icaoQuestion": "What is the correct procedure when you lose two-way radio communication with ATC?",
    "icaoSpeakText": "I would attempt contact on the assigned frequency and on one two one point five. If unsuccessful, I would squawk seven six zero zero on the transponder. I would follow my last received and acknowledged clearance, comply with ICAO lost communication procedures, and land at the nearest suitable airport as soon as practicable if in VMC. When communication is restored, I would inform ATC immediately.",
    "missionBrief": "Today's lesson covers lost communications procedures — what happens when ATC and the pilot cannot communicate.\n\nLost Communications means two-way radio contact has been lost — by failure, interference, or frequency error.\n\nYou must squawk 7600, follow your last clearance, and comply with ICAO lost communication procedures.\n\nControllers will clear traffic and monitor your transponder.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Lost communications is a procedure — not a panic.\n\nThe sequence every professional pilot learns:\n\nTry. Squawk. Comply.\n\nTry assigned frequency.\n\nTry one two one point five — guard.\n\nSquawk 7600.\n\nComply with last clearance.\n\nBrazilian pilots sometimes fly the wrong frequency for minutes before noticing.\n\nCheck your radio panel before assuming failure.\n\nBrazilian pilots sometimes say \"perdi contato\" on frequency when they regain comm.\n\nUse lost radio contact or loss of radio contact — ICAO standard terms.\n\nKnow the difference:\n\nRadio Failure — equipment broken.\n\nLost Communications — two-way contact lost — may be equipment, frequency, or coverage.\n\nBoth use squawk 7600.\n\nWhen you regain contact, inform ATC and cancel 7600.\n\nState how long you were out and what you did.\n\nControllers need that information for traffic management.",
    "operationalContext": "You are being vectored to Navegantes in your H130, callsign ANAC123, when you lose all radio contact.\n\nYou try the assigned frequency and one two one point five without response.\n\nYou squawk 7600 and continue on your last assigned heading and altitude.\n\nApproach sees the 7600 code and clears traffic from your path.\n\nYou proceed to Navegantes, join the circuit, and land runway two nine.\n\nYou report the lost communications event on the ground.",
    "sayItCoach": "ANAC123, lost radio contact, squawking seven six zero zero.",
    "icaoModelAnswer": "I would attempt contact on the assigned frequency and on one two one point five. If unsuccessful, I would squawk seven six zero zero on the transponder. I would follow my last received and acknowledged clearance, comply with ICAO lost communication procedures, and land at the nearest suitable airport as soon as practicable if in VMC. When communication is restored, I would inform ATC immediately.",
    "memoryTrick": "**COMMS** — **C**heck frequency and guard, **O**ut with seven six zero zero, **M**aintain last clearance, **M**onitor radar and traffic, **S**peak when restored.",
    "operationalMeaning": "When Lost Communications occurs, the pilot should:\n\nLost Communications procedures commonly include:",
    "whyAtcUsesIt": [
      "identifying aircraft squawking 7600 on radar",
      "clearing traffic from the aircraft's expected route",
      "monitoring the aircraft to the destination or alternate",
      "coordinating with adjacent sectors without requiring radio contact",
      "preparing for unannounced arrival and landing"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, radio check, how do you read?",
      "Tower: ANAC123, if you read, squawk ident.",
      "Control: ANAC123, radar contact lost, attempting contact on guard frequency.",
      "Tower: ANAC123, showing seven six zero zero, traffic cleared from your approach.",
      "Approach: ANAC123, if you read, cleared direct Navegantes, descend three thousand."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, ANAC123, lost radio contact, squawking seven six zero zero.",
      "Pan Pan Pan Pan, ANAC123, complete radio failure, squawking seven six zero zero.",
      "ANAC123, loss of radio contact, proceeding as cleared, squawking seven six zero zero.",
      "Navegantes Approach, ANAC123, radio restored, cancel seven six zero zero.",
      "ANAC123, lost communications, squawking seven six zero zero, proceeding direct Navegantes."
    ],
    "brazilianMistakes": "- ❌ Not trying guard frequency one two one point five.  \n  ✔ Attempt one two one point five before assuming complete failure.\n\n- ❌ Forgetting to squawk 7600.  \n  ✔ Squawk seven six zero zero — ATC identifies lost comm aircraft by this code.\n\n- ❌ Deviating from last clearance without authority.  \n  ✔ Follow last received and acknowledged clearance per lost comm procedures.\n\n- ❌ Not reporting the event after regaining communication.  \n  ✔ Inform ATC when radio is restored and state actions taken during lost comm.",
    "pronunciationCoaching": "**Target Phrase:** Lost Radio Contact, Squawking Seven Six Zero Zero\n\n**Pronunciation:** lost RAY-dee-oh KON-takt, SKWAW-king SEV-en six ZEE-roh ZEE-roh\n\n**Word Stress**\n\n- Lost → lost\n- Contact → KON-takt\n- Squawking → SKWAW-king\n\nPractice:\n\nSeven... six... zero... zero...\n\nTogether:\n\nANAC123, lost radio contact, squawking seven six zero zero.\n\nSpeak each digit clearly — seven six zero zero, not seventy-six hundred.",
    "relatedConcepts": [
      "Radio Failure",
      "Squawk 7600",
      "Pan Pan Urgency Call",
      "Mayday Distress Call",
      "Transponder Codes",
      "Guard Frequency 121.5"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Lost Communication Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Lost Communications",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA JO 7110.65 — Lost Communication Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/atc_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Lost Communications",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "SKYbrary — Loss of Communication",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0056",
    "id": "0056",
    "displayTerm": "Alternator Failure",
    "term": "alternator failure",
    "slug": "alternator-failure",
    "category": "Aircraft Systems",
    "meaningEn": "Alternator Failure is the loss of alternator output, requiring the aircraft to operate on battery power with reduced electrical endurance.",
    "meaningPt": "Falha do alternador.\n\nPerda da produção de energia pelo alternador, exigindo operação com bateria e tempo elétrico limitado.",
    "whenUsed": "When Alternator Failure occurs, the pilot should:",
    "example": "Approach: ANAC123, roger Pan Pan, say battery endurance and souls on board.",
    "sayPhrase": "Pan Pan Pan Pan, Navegantes Approach, ANAC123, alternator failure, operating on battery power.",
    "icaoQuestion": "What would you tell ATC if your alternator failed during cruise?",
    "icaoSpeakText": "After securing the aircraft, I would declare Pan Pan Pan Pan, state my callsign, report alternator failure and that I am operating on battery power, state my position, and request vectors to the nearest suitable airport. I would upgrade to Mayday if battery endurance becomes critical. I would provide souls on board and fuel remaining when ATC requests.",
    "missionBrief": "Today's lesson covers a common electrical systems problem in flight.\n\nAlternator Failure means the alternator has stopped producing electrical power — the aircraft must rely on battery power until the alternator is restored or the flight ends.\n\nIn the H130, the alternator charges the battery and powers avionics, instruments, and radios during normal operation.\n\nA failed alternator does not always mean immediate catastrophe — but battery time is limited.\n\nYou must aviate first, monitor electrical load, then communicate with the correct urgency call.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Alternator failure is often manageable — if you act early.\n\nThe sequence every professional pilot learns:\n\nAviate. Shed. Communicate.\n\nFly the aircraft first.\n\nReduce electrical load — radios and essential instruments only.\n\nMonitor battery voltage.\n\nThen declare your urgency.\n\nA healthy battery with a nearby airport — Pan Pan.\n\nCritically low battery or total electrical loss — Mayday.\n\nBrazilian pilots sometimes say \"alternador queimou\" or \"caiu o alternador\" on frequency.\n\nUse alternator failure or alternator out — ICAO standard terms.\n\nIn the H130, know your battery endurance from the flight manual.\n\nDo not wait until the radios fail to call ATC.\n\nTrain the reflex so your radio call comes from a stable aircraft with a plan, not a surprised voice.",
    "operationalContext": "You are cruising at two thousand feet in your H130 on a charter from Joinville to Navegantes.\n\nThe alternator failure warning illuminates and battery voltage begins to drop.\n\nYou shed non-essential electrical load and maintain stable flight.\n\nWhen stable, you transmit:\n\nPan Pan Pan Pan, Navegantes Approach, ANAC123, alternator failure, operating on battery power, request vectors to Navegantes.\n\nApproach clears traffic and provides direct routing.\n\nYou complete a precautionary landing before battery endurance becomes critical.",
    "sayItCoach": "Pan Pan Pan Pan, Navegantes Approach, ANAC123, alternator failure, operating on battery power.",
    "icaoModelAnswer": "After securing the aircraft, I would declare Pan Pan Pan Pan, state my callsign, report alternator failure and that I am operating on battery power, state my position, and request vectors to the nearest suitable airport. I would upgrade to Mayday if battery endurance becomes critical. I would provide souls on board and fuel remaining when ATC requests.",
    "memoryTrick": "**CHARGE** — **C**ontrol the aircraft, **H**ead for nearest airport, **A**nnounce Pan Pan or Mayday, **R**educe electrical load, **G**auge battery voltage, **E**ndurance — know your time limit.",
    "operationalMeaning": "When Alternator Failure occurs, the pilot should:\n\nAlternator Failure reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear traffic from the aircraft's route",
      "provide vectors to the nearest suitable airport",
      "coordinate priority landing if battery endurance is critical",
      "request souls on board and fuel remaining",
      "alert airport authorities if distress is declared"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, roger Pan Pan, say battery endurance and souls on board.",
      "Approach: ANAC123, turn right heading zero nine zero, descend at your discretion, Navegantes one five miles.",
      "Tower: ANAC123, all traffic cleared from your approach, runway two nine cleared to land.",
      "Tower: ANAC123, wind two seven zero at one zero knots, report final.",
      "Departure: ANAC123, say nature of electrical problem and intentions."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan Pan, Navegantes Approach, ANAC123, alternator failure, operating on battery power.",
      "Pan Pan Pan Pan, ANAC123, alternator out, request vectors to Joinville.",
      "Mayday Mayday Mayday, Florianópolis Tower, ANAC123, alternator failure, battery critically low, request immediate landing.",
      "ANAC123, alternator failure, souls on board three, battery endurance approximately twenty minutes.",
      "Tower, ANAC123, alternator failure, operating on battery, request priority landing."
    ],
    "brazilianMistakes": "- ❌ Waiting until the battery is dead before calling ATC.  \n  ✔ Declare early — battery endurance is limited.\n\n- ❌ Saying \"alternador parou\" instead of standard English.  \n  ✔ Use alternator failure or alternator out.\n\n- ❌ Not reducing non-essential electrical load.  \n  ✔ Shed load to extend battery endurance.\n\n- ❌ Forgetting to state operating on battery power.  \n  ✔ Tell ATC you are on battery — it explains urgency.",
    "pronunciationCoaching": "**Target Phrase:** Pan Pan Pan Pan, Alternator Failure, Operating on Battery Power\n\n**Pronunciation:** pan pan pan pan, AWL-ter-nay-ter FAIL-yer, OP-er-ay-ting on BAT-ter-ee POW-er\n\n**Word Stress**\n\n- Alternator → AWL-ter-nay-ter\n- Failure → FAIL-yer\n- Battery → BAT-ter-ee\n\nPractice:\n\nPan... Pan... Pan... Pan...\n\nTogether:\n\nPan Pan Pan Pan, Navegantes Approach, ANAC123, alternator failure, operating on battery power.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Electrical Failure",
      "Generator Failure",
      "Battery Failure",
      "Pan Pan Urgency Call",
      "Mayday Distress Call",
      "Precautionary Landing"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Electrical System Malfunctions",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Alternator",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "Airbus Helicopters H130 Flight Manual — Electrical System"
      },
      {
        "label": "SKYbrary — Electrical Problems",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0057",
    "id": "0057",
    "displayTerm": "Generator Failure",
    "term": "generator failure",
    "slug": "generator-failure",
    "category": "Aircraft Systems",
    "meaningEn": "Generator Failure is the loss of generator output, requiring operation on battery power with limited electrical endurance.",
    "meaningPt": "Falha do gerador.\n\nPerda da produção de energia pelo gerador, exigindo operação com bateria e tempo elétrico limitado.",
    "whenUsed": "When Generator Failure occurs, the pilot should:",
    "example": "Approach: ANAC123, roger Pan Pan, say battery endurance and souls on board.",
    "sayPhrase": "Pan Pan Pan Pan, Curitiba Approach, ANAC123, generator failure, operating on battery power.",
    "icaoQuestion": "What is the difference between generator failure and total electrical failure?",
    "icaoSpeakText": "Generator failure means the generator has stopped producing power, but the aircraft may still operate on battery with limited endurance. Total electrical failure means all electrical power is lost, including battery, which is more serious. For generator failure, I would declare Pan Pan, report operating on battery power, and request vectors to the nearest suitable airport. I would upgrade to Mayday if battery endurance becomes critical or essential systems fail.",
    "missionBrief": "Today's lesson covers generator failure — a critical electrical systems event.\n\nGenerator Failure means the aircraft's primary electrical generator has stopped producing power — the aircraft must operate on battery or alternate power sources.\n\nIn the H130, the generator supplies electrical power for avionics, instruments, and communication equipment during flight.\n\nWithout generator output, battery endurance becomes your limiting factor.\n\nYou must aviate first, manage electrical load, then communicate with the correct urgency call.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Generator failure and alternator failure feel similar on the radio.\n\nBoth mean you are losing electrical endurance.\n\nThe sequence every professional pilot learns:\n\nAviate. Load-shed. Communicate.\n\nFly the aircraft first.\n\nTurn off everything non-essential.\n\nKnow your battery time from the flight manual.\n\nThen declare your urgency.\n\nBrazilian pilots sometimes say \"gerador caiu\" or \"perdeu o gerador\" on frequency.\n\nUse generator failure or generator out — ICAO standard terms.\n\nDo not confuse generator failure with total electrical failure.\n\nGenerator out on battery — Pan Pan.\n\nTotal electrical loss with no instruments — Mayday.\n\nTrain the assessment reflex so your radio call comes from a stable aircraft with a plan.",
    "operationalContext": "You are on a cross-country flight at three thousand feet in your H130 from Curitiba toward Londrina.\n\nThe generator failure light illuminates and electrical bus voltage drops.\n\nYou reduce non-essential load and maintain stable flight.\n\nWhen stable, you transmit:\n\nPan Pan Pan Pan, Curitiba Approach, ANAC123, generator failure, operating on battery power, request vectors to Londrina.\n\nApproach acknowledges and provides direct routing.\n\nYou land at Londrina before battery endurance becomes critical.",
    "sayItCoach": "Pan Pan Pan Pan, Curitiba Approach, ANAC123, generator failure, operating on battery power.",
    "icaoModelAnswer": "Generator failure means the generator has stopped producing power, but the aircraft may still operate on battery with limited endurance. Total electrical failure means all electrical power is lost, including battery, which is more serious. For generator failure, I would declare Pan Pan, report operating on battery power, and request vectors to the nearest suitable airport. I would upgrade to Mayday if battery endurance becomes critical or essential systems fail.",
    "memoryTrick": "**POWER** — **P**ilot flies first, **O**ff with non-essential load, **W**atch battery voltage, **E**xplain to ATC, **R**equest vectors to nearest airport.",
    "operationalMeaning": "When Generator Failure occurs, the pilot should:\n\nGenerator Failure reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear traffic from the aircraft's route",
      "provide vectors to the nearest suitable airport",
      "coordinate priority landing if battery endurance is critical",
      "request souls on board and fuel remaining",
      "alert airport authorities if distress is declared"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, roger Pan Pan, say battery endurance and souls on board.",
      "Approach: ANAC123, turn left heading two four zero, descend two thousand five hundred, Londrina two zero miles.",
      "Tower: ANAC123, runway one eight cleared to land, wind calm.",
      "Tower: ANAC123, emergency services notified, report final.",
      "Departure: ANAC123, say nature of electrical problem and intentions."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan Pan, Curitiba Approach, ANAC123, generator failure, operating on battery power.",
      "Pan Pan Pan Pan, ANAC123, generator out, request vectors to Curitiba.",
      "Mayday Mayday Mayday, Londrina Tower, ANAC123, generator failure, battery critically low, request immediate landing.",
      "ANAC123, generator failure, souls on board two, battery endurance approximately fifteen minutes.",
      "Tower, ANAC123, generator failure, operating on battery, request priority landing."
    ],
    "brazilianMistakes": "- ❌ Using \"gerador queimou\" instead of standard English.  \n  ✔ Use generator failure or generator out.\n\n- ❌ Not distinguishing generator failure from total electrical failure.  \n  ✔ Generator out on battery is urgency; total loss may be distress.\n\n- ❌ Forgetting to report operating on battery power.  \n  ✔ State battery operation — ATC needs to know your endurance.\n\n- ❌ Delaying the call until radios fail.  \n  ✔ Declare early while communication is still reliable.",
    "pronunciationCoaching": "**Target Phrase:** Pan Pan Pan Pan, Generator Failure, Operating on Battery Power\n\n**Pronunciation:** pan pan pan pan, JEN-er-ay-ter FAIL-yer, OP-er-ay-ting on BAT-ter-ee POW-er\n\n**Word Stress**\n\n- Generator → JEN-er-ay-ter\n- Failure → FAIL-yer\n- Operating → OP-er-ay-ting\n\nPractice:\n\nPan... Pan... Pan... Pan...\n\nTogether:\n\nPan Pan Pan Pan, Curitiba Approach, ANAC123, generator failure, operating on battery power.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Alternator Failure",
      "Electrical Failure",
      "Battery Failure",
      "Pan Pan Urgency Call",
      "Mayday Distress Call",
      "Precautionary Landing"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Electrical System Malfunctions",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Generator",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "Airbus Helicopters H130 Flight Manual — Electrical System"
      },
      {
        "label": "SKYbrary — Electrical Problems",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0058",
    "id": "0058",
    "displayTerm": "Battery Failure",
    "term": "battery failure",
    "slug": "battery-failure",
    "category": "Aircraft Systems",
    "meaningEn": "Battery Failure is the inability of the aircraft battery to supply adequate electrical power, threatening loss of communication and essential avionics.",
    "meaningPt": "Falha da bateria.\n\nIncapacidade da bateria de fornecer energia elétrica adequada, ameaçando perda de comunicação e aviônicos essenciais.",
    "whenUsed": "When Battery Failure occurs, the pilot should:",
    "example": "Approach: ANAC123, Mayday acknowledged, turn left heading three six zero, Congonhas five miles, descend at pilot's discretion.",
    "sayPhrase": "Mayday Mayday Mayday, São Paulo Approach, ANAC123, battery failure, request immediate landing Congonhas.",
    "icaoQuestion": "What would you do if your battery failed after a generator failure in flight?",
    "icaoSpeakText": "I would maintain aircraft control, declare Mayday Mayday Mayday immediately, state battery failure and that generator previously failed, report souls on board, and request immediate vectors to the nearest suitable airport. I would squawk seven seven zero zero if possible. I would use remaining radio power to confirm intentions before possible loss of communication.",
    "missionBrief": "Today's lesson covers battery failure — when your last electrical reserve is gone.\n\nBattery Failure means the aircraft battery can no longer supply adequate electrical power — radios, instruments, and essential avionics may fail.\n\nIn the H130, the battery is the backup when the generator or alternator fails.\n\nIf the battery also fails, you may lose communication capability entirely.\n\nYou must aviate first, use remaining power wisely, then communicate before you go silent.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Battery failure is the end of your electrical runway.\n\nIf generator or alternator already failed, this is Mayday — not Pan Pan.\n\nThe sequence every professional pilot learns:\n\nAviate. Transmit. Proceed.\n\nFly the aircraft first.\n\nUse every second of remaining radio power.\n\nDeclare Mayday immediately.\n\nState souls on board.\n\nRequest immediate landing.\n\nBrazilian pilots sometimes say \"bateria acabou\" or \"morreu a bateria\" on frequency.\n\nUse battery failure or battery critically low — ICAO standard terms.\n\nIf you lose radio before landing, squawk 7700 if the transponder still works.\n\nATC will see you and clear traffic.\n\nTrain the reflex to call Mayday before silence — not after.",
    "operationalContext": "You are ten miles south of Congonhas at one thousand two hundred feet in your H130.\n\nThe generator failed twenty minutes ago. Now battery voltage collapses and warning lights flash.\n\nYou have seconds of radio power remaining.\n\nYou transmit immediately:\n\nMayday Mayday Mayday, São Paulo Approach, ANAC123, battery failure, generator previously failed, request immediate vectors to Congonhas.\n\nApproach clears traffic and vectors you direct.\n\nYou land at Congonhas as the last radio transmission fades.",
    "sayItCoach": "Mayday Mayday Mayday, São Paulo Approach, ANAC123, battery failure, request immediate landing.",
    "icaoModelAnswer": "I would maintain aircraft control, declare Mayday Mayday Mayday immediately, state battery failure and that generator previously failed, report souls on board, and request immediate vectors to the nearest suitable airport. I would squawk seven seven zero zero if possible. I would use remaining radio power to confirm intentions before possible loss of communication.",
    "memoryTrick": "**DEAD** — **D**eclare Mayday immediately, **E**ssential radios only, **A**im for nearest airport, **D**o not wait for silence.",
    "operationalMeaning": "When Battery Failure occurs, the pilot should:\n\nBattery Failure reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear all traffic from the aircraft's route immediately",
      "provide vectors to the nearest suitable airport",
      "prepare for possible loss of radio contact",
      "coordinate emergency services on the ground",
      "monitor transponder if still operational"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, Mayday acknowledged, turn left heading three six zero, Congonhas five miles, descend at pilot's discretion.",
      "Approach: ANAC123, all traffic cleared, say souls on board.",
      "Tower: ANAC123, runway one seven cleared to land, emergency services standing by.",
      "Tower: ANAC123, wind three five zero at zero eight knots, report final if able.",
      "Approach: ANAC123, radar contact, if you read, squawk ident."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, São Paulo Approach, ANAC123, battery failure, request immediate landing Congonhas.",
      "Mayday Mayday Mayday, ANAC123, battery critically low, possible loss of radio contact, souls on board four.",
      "Pan Pan Pan Pan, ANAC123, battery voltage low, generator failure, request vectors to nearest airport.",
      "ANAC123, battery failure, squawking seven seven zero zero, proceeding direct Congonhas.",
      "Tower, ANAC123, battery failure, on final runway one seven, unable to maintain radio much longer."
    ],
    "brazilianMistakes": "- ❌ Treating battery failure as minor urgency after generator failure.  \n  ✔ Battery failure after generator loss is distress — Mayday.\n\n- ❌ Saying \"bateria fraca\" instead of standard English.  \n  ✔ Use battery failure or battery critically low.\n\n- ❌ Waiting to call ATC until the radio dies.  \n  ✔ Transmit Mayday while communication still works.\n\n- ❌ Forgetting to squawk 7700 when radio may fail.  \n  ✔ Squawk seven seven zero zero — ATC tracks you without voice.",
    "pronunciationCoaching": "**Target Phrase:** Mayday Mayday Mayday, Battery Failure, Request Immediate Landing\n\n**Pronunciation:** MAY-day MAY-day MAY-day, BAT-ter-ee FAIL-yer, ree-KWEST im-MEE-dee-it LAN-ding\n\n**Word Stress**\n\n- Battery → BAT-ter-ee\n- Failure → FAIL-yer\n- Immediate → im-MEE-dee-it\n\nPractice:\n\nMayday... Mayday... Mayday...\n\nTogether:\n\nMayday Mayday Mayday, São Paulo Approach, ANAC123, battery failure, request immediate landing.\n\nSpeak with urgency but clearly — every word must be understood.",
    "relatedConcepts": [
      "Generator Failure",
      "Alternator Failure",
      "Electrical Failure",
      "Mayday Distress Call",
      "Squawk 7700",
      "Emergency Landing"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Electrical System Malfunctions",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Battery",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "Airbus Helicopters H130 Flight Manual — Electrical System"
      },
      {
        "label": "SKYbrary — Electrical Problems",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0059",
    "id": "0059",
    "displayTerm": "Oil Pressure Warning",
    "term": "oil pressure warning",
    "slug": "oil-pressure-warning",
    "category": "Aircraft Systems",
    "meaningEn": "Oil Pressure Warning is an indication that engine oil pressure has fallen below safe operating limits, threatening engine damage or failure.",
    "meaningPt": "Alerta de pressão de óleo.\n\nIndicação de que a pressão de óleo do motor caiu abaixo dos limites seguros de operação.",
    "whenUsed": "When Oil Pressure Warning occurs, the pilot should:",
    "example": "Approach: ANAC123, roger Pan Pan, say oil pressure reading and souls on board.",
    "sayPhrase": "Pan Pan Pan Pan, Florianópolis Approach, ANAC123, low oil pressure, reducing power.",
    "icaoQuestion": "What would you tell ATC if you received an oil pressure warning during cruise?",
    "icaoSpeakText": "After securing the aircraft, I would declare Pan Pan Pan Pan or Mayday depending on severity, state my callsign, report low oil pressure or oil pressure warning, describe that I am reducing power and monitoring engine parameters, and request vectors to the nearest suitable airport. I would upgrade to Mayday if engine failure appears imminent. I would provide souls on board and fuel remaining when ATC requests.",
    "missionBrief": "Today's lesson covers one of the most serious engine warnings in flight.\n\nOil Pressure Warning means oil pressure has dropped below safe limits — the engine may seize if lubrication is lost.\n\nIn the H130, the turboshaft engine depends on continuous oil pressure for cooling and lubrication.\n\nA low oil pressure warning demands immediate action and clear communication.\n\nYou must aviate first, reduce power if required, then communicate with the correct urgency call.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Oil pressure is the lifeblood of your engine.\n\nWithout it, metal eats metal.\n\nThe sequence every professional pilot learns:\n\nAviate. Reduce. Communicate.\n\nFly the aircraft first.\n\nReduce power to reduce engine load.\n\nWatch pressure and temperature together.\n\nThen declare your urgency.\n\nRapid drop with high temperature — Mayday.\n\nLow but stable — Pan Pan.\n\nBrazilian pilots sometimes say \"pressão de óleo baixa\" or \"óleo caindo\" on frequency.\n\nUse low oil pressure or oil pressure warning — ICAO standard terms.\n\nIn the H130, do not ignore a flickering oil pressure light.\n\nA seized engine in a helicopter is a very bad day.\n\nTrain the reflex to reduce power and call ATC from a stable aircraft.",
    "operationalContext": "You are cruising at two thousand five hundred feet in your H130 over the coast near Florianópolis.\n\nThe oil pressure warning illuminates and the gauge shows pressure dropping toward the red line.\n\nYou reduce collective and monitor engine parameters.\n\nWhen stable, you transmit:\n\nPan Pan Pan Pan, Florianópolis Approach, ANAC123, low oil pressure, reducing power, request vectors to Florianópolis.\n\nApproach clears traffic and provides direct routing.\n\nOil pressure stabilizes at a low but manageable level.\n\nYou complete a precautionary landing and report safe on the ground.",
    "sayItCoach": "Pan Pan Pan Pan, Florianópolis Approach, ANAC123, low oil pressure, reducing power.",
    "icaoModelAnswer": "After securing the aircraft, I would declare Pan Pan Pan Pan or Mayday depending on severity, state my callsign, report low oil pressure or oil pressure warning, describe that I am reducing power and monitoring engine parameters, and request vectors to the nearest suitable airport. I would upgrade to Mayday if engine failure appears imminent. I would provide souls on board and fuel remaining when ATC requests.",
    "memoryTrick": "**OIL** — **O**bserve the gauge, **I**mmediate power reduction, **L**and at nearest suitable airport.",
    "operationalMeaning": "When Oil Pressure Warning occurs, the pilot should:\n\nOil Pressure Warning reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear traffic from the aircraft's route",
      "provide vectors to the nearest suitable airport",
      "coordinate priority landing and emergency services",
      "request souls on board and fuel remaining",
      "prepare for possible engine failure on approach"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, roger Pan Pan, say oil pressure reading and souls on board.",
      "Approach: ANAC123, turn right heading one eight zero, descend two thousand, Florianópolis one zero miles.",
      "Tower: ANAC123, runway one four cleared to land, emergency services standing by.",
      "Tower: ANAC123, wind one six zero at one two knots, report final.",
      "Departure: ANAC123, say nature of engine problem and intentions."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan Pan, Florianópolis Approach, ANAC123, low oil pressure, reducing power.",
      "Mayday Mayday Mayday, ANAC123, oil pressure warning, engine may fail, request immediate landing.",
      "Pan Pan Pan Pan, ANAC123, oil pressure decreasing, request vectors to Navegantes.",
      "ANAC123, low oil pressure, souls on board three, request priority landing.",
      "Tower, ANAC123, oil pressure warning, precautionary landing runway one four."
    ],
    "brazilianMistakes": "- ❌ Ignoring a brief oil pressure flicker.  \n  ✔ Any oil pressure warning demands immediate attention.\n\n- ❌ Saying \"pressão do óleo\" instead of standard English.  \n  ✔ Use low oil pressure or oil pressure warning.\n\n- ❌ Maintaining full power with low oil pressure.  \n  ✔ Reduce power per flight manual procedures.\n\n- ❌ Not monitoring oil temperature alongside pressure.  \n  ✔ Rising temperature with falling pressure indicates imminent failure.",
    "pronunciationCoaching": "**Target Phrase:** Pan Pan Pan Pan, Low Oil Pressure, Reducing Power\n\n**Pronunciation:** pan pan pan pan, loh oyl PRESH-er, ree-DOOS-ing POW-er\n\n**Word Stress**\n\n- Pressure → PRESH-er\n- Reducing → ree-DOOS-ing\n- Warning → WOR-ning\n\nPractice:\n\nPan... Pan... Pan... Pan...\n\nTogether:\n\nPan Pan Pan Pan, Florianópolis Approach, ANAC123, low oil pressure, reducing power.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Oil Temperature High",
      "Engine Failure",
      "Chip Warning",
      "Pan Pan Urgency Call",
      "Mayday Distress Call",
      "Precautionary Landing"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Engine Failure Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Oil Pressure",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "Airbus Helicopters H130 Flight Manual — Engine Oil System"
      },
      {
        "label": "SKYbrary — Engine Oil System",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0060",
    "id": "0060",
    "displayTerm": "Oil Temperature High",
    "term": "oil temperature high",
    "slug": "oil-temperature-high",
    "category": "Aircraft Systems",
    "meaningEn": "Oil Temperature High is an indication that engine oil temperature has risen above safe operating limits, threatening engine damage or failure.",
    "meaningPt": "Temperatura de óleo alta.\n\nIndicação de que a temperatura do óleo do motor excedeu os limites seguros de operação.",
    "whenUsed": "When Oil Temperature High occurs, the pilot should:",
    "example": "Tower: ANAC123, roger Pan Pan, say oil temperature and souls on board.",
    "sayPhrase": "Pan Pan Pan Pan, São Paulo Tower, ANAC123, high oil temperature, reducing power.",
    "icaoQuestion": "What would you do if oil temperature became high during a hover operation?",
    "icaoSpeakText": "I would maintain aircraft control, reduce power, transition to forward flight to improve engine cooling, and monitor oil temperature and pressure. I would declare Pan Pan Pan Pan or Mayday depending on severity, report high oil temperature, and request landing at the nearest suitable location. I would upgrade to Mayday if temperature continues rising or engine parameters deteriorate.",
    "missionBrief": "Today's lesson covers high oil temperature — a warning that your engine is overheating.\n\nOil Temperature High means engine oil temperature has exceeded safe operating limits — lubrication efficiency drops and engine damage becomes likely.\n\nIn the H130, the turboshaft engine generates significant heat during high-power operations.\n\nSustained high oil temperature can lead to engine failure if not managed promptly.\n\nYou must aviate first, reduce power, then communicate with the correct urgency call.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "High oil temperature in a helicopter often comes from sustained high power.\n\nHovering on a hot day is a classic trigger.\n\nThe sequence every professional pilot learns:\n\nAviate. Cool. Communicate.\n\nFly the aircraft first.\n\nReduce power and gain airspeed if possible.\n\nAirflow cools the engine.\n\nWatch oil pressure alongside temperature.\n\nThen declare your urgency.\n\nRapid rise with falling pressure — Mayday.\n\nHigh but responding to reduction — Pan Pan.\n\nBrazilian pilots sometimes say \"óleo quente\" or \"temperatura alta\" on frequency.\n\nUse high oil temperature or oil temperature warning — ICAO standard terms.\n\nDo not hover indefinitely with a rising oil temperature gauge.\n\nLand and investigate.\n\nTrain the reflex to transition to forward flight and call ATC early.",
    "operationalContext": "You are in a hover-taxi operation near Congonhas helipad in your H130 on a hot afternoon.\n\nOil temperature rises into the caution range and the warning activates.\n\nYou transition to forward flight, reduce power, and gain airspeed for cooling.\n\nWhen stable, you transmit:\n\nPan Pan Pan Pan, São Paulo Tower, ANAC123, high oil temperature, reducing power, request landing Congonhas helipad.\n\nTower clears the area and approves immediate landing.\n\nOil temperature decreases during the approach.\n\nYou land safely and shut down for inspection.",
    "sayItCoach": "Pan Pan Pan Pan, São Paulo Tower, ANAC123, high oil temperature, reducing power.",
    "icaoModelAnswer": "I would maintain aircraft control, reduce power, transition to forward flight to improve engine cooling, and monitor oil temperature and pressure. I would declare Pan Pan Pan Pan or Mayday depending on severity, report high oil temperature, and request landing at the nearest suitable location. I would upgrade to Mayday if temperature continues rising or engine parameters deteriorate.",
    "memoryTrick": "**HEAT** — **H**over less, gain **E**forward flight, **A**nnounce Pan Pan or Mayday, **T**emperature — watch the gauge.",
    "operationalMeaning": "When Oil Temperature High occurs, the pilot should:\n\nOil Temperature High reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear traffic from the aircraft's route",
      "provide vectors to the nearest suitable airport",
      "coordinate priority landing and emergency services",
      "request souls on board and fuel remaining",
      "prepare for possible engine failure on approach"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, roger Pan Pan, say oil temperature and souls on board.",
      "Tower: ANAC123, cleared direct helipad, all traffic cleared from your approach.",
      "Approach: ANAC123, turn left heading two seven zero, descend at pilot's discretion.",
      "Tower: ANAC123, wind calm, cleared to land helipad.",
      "Departure: ANAC123, say nature of engine problem and intentions."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan Pan, São Paulo Tower, ANAC123, high oil temperature, reducing power.",
      "Mayday Mayday Mayday, ANAC123, oil temperature warning, engine may fail, request immediate landing.",
      "Pan Pan Pan Pan, ANAC123, oil temperature high, request vectors to nearest airport.",
      "ANAC123, high oil temperature, souls on board two, request priority landing.",
      "Tower, ANAC123, oil temperature decreasing, proceeding direct helipad."
    ],
    "brazilianMistakes": "- ❌ Continuing to hover with rising oil temperature.  \n  ✔ Transition to forward flight or land to reduce engine load.\n\n- ❌ Saying \"óleo quente demais\" instead of standard English.  \n  ✔ Use high oil temperature or oil temperature warning.\n\n- ❌ Ignoring oil temperature because pressure looks normal.  \n  ✔ Monitor both — high temperature with normal pressure can still damage the engine.\n\n- ❌ Delaying the call until engine failure.  \n  ✔ Declare early while the engine still responds to power reduction.",
    "pronunciationCoaching": "**Target Phrase:** Pan Pan Pan Pan, High Oil Temperature, Reducing Power\n\n**Pronunciation:** pan pan pan pan, hy oyl TEM-per-uh-cher, ree-DOOS-ing POW-er\n\n**Word Stress**\n\n- Temperature → TEM-per-uh-cher\n- Reducing → ree-DOOS-ing\n- High → hy\n\nPractice:\n\nPan... Pan... Pan... Pan...\n\nTogether:\n\nPan Pan Pan Pan, São Paulo Tower, ANAC123, high oil temperature, reducing power.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Oil Pressure Warning",
      "Engine Failure",
      "Chip Warning",
      "Pan Pan Urgency Call",
      "Mayday Distress Call",
      "Precautionary Landing"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Engine Failure Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Oil Temperature",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "Airbus Helicopters H130 Flight Manual — Engine Oil System"
      },
      {
        "label": "SKYbrary — Engine Oil System",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0061",
    "id": "0061",
    "displayTerm": "Chip Warning",
    "term": "chip warning",
    "slug": "chip-warning",
    "category": "Aircraft Systems",
    "meaningEn": "Chip Warning is an indication that ferrous metal particles have been detected in the engine or gearbox oil, suggesting internal mechanical damage.",
    "meaningPt": "Alerta de detecção de partículas metálicas.\n\nIndicação de que partículas metálicas ferrosas foram detectadas no óleo do motor ou da caixa de engrenagens.",
    "whenUsed": "When Chip Warning occurs, the pilot should:",
    "example": "Approach: ANAC123, roger Pan Pan, say nature of chip warning and souls on board.",
    "sayPhrase": "Pan Pan Pan Pan, Curitiba Approach, ANAC123, chip warning, reducing power.",
    "icaoQuestion": "What does a chip warning indicate and what would you tell ATC?",
    "icaoSpeakText": "A chip warning indicates ferrous metal particles detected in the engine or gearbox oil, suggesting internal mechanical damage. I would maintain aircraft control, reduce power, declare Pan Pan Pan Pan or Mayday depending on severity, report chip warning or chip detector activated, and request vectors to the nearest suitable airport. I would upgrade to Mayday if vibrations or abnormal engine parameters develop.",
    "missionBrief": "Today's lesson covers the chip detector warning — a sign of metal in your oil system.\n\nChip Warning means the chip detector has found ferrous metal particles in the engine or gearbox oil — indicating internal component wear or damage.\n\nIn the H130, chip detectors monitor the main gearbox and engine oil systems.\n\nMetal in the oil means something inside is breaking apart.\n\nYou must aviate first, reduce power, then communicate with the correct urgency call.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Chip warning means metal is moving through your oil.\n\nSomething inside is wearing or breaking.\n\nThe sequence every professional pilot learns:\n\nAviate. Listen. Communicate.\n\nFly the aircraft first.\n\nReduce power to reduce load on damaged components.\n\nListen and feel for vibrations, noise, or parameter changes.\n\nThen declare your urgency.\n\nChip warning alone with stable flight — Pan Pan.\n\nChip warning with vibration or parameter loss — Mayday.\n\nBrazilian pilots sometimes say \"chip acionou\" or \"detector de partículas\" on frequency.\n\nUse chip warning or chip detector activated — ICAO standard terms.\n\nIn the H130, never reset a chip warning without maintenance inspection.\n\nMetal does not disappear — it accumulates.\n\nTrain the reflex to reduce power and land before catastrophic failure.",
    "operationalContext": "You are cruising at one thousand eight hundred feet in your H130 from Curitiba toward Joinville.\n\nThe chip detector warning illuminates on the caution panel.\n\nYou reduce collective and monitor for unusual vibrations.\n\nWhen stable, you transmit:\n\nPan Pan Pan Pan, Curitiba Approach, ANAC123, chip warning, reducing power, request vectors to Joinville.\n\nApproach clears traffic and provides direct routing.\n\nYou complete a precautionary landing and report safe on the ground for maintenance inspection.",
    "sayItCoach": "Pan Pan Pan Pan, Curitiba Approach, ANAC123, chip warning, reducing power.",
    "icaoModelAnswer": "A chip warning indicates ferrous metal particles detected in the engine or gearbox oil, suggesting internal mechanical damage. I would maintain aircraft control, reduce power, declare Pan Pan Pan Pan or Mayday depending on severity, report chip warning or chip detector activated, and request vectors to the nearest suitable airport. I would upgrade to Mayday if vibrations or abnormal engine parameters develop.",
    "memoryTrick": "**METAL** — **M**onitor vibrations, **E**ngine power down, **T**ell ATC chip warning, **A**im for nearest airport, **L**and for inspection.",
    "operationalMeaning": "When Chip Warning occurs, the pilot should:\n\nChip Warning reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear traffic from the aircraft's route",
      "provide vectors to the nearest suitable airport",
      "coordinate priority landing and emergency services",
      "request souls on board and fuel remaining",
      "prepare for possible mechanical failure on approach"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, roger Pan Pan, say nature of chip warning and souls on board.",
      "Approach: ANAC123, turn right heading zero four five, descend one thousand five hundred, Joinville one two miles.",
      "Tower: ANAC123, runway one five cleared to land, emergency services standing by.",
      "Tower: ANAC123, wind zero nine zero at zero eight knots, report final.",
      "Departure: ANAC123, say engine parameters and intentions."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan Pan, Curitiba Approach, ANAC123, chip warning, reducing power.",
      "Mayday Mayday Mayday, ANAC123, chip detector activated, abnormal vibration, request immediate landing.",
      "Pan Pan Pan Pan, ANAC123, chip warning, metal particles in oil, request vectors to Curitiba.",
      "ANAC123, chip warning, souls on board four, request priority landing.",
      "Tower, ANAC123, chip detector activated, precautionary landing runway one five."
    ],
    "brazilianMistakes": "- ❌ Resetting the chip warning and continuing the flight.  \n  ✔ Land and inspect — metal in oil means internal damage.\n\n- ❌ Saying \"detector de chip\" instead of standard English.  \n  ✔ Use chip warning or chip detector activated.\n\n- ❌ Ignoring chip warning because engine sounds normal.  \n  ✔ Damage may be developing — reduce power and land.\n\n- ❌ Not reporting abnormal vibrations with chip warning.  \n  ✔ Vibration plus chip warning is Mayday territory.",
    "pronunciationCoaching": "**Target Phrase:** Pan Pan Pan Pan, Chip Warning, Reducing Power\n\n**Pronunciation:** pan pan pan pan, chip WOR-ning, ree-DOOS-ing POW-er\n\n**Word Stress**\n\n- Chip → chip\n- Warning → WOR-ning\n- Detector → dee-TEK-ter\n\nPractice:\n\nPan... Pan... Pan... Pan...\n\nTogether:\n\nPan Pan Pan Pan, Curitiba Approach, ANAC123, chip warning, reducing power.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Oil Pressure Warning",
      "Oil Temperature High",
      "Engine Failure",
      "Pan Pan Urgency Call",
      "Mayday Distress Call",
      "Precautionary Landing"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Aeronautical Information Manual (AIM) — Engine Failure Procedures",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Chip Detector",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "Airbus Helicopters H130 Flight Manual — Chip Detection System"
      },
      {
        "label": "SKYbrary — Engine Monitoring",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0062",
    "id": "0062",
    "displayTerm": "Tail Rotor Failure",
    "term": "tail rotor failure",
    "slug": "tail-rotor-failure",
    "category": "Helicopter Operations",
    "meaningEn": "Tail Rotor Failure is the loss of tail rotor effectiveness or drive, resulting in degraded or lost yaw control.",
    "meaningPt": "Falha do rotor de cauda.\n\nPerda de efetividade ou acionamento do rotor de cauda, resultando em controle de guinada degradado ou perdido.",
    "whenUsed": "When Tail Rotor Failure occurs, the pilot should:",
    "example": "Tower: ANAC123, Mayday acknowledged, all traffic cleared, say souls on board and position.",
    "sayPhrase": "Mayday Mayday Mayday, Navegantes Tower, ANAC123, tail rotor failure, request immediate landing.",
    "icaoQuestion": "What would you tell ATC if you experienced tail rotor failure in flight?",
    "icaoSpeakText": "I would maintain aircraft control and apply tail rotor failure emergency procedures. I would declare Mayday Mayday Mayday, state my callsign, report tail rotor failure or loss of tail rotor effectiveness, state my position and souls on board, and request immediate landing at the nearest suitable area. I would provide updates as the situation develops.",
    "missionBrief": "Today's lesson covers one of the most critical helicopter emergencies.\n\nTail Rotor Failure means the tail rotor has lost effectiveness — yaw control is degraded or lost entirely.\n\nIn the H130, the tail rotor counteracts main rotor torque and provides directional control.\n\nWithout tail rotor authority, the helicopter may enter an uncontrolled yaw or spin.\n\nYou must aviate first, apply emergency procedures, then communicate with Mayday.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Tail rotor failure is one of the most dangerous helicopter emergencies.\n\nTwo types matter:\n\nLoss of tail rotor effectiveness — LTE — often at low speed and high power.\n\nComplete drive failure — total loss of yaw control.\n\nThe sequence every professional pilot learns:\n\nAviate. Procedure. Mayday.\n\nFly the aircraft first.\n\nApply the correct emergency procedure from the flight manual.\n\nDo not chase the radio while spinning.\n\nWhen you have partial control — Mayday immediately.\n\nBrazilian pilots sometimes say \"perdeu o rotor de cauda\" or \"girando\" on frequency.\n\nUse tail rotor failure or loss of tail rotor effectiveness — ICAO standard terms.\n\nIn the H130, train the tail rotor failure procedure until it is muscle memory.\n\nYou may have seconds to act.\n\nThe radio call comes after you start flying the procedure — not before.",
    "operationalContext": "You are at five hundred feet on approach to Navegantes helipad in your H130.\n\nSuddenly the helicopter yaws uncontrollably to the right — tail rotor drive has failed.\n\nYou lower collective, apply anti-torque procedures, and fight to maintain heading.\n\nWhen partially stable, you transmit:\n\nMayday Mayday Mayday, Navegantes Tower, ANAC123, tail rotor failure, unable to control yaw, request immediate landing helipad.\n\nTower clears all traffic and emergency services respond.\n\nYou execute a running landing on the helipad and secure the aircraft.",
    "sayItCoach": "Mayday Mayday Mayday, Navegantes Tower, ANAC123, tail rotor failure, request immediate landing.",
    "icaoModelAnswer": "I would maintain aircraft control and apply tail rotor failure emergency procedures. I would declare Mayday Mayday Mayday, state my callsign, report tail rotor failure or loss of tail rotor effectiveness, state my position and souls on board, and request immediate landing at the nearest suitable area. I would provide updates as the situation develops.",
    "memoryTrick": "**YAW** — **Y**ou fly first, **A**pply emergency procedure, **W**hen stable — Mayday and land.",
    "operationalMeaning": "When Tail Rotor Failure occurs, the pilot should:\n\nTail Rotor Failure reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear all traffic from the aircraft's route immediately",
      "provide vectors to the nearest suitable landing area",
      "coordinate emergency services on the ground",
      "request souls on board and exact position",
      "prepare for possible crash landing or autorotation"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, Mayday acknowledged, all traffic cleared, say souls on board and position.",
      "Tower: ANAC123, cleared direct helipad, emergency services standing by.",
      "Approach: ANAC123, radar contact, say intentions and souls on board.",
      "Tower: ANAC123, wind two seven zero at one zero knots, cleared to land any area.",
      "Tower: ANAC123, emergency vehicles dispatched to helipad."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, Navegantes Tower, ANAC123, tail rotor failure, request immediate landing.",
      "Mayday Mayday Mayday, ANAC123, loss of tail rotor effectiveness, unable to control yaw, souls on board three.",
      "Mayday Mayday Mayday, Florianópolis Approach, ANAC123, tail rotor drive failure, request nearest landing area.",
      "ANAC123, tail rotor failure, position five miles south Navegantes, request immediate vectors.",
      "Tower, ANAC123, tail rotor failure, executing running landing helipad."
    ],
    "brazilianMistakes": "- ❌ Trying to radio Mayday before applying emergency procedures.  \n  ✔ Aviate first — apply tail rotor failure procedure, then transmit.\n\n- ❌ Saying \"rotor de cauda parou\" instead of standard English.  \n  ✔ Use tail rotor failure or loss of tail rotor effectiveness.\n\n- ❌ Increasing power when yaw becomes uncontrollable.  \n  ✔ Follow flight manual — often reduce power and airspeed.\n\n- ❌ Not declaring Mayday — treating it as urgency.  \n  ✔ Tail rotor failure is always distress — Mayday.",
    "pronunciationCoaching": "**Target Phrase:** Mayday Mayday Mayday, Tail Rotor Failure, Request Immediate Landing\n\n**Pronunciation:** MAY-day MAY-day MAY-day, tayl ROH-ter FAIL-yer, ree-KWEST im-MEE-dee-it LAN-ding\n\n**Word Stress**\n\n- Tail → tayl\n- Rotor → ROH-ter\n- Failure → FAIL-yer\n\nPractice:\n\nMayday... Mayday... Mayday...\n\nTogether:\n\nMayday Mayday Mayday, Navegantes Tower, ANAC123, tail rotor failure, request immediate landing.\n\nSpeak with urgency but clearly — every word must be understood.",
    "relatedConcepts": [
      "Main Rotor Damage",
      "Rotor Overspeed",
      "Rotor RPM Low",
      "Autorotation",
      "Mayday Distress Call",
      "Emergency Landing"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Helicopter Flying Handbook — Tail Rotor Emergencies"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Tail Rotor",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "Airbus Helicopters H130 Flight Manual — Tail Rotor Failure Procedures"
      },
      {
        "label": "SKYbrary — Helicopter Tail Rotor Failures",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0063",
    "id": "0063",
    "displayTerm": "Main Rotor Damage",
    "term": "main rotor damage",
    "slug": "main-rotor-damage",
    "category": "Helicopter Operations",
    "meaningEn": "Main Rotor Damage is physical damage to the main rotor blades or hub, causing abnormal vibration and threatening catastrophic failure.",
    "meaningPt": "Dano no rotor principal.\n\nDano físico às pás ou ao hub do rotor principal, causando vibração anormal e ameaçando falha catastrófica.",
    "whenUsed": "When Main Rotor Damage occurs, the pilot should:",
    "example": "Approach: ANAC123, Mayday acknowledged, say souls on board and nature of damage.",
    "sayPhrase": "Mayday Mayday Mayday, Florianópolis Approach, ANAC123, main rotor damage, request immediate landing.",
    "icaoQuestion": "What would you tell ATC if you suspected main rotor damage during flight?",
    "icaoSpeakText": "I would maintain aircraft control, reduce power smoothly, and declare Mayday Mayday Mayday. I would state my callsign, report main rotor damage or abnormal main rotor vibration, describe severity, state position and souls on board, and request immediate landing at the nearest suitable area. I would be prepared to autorotate if power loss follows.",
    "missionBrief": "Today's lesson covers main rotor damage — a catastrophic helicopter emergency.\n\nMain Rotor Damage means the main rotor blades or hub have been damaged — vibration, imbalance, or structural compromise threatens flight safety.\n\nIn the H130, the main rotor provides all lift and thrust.\n\nDamaged main rotor blades can fail catastrophically without warning.\n\nYou must aviate first, reduce power, then communicate with Mayday.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Main rotor damage is a race against structural failure.\n\nCauses include bird strike, foreign object, ground contact, or material fatigue.\n\nThe sequence every professional pilot learns:\n\nAviate. Gentle. Mayday.\n\nFly the aircraft first.\n\nReduce power smoothly — abrupt inputs can worsen the damage.\n\nMaintain rotor RPM within limits.\n\nDo not fight severe vibration with aggressive cyclic.\n\nWhen stable — Mayday immediately.\n\nBrazilian pilots sometimes say \"dano no rotor\" or \"vibração forte\" on frequency.\n\nUse main rotor damage or abnormal main rotor vibration — ICAO standard terms.\n\nIn the H130, any severe unexplained vibration is Mayday until proven otherwise.\n\nTrain the reflex to reduce power gently and land immediately.",
    "operationalContext": "You are cruising at one thousand five hundred feet near Florianópolis in your H130 when you hear a loud bang and severe vibration begins.\n\nYou suspect main rotor blade strike or damage — possibly bird strike or foreign object.\n\nYou reduce collective smoothly and maintain rotor RPM.\n\nWhen stable, you transmit:\n\nMayday Mayday Mayday, Florianópolis Approach, ANAC123, main rotor damage, severe vibration, request immediate landing.\n\nApproach clears all traffic and vectors you to the nearest helipad.\n\nYou execute a cautious approach and land safely.",
    "sayItCoach": "Mayday Mayday Mayday, Florianópolis Approach, ANAC123, main rotor damage, request immediate landing.",
    "icaoModelAnswer": "I would maintain aircraft control, reduce power smoothly, and declare Mayday Mayday Mayday. I would state my callsign, report main rotor damage or abnormal main rotor vibration, describe severity, state position and souls on board, and request immediate landing at the nearest suitable area. I would be prepared to autorotate if power loss follows.",
    "memoryTrick": "**BLADE** — **B**ack off power gently, **L**and immediately, **A**nnounce Mayday, **D**escribe vibration, **E**vacuate souls on board count.",
    "operationalMeaning": "When Main Rotor Damage occurs, the pilot should:\n\nMain Rotor Damage reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear all traffic from the aircraft's route immediately",
      "provide vectors to the nearest suitable landing area",
      "coordinate emergency services on the ground",
      "request souls on board and exact position",
      "prepare for possible autorotation or crash landing"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, Mayday acknowledged, say souls on board and nature of damage.",
      "Approach: ANAC123, turn left heading two seven zero, nearest helipad three miles, all traffic cleared.",
      "Tower: ANAC123, cleared direct helipad, emergency services standing by.",
      "Tower: ANAC123, wind one eight zero at one five knots, cleared to land any area.",
      "Approach: ANAC123, radar contact, say rotor RPM and intentions."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, Florianópolis Approach, ANAC123, main rotor damage, request immediate landing.",
      "Mayday Mayday Mayday, ANAC123, abnormal main rotor vibration, reducing power, souls on board four.",
      "Mayday Mayday Mayday, Navegantes Tower, ANAC123, suspected main rotor blade damage, request nearest landing area.",
      "ANAC123, main rotor damage, severe vibration, position one zero miles north Florianópolis.",
      "Tower, ANAC123, main rotor damage, executing immediate landing helipad."
    ],
    "brazilianMistakes": "- ❌ Making abrupt control inputs with severe vibration.  \n  ✔ Reduce power smoothly and avoid aggressive cyclic movements.\n\n- ❌ Saying \"rotor principal danificado\" instead of standard English.  \n  ✔ Use main rotor damage or abnormal main rotor vibration.\n\n- ❌ Continuing flight to a distant airport.  \n  ✔ Land at the nearest suitable area immediately.\n\n- ❌ Treating severe vibration as Pan Pan.  \n  ✔ Main rotor damage is always Mayday.",
    "pronunciationCoaching": "**Target Phrase:** Mayday Mayday Mayday, Main Rotor Damage, Request Immediate Landing\n\n**Pronunciation:** MAY-day MAY-day MAY-day, mayn ROH-ter DAM-ij, ree-KWEST im-MEE-dee-it LAN-ding\n\n**Word Stress**\n\n- Main → mayn\n- Rotor → ROH-ter\n- Damage → DAM-ij\n\nPractice:\n\nMayday... Mayday... Mayday...\n\nTogether:\n\nMayday Mayday Mayday, Florianópolis Approach, ANAC123, main rotor damage, request immediate landing.\n\nSpeak with urgency but clearly — every word must be understood.",
    "relatedConcepts": [
      "Tail Rotor Failure",
      "Bird Strike",
      "Rotor Overspeed",
      "Rotor RPM Low",
      "Autorotation",
      "Mayday Distress Call"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Helicopter Flying Handbook — Rotor System Emergencies"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Main Rotor",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "Airbus Helicopters H130 Flight Manual — Main Rotor System"
      },
      {
        "label": "SKYbrary — Helicopter Rotor Damage",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0064",
    "id": "0064",
    "displayTerm": "Rotor Overspeed",
    "term": "rotor overspeed",
    "slug": "rotor-overspeed",
    "category": "Helicopter Operations",
    "meaningEn": "Rotor Overspeed is the condition where main rotor RPM exceeds maximum allowable limits, threatening structural damage or blade separation.",
    "meaningPt": "Sobrevelocidade do rotor.\n\nCondição em que o RPM do rotor principal excede os limites máximos permitidos, ameaçando dano estrutural.",
    "whenUsed": "When Rotor Overspeed occurs, the pilot should:",
    "example": "Approach: ANAC123, roger Pan Pan, say current rotor RPM and souls on board.",
    "sayPhrase": "Pan Pan Pan Pan, Navegantes Approach, ANAC123, rotor overspeed, RPM corrected, request precautionary landing.",
    "icaoQuestion": "What would you tell ATC if you experienced rotor overspeed during descent?",
    "icaoSpeakText": "I would maintain aircraft control, adjust collective to correct rotor RPM, and declare Pan Pan Pan Pan or Mayday depending on whether RPM is controlled. I would report rotor overspeed or rotor RPM high, state whether RPM is now corrected, and request vectors to the nearest suitable landing area for precautionary landing and inspection.",
    "missionBrief": "Today's lesson covers rotor overspeed — when rotor RPM exceeds safe limits.\n\nRotor Overspeed means main rotor RPM has risen above the maximum allowable limit — centrifugal forces on the blades increase and structural failure becomes possible.\n\nIn the H130, rotor RPM must stay within the green arc for safe operation.\n\nOverspeed can result from governor failure, collective mismanagement, or emergency descent.\n\nYou must aviate first, correct RPM, then communicate with the correct urgency call.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Rotor overspeed is a numbers game.\n\nRPM above the red line means blades are stressed beyond design limits.\n\nThe sequence every professional pilot learns:\n\nAviate. RPM. Communicate.\n\nFly the aircraft first.\n\nAdjust collective to bring RPM back to the green arc.\n\nCheck governor and engine parameters.\n\nThen declare your urgency.\n\nBrief overspeed corrected — Pan Pan for precautionary landing.\n\nUncontrolled overspeed — Mayday.\n\nBrazilian pilots sometimes say \"RPM alto\" or \"rotor acelerado\" on frequency.\n\nUse rotor overspeed or rotor RPM high — ICAO standard terms.\n\nIn the H130, steep descents with low collective are a common overspeed trigger.\n\nTrain the collective reflex before you need the radio.",
    "operationalContext": "You are descending toward Navegantes at one thousand two hundred feet in your H130.\n\nDuring a steep descent, rotor RPM rises into the red arc and the overspeed warning activates.\n\nYou raise collective slightly to reduce RPM and level the descent.\n\nWhen RPM returns to the green arc, you transmit:\n\nPan Pan Pan Pan, Navegantes Approach, ANAC123, rotor overspeed, RPM now corrected, request vectors to Navegantes for precautionary landing.\n\nApproach clears traffic and provides direct routing.\n\nYou land safely for inspection.",
    "sayItCoach": "Pan Pan Pan Pan, Navegantes Approach, ANAC123, rotor overspeed, RPM corrected.",
    "icaoModelAnswer": "I would maintain aircraft control, adjust collective to correct rotor RPM, and declare Pan Pan Pan Pan or Mayday depending on whether RPM is controlled. I would report rotor overspeed or rotor RPM high, state whether RPM is now corrected, and request vectors to the nearest suitable landing area for precautionary landing and inspection.",
    "memoryTrick": "**RPM** — **R**educe collective, **P**ull RPM to green arc, **M**ayday if uncontrolled, Pan Pan if corrected.",
    "operationalMeaning": "When Rotor Overspeed occurs, the pilot should:\n\nRotor Overspeed reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear traffic from the aircraft's route",
      "provide vectors to the nearest suitable landing area",
      "coordinate emergency services if distress is declared",
      "request souls on board and position",
      "prepare for possible autorotation if overspeed leads to failure"
    ],
    "atcPhraseology": [
      "Approach: ANAC123, roger Pan Pan, say current rotor RPM and souls on board.",
      "Approach: ANAC123, turn right heading one eight zero, descend eight hundred, Navegantes five miles.",
      "Tower: ANAC123, runway two nine cleared to land, emergency services notified.",
      "Tower: ANAC123, wind two seven zero at one two knots, report final.",
      "Departure: ANAC123, say nature of rotor problem and intentions."
    ],
    "pilotReadbacks": [
      "Pan Pan Pan Pan, Navegantes Approach, ANAC123, rotor overspeed, RPM corrected, request precautionary landing.",
      "Mayday Mayday Mayday, ANAC123, rotor overspeed, unable to control RPM, request immediate landing.",
      "Pan Pan Pan Pan, ANAC123, rotor RPM high, correcting, request vectors to Florianópolis.",
      "ANAC123, rotor overspeed warning, souls on board three, request priority landing.",
      "Tower, ANAC123, rotor RPM now normal, precautionary landing runway two nine."
    ],
    "brazilianMistakes": "- ❌ Ignoring a brief overspeed without landing for inspection.  \n  ✔ Overspeed stresses blades — precautionary landing and inspection required.\n\n- ❌ Saying \"RPM do rotor alto\" instead of standard English.  \n  ✔ Use rotor overspeed or rotor RPM high.\n\n- ❌ Continuing flight after uncontrolled overspeed.  \n  ✔ Land immediately if RPM cannot be controlled.\n\n- ❌ Not reporting whether RPM is currently corrected.  \n  ✔ Tell ATC current RPM status — it determines urgency level.",
    "pronunciationCoaching": "**Target Phrase:** Pan Pan Pan Pan, Rotor Overspeed, RPM Corrected\n\n**Pronunciation:** pan pan pan pan, ROH-ter OH-ver-speed, R-P-M kor-REK-ted\n\n**Word Stress**\n\n- Rotor → ROH-ter\n- Overspeed → OH-ver-speed\n- Corrected → kor-REK-ted\n\nPractice:\n\nPan... Pan... Pan... Pan...\n\nTogether:\n\nPan Pan Pan Pan, Navegantes Approach, ANAC123, rotor overspeed, RPM corrected.\n\nSpeak slowly and clearly — controllers need every word.",
    "relatedConcepts": [
      "Rotor RPM Low",
      "Tail Rotor Failure",
      "Main Rotor Damage",
      "Autorotation",
      "Pan Pan Urgency Call",
      "Mayday Distress Call"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Helicopter Flying Handbook — Rotor RPM Management"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Rotor RPM",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "Airbus Helicopters H130 Flight Manual — Rotor Limitations"
      },
      {
        "label": "SKYbrary — Helicopter Rotor Overspeed",
        "href": "https://skybrary.aero"
      }
    ]
  },
  {
    "catalogId": "0065",
    "id": "0065",
    "displayTerm": "Rotor RPM Low",
    "term": "rotor rpm low",
    "slug": "rotor-rpm-low",
    "category": "Helicopter Operations",
    "meaningEn": "Rotor RPM Low is the condition where main rotor RPM falls below minimum safe limits, threatening loss of lift and requiring immediate corrective action.",
    "meaningPt": "RPM do rotor baixo.\n\nCondição em que o RPM do rotor principal cai abaixo dos limites mínimos seguros, ameaçando perda de sustentação.",
    "whenUsed": "When Rotor RPM Low occurs, the pilot should:",
    "example": "Tower: ANAC123, Mayday acknowledged, say souls on board and current rotor RPM.",
    "sayPhrase": "Mayday Mayday Mayday, São Paulo Tower, ANAC123, low rotor RPM, request immediate landing.",
    "icaoQuestion": "What is the first action when rotor RPM becomes low during hover?",
    "icaoSpeakText": "I would lower collective immediately to recover rotor RPM. I would avoid abrupt aft cyclic, transition to forward flight if appropriate, and maintain aircraft control. If RPM recovers, I would declare Pan Pan or Mayday depending on altitude lost and declare my intentions. If RPM cannot be recovered and altitude is being lost, I would enter autorotation and declare Mayday Mayday Mayday with position and souls on board.",
    "missionBrief": "Today's lesson covers low rotor RPM — one of the most dangerous helicopter conditions.\n\nRotor RPM Low means main rotor RPM has dropped below safe operating limits — lift decreases and autorotation may become necessary.\n\nIn the H130, maintaining rotor RPM in the green arc is the pilot's primary responsibility.\n\nLow rotor RPM can lead to rotor stall and catastrophic loss of lift.\n\nYou must aviate first, lower collective immediately, then communicate with Mayday if altitude cannot be maintained.\n\nThis lesson prepares you for ICAO Part 2 phraseology and Part 3 emergency communication.",
    "captainTeaching": "Low rotor RPM is the helicopter pilot's oldest enemy.\n\nBelow minimum RPM, the blades stall aerodynamically — lift disappears.\n\nThe sequence every professional pilot learns:\n\nCollective down. Aviate. Mayday.\n\nLower collective first — before anything else.\n\nDo not pull aft cyclic while RPM is low.\n\nIf RPM does not recover and altitude is lost — autorotate.\n\nThen Mayday.\n\nBrazilian pilots sometimes say \"RPM baixo\" or \"perdendo RPM\" on frequency.\n\nUse low rotor RPM or rotor RPM decay — ICAO standard terms.\n\nIn the H130, high-power hover on hot days is a classic low RPM trap.\n\nTrain the collective-down reflex until it is automatic.\n\nThe radio comes after collective — always.",
    "operationalContext": "You are at six hundred feet on approach to Congonhas helipad in your H130.\n\nDuring a high-power hover, rotor RPM decays into the yellow arc and continues dropping.\n\nYou lower collective aggressively and transition to forward flight.\n\nRPM recovers but altitude was lost.\n\nYou transmit:\n\nMayday Mayday Mayday, São Paulo Tower, ANAC123, low rotor RPM, RPM recovered, request immediate landing helipad.\n\nTower clears all traffic and emergency services respond.\n\nYou land safely on the helipad.",
    "sayItCoach": "Mayday Mayday Mayday, São Paulo Tower, ANAC123, low rotor RPM, request immediate landing.",
    "icaoModelAnswer": "I would lower collective immediately to recover rotor RPM. I would avoid abrupt aft cyclic, transition to forward flight if appropriate, and maintain aircraft control. If RPM recovers, I would declare Pan Pan or Mayday depending on altitude lost and declare my intentions. If RPM cannot be recovered and altitude is being lost, I would enter autorotation and declare Mayday Mayday Mayday with position and souls on board.",
    "memoryTrick": "**DOWN** — **D**rop collective immediately, **O**bserve RPM recovery, **W**hen stable — Mayday, **N**earest landing area.",
    "operationalMeaning": "When Rotor RPM Low occurs, the pilot should:\n\nRotor RPM Low reporting commonly includes:",
    "whyAtcUsesIt": [
      "clear all traffic from the aircraft's route immediately",
      "provide vectors to the nearest suitable landing area",
      "coordinate emergency services on the ground",
      "request souls on board and exact position",
      "prepare for possible autorotation or emergency landing"
    ],
    "atcPhraseology": [
      "Tower: ANAC123, Mayday acknowledged, say souls on board and current rotor RPM.",
      "Tower: ANAC123, cleared direct helipad, all traffic cleared, emergency services standing by.",
      "Approach: ANAC123, radar contact, say intentions and altitude.",
      "Tower: ANAC123, wind calm, cleared to land any area.",
      "Tower: ANAC123, emergency vehicles dispatched to helipad."
    ],
    "pilotReadbacks": [
      "Mayday Mayday Mayday, São Paulo Tower, ANAC123, low rotor RPM, request immediate landing.",
      "Mayday Mayday Mayday, ANAC123, rotor RPM decay, entering autorotation, souls on board two.",
      "Pan Pan Pan Pan, Navegantes Approach, ANAC123, low rotor RPM, RPM now recovered, request precautionary landing.",
      "ANAC123, low rotor RPM, position three miles south Congonhas, request immediate vectors.",
      "Tower, ANAC123, low rotor RPM, RPM recovered, executing landing helipad."
    ],
    "brazilianMistakes": "- ❌ Pulling collective up when RPM is low.  \n  ✔ Lower collective immediately — this is the only recovery action.\n\n- ❌ Calling Mayday before lowering collective.  \n  ✔ Collective down first — radio second.\n\n- ❌ Saying \"RPM caindo\" instead of standard English.  \n  ✔ Use low rotor RPM or rotor RPM decay.\n\n- ❌ Not preparing for autorotation if RPM does not recover.  \n  ✔ Enter autorotation if altitude cannot be maintained.",
    "pronunciationCoaching": "**Target Phrase:** Mayday Mayday Mayday, Low Rotor RPM, Request Immediate Landing\n\n**Pronunciation:** MAY-day MAY-day MAY-day, loh ROH-ter R-P-M, ree-KWEST im-MEE-dee-it LAN-ding\n\n**Word Stress**\n\n- Rotor → ROH-ter\n- Low → loh\n- Immediate → im-MEE-dee-it\n\nPractice:\n\nMayday... Mayday... Mayday...\n\nTogether:\n\nMayday Mayday Mayday, São Paulo Tower, ANAC123, low rotor RPM, request immediate landing.\n\nSpeak with urgency but clearly — every word must be understood.",
    "relatedConcepts": [
      "Rotor Overspeed",
      "Autorotation",
      "Tail Rotor Failure",
      "Engine Failure",
      "Mayday Distress Call",
      "Emergency Landing"
    ],
    "references": [
      {
        "label": "ICAO Annex 10 Volume II — Radiotelephony Procedures",
        "href": "https://www.icao.int/publications/pages/publication.aspx?docnum=101"
      },
      {
        "label": "ICAO Doc 4444 (PANS-ATM) — Emergency Procedures",
        "href": "https://www.icao.int/publications/pages/doc-4444.aspx"
      },
      {
        "label": "FAA Helicopter Flying Handbook — Rotor RPM Management"
      },
      {
        "label": "FAA Pilot/Controller Glossary — Rotor RPM",
        "href": "https://www.faa.gov/air_traffic/publications/atpubs/pcg_html/"
      },
      {
        "label": "Airbus Helicopters H130 Flight Manual — Rotor Limitations"
      },
      {
        "label": "SKYbrary — Helicopter Low Rotor RPM",
        "href": "https://skybrary.aero"
      }
    ]
  }
];
