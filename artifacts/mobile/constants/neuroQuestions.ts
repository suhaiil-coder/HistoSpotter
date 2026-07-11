export interface NeuroQuestion {
  id: number;
  spotter: string;
  structureName: string;
  questions: string[];
  answers: string[];
}

export const NEURO_QUESTIONS: NeuroQuestion[] = [
  {
    id: 1,
    spotter: "NA-1",
    structureName: "Anterolateral Sulcus of Medulla Oblongata",
    questions: [
      "Identify the pinned area.",
      "Mention the cranial nerve related to it.",
    ],
    answers: [
      "Anterolateral sulcus of medulla oblongata.",
      "Cranial nerve XII — Hypoglossal nerve. Its rootlets emerge from the anterolateral sulcus, between the pyramid and olive.",
    ],
  },
  {
    id: 2,
    spotter: "NA-2",
    structureName: "Basilar Artery",
    questions: [
      "Identify the pinned structure.",
      "Give its formation.",
      "Mention its branches.",
    ],
    answers: [
      "Basilar artery.",
      "Formed by the union of the right and left vertebral arteries at the lower border of the pons.",
      "1. Pontine branches\n2. Anterior inferior cerebellar artery (AICA)\n3. Labyrinthine artery\n4. Superior cerebellar artery (SCA)\n5. Posterior cerebral artery (PCA) — terminal branches",
    ],
  },
  {
    id: 3,
    spotter: "NA-3",
    structureName: "Basilar Sulcus",
    questions: [
      "Identify the pinned area.",
      "Give its content.",
    ],
    answers: [
      "Basilar sulcus — a shallow midline groove on the anterior surface of the pons.",
      "Basilar artery.",
    ],
  },
  {
    id: 4,
    spotter: "NA-4",
    structureName: "Cauda Equina",
    questions: [
      "Identify the tied structure.",
      "What does it consist of?",
    ],
    answers: [
      "Cauda equina.",
      "Roots of the lower four pairs of lumbar nerves (L2–L5), five pairs of sacral nerves (S1–S5), and one pair of coccygeal nerves — all contained within the lumbar cistern below the conus medullaris.",
    ],
  },
  {
    id: 5,
    spotter: "NA-5",
    structureName: "Central Sulcus",
    questions: [
      "Identify the pinned area.",
      "Mention its functional importance.",
    ],
    answers: [
      "Central sulcus (Sulcus of Rolando).",
      "Forms the boundary between the primary motor area (precentral gyrus — area 4 of Brodmann) in front, and the primary somatosensory area (postcentral gyrus — areas 3, 1, 2 of Brodmann) behind.",
    ],
  },
  {
    id: 6,
    spotter: "NA-6",
    structureName: "Cerebellum",
    questions: [
      "Identify the pinned structure.",
      "Name its deep nuclei.",
      "Give its blood supply.",
      "Give its applied anatomy.",
    ],
    answers: [
      "Cerebellum.",
      "1. Dentate nucleus (largest)\n2. Emboliform nucleus\n3. Globose nucleus\n4. Fastigial nucleus (smallest, most medial)",
      "1. Superior cerebellar artery (SCA) — from basilar artery\n2. Anterior inferior cerebellar artery (AICA) — from basilar artery\n3. Posterior inferior cerebellar artery (PICA) — from vertebral artery",
      "Cerebellar syndrome:\n• Truncal ataxia\n• Hypotonia\n• Asynergia\n• Dysmetria (past-pointing)\n• Dysarthria (scanning speech)\n• Dysdiadochokinesis\n• Intention tremor\n• Nystagmus",
    ],
  },
  {
    id: 7,
    spotter: "NA-7",
    structureName: "Cerebral Peduncle",
    questions: [
      "Identify the pinned structure.",
      "Give its parts.",
      "Mention the cranial nerves related to it.",
    ],
    answers: [
      "Cerebral peduncle.",
      "1. Crus cerebri (basis pedunculi) — anterior\n2. Substantia nigra — intermediate\n3. Tegmentum — posterior",
      "1. Oculomotor nerve (CN III) — emerges from the interpeduncular fossa between the two peduncles\n2. Trochlear nerve (CN IV) — winds around the lateral surface of the peduncle",
    ],
  },
  {
    id: 8,
    spotter: "NA-8",
    structureName: "Filum Terminale",
    questions: [
      "Identify the tied structure.",
      "What is it made up of?",
      "Give its parts and length.",
      "Mention its extent.",
    ],
    answers: [
      "Filum terminale.",
      "A modification of pia mater — a slender thread of fibrous tissue continuous with the pia mater of the spinal cord.",
      "1. Filum terminale internum — 15 cm; within the lumbar cistern, surrounded by the cauda equina\n2. Filum terminale externum (coccygeal ligament) — 5 cm; pierces the dura and blends with the periosteum of the coccyx",
      "From the tip of the conus medullaris (at the level of L1 vertebra) to the first coccygeal vertebra (Co1).",
    ],
  },
  {
    id: 9,
    spotter: "NA-9",
    structureName: "Inferior Cerebellar Peduncle",
    questions: [
      "Identify the pinned structure.",
      "What does it connect?",
      "Name any four fibres present in it.",
    ],
    answers: [
      "Inferior cerebellar peduncle (restiform body).",
      "Connects the medulla oblongata with the cerebellum.",
      "Afferent fibres:\n1. Posterior spinocerebellar tract\n2. Olivocerebellar fibres\n3. Cuneocerebellar fibres\n4. Vestibulocerebellar fibres\n5. Reticulocerebellar fibres\n\nEfferent fibres:\n1. Cerebellovestibular\n2. Cerebelloreticular\n3. Cerebello-olivary",
    ],
  },
  {
    id: 10,
    spotter: "NA-10",
    structureName: "Interpeduncular Fossa",
    questions: [
      "Identify the pinned area.",
      "Mention its boundaries.",
      "Give its contents.",
    ],
    answers: [
      "Interpeduncular fossa.",
      "• Anteriorly: optic chiasma\n• Anterolaterally: optic tract\n• Posterolaterally: crus cerebri of cerebral peduncle\n• Posteriorly: upper border of pons",
      "1. Tuber cinereum\n2. Mammillary bodies\n3. Infundibulum\n4. Posterior perforated substance (perforated by central branches of posterior cerebral artery)\n5. Oculomotor nerve (CN III)",
    ],
  },
  {
    id: 11,
    spotter: "NA-11",
    structureName: "Internal Capsule",
    questions: [
      "Identify the pinned structure.",
      "Mention its boundaries.",
      "Give its parts.",
      "Mention the fibres passing through it.",
      "Give its blood supply.",
      "Give its applied anatomy.",
    ],
    answers: [
      "Internal capsule.",
      "• Medial: caudate nucleus and thalamus\n• Lateral: lentiform nucleus (globus pallidus + putamen)",
      "1. Anterior limb\n2. Genu\n3. Posterior limb\n4. Retrolentiform part\n5. Sublentiform part",
      "Motor fibres: corticospinal, corticonuclear, corticopontine\nSensory fibres: thalamocortical fibres\nOther: optic radiation (retrolentiform part), auditory radiation (sublentiform part)",
      "1. Medial and lateral striate branches of middle cerebral artery\n2. Striate branches of anterior cerebral artery\n3. Central branches of anterior choroidal artery\n4. Central branches of posterior communicating artery\n5. Posterolateral central branches of posterior cerebral artery",
      "Lesion causes contralateral hemiplegia (face, upper and lower limb), homonymous hemianopia (optic radiation), and auditory defects — classically seen in internal capsule stroke.",
    ],
  },
  {
    id: 12,
    spotter: "NA-12",
    structureName: "Internal Carotid Artery",
    questions: [
      "Identify the orange arrow marked structure.",
      "Name its branches.",
    ],
    answers: [
      "Internal carotid artery.",
      "1. Ophthalmic artery\n2. Posterior communicating artery\n3. Anterior choroidal artery\n4. Anterior cerebral artery\n5. Middle cerebral artery (terminal branch)",
    ],
  },
  {
    id: 13,
    spotter: "NA-13",
    structureName: "Ligamentum Denticulatum",
    questions: [
      "Identify the black arrow marked structure.",
      "What is it made up of?",
      "Give its function.",
    ],
    answers: [
      "Ligamentum denticulatum (denticulate ligament).",
      "A modification of pia mater — a thin lateral sheet with 21 tooth-like denticulations that pierce the arachnoid and attach to the inner surface of the dura mater.",
      "1. Anchors the spinal cord in the middle of the subarachnoid space, preventing rotational movement.\n2. Serves as a surgical landmark during cordotomy, demarcating anterior from posterior nerve rootlets.",
    ],
  },
  {
    id: 14,
    spotter: "NA-14",
    structureName: "Middle Cerebellar Peduncle",
    questions: [
      "Identify the pinned structure.",
      "What does it connect?",
      "Name the fibres present in it.",
    ],
    answers: [
      "Middle cerebellar peduncle (brachium pontis) — the largest of the three cerebellar peduncles.",
      "Connects the pons with the cerebellum.",
      "Entirely afferent (to cerebellum): pontocerebellar fibres — axons of contralateral pontine nuclei, carrying corticopontine information from the cerebral cortex.",
    ],
  },
  {
    id: 15,
    spotter: "NA-15",
    structureName: "Broca's Motor Speech Area",
    questions: [
      "Identify the pinned area.",
      "Give its functional area.",
      "Mention its applied anatomy.",
    ],
    answers: [
      "Broca's motor speech area — pars triangularis of the inferior frontal gyrus (dominant hemisphere).",
      "Brodmann areas 44 and 45. Controls motor programming of speech — coordinates movements of lips, tongue, and larynx for articulate speech.",
      "Lesion → Motor (Broca's/expressive) aphasia: patient understands speech but cannot produce fluent, grammatical output; speech is halting and telegraphic.",
    ],
  },
  {
    id: 16,
    spotter: "NA-16",
    structureName: "Olive",
    questions: [
      "Identify the pinned structure.",
      "Name the structure present underlying it.",
    ],
    answers: [
      "Olive (olivary eminence) — oval prominence on the anterolateral surface of the medulla, lateral to the pyramid.",
      "Inferior olivary nucleus — a large, crumpled-bag-shaped nucleus whose axons form the olivocerebellar tract, the major afferent input to the cerebellum.",
    ],
  },
  {
    id: 17,
    spotter: "NA-17",
    structureName: "Pons",
    questions: [
      "Identify the pinned structure.",
      "Name the cranial nerve related to it.",
    ],
    answers: [
      "Pons (pons Varolii) — middle and widest part of the brainstem.",
      "Trigeminal nerve — CN V (the largest cranial nerve), attached at the junction of the basal pons and the middle cerebellar peduncle.",
    ],
  },
  {
    id: 18,
    spotter: "NA-18",
    structureName: "Pontomedullary Junction",
    questions: [
      "Identify the pinned area.",
      "Name the cranial nerves related to it.",
    ],
    answers: [
      "Pontomedullary junction (bulbopontine sulcus).",
      "Medial to lateral:\n1. Abducent nerve — CN VI\n2. Facial nerve — CN VII\n3. Vestibulocochlear nerve — CN VIII",
    ],
  },
  {
    id: 19,
    spotter: "NA-19",
    structureName: "Postcentral Gyrus",
    questions: [
      "Identify the pinned area.",
      "Mention its functional importance and functional area.",
    ],
    answers: [
      "Postcentral gyrus.",
      "Primary somatosensory area — receives conscious sensations of touch, pain, temperature, and proprioception from the contralateral half of the body.\nFunctional area: Brodmann areas 3 (posterior bank of central sulcus), 1, and 2.",
    ],
  },
  {
    id: 20,
    spotter: "NA-20",
    structureName: "Posterior Ramus of Lateral Sulcus",
    questions: [
      "Identify the pinned area.",
      "Give its contents.",
    ],
    answers: [
      "Posterior ramus of the lateral sulcus (Sylvian fissure).",
      "1. Middle cerebral artery (MCA) and its branches\n2. Deep middle cerebral vein",
    ],
  },
  {
    id: 21,
    spotter: "NA-21",
    structureName: "Posterolateral Sulcus of Medulla",
    questions: [
      "Identify the pinned area.",
      "Name the cranial nerves related to it.",
    ],
    answers: [
      "Posterolateral sulcus of medulla oblongata.",
      "From above downwards:\n1. Glossopharyngeal nerve — CN IX\n2. Vagus nerve — CN X\n3. Accessory nerve — CN XI (cranial root)",
    ],
  },
  {
    id: 22,
    spotter: "NA-22",
    structureName: "Precentral Gyrus",
    questions: [
      "Identify the pinned area.",
      "Give its functional area.",
    ],
    answers: [
      "Precentral gyrus.",
      "Primary motor cortex — Brodmann area 4. Contains the motor homunculus and controls voluntary skeletal muscle movements of the contralateral body via the corticospinal and corticonuclear tracts.",
    ],
  },
  {
    id: 23,
    spotter: "NA-23",
    structureName: "Pyramid of Medulla Oblongata",
    questions: [
      "Identify the pinned structure.",
      "Name the structure present underlying it.",
    ],
    answers: [
      "Pyramid of the medulla oblongata — longitudinal ridge on either side of the anterior median fissure.",
      "Corticospinal (pyramidal) fibres. At the lower end of the medulla, ~85% decussate at the pyramidal decussation, forming the lateral corticospinal tract.",
    ],
  },
  {
    id: 24,
    spotter: "NA-24",
    structureName: "Wernicke's Sensory Speech Area",
    questions: [
      "Identify the pinned area.",
      "Give its functional area.",
      "Mention its applied anatomy.",
    ],
    answers: [
      "Wernicke's sensory speech area (posterior language area).",
      "Brodmann areas 39 (angular gyrus) and 40 (supramarginal gyrus), at the temporoparietal junction of the dominant hemisphere. Responsible for comprehension of spoken and written language.",
      "Lesion → Sensory (Wernicke's/receptive) aphasia: fluent but meaningless speech (paraphasia, neologisms); patient cannot comprehend language.",
    ],
  },
  {
    id: 25,
    spotter: "NA-25",
    structureName: "Spinal Cord",
    questions: [
      "Identify the given organ.",
      "Give its extent.",
      "Give its coverings.",
      "Mention its arterial supply.",
    ],
    answers: [
      "Spinal cord.",
      "From the upper border of the atlas (C1) to the lower border of L1 vertebra (conus medullaris).",
      "Three meninges (outside in):\n1. Dura mater\n2. Arachnoid mater\n3. Pia mater",
      "1. One anterior spinal artery (from vertebral arteries)\n2. Two posterior spinal arteries (from vertebral or PICA)\n3. Segmental medullary arteries (from vertebral, intercostal, lumbar arteries) — including the artery of Adamkiewicz at T9–L1",
    ],
  },
  {
    id: 26,
    spotter: "NA-26",
    structureName: "Superior Temporal Gyrus",
    questions: [
      "Identify the given area.",
      "Give its functional importance and functional area.",
    ],
    answers: [
      "Superior temporal gyrus.",
      "Primary auditory cortex is situated in the superior surface (Heschl's gyri) of the superior temporal gyrus.\n• Primary auditory area: Brodmann areas 41 and 42\n• Secondary auditory (association) area: Brodmann area 22 — part of Wernicke's area",
    ],
  },
];
