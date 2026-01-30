"use client";

import { CaseStudy } from "@/content/cases";
import { useState } from "react";
import GlyphImage from "../media/glyphImage";


export function CasePoster({ caseStudy }: { caseStudy: CaseStudy }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a className="case-poster hover-bg-link w-74 cursor-pointer" href={`/case/${caseStudy.slug}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="relative w-75 h-[525px] mb-4">
                <div className="absolute w-74 h-111 top-0 left-0 ">
                    <GlyphImage
                        imageUrl={`/case/${caseStudy.slug}/${caseStudy.coverImageFilename}`}
                        height={525}
                        width={300}
                        isHovered={isHovered && false}
                        hoveredCellSize={caseStudy.coverImageMinGlyphSize}
                    />
                </div>
            </div>
            <h3 className="">{caseStudy.previewTitle}</h3>
            <p className="opacity-60 sans small mt-1!">
                {caseStudy.previewSubtitle}
            </p>
        </a>
    );
}