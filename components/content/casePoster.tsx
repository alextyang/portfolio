"use client";

import { CaseStudy } from "@/content/cases";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import GlyphImage from "../media/glyphImage";


export function CasePoster({ caseStudy }: { caseStudy: CaseStudy }) {
    const [isHovered, setIsHovered] = useState(false);
    const searchParams = useSearchParams();
    const isAboutSubPage = searchParams.get("p") === "about";
    const hoverBackgroundClass = isAboutSubPage ? "hover:after:bg-white/80" : "hover:after:bg-(--hover-bg-color)";

    return (
        <a
            className={`group w-74 cursor-pointer relative z-0 after:content-[''] after:absolute after:-top-4.5 after:-left-4.5 after:-right-5.75 after:-bottom-3 after:bg-transparent after:-z-10 after:rounded-md after:scale-98 after:transition-all after:duration-300 after:ease-out ${hoverBackgroundClass} hover:after:scale-100`}
            href={`/case/${caseStudy.slug}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-75 h-[510px] mb-4">
                <div className="absolute w-74 h-111 top-0 left-0  ">
                    <GlyphImage
                        imageUrl={`/case/${caseStudy.slug}/${caseStudy.coverImageFilename}`}
                        height={525}
                        width={300}
                        isHovered={isHovered}
                        showGlyphOnHover={false}
                        keyWhiteToAlpha={isAboutSubPage}
                    />
                </div>
            </div>
            <h3 className="">{caseStudy.previewTitle}</h3>
            <p className="opacity-60 sans small mt-1! mb-1!">
                {caseStudy.previewSubtitle}
            </p>
        </a>
    );
}
