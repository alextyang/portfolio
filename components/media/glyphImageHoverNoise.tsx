"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const RAMP = ".,:;i1tfLCG08@"; // Glyph ramp from light to dark
const FONT_CSS = "400 128px Mono, system-ui, -apple-system, Segoe UI, Arial";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
    precision highp float;

    varying vec2 vUv;

    uniform sampler2D uImage;
    uniform sampler2D uFont;

    uniform vec2  uResolution;
    uniform vec2  uFontGrid;
    uniform float uCharCount;
    uniform float uCoarseCell;      // cell1 — idle
    uniform float uMediumCell;      // cell2
    uniform float uMediumFineCell;  // cell3
    uniform float uFineCell;        // cell4 — fully hovered
    uniform float uSample;
    uniform float uPadding;
    uniform float uTime;
    uniform float uJitter;
    uniform vec2  uImageSize;
    uniform float uEdgeStrength;
    uniform float uEdgeMix;
    uniform float uHoverProgress;    // 0..3, animated from JS
    uniform float uStagger;          // 0..1, how spread-out the per-cell stagger is
    uniform float uKeyWhiteToAlpha;  // 1.0 = key out white/near-white backgrounds

    float hash12(vec2 p) {
        float h = dot(p, vec2(127.1, 311.7));
        return fract(sin(h) * 43758.5453123);
    }

    vec2 hash22(vec2 p) {
        return vec2(hash12(p), hash12(p + 19.19));
    }

    float lumaAt(vec2 uv) {
        vec3 c = texture2D(uImage, uv).rgb;
        return dot(c, vec3(0.299, 0.587, 0.114));
    }

    float sobelEdge(vec2 uv) {
        vec2 t = 1.0 / uImageSize;
        float tl = lumaAt(uv + t * vec2(-1.0,  1.0));
        float t0 = lumaAt(uv + t * vec2( 0.0,  1.0));
        float tr = lumaAt(uv + t * vec2( 1.0,  1.0));
        float l  = lumaAt(uv + t * vec2(-1.0,  0.0));
        float r  = lumaAt(uv + t * vec2( 1.0,  0.0));
        float bl = lumaAt(uv + t * vec2(-1.0, -1.0));
        float b0 = lumaAt(uv + t * vec2( 0.0, -1.0));
        float br = lumaAt(uv + t * vec2( 1.0, -1.0));
        float gx = (-tl - 2.0*l - bl) + (tr + 2.0*r + br);
        float gy = (-bl - 2.0*b0 - br) + (tl + 2.0*t0 + tr);
        return clamp(length(vec2(gx, gy)), 0.0, 1.0);
    }

    vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        float d = q.x - min(q.w, q.y);
        float e = 1e-10;
        return vec3(
            abs(q.z + (q.w - q.y) / (6.0 * d + e)),
            d / (q.x + e),
            q.x
        );
    }

    vec3 hsv2rgb(vec3 c) {
        vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0/3.0, 1.0/3.0)) * 6.0 - 3.0);
        return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
    }

    // Render one glyph pass at a given cell size. tStep is the time-quantized
    // jitter step shared between coarse and fine so they don't jitter independently.
    vec4 renderGlyph(vec2 pix, float cellSz, float tStep) {
        vec2 cellId = floor(pix / cellSz);

        vec2 jitterPx = (hash22(cellId + tStep) - 0.5) * uJitter;

        vec2 cellCenter = (cellId + 0.5) * cellSz;
        vec2 basePix    = floor(cellCenter / uSample) * uSample;
        vec2 samplePix  = clamp(basePix + jitterPx, vec2(0.0), uResolution - vec2(1.0));

        vec2 sampleUV = samplePix / uResolution;
        vec3 col = texture2D(uImage, sampleUV).rgb;

        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        float e = sobelEdge(sampleUV);
        gray = mix(gray, clamp(gray - uEdgeStrength * e, 0.0, 1.0), uEdgeMix);

        float idx = clamp(floor((1.0 - gray) * (uCharCount - 1.0) + 0.5), 0.0, uCharCount - 1.0);

        vec2 local = fract(pix / cellSz);
        vec2 inner = (local - 0.5) / (1.0 - 2.0 * uPadding) + 0.5;
        float inside = step(0.0, inner.x) * step(0.0, inner.y)
                     * step(inner.x, 1.0) * step(inner.y, 1.0);

        float cols   = uFontGrid.x;
        float colIdx = mod(idx, cols);
        float rowIdx = (uFontGrid.y - 1.0) - floor(idx / cols);
        vec2 atlasUV = (vec2(colIdx, rowIdx) + inner) / uFontGrid;
        float a = texture2D(uFont, atlasUV).a * inside;

        // Color pipeline
        vec3 hsv = rgb2hsv(col);
        float k = smoothstep(0.08, 0.35, hsv.y) * smoothstep(0.05, 0.20, hsv.z);
        float sBoost = clamp(hsv.y * 2.0, 0.0, 1.0);
        hsv.y = mix(hsv.y, mix(sBoost, 1.0, 0.35), k);
        hsv.z = pow(mix(0.1, 0.65, hsv.z), 0.8);
        vec3 ink = hsv2rgb(hsv);

        float aa   = pow(a, 0.85);
        float tHi  = smoothstep(0.80, 0.98, dot(col, vec3(0.299, 0.587, 0.114)));
        vec3 inkFinal = mix(ink, vec3(0.0), tHi);

        return vec4(inkFinal, aa);
    }

    void main() {
        vec2 pix = vUv * uResolution;

        // Shared time step so both passes jitter in sync
        float tStep = floor(uTime * 28.0);

        // uHoverProgress runs 0→3.2, glyph phases offset 0.4 each, image phase 2x longer:
        //   phase1 = [0.0..1.0]: cell1(coarse) → cell2(medium)
        //   phase2 = [0.4..1.4]: cell2(medium) → cell3(medium-fine)
        //   phase3 = [0.8..1.8]: cell3(medium-fine) → cell4(fine)
        //   phase4 = [0.9..3.4]: cell4(fine) → image  (span 2.5)
        float phase1 = clamp(uHoverProgress - 0.0,         0.0, 1.0);
        float phase2 = clamp(uHoverProgress - 0.4,         0.0, 1.0);
        float phase3 = clamp(uHoverProgress - 0.8,         0.0, 1.0);
        float phase4 = clamp((uHoverProgress - 0.9) / 1.5, 0.0, 1.0);

        float snapWidth = (1.0 - uStagger) * 0.25;

        // Phase 1 — stagger at coarse cell resolution
        vec2 cellId1 = floor(pix / uCoarseCell);
        float trigger1 = hash12(cellId1) * uStagger;
        float cellPhase1 = smoothstep(trigger1, trigger1 + snapWidth, phase1);

        // Phase 2 — stagger at medium cell resolution
        vec2 cellId2 = floor(pix / uMediumCell);
        float trigger2 = hash12(cellId2 + vec2(37.81, 53.17)) * uStagger;
        float cellPhase2 = smoothstep(trigger2, trigger2 + snapWidth, phase2);

        // Phase 3 — stagger at medium-fine cell resolution
        vec2 cellId3 = floor(pix / uMediumFineCell);
        float trigger3 = hash12(cellId3 + vec2(71.43, 97.29)) * uStagger;
        float cellPhase3 = smoothstep(trigger3, trigger3 + snapWidth, phase3);

        // Phase 4 — stagger at 2px resolution for image reveal
        vec2 cellId4 = floor(pix / 2.0);
        float trigger4 = hash12(cellId4 + vec2(113.51, 137.83)) * uStagger;
        float cellPhase4 = smoothstep(trigger4, trigger4 + snapWidth, phase4);

        vec4 cell1 = renderGlyph(pix, uCoarseCell,     tStep);
        vec4 cell2 = renderGlyph(pix, uMediumCell,     tStep);
        vec4 cell3 = renderGlyph(pix, uMediumFineCell, tStep);
        vec4 cell4 = renderGlyph(pix, uFineCell,       tStep);

        // Original image at full resolution
        vec3 imgCol = texture2D(uImage, vUv).rgb;
        vec3 imgHsv = rgb2hsv(imgCol);
        float lowSat  = 1.0 - smoothstep(0.03, 0.18, imgHsv.y);
        float highVal = smoothstep(0.86, 0.99, imgHsv.z);
        float imgAlpha = 1.0 - lowSat * highVal * uKeyWhiteToAlpha;
        vec4 img = vec4(imgCol, imgAlpha);

        // Premultiplied alpha blends through all four phases
        vec4 pm1   = vec4(cell1.rgb * cell1.a, cell1.a);
        vec4 pm2   = vec4(cell2.rgb * cell2.a, cell2.a);
        vec4 pm3   = vec4(cell3.rgb * cell3.a, cell3.a);
        vec4 pm4   = vec4(cell4.rgb * cell4.a, cell4.a);
        vec4 imgPM = vec4(img.rgb   * img.a,   img.a);

        vec4 step1PM = mix(pm1,    pm2,   cellPhase1);
        vec4 step2PM = mix(step1PM, pm3,  cellPhase2);
        vec4 step3PM = mix(step2PM, pm4,  cellPhase3);
        vec4 outPM   = mix(step3PM, imgPM, cellPhase4);

        vec3 outRgb = outPM.a > 1e-5 ? outPM.rgb / outPM.a : vec3(0.0);
        gl_FragColor = vec4(outRgb, outPM.a);
        #include <colorspace_fragment>
    }
