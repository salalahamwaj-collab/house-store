import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Scene360Props {
  onObjectClick: (tag: string) => void;
}

export default function Scene360({ onObjectClick }: Scene360Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SETUP ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = -0.5; // Invert rotation for natural panorama feel

    // --- 360 BACKGROUND ---
    const textureLoader = new THREE.TextureLoader();
    // Using a placeholder panorama
    textureLoader.load(
      'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop', // Abstract gradient for demo
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        setLoading(false);
      }
    );

    // --- INTERACTIVE PLACEHOLDERS ---
    // In a real app, these would be loaded from a GLTF or JSON config
    const placeholders = [
      { name: 'modern_sofa', pos: [5, -1, -5], size: [2, 1, 1] },
      { name: 'coffee_table', pos: [3, -2, -2], size: [1, 0.5, 1] },
      { name: 'ceiling_lamp', pos: [0, 4, -2], size: [0.5, 0.5, 0.5] },
    ];

    const interactiveObjects: THREE.Mesh[] = [];

    placeholders.forEach((p) => {
      const geometry = new THREE.BoxGeometry(...p.size as [number, number, number]);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.1, // Near invisible but detectable
        depthWrite: false 
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...p.pos as [number, number, number]);
      mesh.name = p.name;
      scene.add(mesh);
      interactiveObjects.push(mesh);
    });

    // --- RAYCASTER ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);

      if (intersects.length > 0) {
        const target = intersects[0].object;
        onObjectClick(target.name);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // --- ANIMATION RE-RENDER ---
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // --- RESIZE ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [onObjectClick]);

  return (
    <div id="scene-container" ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-10 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <p className="font-mono text-sm tracking-widest uppercase">Loading 360° Environment...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-8 left-8 z-10 text-white pointer-events-none">
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Living Room v1.4</h1>
        <p className="text-xs opacity-60 font-mono">DRAG TO ROTATE • CLICK OBJECTS TO VIEW OPTIONS</p>
      </div>
    </div>
  );
}
