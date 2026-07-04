export interface QuizQuestion {
  id: number;
  questionA: string;
  questionB: string;
  answerA: string;
  answerB: string;
  /** Structure name shown on placeholder image after answer is revealed */
  structureName: string;
}

export const HEAD_NECK_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    structureName: "Sternocleidomastoid",
    questionA: "Identify the pointed structure.",
    questionB: "Write its origin and insertion.",
    answerA: "Sternocleidomastoid muscle",
    answerB:
      "Origin:\n• Sternal head (tendinous) — superolateral part of the front of the manubrium sterni.\n• Clavicular head (musculoaponeurotic) — medial third of the superior surface of the clavicle.\n\nInsertion:\n• A thick tendon on the lateral surface of the mastoid process.\n• A thin aponeurosis into the lateral half of the superior nuchal line of the occipital bone.",
  },
  {
    id: 2,
    structureName: "Sternocleidomastoid",
    questionA: "Identify the pointed structure.",
    questionB: "Write its nerve supply.",
    answerA: "Sternocleidomastoid muscle",
    answerB:
      "Nerve supply:\n1. Spinal accessory nerve.\n2. Ventral rami of C2 and C3 — mostly sensory, carry proprioceptive sensations from the muscle.",
  },
  {
    id: 3,
    structureName: "Anterior Belly of Digastric",
    questionA: "Identify the pinned structure.",
    questionB: "Write its origin and insertion.",
    answerA: "Anterior belly of Digastric muscle",
    answerB:
      "Origin: Digastric fossa of mandible.\n\nInsertion: Body of hyoid bone via intermediate tendon and its fibrous sling.",
  },
  {
    id: 4,
    structureName: "Anterior Belly of Digastric",
    questionA: "Identify the pinned structure.",
    questionB: "Write its action and nerve supply.",
    answerA: "Anterior belly of Digastric muscle",
    answerB:
      "Action: Depresses mandible; elevates hyoid bone during chewing and swallowing.\n\nNerve supply: Mylohyoid nerve (branch of inferior alveolar nerve).",
  },
  {
    id: 5,
    structureName: "Submandibular Gland",
    questionA: "Identify the pointed structure.",
    questionB: "Name the duct and where does it drain?",
    answerA: "Submandibular gland",
    answerB:
      "Duct: Submandibular duct (Wharton's duct).\n\nDrainage: Into the oral cavity on the summit of a sublingual papilla on either side of the frenulum of the tongue.",
  },
  {
    id: 6,
    structureName: "Common Carotid Artery",
    questionA: "Identify the pointed structure.",
    questionB: "Name its terminal branches and at what level they arise.",
    answerA: "Common carotid artery",
    answerB:
      "Terminal branches: External carotid artery (ECA) and Internal carotid artery (ICA).\n\nLevel: Upper border of the thyroid cartilage.",
  },
  {
    id: 7,
    structureName: "External Carotid Artery",
    questionA: "Identify the pointed structure.",
    questionB: "Write its any 4 branches.",
    answerA: "External carotid artery",
    answerB:
      "Branches:\n• Superior thyroid artery\n• Ascending pharyngeal artery\n• Lingual artery\n• Facial artery\n• Occipital artery\n• Posterior auricular artery\n• Maxillary artery\n• Superficial temporal artery",
  },
  {
    id: 8,
    structureName: "Vagus Nerve",
    questionA: "Identify the pointed structure.",
    questionB: "Write its relations within the carotid sheath.",
    answerA: "Vagus nerve",
    answerB:
      "Within the carotid sheath the vagus nerve lies between:\n• Internal jugular vein — laterally\n• Carotid artery — medially\n  (Common carotid in the lower part; internal carotid in the upper part.)",
  },
  {
    id: 9,
    structureName: "Masseter Muscle",
    questionA: "Identify the pointed structure.",
    questionB: "Write its attachments.",
    answerA: "Masseter muscle",
    answerB:
      "Origin:\n• Superficial layer — maxillary process of zygomatic bone and anterior 2/3 of the inferior border of the zygomatic arch.\n• Middle layer — lower border of the posterior 1/3 of the zygomatic arch.\n• Deep layer — deep surface of the zygomatic arch.\n\nInsertion:\n• Superficial fibres — angle and lower posterior half of the lateral surface of the ramus of the mandible.\n• Middle fibres — central part of ramus.\n• Deep fibres — upper part of the mandibular ramus and its coronoid process.",
  },
  {
    id: 10,
    structureName: "Masseter Muscle",
    questionA: "Identify the pointed structure.",
    questionB: "Write its nerve supply and action.",
    answerA: "Masseter muscle",
    answerB:
      "Nerve supply: Masseteric nerve (branch of mandibular nerve).\n\nAction: Elevates the mandible.",
  },
  {
    id: 11,
    structureName: "Parotid Gland",
    questionA: "Identify the pointed structure.",
    questionB: "Write the structures present within it.",
    answerA: "Parotid gland",
    answerB:
      "Structures within (superficial to deep):\n1. Facial nerve\n2. Retromandibular vein\n3. External carotid artery",
  },
  {
    id: 12,
    structureName: "Parotid Duct",
    questionA: "Identify the pointed structure.",
    questionB: "Where does it open?",
    answerA: "Parotid duct (Stensen's duct)",
    answerB:
      "The parotid duct (~5 cm long) emerges from the middle of the anterior border of the gland and opens into the vestibule of the mouth opposite the crown of the upper 2nd molar tooth.",
  },
  {
    id: 13,
    structureName: "Orbicularis Oculi",
    questionA: "Identify the pointed structure.",
    questionB: "What are the parts and their actions?",
    answerA: "Orbicularis oculi",
    answerB:
      "Parts and actions:\n• Orbital part — closes the eye tightly to protect it from intense light and dust.\n• Palpebral part — closes the eyelids gently (as in sleep or blinking).\n• Lacrimal part — dilates the lacrimal sac by traction on the lacrimal fascia, aiding drainage of lacrimal fluid.",
  },
  {
    id: 14,
    structureName: "Orbicularis Oris",
    questionA: "Identify the pointed structure.",
    questionB: "Write its nerve supply and action.",
    answerA: "Orbicularis oris",
    answerB:
      "Nerve supply: Buccal branch of the facial nerve.\n\nAction: Mouth closing, pouting, pursing, twisting.",
  },
  {
    id: 15,
    structureName: "Temporalis Muscle",
    questionA: "Identify the pointed structure.",
    questionB: "Write its origin and insertion.",
    answerA: "Temporalis muscle",
    answerB:
      "Origin:\n• Whole floor of the temporal fossa (except the part formed by the zygomatic bone).\n• Deep surface of the temporal fascia.\n\nInsertion:\n• Medial surface, apex, and anterior border of the coronoid process of the ramus of the mandible, and into the anterior border of the ramus almost up to the last molar tooth.",
  },
  {
    id: 16,
    structureName: "Thyroid Gland",
    questionA: "Identify the pointed structure.",
    questionB: "What are the medial surface relations?",
    answerA: "Thyroid gland",
    answerB:
      "Medial surface relations (mnemonic: 2 tubes, 2 muscles, 2 nerves):\n• 2 Tubes — Trachea and oesophagus\n• 2 Muscles — Inferior constrictor and cricothyroid\n• 2 Nerves — External laryngeal nerve and recurrent laryngeal nerve\n(Recurrent laryngeal nerve lies in the tracheo-oesophageal groove.)",
  },
  {
    id: 17,
    structureName: "Thyroid Gland",
    questionA: "Identify the pointed structure.",
    questionB: "Write its blood supply.",
    answerA: "Thyroid gland",
    answerB:
      "Blood supply:\n• Superior thyroid artery — branch of external carotid artery.\n• Inferior thyroid artery — branch of thyrocervical trunk.\n• Thyroidea ima artery — branch of arch of aorta or brachiocephalic trunk.",
  },
  {
    id: 18,
    structureName: "Facial Artery",
    questionA: "Identify the pointed structure.",
    questionB: "Write its branches in the face.",
    answerA: "Facial artery",
    answerB:
      "Branches in the face:\n• Inferior labial artery\n• Superior labial artery\n• Lateral nasal artery\n• Muscular branches\n• Angular artery (termination)",
  },
  {
    id: 19,
    structureName: "Facial Nerve",
    questionA: "Identify the pointed structure.",
    questionB: "Write its terminal branches.",
    answerA: "Facial nerve",
    answerB:
      "Terminal branches (5 in number):\n1. Temporal branch\n2. Zygomatic branch\n3. Buccal branches (upper & lower)\n4. Marginal mandibular branch\n5. Cervical branch",
  },
  {
    id: 20,
    structureName: "Facial Vein",
    questionA: "Identify the pointed structure.",
    questionB: "Write its formation.",
    answerA: "Facial vein",
    answerB:
      "Formation: Formed at the medial angle of the eye by the union of the supratrochlear and supraorbital veins.\n\nCourse: Runs behind the facial artery to reach the anteroinferior angle of the masseter, then joins the anterior division of the retromandibular vein below the angle of the mandible to form the common facial vein, which drains into the internal jugular vein.",
  },
  {
    id: 21,
    structureName: "Internal Jugular Vein",
    questionA: "Identify the tied structure.",
    questionB: "Write its tributaries.",
    answerA: "Internal jugular vein",
    answerB:
      "Tributaries:\n• Inferior petrosal sinus (first tributary)\n• Facial vein\n• Lingual vein\n• Pharyngeal vein\n• Superior and middle thyroid veins\n• Occipital vein (occasionally)",
  },
  {
    id: 22,
    structureName: "Trapezius Muscle",
    questionA: "Identify the pointed structure.",
    questionB: "Write its origin and insertion.",
    answerA: "Trapezius muscle",
    answerB:
      "Origin: Medial 1/3 of the superior nuchal line, external occipital protuberance, ligamentum nuchae, spine of C7 and spines of all thoracic vertebrae.\n\nInsertion:\n• Upper fibres — posterior border and upper surface of the lateral 1/3 of the clavicle.\n• Middle fibres — medial border of the acromion and upper lip of the spine of the scapula.\n• Lower fibres — tubercle of the spine of the scapula near its root.",
  },
  {
    id: 23,
    structureName: "Spinal Accessory Nerve",
    questionA: "Identify the pointed structure.",
    questionB: "Name the muscles innervated by the pointed structure.",
    answerA: "Spinal accessory nerve",
    answerB: "Muscles innervated:\n• Sternocleidomastoid\n• Trapezius",
  },
  {
    id: 24,
    structureName: "Ansa Cervicalis",
    questionA: "Identify the pointed structure.",
    questionB: "How is it formed?",
    answerA: "Ansa cervicalis",
    answerB:
      "Formation:\n• Superior root (descendens hypoglossi) — carries C1 fibres.\n• Inferior root (descendens cervicalis) — carries C2 and C3 fibres.",
  },
];
