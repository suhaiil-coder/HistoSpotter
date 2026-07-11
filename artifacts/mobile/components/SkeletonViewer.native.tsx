/**
 * SkeletonViewer — NATIVE (iOS / Android)
 * Loads the NIH skeleton GLB from the API server over HTTP.
 * No Metro asset bundling, no expo-asset, no require('../assets/skeleton.glb').
 * Metro picks this file automatically for iOS/Android.
 * Web gets SkeletonViewer.tsx (SVG).
 */
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export interface BoneInfo {
  name: string; latinName: string; region: string; boneId: string;
}
export interface SkeletonViewerRef {
  resetView: () => void; setMode: (m: string) => void;
}

// GLB is served as a static file by the Express API server.
// EXPO_PUBLIC_DOMAIN is injected at bundle time by the Expo workflow.
const DOMAIN: string =
  (process.env["EXPO_PUBLIC_DOMAIN"] as string) ?? "localhost";
const GLB_URL = `https://${DOMAIN}/api/assets/skeleton.glb`;

function boneAt(ny: number): BoneInfo {
  if (ny < 0.13) return { name:"Skull",          latinName:"Calvaria",             region:"skull",            boneId:"skull"          };
  if (ny < 0.22) return { name:"Cervical Spine", latinName:"Vertebrae cervicales", region:"vertebral-column", boneId:"atlas"          };
  if (ny < 0.45) return { name:"Thoracic Cage",  latinName:"Compages thoracis",    region:"thorax",           boneId:"sternum"        };
  if (ny < 0.55) return { name:"Lumbar Spine",   latinName:"Vertebrae lumbales",   region:"vertebral-column", boneId:"typical-lumbar" };
  if (ny < 0.63) return { name:"Pelvis",         latinName:"Pelvis",               region:"lower-limb",       boneId:"hip-bone"       };
  if (ny < 0.80) return { name:"Femur",          latinName:"Femur",                region:"lower-limb",       boneId:"femur"          };
  if (ny < 0.92) return { name:"Tibia & Fibula", latinName:"Tibia et Fibula",      region:"lower-limb",       boneId:"tibia"          };
  return                 { name:"Foot Bones",    latinName:"Ossa pedis",           region:"lower-limb",       boneId:"tibia"          };
}

const HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;background:#000;overflow:hidden}
canvas{display:block;width:100%!important;height:100%!important}
#msg{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
     color:#aaa;font:14px/1.6 -apple-system,sans-serif;text-align:center;pointer-events:none}
</style>
</head>
<body>
<div id="msg">Loading 3D skeleton…</div>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
<script>
(function(){
  var GLB_URL="__GLB_URL__";
  var W=window.innerWidth,H=window.innerHeight;
  var renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setClearColor(0x000000,1);
  document.body.appendChild(renderer.domElement);

  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(38,W/H,0.01,500);
  camera.position.set(0,0,3.2);

  var controls=new THREE.OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true; controls.dampingFactor=0.06;
  controls.autoRotate=true;    controls.autoRotateSpeed=0.6;
  controls.enablePan=false;    controls.minDistance=1.2; controls.maxDistance=8;

  var key=new THREE.DirectionalLight(0xfff3e0,1.6); key.position.set(-2,3,4); scene.add(key);
  var fill=new THREE.DirectionalLight(0xd0e8ff,0.5); fill.position.set(3,1,2);  scene.add(fill);
  var rim=new THREE.DirectionalLight(0xffe4b0,0.35); rim.position.set(0,-1,-3); scene.add(rim);
  scene.add(new THREE.AmbientLight(0xfff8f0,0.3));

  var mat=new THREE.MeshStandardMaterial({color:0xEBE0CC,roughness:0.72,metalness:0});
  new THREE.GLTFLoader().load(GLB_URL,
    function(gltf){
      var m=gltf.scene;
      var box=new THREE.Box3().setFromObject(m);
      var ctr=box.getCenter(new THREE.Vector3());
      var sz=box.getSize(new THREE.Vector3());
      var s=2.4/Math.max(sz.x,sz.y,sz.z);
      m.scale.setScalar(s); m.position.copy(ctr.multiplyScalar(-s));
      m.traverse(function(c){if(c.isMesh)c.material=mat;});
      scene.add(m);
      document.getElementById('msg').style.display='none';
    },
    undefined,
    function(e){document.getElementById('msg').textContent='Error: '+(e.message||String(e));}
  );

  renderer.domElement.addEventListener('click',function(e){
    controls.autoRotate=false;
    if(window.ReactNativeWebView)
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'tap',ny:e.clientY/H}));
  });

  function onMsg(e){
    try{var d=JSON.parse(e.data);if(d.cmd==='reset'){controls.reset();controls.autoRotate=true;}}
    catch(x){}
  }
  document.addEventListener('message',onMsg);
  window.addEventListener('message',onMsg);

  function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);}
  animate();

  window.addEventListener('resize',function(){
    W=window.innerWidth;H=window.innerHeight;
    camera.aspect=W/H;camera.updateProjectionMatrix();renderer.setSize(W,H);
  });
})();
</script>
</body>
</html>`;

const SkeletonViewer = forwardRef<
  SkeletonViewerRef,
  { onBoneSelect: (b: BoneInfo | null) => void }
>(function SkeletonViewer({ onBoneSelect }, ref) {
  const wvRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    resetView() {
      onBoneSelect(null);
      wvRef.current?.postMessage(JSON.stringify({ cmd: "reset" }));
    },
    setMode() {},
  }));

  const html = HTML.replace("__GLB_URL__", GLB_URL);

  return (
    <WebView
      ref={wvRef}
      style={s.root}
      originWhitelist={["*"]}
      source={{ html, baseUrl: "" }}
      javaScriptEnabled
      domStorageEnabled
      onMessage={e => {
        try {
          const d = JSON.parse(e.nativeEvent.data);
          if (d.type === "tap") onBoneSelect(boneAt(d.ny));
        } catch { /* ignore */ }
      }}
      scrollEnabled={false}
      bounces={false}
      overScrollMode="never"
    />
  );
});

export default SkeletonViewer;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
});
