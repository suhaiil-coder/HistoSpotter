export interface ULQuestion {
  id: number;
  spotter: string;
  structureName: string;
  questionA: string;
  questionB: string;
  answerA: string;
  answerB: string;
}

export const UPPER_LIMB_QUESTIONS: ULQuestion[] = [
  {
    id: 1,
    spotter: "UL-1",
    structureName: "Pectoralis Major",
    questionA: "Identify the pinned structure.",
    questionB: "Give its nerve supply and insertion.",
    answerA: "Pectoralis Major",
    answerB:
      "Nerve supply: Medial and lateral pectoral nerves\n\nInsertion: Lateral lip of bicipital groove",
  },
  {
    id: 2,
    spotter: "UL-2",
    structureName: "Biceps Brachii",
    questionA: "Identify the pinned structure.",
    questionB: "Give its attachments, nerve supply and action.",
    answerA: "Biceps brachii",
    answerB:
      "Origin:\n• Short head – Tip of coracoid process\n• Long head – Supraglenoid tubercle of scapula\n\nInsertion: Posterior rough part of radial tuberosity\n\nNerve supply: Musculocutaneous nerve\n\nAction: Flexion of arm and supination of forearm",
  },
  {
    id: 3,
    spotter: "UL-3",
    structureName: "Deltoid",
    questionA: "Identify the red starred structure.",
    questionB: "Give its insertion, nerve supply, action and clinical importance.",
    answerA: "Deltoid",
    answerB:
      "Insertion: Deltoid tuberosity of humerus\n\nNerve supply: Axillary nerve\n\nAction:\n• Acromial fibres – Abduction of arm from 15° to 90°\n• Anterior fibres – Flexion and medial rotation of arm\n• Posterior fibres – Extension and lateral rotation of arm\n\nClinical importance: Site for intramuscular injections",
  },
  {
    id: 4,
    spotter: "UL-4",
    structureName: "Serratus Anterior",
    questionA: "Identify the pinned structure.",
    questionB: "Give its attachment, nerve supply, action and applied anatomy.",
    answerA: "Serratus anterior",
    answerB:
      "Origin: From the upper eight ribs\n\nInsertion: Costal surface of medial border of scapula\n\nNerve supply: Nerve to serratus anterior (long thoracic nerve, C5, C6, C7)\n\nAction:\n• Protraction of scapula\n• Abduction of shoulder above 90°\n\nApplied anatomy: Winging of scapula",
  },
  {
    id: 5,
    spotter: "UL-5",
    structureName: "Triceps Brachii",
    questionA: "Identify the yellow starred structure.",
    questionB: "Give its attachment, nerve supply and action.",
    answerA: "Triceps brachii",
    answerB:
      "Origin:\n• Long head – Infraglenoid tubercle of scapula\n• Lateral head – Posterior surface of humerus above the radial groove\n• Medial head – Posterior surface of humerus below the radial groove\n\nInsertion: Superior surface of olecranon process of ulna\n\nNerve supply: Radial nerve\n• Above radial groove → long and medial head\n• At radial groove → lateral and medial head\n\nAction: Extension of arm",
  },
  {
    id: 6,
    spotter: "UL-6",
    structureName: "Pronator Quadratus",
    questionA: "Identify the pinned structure.",
    questionB: "Give its nerve supply and action.",
    answerA: "Pronator Quadratus",
    answerB:
      "Nerve supply: Anterior interosseous nerve\n\nAction:\n• Pronation of forearm\n• Binds the lower end of radius and ulna together",
  },
  {
    id: 7,
    spotter: "UL-7",
    structureName: "First Lumbrical",
    questionA: "Identify the pinned structure.",
    questionB: "Give its nerve supply and action.",
    answerA: "First lumbrical",
    answerB:
      "Nerve supply: Median nerve\n\nAction:\n• Flexion of metacarpophalangeal joint\n• Extension of interphalangeal joint",
  },
  {
    id: 8,
    spotter: "UL-8",
    structureName: "Anatomical Snuff Box",
    questionA: "Identify the probed space.",
    questionB: "Mention its boundaries and contents.",
    answerA: "Anatomical snuff box",
    answerB:
      "Boundaries:\n• Anterior – Abductor pollicis longus and Extensor pollicis brevis\n• Posterior – Extensor pollicis longus\n• Roof – Skin and superficial fascia (containing cephalic vein and superficial branch of radial nerve)\n• Floor – Scaphoid and lunate bones\n\nContent: Radial artery",
  },
  {
    id: 9,
    spotter: "UL-9",
    structureName: "Adductor Pollicis",
    questionA: "Identify the pinned structure.",
    questionB: "Give its nerve supply and action.",
    answerA: "Adductor pollicis",
    answerB:
      "Nerve supply: Deep branch of ulnar nerve\n\nAction: Adduction of thumb",
  },
  {
    id: 10,
    spotter: "UL-10",
    structureName: "Latissimus Dorsi",
    questionA: "Identify the red starred structure.",
    questionB: "Give its insertion, nerve supply and action.",
    answerA: "Latissimus dorsi",
    answerB:
      "Insertion: Floor of bicipital groove (intertubercular sulcus)\n\nNerve supply: Thoracodorsal nerve (C6, C7, C8)\n\nAction: Adduction, extension and medial rotation of arm",
  },
  {
    id: 11,
    spotter: "UL-11",
    structureName: "Axillary Artery",
    questionA: "Identify the tied structure.",
    questionB: "Which muscle divides it? Give its extent, what it is a continuation of, and name its branches.",
    answerA: "Axillary artery",
    answerB:
      "Divided by: Pectoralis minor (into three parts)\n\nExtent: Outer border of first rib → lower border of teres major\n\nContinuation of: Subclavian artery\n\nBranches:\n• Part I – Superior thoracic artery\n• Part II – Lateral thoracic artery, Acromiothoracic artery\n• Part III – Subscapular artery, Anterior circumflex humeral artery, Posterior circumflex humeral artery",
  },
  {
    id: 12,
    spotter: "UL-12",
    structureName: "Brachial Artery",
    questionA: "Identify the tied structure.",
    questionB: "Give its extent, terminal branches, branches in the arm and clinical importance.",
    answerA: "Brachial artery",
    answerB:
      "Extent: Lower border of teres major → level of neck of radius\n\nContinuation of: Axillary artery\n\nTerminal branches: Radial artery and ulnar artery\n\nBranches in the arm:\n1. Profunda brachii\n2. Superior ulnar collateral artery\n3. Inferior ulnar collateral artery\n4. Muscular branches\n5. Nutrient artery to humerus\n\nClinical importance: Used to record blood pressure",
  },
  {
    id: 13,
    spotter: "UL-13",
    structureName: "Radial Artery",
    questionA: "Identify the tied structure.",
    questionB: "Name its branches and give its clinical importance.",
    answerA: "Radial artery",
    answerB:
      "Branches:\n1. Radial recurrent artery\n2. Muscular branches\n3. Palmar carpal branch\n4. Superficial palmar branch\n\nClinical importance: Used to record pulse rate",
  },
  {
    id: 14,
    spotter: "UL-14",
    structureName: "Ulnar Artery",
    questionA: "Identify the tied structure.",
    questionB: "Name its branches.",
    answerA: "Ulnar artery",
    answerB:
      "Branches:\n1. Anterior and posterior ulnar recurrent arteries\n2. Common interosseous artery\n3. Muscular branches\n4. Palmar and dorsal carpal branches",
  },
  {
    id: 15,
    spotter: "UL-15",
    structureName: "Superficial Palmar Arch",
    questionA: "Identify the tied structure.",
    questionB: "Give its formation and branches.",
    answerA: "Superficial palmar arch",
    answerB:
      "Formation: Formed by the superficial palmar branch of ulnar artery, completed by the superficial palmar branch of radial artery\n\nBranches: Digital branches for the medial 3½ fingers",
  },
  {
    id: 16,
    spotter: "UL-16",
    structureName: "Anterior Interosseous Nerve",
    questionA: "Identify the tied structure.",
    questionB: "Name the muscles supplied by it.",
    answerA: "Anterior interosseous nerve",
    answerB:
      "Muscles supplied:\n1. Lateral half of Flexor digitorum profundus\n2. Flexor pollicis longus\n3. Pronator quadratus",
  },
  {
    id: 17,
    spotter: "UL-17",
    structureName: "Axillary Nerve",
    questionA: "Identify the tied structure.",
    questionB: "Name the muscles supplied by it and give its root value.",
    answerA: "Axillary nerve",
    answerB:
      "Muscles supplied:\n1. Deltoid\n2. Teres Minor\n\nRoot value: Anterior primary rami of C5, C6",
  },
  {
    id: 18,
    spotter: "UL-18",
    structureName: "Median Nerve (Arm)",
    questionA: "Identify the tied structure.",
    questionB: "What is it a branch of? Give its root value.",
    answerA: "Median nerve (in arm)",
    answerB:
      "Branch of: Medial and lateral cords of brachial plexus\n\nRoot value: Ventral primary rami of C5, C6, C7, C8 and T1",
  },
  {
    id: 19,
    spotter: "UL-19",
    structureName: "Median Nerve (Forearm)",
    questionA: "Identify the tied structure.",
    questionB: "Name the muscles supplied by it.",
    answerA: "Median nerve (in forearm)",
    answerB:
      "Muscles supplied:\n1. Pronator teres\n2. Flexor carpi radialis\n3. Palmaris longus\n4. Flexor digitorum superficialis",
  },
  {
    id: 20,
    spotter: "UL-20",
    structureName: "Musculocutaneous Nerve",
    questionA: "Identify the tied structure.",
    questionB: "Name the muscles supplied by it and give its root value.",
    answerA: "Musculocutaneous nerve",
    answerB:
      "Muscles supplied:\n1. Coracobrachialis\n2. Biceps brachii\n3. Brachialis\n\nRoot value: Anterior primary rami of C5, C6, C7",
  },
  {
    id: 21,
    spotter: "UL-21",
    structureName: "Posterior Interosseous Nerve",
    questionA: "Identify the tied structure.",
    questionB: "Name any three muscles supplied by it.",
    answerA: "Posterior interosseous nerve",
    answerB:
      "Muscles supplied (any three):\n1. Supinator\n2. Abductor pollicis longus\n3. Extensor pollicis brevis\n(also: Extensor pollicis longus, Extensor indicis, Extensor digiti minimi, Extensor carpi ulnaris)",
  },
  {
    id: 22,
    spotter: "UL-22",
    structureName: "Radial Nerve (Spiral Groove)",
    questionA: "Identify the tied structure above the forceps.",
    questionB: "Name the muscles supplied at this level, give its root value and name the structure accompanying it.",
    answerA: "Radial nerve (in spiral groove)",
    answerB:
      "Muscles supplied at this level: Lateral and medial heads of triceps, Anconeus\n\nRoot value: Anterior primary rami of C5, C6, C7, C8 and T1\n\nAccompanying structure: Profunda brachii vessels",
  },
  {
    id: 23,
    spotter: "UL-23",
    structureName: "Superficial Branch of Radial Nerve",
    questionA: "Identify the tied structure.",
    questionB: "Give its area of supply.",
    answerA: "Superficial branch of radial nerve",
    answerB:
      "Area of supply: Lateral half of dorsum of hand and lateral three and a half digits up to the distal interphalangeal joint",
  },
  {
    id: 24,
    spotter: "UL-24",
    structureName: "Ulnar Nerve (Arm)",
    questionA: "Identify the tied structure.",
    questionB: "Give its root value.",
    answerA: "Ulnar nerve (in arm)",
    answerB: "Root value: Anterior primary rami of C8, T1",
  },
  {
    id: 25,
    spotter: "UL-25",
    structureName: "Ulnar Nerve (Forearm)",
    questionA: "Identify the tied structure.",
    questionB: "Name the muscles supplied by it.",
    answerA: "Ulnar nerve (in forearm)",
    answerB:
      "Muscles supplied:\n1. Flexor carpi ulnaris\n2. Medial half of Flexor digitorum profundus",
  },
  {
    id: 26,
    spotter: "UL-26",
    structureName: "Extensor Retinaculum",
    questionA: "Identify the pinned structure.",
    questionB: "Name the structures passing through the 4th compartment.",
    answerA: "Extensor retinaculum",
    answerB:
      "Structures passing through the 4th compartment:\n1. Extensor digitorum\n2. Extensor indicis\n3. Posterior interosseous nerve\n4. Anterior interosseous artery",
  },
  {
    id: 27,
    spotter: "UL-27",
    structureName: "Flexor Retinaculum",
    questionA: "Identify the pinned structure.",
    questionB: "Give its attachment, structures passing below it, and applied anatomy.",
    answerA: "Flexor retinaculum",
    answerB:
      "Attachment:\n• Medially – Pisiform and hook of hamate\n• Laterally – Tubercle of scaphoid and crest of trapezium\n\nStructures passing below it:\n1. Median nerve\n2. Tendon of flexor digitorum superficialis\n3. Tendon of flexor digitorum profundus\n4. Tendon of flexor pollicis longus\n5. Radial bursa\n6. Ulnar bursa\n\nApplied anatomy: Carpal Tunnel Syndrome",
  },
  {
    id: 28,
    spotter: "UL-28",
    structureName: "Lower Triangular Space",
    questionA: "Identify the probed space.",
    questionB: "Mention its boundaries and contents.",
    answerA: "Lower triangular space",
    answerB:
      "Boundaries:\n• Medial – Long head of triceps\n• Lateral – Shaft of humerus\n• Above – Teres major\n\nContents: Radial nerve and profunda brachii vessels",
  },
  {
    id: 29,
    spotter: "UL-29",
    structureName: "Quadrangular Space",
    questionA: "Identify the yellow starred space.",
    questionB: "Mention its boundaries and contents.",
    answerA: "Quadrangular space",
    answerB:
      "Boundaries:\n• Superior – Subscapularis (front), Teres minor (behind)\n• Inferior – Teres major\n• Medial – Long head of triceps\n• Lateral – Surgical neck of humerus\n\nContents: Axillary nerve and posterior circumflex humeral vessels",
  },
  {
    id: 30,
    spotter: "UL-30",
    structureName: "Upper Triangular Space",
    questionA: "Identify the probed space.",
    questionB: "Mention its boundaries and contents.",
    answerA: "Upper triangular space",
    answerB:
      "Boundaries:\n• Medial – Teres minor\n• Lateral – Long head of triceps\n• Inferior – Teres major\n\nContent: Circumflex scapular artery",
  },
];
