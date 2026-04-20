"use client";

import { CaseStudy } from "@/content/cases";
import { useEffect, useRef, useState } from "react";
import GlyphImageHoverNoise from "../media/glyphImageHoverNoise";
import { usePosterGlyphRegistry } from "./posterGlyphCanvasHost";


export function CasePoster({
    caseStudy,
    isAboutSubPage = false,
}: {
    caseStudy: CaseStudy;
    isAboutSubPage?: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const glyphAnchorRef = useRef<HTMLDivElement>(null);
    const initialPosterStateRef = useRef({
        isHovered,
        keyWhiteToAlpha: isAboutSubPage,
        pauseNoiseAnimation: isAboutSubPage,
    });
    const posterGlyphRegistry = usePosterGlyphRegistry();
    const hoverBackgroundClass = isAboutSubPage ? "hover:after:bg-white/80" : "hover:after:bg-(--hover-bg-color)";
    const imageUrl = `/case/${caseStudy.slug}/${caseStudy.coverImageFilename}`;

    useEffect(() => {
        if (!posterGlyphRegistry) return;

        posterGlyphRegistry.registerPoster(caseStudy.slug, {
            anchorRef: glyphAnchorRef,
            imageUrl,
            width: 300,
            height: 525,
            dpr: 3,
            cellSize: 16,
            hoveredCellSize: 6,
            showGlyphOnHover: false,
            keyWhiteToAlpha: initialPosterStateRef.current.keyWhiteToAlpha,
            pauseNoiseAnimation: initialPosterStateRef.current.pauseNoiseAnimation,
            isHovered: initialPosterStateRef.current.isHovered,
        });

        return () => {
            posterGlyphRegistry.unregisterPoster(caseStudy.slug);
        };
    }, [caseStudy.slug, imageUrl, posterGlyphRegistry]);

    useEffect(() => {
        if (!posterGlyphRegistry) return;

        posterGlyphRegistry.updatePosterState(caseStudy.slug, {
            isHovered,
            keyWhiteToAlpha: isAboutSubPage,
            pauseNoiseAnimation: isAboutSubPage,
        });
    }, [caseStudy.slug, isAboutSubPage, isHovered, posterGlyphRegistry]);

    return (
        <a
            className={`group w-74 cursor-pointer relative after:content-[''] after:absolute after:-top-4.5 after:-left-4.5 after:-right-5.75 after:-bottom-3.5 after:bg-transparent after:z-0 after:rounded-lg after:scale-98 after:transition-all after:duration-300 after:ease-out ${hoverBackgroundClass} hover:after:scale-100 ` + (isAboutSubPage ? "mr-2.5 ml-1.5" : " ")}
            href={`/case/${caseStudy.slug}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`pointer-events-none absolute -inset-3.5 -bottom-3 z-[1] rounded-xl bg-black/30 mix-blend-overlay inset-shadow-sm transition-opacity duration-150 ease-out ${isAboutSubPage ? "opacity-100 delay-75" : "opacity-0"}`}
            />
            <div
                className={`pointer-events-none absolute -inset-3.5 -bottom-3 z-[1] rounded-xl inset-shadow-sm transition-opacity duration-150 ease-out ${isAboutSubPage && !isHovered ? "opacity-40" : "opacity-0"}`}
                style={{ transitionDelay: isAboutSubPage && !isHovered ? "75ms" : "0ms" }}
            />
            <div className="relative z-[2] w-75 h-[510px] mb-4">
                <div className="absolute w-74 h-111 top-0 left-0  ">
                    {posterGlyphRegistry ? (
                        <div
                            ref={glyphAnchorRef}
                            style={{ width: 300, height: 525 }}
                        />
                    ) : (
                        <GlyphImageHoverNoise
                            imageUrl={imageUrl}
                            height={525}
                            width={300}
                            keyWhiteToAlpha={isAboutSubPage}
                        />
                    )}
                </div>
            </div>
            <div className="relative z-[2]">
                <h3 className="">{caseStudy.previewTitle}</h3>
                <p className="opacity-60 sans small mt-1! mb-1!">
                    {caseStudy.previewSubtitle}
                </p>
            </div>
        </a>
    );
}
