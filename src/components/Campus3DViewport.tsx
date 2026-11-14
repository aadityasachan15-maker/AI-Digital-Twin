import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CampusBlock, CampusBlockId } from '../types/campus';
import { LNCT_CAMPUS_CENTER, getInterBuildingDistance } from '../data/lnctCampusData';
import { RotateCcw, Compass, Navigation } from 'lucide-react';

export type MapLayerMode = 'density' | 'energy' | 'assets' | 'mesh';

interface Campus3DViewportProps {
  blocks: CampusBlock[];
  selectedBlockId: CampusBlockId;
  onSelectBlock: (id: CampusBlockId) => void;
  activeLayer: MapLayerMode;
  densityMultiplier: number;
  solarMultiplier: number;
  showWireframe: boolean;
  routeFromId: CampusBlockId;
  routeToId: CampusBlockId;
}

// Convert GPS Lat/Lng to local meters relative to LNCT campus center
function gpsToSceneXZ(lat: number, lng: number): { x: number; z: number } {
  const metersPerDegLat = 111132;
  const metersPerDegLng = 111320 * Math.cos((LNCT_CAMPUS_CENTER.lat * Math.PI) / 180);
  const dx = (lng - LNCT_CAMPUS_CENTER.lng) * metersPerDegLng;
  const dz = -(lat - LNCT_CAMPUS_CENTER.lat) * metersPerDegLat;
  // Scale down slightly for comfortable orbital camera framing (1 unit = 4 meters)
  return { x: dx / 4, z: dz / 4 };
}

function getLayerColorHex(
  block: CampusBlock,
  layer: MapLayerMode,
  densityMultiplier: number
): number {
  if (layer === 'density') {
    const occ = Math.min(block.maxCapacity, Math.round(block.currentOccupancy * densityMultiplier));
    const ratio = occ / block.maxCapacity;
    if (ratio > 0.85) return 0xe11d48; // rose-600
    if (ratio > 0.65) return 0xf59e0b; // amber-500
    if (ratio > 0.35) return 0x06b6d4; // cyan-500
    return 0x10b981; // emerald-500
  }
  if (layer === 'energy') {
    if (!block.relays.acOn && !block.relays.lightsOn) return 0x334155; // powered down / idle
    if (block.id === 'substation-solar') return 0xeab308;
    if (block.powerDrawKw > 120) return 0xf97316;
    if (block.powerDrawKw > 60) return 0x3b82f6;
    return 0x6366f1;
  }
  if (layer === 'assets') {
    if (block.healthStatus === 'warning') return 0xf59e0b;
    if (block.healthStatus === 'critical') return 0xef4444;
    return 0x10b981;
  }
  return 0x8b5cf6; // mesh
}

