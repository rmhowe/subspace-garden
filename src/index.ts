import './style.css';
import * as three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLElement;

// Scene
const scene = new three.Scene();

/**
 * Textures
 */
const textureLoader = new three.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/12.png');

// Particles
const particleGeometry = new three.BufferGeometry();
const count = 10000;
const itemSize = 3;
const positions = new Float32Array(count * itemSize);
const colors = new Float32Array(count * itemSize);
for (let i = 0; i < count * itemSize; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
particleGeometry.setAttribute('position', new three.BufferAttribute(positions, itemSize));
particleGeometry.setAttribute('color', new three.BufferAttribute(colors, itemSize));

const particleMaterial = new three.PointsMaterial({
  size: 0.1,
  alphaMap: particleTexture,
  transparent: true,
  depthWrite: false,
  blending: three.AdditiveBlending,
});
particleMaterial.vertexColors = true;

const particles = new three.Points(particleGeometry, particleMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new three.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new three.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   particles.rotation.y = elapsedTime * 0.2;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particleGeometry.attributes.position.array[i3];
    particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x) * 2;
  }
  particleGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
