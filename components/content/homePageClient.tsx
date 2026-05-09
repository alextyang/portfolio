"use client";

import { useSearchParams } from "next/navigation";
import LandingHeader from "@/components/content/landingHeader";
import { CasePoster } from "@/components/content/casePoster";
import { PosterGlyphCanvasHost } from "@/components/content/posterGlyphCanvasHost";
import BackgroundVideoPlaylist from "@/components/media/bgVideo";
import GlassBackground from "@/components/ui/glassBackground";
import { caseStudies } from "@/content/cases";

const aboutVideoSources = [
    "/about/IMG_0481.mp4",
    "/about/IMG_0485.mp4",
    "/about/IMG_1786.mp4",
    "/about/IMG_1871.mp4",
    "/about/IMG_1928.mp4",
    "/about/IMG_2007.mp4",
    "/about/IMG_2121.mp4",
    "/about/IMG_2589.mp4",
    "/about/IMG_3137.mp4",
    "/about/IMG_3361.mp4",
    "/about/IMG_3734.mp4",
    "/about/IMG_3939.mp4",
    "/about/IMG_4677.mp4",
];

const centerCentreCaseStudies = caseStudies.filter((caseStudy) => !caseStudy.isWip && caseStudy.projectAffiliation === "Center Centre");
const hasWipIndependentWork = caseStudies.some((caseStudy) => caseStudy.isWip && caseStudy.projectAffiliation === "Independent");

export default function HomePageClient() {
    const searchParams = useSearchParams();
    const isAboutSubPage = searchParams.get("p") === "about";

    return (
        <div className="relative flex flex-col min-h-screen items-center justify-start px-(--page-x-margin) pt-(--page-top) ">
            <BackgroundVideoPlaylist
                sources={aboutVideoSources}
                visibleOnSubPage="about"
                crossFadeMs={550}
                fadeInDelayMs={180}
            />

            <div id="page-content-container" className="relative max-w-(--page-width) w-full bg-white/0">
                <GlassBackground
                    containerId="page-content-container"
                    className="bg-white/75 backdrop-blur-lg absolute -top-10 -left-10 -right-10 -z-10 rounded-lg"
                    topOffsetPx={40}
                    visibleOnSubPage="about"
                    fadeOutDelayMs={380}
                />
                <div id="landing-header-container" className="relative w-full bg-white/0">
                    <LandingHeader />
                </div>

                <main className="relative w-full mt-5">
                    <PosterGlyphCanvasHost>
                        <p className="opacity-60 sans small mt-20! mb-0! flex items-baseline overflow-hidden"><span className="shrink-0">Web Dev Fellow @ Center Centre&nbsp;&nbsp;</span><span className="opacity-50 ml-1 flex-1 overflow-hidden whitespace-nowrap">{"-".repeat(400)}</span></p>

                        <div className="flex flex-row -mx-[2px] gap-8 mt-10 ">
                            {centerCentreCaseStudies.map((caseStudy) => (
                                <CasePoster key={caseStudy.slug} caseStudy={caseStudy} isAboutSubPage={isAboutSubPage} />
                            ))}
                        </div>

                        {hasWipIndependentWork && (
                            <>
                                <p className="opacity-60 sans small mt-20! mb-0! flex items-baseline overflow-hidden"><span className="shrink-0">Independent Work - WIP&nbsp;&nbsp;</span><span className="opacity-50 ml-1 flex-1 overflow-hidden whitespace-nowrap">{"-".repeat(400)}</span></p>
                                <p className="opacity-60 sans small mt-8! mb-20! max-w-[30rem]">
                                    Additional independent projects are being edited and will return once the case studies are publication-ready.
                                </p>
                            </>
                        )}
                    </PosterGlyphCanvasHost>
                </main>
            </div>
        </div>
    );
}
