/**
 * SkeletonViewer — Medical-illustration-style interactive skeleton.
 * Drawn in react-native-svg (Expo Go + web compatible).
 * Each bone individually tappable; selected bone highlights orange.
 * Drag left/right rotates skeleton (Animated perspective skew).
 */
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";
import Svg, { Defs, G, LinearGradient, Stop, Path, Ellipse, Rect, Circle } from "react-native-svg";

// ─── Public types ─────────────────────────────────────────────────────────────
export interface BoneInfo { name: string; latinName: string; region: string; boneId: string; }
export interface SkeletonViewerRef { resetView: () => void; setMode: (m: string) => void; }

// ─── Colours ──────────────────────────────────────────────────────────────────
const CAVITY = "#1a1530";
const STROKE = "#b89840";
const SEL_S  = "#cc6600";
const SW     = 0.8;

// ─── Gradient defs ────────────────────────────────────────────────────────────
function BoneGrads() {
  return (
    <Defs>
      <LinearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0"   stopColor="#f8edcc" />
        <Stop offset="0.4" stopColor="#edd9a3" />
        <Stop offset="1"   stopColor="#c9a870" />
      </LinearGradient>
      <LinearGradient id="sel" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0"   stopColor="#ffb040" />
        <Stop offset="0.5" stopColor="#ff8800" />
        <Stop offset="1"   stopColor="#cc5500" />
      </LinearGradient>
      <LinearGradient id="cart" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#a0e0e0" />
        <Stop offset="1" stopColor="#5cb8b8" />
      </LinearGradient>
    </Defs>
  );
}

