export interface ThoraxQuestion {
  id: number;
  spotter: string;
  structureName: string;
  questionA: string;
  questionB: string;
  answerA: string;
  answerB: string;
}

export const THORAX_QUESTIONS: ThoraxQuestion[] = [
  {
    id: 1,
    spotter: "THO-1",
    structureName: "Anterior Interventricular Artery",
    questionA: "Identify the tied structure.",
    questionB: "What is it a branch of? Give its branches.",
    answerA: "Anterior interventricular artery",
    answerB:
      "Branch of: Left coronary artery\n\nBranches:\n1. Anterior ventricular rami – diagonal artery\n2. Septal rami",
  },
  {
    id: 2,
    spotter: "THO-2",
    structureName: "Anterior Interventricular Groove",
    questionA: "Identify the pinned structure.",
    questionB: "Give its contents.",
    answerA: "Anterior interventricular groove",
    answerB:
      "Contents:\n1. Anterior interventricular branch of left coronary artery\n2. Great cardiac vein",
  },
  {
    id: 3,
    spotter: "THO-3",
    structureName: "Arch of Aorta",
    questionA: "Identify the pinned structure.",
    questionB: "Give its branches and development.",
    answerA: "Arch of aorta",
    answerB:
      "Branches:\n1. Brachiocephalic trunk\n2. Left common carotid artery\n3. Left subclavian artery\n\nDevelopment:\n1. Left horn of aortic sac\n2. Left 4th aortic arch\n3. Left dorsal aorta",
  },
  {
    id: 4,
    spotter: "THO-4",
    structureName: "Vagus Nerve",
    questionA: "Identify the tied structure.",
    questionB: "Give its branches.",
    answerA: "Vagus nerve",
    answerB:
      "Branches:\n1. Left recurrent laryngeal nerve\n2. Pulmonary branches\n3. Oesophageal branches\n4. Cardiac branches",
  },
  {
    id: 5,
    spotter: "THO-5",
    structureName: "Coronary Sinus",
    questionA: "Identify the pinned structure.",
    questionB: "Give its tributaries and termination.",
    answerA: "Coronary sinus",
    answerB:
      "Tributaries:\n1. Great cardiac vein\n2. Middle cardiac vein\n3. Small cardiac vein\n4. Posterior vein of left ventricle\n5. Oblique vein of left atrium\n6. Right marginal vein\n\nTermination: Posterior wall of right atrium",
  },
  {
    id: 6,
    spotter: "THO-6",
    structureName: "Descending Thoracic Aorta",
    questionA: "Identify the tied structure.",
    questionB: "Give its branches and extent.",
    answerA: "Descending thoracic aorta",
    answerB:
      "Branches:\n1. Nine posterior intercostal arteries – 3rd–11th intercostal space\n2. Subcostal artery\n3. Left bronchial artery\n4. Oesophageal branches\n5. Pericardial branches\n\nExtent: Lower border of T4 to lower border of T12 vertebra",
  },
  {
    id: 7,
    spotter: "THO-7",
    structureName: "Fossa Ovalis",
    questionA: "Identify the pinned structure.",
    questionB: "Give its embryological significance.",
    answerA: "Fossa ovalis",
    answerB: "Embryological significance: It is a remnant of septum primum",
  },
  {
    id: 8,
    spotter: "THO-8",
    structureName: "Hilum of Left Lung",
    questionA: "Identify the side and pinned area of the given organ.",
    questionB: "Name the structures present from anterior to posterior and from above downwards.",
    answerA: "Hilum of left lung",
    answerB:
      "Above downwards: Pulmonary artery → Pulmonary bronchus → Inferior pulmonary vein\n\nAnterior to posterior: Superior pulmonary vein → Pulmonary artery → Pulmonary bronchus",
  },
  {
    id: 9,
    spotter: "THO-9",
    structureName: "Hilum of Right Lung",
    questionA: "Identify the side and pinned area of the given organ.",
    questionB: "Name the structures present from anterior to posterior and from above downwards.",
    answerA: "Hilum of right lung",
    answerB:
      "Above downwards: Eparterial bronchus → Pulmonary artery → Hyparterial bronchus → Inferior pulmonary vein\n\nAnterior to posterior: Superior pulmonary vein → Pulmonary artery → Pulmonary bronchus",
  },
  {
    id: 10,
    spotter: "THO-10",
    structureName: "Limbus Fossa Ovalis",
    questionA: "Identify the pinned structure.",
    questionB: "Give its embryological significance.",
    answerA: "Limbus fossa ovalis",
    answerB: "Embryological significance: It is a remnant of septum secundum",
  },
  {
    id: 11,
    spotter: "THO-11",
    structureName: "Impressions of Right Lung",
    questionA: "Identify the structures related to the coloured pins: Black, Red, Blue, Yellow, Green.",
    questionB: "What organ do these impressions belong to?",
    answerA: "Impressions of right lung",
    answerB:
      "Black – Inferior vena cava\nRed – Cardiac impression (right atrium, right auricle, small part of right ventricle)\nBlue – Superior vena cava\nYellow – Arch of azygos\nGreen – Oesophagus",
  },
  {
    id: 12,
    spotter: "THO-12",
    structureName: "Impressions of Left Lung",
    questionA: "Identify the structures related to the coloured pins: Red, Yellow, Blue, Green.",
    questionB: "What organ do these impressions belong to?",
    answerA: "Impressions of left lung",
    answerB:
      "Red – Left common carotid artery\nYellow – Arch of aorta\nBlue – Descending thoracic aorta\nGreen – Cardiac impression (left ventricle, left auricle, part of right ventricle)",
  },
  {
    id: 13,
    spotter: "THO-13",
    structureName: "Internal Thoracic Artery",
    questionA: "Identify the tied structure.",
    questionB: "What is it a branch of? Give its terminal branches and applied aspect.",
    answerA: "Internal thoracic artery",
    answerB:
      "Branch of: First part of subclavian artery\n\nTerminal branches: Musculophrenic artery and superior epigastric artery\n\nApplied aspect: Used for coronary artery bypass grafting",
  },
  {
    id: 14,
    spotter: "THO-14",
    structureName: "Left Coronary Artery",
    questionA: "Identify the tied structure.",
    questionB: "What is it a branch of? Give its terminal branches.",
    answerA: "Left coronary artery",
    answerB:
      "Branch of: Left posterior aortic sinus of ascending aorta\n\nTerminal branches:\n1. Circumflex artery\n2. Anterior interventricular artery",
  },
  {
    id: 15,
    spotter: "THO-15",
    structureName: "Ligamentum Arteriosum",
    questionA: "Identify the tied structure.",
    questionB: "What does it connect? Give its embryological significance, which nerve hooks around it, and its applied aspect.",
    answerA: "Ligamentum arteriosum",
    answerB:
      "Connects: Left branch of pulmonary artery with arch of aorta\n\nEmbryological significance: Remnant of ductus arteriosus\n\nNerve: Left recurrent laryngeal nerve hooks around it\n\nApplied aspect: Patent ductus arteriosus",
  },
  {
    id: 16,
    spotter: "THO-16",
    structureName: "Lingula of Left Lung",
    questionA: "Identify the pinned structure.",
    questionB: "Give its bronchopulmonary segments.",
    answerA: "Lingula of left lung",
    answerB: "Bronchopulmonary segments: Superior lingular and inferior lingular",
  },
  {
    id: 17,
    spotter: "THO-17",
    structureName: "Oblique Sinus",
    questionA: "Identify the probed space.",
    questionB: "Give its function and boundaries.",
    answerA: "Oblique sinus",
    answerB:
      "Function: Allows for the free expansion of left atrium\n\nBoundaries:\n• In front – Left atrium\n• Behind – Parietal pericardium\n• Right side – Right pair of pulmonary veins and IVC\n• Left side – Left pair of pulmonary veins",
  },
  {
    id: 18,
    spotter: "THO-18",
    structureName: "Oesophagus",
    questionA: "Identify the tied structure.",
    questionB: "Give its extent, length, and constrictions.",
    answerA: "Oesophagus",
    answerB:
      "Extent: C6 (lower border of cricoid cartilage) to T11 vertebra\nLength: 25 cm\n\nConstrictions:\n1. At the beginning – 15 cm from incisor teeth\n2. Crossed by aortic arch – 22.5 cm from incisor teeth\n3. Crossed by left bronchus – 27.5 cm from incisor teeth\n4. Pierces diaphragm – 37.5 cm from incisor teeth",
  },
  {
    id: 19,
    spotter: "THO-19",
    structureName: "Posterior Coronary Sulcus",
    questionA: "Identify the pinned structure.",
    questionB: "Give its contents.",
    answerA: "Posterior coronary sulcus",
    answerB:
      "Contents:\n1. Coronary sinus\n2. Anastomosis of right and left coronary arteries",
  },
  {
    id: 20,
    spotter: "THO-20",
    structureName: "Posterior Interventricular Groove",
    questionA: "Identify the pinned structure.",
    questionB: "Give its contents.",
    answerA: "Posterior interventricular groove",
    answerB:
      "Contents:\n1. Posterior interventricular branch of right coronary artery\n2. Middle cardiac vein",
  },
  {
    id: 21,
    spotter: "THO-21",
    structureName: "Pulmonary Ligament",
    questionA: "Identify the pinned structure.",
    questionB: "Give its function.",
    answerA: "Pulmonary ligament",
    answerB:
      "Function: Provides a dead space for expansion of pulmonary veins during increased venous return",
  },
  {
    id: 22,
    spotter: "THO-22",
    structureName: "Right Anterior Coronary Sulcus",
    questionA: "Identify the pinned structure.",
    questionB: "Give its contents.",
    answerA: "Right anterior coronary sulcus",
    answerB:
      "Contents:\n1. Trunk of right coronary artery\n2. Small cardiac vein",
  },
  {
    id: 23,
    spotter: "THO-23",
    structureName: "Right Atrium",
    questionA: "Identify the pinned structure.",
    questionB: "What structures open into it? Give its development.",
    answerA: "Right atrium",
    answerB:
      "Structures opening into it:\n1. Superior vena cava\n2. Inferior vena cava\n3. Coronary sinus\n4. Anterior cardiac veins\n5. Venae cordis minimi\n\nDevelopment:\n• Rough anterior part – Right half of primitive atrium\n• Smooth posterior part – Absorption of right horn of sinus venosus",
  },
  {
    id: 24,
    spotter: "THO-24",
    structureName: "Right Coronary Artery",
    questionA: "Identify the tied structure.",
    questionB: "What is it a branch of? Give its branches.",
    answerA: "Right coronary artery",
    answerB:
      "Branch of: Anterior aortic sinus of ascending aorta\n\nBranches:\n1. Ventricular rami – right conus artery\n2. Atrial rami – SA nodal artery\n3. Posterior interventricular artery",
  },
  {
    id: 25,
    spotter: "THO-25",
    structureName: "Superior Vena Cava",
    questionA: "Identify the tied structure.",
    questionB: "Give its formation, termination, and tributaries.",
    answerA: "Superior vena cava",
    answerB:
      "Formation: Union of right and left brachiocephalic veins\n\nTermination: Posterior part of right atrium\n\nTributaries:\n1. Azygos vein\n2. Small mediastinal and pericardial veins",
  },
  {
    id: 26,
    spotter: "THO-26",
    structureName: "Transverse Sinus",
    questionA: "Identify the probed space.",
    questionB: "Give its boundaries and clinical importance.",
    answerA: "Transverse sinus",
    answerB:
      "Boundaries:\n• In front – Ascending aorta and pulmonary trunk\n• Behind – Superior vena cava and left atrium\n• Above – Pulmonary arteries\n• Below – Left atrium\n\nClinical importance: During cardiac surgery a ligature can be passed through this sinus to temporarily stop blood flow through the aorta and pulmonary trunk",
  },
  {
    id: 27,
    spotter: "THO-27",
    structureName: "Phrenic Nerve",
    questionA: "Identify the tied structure.",
    questionB: "Give its root value and what it supplies.",
    answerA: "Phrenic nerve",
    answerB:
      "Root value: C3, C4, C5 (predominantly C4)\n\nSupplies:\n• Motor – Diaphragm\n• Sensory – Diaphragm (both surfaces), mediastinal pleura, pericardium, and peritoneum on the upper surface of the liver and gallbladder",
  },
  {
    id: 28,
    spotter: "THO-28",
    structureName: "Azygos Vein",
    questionA: "Identify the tied structure.",
    questionB: "Give its formation, termination, and tributaries.",
    answerA: "Azygos vein",
    answerB:
      "Formation: By the union of the right ascending lumbar vein and right subcostal vein\n\nTermination: Superior vena cava\n\nTributaries:\n1. Right posterior intercostal veins (4th–11th)\n2. Hemiazygos vein\n3. Accessory hemiazygos vein\n4. Right bronchial veins\n5. Oesophageal veins\n6. Pericardial veins",
  },
  {
    id: 29,
    spotter: "THO-29",
    structureName: "Posterior Interventricular Artery",
    questionA: "Identify the tied structure.",
    questionB: "What is it a branch of? Give its branches.",
    answerA: "Posterior interventricular artery",
    answerB:
      "Branch of: Right coronary artery\n\nBranches:\n1. Posterior ventricular rami\n2. Posterior septal rami",
  },
];