`;

type HoverNoiseShaderUniforms = {
    uImage: { value: THREE.Texture };
    uFont: { value: THREE.Texture };
    uResolution: { value: THREE.Vector2 };
    uFontGrid: { value: THREE.Vector2 };
    uCharCount: { value: number };
    uCoarseCell: { value: number };
    uMediumCell: { value: number };
    uMediumFineCell: { value: number };
    uFineCell: { value: number };
    uSample: { value: number };
    uPadding: { value: number };
    uTime: { value: number };
    uJitter: { value: number };
    uImageSize: { value: THREE.Vector2 };
    uEdgeStrength: { value: number };
    uEdgeMix: { value: number };
    uHoverProgress: { value: number };
    uStagger: { value: number };
    uKeyWhiteToAlpha: { value: number };
};

let cachedFontAtlas: ReturnType<typeof makeFontAtlas> | null = null;

function makeFontAtlas(opts: { chars: string; fontCss: string; cellPx: number; cols: number }) {
    const { chars, fontCss, cellPx, cols } = opts;
    const count = chars.length;
    const rows = Math.ceil(count / cols);

    const canvas = document.createElement("canvas");
    canvas.width = cols * cellPx;
    canvas.height = rows * cellPx;

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontCss;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < count; i++) {
        const x = (i % cols) * cellPx + cellPx * 0.5;
        const y = Math.floor(i / cols) * cellPx + cellPx * 0.52;
        ctx.fillText(chars[i], x, y);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;

    return { texture: tex, cols, rows, count };
}

function getFontAtlas() {
    if (!cachedFontAtlas) {
        cachedFontAtlas = makeFontAtlas({ chars: RAMP, fontCss: FONT_CSS, cellPx: 128, cols: 8 });
    }
    return cachedFontAtlas;
}

export type GlyphImageHoverNoiseMeshProps = {
    imageUrl: string;
    width: number;
    height: number;
    resolutionWidth: number;
    resolutionHeight: number;
    position?: [number, number, number];
    /** Idle cell size in pixels. */
    cellSize?: number;
    /** Second cell size (medium-coarse). */
    mediumCellSize?: number;
    /** Third cell size (medium-fine). */
    mediumFineCellSize?: number;
    /** Cell size on full hover — smaller = finer. */
    hoveredCellSize?: number;
    /** Seconds for full 0→1 hover transition. */
    cellTransitionDuration?: number;
    /** 0..1 — how staggered the per-cell timing is (0 = all at once). */
    stagger?: number;
    isHovered?: boolean;
    keyWhiteToAlpha?: boolean;
    sample?: number;
    jitter?: number;
    padding?: number;
    uEdgeStrength?: number;
    uEdgeMix?: number;
};

export function GlyphImageHoverNoiseMesh({
    imageUrl,
    width,
    height,
    resolutionWidth,
    resolutionHeight,
    position = [0, 0, 0],
    cellSize = 16,
    mediumCellSize = 11,
    mediumFineCellSize = 8,
    hoveredCellSize = 6,
    cellTransitionDuration = 0.8,
    stagger = 0.6,
    isHovered = false,
    keyWhiteToAlpha = false,
    sample = 1,
    jitter = 1,
    padding = 0.005,
    uEdgeStrength = 3.0,
    uEdgeMix = 0.8,
}: GlyphImageHoverNoiseMeshProps) {
    const imageTex = useLoader(THREE.TextureLoader, imageUrl, undefined, undefined);
    const matRef = useRef<THREE.ShaderMaterial>(null!);
    const atlas = useMemo(() => getFontAtlas(), []);

    const configuredImageTex = useMemo(() => {
        const tex = imageTex.clone();
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.needsUpdate = true;
        return tex;
    }, [imageTex]);

    const [uniforms] = useState<HoverNoiseShaderUniforms>(() => ({
        uImage: { value: configuredImageTex },
        uFont: { value: atlas.texture },
        uResolution: { value: new THREE.Vector2(resolutionWidth, resolutionHeight) },
        uFontGrid: { value: new THREE.Vector2(atlas.cols, atlas.rows) },
        uCharCount: { value: atlas.count },
        uCoarseCell: { value: cellSize },
        uMediumCell: { value: mediumCellSize },
        uMediumFineCell: { value: mediumFineCellSize },
        uFineCell: { value: hoveredCellSize },
        uSample: { value: sample },
        uPadding: { value: padding },
        uTime: { value: 0 },
        uJitter: { value: jitter },
        uImageSize: { value: new THREE.Vector2(1, 1) },
        uEdgeStrength: { value: uEdgeStrength },
        uEdgeMix: { value: uEdgeMix },
        uHoverProgress: { value: 0 },
        uStagger: { value: stagger },
        uKeyWhiteToAlpha: { value: keyWhiteToAlpha ? 1.0 : 0.0 },
    }));

    useEffect(() => () => { configuredImageTex.dispose(); }, [configuredImageTex]);

    useFrame((_, delta) => {
        if (!matRef.current) return;
        const u = matRef.current.uniforms as HoverNoiseShaderUniforms;

        u.uImage.value = configuredImageTex;
        u.uFont.value = atlas.texture;
        u.uResolution.value.set(resolutionWidth, resolutionHeight);
        u.uFontGrid.value.set(atlas.cols, atlas.rows);
        u.uCharCount.value = atlas.count;
        u.uCoarseCell.value = cellSize;
        u.uMediumCell.value = mediumCellSize;
        u.uMediumFineCell.value = mediumFineCellSize;
        u.uFineCell.value = hoveredCellSize;
        u.uSample.value = sample;
        u.uPadding.value = padding;
        u.uJitter.value = jitter;
        u.uEdgeStrength.value = uEdgeStrength;
        u.uEdgeMix.value = uEdgeMix;
        u.uStagger.value = stagger;
        u.uKeyWhiteToAlpha.value = keyWhiteToAlpha ? 1.0 : 0.0;

        const image = configuredImageTex.image as HTMLImageElement | undefined;
        if (image?.width && image?.height) {
            u.uImageSize.value.set(image.width, image.height);
        }

        // Animate hover progress 0→2 across two phases (0→1 glyph, 1→2 image)
        const rate = 1 / cellTransitionDuration;
        const dir  = isHovered ? 1 : -1;
        u.uHoverProgress.value = THREE.MathUtils.clamp(u.uHoverProgress.value + dir * rate * delta, 0, 2.4);
    });

    return (
        <mesh position={position} scale={[width, height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={matRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                toneMapped={false}
                transparent
            />
        </mesh>
    );
}

function GlyphHoverNoiseCanvasPlane(
    props: Omit<GlyphImageHoverNoiseMeshProps, "width" | "height" | "resolutionWidth" | "resolutionHeight">
) {
    const { gl, size, viewport } = useThree();
    return (
        <GlyphImageHoverNoiseMesh
            {...props}
            width={viewport.width}
            height={viewport.height}
            resolutionWidth={size.width * gl.getPixelRatio()}
            resolutionHeight={size.height * gl.getPixelRatio()}
        />
    );
}

export type GlyphImageHoverNoiseProps = {
    imageUrl: string;
    height?: number;
    width?: number;
    dpr?: number;
    cellSize?: number;
    hoveredCellSize?: number;
    cellTransitionDuration?: number;
    stagger?: number;
    keyWhiteToAlpha?: boolean;
    className?: string;
};

export default function GlyphImageHoverNoise({
    imageUrl,
    height = 700,
    width = 300,
    dpr = 3,
    cellSize = 16,
    hoveredCellSize = 6,
    cellTransitionDuration = 0.8,
    stagger = 0.6,
    keyWhiteToAlpha = false,
    className = "",
}: GlyphImageHoverNoiseProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [canvasKey, setCanvasKey] = useState(0);

    const handleContextLost = useCallback((event: Event) => {
        event.preventDefault();
        setCanvasKey((c) => c + 1);
    }, []);

    return (
        <ErrorBoundary errorComponent={() => <div style={{ height, background: "lightgray", width }} />}>
            <div
                className={className}
                style={{ height, background: "transparent", width }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Canvas
                    key={canvasKey}
                    orthographic
                    dpr={dpr}
                    frameloop="always"
                    gl={{ alpha: true }}
                    camera={{ position: [0, 0, 5], zoom: 100 }}
                    onCreated={({ gl }) => {
                        gl.setClearColor("#000000", 0);
                        gl.domElement.addEventListener("webglcontextlost", handleContextLost, { once: true });
                    }}
                >
                    <GlyphHoverNoiseCanvasPlane
                        imageUrl={imageUrl}
                        isHovered={isHovered}
                        cellSize={cellSize}
                        hoveredCellSize={hoveredCellSize}
                        cellTransitionDuration={cellTransitionDuration}
                        stagger={stagger}
                        keyWhiteToAlpha={keyWhiteToAlpha}
                    />
                </Canvas>
            </div>
        </ErrorBoundary>
    );
}
