"use client";

import { OrthographicCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
    createContext,
    type PropsWithChildren,
    type RefObject,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { GlyphImageHoverNoiseMesh } from "../media/glyphImageHoverNoise";

type PosterGlyphDescriptor = {
    anchorRef: RefObject<HTMLDivElement | null>;
    imageUrl: string;
    width: number;
    height: number;
    dpr: number;
    cellSize: number;
    hoveredCellSize: number;
    showGlyphOnHover: boolean;
    keyWhiteToAlpha: boolean;
    pauseNoiseAnimation: boolean;
    isHovered: boolean;
};

type PosterGlyphDescriptorUpdate = Partial<Omit<PosterGlyphDescriptor, "anchorRef">> & {
    anchorRef?: RefObject<HTMLDivElement | null>;
};

type PosterGlyphRegistry = {
    registerPoster: (id: string, descriptor: PosterGlyphDescriptor) => void;
    updatePosterState: (id: string, descriptor: PosterGlyphDescriptorUpdate) => void;
    unregisterPoster: (id: string) => void;
};

type PosterGlyphLayout = {
    left: number;
    top: number;
    width: number;
    height: number;
    resolutionWidth: number;
    resolutionHeight: number;
};

const PosterGlyphRegistryContext = createContext<PosterGlyphRegistry | null>(null);

function SharedPosterGlyphScene({
    hostRef,
    posters,
}: {
    hostRef: RefObject<HTMLDivElement | null>;
    posters: Array<[string, PosterGlyphDescriptor]>;
}) {
    return posters.map(([id, poster]) => (
        <RegisteredPosterGlyph
            key={id}
            hostRef={hostRef}
            poster={poster}
        />
    ));
}

function SharedPosterGlyphCamera() {
    const { size } = useThree();

    return (
        <OrthographicCamera
            makeDefault
            position={[0, 0, 5]}
            left={-size.width / 2}
            right={size.width / 2}
            top={size.height / 2}
            bottom={-size.height / 2}
            near={-1000}
            far={1000}
            zoom={1}
        />
    );
}

function RegisteredPosterGlyph({
    hostRef,
    poster,
}: {
    hostRef: RefObject<HTMLDivElement | null>;
    poster: PosterGlyphDescriptor;
}) {
    const { gl, size } = useThree();
    const [layout, setLayout] = useState<PosterGlyphLayout | null>(null);
    const updateLayoutRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const anchor = poster.anchorRef.current;
        const host = hostRef.current;

        if (!anchor || !host) return;

        let frameId = 0;

        const updateLayout = () => {
            frameId = 0;

            const nextLayout = measurePosterLayout(anchor, host, gl.getPixelRatio());
            setLayout((currentLayout) => layoutsMatch(currentLayout, nextLayout) ? currentLayout : nextLayout);
        };

        updateLayoutRef.current = updateLayout;

        const scheduleLayoutUpdate = () => {
            if (frameId !== 0) return;
            frameId = window.requestAnimationFrame(updateLayout);
        };

        scheduleLayoutUpdate();

        const resizeObserver = new ResizeObserver(scheduleLayoutUpdate);
        resizeObserver.observe(anchor);
        resizeObserver.observe(host);

        window.addEventListener("resize", scheduleLayoutUpdate);
        window.addEventListener("scroll", scheduleLayoutUpdate, true);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", scheduleLayoutUpdate);
            window.removeEventListener("scroll", scheduleLayoutUpdate, true);

            if (frameId !== 0) {
                window.cancelAnimationFrame(frameId);
            }

            updateLayoutRef.current = null;
        };
    }, [gl, hostRef, poster.anchorRef, size.height, size.width]);

    useEffect(() => {
        updateLayoutRef.current?.();
    }, [poster]);

    if (!layout) return null;

    return (
        <GlyphImageHoverNoiseMesh
            imageUrl={poster.imageUrl}
            width={layout.width}
            height={layout.height}
            resolutionWidth={layout.resolutionWidth}
            resolutionHeight={layout.resolutionHeight}
            cellSize={poster.cellSize}
            hoveredCellSize={poster.hoveredCellSize}
            isHovered={poster.isHovered}
            keyWhiteToAlpha={poster.keyWhiteToAlpha}
            position={[
                layout.left + layout.width / 2 - size.width / 2,
                size.height / 2 - (layout.top + layout.height / 2),
                0,
            ]}
        />
    );
}

function measurePosterLayout(anchor: HTMLDivElement, host: HTMLDivElement, dpr: number): PosterGlyphLayout | null {
    const anchorRect = anchor.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();

    if (anchorRect.width === 0 || anchorRect.height === 0 || hostRect.width === 0 || hostRect.height === 0) {
        return null;
    }

    return {
        left: anchorRect.left - hostRect.left,
        top: anchorRect.top - hostRect.top,
        width: anchorRect.width,
        height: anchorRect.height,
        resolutionWidth: anchorRect.width * dpr,
        resolutionHeight: anchorRect.height * dpr,
    };
}

