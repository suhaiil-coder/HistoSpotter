export interface BoneFeature {
  id: string;
  name: string;
  desc: string;
  type: "process" | "fossa" | "groove" | "foramen" | "surface" | "border" | "articulation" | "marking" | "other";
}

export interface BoneView {
  label: string;
  sublabel: string;
}

export interface Bone {
  id: string;
  name: string;
  regionId: string;
  color: string;
  accent: string;
  side: "paired" | "single";
  views: BoneView[];
  features: BoneFeature[];
  articulations: string[];
  muscleNote?: string;
  clinical?: string;
}

export interface Region {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  accent: string;
  icon: string;
  boneIds: string[];
}

// ─── Regions ──────────────────────────────────────────────────────────────────

export const REGIONS: Region[] = [
  {
    id: "upper-limb",
    name: "Upper Limb",
    subtitle: "Shoulder girdle & arm",
    color: "#10B981",
    accent: "#34D399",
    icon: "arrow-up",
    boneIds: ["clavicle", "scapula", "humerus", "radius", "ulna"],
  },
  {
    id: "lower-limb",
    name: "Lower Limb",
    subtitle: "Pelvic girdle & leg",
    color: "#F59E0B",
    accent: "#FCD34D",
    icon: "arrow-down",
    boneIds: ["hip-bone", "femur", "patella", "tibia", "fibula"],
  },
  {
    id: "skull",
    name: "Skull",
    subtitle: "Cranium & face",
    color: "#0EA5E9",
    accent: "#38BDF8",
    icon: "circle",
    boneIds: ["frontal", "temporal", "occipital", "sphenoid", "mandible"],
  },
  {
    id: "vertebral-column",
    name: "Vertebral Column",
    subtitle: "Spine & sacrum",
    color: "#EF4444",
    accent: "#F87171",
    icon: "align-center",
    boneIds: ["atlas", "axis", "typical-cervical", "typical-thoracic", "typical-lumbar", "sacrum"],
  },
  {
    id: "thorax",
    name: "Thorax",
    subtitle: "Ribs & sternum",
    color: "#8B5CF6",
    accent: "#A78BFA",
    icon: "box",
    boneIds: ["typical-rib", "first-rib", "sternum"],
  },
];

// ─── Bones ────────────────────────────────────────────────────────────────────

