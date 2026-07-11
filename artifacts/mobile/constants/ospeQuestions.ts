export interface OSPESubQuestion {
  q: string;
  marks: number;
  answer: string;
}

export interface OSPEStation {
  id: string;
  stationNo: string;
  topic: string;
  scenario: string;
  region: string;
  thumbnail: string;
  totalMarks: number;
  questions: OSPESubQuestion[];
}

export const OSPE_STATIONS: OSPEStation[] = [
  {
    id: "p001",
    stationNo: "P001",
    topic: "Venipuncture",
    scenario:
      "Given above is a picture representing venipuncture of peripheral vessel.",
    region: "Upper Limb",
    thumbnail: "p001_venipuncture",
    totalMarks: 4,
    questions: [
      {
        q: "Which is the vein most commonly used for venipuncture in the upper limb?",
        marks: 0.5,
        answer:
          "Median cubital vein (in the cubital fossa at the elbow).",
      },
      {
        q: "Mention two reasons as to why this vein is preferred the most.",
        marks: 1,
        answer:
          "1. It is large, prominent and relatively fixed (anchored by the bicipital aponeurosis).\n2. It does not roll and is well away from the brachial artery, minimising arterial puncture risk.",
      },
      {
        q: "Which is the most preferred vessel for venous access in the lower limb?",
        marks: 0.5,
        answer: "Great saphenous vein (long saphenous vein).",
      },
      {
        q: "Mention the site of access in the lower limb.",
        marks: 1,
        answer:
          "Anterior to the medial malleolus at the ankle — where the great saphenous vein is consistently found.",
      },
      {
        q: "Name the technique used for venous access in the lower limb.",
        marks: 0.5,
        answer: "Venous cutdown (saphenous cutdown).",
      },
      {
        q: "Name the structure likely to be injured in this procedure.",
        marks: 0.5,
        answer:
          "Saphenous nerve — it runs alongside the great saphenous vein and can be damaged during cutdown.",
      },
    ],
  },
  {
    id: "p002",
    stationNo: "P002",
    topic: "Hernia of the Groin",
    scenario:
      "Given above is a picture representing hernia or swelling of the groin.",
    region: "Abdomen",
    thumbnail: "p002_hernia",
    totalMarks: 4,
    questions: [
      {
        q: "Mention the two types of hernia seen around the groin.",
        marks: 1,
        answer: "1. Inguinal hernia\n2. Femoral hernia",
      },
      {
        q: "Which bony landmark can be used to differentiate between the above two?",
        marks: 0.5,
        answer:
          "Pubic tubercle — inguinal hernia emerges above and medial to the pubic tubercle; femoral hernia emerges below and lateral to the pubic tubercle.",
      },
      {
        q: "The hernial sac is seen extending into the scrotal sac. What are the two types of hernia seen extending into the scrotal sac?",
        marks: 1,
        answer:
          "1. Indirect inguinal hernia (most common)\n2. Direct inguinal hernia (less commonly)",
      },
      {
        q: "Which vessel can be used to differentiate between the above two?",
        marks: 0.5,
        answer:
          "Inferior epigastric vessels — indirect inguinal hernia passes lateral to these vessels (through the deep inguinal ring); direct inguinal hernia passes medial to them (through Hesselbach's triangle).",
      },
      {
        q: "Mention the surface marking of the opening through which the hernial sac protrudes medially.",
        marks: 1,
        answer:
          "Superficial inguinal ring — located 1.25 cm above and lateral to the pubic tubercle.",
      },
    ],
  },
  {
    id: "p003",
    stationNo: "P003",
    topic: "Ape Hand / Median Nerve Palsy",
    scenario:
      "The above picture represents an anomaly where the patient is unable to oppose his thumb with wasting of muscles of the thenar eminence.",
    region: "Upper Limb",
    thumbnail: "p003_ape_hand",
    totalMarks: 3,
    questions: [
      {
        q: "Which is the nerve likely to be injured?",
        marks: 0.5,
        answer: "Median nerve.",
      },
      {
        q: "What is the deformity called?",
        marks: 0.5,
        answer: "Ape hand deformity (ape thumb deformity).",
      },
      {
        q: "List the muscles of the hand which will be affected in this condition.",
        marks: 1.25,
        answer:
          "1. Abductor pollicis brevis\n2. Opponens pollicis\n3. Flexor pollicis brevis (superficial head)\n4. 1st lumbrical\n5. 2nd lumbrical",
      },
      {
        q: "Which is the most common syndrome that causes this deformity?",
        marks: 0.5,
        answer: "Carpal tunnel syndrome.",
      },
      {
        q: "Name the test used to clinically confirm the diagnosis.",
        marks: 0.25,
        answer:
          "Phalen's test (wrist flexion test) — tingling reproduced by sustained wrist flexion. Tinel's sign over carpal tunnel is also used.",
      },
    ],
  },
  {
    id: "p004",
    stationNo: "P004",
    topic: "Trendelenburg Sign",
    scenario:
      "The above picture denotes a classical sign used to test integrity of a group of muscles of the lower limb.",
    region: "Lower Limb",
    thumbnail: "p004_trendelenburg",
    totalMarks: 4,
    questions: [
      {
        q: "Mention the sign depicted.",
        marks: 0.5,
        answer: "Trendelenburg sign (positive Trendelenburg test).",
      },
      {
        q: "Which are the muscles tested here?",
        marks: 1,
        answer: "Gluteus medius and gluteus minimus.",
      },
      {
        q: "Mention the action of the muscles tested.",
        marks: 0.75,
        answer:
          "1. Abduction of the hip joint\n2. Medial rotation of the hip\n3. Stabilisation of the pelvis during walking (supporting limb side keeps pelvis level)",
      },
      {
        q: "Mention their nerve supply.",
        marks: 1,
        answer:
          "Superior gluteal nerve (L4, L5, S1) — from the sacral plexus, exits through greater sciatic foramen above piriformis.",
      },
      {
        q: "Which are the three factors necessary to maintain the integrity of the pelvis?",
        marks: 0.75,
        answer:
          "1. Intact gluteus medius and minimus\n2. Normal hip joint anatomy\n3. Intact femoral neck (shaft of femur providing fulcrum)",
      },
    ],
  },
  {
    id: "p005",
    stationNo: "P005",
    topic: "Varicose Veins",
    scenario:
      "The above diagram depicts varicosity of the vein of the lower limb.",
    region: "Lower Limb",
    thumbnail: "p005_varicose",
    totalMarks: 4,
    questions: [
      {
        q: "Name the three systems of veins observed in the lower limb.",
        marks: 0.75,
        answer:
          "1. Superficial venous system\n2. Deep venous system\n3. Perforating (communicating) venous system",
      },
      {
        q: "Which is the venous system likely to be affected here?",
        marks: 0.5,
        answer: "Superficial venous system.",
      },
      {
        q: "Name the vessel affected in this situation.",
        marks: 0.5,
        answer: "Great saphenous vein (long saphenous vein).",
      },
      {
        q: "Mention two reasons to substantiate the above answer.",
        marks: 1,
        answer:
          "1. It is the longest vein in the body running along the medial aspect of the leg and thigh.\n2. It lies in the superficial fascia and is predisposed to valvular incompetence leading to varicosity.",
      },
      {
        q: "Mention two clinical tests used to identify the venous system involved.",
        marks: 0.5,
        answer:
          "1. Trendelenburg test (tourniquet test) — assesses sapheno-femoral incompetence.\n2. Perthes test — differentiates superficial from deep venous obstruction.",
      },
      {
        q: "Name two nerves closely related to the affected vessel along its course.",
        marks: 0.75,
        answer:
          "1. Saphenous nerve — runs alongside the great saphenous vein in the leg (medial side).\n2. Medial cutaneous nerve of the thigh — related in the thigh segment.",
      },
    ],
  },
  {
    id: "p006",
    stationNo: "P006",
    topic: "Lumbar Puncture",
    scenario: "The above picture depicts the procedure of Lumbar puncture.",
    region: "Neuroanatomy",
    thumbnail: "p006_lumbar_puncture",
    totalMarks: 4,
    questions: [
      {
        q: "Mention the vertebral level at which the CSF is accessed.",
        marks: 0.5,
        answer:
          "L3–L4 or L4–L5 intervertebral space (most commonly L3–L4).",
      },
      {
        q: "Mention two reasons substantiating the choice of site.",
        marks: 1,
        answer:
          "1. The spinal cord ends at L1–L2 (conus medullaris) in adults, so needle insertion below L2 avoids cord injury.\n2. The subarachnoid space (cauda equina and CSF) persists down to S2, allowing safe CSF sampling.",
      },
      {
        q: "Name the structures which are pierced in this procedure.",
        marks: 1.5,
        answer:
          "1. Skin and subcutaneous tissue\n2. Supraspinous ligament\n3. Interspinous ligament\n4. Ligamentum flavum\n5. Epidural (extradural) space\n6. Dura mater\n7. Arachnoid mater\n(Needle tip then lies in the subarachnoid space)",
      },
      {
        q: "How will you clinically identify the site for lumbar puncture?",
        marks: 1,
        answer:
          "Draw an imaginary line (Tuffier's line / supracristal plane) connecting the highest points of both iliac crests — this line crosses the spine at the L4 vertebral body or L3–L4 disc space, indicating the safe puncture level.",
      },
    ],
  },
  {
    id: "p007",
    stationNo: "P007",
    topic: "Bilateral Black Eye (Scalp Anatomy)",
    scenario:
      "The above picture represents Bilateral Black eye.",
    region: "Head & Neck",
    thumbnail: "p007_raccoon_eyes",
    totalMarks: 4,
    questions: [
      {
        q: "Which is the layer of the scalp from which blood gravitates into the eyelid?",
        marks: 0.5,
        answer:
          "The 4th layer — loose areolar tissue (subaponeurotic layer).",
      },
      {
        q: "Mention the anatomical reason for this phenomenon.",
        marks: 1,
        answer:
          "The loose areolar tissue is continuous anteriorly with the areolar tissue of the eyelids. Blood from a scalp haematoma spreads freely in this loose layer and gravitates forward into the periorbital region, causing bilateral black eyes.",
      },
      {
        q: "Name two other clinical significances of this layer.",
        marks: 0.5,
        answer:
          "1. Emissary veins pass through it, connecting scalp veins with intracranial dural sinuses.\n2. Pus or blood can spread rapidly and extensively in this layer.",
      },
      {
        q: "What is the reason for calling the fourth layer the 'dangerous area' of the scalp?",
        marks: 1,
        answer:
          "The emissary veins in this layer connect the scalp veins (which are valveless) directly to the intracranial dural venous sinuses. Infection in this layer can therefore spread intracranially via emissary veins, causing meningitis or cavernous sinus thrombosis.",
      },
      {
        q: "Name the layers of scalp in order from superficial to deep.",
        marks: 1,
        answer:
          "S — Skin\nC — Close (dense) subcutaneous tissue\nA — Aponeurosis (epicranial/galea aponeurotica)\nL — Loose areolar tissue\nP — Pericranium (periosteum of skull)",
      },
    ],
  },
  {
    id: "p008",
    stationNo: "P008",
    topic: "Birth Injuries",
    scenario:
      "The above picture depicts two common birth injuries.",
    region: "Embryology",
    thumbnail: "p008_birth_injuries",
    totalMarks: 4,
    questions: [
      {
        q: "Name the two birth injuries marked A and B.",
        marks: 1,
        answer:
          "A — Caput succedaneum\nB — Cephalohematoma",
      },
      {
        q: "How will you differentiate between the two conditions anatomically?",
        marks: 2,
        answer:
          "Caput succedaneum:\n• Oedema in the subcutaneous tissue (above periosteum)\n• Crosses sutural lines freely\n• Present at birth, resolves within 2–3 days\n\nCephalohematoma:\n• Subperiosteal haemorrhage\n• Strictly limited by sutural lines (does not cross sutures)\n• Appears hours after birth, resolves in weeks",
      },
      {
        q: "Which blood investigation is likely to be deranged in Disease B and why?",
        marks: 1,
        answer:
          "Serum bilirubin (hyperbilirubinaemia / jaundice). The subperiosteal blood in a cephalohematoma undergoes haemolysis; as the haemoglobin is broken down, bilirubin is released and absorbed into the circulation, raising serum bilirubin levels and causing neonatal jaundice.",
      },
    ],
  },
  {
    id: "p009",
    stationNo: "P009",
    topic: "Ulnar Nerve Injury at the Wrist",
    scenario:
      "The above picture represents injury to the ulnar nerve. There is no loss of sensation over the palmar and dorsal aspect of hand over the medial half.",
    region: "Upper Limb",
    thumbnail: "p009_claw_hand",
    totalMarks: 4,
    questions: [
      {
        q: "Mention the deformity shown here.",
        marks: 0.5,
        answer:
          "Ulnar claw hand (partial claw hand / 'Benediction' position — affecting ring and little fingers).",
      },
      {
        q: "Which is the likely site of injury in this condition?",
        marks: 0.5,
        answer:
          "Wrist (Guyon's canal / ulnar canal).",
      },
      {
        q: "Mention the reason which helped confirm the site of injury.",
        marks: 1,
        answer:
          "Sensation is intact over the medial palm and dorsum of the hand. The palmar cutaneous branch and the dorsal cutaneous branch of the ulnar nerve arise proximal to the wrist; their preservation indicates the lesion is at or distal to the wrist (not at the elbow or above).",
      },
      {
        q: "Explain the reasons for ulnar nerve paradox noted here.",
        marks: 1.5,
        answer:
          "Ulnar paradox: injury at the wrist produces MORE clawing than injury at the elbow.\n• Wrist injury: FDP (flexor digitorum profundus) to 4th and 5th fingers is intact → strong IP flexion remains, producing marked clawing of ring and little fingers.\n• Elbow injury: FDP to 4th and 5th fingers is also paralysed → less IP flexion → less pronounced clawing (paradoxically milder deformity despite higher, more extensive lesion).",
      },
      {
        q: "Name the sign that helps in identifying ulnar nerve palsy.",
        marks: 0.5,
        answer:
          "Froment's sign — when the patient tries to grip a piece of paper between thumb and index finger, the thumb IP joint flexes (using FPL supplied by median nerve) to compensate for the paralysed adductor pollicis.",
      },
    ],
  },
  {
    id: "p010",
    stationNo: "P010",
    topic: "Caput Medusae / Portal Hypertension",
    scenario:
      "The above diagram represents dilation of veins around the anterior abdominal wall.",
    region: "Abdomen",
    thumbnail: "p010_caput_medusae",
    totalMarks: 4,
    questions: [
      {
        q: "What is this clinical feature commonly called?",
        marks: 0.5,
        answer: "Caput medusae.",
      },
      {
        q: "Name the clinical condition that usually causes this.",
        marks: 0.5,
        answer: "Portal hypertension (most commonly due to liver cirrhosis).",
      },
      {
        q: "Mention the vessels seen anastomosing at this site.",
        marks: 1,
        answer:
          "Portal vein tributaries (para-umbilical veins) anastomose with systemic veins:\n• Superior epigastric vein (tributary of internal thoracic → SVC drainage)\n• Inferior epigastric vein (tributary of external iliac → IVC drainage)\n• Superficial epigastric vein (tributary of great saphenous → IVC drainage)",
      },
      {
        q: "Mention two other sites where there can be dilatation of veins in this clinical condition.",
        marks: 1,
        answer:
          "1. Oesophageal varices (at the oesophago-gastric junction — left gastric vein ↔ oesophageal veins).\n2. Anorectal varices / haemorrhoids (at the anorectal junction — superior rectal ↔ middle and inferior rectal veins).",
      },
      {
        q: "Mention two methods that can be used to measure portal venous pressure.",
        marks: 1,
        answer:
          "1. Hepatic venous pressure gradient (HVPG) — measured via a balloon catheter in the hepatic vein (indirect method; gold standard).\n2. Direct portal pressure measurement — via percutaneous transhepatic portography or intraoperative cannulation.",
      },
    ],
  },
  {
    id: "p011",
    stationNo: "P011",
    topic: "Internal Squint (Esotropia)",
    scenario: "The above picture represents Internal Squint.",
    region: "Head & Neck",
    thumbnail: "p011_internal_squint",
    totalMarks: 4,
    questions: [
      {
        q: "Name the muscle which is likely to be affected in this condition.",
        marks: 0.5,
        answer:
          "Lateral rectus (paralysis causes the eye to turn medially = convergent/internal squint).",
      },
      {
        q: "How will you test for the action of the affected muscle?",
        marks: 0.5,
        answer:
          "Ask the patient to look laterally (abduct the eye) toward the side of the affected muscle. In lateral rectus palsy, the eye cannot abduct.",
      },
      {
        q: "Mention the nerve supply of the affected muscle.",
        marks: 0.5,
        answer: "Abducens nerve (CN VI).",
      },
      {
        q: "Which is the most common clinical feature in Strabismus?",
        marks: 0.5,
        answer: "Diplopia (double vision).",
      },
      {
        q: "Name all extraocular muscles and mention their nerve supply.",
        marks: 2,
        answer:
          "CN III (Oculomotor): Superior rectus, Inferior rectus, Medial rectus, Inferior oblique, Levator palpebrae superioris\nCN IV (Trochlear): Superior oblique\nCN VI (Abducens): Lateral rectus\n\nMnemonic — LR₆SO₄R₃: Lateral Rectus→VI, Superior Oblique→IV, Rest→III",
      },
    ],
  },
  {
    id: "p014",
    stationNo: "P014",
    topic: "External Squint (Exotropia)",
    scenario: "The above picture represents External Squint.",
    region: "Head & Neck",
    thumbnail: "p014_external_squint",
    totalMarks: 4,
    questions: [
      {
        q: "Name the muscle which is likely to be affected in this condition.",
        marks: 0.5,
        answer:
          "Medial rectus (paralysis or weakness causes the eye to turn laterally = divergent/external squint).",
      },
      {
        q: "How will you test for the action of the affected muscle?",
        marks: 0.5,
        answer:
          "Ask the patient to adduct the eye (look medially/toward the nose). Failure to adduct indicates medial rectus weakness.",
      },
      {
        q: "Mention the nerve supply of the affected muscle.",
        marks: 0.5,
        answer: "Oculomotor nerve (CN III) — inferior division.",
      },
      {
        q: "Which is the most common clinical feature in Strabismus?",
        marks: 0.5,
        answer: "Diplopia (double vision).",
      },
      {
        q: "Name all extraocular muscles and mention their nerve supply.",
        marks: 2,
        answer:
          "CN III (Oculomotor): Superior rectus, Inferior rectus, Medial rectus, Inferior oblique, Levator palpebrae superioris\nCN IV (Trochlear): Superior oblique\nCN VI (Abducens): Lateral rectus\n\nMnemonic — LR₆SO₄R₃: Lateral Rectus→VI, Superior Oblique→IV, Rest→III",
      },
    ],
  },
  {
    id: "p012",
    stationNo: "P012",
    topic: "Foot Drop",
    scenario: "The above picture represents Foot Drop.",
    region: "Lower Limb",
    thumbnail: "p012_foot_drop",
    totalMarks: 4,
    questions: [
      {
        q: "Mention the nerve likely to be injured here.",
        marks: 0.5,
        answer:
          "Common peroneal nerve (common fibular nerve).",
      },
      {
        q: "Name the two terminal branches of this nerve.",
        marks: 1,
        answer:
          "1. Deep peroneal nerve (deep fibular nerve) — dorsiflexion & toe extension.\n2. Superficial peroneal nerve (superficial fibular nerve) — eversion of foot.",
      },
      {
        q: "Mention two common clinical conditions which may affect this nerve.",
        marks: 1,
        answer:
          "1. Fracture of the neck of fibula (nerve winds around the fibular neck).\n2. Prolonged pressure / habitual leg crossing (compression at fibular neck).",
      },
      {
        q: "Name the group of muscles affected in foot drop.",
        marks: 0.5,
        answer:
          "Anterior compartment muscles (dorsiflexors): Tibialis anterior, Extensor digitorum longus, Extensor hallucis longus, Peroneus (fibularis) tertius.",
      },
      {
        q: "Name the movements lost in foot drop.",
        marks: 1,
        answer:
          "1. Dorsiflexion of the foot (lost — causes the characteristic drop)\n2. Eversion of the foot (lost — superficial peroneal branch)\n3. Extension of toes",
      },
    ],
  },
  {
    id: "p013",
    stationNo: "P013",
    topic: "Amniocentesis",
    scenario: "The above picture represents a prenatal test.",
    region: "Embryology",
    thumbnail: "p013_amniocentesis",
    totalMarks: 4,
    questions: [
      {
        q: "Name the procedure shown in this figure.",
        marks: 0.5,
        answer: "Amniocentesis.",
      },
      {
        q: "Name two other investigations done as part of prenatal testing.",
        marks: 1,
        answer:
          "1. Chorionic villus sampling (CVS)\n2. Cordocentesis (percutaneous umbilical blood sampling / PUBS)",
      },
      {
        q: "Which is the time period in which this test is done?",
        marks: 1,
        answer:
          "15–20 weeks of gestation (2nd trimester); optimally at 15–18 weeks.",
      },
      {
        q: "What is the fluid obtained in this investigation?",
        marks: 0.5,
        answer: "Amniotic fluid.",
      },
      {
        q: "Mention two investigations that this fluid is subjected to.",
        marks: 1,
        answer:
          "1. Karyotyping / chromosomal analysis (to detect Down syndrome, trisomies, etc.)\n2. Alpha-fetoprotein (AFP) level — elevated in neural tube defects",
      },
    ],
  },
  {
    id: "p015",
    stationNo: "P015",
    topic: "Gluteal Intramuscular Injection",
    scenario:
      "The above picture represents intramuscular injection in the gluteal region.",
    region: "Lower Limb",
    thumbnail: "p015_gluteal_injection",
    totalMarks: 4,
    questions: [
      {
        q: "Name two other muscles which are commonly used for intramuscular injection.",
        marks: 1,
        answer:
          "1. Vastus lateralis (anterolateral thigh) — preferred in infants.\n2. Deltoid (upper arm) — used for small-volume injections and vaccines.",
      },
      {
        q: "Name the structures which are penetrated in this condition.",
        marks: 1,
        answer:
          "1. Skin\n2. Subcutaneous (superficial) fascia\n3. Deep (gluteal) fascia\n4. Gluteus maximus muscle",
      },
      {
        q: "Why is the upper outer quadrant the most preferred site in this scenario?",
        marks: 0.5,
        answer:
          "The sciatic nerve and superior gluteal vessels course through the lower inner quadrant of the buttock. The upper outer quadrant is free of these major neurovascular structures, minimising risk of nerve or vessel injury.",
      },
      {
        q: "How will you clinically identify the site for injection?",
        marks: 1,
        answer:
          "Draw an imaginary cross dividing the buttock into four quadrants using:\n• Vertical line: from posterior superior iliac spine (PSIS) downward.\n• Horizontal line: through the greater trochanter.\nThe upper outer quadrant (above and lateral to this intersection) is the safe injection zone.",
      },
      {
        q: "Mention the cutaneous supply of the site of injection.",
        marks: 0.5,
        answer:
          "Superior cluneal nerves (dorsal rami of L1–L3) and middle cluneal nerves (dorsal rami of S1–S3).",
      },
    ],
  },
  {
    id: "p016",
    stationNo: "P016",
    topic: "Congenital Diaphragmatic Hernia",
    scenario:
      "The above picture represents a congenital Diaphragmatic hernia.",
    region: "Thorax",
    thumbnail: "p016_cdh",
    totalMarks: 4,
    questions: [
      {
        q: "Mention the parts of the diaphragm and its developmental source.",
        marks: 1.5,
        answer:
          "Central tendon → Septum transversum\nMuscular dome (posterolateral parts) → Pleuroperitoneal folds\nCrural part (posterior) → Dorsal mesentery of oesophagus\nPeripheral muscular rim → Body wall (somatic mesoderm)",
      },
      {
        q: "Which is the most common defect which leads to CDH?",
        marks: 0.5,
        answer:
          "Posterolateral defect (Bochdalek hernia) — failure of the pleuroperitoneal fold to close, leaving a gap through which abdominal viscera herniate into the thorax (usually left-sided).",
      },
      {
        q: "Mention the major openings of the diaphragm and their vertebral levels.",
        marks: 1.5,
        answer:
          "Aortic hiatus — T12 (aorta, thoracic duct, azygos vein)\nOesophageal hiatus — T10 (oesophagus, vagal trunks, left gastric vessels)\nVena caval foramen — T8 (IVC, right phrenic nerve)",
      },
      {
        q: "Mention the motor nerve supply of the diaphragm.",
        marks: 0.5,
        answer:
          "Phrenic nerve (C3, C4, C5) — 'C3, 4, 5 keeps the diaphragm alive.'",
      },
    ],
  },
  {
    id: "p017",
    stationNo: "P017",
    topic: "Rupture of Male Urethra",
    scenario:
      "The above picture represents rupture of male urethra during a road traffic accident in a cyclist.",
    region: "Abdomen",
    thumbnail: "p017_urethra",
    totalMarks: 4,
    questions: [
      {
        q: "Mention the parts of the male urethra.",
        marks: 1,
        answer:
          "1. Prostatic urethra\n2. Membranous urethra\n3. Spongy (penile) urethra — including the bulbar and penile portions\n4. Navicular fossa (external urethral meatus)",
      },
      {
        q: "Which part of the urethra is affected in this condition?",
        marks: 0.5,
        answer:
          "Bulbar urethra (bulbous part of the spongy urethra) — the fixed segment, susceptible to straddle injuries in cyclists.",
      },
      {
        q: "Name two sites into which urine extravasates and mention the anatomical reason.",
        marks: 1.5,
        answer:
          "1. Superficial perineal pouch — Buck's fascia (deep fascia of penis) is torn; urine tracks into the perineum deep to Colles' fascia.\n2. Scrotum / anterior abdominal wall — Colles' fascia is continuous with Scarpa's fascia of the anterior abdominal wall, allowing spread upward toward the umbilicus.",
      },
      {
        q: "What is the limit of extravasation of urine into the lower limb?",
        marks: 1,
        answer:
          "Urine does NOT enter the thigh/lower limb because Colles' fascia (superficial perineal fascia) fuses with the fascia lata at the inguinal ligament, preventing inferior spread into the thigh.",
      },
    ],
  },
  {
    id: "p018",
    stationNo: "P018",
    topic: "Wrist Drop / Radial Nerve Injury",
    scenario:
      "The above diagram depicts the position of the upper limb in a long nerve injury.",
    region: "Upper Limb",
    thumbnail: "p018_wrist_drop",
    totalMarks: 4,
    questions: [
      {
        q: "Mention the clinical condition observed.",
        marks: 0.5,
        answer: "Wrist drop (radial nerve palsy).",
      },
      {
        q: "Which is the nerve likely to be injured here?",
        marks: 0.5,
        answer: "Radial nerve.",
      },
      {
        q: "Mention the level of termination of this nerve.",
        marks: 0.5,
        answer:
          "The radial nerve divides into its two terminal branches at the level of the lateral epicondyle of the humerus (in front of the elbow).",
      },
      {
        q: "Which are the group of muscles affected in injury to this nerve?",
        marks: 1,
        answer:
          "Posterior compartment muscles of the forearm (extensors of the wrist and fingers):\nExtensor carpi radialis longus & brevis, Extensor carpi ulnaris, Extensor digitorum, Extensor digiti minimi, Extensor indicis, Extensor pollicis longus & brevis, Abductor pollicis longus, Supinator.",
      },
      {
        q: "Name the two terminal branches of this nerve.",
        marks: 1,
        answer:
          "1. Superficial branch (superficial radial nerve) — sensory only; supplies skin over dorsal hand and fingers.\n2. Deep branch (posterior interosseous nerve) — motor; enters the posterior compartment through the supinator.",
      },
      {
        q: "Mention the termination of the muscular terminal branch.",
        marks: 0.5,
        answer:
          "The posterior interosseous nerve terminates on the dorsum of the wrist, ending as a pseudo-ganglion on the posterior interosseous membrane.",
      },
    ],
  },
  {
    id: "p019",
    stationNo: "P019",
    topic: "Waldeyer's Ring",
    scenario:
      "The above picture represents Waldeyer's lymphoid ring.",
    region: "Head & Neck",
    thumbnail: "p019_waldeyers_ring",
    totalMarks: 4,
    questions: [
      {
        q: "Mention the components of the Waldeyer's ring.",
        marks: 1,
        answer:
          "1. Pharyngeal tonsil (adenoids) — unpaired\n2. Tubal tonsils — paired (×2)\n3. Palatine tonsils — paired (×2)\n4. Lingual tonsil — unpaired",
      },
      {
        q: "Mention the precise location of each of these components.",
        marks: 2,
        answer:
          "Pharyngeal tonsil: Posterior wall and roof of the nasopharynx\nTubal tonsil: Around the pharyngeal opening of the Eustachian (auditory) tube\nPalatine tonsil: Tonsillar fossa, between the palatoglossal (anterior) and palatopharyngeal (posterior) arches in the oropharynx\nLingual tonsil: Base (root) of the tongue, in the oropharynx",
      },
      {
        q: "In a five year old child with noisy breathing and snoring, which amongst these is likely to be affected?",
        marks: 0.5,
        answer:
          "Pharyngeal tonsil (adenoids) — adenoid hypertrophy blocks the posterior nasal apertures (choanae) causing nasal obstruction, mouth breathing, snoring, and 'adenoid facies'.",
      },
      {
        q: "Mention the development of the structure labelled in orange colour.",
        marks: 0.5,
        answer:
          "The palatine tonsil develops from the 2nd pharyngeal (branchial) pouch — the endoderm of the pouch forms the surface epithelium and crypts; the surrounding mesenchyme forms the lymphoid tissue.",
      },
    ],
  },
];