function layoutsMatch(currentLayout: PosterGlyphLayout | null, nextLayout: PosterGlyphLayout | null) {
    if (currentLayout === nextLayout) return true;
    if (!currentLayout || !nextLayout) return false;

    return [
        currentLayout.left - nextLayout.left,
        currentLayout.top - nextLayout.top,
        currentLayout.width - nextLayout.width,
        currentLayout.height - nextLayout.height,
        currentLayout.resolutionWidth - nextLayout.resolutionWidth,
        currentLayout.resolutionHeight - nextLayout.resolutionHeight,
    ].every((value) => Math.abs(value) < 0.01);
}

export function usePosterGlyphRegistry() {
    return useContext(PosterGlyphRegistryContext);
}

export function PosterGlyphCanvasHost({ children }: PropsWithChildren) {
    const hostRef = useRef<HTMLDivElement>(null);
    const [canvasKey, setCanvasKey] = useState(0);
    const [posterRegistry, setPosterRegistry] = useState<Record<string, PosterGlyphDescriptor>>({});

    const registerPoster = useCallback((id: string, descriptor: PosterGlyphDescriptor) => {
        setPosterRegistry((currentRegistry) => {
            const currentDescriptor = currentRegistry[id];

            if (currentDescriptor && posterDescriptorsMatch(currentDescriptor, descriptor)) {
                return currentRegistry;
            }

            return {
                ...currentRegistry,
                [id]: descriptor,
            };
        });
    }, []);

    const updatePosterState = useCallback((id: string, descriptor: PosterGlyphDescriptorUpdate) => {
        setPosterRegistry((currentRegistry) => {
            const currentDescriptor = currentRegistry[id];

            if (!currentDescriptor) return currentRegistry;

            const nextDescriptor = {
                ...currentDescriptor,
                ...descriptor,
            };

            if (posterDescriptorsMatch(currentDescriptor, nextDescriptor)) {
                return currentRegistry;
            }

            return {
                ...currentRegistry,
                [id]: nextDescriptor,
            };
        });
    }, []);

    const unregisterPoster = useCallback((id: string) => {
        setPosterRegistry((currentRegistry) => {
            if (!(id in currentRegistry)) return currentRegistry;

            const nextRegistry = { ...currentRegistry };
            delete nextRegistry[id];
            return nextRegistry;
        });
    }, []);

    const registry = useMemo<PosterGlyphRegistry>(() => {
        return {
            registerPoster,
            updatePosterState,
            unregisterPoster,
        };
    }, [registerPoster, unregisterPoster, updatePosterState]);

    const posters = useMemo(() => Object.entries(posterRegistry), [posterRegistry]);
    const canvasDpr = useMemo(() => {
        return posters.reduce((highestDpr, [, poster]) => Math.max(highestDpr, poster.dpr), 1);
    }, [posters]);

    const handleContextLost = useCallback((event: Event) => {
        event.preventDefault();
        setCanvasKey((current) => current + 1);
    }, []);

    return (
        <PosterGlyphRegistryContext.Provider value={registry}>
            <div ref={hostRef} className="relative">
                <ErrorBoundary errorComponent={() => null}>
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-[1]"
                    >
                        <Canvas
                            key={canvasKey}
                            dpr={canvasDpr}
                            frameloop="always"
                            gl={{ alpha: true }}
                            style={{ pointerEvents: "none" }}
                            onCreated={({ gl }) => {
                                gl.setClearColor("#000000", 0);
                                gl.domElement.addEventListener("webglcontextlost", handleContextLost, { once: true });
                            }}
                        >
                            <SharedPosterGlyphCamera />
                            <SharedPosterGlyphScene
                                hostRef={hostRef}
                                posters={posters}
                            />
                        </Canvas>
                    </div>
                </ErrorBoundary>

                <div className="relative bg-white/0">
                    {children}
                </div>
            </div>
        </PosterGlyphRegistryContext.Provider>
    );
}

function posterDescriptorsMatch(currentDescriptor: PosterGlyphDescriptor, nextDescriptor: PosterGlyphDescriptor) {
    return currentDescriptor.anchorRef === nextDescriptor.anchorRef
        && currentDescriptor.cellSize === nextDescriptor.cellSize
        && currentDescriptor.dpr === nextDescriptor.dpr
        && currentDescriptor.height === nextDescriptor.height
        && currentDescriptor.hoveredCellSize === nextDescriptor.hoveredCellSize
        && currentDescriptor.imageUrl === nextDescriptor.imageUrl
        && currentDescriptor.isHovered === nextDescriptor.isHovered
        && currentDescriptor.keyWhiteToAlpha === nextDescriptor.keyWhiteToAlpha
        && currentDescriptor.showGlyphOnHover === nextDescriptor.showGlyphOnHover
        && currentDescriptor.width === nextDescriptor.width;
}