export const BONES: Bone[] = [
  // ── UPPER LIMB ──────────────────────────────────────────────────────────────

  {
    id: "clavicle",
    name: "Clavicle",
    regionId: "upper-limb",
    color: "#10B981",
    accent: "#34D399",
    side: "paired",
    views: [
      { label: "Superior", sublabel: "From above" },
      { label: "Inferior", sublabel: "From below" },
    ],
    features: [
      { id: "cl-1", name: "Sternal end", desc: "Medial rounded end — articulates with the manubrium at the sternoclavicular joint (the only bony attachment of the upper limb to the axial skeleton).", type: "articulation" },
      { id: "cl-2", name: "Acromial end", desc: "Lateral flattened end — articulates with the acromion at the acromioclavicular joint.", type: "articulation" },
      { id: "cl-3", name: "Shaft — medial two-thirds", desc: "Convex anteriorly (rounded, cylindrical). Gives origin to pectoralis major (anterior surface) and clavicular head of sternocleidomastoid (superior surface).", type: "surface" },
      { id: "cl-4", name: "Shaft — lateral one-third", desc: "Concave anteriorly (flattened). Gives origin to deltoid (anterior border) and trapezius (posterior border).", type: "surface" },
      { id: "cl-5", name: "Conoid tubercle", desc: "Conical projection on the inferior surface near the acromial end — attachment of the conoid ligament (part of the coracoclavicular ligament).", type: "process" },
      { id: "cl-6", name: "Trapezoid line", desc: "Oblique ridge lateral to the conoid tubercle — attachment of the trapezoid ligament (part of the coracoclavicular ligament).", type: "marking" },
      { id: "cl-7", name: "Subclavian groove", desc: "Groove on the inferior surface of the medial shaft — lodges the subclavius muscle, which depresses and steadies the clavicle.", type: "groove" },
      { id: "cl-8", name: "Impression for costoclavicular ligament", desc: "Roughened area on the inferior medial surface — attachment of the costoclavicular ligament, which limits elevation of the clavicle.", type: "marking" },
      { id: "cl-9", name: "Nutrient foramen", desc: "Faces laterally in the medial part of the bone — supplies the medullary cavity.", type: "foramen" },
      { id: "cl-10", name: "No medullary cavity", desc: "The clavicle is a membrane bone (intramembranous ossification) — it has no medullary cavity, unlike most long bones. First bone to ossify in the fetus.", type: "other" },
    ],
    articulations: ["Manubrium (sternoclavicular joint)", "Acromion of scapula (acromioclavicular joint)", "1st costal cartilage (costoclavicular ligament)"],
    muscleNote: "Origin: Deltoid, Trapezius, Sternocleidomastoid (clavicular head), Pectoralis major (clavicular head). Insertion: Subclavius.",
    clinical: "Most commonly fractured bone in the body. Fracture usually occurs at the junction of the medial ⅔ and lateral ⅓ — the weakest point and the site not protected by ligaments. Medial fragment is pulled upward by sternocleidomastoid; lateral fragment drops due to the weight of the limb.",
  },

  {
    id: "scapula",
    name: "Scapula",
    regionId: "upper-limb",
    color: "#10B981",
    accent: "#34D399",
    side: "paired",
    views: [
      { label: "Costal (Anterior)", sublabel: "Subscapular fossa side" },
      { label: "Dorsal (Posterior)", sublabel: "Posterior surface" },
      { label: "Lateral", sublabel: "Glenoid side" },
    ],
    features: [
      { id: "sc-1", name: "Glenoid cavity", desc: "Shallow pyriform (pear-shaped) socket — the articular surface for the head of the humerus. Deepened by the fibrocartilaginous glenoid labrum.", type: "articulation" },
      { id: "sc-2", name: "Spine of scapula", desc: "Prominent triangular ridge on the posterior surface — separates the supraspinous and infraspinous fossae. Continues laterally as the acromion.", type: "process" },
      { id: "sc-3", name: "Acromion", desc: "Flat lateral projection of the spine — articulates with the clavicle at the acromioclavicular joint. Gives attachment to deltoid (anteriorly) and trapezius (posteriorly).", type: "process" },
      { id: "sc-4", name: "Coracoid process", desc: "Beak-shaped projection from the superior border — gives attachment to pectoralis minor (tip), short head of biceps and coracobrachialis (tip), coracoclavicular, coracoacromial, and coracohumeral ligaments.", type: "process" },
      { id: "sc-5", name: "Suprascapular notch", desc: "Notch on the superior border medial to the coracoid base — bridged by the superior transverse scapular ligament. The suprascapular nerve passes beneath; the suprascapular artery passes above.", type: "foramen" },
      { id: "sc-6", name: "Subscapular fossa", desc: "Large concave surface on the costal (anterior) aspect — gives origin to the subscapularis muscle.", type: "fossa" },
      { id: "sc-7", name: "Supraspinous fossa", desc: "Above the spine on the dorsal surface — gives origin to supraspinatus.", type: "fossa" },
      { id: "sc-8", name: "Infraspinous fossa", desc: "Below the spine on the dorsal surface — gives origin to infraspinatus.", type: "fossa" },
      { id: "sc-9", name: "Medial (vertebral) border", desc: "Medial border from superior to inferior angles — gives attachment to serratus anterior (costal aspect) and rhomboids + levator scapulae (dorsal aspect).", type: "border" },
      { id: "sc-10", name: "Lateral (axillary) border", desc: "Thickest border — from glenoid cavity to inferior angle. Gives attachment to teres major and teres minor.", type: "border" },
      { id: "sc-11", name: "Superior angle", desc: "Angle at the junction of the superior and medial borders — covered by trapezius.", type: "other" },
      { id: "sc-12", name: "Inferior angle", desc: "Angle at the junction of the medial and lateral borders — corresponds to the 7th rib or intercostal space; moves laterally and forward in abduction of the arm.", type: "other" },
      { id: "sc-13", name: "Supraglenoid tubercle", desc: "Small rough projection above the glenoid cavity — gives origin to the long head of biceps brachii.", type: "process" },
      { id: "sc-14", name: "Infraglenoid tubercle", desc: "Rough area below the glenoid cavity — gives origin to the long head of triceps brachii.", type: "process" },
      { id: "sc-15", name: "Neck of scapula", desc: "Constricted portion between the glenoid cavity and the body — the suprascapular nerve and vessels pass through the suprascapular notch nearby.", type: "other" },
    ],
    articulations: ["Head of humerus (glenohumeral joint)", "Clavicle (acromioclavicular joint)"],
    clinical: "Winging of the scapula occurs when serratus anterior is paralysed (long thoracic nerve injury). The medial border and inferior angle protrude posteriorly when pushing against a wall.",
  },

  {
    id: "humerus",
    name: "Humerus",
    regionId: "upper-limb",
    color: "#10B981",
    accent: "#34D399",
    side: "paired",
    views: [
      { label: "Anterior", sublabel: "Front view" },
      { label: "Posterior", sublabel: "Back view" },
      { label: "Distal", sublabel: "Lower end" },
    ],
    features: [
      { id: "hu-1", name: "Head", desc: "Hemispherical — articulates with the glenoid cavity of the scapula. Faces medially, upward, and backward. Covered with hyaline cartilage.", type: "articulation" },
      { id: "hu-2", name: "Anatomical neck", desc: "The constriction between the head and the tuberosities — corresponds to the attachment of the glenohumeral joint capsule.", type: "other" },
      { id: "hu-3", name: "Surgical neck", desc: "Junction of the upper expanded end with the shaft — the most common site of fracture of the humerus. The axillary nerve and posterior circumflex humeral artery are at risk.", type: "other" },
      { id: "hu-4", name: "Greater tubercle", desc: "Large lateral projection — gives insertion to supraspinatus (superior facet), infraspinatus (middle facet), and teres minor (inferior facet).", type: "process" },
      { id: "hu-5", name: "Lesser tubercle", desc: "Smaller medial projection — gives insertion to subscapularis.", type: "process" },
      { id: "hu-6", name: "Intertubercular sulcus (bicipital groove)", desc: "Groove between the tuberosities — lodges the long head of biceps tendon. Pectoralis major inserts on lateral lip; teres major on medial lip; latissimus dorsi on floor.", type: "groove" },
      { id: "hu-7", name: "Deltoid tuberosity", desc: "V-shaped roughening on the anterolateral surface of the shaft — insertion of the deltoid muscle.", type: "marking" },
      { id: "hu-8", name: "Radial groove (spiral groove)", desc: "Oblique groove on the posterior surface of the shaft — lodges the radial nerve and profunda brachii artery. Fracture of the shaft may injure the radial nerve here.", type: "groove" },
      { id: "hu-9", name: "Medial epicondyle", desc: "Prominent projection on the medial side of the distal end — gives origin to the common flexor tendon. The ulnar nerve passes behind it in the cubital tunnel.", type: "process" },
      { id: "hu-10", name: "Lateral epicondyle", desc: "Less prominent projection on the lateral side — gives origin to the common extensor tendon.", type: "process" },
      { id: "hu-11", name: "Capitulum", desc: "Rounded lateral articular surface — articulates with the head of the radius.", type: "articulation" },
      { id: "hu-12", name: "Trochlea", desc: "Pulley-shaped medial articular surface — articulates with the trochlear notch of the ulna.", type: "articulation" },
      { id: "hu-13", name: "Coronoid fossa", desc: "Anterior depression above the trochlea — receives the coronoid process of the ulna in full flexion.", type: "fossa" },
      { id: "hu-14", name: "Radial fossa", desc: "Anterior depression above the capitulum — receives the head of the radius in full flexion.", type: "fossa" },
      { id: "hu-15", name: "Olecranon fossa", desc: "Large posterior depression above the trochlea — receives the olecranon of the ulna in full extension.", type: "fossa" },
      { id: "hu-16", name: "Medial supracondylar ridge", desc: "Ridge above the medial epicondyle — gives origin to pronator teres. The brachial artery and median nerve lie anterior to it.", type: "border" },
    ],
    articulations: ["Glenoid cavity of scapula (shoulder joint)", "Head of radius (humeroradial joint)", "Trochlear notch of ulna (humeroulnar joint)"],
    clinical: "Fracture of the surgical neck risks the axillary nerve (deltoid paralysis, loss of sensation over the 'regimental badge' area). Fracture of the shaft risks the radial nerve (wrist drop). Fracture of the medial epicondyle risks the ulnar nerve.",
  },

  {
    id: "radius",
    name: "Radius",
    regionId: "upper-limb",
    color: "#10B981",
    accent: "#34D399",
    side: "paired",
    views: [
      { label: "Anterior", sublabel: "Front view" },
      { label: "Posterior", sublabel: "Back view" },
    ],
    features: [
      { id: "ra-1", name: "Head", desc: "Disc-shaped upper end — articulates superiorly with the capitulum of humerus and medially with the radial notch of ulna. Covered with hyaline cartilage on its superior surface and circumference.", type: "articulation" },
      { id: "ra-2", name: "Neck", desc: "Constricted portion below the head — the posterior interosseous nerve winds around it.", type: "other" },
      { id: "ra-3", name: "Radial tuberosity", desc: "Oval roughening below the neck on the medial surface — gives insertion to the biceps brachii tendon.", type: "process" },
      { id: "ra-4", name: "Anterior (volar) surface of shaft", desc: "Concave — gives origin to flexor pollicis longus and flexor digitorum superficialis. The anterior interosseous artery and nerve lie on it.", type: "surface" },
      { id: "ra-5", name: "Posterior surface of shaft", desc: "Convex — gives origin to abductor pollicis longus and extensor pollicis brevis.", type: "surface" },
      { id: "ra-6", name: "Interosseous border", desc: "Sharp medial border — gives attachment to the interosseous membrane which connects the radius and ulna.", type: "border" },
      { id: "ra-7", name: "Pronator tuberosity", desc: "Roughening on the lateral surface of the shaft — gives insertion to pronator teres.", type: "process" },
      { id: "ra-8", name: "Ulnar notch", desc: "Concavity on the medial side of the distal end — articulates with the head of the ulna at the distal radioulnar joint.", type: "articulation" },
      { id: "ra-9", name: "Styloid process", desc: "Pointed downward projection from the lateral side of the lower end — extends 1 cm more distally than the ulnar styloid. Gives attachment to the brachioradialis tendon.", type: "process" },
      { id: "ra-10", name: "Dorsal tubercle (Lister's tubercle)", desc: "Prominent posterior tubercle on the back of the distal end — the extensor pollicis longus tendon hooks around it.", type: "process" },
      { id: "ra-11", name: "Carpal articular surface", desc: "Biconcave distal surface — articulates with the scaphoid (lateral part) and lunate (medial part) at the radiocarpal joint.", type: "articulation" },
      { id: "ra-12", name: "Groove for extensor tendons", desc: "Six compartments (osseofibrous tunnels) on the dorsal surface for the extensor tendons held by the extensor retinaculum.", type: "groove" },
    ],
    articulations: ["Capitulum of humerus (humeroradial joint)", "Radial notch of ulna (superior radioulnar joint)", "Head of ulna (inferior radioulnar joint)", "Scaphoid and lunate (radiocarpal joint)"],
    clinical: "Colles' fracture: transverse fracture of the distal radius ~2 cm proximal to the wrist joint ('dinner fork' deformity — dorsal displacement of distal fragment). Most common wrist fracture. Smith's fracture: reverse Colles' — volar displacement. Radial head fracture (from fall on outstretched hand) risks the posterior interosseous nerve.",
  },

  {
    id: "ulna",
    name: "Ulna",
    regionId: "upper-limb",
    color: "#10B981",
    accent: "#34D399",
    side: "paired",
    views: [
      { label: "Anterior", sublabel: "Front view" },
      { label: "Lateral", sublabel: "Side view" },
    ],
    features: [
      { id: "ul-1", name: "Olecranon", desc: "Large proximal projection — forms the point of the elbow. Gives insertion to triceps brachii. Palpable subcutaneously; the olecranon bursa lies over it.", type: "process" },
      { id: "ul-2", name: "Coronoid process", desc: "Anterior beak-like projection — gives attachment to the anterior part of the capsule and the brachialis. Resists posterior dislocation of the elbow.", type: "process" },
      { id: "ul-3", name: "Trochlear notch", desc: "Large C-shaped concavity on the anterior surface between olecranon and coronoid process — articulates with the trochlea of the humerus.", type: "articulation" },
      { id: "ul-4", name: "Radial notch", desc: "Small concavity on the lateral surface of the coronoid process — articulates with the head of the radius at the superior radioulnar joint.", type: "articulation" },
      { id: "ul-5", name: "Supinator crest", desc: "Ridge on the lateral side of the shaft — gives origin to supinator.", type: "marking" },
      { id: "ul-6", name: "Interosseous border", desc: "Sharp lateral border — gives attachment to the interosseous membrane.", type: "border" },
      { id: "ul-7", name: "Posterior surface of shaft", desc: "Palpable subcutaneously along its full length — gives origin to the extensor carpi ulnaris, extensor digitorum, and anconeus.", type: "surface" },
      { id: "ul-8", name: "Head of ulna", desc: "Rounded distal end — articulates with the ulnar notch of the radius at the distal radioulnar joint.", type: "articulation" },
      { id: "ul-9", name: "Styloid process", desc: "Downward projection from the posteromedial aspect of the head — gives attachment to the apex of the articular disc (triangular fibrocartilage).", type: "process" },
      { id: "ul-10", name: "Pronator quadratus attachment", desc: "Rough area on the anterior surface of the distal quarter of the shaft — gives origin to pronator quadratus.", type: "marking" },
    ],
    articulations: ["Trochlea of humerus (humeroulnar joint)", "Head of radius (superior radioulnar joint)", "Ulnar notch of radius (inferior radioulnar joint)"],
    clinical: "Monteggia fracture: fracture of the proximal ulna + dislocation of the radial head — risks the posterior interosseous nerve. Olecranon fracture: avulsion by triceps or direct blow; olecranon bursitis is common with repeated pressure.",
  },

  // ── LOWER LIMB ──────────────────────────────────────────────────────────────

  {
    id: "hip-bone",
    name: "Hip Bone (Os Coxae)",
    regionId: "lower-limb",
    color: "#F59E0B",
    accent: "#FCD34D",
    side: "paired",
    views: [
      { label: "Lateral", sublabel: "External surface" },
      { label: "Medial", sublabel: "Internal surface" },
    ],
    features: [
      { id: "hb-1", name: "Ilium", desc: "Large fan-shaped upper part. Body forms the superior part of the acetabulum; the ala (wing) forms the lateral wall of the pelvis.", type: "surface" },
      { id: "hb-2", name: "Iliac crest", desc: "Curved upper border of the ilium — extends from ASIS to PSIS. The highest point is at the level of L4 vertebra (used as a landmark for lumbar puncture).", type: "border" },
      { id: "hb-3", name: "Anterior superior iliac spine (ASIS)", desc: "Anterior end of the iliac crest — gives attachment to the sartorius and inguinal ligament. Important surface landmark.", type: "process" },
      { id: "hb-4", name: "Anterior inferior iliac spine (AIIS)", desc: "Below the ASIS — gives origin to the rectus femoris (straight head).", type: "process" },
      { id: "hb-5", name: "Posterior superior iliac spine (PSIS)", desc: "Posterior end of the iliac crest — dimple on the skin ('dimples of Venus'). Level of S2 vertebra.", type: "process" },
      { id: "hb-6", name: "Greater sciatic notch", desc: "Large notch below the PSIS — converted to the greater sciatic foramen by the sacrospinous ligament. Transmits the sciatic nerve, superior and inferior gluteal vessels and nerves, pudendal nerve.", type: "other" },
      { id: "hb-7", name: "Ischium", desc: "Posterior inferior part. Consists of the body (forms posterior acetabulum) and ramus.", type: "surface" },
      { id: "hb-8", name: "Ischial tuberosity", desc: "Large roughened posterior part of the ischium — bears body weight in sitting. Origin of the hamstrings (semimembranosus and semitendinosus from medial impression; long head of biceps from lateral impression) and adductor magnus.", type: "process" },
      { id: "hb-9", name: "Ischial spine", desc: "Pointed projection between greater and lesser sciatic notches — gives attachment to the sacrospinous ligament. The pudendal nerve passes medial to it (pudendal block injection site).", type: "process" },
      { id: "hb-10", name: "Pubis", desc: "Anterior part. Superior ramus, inferior ramus, and body — the two pubic bodies are joined at the pubic symphysis.", type: "surface" },
      { id: "hb-11", name: "Pubic tubercle", desc: "Small projection on the superior pubic ramus — attachment of the medial end of the inguinal ligament. Palpated for identifying the inguinal canal.", type: "process" },
      { id: "hb-12", name: "Pecten pubis (pectineal line)", desc: "Sharp ridge on the superior ramus — continues medially as the pubic crest. Part of the pelvic brim.", type: "marking" },
      { id: "hb-13", name: "Acetabulum", desc: "Deep cup-shaped socket formed by all three bones (ilium:ischium:pubis = 2:1:1) — articulates with the head of the femur. The acetabular notch at the inferior margin is bridged by the transverse acetabular ligament.", type: "articulation" },
      { id: "hb-14", name: "Obturator foramen", desc: "Large foramen below the acetabulum — formed by pubic and ischial rami. Mostly closed by the obturator membrane; the obturator canal at its superior aspect transmits obturator nerve and vessels.", type: "foramen" },
      { id: "hb-15", name: "Iliopubic eminence", desc: "Rounded ridge at the junction of the ilium and the superior pubic ramus — landmark for the iliopsoas muscle group.", type: "other" },
    ],
    articulations: ["Head of femur (hip joint)", "Sacrum (sacroiliac joint)", "Opposite hip bone (pubic symphysis)"],
    clinical: "Avulsion fractures are common in young athletes: ASIS (sartorius pull), AIIS (rectus femoris), ischial tuberosity (hamstrings). The ischial tuberosity is palpated for hamstring avulsion injuries.",
  },

  {
    id: "femur",
    name: "Femur",
    regionId: "lower-limb",
    color: "#F59E0B",
    accent: "#FCD34D",
    side: "paired",
    views: [
      { label: "Anterior", sublabel: "Front view" },
      { label: "Posterior", sublabel: "Back view" },
      { label: "Proximal", sublabel: "Upper end" },
    ],
    features: [
      { id: "fe-1", name: "Head", desc: "Spherical — articulates with the acetabulum. The fovea capitis (small pit) is in its centre for attachment of the ligament of the head of the femur (ligamentum teres).", type: "articulation" },
      { id: "fe-2", name: "Neck", desc: "Connects the head to the shaft. Angle of inclination: ~125° in adults. Anteversion angle: ~15° (neck points anteriorly relative to shaft axis).", type: "other" },
      { id: "fe-3", name: "Greater trochanter", desc: "Large lateral projection at the junction of neck and shaft — gives insertion to gluteus medius (lateral surface), gluteus minimus (anterior surface), piriformis, obturator internus, and gemelli.", type: "process" },
      { id: "fe-4", name: "Lesser trochanter", desc: "Conical posteromedial projection — gives insertion to iliopsoas (the most powerful hip flexor).", type: "process" },
      { id: "fe-5", name: "Intertrochanteric line", desc: "Roughened line on the anterior surface between the two trochanters — the capsule of the hip joint is attached to it anteriorly.", type: "marking" },
      { id: "fe-6", name: "Intertrochanteric crest", desc: "Rounded ridge on the posterior surface between the trochanters — the quadrate tubercle on its middle gives insertion to quadratus femoris.", type: "marking" },
      { id: "fe-7", name: "Linea aspera", desc: "Prominent double ridge on the posterior surface of the shaft — gives origin to several muscles including vastus medialis, vastus lateralis, adductor longus, adductor magnus, and short head of biceps femoris.", type: "marking" },
      { id: "fe-8", name: "Gluteal tuberosity", desc: "Lateral lip of the linea aspera, proximal end — gives insertion to gluteus maximus.", type: "marking" },
      { id: "fe-9", name: "Medial condyle", desc: "Larger and extends more distally — articulates with the medial tibial condyle. The medial epicondyle gives attachment to the tibial collateral ligament.", type: "articulation" },
      { id: "fe-10", name: "Lateral condyle", desc: "Articulates with the lateral tibial condyle. The lateral epicondyle gives attachment to the fibular collateral ligament.", type: "articulation" },
      { id: "fe-11", name: "Intercondylar fossa (notch)", desc: "Deep posterior groove between the condyles — contains the anterior and posterior cruciate ligaments. The ACL attaches to the medial surface of the lateral condyle; PCL to the lateral surface of the medial condyle.", type: "fossa" },
      { id: "fe-12", name: "Patellar surface (trochlea)", desc: "Smooth anterior articular groove between the condyles — articulates with the patella.", type: "articulation" },
      { id: "fe-13", name: "Adductor tubercle", desc: "Small bony projection on the medial epicondyle — gives insertion to the adductor magnus tendon.", type: "process" },
      { id: "fe-14", name: "Popliteal surface", desc: "Triangular flat area on the posterior shaft above the condyles — forms the floor of the popliteal fossa.", type: "surface" },
    ],
    articulations: ["Acetabulum (hip joint)", "Medial and lateral tibial condyles (knee joint)", "Patella (patellofemoral joint)"],
    clinical: "Fracture of the neck of femur is common in elderly osteoporotic women. Blood supply to the femoral head (via medial circumflex femoral artery) may be disrupted, causing avascular necrosis. 'Garden classification' grades the fracture severity.",
  },

  {
    id: "patella",
    name: "Patella",
    regionId: "lower-limb",
    color: "#F59E0B",
    accent: "#FCD34D",
    side: "paired",
    views: [
      { label: "Anterior", sublabel: "Front (rough) surface" },
      { label: "Posterior", sublabel: "Articular surface" },
    ],
    features: [
      { id: "pa-1", name: "Base", desc: "Superior border — gives attachment to quadriceps tendon (rectus femoris to central part; vastus intermedius deep to it; vastus medialis and lateralis to sides).", type: "border" },
      { id: "pa-2", name: "Apex", desc: "Inferior pointed end — gives attachment to the patellar ligament.", type: "process" },
      { id: "pa-3", name: "Anterior surface", desc: "Rough — perforated by nutrient foramina. Gives attachment to patellar ligament and quadriceps tendon fibres.", type: "surface" },
      { id: "pa-4", name: "Articular surface (posterior)", desc: "Divided by a vertical ridge into larger lateral facet and smaller medial facet — articulates with the patellar surface of the femur.", type: "articulation" },
      { id: "pa-5", name: "Medial and lateral borders", desc: "Give attachment to the medial and lateral patellar retinacula, which are fibrous expansions of the vastus medialis and lateralis.", type: "border" },
      { id: "pa-6", name: "Ossification", desc: "Largest sesamoid bone in the body. Ossifies in 3–5 years of age from several centres. 'Bipartite patella' is a common variant (unfused superolateral ossification centre, ~2%).", type: "other" },
    ],
    articulations: ["Patellar surface of femur (patellofemoral joint)"],
    clinical: "The patella increases the mechanical advantage of the quadriceps by increasing the moment arm. Chondromalacia patellae: softening of the patellar articular cartilage, causing anterior knee pain (common in young women). Patella alta / baja: high / low-riding patella predisposing to instability.",
  },

  {
    id: "tibia",
    name: "Tibia",
    regionId: "lower-limb",
    color: "#F59E0B",
    accent: "#FCD34D",
    side: "paired",
    views: [
      { label: "Anterior", sublabel: "Front view" },
      { label: "Posterior", sublabel: "Back view" },
    ],
    features: [
      { id: "ti-1", name: "Medial condyle", desc: "Larger and more oval — articulates with the medial meniscus and medial tibial plateau. The posterior cruciate ligament attaches to the posterior intercondylar area.", type: "articulation" },
      { id: "ti-2", name: "Lateral condyle", desc: "Articulates with the lateral meniscus. The fibular facet on its posterior surface articulates with the head of the fibula.", type: "articulation" },
      { id: "ti-3", name: "Intercondylar area", desc: "Non-articular area between the condyles — gives attachment to the menisci and cruciate ligaments: ACL anteriorly, PCL posteriorly.", type: "other" },
      { id: "ti-4", name: "Tibial tuberosity", desc: "Large anterior bony prominence on the upper shaft — gives attachment to the patellar ligament. Site of tibial tuberosity avulsion in Osgood–Schlatter disease.", type: "process" },
      { id: "ti-5", name: "Anterior border", desc: "Sharp subcutaneous ridge ('shin') — palpable throughout; gives attachment to the deep fascia.", type: "border" },
      { id: "ti-6", name: "Medial surface", desc: "Broad and subcutaneous — no muscles attached. Site for tibial bone graft harvesting.", type: "surface" },
      { id: "ti-7", name: "Posterior surface", desc: "Has the soleal line — oblique ridge for attachment of soleus and popliteus.", type: "surface" },
      { id: "ti-8", name: "Interosseous border", desc: "Lateral border — gives attachment to the interosseous membrane.", type: "border" },
      { id: "ti-9", name: "Medial malleolus", desc: "Downward medial projection of the distal tibia — articulates with the medial surface of the talus. The deltoid ligament is attached to it.", type: "process" },
      { id: "ti-10", name: "Fibular notch", desc: "Concavity on the lateral side of the distal end — articulates with the lower end of the fibula at the inferior tibiofibular joint.", type: "articulation" },
      { id: "ti-11", name: "Inferior articular surface", desc: "Concave — articulates with the superior surface of the talus at the ankle (talocrural) joint.", type: "articulation" },
      { id: "ti-12", name: "Groove for tibialis posterior", desc: "Groove on the posterior surface of the medial malleolus — tendon of tibialis posterior passes through it.", type: "groove" },
    ],
    articulations: ["Femoral condyles (knee joint)", "Head of fibula (superior tibiofibular joint)", "Lower end of fibula (inferior tibiofibular joint)", "Talus (ankle joint)"],
    clinical: "Stress fractures of the tibia are common in runners and military recruits. Compartment syndrome commonly involves the anterior compartment (foot drop due to deep peroneal nerve injury). The tibial nerve may be compressed behind the medial malleolus (tarsal tunnel syndrome).",
  },

  {
    id: "fibula",
    name: "Fibula",
    regionId: "lower-limb",
    color: "#F59E0B",
    accent: "#FCD34D",
    side: "paired",
    views: [
      { label: "Anterior", sublabel: "Front view" },
      { label: "Medial", sublabel: "Inner surface" },
    ],
    features: [
      { id: "fi-1", name: "Head", desc: "Upper expanded end — articulates with the tibial facet on the posterolateral aspect of the lateral tibial condyle. The common peroneal (fibular) nerve winds around the fibular neck.", type: "articulation" },
      { id: "fi-2", name: "Neck", desc: "Constriction below the head — the common peroneal nerve is vulnerable here to direct trauma or traction.", type: "other" },
      { id: "fi-3", name: "Anterior surface", desc: "Narrow — gives origin to extensor digitorum longus, extensor hallucis longus, and peroneus tertius.", type: "surface" },
      { id: "fi-4", name: "Lateral surface", desc: "Gives origin to peroneus longus and peroneus brevis.", type: "surface" },
      { id: "fi-5", name: "Posterior surface", desc: "Gives origin to flexor hallucis longus and peroneus longus.", type: "surface" },
      { id: "fi-6", name: "Interosseous border", desc: "Medial border — gives attachment to the interosseous membrane.", type: "border" },
      { id: "fi-7", name: "Lateral malleolus", desc: "Distal expanded end — extends further distally than the medial malleolus. Articulates with the lateral surface of the talus. Gives attachment to the lateral ligaments of the ankle.", type: "process" },
      { id: "fi-8", name: "Malleolar fossa", desc: "Depression on the posterior surface of the lateral malleolus — gives attachment to the posterior talofibular ligament.", type: "fossa" },
    ],
    articulations: ["Lateral condyle of tibia (superior tibiofibular joint)", "Fibular notch of tibia (inferior tibiofibular joint)", "Talus (ankle joint — lateral surface)"],
    clinical: "The common peroneal nerve wraps around the fibular neck — vulnerable in knee dislocation, fibular neck fractures, or tight plaster casts, causing foot drop. The lateral malleolus is the most commonly fractured bone in ankle injuries.",
  },

  // ── SKULL ───────────────────────────────────────────────────────────────────

  {
    id: "frontal",
    name: "Frontal Bone",
    regionId: "skull",
    color: "#0EA5E9",
    accent: "#38BDF8",
    side: "single",
    views: [
      { label: "External", sublabel: "Outer surface" },
      { label: "Internal", sublabel: "Endocranial surface" },
    ],
    features: [
      { id: "fr-1", name: "Squamous part", desc: "Large vertical plate forming the forehead. Externally convex; internally concave.", type: "surface" },
      { id: "fr-2", name: "Superciliary arches", desc: "Rounded ridges above the orbital margins — more prominent in males. The glabella is the smooth area between them.", type: "marking" },
      { id: "fr-3", name: "Glabella", desc: "Smooth median elevation between the superciliary arches — corresponds to the frontonasal suture region.", type: "other" },
      { id: "fr-4", name: "Supraorbital margin", desc: "Upper border of the orbit — the supraorbital notch/foramen is at the junction of the medial ⅓ and lateral ⅔. Transmits the supraorbital nerve and artery.", type: "marking" },
      { id: "fr-5", name: "Orbital plate", desc: "Horizontal plate forming the roof of the orbit and floor of the anterior cranial fossa. The fossa for the lacrimal gland is in its anterolateral part.", type: "surface" },
      { id: "fr-6", name: "Ethmoidal notch", desc: "Rectangular gap between the two orbital plates — accommodates the cribriform plate of the ethmoid.", type: "other" },
      { id: "fr-7", name: "Frontal sinuses", desc: "Paired air sinuses within the bone — drain into the middle meatus via the frontonasal duct. May be absent or asymmetric.", type: "other" },
      { id: "fr-8", name: "Frontal crest", desc: "Internal median ridge on the squamous part — gives attachment to the falx cerebri.", type: "marking" },
      { id: "fr-9", name: "Foramen caecum", desc: "Small pit in front of the frontal crest — occasionally transmits an emissary vein between the superior sagittal sinus and the nasal veins.", type: "foramen" },
      { id: "fr-10", name: "Zygomatic process", desc: "Lateral projection of the squamous part — articulates with the frontal process of the zygomatic bone.", type: "process" },
    ],
    articulations: ["Parietal bones (coronal suture)", "Ethmoid (frontoethmoidal suture)", "Sphenoid (sphenofrontal suture)", "Nasal bones", "Zygomatic bones", "Maxillae"],
    clinical: "Frontal sinusitis may spread intracranially via the frontal crest/foramen caecum — causing meningitis or frontal lobe abscess (Pott's puffy tumour).",
  },

  {
    id: "temporal",
    name: "Temporal Bone",
    regionId: "skull",
    color: "#0EA5E9",
    accent: "#38BDF8",
    side: "paired",
    views: [
      { label: "Lateral", sublabel: "External surface" },
      { label: "Inferior", sublabel: "Base view" },
      { label: "Medial", sublabel: "Internal surface" },
    ],
    features: [
      { id: "te-1", name: "Squamous part", desc: "Thin flat part — forms the temporal region of the skull. Articulates with the parietal bone (squamosal suture).", type: "surface" },
      { id: "te-2", name: "Zygomatic process", desc: "Slender bar from the squamous part — articulates with the temporal process of the zygomatic bone to form the zygomatic arch.", type: "process" },
      { id: "te-3", name: "Mandibular fossa", desc: "Concavity on the inferior aspect of the zygomatic process — articulates with the condylar process of the mandible at the temporomandibular joint.", type: "fossa" },
      { id: "te-4", name: "Articular tubercle", desc: "Anterior to the mandibular fossa — limits forward displacement of the mandibular condyle.", type: "process" },
      { id: "te-5", name: "Petrous part", desc: "Dense pyramidal part directed anteromedially — contains the internal ear (cochlea and semicircular canals) and the facial canal.", type: "surface" },
      { id: "te-6", name: "Internal acoustic meatus", desc: "Opening on the posterior surface of the petrous part — transmits CN VII (facial) and CN VIII (vestibulocochlear) nerves, and the labyrinthine artery.", type: "foramen" },
      { id: "te-7", name: "Carotid canal", desc: "Channel through the petrous part — transmits the internal carotid artery and sympathetic plexus.", type: "foramen" },
      { id: "te-8", name: "Styloid process", desc: "Slender pointed projection from the inferior surface — gives attachment to stylohyoid, styloglossus, stylopharyngeus, stylohyoid ligament, and stylomandibular ligament.", type: "process" },
      { id: "te-9", name: "Stylomastoid foramen", desc: "Between the styloid and mastoid processes — the facial nerve (CN VII) exits the skull here.", type: "foramen" },
      { id: "te-10", name: "Mastoid process", desc: "Posterior projection behind the ear — filled with mastoid air cells (connected to the middle ear). Gives attachment to sternocleidomastoid, splenius capitis, and longissimus capitis.", type: "process" },
      { id: "te-11", name: "Mastoid antrum", desc: "Large air cell connecting mastoid air cells to the middle ear — important in mastoiditis (infection spreads via antrum).", type: "other" },
      { id: "te-12", name: "Jugular foramen", desc: "Between the petrous and occipital bones — transmits the internal jugular vein, CN IX (glossopharyngeal), CN X (vagus), and CN XI (accessory).", type: "foramen" },
      { id: "te-13", name: "Groove for sigmoid sinus", desc: "S-shaped groove on the posterior part of the petrous bone — lodges the sigmoid venous sinus.", type: "groove" },
      { id: "te-14", name: "Tympanic part", desc: "C-shaped plate forming the floor and anterior wall of the external auditory meatus.", type: "surface" },
    ],
    articulations: ["Parietal bone (squamosal suture)", "Occipital bone (occipitomastoid suture)", "Sphenoid (sphenosquamosal suture)", "Zygomatic bone (zygomatic arch)", "Mandible (TMJ)"],
    clinical: "Mastoiditis: infection of mastoid air cells from otitis media — may spread to the sigmoid sinus (thrombosis), posterior cranial fossa (meningitis), or facial nerve canal (facial palsy). Middle meningeal artery runs in a groove on the inner surface of the temporal bone — laceration causes extradural haematoma.",
  },

  {
    id: "occipital",
    name: "Occipital Bone",
    regionId: "skull",
    color: "#0EA5E9",
    accent: "#38BDF8",
    side: "single",
    views: [
      { label: "External", sublabel: "Outer (posterior) view" },
      { label: "Internal", sublabel: "Endocranial view" },
    ],
    features: [
      { id: "oc-1", name: "Foramen magnum", desc: "Large central aperture — transmits the medulla oblongata and its meninges, vertebral arteries, anterior and posterior spinal arteries, and the spinal accessory nerves.", type: "foramen" },
      { id: "oc-2", name: "Occipital condyles", desc: "Oval articular facets on either side of the foramen magnum — articulate with the superior facets of the atlas at the atlantooccipital joint (nodding movements).", type: "articulation" },
      { id: "oc-3", name: "Hypoglossal canal", desc: "Within each condyle — transmits CN XII (hypoglossal nerve) and the meningeal branch of the ascending pharyngeal artery.", type: "foramen" },
      { id: "oc-4", name: "External occipital protuberance (EOP)", desc: "Palpable midline prominence on the external surface — the inion. Gives attachment to the ligamentum nuchae.", type: "process" },
      { id: "oc-5", name: "Superior nuchal line", desc: "Ridge extending laterally from the EOP — gives attachment to trapezius, sternocleidomastoid, and splenius capitis.", type: "marking" },
      { id: "oc-6", name: "Inferior nuchal line", desc: "Ridge below the superior nuchal line — gives attachment to semispinalis capitis and rectus capitis posterior minor.", type: "marking" },
      { id: "oc-7", name: "Internal occipital protuberance", desc: "Midline on the endocranial surface — gives attachment to the falx cerebri and tentorium cerebelli. The confluence of sinuses (torcular Herophili) is usually here.", type: "process" },
      { id: "oc-8", name: "Groove for transverse sinus", desc: "Horizontal groove on either side of the internal protuberance — lodges the transverse venous sinus.", type: "groove" },
      { id: "oc-9", name: "Groove for superior sagittal sinus", desc: "Groove leading to the internal protuberance — lodges the superior sagittal sinus.", type: "groove" },
      { id: "oc-10", name: "Jugular process", desc: "Lateral to each condyle — forms the posterior margin of the jugular foramen.", type: "process" },
      { id: "oc-11", name: "Basilar part (clivus)", desc: "Anterior plate joining the sphenoid — the basilar artery lies on it. Fuses with the sphenoid at the spheno-occipital synchondrosis (closes at ~18 years).", type: "surface" },
      { id: "oc-12", name: "Pharyngeal tubercle", desc: "Small median projection on the inferior surface of the basilar part — gives attachment to the fibrous raphe of the pharynx.", type: "process" },
    ],
    articulations: ["Atlas (atlantooccipital joint)", "Temporal bones (occipitomastoid suture)", "Parietal bones (lambdoid suture)", "Sphenoid (spheno-occipital synchondrosis)"],
    clinical: "Jefferson fracture: burst fracture of the atlas from axial compression (diving); the occipital condyles are driven into the atlas, spreading the lateral masses. The foramen magnum is the site of tonsillar herniation ('coning') in raised intracranial pressure.",
  },

  {
    id: "sphenoid",
    name: "Sphenoid Bone",
    regionId: "skull",
    color: "#0EA5E9",
    accent: "#38BDF8",
    side: "single",
    views: [
      { label: "Superior", sublabel: "From above" },
      { label: "Anterior", sublabel: "Front view" },
      { label: "Posterior", sublabel: "Back view" },
    ],
    features: [
      { id: "sp-1", name: "Body", desc: "Central cuboid part — contains the sphenoidal sinuses which drain into the sphenoethmoidal recess. Superiorly houses the sella turcica.", type: "surface" },
      { id: "sp-2", name: "Sella turcica (Turkish saddle)", desc: "Depression on the superior surface of the body — houses the pituitary gland (hypophysis). Bounded anteriorly by the tuberculum sellae and posteriorly by the dorsum sellae.", type: "fossa" },
      { id: "sp-3", name: "Optic canal", desc: "Transmits CN II (optic nerve) and the ophthalmic artery.", type: "foramen" },
      { id: "sp-4", name: "Superior orbital fissure", desc: "Between the greater and lesser wings — transmits CN III (oculomotor), CN IV (trochlear), CN V1 (ophthalmic), CN VI (abducent), and the superior ophthalmic vein.", type: "foramen" },
      { id: "sp-5", name: "Foramen rotundum", desc: "In the greater wing — transmits CN V2 (maxillary nerve) to the pterygopalatine fossa.", type: "foramen" },
      { id: "sp-6", name: "Foramen ovale", desc: "In the greater wing — transmits CN V3 (mandibular nerve), accessory meningeal artery, and lesser petrosal nerve.", type: "foramen" },
      { id: "sp-7", name: "Foramen spinosum", desc: "In the greater wing, posterior to foramen ovale — transmits the middle meningeal artery and meningeal branch of V3.", type: "foramen" },
      { id: "sp-8", name: "Greater wings", desc: "Large lateral projections — form the middle cranial fossa, posterior wall of orbit, and part of the temporal fossa and infratemporal fossa.", type: "surface" },
      { id: "sp-9", name: "Lesser wings", desc: "Horizontal plates above the greater wings — form the posterior part of the anterior cranial fossa and roof of the orbit.", type: "surface" },
      { id: "sp-10", name: "Pterygoid plates (medial and lateral)", desc: "Project downward from the junction of body and greater wings. Medial plate ends in the pterygoid hamulus (around which the tensor veli palatini hooks). Lateral plate gives origin to both heads of the lateral pterygoid and medial pterygoid.", type: "process" },
      { id: "sp-11", name: "Carotid groove", desc: "Groove on the lateral surface of the body — lodges the internal carotid artery as it passes through the cavernous sinus.", type: "groove" },
      { id: "sp-12", name: "Pterygoid canal (Vidian canal)", desc: "Channel through the base of the pterygoid process — transmits the nerve of the pterygoid canal (Vidian nerve = greater petrosal + deep petrosal nerves) and artery.", type: "foramen" },
    ],
    articulations: ["All other cranial bones (keystone of the skull base)", "Ethmoid", "Palatine bones", "Vomer"],
    clinical: "Pituitary tumours expand within the sella turcica — compress the optic chiasma (bitemporal hemianopia). Fractures of the base of the skull often involve the sphenoid, and the middle meningeal artery running in the foramen spinosum may be lacerated.",
  },

  {
    id: "mandible",
    name: "Mandible",
    regionId: "skull",
    color: "#0EA5E9",
    accent: "#38BDF8",
    side: "single",
    views: [
      { label: "Lateral", sublabel: "Outer surface" },
      { label: "Medial", sublabel: "Inner surface" },
      { label: "Superior", sublabel: "Upper border (alveolar)" },
    ],
    features: [
      { id: "ma-1", name: "Body", desc: "Horizontal curved part — consists of the base (inferior border) and the alveolar part (upper border which bears the lower teeth).", type: "surface" },
      { id: "ma-2", name: "Symphysis menti", desc: "Median vertical ridge on the anterior surface — site of fusion of the two halves of the mandible (fuses by end of the 1st year).", type: "marking" },
      { id: "ma-3", name: "Mental protuberance", desc: "Triangular bony elevation forming the chin — uniquely human.", type: "process" },
      { id: "ma-4", name: "Mental foramen", desc: "Opening on the lateral surface below the 2nd premolar — transmits the mental nerve and vessels (branch of inferior alveolar nerve). Local anaesthetic injected here.", type: "foramen" },
      { id: "ma-5", name: "Oblique line", desc: "Ridge from the mental tubercle running back and up to the anterior border of the ramus — gives attachment to depressor labii inferioris and depressor anguli oris.", type: "marking" },
      { id: "ma-6", name: "Mylohyoid line", desc: "Internal ridge from the symphysis running posteriorly — gives attachment to mylohyoid (floor of mouth).", type: "marking" },
      { id: "ma-7", name: "Ramus", desc: "Vertical plate on each side — gives attachment to masseter (lateral surface) and medial pterygoid (medial surface).", type: "surface" },
      { id: "ma-8", name: "Condylar process", desc: "Superior posterior projection — the head articulates with the mandibular fossa at the TMJ. The condylar neck gives attachment to the lateral pterygoid.", type: "process" },
      { id: "ma-9", name: "Coronoid process", desc: "Superior anterior projection — gives attachment to the temporalis muscle.", type: "process" },
      { id: "ma-10", name: "Mandibular notch (sigmoid notch)", desc: "Between the coronoid and condylar processes — the masseteric nerve and artery pass through it.", type: "other" },
    ],
    articulations: ["Mandibular fossa of temporal bone (temporomandibular joint — the only synovial joint of the skull)"],
    clinical: "The mandibular canal runs in the bone from the mandibular foramen (on the medial ramus) to the mental foramen — contains the inferior alveolar nerve. Fractures of the condylar neck are common in falls on the chin; the mandible is the second most commonly fractured bone in facial trauma.",
  },

  // ── VERTEBRAL COLUMN ────────────────────────────────────────────────────────

  {
    id: "atlas",
    name: "Atlas (C1)",
    regionId: "vertebral-column",
    color: "#EF4444",
    accent: "#F87171",
    side: "single",
    views: [
      { label: "Superior", sublabel: "From above" },
      { label: "Inferior", sublabel: "From below" },
    ],
    features: [
      { id: "at-1", name: "Anterior arch", desc: "Short anterior bar — has an anterior tubercle (attachment of anterior longitudinal ligament) and a posterior facet (the fovea dentis) that articulates with the dens of the axis.", type: "surface" },
      { id: "at-2", name: "Posterior arch", desc: "Longer posterior bar — has a posterior tubercle (rudimentary spinous process, attachment of ligamentum nuchae). The groove for the vertebral artery is on its superior surface.", type: "surface" },
      { id: "at-3", name: "Lateral masses", desc: "Thickened lateral parts — bear the articular facets and the transverse processes.", type: "other" },
      { id: "at-4", name: "Superior articular facets", desc: "Concave, kidney-shaped facets — articulate with the occipital condyles (atlantooccipital joints for nodding/yes movement).", type: "articulation" },
      { id: "at-5", name: "Inferior articular facets", desc: "Flat, nearly circular facets — articulate with the superior facets of the axis.", type: "articulation" },
      { id: "at-6", name: "Transverse processes", desc: "Large — each contains a transverse foramen for the vertebral artery (V3 segment).", type: "process" },
      { id: "at-7", name: "Transverse foramen", desc: "In each transverse process — transmits the vertebral artery, vein, and sympathetic plexus.", type: "foramen" },
      { id: "at-8", name: "Groove for vertebral artery", desc: "On the superior surface of the posterior arch — the vertebral artery lies here as it passes medially to enter the foramen magnum.", type: "groove" },
      { id: "at-9", name: "Fovea dentis", desc: "Oval facet on the posterior surface of the anterior arch — articulates with the dens (odontoid process) of the axis at the median atlantoaxial joint.", type: "articulation" },
      { id: "at-10", name: "No body or spinous process", desc: "The atlas has no vertebral body (it fused with the axis to form the dens during development) and no true spinous process.", type: "other" },
    ],
    articulations: ["Occipital condyles (atlantooccipital joint)", "Dens of axis (median atlantoaxial joint)", "Superior articular facets of axis (lateral atlantoaxial joints)"],
    clinical: "Jefferson fracture: burst fracture of the atlas ring from axial loading — the lateral masses are pushed outward. The 'rule of thirds' on the odontoid view: the dens, spinal cord, and free space each occupy ⅓ of the atlas ring.",
  },

  {
    id: "axis",
    name: "Axis (C2)",
    regionId: "vertebral-column",
    color: "#EF4444",
    accent: "#F87171",
    side: "single",
    views: [
      { label: "Anterior", sublabel: "Front view" },
      { label: "Superior", sublabel: "From above" },
    ],
    features: [
      { id: "ax-1", name: "Dens (odontoid process)", desc: "Peg-like superior projection from the body — represents the body of the atlas that fused with the axis. Serves as a pivot for rotation of the atlas (and skull) on the axis.", type: "process" },
      { id: "ax-2", name: "Anterior articular facet of dens", desc: "Oval facet on the anterior surface of the dens — articulates with the fovea dentis of the anterior arch of the atlas.", type: "articulation" },
      { id: "ax-3", name: "Posterior articular facet of dens", desc: "Facet on the posterior surface of the dens — articulates with the transverse ligament of the atlas.", type: "articulation" },
      { id: "ax-4", name: "Superior articular facets", desc: "Large flat facets on top of the lateral masses — face superolaterally to articulate with the inferior facets of the atlas.", type: "articulation" },
      { id: "ax-5", name: "Inferior articular facets", desc: "Face infero-anteriorly — articulate with the superior articular facets of C3.", type: "articulation" },
      { id: "ax-6", name: "Transverse foramina", desc: "In the transverse processes — transmit the vertebral arteries which turn superolaterally at this level.", type: "foramen" },
      { id: "ax-7", name: "Spinous process", desc: "Large and bifid — the largest palpable spinous process in the cervical region. Gives attachment to ligamentum nuchae and several muscles.", type: "process" },
      { id: "ax-8", name: "Pedicles", desc: "Short and strong — form the upper and lower vertebral notches for the C2/3 intervertebral foramina.", type: "other" },
    ],
    articulations: ["Atlas (atlantoaxial joints — medial and lateral)", "C3 vertebra (C2/3 facet joints)"],
    clinical: "Odontoid (dens) fractures are classified into Types I, II, and III by Anderson–D'Alonzo. Type II (at the base of the dens) is the most common and has the highest non-union rate. Hangman's fracture: bilateral fracture through the pedicles of C2 from hyperextension + axial compression.",
  },

  {
    id: "typical-cervical",
    name: "Typical Cervical Vertebra (C3–C6)",
    regionId: "vertebral-column",
    color: "#EF4444",
    accent: "#F87171",
    side: "single",
    views: [
      { label: "Superior", sublabel: "From above" },
      { label: "Lateral", sublabel: "Side view" },
    ],
    features: [
      { id: "cv-1", name: "Body", desc: "Small, wider transversely than anteroposteriorly. Upper surface is concave (uncinate processes at the lateral margins form the uncovertebral joints of Luschka).", type: "surface" },
      { id: "cv-2", name: "Vertebral foramen", desc: "Large and triangular — accommodates the cervical spinal cord (which is wider than elsewhere).", type: "foramen" },
      { id: "cv-3", name: "Pedicles", desc: "Direct laterally and posteriorly — the superior and inferior vertebral notches are approximately equal in size.", type: "other" },
      { id: "cv-4", name: "Laminae", desc: "Narrow and long — partially overlap like roof tiles.", type: "other" },
      { id: "cv-5", name: "Spinous process", desc: "Short and bifid (split tip) — gives attachment to the ligamentum nuchae and muscle slips. C7 has a long non-bifid spinous process ('vertebra prominens').", type: "process" },
      { id: "cv-6", name: "Transverse processes", desc: "Each has an anterior and posterior tubercle with the transverse foramen between them. The anterior tubercle of C6 is the carotid tubercle (Chassaignac's tubercle — the common carotid artery can be compressed against it).", type: "process" },
      { id: "cv-7", name: "Transverse foramen", desc: "Present in all 7 cervical vertebrae — transmits the vertebral artery (except C7 which transmits only small veins).", type: "foramen" },
      { id: "cv-8", name: "Superior articular facets", desc: "Face superoposteriorly — articulate in synovial zygapophyseal (facet) joints. The plane of these joints allows flexion, extension, and lateral flexion.", type: "articulation" },
      { id: "cv-9", name: "Uncinate processes (C3–C7)", desc: "Lip-like projections from the superolateral margins of the body — form the uncovertebral joints (joints of Luschka) with the bevelled edges of the body above.", type: "process" },
      { id: "cv-10", name: "Intervertebral foramen", desc: "Between adjacent pedicles — transmits the segmental spinal nerve. Narrowing causes radiculopathy (cervical spondylosis).", type: "foramen" },
    ],
    articulations: ["Adjacent vertebrae (intervertebral discs and zygapophyseal joints)", "Vertebral artery (in transverse foramen)"],
    clinical: "Cervical spondylosis: degenerative osteophytes from the uncinate processes can narrow the intervertebral foramina (radiculopathy) or the vertebral canal (myelopathy). The C6 carotid tubercle is a key surgical landmark for carotid artery exposure.",
  },

  {
    id: "typical-thoracic",
    name: "Typical Thoracic Vertebra (T2–T9)",
    regionId: "vertebral-column",
    color: "#EF4444",
    accent: "#F87171",
    side: "single",
    views: [
      { label: "Lateral", sublabel: "Side view" },
      { label: "Superior", sublabel: "From above" },
    ],
    features: [
      { id: "tv-1", name: "Body", desc: "Heart-shaped, intermediate in size between cervical and lumbar. Has costal facets (demi-facets) on the posterolateral corners for articulation with the heads of the ribs.", type: "surface" },
      { id: "tv-2", name: "Superior costal demi-facet", desc: "On the superolateral corner of the body — articulates with the upper facet of the head of the rib of the same number.", type: "articulation" },
      { id: "tv-3", name: "Inferior costal demi-facet", desc: "On the inferolateral corner — articulates with the lower facet of the head of the rib below.", type: "articulation" },
      { id: "tv-4", name: "Costal facet on transverse process", desc: "On the tip of each transverse process — articulates with the tubercle of the corresponding rib (costotransverse joint).", type: "articulation" },
      { id: "tv-5", name: "Vertebral foramen", desc: "Circular and smallest — the thoracic spine has the tightest vertebral canal (less space for the cord).", type: "foramen" },
      { id: "tv-6", name: "Spinous process", desc: "Long, slender, and steeply downward-sloping (tile-like) — overlaps the spinous process of the vertebra below.", type: "process" },
      { id: "tv-7", name: "Transverse processes", desc: "Long and stout — directed posterolaterally. Bear the costal facets.", type: "process" },
      { id: "tv-8", name: "Pedicles", desc: "Directed straight back — the superior vertebral notch is shallow; the inferior notch is deep.", type: "other" },
      { id: "tv-9", name: "Superior and inferior articular facets", desc: "Flat and nearly vertical, facing anterolaterally and posterolaterally respectively — limits flexion but allows rotation.", type: "articulation" },
      { id: "tv-10", name: "Laminae", desc: "Short and broad — nearly completely cover the vertebral canal posteriorly.", type: "other" },
    ],
    articulations: ["Adjacent vertebrae (intervertebral discs and facet joints)", "Rib heads (costovertebral joints)", "Rib tubercles (costotransverse joints)"],
    clinical: "The steep spinous processes in mid-thoracic region mean that the spine of T7 is level with the body of T8/9. This is important when counting vertebral levels on imaging. Thoracic vertebral fractures (wedge compression) are common in osteoporotic patients.",
  },

  {
    id: "typical-lumbar",
    name: "Typical Lumbar Vertebra (L1–L5)",
    regionId: "vertebral-column",
    color: "#EF4444",
    accent: "#F87171",
    side: "single",
    views: [
      { label: "Lateral", sublabel: "Side view" },
      { label: "Superior", sublabel: "From above" },
    ],
    features: [
      { id: "lv-1", name: "Body", desc: "Massive kidney-shaped body — bears the greatest weight. Much wider transversely than anteroposteriorly.", type: "surface" },
      { id: "lv-2", name: "Vertebral foramen", desc: "Triangular — larger than thoracic but smaller than cervical.", type: "foramen" },
      { id: "lv-3", name: "Spinous process", desc: "Large, hatchet-shaped (quadrilateral), and horizontal — the L4 spinous process is at the level of the iliac crests (landmark for lumbar puncture).", type: "process" },
      { id: "lv-4", name: "Transverse processes", desc: "Long and thin (true transverse processes — the costal elements fused to them form the accessory and mammillary processes). No costal facets or transverse foramina.", type: "process" },
      { id: "lv-5", name: "Superior articular processes (facets)", desc: "Face medially (and slightly posteriorly) — lock-and-key arrangement strongly resists rotation, allowing mainly flexion/extension and lateral flexion.", type: "articulation" },
      { id: "lv-6", name: "Inferior articular processes (facets)", desc: "Face laterally — match the concave surface of the superior facets above.", type: "articulation" },
      { id: "lv-7", name: "Mammillary processes", desc: "Small knobs on the posterior surface of the superior articular processes — give attachment to the multifidus.", type: "process" },
      { id: "lv-8", name: "Accessory processes", desc: "Small projections on the base of the transverse processes — give attachment to the medial intertransverse muscles.", type: "process" },
      { id: "lv-9", name: "Pedicles", desc: "Short and strong — project directly posteriorly. The superior vertebral notch is very shallow; the inferior notch is deep (forming the intervertebral foramen).", type: "other" },
      { id: "lv-10", name: "Laminae", desc: "Broad and short — leave a gap between adjacent laminae (ligamentum flavum fills it — used for epidural/spinal needle passage).", type: "other" },
    ],
    articulations: ["Adjacent vertebrae (intervertebral discs and zygapophyseal joints)", "Sacrum (L5/S1 lumbosacral joint)"],
    clinical: "Lumbar disc prolapse most commonly at L4/5 or L5/S1 (due to the maximum mechanical stress). At L4/5 the L5 root is most commonly compressed; at L5/S1 the S1 root. The lumbar puncture (LP) is performed between L3/4 or L4/5 — safely below the conus medullaris (L1).",
  },

  {
    id: "sacrum",
    name: "Sacrum",
    regionId: "vertebral-column",
    color: "#EF4444",
    accent: "#F87171",
    side: "single",
    views: [
      { label: "Pelvic (Anterior)", sublabel: "Pelvic surface" },
      { label: "Dorsal (Posterior)", sublabel: "Back surface" },
    ],
    features: [
      { id: "sa-1", name: "Base", desc: "Superior broad surface — articulates with L5 at the lumbosacral joint. The anterior projecting edge is the sacral promontory.", type: "other" },
      { id: "sa-2", name: "Sacral promontory", desc: "Anterior projecting edge of the base — the most anterior point of the pelvic inlet (important obstetric measurement: obstetric conjugate = promontory to inner surface of pubic symphysis, normally >10.5 cm).", type: "marking" },
      { id: "sa-3", name: "Ala (lateral parts)", desc: "Wing-like lateral masses of the base — articulate with the ilium at the sacroiliac joints.", type: "surface" },
      { id: "sa-4", name: "Pelvic (anterior) surface", desc: "Concave — has 4 pairs of anterior sacral foramina transmitting the anterior rami of S1–S4.", type: "surface" },
      { id: "sa-5", name: "Anterior sacral foramina", desc: "4 pairs — transmit the ventral rami (S1–S4) and lateral sacral arteries.", type: "foramen" },
      { id: "sa-6", name: "Dorsal (posterior) surface", desc: "Convex and rough — has 4 pairs of posterior sacral foramina and the three sacral crests.", type: "surface" },
      { id: "sa-7", name: "Posterior sacral foramina", desc: "4 pairs — transmit the dorsal rami of S1–S4.", type: "foramen" },
      { id: "sa-8", name: "Median sacral crest", desc: "Row of 4 (sometimes 3) fused spinous processes in the midline.", type: "marking" },
      { id: "sa-9", name: "Sacral canal", desc: "Continuation of the vertebral canal — contains the cauda equina, sacral nerve roots, and filum terminale. Opens inferiorly at the sacral hiatus.", type: "other" },
      { id: "sa-10", name: "Sacral hiatus", desc: "Opening at the lower end of the sacral canal — formed by failure of the 5th sacral laminae to meet. Bounded by the sacral cornua. Site for caudal epidural injection.", type: "other" },
      { id: "sa-11", name: "Auricular surface", desc: "Ear-shaped surface on the lateral part — articulates with the ilium at the sacroiliac joint (synovial anteriorly, syndesmosis posteriorly).", type: "articulation" },
      { id: "sa-12", name: "Apex", desc: "Inferior narrow end — articulates with the coccyx.", type: "other" },
    ],
    articulations: ["L5 vertebra (lumbosacral joint)", "Both iliac bones (sacroiliac joints)", "Coccyx (sacrococcygeal joint)"],
    clinical: "The sacroiliac joint is a common source of low back pain. Caudal epidural block is performed through the sacral hiatus — the sacral cornua are the landmarks. The sacral promontory is a key obstetric measurement point.",
  },

  // ── THORAX ──────────────────────────────────────────────────────────────────

  {
    id: "typical-rib",
    name: "Typical Rib (3rd–9th)",
    regionId: "thorax",
    color: "#8B5CF6",
    accent: "#A78BFA",
    side: "paired",
    views: [
      { label: "Inferior", sublabel: "Costal groove side" },
      { label: "Superior", sublabel: "Upper border" },
      { label: "Posterior end", sublabel: "Head & neck" },
    ],
    features: [
      { id: "ri-1", name: "Head", desc: "Posterior expanded end — has two articular facets (superior and inferior demi-facets) separated by the crest of the head. Articulates with the bodies of two adjacent vertebrae.", type: "articulation" },
      { id: "ri-2", name: "Crest of head", desc: "Horizontal ridge between the two articular facets — gives attachment to the intra-articular ligament of the costovertebral joint.", type: "marking" },
      { id: "ri-3", name: "Neck", desc: "Constricted portion between the head and the tubercle — the anterior surface gives attachment to the superior costotransverse ligament.", type: "other" },
      { id: "ri-4", name: "Tubercle", desc: "At the junction of the neck and shaft — has a medial articular facet (for the transverse process of the corresponding vertebra) and a lateral non-articular impression (for the lateral costotransverse ligament).", type: "process" },
      { id: "ri-5", name: "Angle", desc: "The most marked bend in the rib — where the shaft changes direction. The iliocostalis muscle attaches here.", type: "other" },
      { id: "ri-6", name: "Shaft (body)", desc: "Curved flat strip — has an outer convex surface, an inner concave surface, superior border (rounded), and inferior border (sharp).", type: "surface" },
      { id: "ri-7", name: "Costal groove", desc: "Groove on the internal surface of the inferior border — lodges the intercostal nerve (inferior), artery (middle), and vein (superior) — VAN from above downwards.", type: "groove" },
      { id: "ri-8", name: "Anterior end (sternal end)", desc: "Blunt end — connects to the costal cartilage. The 3rd–7th ribs connect via their own cartilages to the sternum (true ribs).", type: "other" },
      { id: "ri-9", name: "External surface", desc: "Gives attachment to the external intercostal muscle above and the internal intercostal below. The serratus anterior attaches to the outer surfaces of ribs 1–8.", type: "surface" },
      { id: "ri-10", name: "Internal surface", desc: "Gives attachment to the internal intercostal and innermost intercostal muscles, and transversus thoracis.", type: "surface" },
    ],
    articulations: ["Bodies of two adjacent vertebrae (costovertebral joint)", "Transverse process of corresponding vertebra (costotransverse joint)", "Sternum via costal cartilage (sternocostal joint — true ribs)"],
    clinical: "Rib fractures most commonly occur at the angle — the weakest and most curved part. Needle aspiration for pleural effusion or chest drain insertion is done along the superior border of the rib to avoid the neurovascular bundle in the costal groove.",
  },

  {
    id: "first-rib",
    name: "1st Rib (Atypical)",
    regionId: "thorax",
    color: "#8B5CF6",
    accent: "#A78BFA",
    side: "paired",
    views: [
      { label: "Superior", sublabel: "From above" },
      { label: "Inferior", sublabel: "From below" },
    ],
    features: [
      { id: "fr1-1", name: "Head", desc: "Has only ONE articular facet — articulates only with T1 vertebra (not two adjacent vertebrae like typical ribs).", type: "articulation" },
      { id: "fr1-2", name: "Neck and tubercle", desc: "Short neck; the tubercle articulates only with the transverse process of T1.", type: "other" },
      { id: "fr1-3", name: "Scalene tubercle (Lisfranc's tubercle)", desc: "Small ridge on the superior surface — attachment of scalenus anterior muscle. Separates the grooves for the subclavian artery and vein.", type: "marking" },
      { id: "fr1-4", name: "Groove for subclavian vein", desc: "In front of the scalene tubercle — the subclavian vein crosses here (risk of subclavian vein injury in 1st rib fracture).", type: "groove" },
      { id: "fr1-5", name: "Groove for subclavian artery and brachial plexus", desc: "Behind the scalene tubercle — the subclavian artery and lower trunk of the brachial plexus lie in this groove.", type: "groove" },
      { id: "fr1-6", name: "Shaft", desc: "Broad, flat, and very short — the shortest, broadest, and most curved rib. Lies almost horizontally.", type: "surface" },
      { id: "fr1-7", name: "No costal groove", desc: "Unlike typical ribs, the 1st rib has no costal groove on its inferior surface (the neurovascular bundle is on the superior surface).", type: "other" },
      { id: "fr1-8", name: "Serratus anterior attachment", desc: "The 1st digitation of serratus anterior attaches to the 1st rib's superior surface and inner border — the long thoracic nerve runs just medial to it.", type: "marking" },
    ],
    articulations: ["T1 vertebra only (single costovertebral joint)", "T1 transverse process (costotransverse joint)", "Manubrium via costal cartilage (1st sternocostal joint — primary cartilaginous)"],
    clinical: "Thoracic outlet syndrome: the 1st rib may compress the lower trunk of the brachial plexus or the subclavian artery/vein (cervical rib is an additional risk). Pancoast tumour (superior sulcus tumour) involves the lung apex near the 1st rib — compresses T1 root causing Horner's syndrome + wasting of small hand muscles.",
  },

  {
    id: "sternum",
    name: "Sternum",
    regionId: "thorax",
    color: "#8B5CF6",
    accent: "#A78BFA",
    side: "single",
    views: [
      { label: "Anterior", sublabel: "Front surface" },
      { label: "Posterior", sublabel: "Back surface" },
    ],
    features: [
      { id: "st-1", name: "Manubrium", desc: "Superior quadrilateral part. The jugular (suprasternal) notch is at its upper border. Gives attachment to sternocleidomastoid and sternothyroid.", type: "surface" },
      { id: "st-2", name: "Jugular (suprasternal) notch", desc: "U-shaped notch at the upper border of the manubrium — palpable surface landmark. Level of T2/3 disc.", type: "other" },
      { id: "st-3", name: "Clavicular notch", desc: "Oval notch on either side of the upper manubrium — articulates with the sternal end of the clavicle.", type: "articulation" },
      { id: "st-4", name: "1st costal notch", desc: "On the lateral edge of the manubrium — articulates with the 1st costal cartilage (primary cartilaginous joint — no movement).", type: "articulation" },
      { id: "st-5", name: "Sternal angle (angle of Louis)", desc: "The junction of manubrium and body — a palpable transverse ridge at the level of T4/5 disc. Key landmark: level of the 2nd rib/costal cartilage (count ribs from here), bifurcation of trachea, and beginning/end of the aortic arch.", type: "other" },
      { id: "st-6", name: "Body (gladiolus)", desc: "Long lower part — has 4 costal notches on each side (for the 2nd–5th costal cartilages directly; the 6th indirectly). Formed by fusion of 4 sternebrae.", type: "surface" },
      { id: "st-7", name: "Xiphoid process", desc: "Small inferior cartilaginous/bony plate — begins to ossify in the 40s. Gives attachment to the diaphragm and linea alba. Level of T9. Site of xiphoid angle — guides CPR hand placement.", type: "other" },
      { id: "st-8", name: "Costal notches", desc: "2nd–7th costal cartilages attach along the lateral borders. The 2nd is at the sternal angle; the 7th is the last true rib cartilage.", type: "articulation" },
    ],
    articulations: ["Clavicles (sternoclavicular joints)", "1st–7th costal cartilages (sternocostal joints)"],
    clinical: "The sternal angle (of Louis) is the single most important surface landmark of the thorax — used to count ribs and identify the 2nd intercostal space for procedures (e.g. pleural aspiration, central line insertion at the 2nd ICS mid-clavicular line). Sternal fracture is a marker of severe chest trauma and associated with aortic injury.",
  },
];
