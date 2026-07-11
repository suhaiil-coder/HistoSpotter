/**
 * Converts a binary STL file to a GLB (binary GLTF 2.0).
 * Applies simple decimation to reduce polygon count for mobile.
 *
 * Usage: pnpm --filter @workspace/scripts run stl-to-glb
 */
import * as fs from "fs";
import * as path from "path";

const SRC = path.resolve("../attached_assets/anatomy_unzip/Skeleton.stl");
const DST = path.resolve("../artifacts/mobile/assets/skeleton.glb");
const KEEP_RATIO = 0.12; // keep 12% of triangles → ~65K tris

const buf = fs.readFileSync(SRC);
const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

const triCount = dv.getUint32(80, true);
console.log(`Input: ${triCount.toLocaleString()} triangles (${(buf.byteLength / 1e6).toFixed(1)} MB)`);

// ── Parse binary STL ──────────────────────────────────────────────────────────
const STRIDE = 50; // 12 normal + 36 vertices + 2 attr
const positions: number[] = [];
const normals:   number[] = [];

let minX = Infinity, minY = Infinity, minZ = Infinity;
let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

let kept = 0;
for (let i = 0; i < triCount; i++) {
  // Simple decimation: skip triangles deterministically
  if (Math.random() > KEEP_RATIO) continue;

  const base = 84 + i * STRIDE;
  const nx = dv.getFloat32(base, true);
  const ny = dv.getFloat32(base + 4, true);
  const nz = dv.getFloat32(base + 8, true);

  for (let v = 0; v < 3; v++) {
    const vb = base + 12 + v * 12;
    const x = dv.getFloat32(vb, true);
    const y = dv.getFloat32(vb + 4, true);
    const z = dv.getFloat32(vb + 8, true);
    positions.push(x, y, z);
    normals.push(nx, ny, nz);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }
  kept++;
}

console.log(`Kept: ${kept.toLocaleString()} triangles (${(kept / triCount * 100).toFixed(1)}%)`);

// ── Pack into GLB ─────────────────────────────────────────────────────────────
const vertCount = positions.length / 3;
const posBuf = Buffer.alloc(vertCount * 12);
const nrmBuf = Buffer.alloc(vertCount * 12);

for (let i = 0; i < positions.length; i++) {
  posBuf.writeFloatLE(positions[i]!, i * 4);
  nrmBuf.writeFloatLE(normals[i]!, i * 4);
}

// Binary buffer: positions then normals, padded to 4-byte boundary
const binData = Buffer.concat([posBuf, nrmBuf]);
const binPad  = (4 - (binData.byteLength % 4)) % 4;
const binChunk = Buffer.concat([binData, Buffer.alloc(binPad, 0x00)]);

const json = JSON.stringify({
  asset: { version: "2.0", generator: "stl-to-glb" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: "Skeleton" }],
  meshes: [{
    name: "Skeleton",
    primitives: [{
      attributes: { POSITION: 0, NORMAL: 1 },
      mode: 4,
    }],
  }],
  accessors: [
    {
      bufferView: 0,
      componentType: 5126,
      count: vertCount,
      type: "VEC3",
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ],
    },
    {
      bufferView: 1,
      componentType: 5126,
      count: vertCount,
      type: "VEC3",
    },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0,              byteLength: posBuf.byteLength },
    { buffer: 0, byteOffset: posBuf.byteLength, byteLength: nrmBuf.byteLength },
  ],
  buffers: [{ byteLength: binChunk.byteLength }],
});

// JSON chunk padded to 4-byte boundary with spaces
const jsonBuf = Buffer.from(json, "utf8");
const jsonPad = (4 - (jsonBuf.byteLength % 4)) % 4;
const jsonChunk = Buffer.concat([jsonBuf, Buffer.alloc(jsonPad, 0x20)]);

// GLB header + JSON chunk + BIN chunk
function chunkHeader(length: number, type: number) {
  const h = Buffer.alloc(8);
  h.writeUInt32LE(length, 0);
  h.writeUInt32LE(type,   4);
  return h;
}

const totalLen = 12 + 8 + jsonChunk.byteLength + 8 + binChunk.byteLength;
const glbHeader = Buffer.alloc(12);
glbHeader.writeUInt32LE(0x46546c67, 0); // magic "glTF"
glbHeader.writeUInt32LE(2,          4); // version
glbHeader.writeUInt32LE(totalLen,   8);

const glb = Buffer.concat([
  glbHeader,
  chunkHeader(jsonChunk.byteLength, 0x4e4f534a), // JSON
  jsonChunk,
  chunkHeader(binChunk.byteLength,  0x004e4942), // BIN
  binChunk,
]);

fs.mkdirSync(path.dirname(DST), { recursive: true });
fs.writeFileSync(DST, glb);
console.log(`Output: ${DST} (${(glb.byteLength / 1e6).toFixed(2)} MB)`);
