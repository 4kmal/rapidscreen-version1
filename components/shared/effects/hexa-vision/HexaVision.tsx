"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

interface HexaVisionProps {
  className?: string;
  height?: string;
  /** Initial camera distance (default: 6) */
  cameraDistance?: number;
  /** Enable auto-rotation (default: true) */
  autoRotate?: boolean;
  /** Enable user interaction (default: true) */
  enableInteraction?: boolean;
  /** Primary highlight color (default: #00ff00) */
  highlightColor?: string;
  /** Outline color (default: #0a0060) */
  outlineColor?: string;
  /** Secondary/fill color (default: #ff005f) */
  secondaryColor?: string;
  /** Hexagon size for the post-processing effect (default: 4) */
  ommatidiaSize?: number;
  /** Bloom strength (default: 1.3) */
  bloomStrength?: number;
}

export default function HexaVision({
  className = "",
  height = "300px",
  cameraDistance = 6,
  autoRotate = true,
  enableInteraction = true,
  highlightColor = "#00ff00",
  outlineColor = "#0a0060",
  secondaryColor = "#ff005f",
  ommatidiaSize = 4,
  bloomStrength = 1.3,
}: HexaVisionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const heightNum = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / heightNum, 0.1, 100);
    camera.position.z = cameraDistance;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightNum);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    let controls: OrbitControls | null = null;
    let controls2: TrackballControls | null = null;
    if (enableInteraction) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.02;
      controls.maxDistance = 20;
      controls.minDistance = 0.1;
      controls.panSpeed = 0.02;
      controls.rotateSpeed = 0.5;
      controls.zoomSpeed = 1;
      controls.enableZoom = false;

      controls2 = new TrackballControls(camera, renderer.domElement);
      controls2.noRotate = true;
      controls2.noPan = true;
      controls2.noZoom = false;
      controls2.zoomSpeed = 1.5;
    }

    // Icosahedron geometry
    const geometry = new THREE.IcosahedronGeometry(1, 30);

    // Custom shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 6.0 },
        uDepth: { value: 1 },
        uSharpness: { value: 3.0 },
        uSpeed: { value: 0 },
        uColor: { value: new THREE.Color(highlightColor) },
        uNoiseScale: { value: 1.5 },
        uNoiseStrength: { value: 1.4 },
        uOutlineWidth: { value: 0.5 },
        uOutlineColor: { value: new THREE.Color(outlineColor) },
        uSecondaryColor: { value: new THREE.Color(secondaryColor) },
        uDisplacementStrength: { value: 1 }
      },
      vertexShader: `
            uniform float uTime;
            uniform float uScale;
            uniform float uSharpness;
            uniform float uSpeed;
            uniform float uNoiseScale;
            uniform float uNoiseStrength;
            uniform float uDisplacementStrength;
            varying vec3 vNormal;
            varying vec3 v3Position;
            varying float vShellPattern;
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }
            float noise(vec2 uv, float timeOffset) {
                vec2 i = floor(uv);
                vec2 f = fract(uv);
                float a = hash(i + vec2(timeOffset));
                float b = hash(i + vec2(1.0, 0.0) + vec2(timeOffset));
                float c = hash(i + vec2(0.0, 1.0) + vec2(timeOffset));
                float d = hash(i + vec2(1.0, 1.0) + vec2(timeOffset));
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
            }
            float voronoi(vec2 uv, float t) {
                vec2 g = floor(uv);
                vec2 f = fract(uv);
                float minDist1 = 1.0;
                float secondMinDist1 = 1.0;
                float minDist2 = 1.0;
                float secondMinDist2 = 1.0;
                float t0 = t;
                float t1 = t + 1.0;
                float a = smoothstep(0.0, 1.0, fract(t));
                for (int y = -1; y <= 1; y++) {
                    for (int x = -1; x <= 1; x++) {
                        vec2 lattice = vec2(x, y);
                        vec2 perturbed_lattice = lattice + uNoiseStrength * (noise((g + lattice) * uNoiseScale, t0) * 2.0 - 1.0);
                        vec2 point = hash(g + perturbed_lattice) + perturbed_lattice - f;
                        float dist = length(point);
                        if (dist < minDist1) {
                            secondMinDist1 = minDist1;
                            minDist1 = dist;
                        } else if (dist < secondMinDist1) {
                            secondMinDist1 = dist;
                        }
                    }
                }
                for (int y = -1; y <= 1; y++) {
                    for (int x = -1; x <= 1; x++) {
                        vec2 lattice = vec2(x, y);
                        vec2 perturbed_lattice = lattice + uNoiseStrength * (noise((g + lattice) * uNoiseScale, t1) * 2.0 - 1.0);
                vec2 point = hash(g + perturbed_lattice) + perturbed_lattice - f;
                float dist = length(point);
                if (dist < minDist2) {
                    secondMinDist2 = minDist2;
                    minDist2 = dist;
                } else if (dist < secondMinDist2) {
                    secondMinDist2 = dist;
                }
            }
        }
        float pattern1 = secondMinDist1 - minDist1;
        float pattern2 = secondMinDist2 - minDist2;
        return mix(pattern1, pattern2, a);
        }
        float triplanar(vec3 p, vec3 normal, float t) {
            vec3 blending = abs(normal);
            blending = normalize(max(blending, 0.00001));
            blending /= (blending.x + blending.y + blending.z);
            float x = voronoi(p.yz * uScale, t);
            float y = voronoi(p.xz * uScale, t);
            float z = voronoi(p.xy * uScale, t);
            return (x * blending.x + y * blending.y + z * blending.z);
        }
        void main() {
            vec3 transformedNormal = normalize(normalMatrix * normal);
            vec3 displacedPosition = position;
            float time = uTime * uSpeed;
            float patternValue = triplanar(position, normal, time);
            vShellPattern = patternValue;
            float softPattern = smoothstep(0.2, 0.8, patternValue);
            float displacementFactor = softPattern * uDisplacementStrength;
            displacedPosition += normal * displacementFactor;
            vNormal = transformedNormal;
            v3Position = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
        }
      `,
      fragmentShader: `
          uniform float uTime;
          uniform float uDepth;
          uniform vec3 uColor;
          uniform float uOutlineWidth;
          uniform vec3 uOutlineColor;
          uniform vec3 uSecondaryColor;
          varying vec3 vNormal;
          varying vec3 v3Position;
          varying float vShellPattern;
          void main() {
              float steppedPattern = smoothstep(uOutlineWidth, uOutlineWidth + 0.2, vShellPattern);
              vec3 lightDirection = normalize(vec3(0.5, 0.5, 1.0));
              float lighting = dot(vNormal, lightDirection) * 0.5 + 0.5;
              vec3 baseColor = mix(uOutlineColor, uSecondaryColor, steppedPattern);
              float highlightIntensity = smoothstep(0.0, 0.5, vShellPattern);
              vec3 finalColor = baseColor + uColor * highlightIntensity * uDepth * lighting;
              gl_FragColor = vec4(finalColor * lighting, 1.0);
          }
      `,
      wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composerRef.current = composer;

    // HexaVision shader pass
    const flyShader = {
      uniforms: {
        tDiffuse: { value: null },
        resolution: {
          value: new THREE.Vector2(
            width * window.devicePixelRatio,
            heightNum * window.devicePixelRatio
          ),
        },
        time: { value: 0 },
        ommatidiaSize: { value: ommatidiaSize },
      },
      vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
      fragmentShader: `
          precision highp float;

          varying vec2 vUv;
          uniform sampler2D tDiffuse;
          uniform vec2 resolution;
          uniform float ommatidiaSize;

          // Grille hexagonale orientée verticalement (pointes en haut/bas)
          vec2 hexCoord(vec2 uv, float size) {
            vec2 r = resolution / size;
            uv *= r;

            // Décalage horizontal sur une ligne sur deux
            float row = floor(uv.y);
            float col = floor(uv.x - mod(row, 2.0) * 0.5);

            vec2 hexUV = vec2(col + 0.5 * mod(row, 2.0), row);
            hexUV /= r;

            return hexUV;
        }


          // Masque hexagonal orienté verticalement
          float hexMask(vec2 uv, float size) {
              vec2 p = uv * resolution / size;
              p = fract(p) - 0.5;

              // Transformation pour hexagone vertical
              p.y *= 1.0;
              p.x *= 0.57735; // sqrt(3)/3

              p = abs(p);
              float a = max(p.y * 0.866025 + p.x, p.x * 2.0); // 0.866 = cos(30°)
              return step(a, 0.5);
          }

          void main() {
              vec2 hexUV = hexCoord(vUv, ommatidiaSize);
              vec4 color = texture2D(tDiffuse, hexUV);

              float mask = hexMask(vUv, ommatidiaSize);
              gl_FragColor = color * mask;
          }

        `
    };

    const flyPass = new ShaderPass(flyShader);
    flyPass.renderToScreen = true;
    composer.addPass(flyPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, heightNum),
      bloomStrength,
      0.4,
      0.0
    );
    composer.addPass(bloomPass);

    // Animation
    let startTime = Date.now();
    const animate = () => {
      const time = (Date.now() - startTime) * 0.001;
      material.uniforms.uTime.value = time;
      flyShader.uniforms.time.value = time;

      if (autoRotate) {
        mesh.rotation.x += 0.0002;
        mesh.rotation.y += 0.001;
        mesh.rotation.z += 0.0002;
      }

      if (controls && controls2) {
        const target = controls.target;
        controls2.target.set(target.x, target.y, target.z);
        controls.update();
        controls2.update();
      } else if (controls) {
        controls.update();
      }

      composer.render();
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();
    setIsLoaded(true);

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      composer.setSize(newWidth, newHeight);
      flyShader.uniforms.resolution.value.set(
        newWidth * window.devicePixelRatio,
        newHeight * window.devicePixelRatio
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (controls) controls.dispose();
      if (controls2) controls2.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [
    cameraDistance,
    autoRotate,
    enableInteraction,
    highlightColor,
    outlineColor,
    secondaryColor,
    ommatidiaSize,
    bloomStrength,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        height,
        background: "transparent",
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-heat-100 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}