export const Campus3DViewport: React.FC<Campus3DViewportProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  activeLayer,
  densityMultiplier,
  solarMultiplier,
  showWireframe,
  routeFromId,
  routeToId
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<CampusBlock | null>(null);
  const [resetTick, setResetTick] = useState<number>(0);

  // Refs to keep animation loop synchronized with React props without rebuilding WebGL context
  const propsRef = useRef({
    blocks,
    selectedBlockId,
    activeLayer,
    densityMultiplier,
    solarMultiplier,
    showWireframe,
    routeFromId,
    routeToId,
    onSelectBlock
  });
  propsRef.current = {
    blocks,
    selectedBlockId,
    activeLayer,
    densityMultiplier,
    solarMultiplier,
    showWireframe,
    routeFromId,
    routeToId,
    onSelectBlock
  };

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const buildingMeshesRef = useRef<Map<CampusBlockId, THREE.Mesh>>(new Map());
  const roofTrimMeshesRef = useRef<Map<CampusBlockId, THREE.Mesh>>(new Map());
  const routeGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch {
      setWebglError('WebGL hardware acceleration unavailable in this browser.');
      return;
    }

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 520;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError('WebGL context lost. Waiting for GPU restoration...');
    };
    const handleContextRestored = () => {
      setWebglError(null);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    // Scene & Atmospheric Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a14);
    scene.fog = new THREE.FogExp2(0x060a14, 0.0042);

    // Camera
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.5, 600);
    camera.position.set(62, 54, 78);
    cameraRef.current = camera;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    controls.minDistance = 28;
    controls.maxDistance = 175;
    controls.target.set(0, 2, 0);
    controlsRef.current = controls;

    // Three-Point Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0x94a3b8, 0x0f172a, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.85);
    keyLight.position.set(55, 85, 45);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 10;
    keyLight.shadow.camera.far = 260;
    const d = 85;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    rimLight.position.set(-60, 35, -55);
    scene.add(rimLight);

    // Campus Ground Base Plane
    const groundGeo = new THREE.PlaneGeometry(240, 200);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b1220,
      roughness: 0.92,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Subtle geospatial metric grid (1 grid cell = 20 meters)
    const gridHelper = new THREE.GridHelper(220, 44, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.04;
    scene.add(gridHelper);

    // Raisen Road (NH-86 Extension) along South-East Corridor
    const highwayGeo = new THREE.BoxGeometry(220, 0.16, 8);
    const highwayMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
    const highway = new THREE.Mesh(highwayGeo, highwayMat);
    highway.position.set(0, 0.08, 66);
    highway.receiveShadow = true;
    scene.add(highway);

    // Dashed Center Lane Markings on Raisen Road
    for (let x = -96; x <= 96; x += 12) {
      const dashGeo = new THREE.BoxGeometry(5, 0.19, 0.45);
      const dashMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.position.set(x, 0.09, 66);
      scene.add(dash);
    }

    // Central Green Lawn & Sports Turf
    const lawnGeo = new THREE.BoxGeometry(34, 0.14, 18);
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.position.set(2, 0.07, -1);
    lawn.receiveShadow = true;
    scene.add(lawn);

    // Campus Paved Internal Walkway Ring
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x172033, roughness: 0.85 });
    const walkwayCoords: [number, number, number, number][] = [
      [0, 0.06, -15, 130, 3.2].slice(0, 4) as [number, number, number, number]
    ];
    void walkwayCoords;
    const hRoad1 = new THREE.Mesh(new THREE.BoxGeometry(132, 0.12, 3.2), roadMat);
    hRoad1.position.set(8, 0.06, -24);
    scene.add(hRoad1);

    const hRoad2 = new THREE.Mesh(new THREE.BoxGeometry(132, 0.12, 3.2), roadMat);
    hRoad2.position.set(8, 0.06, 12);
    scene.add(hRoad2);

    const hRoad3 = new THREE.Mesh(new THREE.BoxGeometry(132, 0.12, 3.2), roadMat);
    hRoad3.position.set(8, 0.06, 42);
    scene.add(hRoad3);

    const vRoad1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 92), roadMat);
    vRoad1.position.set(-22, 0.06, 12);
    scene.add(vRoad1);

    const vRoad2 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 92), roadMat);
    vRoad2.position.set(22, 0.06, 12);
    scene.add(vRoad2);

    const vRoad3 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 92), roadMat);
    vRoad3.position.set(62, 0.06, 20);
    scene.add(vRoad3);

    // Build 3D Campus Buildings from Real GPS Coordinates
    buildingMeshesRef.current.clear();
    roofTrimMeshesRef.current.clear();

    const interactiveMeshes: THREE.Mesh[] = [];

    propsRef.current.blocks.forEach(block => {
      const pos = gpsToSceneXZ(block.gps.lat, block.gps.lng);
      const bWidth = Math.max(10, Math.min(26, Math.sqrt(block.areaSqm) * 0.18));
      const bDepth = Math.max(8, Math.min(18, Math.sqrt(block.areaSqm) * 0.13));
      const bHeight = Math.max(3.2, block.floors * 3.1);

      const buildingGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
      const buildingMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        roughness: 0.42,
        metalness: 0.25,
        transparent: true,
        opacity: 0.94
      });

      const mesh = new THREE.Mesh(buildingGeo, buildingMat);
      mesh.position.set(pos.x, bHeight / 2, pos.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { blockId: block.id };

      scene.add(mesh);
      interactiveMeshes.push(mesh);
      buildingMeshesRef.current.set(block.id, mesh);

      // Rooftop Telemetry Rim Strip
      const trimGeo = new THREE.BoxGeometry(bWidth + 0.5, 0.45, bDepth + 0.5);
      const trimMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.45,
        roughness: 0.3
      });
      const trim = new THREE.Mesh(trimGeo, trimMat);
      trim.position.set(pos.x, bHeight + 0.24, pos.z);
      scene.add(trim);
      roofTrimMeshesRef.current.set(block.id, trim);

      // Rooftop Chhatt Solar PV Arrays on LNCT Main, CV Raman, LNCT&S New & Substation
      if (
        block.id === 'lnct-main' ||
        block.id === 'cv-raman-block' ||
        block.id === 'lncts-new' ||
        block.id === 'substation-solar'
      ) {
        const panelRows = 3;
        for (let r = 0; r < panelRows; r++) {
          const panelGeo = new THREE.BoxGeometry(bWidth * 0.72, 0.18, bDepth * 0.22);
          const panelMat = new THREE.MeshStandardMaterial({
            color: 0x1e3a8a,
            roughness: 0.18,
            metalness: 0.75
          });
          const panel = new THREE.Mesh(panelGeo, panelMat);
          panel.position.set(
            pos.x,
            bHeight + 0.75,
            pos.z - bDepth * 0.28 + r * (bDepth * 0.28)
          );
          panel.rotation.x = 0.22; // Bhopal latitude ~23.2° optimal solar tilt
          scene.add(panel);
        }
      }

      // Refftronix Drone Lab netted flight cage beside CV Raman Block
      if (block.id === 'refftronix-drone-lab') {
        const cageGeo = new THREE.BoxGeometry(bWidth * 0.85, 3.0, bDepth * 0.85);
        const cageMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          wireframe: true,
          transparent: true,
          opacity: 0.55
        });
        const cage = new THREE.Mesh(cageGeo, cageMat);
        cage.position.set(pos.x, bHeight + 1.6, pos.z);
        scene.add(cage);
      }

      // Floor slab accent lines for multi-story architectural realism
      for (let f = 1; f < block.floors; f++) {
        const slabGeo = new THREE.BoxGeometry(bWidth + 0.25, 0.22, bDepth + 0.25);
        const slabMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
        const slab = new THREE.Mesh(slabGeo, slabMat);
        slab.position.set(pos.x, f * 3.1, pos.z);
        scene.add(slab);
      }
    });

    // Shortest-Path 3D Route Container
    const routeGroup = new THREE.Group();
    scene.add(routeGroup);
    routeGroupRef.current = routeGroup;

    // Raycaster for click & hover inspection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // Ignore drags

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, false);
      if (hits.length > 0) {
        const hitBlockId = hits[0].object.userData.blockId as CampusBlockId;
        if (hitBlockId) {
          propsRef.current.onSelectBlock(hitBlockId);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.blockId as CampusBlockId;
        const found = propsRef.current.blocks.find(b => b.id === hitId) || null;
        setHoveredBlock(found);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredBlock(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // Responsive ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const {
        blocks: curBlocks,
        selectedBlockId: curSelected,
        activeLayer: curLayer,
        densityMultiplier: curDens,
        showWireframe: curWire
      } = propsRef.current;

      // Update building materials smoothly
      curBlocks.forEach(block => {
        const mesh = buildingMeshesRef.current.get(block.id);
        const trim = roofTrimMeshesRef.current.get(block.id);
        if (!mesh || !trim) return;

        const mat = mesh.material as THREE.MeshStandardMaterial;
        const trimMat = trim.material as THREE.MeshStandardMaterial;
        const targetColor = getLayerColorHex(block, curLayer, curDens);

        mat.color.lerp(new THREE.Color(targetColor), 0.12);
        mat.wireframe = curWire;

        const isSelected = block.id === curSelected;
        if (isSelected) {
          const pulse = 0.55 + Math.sin(elapsed * 4.0) * 0.25;
          trimMat.color.setHex(0xffffff);
          trimMat.emissive.setHex(0x38bdf8);
          trimMat.emissiveIntensity = pulse + 0.4;
        } else {
          trimMat.color.setHex(targetColor);
          trimMat.emissive.setHex(targetColor);
          trimMat.emissiveIntensity = 0.25;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      controls.dispose();
      renderer.dispose();
    };
  }, [resetTick]);

  // Update 3D Shortest-Path Navigation Ribbon whenever routeFromId or routeToId changes
  useEffect(() => {
    const group = routeGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else {
        child.material?.dispose();
      }
      group.remove(child);
    }

    if (routeFromId === routeToId) return;

    const fromBlk = blocks.find(b => b.id === routeFromId);
    const toBlk = blocks.find(b => b.id === routeToId);
    if (!fromBlk || !toBlk) return;

    const p1 = gpsToSceneXZ(fromBlk.gps.lat, fromBlk.gps.lng);
    const p2 = gpsToSceneXZ(toBlk.gps.lat, toBlk.gps.lng);

    // Manhattan-style campus walkway mid-point for realistic path routing
    const midX = p1.x;
    const midZ = p2.z;

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(p1.x, 1.2, p1.z),
      new THREE.Vector3(midX, 1.2, midZ),
      new THREE.Vector3(p2.x, 1.2, p2.z)
    ]);

    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.45, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    group.add(tubeMesh);

    // Origin & Destination beacons
    const pinGeo = new THREE.CylinderGeometry(0.9, 0.9, 14, 16);
    const fromMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.65
    });
    const toMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xf43f5e,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.65
    });

    const fromPin = new THREE.Mesh(pinGeo, fromMat);
    fromPin.position.set(p1.x, 7, p1.z);
    const toPin = new THREE.Mesh(pinGeo, toMat);
    toPin.position.set(p2.x, 7, p2.z);

    group.add(fromPin, toPin);
  }, [routeFromId, routeToId, blocks]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(62, 54, 78);
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    } else {
      setResetTick(t => t + 1);
    }
  };

  const activeRoute = getInterBuildingDistance(routeFromId, routeToId);

  if (webglError) {
    return (
      <div className="w-full h-[500px] bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
        <Compass className="w-10 h-10 text-cyan-400 mb-3" />
        <h4 className="text-sm font-semibold text-white mb-1">3D WebGL Viewport Unavailable</h4>
        <p className="text-xs text-slate-400 max-w-md mb-4">{webglError}</p>
        <button
          onClick={() => {
            setWebglError(null);
            setResetTick(t => t + 1);
          }}
          className="px-4 py-2 text-xs font-semibold bg-cyan-400 text-slate-950 rounded-lg"
        >
          Retry 3D Context
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[520px] bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden">
      {/* WebGL Mount Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Top-Left Semantic HUD: Hovered Block Quick Telemetry */}
      {hoveredBlock && (
        <div className="absolute top-3 left-3 z-10 pointer-events-none bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs shadow-xl">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-cyan-400">{hoveredBlock.code}</span>
            <span className="font-semibold text-white">{hoveredBlock.name}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-300">
            <span>{Math.min(hoveredBlock.maxCapacity, Math.round(hoveredBlock.currentOccupancy * densityMultiplier))} / {hoveredBlock.maxCapacity} occ</span>
            <span aria-hidden="true">·</span>
            <span>{hoveredBlock.powerDrawKw} kW</span>
            <span aria-hidden="true">·</span>
            <span>{hoveredBlock.temperatureC}°C</span>
          </div>
        </div>
      )}

      {/* Top-Right Camera Control Button */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          onClick={handleResetCamera}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-slate-700 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset 3D Orbit</span>
        </button>
      </div>

      {/* Bottom-Left Route Distance HUD (if routing active) */}
      {routeFromId !== routeToId && (
        <div className="absolute bottom-3 left-3 z-10 bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 rounded-lg px-3.5 py-2.5 text-xs shadow-lg">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
            <Navigation className="w-3.5 h-3.5" />
            <span>3D Campus Shortest Walkway Route</span>
          </div>
          <div className="text-slate-200 font-mono text-[11px] flex items-center gap-2">
            <span>Walk Path: <strong className="text-white">{activeRoute.walkingPathMeters} m</strong></span>
            <span aria-hidden="true">·</span>
            <span>Straight Line: <strong className="text-slate-300">{activeRoute.straightLineMeters} m</strong></span>
            <span aria-hidden="true">·</span>
            <span>Est. Walk: <strong className="text-emerald-400">{activeRoute.walkingTimeMin} min</strong></span>
          </div>
        </div>
      )}

      {/* Bottom-Right Subtle Orbit Instructions */}
      <div className="absolute bottom-3 right-3 z-10 pointer-events-none bg-slate-950/75 backdrop-blur-sm border border-slate-800 rounded-md px-2.5 py-1 text-[10px] text-slate-400 font-mono">
        Drag: Orbit · Scroll: Zoom · Click Building: Inspect
      </div>
    </div>
  );
};
