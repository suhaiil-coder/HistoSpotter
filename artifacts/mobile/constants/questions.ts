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
  skeletal_muscle: require("../assets/images/slides/skeletal_muscle.jpg"),
  skeletal_muscle_2: require("../assets/images/slides/skeletal_muscle.jpg"),
  cardiac_muscle: require("../assets/images/slides/cardiac_muscle.jpg"),
  elastic_artery: require("../assets/images/slides/elastic_artery.jpg"),
  muscular_artery: require("../assets/images/slides/muscular_artery.jpg"),
  large_vein: require("../assets/images/slides/large_vein.jpg"),
  elastic_cartilage: require("../assets/images/slides/elastic_cartilage.jpg"),
  elastic_cartilage_2: require("../assets/images/slides/elastic_cartilage_2.jpg"),
  hyaline_cartilage: require("../assets/images/slides/hyaline_cartilage.jpg"),
  fibrocartilage: require("../assets/images/slides/fibrocartilage.jpg"),
  bone_transverse: require("../assets/images/slides/bone_transverse.jpg"),
  bone_longitudinal: require("../assets/images/slides/bone_longitudinal.jpg"),
  sensory_ganglia: require("../assets/images/slides/sensory_ganglia.jpg"),
  sensory_ganglia_2: require("../assets/images/slides/sensory_ganglia_2.jpg"),
  autonomic_ganglia: require("../assets/images/slides/autonomic_ganglia.jpg"),
  autonomic_ganglia_2: require("../assets/images/slides/autonomic_ganglia_2.jpg"),
  thin_skin: require("../assets/images/slides/thin_skin.jpg"),
  thick_skin: require("../assets/images/slides/thick_skin.jpg"),
  lymph_node: require("../assets/images/slides/lymph_node.jpg"),
  lymph_node_2: require("../assets/images/slides/lymph_node_2.jpg"),
  thymus: require("../assets/images/slides/thymus.jpg"),
  thymus_2: require("../assets/images/slides/thymus_2.jpg"),
  tonsil: require("../assets/images/slides/tonsil.jpg"),
  tonsil_2: require("../assets/images/slides/tonsil_2.jpg"),
  spleen: require("../assets/images/slides/spleen.jpg"),
  placenta: require("../assets/images/slides/placenta.jpg"),
  umbilical_cord: require("../assets/images/slides/umbilical_cord.jpg"),
  mixed_salivary_gland: require("../assets/images/slides/mixed_salivary_gland.jpg"),
  mixed_salivary_gland_2: require("../assets/images/slides/mixed_salivary_gland_2.jpg"),
  mucous_salivary_gland: require("../assets/images/slides/mucous_salivary_gland.jpg"),
  serous_salivary_gland: require("../assets/images/slides/serous_salivary_gland.jpg"),
  liver: require("../assets/images/slides/liver.jpg"),
  gall_bladder: require("../assets/images/slides/gall_bladder.jpg"),
  tongue: require("../assets/images/slides/tongue.jpg"),
  tongue_2: require("../assets/images/slides/tongue_2.jpg"),
  esophagus: require("../assets/images/slides/esophagus.jpg"),
  esophagus_2: require("../assets/images/slides/esophagus_2.jpg"),
  stomach_fundus: require("../assets/images/slides/stomach_fundus.jpg"),
  stomach_fundus_2: require("../assets/images/slides/stomach_fundus_2.jpg"),
  stomach_pylorus: require("../assets/images/slides/stomach_pylorus.jpg"),
  duodenum: require("../assets/images/slides/duodenum.jpg"),
  duodenum_2: require("../assets/images/slides/duodenum_2.jpg"),
  jejunum: require("../assets/images/slides/jejunum.jpg"),
  ileum: require("../assets/images/slides/ileum.jpg"),
  appendix: require("../assets/images/slides/appendix.jpg"),
  appendix_2: require("../assets/images/slides/appendix_2.jpg"),
  large_intestine: require("../assets/images/slides/large_intestine.jpg"),
  testis: require("../assets/images/slides/testis.jpg"),
  testis_2: require("../assets/images/slides/testis_2.jpg"),
  epididymis: require("../assets/images/slides/epididymis.jpg"),
  vas_deferens: require("../assets/images/slides/vas_deferens.jpg"),
  kidney: require("../assets/images/slides/kidney.jpg"),
  fallopian_tube: require("../assets/images/slides/fallopian_tube.jpg"),
  ovary: require("../assets/images/slides/ovary.jpg"),
  uterus_proliferative: require("../assets/images/slides/uterus_proliferative.jpg"),
  lung: require("../assets/images/slides/lung.jpg"),
  trachea: require("../assets/images/slides/trachea.jpg"),
  suprarenal_gland: require("../assets/images/slides/suprarenal_gland.jpg"),
  mammary_gland: require("../assets/images/slides/mammary_gland.jpg"),
  pituitary_gland: require("../assets/images/slides/pituitary_gland.jpg"),
  cornea: require("../assets/images/slides/cornea.jpg"),
  retina: require("../assets/images/slides/retina.jpg"),
  cerebrum: require("../assets/images/slides/cerebrum.jpg"),
};

