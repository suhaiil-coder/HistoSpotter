/**
 * BoneViewer3D — pure React Native SVG 3D wireframe viewer.
 * Uses react-native-svg (already in Expo Go) + PanResponder.
 * No WebView, no native modules beyond what Expo Go ships.
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";

// ─── Public API ──────────────────────────────────────────────────────────────
export interface BoneViewer3DRef {
  setMarkers: (show: boolean) => void;
  resetView: () => void;
}

interface Props {
  boneId: string;
  showMarkers?: boolean;
  onMarkerTap?: (label: string) => void;
}

// ─── Geometry primitives ─────────────────────────────────────────────────────
type V3 = [number, number, number];

interface Geom {
  verts: V3[];
  edges: [number, number][];
}

interface MarkerDef { vi: number; label: string }

interface BoneDef {
  geom: Geom;
  markers: MarkerDef[];
  color: string;
  scale: number;
}

// Merge multiple Geom objects into one (adjusts edge indices)
function merge(...shapes: Geom[]): Geom {
  const verts: V3[] = [];
  const edges: [number, number][] = [];
  for (const s of shapes) {
    const base = verts.length;
    verts.push(...s.verts);
    edges.push(...s.edges.map(([a, b]) => [a + base, b + base] as [number, number]));
  }
  return { verts, edges };
}

// Stack of rings → tube. sections: [{y, r, cx?, cz?}], n = polygon resolution
function tube(sections: { y: number; r: number; cx?: number; cz?: number }[], n = 10): Geom {
  const verts: V3[] = [];
  const edges: [number, number][] = [];
  for (let ri = 0; ri < sections.length; ri++) {
    const { y, r, cx = 0, cz = 0 } = sections[ri]!;
    const base = verts.length;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      verts.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]);
      edges.push([base + i, base + (i + 1) % n]);
      if (ri > 0) edges.push([base - n + i, base + i]);
    }
  }
  return { verts, edges };
}

// Single elliptical ring
function ring(y: number, rx: number, rz: number, n = 12, cx = 0, cz = 0): Geom {
  const verts: V3[] = [];
  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    verts.push([cx + Math.cos(a) * rx, y, cz + Math.sin(a) * rz]);
    edges.push([i, (i + 1) % n]);
  }
  return { verts, edges };
}

// Box wireframe
function box(w: number, h: number, d: number, cx = 0, cy = 0, cz = 0): Geom {
  const hw = w / 2, hh = h / 2, hd = d / 2;
  const verts: V3[] = [
    [cx - hw, cy - hh, cz - hd], [cx + hw, cy - hh, cz - hd],
    [cx + hw, cy + hh, cz - hd], [cx - hw, cy + hh, cz - hd],
    [cx - hw, cy - hh, cz + hd], [cx + hw, cy - hh, cz + hd],
    [cx + hw, cy + hh, cz + hd], [cx - hw, cy + hh, cz + hd],
  ];
  const edges: [number, number][] = [
    [0,1],[1,2],[2,3],[3,0], // back
    [4,5],[5,6],[6,7],[7,4], // front
    [0,4],[1,5],[2,6],[3,7], // sides
  ];
  return { verts, edges };
}

// Approximate sphere: lat/lon lines
function sphere(r: number, stacks = 6, slices = 10, cx = 0, cy = 0, cz = 0): Geom {
  const verts: V3[] = [];
  const edges: [number, number][] = [];
  for (let si = 0; si <= stacks; si++) {
    const phi = (si / stacks) * Math.PI - Math.PI / 2;
    const ry = Math.sin(phi) * r;
    const rp = Math.cos(phi) * r;
    const base = verts.length;
    for (let sl = 0; sl < slices; sl++) {
      const theta = (sl / slices) * Math.PI * 2;
      verts.push([cx + rp * Math.cos(theta), cy + ry, cz + rp * Math.sin(theta)]);
      edges.push([base + sl, base + (sl + 1) % slices]); // lat
      if (si > 0) edges.push([base - slices + sl, base + sl]); // lon
    }
  }
  return { verts, edges };
}

// ─── Bone geometry library ───────────────────────────────────────────────────

const DEFS: Record<string, BoneDef> = {
  humerus: {
    color: "#34D399",
    scale: 22,
    markers: [
      { vi: 0,  label: "Head" },
      { vi: 20, label: "Surgical neck" },
      { vi: 50, label: "Deltoid tuberosity" },
      { vi: 90, label: "Lateral epicondyle" },
    ],
    geom: merge(
      sphere(1.1, 5, 10, 0, 4.5, 0),              // head
      tube([
        { y: 3.8, r: 0.55 },                        // anatomical neck
        { y: 3.0, r: 0.6 },                         // surgical neck
        { y: 1.5, r: 0.5 },                         // upper shaft
        { y: 0,   r: 0.45 },                        // mid shaft
        { y:-1.5, r: 0.48 },                        // lower shaft
        { y:-3.0, r: 0.55 },                        // distal widening
        { y:-3.8, r: 0.8, cx:-0.3 },               // lateral epicondyle
      ]),
      ring(-4.0, 0.7, 0.4, 10, -0.15, 0),         // trochlea
      ring(-4.0, 0.4, 0.35, 8,  0.55, 0),          // capitulum
    ),
  },

  femur: {
    color: "#FCD34D",
    scale: 18,
    markers: [
      { vi: 0,  label: "Head" },
      { vi: 22, label: "Greater trochanter" },
      { vi: 50, label: "Shaft" },
      { vi: 90, label: "Medial condyle" },
    ],
    geom: merge(
      sphere(1.15, 5, 10, -0.8, 4.8, 0),           // head
      tube([
        { y: 4.2, r: 0.5,  cx: -0.5 },             // neck
        { y: 3.5, r: 0.55, cx: -0.2 },
        { y: 3.0, r: 0.7 },                         // trochanters
        { y: 2.0, r: 0.55 },
        { y: 0,   r: 0.5  },
        { y:-2.0, r: 0.52 },
        { y:-3.5, r: 0.75 },                        // condyle widening
      ]),
      ring(-4.2, 0.85, 0.6, 10, -0.4, 0),         // medial condyle
      ring(-4.2, 0.75, 0.55, 10, 0.5, 0),          // lateral condyle
    ),
  },

  tibia: {
    color: "#FCD34D",
    scale: 20,
    markers: [
      { vi: 0,  label: "Medial condyle" },
      { vi: 22, label: "Tibial plateau" },
      { vi: 50, label: "Shaft" },
      { vi: 88, label: "Medial malleolus" },
    ],
    geom: tube([
      { y: 4.5,  r: 1.1,  cx: 0   },               // tibial plateau
      { y: 3.8,  r: 0.9               },
      { y: 3.0,  r: 0.65              },             // tuberosity
      { y: 1.5,  r: 0.48              },
      { y: 0,    r: 0.44              },
      { y:-2.0,  r: 0.42              },
      { y:-3.5,  r: 0.48, cx: -0.1  },
      { y:-4.3,  r: 0.55, cx: -0.15 },              // medial malleolus
    ]),
  },

  fibula: {
    color: "#FCD34D",
    scale: 20,
    markers: [
      { vi: 0,  label: "Head" },
      { vi: 30, label: "Shaft" },
      { vi: 68, label: "Lateral malleolus" },
    ],
    geom: tube([
      { y: 4.2, r: 0.4,  cx: 0.8 },                // head
      { y: 3.5, r: 0.25, cx: 0.8 },
      { y: 2.0, r: 0.2,  cx: 0.85 },
      { y: 0,   r: 0.2,  cx: 0.85 },
      { y:-2.0, r: 0.2,  cx: 0.85 },
      { y:-3.5, r: 0.25, cx: 0.85 },
      { y:-4.5, r: 0.45, cx: 0.85 },               // lateral malleolus
    ]),
  },

  radius: {
    color: "#34D399",
    scale: 22,
    markers: [
      { vi: 0,  label: "Head" },
      { vi: 22, label: "Radial tuberosity" },
      { vi: 60, label: "Styloid process" },
    ],
    geom: tube([
      { y: 3.8, r: 0.55 },                          // head
      { y: 3.0, r: 0.38 },
      { y: 2.0, r: 0.35, cx: 0.1 },                // tuberosity
      { y: 0,   r: 0.33, cx: 0.15 },
      { y:-2.0, r: 0.35, cx: 0.2  },
      { y:-3.2, r: 0.65, cx: 0.25 },               // distal end
      { y:-3.8, r: 0.7,  cx: 0.25 },
    ]),
  },

  ulna: {
    color: "#34D399",
    scale: 22,
    markers: [
      { vi: 0,  label: "Olecranon" },
      { vi: 20, label: "Coronoid process" },
      { vi: 60, label: "Shaft" },
      { vi: 80, label: "Styloid process" },
    ],
    geom: merge(
      tube([
        { y: 4.2, r: 0.55, cx:-0.15 },             // olecranon
        { y: 3.5, r: 0.4  },
        { y: 2.8, r: 0.5  },                        // coronoid
        { y: 2.0, r: 0.38 },
        { y: 0,   r: 0.32, cx: 0.05 },
        { y:-2.0, r: 0.28, cx: 0.1  },
        { y:-3.5, r: 0.25, cx: 0.12 },
        { y:-3.9, r: 0.18, cx: 0.12 },             // styloid
      ]),
    ),
  },

  clavicle: {
    color: "#34D399",
    scale: 24,
    markers: [
      { vi: 0,  label: "Sternal end" },
      { vi: 22, label: "Conoid tubercle" },
      { vi: 44, label: "Acromial end" },
    ],
    geom: tube([
      { y: 0, r: 0.5,  cx:-3.5, cz: 0    },       // sternal
      { y: 0, r: 0.35, cx:-2,   cz: 0.3  },
      { y: 0, r: 0.3,  cx: 0,   cz: 0    },
      { y: 0, r: 0.3,  cx: 1.5, cz:-0.2  },
      { y: 0, r: 0.4,  cx: 3.5, cz:-0.4  },       // acromial
    ], 8),
  },

  scapula: {
    color: "#34D399",
    scale: 20,
    markers: [
      { vi: 0,  label: "Glenoid cavity" },
      { vi: 8,  label: "Acromion" },
      { vi: 16, label: "Coracoid process" },
      { vi: 24, label: "Spine" },
    ],
    geom: merge(
      box(4, 5, 0.3),                               // blade
      box(0.6, 0.4, 1.5, 2, 1.5, 0),              // spine
      ring(0, 0.7, 0.7, 10, 2.2, 0),              // glenoid
      box(0.4, 0.4, 1.2, 2.5, 2.5, 0),            // acromion
      box(0.4, 1.2, 0.4, 2.2, 3.0, 0),            // coracoid
    ),
  },

  "hip-bone": {
    color: "#D97706",
    scale: 16,
    markers: [
      { vi: 0,  label: "Iliac crest" },
      { vi: 20, label: "Acetabulum" },
      { vi: 40, label: "Obturator foramen" },
      { vi: 60, label: "Ischial tuberosity" },
    ],
    geom: merge(
      ring(3.5, 2.5, 2.0, 12),                    // iliac crest
      sphere(0.9, 4, 8, 0.5, 0, 0),              // acetabulum
      ring(-0.5, 1.2, 0.8, 10, -0.5, 0),        // obturator (oval)
      box(1.5, 0.6, 0.5, -0.5, -2.5, 0),        // ischial tuberosity
    ),
  },

  patella: {
    color: "#D97706",
    scale: 28,
    markers: [
      { vi: 0,  label: "Base" },
      { vi: 10, label: "Articular surface" },
    ],
    geom: merge(
      ring(0.5, 1.0, 0.9, 12),
      ring(0,   0.95, 0.85, 12),
      ring(-0.5, 0.85, 0.75, 12),
    ),
  },

  frontal: {
    color: "#38BDF8",
    scale: 22,
    markers: [
      { vi: 0, label: "Supraorbital margin" },
      { vi: 8, label: "Glabella" },
    ],
    geom: merge(
      box(4.5, 3, 0.5, 0, 0.5, 0),
      ring(-1.5, 1.5, 0.8, 10, -1.2, -0.3),
      ring(-1.5, 1.5, 0.8, 10,  1.2, -0.3),
    ),
  },

  temporal: {
    color: "#38BDF8",
    scale: 22,
    markers: [
      { vi: 0, label: "External acoustic meatus" },
      { vi: 8, label: "Mastoid process" },
      { vi: 16, label: "Styloid process" },
    ],
    geom: merge(
      box(3, 2.5, 1.5),
      box(0.6, 0.5, 1.8, 0.2, -1.5, 0.5),        // mastoid
      box(0.3, 1.5, 0.3, 0.5, -2.5, 0.2),         // styloid
      ring(0, 0.6, 0.6, 10, 0, 0),                // meatus
    ),
  },

  occipital: {
    color: "#38BDF8",
    scale: 22,
    markers: [
      { vi: 0, label: "Foramen magnum" },
      { vi: 10, label: "External occipital protuberance" },
    ],
    geom: merge(
      box(5, 4, 0.6),
      ring(0, 1.0, 0.8, 10),                       // foramen magnum
      box(0.8, 0.5, 0.6, 0, 1.5, 0),              // ext occipital prot
    ),
  },

  sphenoid: {
    color: "#38BDF8",
    scale: 22,
    markers: [
      { vi: 0, label: "Sella turcica" },
      { vi: 8, label: "Greater wing" },
    ],
    geom: merge(
      box(2, 1.5, 1.5, 0, 0, 0),                  // body
      box(3.5, 0.4, 0.3, -2.5, 0.5, 0),           // left greater wing
      box(3.5, 0.4, 0.3,  2.5, 0.5, 0),           // right greater wing
      box(0.3, 2.5, 0.2, -0.6, -1.5, 0),          // left pterygoid
      box(0.3, 2.5, 0.2,  0.6, -1.5, 0),          // right pterygoid
    ),
  },

  mandible: {
    color: "#38BDF8",
    scale: 22,
    markers: [
      { vi: 0,  label: "Mental protuberance" },
      { vi: 10, label: "Body" },
      { vi: 20, label: "Ramus" },
      { vi: 28, label: "Condylar process" },
    ],
    geom: merge(
      tube([
        { y: 0, r: 0.5, cx:-2.0, cz: 1.5 },
        { y: 0, r: 0.5, cx: 0,   cz: 2.2 },
        { y: 0, r: 0.5, cx: 2.0, cz: 1.5 },
      ], 8),
      box(0.6, 3.0, 0.5, -2.5, 1.5, 0),          // left ramus
      box(0.6, 3.0, 0.5,  2.5, 1.5, 0),          // right ramus
      ring(3.5, 0.5, 0.4, 8, -2.5, 0),           // condyle
      ring(3.5, 0.5, 0.4, 8,  2.5, 0),
    ),
  },

  atlas: {
    color: "#F87171",
    scale: 24,
    markers: [
      { vi: 0, label: "Anterior arch" },
      { vi: 8, label: "Transverse process" },
      { vi: 16, label: "Lateral mass" },
    ],
    geom: merge(
      ring(0, 1.4, 1.2, 12),                       // vertebral foramen
      box(0.4, 0.5, 2.5, -2.2, 0, 0),             // left transverse
      box(0.4, 0.5, 2.5,  2.2, 0, 0),             // right transverse
      box(1.5, 0.4, 0.4, 0, 0, -1.5),             // anterior arch
      box(1.5, 0.4, 0.4, 0, 0,  1.5),             // posterior arch
    ),
  },

  axis: {
    color: "#F87171",
    scale: 24,
    markers: [
      { vi: 0, label: "Dens (odontoid process)" },
      { vi: 10, label: "Body" },
      { vi: 18, label: "Transverse process" },
    ],
    geom: merge(
      box(1.5, 1.2, 1.8, 0, -0.6, 0),             // body
      box(0.5, 2.0, 0.5, 0,  1.2, 0),             // dens
      box(0.4, 0.5, 2.2, -1.8, 0, 0),             // transverse
      box(0.4, 0.5, 2.2,  1.8, 0, 0),
      box(0.5, 0.5, 0.5, 0, -1.2, 0.9),           // spinous
    ),
  },

  "typical-cervical": {
    color: "#F87171",
    scale: 24,
    markers: [
      { vi: 0, label: "Vertebral body" },
      { vi: 8, label: "Transverse foramen" },
      { vi: 16, label: "Spinous process" },
    ],
    geom: merge(
      box(1.6, 0.8, 1.6),                          // body
      ring(0, 0.9, 0.9, 10),                        // vertebral foramen
      box(0.4, 0.5, 2.2, -1.8, 0, 0),
      box(0.4, 0.5, 2.2,  1.8, 0, 0),
      box(0.3, 0.4, 1.2, 0, -0.6, 1.0),           // spinous (bifid)
    ),
  },

  "typical-thoracic": {
    color: "#F87171",
    scale: 24,
    markers: [
      { vi: 0, label: "Vertebral body" },
      { vi: 8, label: "Costal facet" },
      { vi: 16, label: "Spinous process" },
    ],
    geom: merge(
      box(2.0, 1.0, 2.0),
      ring(0, 1.0, 1.0, 10),
      box(0.4, 0.5, 2.5, -2.0, 0, 0),
      box(0.4, 0.5, 2.5,  2.0, 0, 0),
      box(0.3, 2.0, 0.4, 0, -1.5, 1.0),           // long spinous
    ),
  },

  "typical-lumbar": {
    color: "#F87171",
    scale: 22,
    markers: [
      { vi: 0, label: "Vertebral body" },
      { vi: 8, label: "Pedicle" },
      { vi: 16, label: "Spinous process" },
    ],
    geom: merge(
      box(2.8, 1.2, 2.5),                          // large body
      ring(0, 1.2, 1.2, 10),
      box(0.5, 0.6, 3.0, -2.2, 0, 0),
      box(0.5, 0.6, 3.0,  2.2, 0, 0),
      box(0.5, 1.0, 0.5, 0, -1.0, 1.2),
    ),
  },

  sacrum: {
    color: "#F87171",
    scale: 20,
    markers: [
      { vi: 0, label: "Promontory" },
      { vi: 8, label: "Sacral foramina" },
      { vi: 20, label: "Coccyx" },
    ],
    geom: merge(
      tube([
        { y: 3.5, r: 1.4 },
        { y: 2.5, r: 1.2 },
        { y: 1.2, r: 1.0 },
        { y: 0,   r: 0.85 },
        { y:-1.2, r: 0.65 },
        { y:-2.2, r: 0.4  },
      ], 10),
      box(0.4, 0.4, 0.4, 0, -2.8, 0),            // coccyx
    ),
  },

  "typical-rib": {
    color: "#A78BFA",
    scale: 18,
    markers: [
      { vi: 0, label: "Head" },
      { vi: 8, label: "Tubercle" },
      { vi: 22, label: "Angle" },
      { vi: 44, label: "Costal groove" },
    ],
    geom: tube([
      { y: 0, r: 0.4,  cx:-4.5, cz: 0   },
      { y: 0, r: 0.3,  cx:-3.5, cz: 0.3 },
      { y: 0, r: 0.28, cx:-2,   cz: 1.5 },        // angle
      { y: 0, r: 0.25, cx: 0,   cz: 2.5 },
      { y: 0, r: 0.25, cx: 2,   cz: 2.8 },
      { y: 0, r: 0.3,  cx: 3.5, cz: 2.0 },
      { y: 0, r: 0.35, cx: 4.5, cz: 0.5 },
    ], 8),
  },

  "first-rib": {
    color: "#A78BFA",
    scale: 20,
    markers: [
      { vi: 0, label: "Head" },
      { vi: 8, label: "Scalene tubercle" },
    ],
    geom: tube([
      { y: 0.5, r: 0.45, cx:-3.0, cz: 0   },
      { y: 0.5, r: 0.35, cx:-1.5, cz: 1.0 },
      { y: 0.5, r: 0.3,  cx: 0,   cz: 1.8 },
      { y: 0.5, r: 0.3,  cx: 1.5, cz: 2.0 },
      { y: 0.5, r: 0.35, cx: 2.8, cz: 1.5 },
    ], 8),
  },

  sternum: {
    color: "#A78BFA",
    scale: 22,
    markers: [
      { vi: 0, label: "Manubrium" },
      { vi: 8, label: "Sternal angle" },
      { vi: 16, label: "Body" },
      { vi: 24, label: "Xiphoid process" },
    ],
    geom: merge(
      box(2.4, 1.8, 0.5, 0,  2.5, 0),            // manubrium
      box(0.3, 0.2, 0.5, 0,  1.6, 0),            // sternal angle
      box(2.0, 4.0, 0.5, 0, -0.5, 0),            // body
      box(0.6, 1.0, 0.4, 0, -3.0, 0),            // xiphoid
    ),
  },
};

// Fallback for unknown bone IDs — generic long bone
function getFallbackDef(boneId: string): BoneDef {
  return {
    color: "#94a3b8",
    scale: 22,
    markers: [{ vi: 0, label: "Proximal end" }, { vi: 30, label: "Shaft" }, { vi: 60, label: "Distal end" }],
    geom: tube([
      { y: 4.0, r: 0.9 },
      { y: 3.0, r: 0.55 },
      { y: 1.0, r: 0.45 },
      { y:-1.0, r: 0.45 },
      { y:-3.0, r: 0.55 },
      { y:-4.0, r: 0.9 },
    ]),
  };
}

// ─── 3D math ─────────────────────────────────────────────────────────────────
function rotateY(v: V3, a: number): V3 {
  const [x, y, z] = v;
  return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
}
function rotateX(v: V3, a: number): V3 {
  const [x, y, z] = v;
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
}
function project(v: V3, cx: number, cy: number, scale: number): { px: number; py: number; pz: number } {
  const fov = 320;
  const d = fov / (fov + v[2] + 6);
  return { px: cx + v[0] * d * scale, py: cy - v[1] * d * scale, pz: v[2] };
}

// ─── Component ───────────────────────────────────────────────────────────────
const BoneViewer3D = forwardRef<BoneViewer3DRef, Props>(function BoneViewer3D(
  { boneId, showMarkers: initMarkers = false, onMarkerTap },
  ref,
) {
  const [size, setSize] = useState({ w: Dimensions.get("window").width, h: 300 });
  const [rot, setRot] = useState({ x: 0.1, y: 0.4 });
  const [showMarkers, setShowMarkers] = useState(initMarkers);

  const rotRef = useRef({ x: 0.1, y: 0.4 });
  const autoRef = useRef(true);
  const prevGRef = useRef({ dx: 0, dy: 0 });
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useImperativeHandle(ref, () => ({
    setMarkers: (show) => setShowMarkers(show),
    resetView: () => {
      rotRef.current = { x: 0.1, y: 0.4 };
      setRot({ x: 0.1, y: 0.4 });
      autoRef.current = true;
    },
  }));

  // Auto-rotate
  useEffect(() => {
    const id = setInterval(() => {
      if (!autoRef.current) return;
      rotRef.current.y += 0.018;
      setRot({ ...rotRef.current });
    }, 33);
    return () => clearInterval(id);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        autoRef.current = false;
        prevGRef.current = { dx: 0, dy: 0 };
        if (idleRef.current) clearTimeout(idleRef.current);
      },
      onPanResponderMove: (_, g) => {
        const ddx = g.dx - prevGRef.current.dx;
        const ddy = g.dy - prevGRef.current.dy;
        prevGRef.current = { dx: g.dx, dy: g.dy };
        rotRef.current.y += ddx * 0.012;
        rotRef.current.x = Math.max(
          -Math.PI / 2.2,
          Math.min(Math.PI / 2.2, rotRef.current.x + ddy * 0.012),
        );
        setRot({ ...rotRef.current });
      },
      onPanResponderRelease: () => {
        idleRef.current = setTimeout(() => { autoRef.current = true; }, 4000);
      },
    }),
  ).current;

  const def = DEFS[boneId] ?? getFallbackDef(boneId);
  const { geom, color, scale, markers } = def;

  // Project all vertices
  const cx = size.w / 2, cy = size.h / 2;
  const projected = geom.verts.map(v => {
    const ry = rotateY(v, rot.y);
    const rx = rotateX(ry, rot.x);
    return project(rx, cx, cy, scale);
  });

  // Sort edges back→front for painter's algorithm
  const edges = [...geom.edges]
    .map(([a, b]) => ({
      a, b,
      z: ((projected[a]?.pz ?? 0) + (projected[b]?.pz ?? 0)) / 2,
    }))
    .sort((e1, e2) => e1.z - e2.z);

  return (
    <View
      style={styles.root}
      {...panResponder.panHandlers}
      onLayout={e => {
        const { width, height } = e.nativeEvent.layout;
        setSize({ w: width, h: height });
      }}
    >
      <Svg width={size.w} height={size.h} style={StyleSheet.absoluteFill}>
        {edges.map(({ a, b, z }) => {
          const pa = projected[a], pb = projected[b];
          if (!pa || !pb) return null;
          const t = Math.max(0, Math.min(1, (z + 7) / 14));
          return (
            <Line
              key={`e-${a}-${b}`}
              x1={pa.px} y1={pa.py}
              x2={pb.px} y2={pb.py}
              stroke={color}
              strokeWidth={0.7 + t * 1.6}
              opacity={0.12 + t * 0.88}
            />
          );
        })}

        {showMarkers && markers.map((m, i) => {
          const p = projected[m.vi];
          if (!p) return null;
          return (
            <React.Fragment key={`m-${i}`}>
              <Circle cx={p.px} cy={p.py} r={7} fill="#6366f1" opacity={0.92} />
              <SvgText
                x={p.px + 11} y={p.py + 4}
                fontSize={10} fill="#c7d2fe"
                fontFamily="-apple-system, sans-serif"
              >
                {i + 1}. {m.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      <View style={styles.hint} pointerEvents="none">
        <Text style={styles.hintTxt}>Drag to rotate</Text>
      </View>
    </View>
  );
});

export default BoneViewer3D;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#111827" },
  hint: { position: "absolute", bottom: 8, left: 0, right: 0, alignItems: "center" },
  hintTxt: { fontSize: 11, color: "rgba(255,255,255,0.28)" },
});
