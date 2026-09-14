import React, { useRef, useEffect, useState } from 'react';
import { soundEngine } from '../utils/sound';
import type { CountdownTime } from '../types';

interface SilhouetteProps {
  decryptedCount: number;
  forcedGlitch?: boolean;
  onGlitchEnd?: () => void;
  crackProgress?: number; // Normalized 0.0 to 1.0 (0 = pristine, 1 = hatched)
  timeLeft?: CountdownTime;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
  pz: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

export const Silhouette: React.FC<SilhouetteProps> = ({
  decryptedCount,
  forcedGlitch = false,
  onGlitchEnd,
  crackProgress = 0.08,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [internalGlitch, setInternalGlitch] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const crackProgressRef = useRef(crackProgress);

  useEffect(() => {
    crackProgressRef.current = crackProgress;
  }, [crackProgress]);

  const isGlitching = forcedGlitch || internalGlitch;

  // Sound and timing response for glitches
  useEffect(() => {
    if (forcedGlitch) {
      soundEngine.playGlitch();
      const timer = setTimeout(() => {
        if (onGlitchEnd) onGlitchEnd();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [forcedGlitch, onGlitchEnd]);

  // Periodic random atmospheric glitch, elevated frequency when egg is heavily cracked
  useEffect(() => {
    const triggerRandomGlitch = () => {
      setInternalGlitch(true);
      soundEngine.playGlitch();
      setTimeout(() => {
        setInternalGlitch(false);
      }, 250);
    };

    const intervalTime = crackProgressRef.current > 0.7 ? 4000 : 8000;
    const interval = setInterval(() => {
      const chance = crackProgressRef.current > 0.7 ? 0.6 : 0.35;
      if (Math.random() < chance) {
        triggerRandomGlitch();
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  // Track mouse coordinates for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3D Alien Egg Render Loop with Procedural Cracking & Glow
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;
    let pulseTimer = 0;

    // Atmospheric ambient dust
    const ambientDust: { x: number; y: number; size: number; speedY: number; opacity: number }[] = [];
    for (let i = 0; i < 40; i++) {
      ambientDust.push({
        x: Math.random() * 800,
        y: Math.random() * 800,
        size: Math.random() * 1.8 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.1),
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    // Active energy sparks emitted from crack fissures
    const sparks: SparkParticle[] = [];

    // Parametric 3D Egg Generator
    // Generates an asymmetric prolate ovoid (egg): tapered at apex, rounded at base
    const LAT_RINGS = 18;
    const LON_SEGMENTS = 26;
    const eggHeight = 1.32;
    const eggRadius = 0.94;
    const eggTaper = 0.18; // Positive value narrows the top and broadens the bottom

    const eggMesh: { phi: number; theta: number; point: Point3D; normal: Point3D; hemisphere: 'upper' | 'lower' }[][] = [];

    for (let i = 0; i <= LAT_RINGS; i++) {
      const phi = -Math.PI / 2 + (Math.PI * i) / LAT_RINGS; // from -PI/2 (bottom) to +PI/2 (top)
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const r = eggRadius * cosPhi * (1 - eggTaper * sinPhi);
      const y = -eggHeight * sinPhi;

      const ring: { phi: number; theta: number; point: Point3D; normal: Point3D; hemisphere: 'upper' | 'lower' }[] = [];
      for (let j = 0; j <= LON_SEGMENTS; j++) {
        const theta = (Math.PI * 2 * j) / LON_SEGMENTS;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);

        // Approximate outward surface normal
        const len = Math.sqrt(x * x + y * y * 0.7 + z * z) || 1;
        const normal: Point3D = {
          x: x / len,
          y: (y * 0.8) / len,
          z: z / len,
        };

        ring.push({
          phi,
          theta,
          point: { x, y, z },
          normal,
          hemisphere: phi >= 0 ? 'upper' : 'lower',
        });
      }
      eggMesh.push(ring);
    }

    // Define 3D Tectonic Fracture Networks across the Egg Surface
    // Defined in spherical coordinates (phi, theta) to adhere smoothly to the 3D curvature
    interface FractureSegment {
      phi: number;
      theta: number;
      branchLevel: number;
      minProgress: number; // minimum crackProgress required for this segment to manifest
    }

    const fractures: FractureSegment[][] = [
      // Major Equator Jagged Split (The Primary Breach)
      [
        { phi: 0.12, theta: 0.1, branchLevel: 0, minProgress: 0.04 },
        { phi: 0.02, theta: 0.45, branchLevel: 0, minProgress: 0.08 },
        { phi: -0.15, theta: 0.85, branchLevel: 0, minProgress: 0.14 },
        { phi: 0.05, theta: 1.35, branchLevel: 0, minProgress: 0.22 },
        { phi: 0.22, theta: 1.85, branchLevel: 0, minProgress: 0.32 },
        { phi: -0.08, theta: 2.35, branchLevel: 0, minProgress: 0.42 },
        { phi: -0.18, theta: 2.85, branchLevel: 0, minProgress: 0.52 },
        { phi: 0.10, theta: 3.35, branchLevel: 0, minProgress: 0.62 },
        { phi: 0.28, theta: 3.95, branchLevel: 0, minProgress: 0.72 },
        { phi: 0.04, theta: 4.55, branchLevel: 0, minProgress: 0.82 },
        { phi: -0.12, theta: 5.25, branchLevel: 0, minProgress: 0.90 },
        { phi: 0.12, theta: 6.28, branchLevel: 0, minProgress: 0.98 },
      ],
      // Upper Hemisphere Crown Crack (Branching toward apex)
      [
        { phi: 0.05, theta: 1.35, branchLevel: 1, minProgress: 0.18 },
        { phi: 0.35, theta: 1.25, branchLevel: 1, minProgress: 0.28 },
        { phi: 0.65, theta: 1.48, branchLevel: 1, minProgress: 0.45 },
        { phi: 0.95, theta: 1.32, branchLevel: 1, minProgress: 0.65 },
        { phi: 1.28, theta: 1.55, branchLevel: 1, minProgress: 0.85 },
      ],
      // Secondary Crown Branch
      [
        { phi: 0.35, theta: 1.25, branchLevel: 2, minProgress: 0.38 },
        { phi: 0.52, theta: 0.95, branchLevel: 2, minProgress: 0.50 },
        { phi: 0.78, theta: 0.75, branchLevel: 2, minProgress: 0.75 },
      ],
      // Basal Hemisphere Split (Branching downward)
      [
        { phi: -0.15, theta: 0.85, branchLevel: 1, minProgress: 0.20 },
        { phi: -0.42, theta: 0.95, branchLevel: 1, minProgress: 0.36 },
        { phi: -0.72, theta: 0.82, branchLevel: 1, minProgress: 0.55 },
        { phi: -1.05, theta: 1.10, branchLevel: 1, minProgress: 0.80 },
      ],
      // Starboard Lateral Fissure
      [
        { phi: -0.08, theta: 2.35, branchLevel: 1, minProgress: 0.44 },
        { phi: 0.25, theta: 2.65, branchLevel: 1, minProgress: 0.58 },
        { phi: 0.58, theta: 2.85, branchLevel: 1, minProgress: 0.76 },
        { phi: 0.85, theta: 2.70, branchLevel: 1, minProgress: 0.92 },
      ],
      // Basal Secondary Spiderweb
      [
        { phi: -0.18, theta: 2.85, branchLevel: 1, minProgress: 0.48 },
        { phi: -0.52, theta: 3.10, branchLevel: 1, minProgress: 0.66 },
        { phi: -0.85, theta: 3.35, branchLevel: 1, minProgress: 0.88 },
      ],
      // Dorsal Lightning Micro-Fissure
      [
        { phi: 0.28, theta: 3.95, branchLevel: 1, minProgress: 0.60 },
        { phi: 0.55, theta: 4.25, branchLevel: 1, minProgress: 0.78 },
        { phi: 0.82, theta: 4.45, branchLevel: 1, minProgress: 0.94 },
      ],
    ];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const progress = crackProgressRef.current;

      // Parallax smooth interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Micro-tremor shudder when heavily cracked
      let shakeX = 0;
      let shakeY = 0;
      if (progress > 0.65) {
        const shakeAmp = (progress - 0.65) * 4.5;
        shakeX = (Math.random() - 0.5) * shakeAmp;
        shakeY = (Math.random() - 0.5) * shakeAmp;
      }

      const centerX = width / 2 + mouseRef.current.x * 20 + shakeX;
      const centerY = height / 2 + mouseRef.current.y * 15 + shakeY;
      const baseRadius = Math.min(width, height) * 0.35;

      pulseTimer += 0.04 + progress * 0.08; // Core breathes faster as time draws closer
      const pulse = 0.5 + 0.5 * Math.sin(pulseTimer);

      // 1. BACKDROP VOLUMETRIC GLOW
      // Scales in intensity and hue as the cracks open up
      const glowIntensity = Math.min(0.25 + progress * 0.65 + decryptedCount * 0.05, 0.95);
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY - 5,
        baseRadius * 0.15,
        centerX,
        centerY,
        baseRadius * (1.7 + progress * 0.4)
      );
      glowGrad.addColorStop(0, `rgba(0, 240, 255, ${glowIntensity * 0.85})`);
      glowGrad.addColorStop(0.3, `rgba(6, 182, 212, ${glowIntensity * 0.45})`);
      glowGrad.addColorStop(0.65, `rgba(3, 3, 3, 0.25)`);
      glowGrad.addColorStop(1, 'rgba(3, 3, 3, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * (1.8 + progress * 0.4), 0, Math.PI * 2);
      ctx.fill();

      // 2. ATMOSPHERIC PARTICLES
      ambientDust.forEach((p) => {
        p.y += p.speedY;
        if (p.y < 0) p.y = height;
        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity * (0.3 + progress * 0.5)})`;
        ctx.beginPath();
        ctx.arc(p.x * (width / 800), p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. INTERNAL CORE LUMINESCENCE (Bleeds through cracks when cracked)
      if (progress > 0.08) {
        const coreIntensity = Math.min(progress * 1.2, 1.0);
        const coreRadius = baseRadius * (0.3 + progress * 0.35 + pulse * 0.08);
        const coreGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          2,
          centerX,
          centerY,
          coreRadius
        );
        coreGrad.addColorStop(0, `rgba(255, 255, 255, ${coreIntensity * 0.95})`);
        coreGrad.addColorStop(0.35, `rgba(0, 240, 255, ${coreIntensity * 0.8})`);
        coreGrad.addColorStop(0.7, `rgba(2, 132, 199, ${coreIntensity * 0.4})`);
        coreGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. HOLOGRAPHIC CONCENTRIC RINGS (Progressively unlock)
      if (progress >= 0.3 || decryptedCount >= 3) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-rotation * 0.4);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 + progress * 0.25})`;
        ctx.lineWidth = 1.0;
        ctx.setLineDash([6, 10]);
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 1.42, 0, Math.PI * 2);
        ctx.stroke();

        // Outer Hexagonal Classified Tracking Ring
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const hx = Math.cos(angle) * baseRadius * 1.55;
          const hy = Math.sin(angle) * baseRadius * 1.55;
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // 5. 3D EGG ROTATION & PROJECTION
      rotation += 0.0035;
      const tiltX = mouseRef.current.y * 0.22;
      const tiltY = rotation + mouseRef.current.x * 0.32;
      const scale = baseRadius * 0.98;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Glitch translation offset
      if (isGlitching) {
        const offset = (Math.random() - 0.5) * 16;
        ctx.translate(offset, (Math.random() - 0.5) * 8);
      }

      // Helper function to project a 3D coordinate with displacement
      const projectPoint = (
        pt: Point3D,
        normal?: Point3D,
        displacement: number = 0
      ): ProjectedPoint => {
        let x = pt.x;
        let y = pt.y;
        let z = pt.z;

        // Apply outward tectonic displacement if cracked
        if (normal && displacement > 0) {
          x += normal.x * displacement;
          y += normal.y * displacement;
          z += normal.z * displacement;
        }

        // Rotate around Y axis
        const cosY = Math.cos(tiltY);
        const sinY = Math.sin(tiltY);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate around X axis
        const cosX = Math.cos(tiltX);
        const sinX = Math.sin(tiltX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 3.6;
        const pz = fov / (fov + z2);

        return {
          x: x1 * scale * pz,
          y: y2 * scale * pz,
          z: z2,
          pz,
        };
      };

      // Tectonic displacement magnitude based on crack progress
      // At progress > 0.5, upper and lower hemispheres slightly drift apart along crack
      const displacement = progress > 0.5 ? (progress - 0.5) * 0.14 : 0;

      // Projected grid of the 3D Egg
      const projectedMesh = eggMesh.map((ring) =>
        ring.map((v) => {
          // Upper hemisphere drifts slightly upward, lower drifts slightly downward when split
          const vertDisp = v.hemisphere === 'upper' ? displacement : -displacement * 0.6;
          const normalWithDisp: Point3D = {
            x: v.normal.x,
            y: v.normal.y + (v.hemisphere === 'upper' ? 0.3 : -0.3),
            z: v.normal.z,
          };
          return {
            ...v,
            proj: projectPoint(v.point, normalWithDisp, Math.abs(vertDisp)),
          };
        })
      );

      // Light direction for directional specular shading (Key light from top-front-right)
      const lightDir: Point3D = { x: 0.55, y: -0.65, z: 0.75 };
      const lightLen = Math.sqrt(lightDir.x ** 2 + lightDir.y ** 2 + lightDir.z ** 2);
      const lNorm = { x: lightDir.x / lightLen, y: lightDir.y / lightLen, z: lightDir.z / lightLen };

      // 6. DRAW EGG FACETED PLATES / SHELL
      // Render quad faces with directional shading & rim lighting
      for (let i = 0; i < LAT_RINGS; i++) {
        for (let j = 0; j < LON_SEGMENTS; j++) {
          const p00 = projectedMesh[i][j];
          const p10 = projectedMesh[i + 1][j];
          const p11 = projectedMesh[i + 1][j + 1];
          const p01 = projectedMesh[i][j + 1];

          // Face normal / backface culling check using cross product in screen space
          const cross =
            (p10.proj.x - p00.proj.x) * (p01.proj.y - p00.proj.y) -
            (p10.proj.y - p00.proj.y) * (p01.proj.x - p00.proj.x);

          // Only render front-facing or near-horizon polygons
          if (cross > -0.05) {
            // Compute face average normal rotated
            const avgNormX = (p00.normal.x + p11.normal.x) * 0.5;
            const avgNormY = (p00.normal.y + p11.normal.y) * 0.5;
            const avgNormZ = (p00.normal.z + p11.normal.z) * 0.5;

            // Rotate normal around Y & X
            const cosY = Math.cos(tiltY);
            const sinY = Math.sin(tiltY);
            const nx1 = avgNormX * cosY + avgNormZ * sinY;
            const nz1 = -avgNormX * sinY + avgNormZ * cosY;

            const cosX = Math.cos(tiltX);
            const sinX = Math.sin(tiltX);
            const ny2 = avgNormY * cosX - nz1 * sinX;
            const nz2 = avgNormY * sinX + nz1 * cosX;

            // Diffuse lighting factor
            const diffuse = Math.max(0.04, nx1 * lNorm.x + ny2 * lNorm.y + nz2 * lNorm.z);
            // Rim lighting factor (Fresnel glow along silhouette perimeter)
            const rim = Math.pow(Math.max(0, 1 - Math.abs(nz2)), 2.8);

            ctx.beginPath();
            ctx.moveTo(p00.proj.x, p00.proj.y);
            ctx.lineTo(p10.proj.x, p10.proj.y);
            ctx.lineTo(p11.proj.x, p11.proj.y);
            ctx.lineTo(p01.proj.x, p01.proj.y);
            ctx.closePath();

            // Dark obsidian shell base with subtle metallic sheen
            const baseColorVal = Math.floor(6 + diffuse * 22);
            ctx.fillStyle = `rgb(${baseColorVal}, ${baseColorVal + 2}, ${baseColorVal + 5})`;
            ctx.fill();

            // Rim edge glow
            if (rim > 0.2) {
              const rimAlpha = Math.min(0.85, (rim - 0.2) * (0.4 + progress * 0.5));
              ctx.strokeStyle = `rgba(0, 240, 255, ${rimAlpha * 0.35})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      // 7. LATITUDE & LONGITUDE GEODESIC CONTOUR LINES (Subtle cyber-grid)
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.06 + progress * 0.08})`;
      ctx.lineWidth = 0.6;
      for (let i = 2; i < LAT_RINGS; i += 2) {
        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= LON_SEGMENTS; j++) {
          const pt = projectedMesh[i][j].proj;
          if (pt.z > -0.2) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // 8. PROCEDURAL 3D CRACK NETWORK (Cracking & Glowing)
      // Evaluate each fracture chain
      fractures.forEach((chain) => {
        // Collect visible projected points for this chain
        const activePoints: { proj: ProjectedPoint; seg: FractureSegment }[] = [];

        chain.forEach((seg) => {
          if (progress >= seg.minProgress) {
            // Reconstruct 3D position on egg surface
            const sinPhi = Math.sin(seg.phi);
            const cosPhi = Math.cos(seg.phi);
            const r = eggRadius * cosPhi * (1 - eggTaper * sinPhi);
            const y = -eggHeight * sinPhi;
            const x = r * Math.cos(seg.theta);
            const z = r * Math.sin(seg.theta);

            const len = Math.sqrt(x * x + y * y * 0.7 + z * z) || 1;
            const normal: Point3D = { x: x / len, y: (y * 0.8) / len, z: z / len };

            // Displacement expands crack gap
            const segDisp = displacement * (seg.phi >= 0 ? 1 : -0.7);
            const proj = projectPoint({ x, y, z }, normal, Math.abs(segDisp));

            // Only consider points roughly facing forward (or near edge)
            if (proj.z > -0.45) {
              activePoints.push({ proj, seg });

              // Dynamic spark emission from active fissures
              if (progress > 0.25 && Math.random() < 0.035 * progress) {
                sparks.push({
                  x: proj.x,
                  y: proj.y,
                  vx: (Math.random() - 0.5) * 1.8 + normal.x * 0.8,
                  vy: -(Math.random() * 2.2 + 0.8),
                  size: Math.random() * 2.5 + 1.0,
                  life: 0,
                  maxLife: Math.floor(Math.random() * 40 + 30),
                  color: Math.random() < 0.3 ? '#ffffff' : '#00f0ff',
                });
              }
            }
          }
        });

        if (activePoints.length >= 2) {
          // Calculate crack urgency attributes
          const crackGlowAlpha = Math.min(0.4 + progress * 0.6, 1.0);
          const crackWidth = Math.max(1.2, 1.0 + progress * 6.5);

          // Pass A: Wide Neon Cyan Bloom Shadow
          ctx.save();
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 12 + progress * 32 + pulse * 12;
          ctx.strokeStyle = `rgba(0, 240, 255, ${crackGlowAlpha * 0.9})`;
          ctx.lineWidth = crackWidth * 1.5;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.beginPath();
          activePoints.forEach((item, idx) => {
            if (idx === 0) ctx.moveTo(item.proj.x, item.proj.y);
            else ctx.lineTo(item.proj.x, item.proj.y);
          });
          ctx.stroke();

          // Pass B: Intense White-Hot Core Fissure Laser
          ctx.shadowBlur = 4 + progress * 8;
          ctx.shadowColor = '#ffffff';
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1.0, 0.6 + progress * 0.45)})`;
          ctx.lineWidth = Math.max(0.9, crackWidth * 0.45);
          ctx.stroke();
          ctx.restore();

          // Pass C: Volumetric Light Beams (Flaring rays shooting from crack apexes when > 0.55)
          if (progress > 0.55) {
            ctx.save();
            activePoints.forEach((item, idx) => {
              if (idx % 2 === 0 && Math.random() < 0.4) {
                const rayLen = baseRadius * (0.25 + progress * 0.45 + pulse * 0.2);
                const rayAngle = Math.atan2(item.proj.y, item.proj.x);
                const rayGrad = ctx.createLinearGradient(
                  item.proj.x,
                  item.proj.y,
                  item.proj.x + Math.cos(rayAngle) * rayLen,
                  item.proj.y + Math.sin(rayAngle) * rayLen
                );
                rayGrad.addColorStop(0, `rgba(255, 255, 255, ${0.45 * progress})`);
                rayGrad.addColorStop(0.3, `rgba(0, 240, 255, ${0.3 * progress})`);
                rayGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

                ctx.strokeStyle = rayGrad;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(item.proj.x, item.proj.y);
                ctx.lineTo(
                  item.proj.x + Math.cos(rayAngle) * rayLen,
                  item.proj.y + Math.sin(rayAngle) * rayLen
                );
                ctx.stroke();
              }
            });
            ctx.restore();
          }
        }
      });

      // 9. ACTIVE ENERGY SPARKS UPDATE & DRAW
      for (let s = sparks.length - 1; s >= 0; s--) {
        const spark = sparks[s];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy -= 0.04; // slight thermal buoyancy
        spark.life++;

        const sparkAlpha = Math.max(0, 1 - spark.life / spark.maxLife);
        if (sparkAlpha <= 0) {
          sparks.splice(s, 1);
          continue;
        }

        ctx.fillStyle = spark.color;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size * sparkAlpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 10. OUTER SILHOUETTE PERIMETER CONTOUR (Sharp classified razor-edge)
      ctx.save();
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.45 + progress * 0.4})`;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = isGlitching ? 35 : 12 + progress * 20;

      // Draw outer boundary by tracing the outermost meridian rings
      ctx.beginPath();
      for (let i = 0; i <= LAT_RINGS; i++) {
        // Left horizon
        const pt = projectedMesh[i][0].proj;
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      for (let i = LAT_RINGS; i >= 0; i--) {
        // Right horizon
        const pt = projectedMesh[i][Math.floor(LON_SEGMENTS / 2)].proj;
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      ctx.restore(); // Restore center translate

      // 11. GLITCH SCANLINE BARS (Triggered during glitch states)
      if (isGlitching) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.18)';
        for (let s = 0; s < 6; s++) {
          const sy = Math.random() * height;
          const sh = Math.random() * 24 + 3;
          ctx.fillRect(0, sy, width, sh);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [decryptedCount, isGlitching]);

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] md:h-[700px] flex items-center justify-center overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[850px] max-h-[850px] transition-opacity duration-700"
      />
      {/* Central volumetric shadow core to preserve mystery */}
      <div
        className="absolute inset-0 m-auto w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-classified-black/90 blur-3xl pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  );
};

export default Silhouette;
