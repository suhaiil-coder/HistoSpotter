export interface Question {
  id: string;
  imageKey: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  explanation: string;
}

export const imageMap: Record<string, any> = {
  epithelial: require("../assets/images/histo_epithelial.png"),
  muscle: require("../assets/images/histo_muscle.png"),
  kidney: require("../assets/images/histo_kidney.png"),
  nerve: require("../assets/images/histo_nerve.png"),
  liver: require("../assets/images/histo_liver.png"),
  lung: require("../assets/images/histo_lung.png"),
  skin: require("../assets/images/histo_skin.png"),
};

export const ALL_QUESTIONS: Question[] = [
  {
    id: "q1",
    imageKey: "epithelial",
    question: "What type of epithelium is shown in this slide?",
    options: [
      "Simple squamous epithelium",
      "Stratified cuboidal epithelium",
      "Simple columnar epithelium",
      "Pseudostratified epithelium",
    ],
    correctIndex: 0,
    category: "Epithelium",
    explanation:
      "Simple squamous epithelium consists of a single layer of flat, scale-like cells. It lines blood vessels, lymphatics, and body cavities.",
  },
  {
    id: "q2",
    imageKey: "epithelial",
    question: "Which organelle is most abundant in absorptive epithelial cells?",
    options: ["Golgi apparatus", "Mitochondria", "Smooth ER", "Lysosomes"],
    correctIndex: 1,
    category: "Epithelium",
    explanation:
      "Mitochondria are abundant in absorptive cells to provide the energy (ATP) needed for active transport of nutrients across the epithelium.",
  },
  {
    id: "q3",
    imageKey: "muscle",
    question: "What feature identifies skeletal muscle in this image?",
    options: [
      "Intercalated discs",
      "Involuntary control",
      "Cross-striations and peripheral nuclei",
      "Single central nucleus",
    ],
    correctIndex: 2,
    category: "Muscle",
    explanation:
      "Skeletal muscle is identified by its cross-striations (alternating dark A bands and light I bands) and peripherally located nuclei pushed to the cell edge by myofibrils.",
  },
  {
    id: "q4",
    imageKey: "muscle",
    question: "Which band in striated muscle contains only thin (actin) filaments?",
    options: ["A band", "H zone", "I band", "M line"],
    correctIndex: 2,
    category: "Muscle",
    explanation:
      "The I band (isotropic band) contains only thin actin filaments extending from the Z disc. It appears light under polarized light microscopy.",
  },
  {
    id: "q5",
    imageKey: "nerve",
    question: "The large cells with prominent nucleoli visible here are:",
    options: ["Schwann cells", "Oligodendrocytes", "Motor neurons", "Microglia"],
    correctIndex: 2,
    category: "Nervous",
    explanation:
      "Motor neurons are among the largest cells in the body. They have a large, pale nucleus with a prominent nucleolus and extensive Nissl substance (rough ER) in the cytoplasm.",
  },
  {
    id: "q6",
    imageKey: "nerve",
    question: "Which cells produce myelin in the peripheral nervous system?",
    options: ["Astrocytes", "Schwann cells", "Oligodendrocytes", "Microglia"],
    correctIndex: 1,
    category: "Nervous",
    explanation:
      "Schwann cells myelinate axons in the peripheral nervous system (PNS). Each Schwann cell wraps around a single axon segment, unlike oligodendrocytes which myelinate multiple axons in the CNS.",
  },
  {
    id: "q7",
    imageKey: "kidney",
    question: "The rounded structure with a tuft of capillaries shown is a:",
    options: ["Bowman's capsule only", "Glomerulus", "Loop of Henle", "Collecting duct"],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "The glomerulus is a knot of fenestrated capillaries enclosed within Bowman's capsule. Together they form the renal corpuscle, the filtration unit of the nephron.",
  },
  {
    id: "q8",
    imageKey: "kidney",
    question: "Proximal convoluted tubules can be distinguished from distal tubules by:",
    options: [
      "Larger lumen and no brush border",
      "Brush border (microvilli) and smaller lumen",
      "Thinner walls and wider lumen",
      "More nuclei per cross-section",
    ],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "Proximal convoluted tubules have a brush border of microvilli (increases absorptive surface) and an eosinophilic cytoplasm with a characteristically smaller, irregular lumen compared to distal tubules.",
  },
  {
    id: "q9",
    imageKey: "liver",
    question: "The hepatic lobule is organized around a central structure called the:",
    options: ["Portal triad", "Central vein", "Sinusoid", "Space of Disse"],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "The classic hepatic lobule is hexagonal and centered on the central vein (central hepatic venule). Blood flows from portal triads at the periphery through sinusoids to the central vein.",
  },
  {
    id: "q10",
    imageKey: "liver",
    question: "Which cells line the hepatic sinusoids and are part of the mononuclear phagocyte system?",
    options: ["Ito cells", "Kupffer cells", "Hepatocytes", "Pit cells"],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "Kupffer cells are resident macrophages that line the hepatic sinusoids. They phagocytose bacteria, old red blood cells, and debris from portal blood.",
  },
  {
    id: "q11",
    imageKey: "lung",
    question: "The thin-walled air sacs responsible for gas exchange are called:",
    options: ["Bronchioles", "Alveoli", "Alveolar ducts", "Respiratory bronchioles"],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "Alveoli are the terminal air sacs of the respiratory system. Their walls consist of type I pneumocytes (for gas exchange) and type II pneumocytes (produce surfactant).",
  },
  {
    id: "q12",
    imageKey: "lung",
    question: "Type II pneumocytes are characterized by their ability to:",
    options: [
      "Facilitate gas exchange directly",
      "Produce surfactant and regenerate type I cells",
      "Phagocytose inhaled particles",
      "Contract to assist breathing",
    ],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "Type II pneumocytes (great alveolar cells) produce pulmonary surfactant stored in lamellar bodies. They also serve as progenitor cells that can regenerate type I pneumocytes after injury.",
  },
  {
    id: "q13",
    imageKey: "skin",
    question: "The outermost layer of the epidermis visible in this slide is the:",
    options: [
      "Stratum basale",
      "Stratum spinosum",
      "Stratum granulosum",
      "Stratum corneum",
    ],
    correctIndex: 3,
    category: "Epithelium",
    explanation:
      "The stratum corneum is the outermost layer composed of dead, anucleate keratinocytes (corneocytes) filled with keratin. It provides the skin's barrier function.",
  },
  {
    id: "q14",
    imageKey: "skin",
    question: "Melanocytes are found in which epidermal layer?",
    options: [
      "Stratum corneum",
      "Stratum lucidum",
      "Stratum basale",
      "Stratum granulosum",
    ],
    correctIndex: 2,
    category: "Epithelium",
    explanation:
      "Melanocytes reside in the stratum basale (basal layer) of the epidermis. They produce melanin pigment and transfer it to surrounding keratinocytes via dendritic processes.",
  },
  {
    id: "q15",
    imageKey: "muscle",
    question: "Cardiac muscle differs from skeletal muscle in that it has:",
    options: [
      "No cross-striations",
      "Intercalated discs and central nuclei",
      "Multiple peripheral nuclei",
      "No sarcomeres",
    ],
    correctIndex: 1,
    category: "Muscle",
    explanation:
      "Cardiac muscle has intercalated discs (specialized cell junctions allowing electrical coupling) and centrally located nuclei. It is striated but involuntary.",
  },
  {
    id: "q16",
    imageKey: "nerve",
    question: "The myelin sheath gaps (nodes of Ranvier) facilitate:",
    options: [
      "Continuous conduction",
      "Saltatory conduction",
      "Retrograde transport",
      "Synaptic transmission",
    ],
    correctIndex: 1,
    category: "Nervous",
    explanation:
      "Nodes of Ranvier are gaps between adjacent Schwann cells where the axon is exposed. Action potentials 'jump' between nodes in saltatory conduction, greatly increasing conduction velocity.",
  },
  {
    id: "q17",
    imageKey: "kidney",
    question: "The macula densa is part of which structure?",
    options: [
      "Proximal convoluted tubule",
      "Collecting duct",
      "Juxtaglomerular apparatus",
      "Glomerular capillary",
    ],
    correctIndex: 2,
    category: "Organs",
    explanation:
      "The macula densa is a specialized region of the thick ascending limb / early distal tubule. Together with juxtaglomerular cells and extraglomerular mesangium, it forms the juxtaglomerular apparatus that regulates renin secretion.",
  },
  {
    id: "q18",
    imageKey: "liver",
    question: "The portal triad contains which three structures?",
    options: [
      "Hepatic vein, lymphatic, nerve",
      "Portal vein, hepatic artery, bile duct",
      "Central vein, sinusoid, bile canaliculus",
      "Hepatic vein, portal vein, lymphatic",
    ],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "Each portal triad (portal canal) contains a branch of the portal vein, hepatic artery, and bile duct, embedded in connective tissue. Bile flows opposite to blood — from center to periphery.",
  },
  {
    id: "q19",
    imageKey: "lung",
    question: "Alveolar macrophages (dust cells) originate from:",
    options: ["Type II pneumocytes", "Mast cells", "Circulating monocytes", "Fibroblasts"],
    correctIndex: 2,
    category: "Organs",
    explanation:
      "Alveolar macrophages are derived from circulating monocytes that migrate into the alveolar space. They phagocytose inhaled particulates, microorganisms, and debris.",
  },
  {
    id: "q20",
    imageKey: "skin",
    question: "Meissner's corpuscles (shown in dermal papillae) are receptors for:",
    options: ["Pain", "Temperature", "Fine touch and vibration", "Deep pressure"],
    correctIndex: 2,
    category: "Epithelium",
    explanation:
      "Meissner's corpuscles are encapsulated mechanoreceptors found in the dermal papillae of hairless skin (fingertips, lips). They detect fine touch, texture, and low-frequency vibration.",
  },
];

export const CATEGORIES = ["Epithelium", "Muscle", "Nervous", "Organs"];