// ─── Bone wrapper ─────────────────────────────────────────────────────────────
interface BoneProps { id: string; info: BoneInfo; sel: string | null; onPress: () => void; children: React.ReactNode; }
function Bone({ id, info, sel, onPress, children }: BoneProps) {
  const selected = sel === id;
  return (
    <G fill={selected ? "url(#sel)" : "url(#bg)"}
       stroke={selected ? SEL_S : STROKE}
       strokeWidth={selected ? SW * 1.5 : SW}
       onPress={onPress}>
      {children}
    </G>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const SkeletonViewer = forwardRef<SkeletonViewerRef, { onBoneSelect: (b: BoneInfo | null) => void }>(
  function SkeletonViewer({ onBoneSelect }, ref) {
    const [sel, setSel] = useState<string | null>(null);
    const rotX = useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
      resetView: () => { setSel(null); onBoneSelect(null); Animated.spring(rotX, { toValue: 0, useNativeDriver: true }).start(); },
      setMode: () => {},
    }));

    const pan = useRef(PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 3,
      onPanResponderMove: (_, g) => rotX.setValue(g.dx * 0.45),
      onPanResponderRelease: () => Animated.spring(rotX, { toValue: 0, useNativeDriver: true, friction: 6 }).start(),
    })).current;

    function pick(id: string, info: BoneInfo) {
      if (sel === id) { setSel(null); onBoneSelect(null); }
      else { setSel(id); onBoneSelect(info); }
    }

    // Shorthand for a tappable bone group
    function B(id: string, info: BoneInfo, children: React.ReactNode) {
      return (
        <Bone key={id} id={id} info={info} sel={sel} onPress={() => pick(id, info)}>
          {children}
        </Bone>
      );
    }

    const rotDeg = rotX.interpolate({ inputRange: [-200, 200], outputRange: ["-28deg", "28deg"] });

    return (
      <View style={styles.root} {...pan.panHandlers}>
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ perspective: 900 }, { rotateY: rotDeg }] }]}>
          {/* viewBox compresses 730-unit skeleton into 438 units so full body fits the screen */}
          <Svg viewBox="0 0 200 438" style={StyleSheet.absoluteFill} preserveAspectRatio="xMidYMid meet">
            <BoneGrads />
            {/* scale(1, 0.6) maps all y-coords (0–730) into 0–438 */}
            <G transform="scale(1, 0.6)">{/* inner */}

            {/* ── SKULL ─────────────────────────────────────────────────────── */}
            {B("skull", { name: "Skull", latinName: "Calvaria", region: "skull", boneId: "skull" },
              <>
                {/* Cranium */}
                <Path d="M100,5 C130,5 155,18 158,42 C161,66 154,88 140,96 C130,102 115,105 100,106 C85,105 70,102 60,96 C46,88 39,66 42,42 C45,18 70,5 100,5 Z" />
                {/* Cheekbones (zygomatic) */}
                <Path d="M55,75 C49,72 43,73 40,77 C38,82 42,87 50,87 C54,87 58,84 60,80 Z" />
                <Path d="M145,75 C151,72 157,73 160,77 C162,82 158,87 150,87 C146,87 142,84 140,80 Z" />
                {/* Eye sockets */}
                <Ellipse cx={83} cy={66} rx={15} ry={12} fill={CAVITY} stroke="#6c4c10" />
                <Ellipse cx={117} cy={66} rx={15} ry={12} fill={CAVITY} stroke="#6c4c10" />
                {/* Nasal aperture */}
                <Path d="M95,79 C93,87 94,94 100,96 C106,94 107,87 105,79 L101,75 L100,73 L99,75 Z" fill={CAVITY} stroke="#6c4c10" />
                {/* Maxilla */}
                <Path d="M68,102 C80,110 90,113 100,113 C110,113 120,110 132,102 Z" />
                {/* Mandible */}
                <Path d="M64,104 C54,108 48,117 50,128 L54,145 L72,154 L100,158 L128,154 L146,145 L150,128 C152,117 146,108 136,104 L120,102 L100,104 L80,102 Z" />
              </>
            )}

            {/* ── CERVICAL SPINE (C1–C7) ───────────────────────────────────── */}
            {[...Array(7)].map((_, i) => {
              const id = `cv${i}`;
              const y = 162 + i * 9.5;
              return B(id, { name: `C${i+1} Vertebra`, latinName: `Vertebra cervicalis ${i+1}`, region: "vertebral-column", boneId: "atlas" },
                <>
                  <Rect x={87} y={y} width={26} height={7} rx={2} />
                  <Path d={`M82,${y+3.5} L78,${y+3.5}`} strokeWidth={0.6} />
                  <Path d={`M118,${y+3.5} L122,${y+3.5}`} strokeWidth={0.6} />
                </>
              );
            })}

            {/* ── THORACIC SPINE (T1–T12) ──────────────────────────────────── */}
            {[...Array(12)].map((_, i) => {
              const id = `tv${i}`;
              const y = 228 + i * 11;
              return B(id, { name: `T${i+1} Vertebra`, latinName: `Vertebra thoracica ${i+1}`, region: "vertebral-column", boneId: "typical-thoracic" },
                <>
                  <Rect x={86} y={y} width={28} height={8.5} rx={2} />
                  <Path d={`M100,${y+9} L100,${y+14}`} strokeWidth={0.6} />
                </>
              );
            })}

            {/* ── LUMBAR SPINE (L1–L5) ─────────────────────────────────────── */}
            {[...Array(5)].map((_, i) => {
              const id = `lv${i}`;
              const y = 362 + i * 13;
              return B(id, { name: `L${i+1} Vertebra`, latinName: `Vertebra lumbalis ${i+1}`, region: "vertebral-column", boneId: "typical-lumbar" },
                <>
                  <Rect x={84} y={y} width={32} height={10} rx={2.5} />
                  <Path d={`M100,${y+11} L100,${y+16}`} strokeWidth={0.7} />
                </>
              );
            })}

            {/* ── SACRUM ───────────────────────────────────────────────────── */}
            {B("sacrum", { name: "Sacrum", latinName: "Os sacrum", region: "vertebral-column", boneId: "sacrum" },
              <Path d="M82,427 C81,434 85,454 91,469 C94,476 100,480 100,480 C100,480 106,476 109,469 C115,454 119,434 118,427 Z" />
            )}
            {B("coccyx", { name: "Coccyx", latinName: "Os coccygis", region: "vertebral-column", boneId: "sacrum" },
              <Path d="M96,480 C97,486 99,494 100,499 C101,494 103,486 104,480 Z" />
            )}

            {/* ── RIBS (12 pairs) ───────────────────────────────────────────── */}
            {([
              {w:32,d:5,y:231},{w:40,d:7,y:242},{w:48,d:9,y:253},{w:55,d:11,y:264},
              {w:60,d:13,y:275},{w:64,d:15,y:286},{w:65,d:17,y:297},{w:64,d:17,y:308},
              {w:61,d:15,y:319},{w:56,d:13,y:330},{w:49,d:11,y:341},{w:41,d:9,y:352},
            ] as {w:number;d:number;y:number}[]).map((r, i) => {
              const name = `Costa ${i+1}`;
              return (
                <G key={`ribpair${i}`}>
                  {B(`ribL${i}`, { name: i===0?"First Rib":"Rib", latinName: name, region:"thorax", boneId: i===0?"first-rib":"typical-rib" },
                    <Path d={`M91,${r.y} C78,${r.y} ${100-r.w},${r.y+r.d*0.5} ${102-r.w},${r.y+r.d} C${108-r.w},${r.y+r.d+2} 87,${r.y+r.d*0.8} 91,${r.y+3}`}
                      fill="none" strokeWidth={1.8} strokeLinecap="round" />
                  )}
                  {B(`ribR${i}`, { name: i===0?"First Rib":"Rib", latinName: name, region:"thorax", boneId: i===0?"first-rib":"typical-rib" },
                    <Path d={`M109,${r.y} C122,${r.y} ${100+r.w},${r.y+r.d*0.5} ${98+r.w},${r.y+r.d} C${92+r.w},${r.y+r.d+2} 113,${r.y+r.d*0.8} 109,${r.y+3}`}
                      fill="none" strokeWidth={1.8} strokeLinecap="round" />
                  )}
                </G>
              );
            })}

            {/* ── STERNUM ───────────────────────────────────────────────────── */}
            {B("sternum", { name: "Sternum", latinName: "Sternum", region: "thorax", boneId: "sternum" },
              <>
                <Path d="M90,224 C90,219 93,213 100,212 C107,213 110,219 110,224 L110,242 L90,242 Z" />
                <Rect x={91} y={242} width={18} height={108} rx={2} />
                <Path d="M96,350 L100,366 L104,350 Z" />
              </>
            )}

            {/* ── CLAVICLES ─────────────────────────────────────────────────── */}
            {B("clavL", { name: "Clavicle", latinName: "Clavicula", region: "upper-limb", boneId: "clavicle" },
              <Path d="M93,222 C82,219 68,221 56,226 C47,230 40,228 36,224" fill="none" strokeWidth={4} strokeLinecap="round" />
            )}
            {B("clavR", { name: "Clavicle", latinName: "Clavicula", region: "upper-limb", boneId: "clavicle" },
              <Path d="M107,222 C118,219 132,221 144,226 C153,230 160,228 164,224" fill="none" strokeWidth={4} strokeLinecap="round" />
            )}

            {/* ── SCAPULAE (outline only — behind ribs) ──────────────────────── */}
            {B("scapL", { name: "Scapula", latinName: "Scapula", region: "upper-limb", boneId: "scapula" },
              <Path d="M30,228 C26,240 22,285 28,314 C40,317 55,294 60,262 C65,236 60,222 50,220 Z" fill="none" strokeWidth={1.2} />
            )}
            {B("scapR", { name: "Scapula", latinName: "Scapula", region: "upper-limb", boneId: "scapula" },
              <Path d="M170,228 C174,240 178,285 172,314 C160,317 145,294 140,262 C135,236 140,222 150,220 Z" fill="none" strokeWidth={1.2} />
            )}

            {/* ── HUMERI ────────────────────────────────────────────────────── */}
            {B("humL", { name: "Humerus", latinName: "Humerus", region: "upper-limb", boneId: "humerus" },
              <Path d="
                M47,224 C40,220 33,221 31,229 C29,237 33,245 40,249
                L34,345 C33,352 34,360 37,364 C40,372 47,376 53,374
                C59,372 63,366 63,358 L57,258 C63,254 67,246 65,238
                C63,230 55,222 47,224 Z
              " />
            )}
            {B("humR", { name: "Humerus", latinName: "Humerus", region: "upper-limb", boneId: "humerus" },
              <Path d="
                M153,224 C160,220 167,221 169,229 C171,237 167,245 160,249
                L166,345 C167,352 166,360 163,364 C160,372 153,376 147,374
                C141,372 137,366 137,358 L143,258 C137,254 133,246 135,238
                C137,230 145,222 153,224 Z
              " />
            )}

            {/* ── RADII ─────────────────────────────────────────────────────── */}
            {B("radL", { name: "Radius", latinName: "Radius", region: "upper-limb", boneId: "radius" },
              <Path d="M43,376 C38,374 34,377 34,382 L31,468 C31,475 35,480 41,481 C47,482 52,477 52,470 L54,384 C54,378 49,375 43,376 Z" />
            )}
            {B("radR", { name: "Radius", latinName: "Radius", region: "upper-limb", boneId: "radius" },
              <Path d="M157,376 C162,374 166,377 166,382 L169,468 C169,475 165,480 159,481 C153,482 148,477 148,470 L146,384 C146,378 151,375 157,376 Z" />
            )}

            {/* ── ULNAE ─────────────────────────────────────────────────────── */}
            {B("ulnL", { name: "Ulna", latinName: "Ulna", region: "upper-limb", boneId: "ulna" },
              <Path d="M55,374 C51,370 46,369 46,374 L45,382 C47,384 52,386 53,390 L51,470 C51,477 54,482 58,483 C62,484 66,479 66,472 L64,384 C64,378 59,372 55,374 Z" />
            )}
            {B("ulnR", { name: "Ulna", latinName: "Ulna", region: "upper-limb", boneId: "ulna" },
              <Path d="M145,374 C149,370 154,369 154,374 L155,382 C153,384 148,386 147,390 L149,470 C149,477 146,482 142,483 C138,484 134,479 134,472 L136,384 C136,378 141,372 145,374 Z" />
            )}

            {/* ── HANDS ─────────────────────────────────────────────────────── */}
            {B("handL", { name: "Hand Bones", latinName: "Ossa manus", region: "upper-limb", boneId: "radius" },
              <>
                <Rect x={28} y={482} width={30} height={14} rx={5} />
                {[0,1,2,3,4].map(j=><Rect key={j} x={29+j*6} y={497} width={5} height={22} rx={2} />)}
                {[0,1,2,3,4].map(j=><Rect key={j} x={29+j*6} y={520} width={5} height={14} rx={2} />)}
              </>
            )}
            {B("handR", { name: "Hand Bones", latinName: "Ossa manus", region: "upper-limb", boneId: "radius" },
              <>
                <Rect x={142} y={482} width={30} height={14} rx={5} />
                {[0,1,2,3,4].map(j=><Rect key={j} x={143+j*6} y={497} width={5} height={22} rx={2} />)}
                {[0,1,2,3,4].map(j=><Rect key={j} x={143+j*6} y={520} width={5} height={14} rx={2} />)}
              </>
            )}

            {/* ── PELVIS ────────────────────────────────────────────────────── */}
            {B("pelvis", { name: "Pelvis", latinName: "Pelvis", region: "lower-limb", boneId: "hip-bone" },
              <>
                {/* Iliac wings + ischium/pubis */}
                <Path d="
                  M100,430 C100,430 90,426 77,424 C60,422 43,424 32,435 C21,446 22,462 32,470
                  C42,478 58,479 70,474 C80,470 88,462 92,454
                  L100,446 L108,454 C112,462 120,470 130,474
                  C142,479 158,478 168,470 C178,462 179,446 168,435
                  C157,424 140,422 123,424 C110,426 100,430 100,430 Z
                " />
                {/* Pubic symphysis */}
                <Path d="M86,466 C88,472 93,477 100,479 C107,477 112,472 114,466 L110,462 L100,464 L90,462 Z" />
                {/* Acetabula (hip sockets — cartilage) */}
                <Circle cx={66} cy={472} r={11} fill="url(#cart)" stroke="#5cb8b8" strokeWidth={0.8} />
                <Circle cx={134} cy={472} r={11} fill="url(#cart)" stroke="#5cb8b8" strokeWidth={0.8} />
              </>
            )}

            {/* ── LEFT FEMUR (head + neck + shaft + condyles) ───────────────── */}
            {B("femL", { name: "Femur", latinName: "Femur", region: "lower-limb", boneId: "femur" },
              <>
                {/* Femoral head (projects medially toward acetabulum) */}
                <Circle cx={64} cy={480} r={11} />
                {/* Femoral neck */}
                <Path d="M62,478 C66,483 70,487 74,488 L74,500 L68,500 Z" />
                {/* Greater trochanter */}
                <Path d="M74,476 C70,472 66,470 63,472 C60,474 60,480 64,484 C67,487 72,488 75,487 Z" />
                {/* Shaft */}
                <Path d="M68,492 L64,588 L62,594 C60,602 62,610 67,614 C72,618 79,617 83,611 C87,605 87,597 84,590 L82,584 L84,492 Z" />
                {/* Medial condyle (larger) */}
                <Ellipse cx={65} cy={600} rx={11} ry={9} />
                {/* Lateral condyle */}
                <Ellipse cx={83} cy={598} rx={9} ry={8} />
              </>
            )}

            {/* ── RIGHT FEMUR ───────────────────────────────────────────────── */}
            {B("femR", { name: "Femur", latinName: "Femur", region: "lower-limb", boneId: "femur" },
              <>
                <Circle cx={136} cy={480} r={11} />
                <Path d="M138,478 C134,483 130,487 126,488 L126,500 L132,500 Z" />
                <Path d="M126,476 C130,472 134,470 137,472 C140,474 140,480 136,484 C133,487 128,488 125,487 Z" />
                <Path d="M132,492 L136,588 L138,594 C140,602 138,610 133,614 C128,618 121,617 117,611 C113,605 113,597 116,590 L118,584 L116,492 Z" />
                <Ellipse cx={135} cy={600} rx={11} ry={9} />
                <Ellipse cx={117} cy={598} rx={9} ry={8} />
              </>
            )}

            {/* ── PATELLAE ──────────────────────────────────────────────────── */}
            {B("patL", { name: "Patella", latinName: "Patella", region: "lower-limb", boneId: "patella" },
              <Ellipse cx={70} cy={612} rx={11} ry={9} />
            )}
            {B("patR", { name: "Patella", latinName: "Patella", region: "lower-limb", boneId: "patella" },
              <Ellipse cx={130} cy={612} rx={11} ry={9} />
            )}

            {/* ── LEFT TIBIA ────────────────────────────────────────────────── */}
            {B("tibL", { name: "Tibia", latinName: "Tibia", region: "lower-limb", boneId: "tibia" },
              <>
                {/* Tibial plateau (wide) */}
                <Path d="M52,622 C53,616 58,612 76,613 C78,619 78,625 76,626 L52,626 Z" />
                {/* Shaft */}
                <Path d="M52,626 L50,706 C50,714 54,720 61,721 C68,722 74,716 74,708 L76,626 Z" />
              </>
            )}
            {B("tibR", { name: "Tibia", latinName: "Tibia", region: "lower-limb", boneId: "tibia" },
              <>
                <Path d="M148,622 C147,616 142,612 124,613 C122,619 122,625 124,626 L148,626 Z" />
                <Path d="M148,626 L150,706 C150,714 146,720 139,721 C132,722 126,716 126,708 L124,626 Z" />
              </>
            )}

            {/* ── FIBULAE ───────────────────────────────────────────────────── */}
            {B("fibL", { name: "Fibula", latinName: "Fibula", region: "lower-limb", boneId: "fibula" },
              <Path d="M78,628 C76,625 74,628 74,634 L74,706 C74,713 77,718 82,718 C87,718 89,713 89,706 L89,634 C89,628 84,625 78,628 Z" />
            )}
            {B("fibR", { name: "Fibula", latinName: "Fibula", region: "lower-limb", boneId: "fibula" },
              <Path d="M122,628 C124,625 126,628 126,634 L126,706 C126,713 123,718 118,718 C113,718 111,713 111,706 L111,634 C111,628 116,625 122,628 Z" />
            )}

            {/* ── FEET ──────────────────────────────────────────────────────── */}
            {B("footL", { name: "Foot Bones", latinName: "Ossa pedis", region: "lower-limb", boneId: "tibia" },
              <>
                <Rect x={44} y={721} width={32} height={9} rx={4} />
                {[0,1,2,3,4].map(j=>(
                  <Path key={j} d={`M${47+j*5.5},721 L${44+j*5.5},707`} strokeWidth={3} strokeLinecap="round" />
                ))}
              </>
            )}
            {B("footR", { name: "Foot Bones", latinName: "Ossa pedis", region: "lower-limb", boneId: "tibia" },
              <>
                <Rect x={124} y={721} width={32} height={9} rx={4} />
                {[0,1,2,3,4].map(j=>(
                  <Path key={j} d={`M${153-j*5.5},721 L${156-j*5.5},707`} strokeWidth={3} strokeLinecap="round" />
                ))}
              </>
            )}

            </G>{/* end scale */}
          </Svg>
        </Animated.View>
      </View>
    );
  }
);

export default SkeletonViewer;

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: "#1e1e2e" } });
