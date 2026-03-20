"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useEffect, useMemo, useRef } from "react";
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

    uniform vec2  uResolution;   // drawing buffer size in pixels
    uniform vec2  uFontGrid;     // (cols, rows) in the font atlas
    uniform float uCharCount;    // number of characters in the atlas
    uniform float uCell;         // cell size in pixels
    uniform float uSample;       // sampling quantization in pixels
    uniform float uPadding;      // 0..0.45, whitespace inside each cell
    uniform float uTime;         // seconds
    uniform float uJitter;       // jitter in pixels

    uniform vec2  uImageSize;     // image pixel size (w,h)

    uniform float uEdgeStrength;  // e.g. 1.0–6.0, how much edges darken glyphs
    uniform float uEdgeMix;       // 0..1, how much edges affect final glyph selection

    uniform float uRevealProgress;   // 0..1
    uniform float uCascadeSoftness;  // 0..1 (order-space fade width)
    uniform float uRevealResidue;    // 0..1, glyph amount left on revealed image
    uniform float uRevealDir;        // 1.0 = reveal, 0.0 = unreveal
    uniform float uGroupCells;       // grouping size in cells (e.g. 2.0 => 2x2)


    float hash12(vec2 p) { // from https://www.shadertoy.com/view/4djSRW
        float h = dot(p, vec2(127.1, 311.7));
        return fract(sin(h) * 43758.5453123);
    }

    vec2 hash22(vec2 p) { // from https://www.shadertoy.com/view/4djSRW
        return vec2(hash12(p), hash12(p + 19.19));
    }

    float lumaAt(vec2 uv) { // 0..1
        vec3 c = texture2D(uImage, uv).rgb;
        return dot(c, vec3(0.299, 0.587, 0.114));
    }

    float sobelEdge(vec2 uv) {
        vec2 t = 1.0 / uImageSize; // texel size in UVs

        float tl = lumaAt(uv + t * vec2(-1.0,  1.0));
        float  t0 = lumaAt(uv + t * vec2( 0.0,  1.0));
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

    void main() {
        vec2 pix = vUv * uResolution;

        // One glyph per cell
        vec2 cellId = floor(pix / uCell);

        // time-quantized jitter on cell sampling
        float tStep = floor(uTime * 28.0);
        vec2 jitterPx = (hash22(cellId + tStep) - 0.5) * uJitter;

        // sample from the center of the cell, quantized to uSample
        vec2 cellCenter = (cellId + 0.5) * uCell;
        vec2 basePix    = floor(cellCenter / uSample) * uSample;
        vec2 samplePix  = basePix + jitterPx;              // jitter survives
        samplePix = clamp(samplePix, vec2(0.0), uResolution - vec2(1.0));

        vec2 sampleUV = samplePix / uResolution;
        vec3 col = texture2D(uImage, sampleUV).rgb;

        float gray = dot(col, vec3(0.299, 0.587, 0.114));

        // enhance edges
        float e = sobelEdge(sampleUV);                 // 0..1
        float edgeDarken = uEdgeStrength * e;          // stronger edges => darker (denser glyphs)
        float grayEdge = clamp(gray - edgeDarken, 0.0, 1.0);

        // mix original gray and edge-enhanced gray
        gray = mix(gray, grayEdge, uEdgeMix);

        float idxF = floor((1.0 - gray) * (uCharCount - 1.0) + 0.5);
        float idx  = clamp(idxF, 0.0, uCharCount - 1.0);

        // local coords within the cell (0..1)
        vec2 local = fract(pix / uCell);

        // shrink glyph area to create whitespace padding
        vec2 inner = (local - 0.5) / (1.0 - 2.0 * uPadding) + 0.5;

        // if outside inner region, it's background
        float inside = step(0.0, inner.x) * step(0.0, inner.y) * step(inner.x, 1.0) * step(inner.y, 1.0);

        // font atlas addressing
        float cols = uFontGrid.x;
        float colIdx = mod(idx, cols);
        float rowIdx = floor(idx / cols);
        rowIdx = (uFontGrid.y - 1.0) - rowIdx; // flip Y for UV space

        vec2 atlasUV = (vec2(colIdx, rowIdx) + inner) / uFontGrid;

        float a = texture2D(uFont, atlasUV).a * inside;

        vec3 hsv = rgb2hsv(col);

        // maximize saturation
        float keepNeutralS = smoothstep(0.08, 0.35, hsv.y);
        float notBlack     = smoothstep(0.05, 0.20, hsv.z);
        float k = keepNeutralS * notBlack;

        // boost saturation for already-colored pixels
        float satMul = 2.0; // try 1.5–3.0
        float sBoost = clamp(hsv.y * satMul, 0.0, 1.0);

        // gently push toward fully saturated where safe
        hsv.y = mix(hsv.y, mix(sBoost, 1.0, 0.35), k);

        // keep contrast but lift darkness into a readable band
        float minV = 0.1; // avoid pure black
        float maxV = 0.65; // cap brightness
        hsv.z = mix(minV, maxV, hsv.z);

        // optional: push midtones brighter without blowing highlights
        hsv.z = pow(hsv.z, 0.8);

        vec3 ink = hsv2rgb(hsv);

        // Make edges less “gray” by steepening coverage a bit
        float aa = pow(a, 0.85);

        // how "bright" the sampled pixel is (0=dark, 1=bright)
        float gray0 = dot(col, vec3(0.299, 0.587, 0.114));

        // t = 0 in mid/dark areas, t -> 1 in highlights
        float tHi = smoothstep(0.80, 0.98, gray0);

        // ink becomes black in highlights, stays colored elsewhere
        vec3 inkFinal = mix(ink, vec3(0.0), tHi);

        vec3 asciiCol = mix(vec3(1.0), inkFinal, aa);

        // Diagonal cascade order in grouped cells
        vec2 grid = max(ceil(uResolution / uCell), vec2(1.0));

        // Configurable NxN grouping
        float g = max(uGroupCells, 1.0);
        vec2 groupSize = vec2(g, g);
        vec2 groupId = floor(cellId / groupSize);
        vec2 groupGrid = max(ceil(grid / groupSize), vec2(1.0));

        float rowTop = (groupGrid.y - 1.0) - groupId.y; // top row first
        float diagIndex = groupId.x + rowTop;

        // Normalize diagonal index to 0..1 in grouped space
        float diagDenom = max((groupGrid.x - 1.0) + (groupGrid.y - 1.0), 1.0);
        float order = clamp(diagIndex / diagDenom, 0.0, 1.0);

        // Tiny per-group fade (same as before, but now per 2x2 group)
        float soft = max(uCascadeSoftness / diagDenom, 1e-5);

        // Reveal path (uRevealProgress: 0 -> 1): TL -> BR
        float revealForward = smoothstep(order - soft, order + soft, uRevealProgress);

        // Unreveal path (uRevealProgress: 1 -> 0), still TL -> BR
        float unrevealForward = 1.0 - smoothstep(order - soft, order + soft, 1.0 - uRevealProgress);

        float revealCell = mix(unrevealForward, revealForward, uRevealDir);

        vec3 originalCol = texture2D(uImage, vUv).rgb;
        vec3 baseCol = mix(asciiCol, originalCol, revealCell);

        // Leave a little glyph opacity behind when revealed
        float residueA = aa * uRevealResidue * revealCell;
        vec3 outCol = mix(baseCol, inkFinal, residueA);

        gl_FragColor = vec4(outCol, 1.0);
        #include <colorspace_fragment>
    }
`;

// Build a font atlas texture using a sans font
function makeFontAtlas(opts: {
    chars: string;
    fontCss: string; // e.g. "600 36px Inter, system-ui, Arial"
    cellPx: number;  // per-glyph atlas cell size in pixels
    cols: number;    // number of columns in the atlas grid
}) {
    const { chars, fontCss, cellPx, cols } = opts;
    const count = chars.length;
    const rows = Math.ceil(count / cols);

    const canvas = document.createElement("canvas");
    canvas.width = cols * cellPx;
    canvas.height = rows * cellPx;

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw white glyphs into transparent canvas (alpha carries the glyph)
    ctx.font = fontCss;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < count; i++) {
        const ch = chars[i];
        const x = (i % cols) * cellPx + cellPx * 0.5;
        const y = Math.floor(i / cols) * cellPx + cellPx * 0.52; // tiny vertical tweak
        ctx.fillText(ch, x, y);
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

function AsciiImagePlane({
    imageUrl, // image to represent with glyphs
    cell = 16, // cell size in pixels
    sample = 1, // sampling quantization in pixels
    jitter = 1, // sampling jitter in pixels
    padding = 0.005, // padding on glyph inside cell
    uEdgeStrength = 3.0, // edge darkening strength
    uEdgeMix = 0.8, // edge effect mix
    reveal, // whether the background image is revealed
    baseCell, // base cell size
    hoverCell, // cell size when hovered
    groupCells = 4, // 2 => 2x2 groups
    showGlyphOnHover = true, // whether to show glyphs at all when hovered
}: {
    imageUrl: string;
    cell?: number;
    sample?: number;
    jitter?: number;
    padding?: number;
    uEdgeStrength?: number;
    uEdgeMix?: number;
    reveal: boolean;
    baseCell: number;
    hoverCell: number;
    groupCells?: number;
    showGlyphOnHover?: boolean;

}) {
    const imageTex = useLoader(THREE.TextureLoader, imageUrl, undefined, undefined);
    const { gl, viewport } = useThree();
    const matRef = useRef<THREE.ShaderMaterial>(null!);

    const atlas = useMemo(() => {
        return makeFontAtlas({
            chars: RAMP,
            fontCss: FONT_CSS,
            cellPx: 128,
            cols: 8,
        });
    }, []);

    const uniforms = useMemo(() => {
        return {
            uImage: { value: imageTex },
            uFont: { value: atlas.texture },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uFontGrid: { value: new THREE.Vector2(atlas.cols, atlas.rows) },
            uCharCount: { value: atlas.count },
            uCell: { value: cell },
            uSample: { value: sample },
            uPadding: { value: padding },
            uTime: { value: 0 },
            uJitter: { value: jitter },
            uImageSize: { value: new THREE.Vector2(1, 1) },
            uEdgeStrength: { value: 3.0 },
            uEdgeMix: { value: 0.8 },

            uRevealProgress: { value: reveal ? 1 : 0 },
            uCascadeSoftness: { value: 2.5 },
            uRevealDir: { value: reveal ? 1.0 : 0.0 },
            uRevealResidue: { value: showGlyphOnHover ? 0.33 : 0.0 },
            uGroupCells: { value: groupCells },


        };
    }, [imageTex, atlas, cell, sample, padding, jitter]);

    useEffect(() => {
        imageTex.colorSpace = THREE.SRGBColorSpace;
        imageTex.minFilter = THREE.LinearFilter;
        imageTex.magFilter = THREE.LinearFilter;
        imageTex.wrapS = THREE.ClampToEdgeWrapping;
        imageTex.wrapT = THREE.ClampToEdgeWrapping;
        imageTex.needsUpdate = true;
    }, [imageTex]);

    useEffect(() => {
        const img: any = imageTex.image;
        if (img?.width && img?.height) {
            uniforms.uImageSize.value.set(img.width, img.height);
        }
    }, [imageTex, uniforms]);

    // Use real drawing buffer size (most reliable)
    useEffect(() => {
        const v = new THREE.Vector2();
        gl.getDrawingBufferSize(v);
        uniforms.uResolution.value.copy(v);

        uniforms.uCell.value = cell;
        uniforms.uSample.value = sample;
        uniforms.uPadding.value = padding;
        uniforms.uJitter.value = jitter;
        uniforms.uGroupCells.value = groupCells;

        uniforms.uEdgeStrength.value = uEdgeStrength;
        uniforms.uEdgeMix.value = uEdgeMix;

        uniforms.uFontGrid.value.set(atlas.cols, atlas.rows);
        uniforms.uCharCount.value = atlas.count;
        uniforms.uFont.value = atlas.texture;
    }, [gl, uniforms, cell, sample, padding, jitter, atlas]);

    useFrame((state, delta) => {
        if (!matRef.current) return;

        matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        matRef.current.uniforms.uRevealDir.value = reveal ? 1.0 : 0.0;

        const damp = (cur: number, tgt: number) =>
            THREE.MathUtils.damp(cur, tgt, 24, delta); // number = snappiness

        // Smooth cell size
        // const targetCell = reveal ? hoverCell : baseCell;
        // const curCell = matRef.current.uniforms.uCell.value;
        // matRef.current.uniforms.uCell.value = damp(curCell, targetCell);

        const revealRate = 6; // progress units/sec (lower = slower sweep)
        const dir = reveal ? 1 : -1;
        const curReveal = matRef.current.uniforms.uRevealProgress.value;
        const nextReveal = THREE.MathUtils.clamp(curReveal + dir * revealRate * delta, 0, 1);
        matRef.current.uniforms.uRevealProgress.value = nextReveal;

        // keep resolution updated (covers resize + DPR changes)
        const v = new THREE.Vector2();
        gl.getDrawingBufferSize(v);
        matRef.current.uniforms.uResolution.value.copy(v);
    });

    return (
        <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={matRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                toneMapped={false}
            />
        </mesh>
    );
}

export default function GlyphImage({
    imageUrl,
    height = 700,
    width = 300,
    dpr = 3,
    cellSize = 16,
    hoveredCellSize = 8,
    isHovered = false,
    showGlyphOnHover = true,
}: {
    imageUrl: string;
    height?: number;
    width?: number;
    dpr?: number;
    cellSize?: number;
    hoveredCellSize?: number;
    isHovered?: boolean;
    showGlyphOnHover?: boolean;
}) {

    return (
        <ErrorBoundary errorComponent={
            () => <div style={{ height, background: "lightgray", width }}> </div>
        }>
            <div style={{ height, background: "white", width }}>
                <Canvas
                    orthographic
                    dpr={dpr}
                    camera={{ position: [0, 0, 5], zoom: 100 }}
                    onCreated={({ gl }) => gl.setClearColor("#ffffff", 1)}
                >
                    <AsciiImagePlane imageUrl={imageUrl}
                        reveal={isHovered}
                        baseCell={cellSize}
                        hoverCell={hoveredCellSize}
                        showGlyphOnHover={showGlyphOnHover}
                    />
                </Canvas>
            </div>
        </ErrorBoundary>
    );
}