export const ALL_QUESTIONS: Question[] = [
  // ── MUSCLE ──────────────────────────────────────────────────────────────
  {
    id: "q1",
    imageKey: "skeletal_muscle",
    question: "What feature identifies skeletal muscle in this image?",
    options: [
      "Intercalated discs and branched fibres",
      "Involuntary control and single nucleus",
      "Cross-striations and peripheral nuclei",
      "Smooth fibres with central nucleus",
    ],
    correctIndex: 2,
    category: "Muscle",
    explanation:
      "Skeletal muscle shows alternating dark A-bands and light I-bands (cross-striations) with multiple nuclei pushed to the periphery by myofibrils. It is voluntary and unbranched.",
  },
  {
    id: "q2",
    imageKey: "skeletal_muscle",
    question: "Which band in striated muscle contains ONLY thin (actin) filaments?",
    options: ["A band", "H zone", "I band", "M line"],
    correctIndex: 2,
    category: "Muscle",
    explanation:
      "The I band (isotropic) contains only thin actin filaments extending from the Z disc. It appears light under polarised light because it does not rotate the plane of polarised light.",
  },
  {
    id: "q3",
    imageKey: "cardiac_muscle",
    question: "Cardiac muscle differs from skeletal muscle because it has:",
    options: [
      "No cross-striations",
      "Intercalated discs and central nuclei",
      "Multiple peripheral nuclei",
      "No sarcomeres",
    ],
    correctIndex: 1,
    category: "Muscle",
    explanation:
      "Cardiac muscle has intercalated discs (fascia adherens + gap junctions allowing electrical coupling) and centrally placed nuclei. It is striated but involuntary and branched.",
  },
  // ── EPITHELIUM / SKIN ───────────────────────────────────────────────────
  {
    id: "q4",
    imageKey: "thin_skin",
    question: "Thin skin differs from thick skin because it has:",
    options: [
      "Prominent stratum corneum and lucidum",
      "Hair follicles, sebaceous glands and arrectores pilorum",
      "No stratum granulosum",
      "Thicker epidermis overall",
    ],
    correctIndex: 1,
    category: "Epithelium",
    explanation:
      "Thin skin contains hair follicles, sebaceous glands and arrectores pilorum muscles. It covers most body surfaces. Thick skin (palms, soles) lacks hair but has a prominent stratum lucidum.",
  },
  {
    id: "q5",
    imageKey: "thick_skin",
    question: "The outermost layer of the epidermis in this thick-skin slide is the:",
    options: [
      "Stratum basale",
      "Stratum spinosum",
      "Stratum granulosum",
      "Stratum corneum",
    ],
    correctIndex: 3,
    category: "Epithelium",
    explanation:
      "The stratum corneum is the outermost layer of dead, anucleate keratinocytes filled with keratin. It provides the skin's barrier. Thick skin also shows a prominent stratum lucidum just beneath it.",
  },
  {
    id: "q6",
    imageKey: "thin_skin",
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
      "Melanocytes reside in the stratum basale. They produce melanin and transfer it to surrounding keratinocytes via dendritic processes, providing UV protection.",
  },
  {
    id: "q7",
    imageKey: "trachea",
    question: "The lining epithelium of the trachea visible here is:",
    options: [
      "Simple squamous",
      "Stratified squamous keratinised",
      "Pseudostratified ciliated columnar with goblet cells",
      "Simple cuboidal",
    ],
    correctIndex: 2,
    category: "Epithelium",
    explanation:
      "The trachea is lined by pseudostratified ciliated columnar epithelium with goblet cells (respiratory epithelium). All cells touch the basement membrane but not all reach the lumen, giving a false impression of stratification.",
  },
  // ── NERVOUS ─────────────────────────────────────────────────────────────
  {
    id: "q8",
    imageKey: "sensory_ganglia",
    question: "Sensory (dorsal root) ganglia contain which type of neurons?",
    options: [
      "Multipolar neurons with eccentric nuclei",
      "Large round pseudounipolar neurons surrounded by satellite cells",
      "Bipolar neurons with thin unmyelinated fibres",
      "Purkinje cells with flask-shaped bodies",
    ],
    correctIndex: 1,
    category: "Nervous",
    explanation:
      "Sensory ganglia contain large, round pseudounipolar neurons arranged in groups. Each neuron is surrounded by satellite (capsule) cells and separated by bundles of myelinated nerve fibres.",
  },
  {
    id: "q9",
    imageKey: "autonomic_ganglia",
    question: "Autonomic ganglia differ from sensory ganglia in that they contain:",
    options: [
      "Large pseudounipolar neurons in groups",
      "No satellite cells",
      "Small irregular multipolar neurons with eccentrically placed nuclei",
      "Heavily myelinated fibres",
    ],
    correctIndex: 2,
    category: "Nervous",
    explanation:
      "Autonomic ganglia have small, irregular multipolar neurons with eccentrically placed nuclei scattered among thin unmyelinated fibres. They have fewer satellite cells than sensory ganglia.",
  },
  {
    id: "q10",
    imageKey: "cerebrum",
    question: "The cerebral cortex (gray matter) is organised into how many layers?",
    options: ["3", "4", "6", "10"],
    correctIndex: 2,
    category: "Nervous",
    explanation:
      "The cerebral cortex has 6 layers (from superficial to deep): Molecular, Outer granular, Pyramidal cell, Inner granular, Ganglionic (internal pyramidal), and Polymorphous layers.",
  },
  // ── ORGANS – KIDNEY ─────────────────────────────────────────────────────
  {
    id: "q11",
    imageKey: "kidney",
    question: "The rounded structure with a tuft of capillaries visible in this kidney slide is:",
    options: ["Bowman's capsule only", "Glomerulus", "Loop of Henle", "Collecting duct"],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "The glomerulus is a knot of fenestrated capillaries enclosed within Bowman's capsule. Together they form the renal corpuscle — the filtration unit of the nephron.",
  },
  {
    id: "q12",
    imageKey: "kidney",
    question: "Proximal convoluted tubules are distinguished from distal tubules by having:",
    options: [
      "Larger lumen and no brush border",
      "Brush border (microvilli) and smaller irregular lumen",
      "Thinner walls and wider lumen",
      "More visible nuclei per section",
    ],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "Proximal convoluted tubules have a well-developed brush border of microvilli that increases the absorptive surface, an eosinophilic cytoplasm, and a characteristically smaller, irregular lumen.",
  },
  // ── ORGANS – LIVER ──────────────────────────────────────────────────────
  {
    id: "q13",
    imageKey: "liver",
    question: "The classic hepatic lobule is organised around a central structure called the:",
    options: ["Portal triad", "Central vein", "Sinusoid", "Space of Disse"],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "The classic hepatic lobule is hexagonal and centred on the central vein (central hepatic venule). Blood flows from portal triads at the periphery through sinusoids toward the central vein.",
  },
  {
    id: "q14",
    imageKey: "liver",
    question: "The portal triad at the periphery of a hepatic lobule contains:",
    options: [
      "Hepatic vein, lymphatic, nerve",
      "Portal vein, hepatic artery, bile duct",
      "Central vein, sinusoid, bile canaliculus",
      "Hepatic vein, portal vein, lymphatic",
    ],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "Each portal triad contains a branch of the portal vein, hepatic artery, and bile duct embedded in connective tissue. Bile flows opposite to blood — from centre outward to the portal triad.",
  },
  // ── ORGANS – LUNG ───────────────────────────────────────────────────────
  {
    id: "q15",
    imageKey: "lung",
    question: "The thin-walled air sacs responsible for gas exchange in this slide are:",
    options: ["Bronchioles", "Alveoli", "Alveolar ducts", "Respiratory bronchioles"],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "Alveoli are the terminal air sacs. Their walls contain type I pneumocytes (gas exchange) and type II pneumocytes (surfactant production), separated by a thin blood-air barrier.",
  },
  {
    id: "q16",
    imageKey: "trachea",
    question: "The cartilage rings seen in the trachea are:",
    options: [
      "Complete rings of hyaline cartilage",
      "C-shaped rings of hyaline cartilage with trachealis muscle posteriorly",
      "Elastic cartilage rings",
      "Fibrocartilage rings",
    ],
    correctIndex: 1,
    category: "Organs",
    explanation:
      "The trachea has 16–20 C-shaped (incomplete) rings of hyaline cartilage. The gap posteriorly is bridged by the trachealis smooth muscle, allowing the oesophagus to bulge during swallowing.",
  },
  // ── ORGANS – GIT ────────────────────────────────────────────────────────
  {
    id: "q17",
    imageKey: "stomach_fundus",
    question: "The gastric pits in the fundus extend to what depth of the mucosa?",
    options: ["1/4", "1/2", "2/3", "Full thickness"],
    correctIndex: 0,
    category: "Organs",
    explanation:
      "In the fundus, gastric pits (foveolae) extend to approximately 1/4 of the mucosal depth. The deep lamina propria is packed with fundic glands containing parietal cells (HCl) and chief cells (pepsinogen).",
  },
  {
    id: "q18",
    imageKey: "duodenum",
    question: "Brunner's glands in the submucosa are a unique feature of the:",
    options: ["Jejunum", "Ileum", "Duodenum", "Large intestine"],
    correctIndex: 2,
    category: "Organs",
    explanation:
      "Brunner's glands (duodenal glands) are mucus-secreting tubulo-acinar glands in the submucosa of the duodenum. Their alkaline mucus protects the mucosa from acidic gastric chyme.",
  },
  {
    id: "q19",
    imageKey: "ileum",
    question: "Peyer's patches — aggregated lymphoid nodules — are characteristic of the:",
    options: ["Duodenum", "Jejunum", "Ileum", "Large intestine"],
    correctIndex: 2,
    category: "Organs",
    explanation:
      "Peyer's patches are large aggregates of lymphoid tissue in the lamina propria and submucosa of the ileum. They sample luminal antigens and initiate immune responses against gut pathogens.",
  },
  // ── ORGANS – LYMPHOID ───────────────────────────────────────────────────
  {
    id: "q20",
    imageKey: "thymus",
    question: "Hassall's corpuscles are a distinguishing feature found in the:",
    options: ["Lymph node medulla", "Spleen white pulp", "Thymus medulla", "Tonsil crypts"],
    correctIndex: 2,
    category: "Organs",
    explanation:
      "Hassall's corpuscles are concentric whorls of epithelial reticular cells found only in the thymus medulla. They are thought to be involved in regulatory T-cell development.",
  },
];

export const CATEGORIES = ["Epithelium", "Muscle", "Nervous", "Organs"];
