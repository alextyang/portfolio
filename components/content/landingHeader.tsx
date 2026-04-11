"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import BackgroundVideoPlaylist from "../media/bgVideo";
import WritingText from "../media/textFadeIn";
import GlassBackground from "../ui/glassBackground";

const SUBPAGE_KEY = "p";

export default function LandingHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const containerRef = useRef<HTMLDivElement>(null);
    const subPageParam = searchParams.get(SUBPAGE_KEY);
    const subPage = subPageParam === "about" || subPageParam === "resume" || subPageParam === "contact"
        ? subPageParam
        : null;

    const updateSubPageInUrl = (nextSubPage: string | null) => {
        const nextParams = new URLSearchParams(searchParams.toString());

        if (nextSubPage) {
            nextParams.set(SUBPAGE_KEY, nextSubPage);
        } else {
            nextParams.delete(SUBPAGE_KEY);
        }

        const nextQuery = nextParams.toString();
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    };

    return (
        <>
            <BackgroundVideoPlaylist
                sources={[
                    "/about/IMG_0481.mp4",
                    "/about/IMG_1871.mp4",
                    "/about/IMG_2007.mp4",
                    "/about/IMG_2121.mp4",
                    "/about/IMG_2589.mp4",
                    "/about/IMG_3281.mp4",
                    "/about/IMG_3361.mp4",
                ]}
                visible={subPage === "about"}
                crossFadeMs={350}
            />

            <div ref={containerRef} className="relative max-w-(--page-width) w-full ">
                <GlassBackground containerRef={containerRef} className={"bg-white/75 backdrop-blur-lg absolute -top-10 -left-10 -right-10 -z-10 rounded-lg transition-all" + (subPage === 'about' ? '' : 'hidden delay-300')} topOffsetPx={40} />

                <div className="inline-block">
                    <h2>Alexander Yang</h2>
                    <p>I&apos;m a full-stack developer that closes gaps between design, engineering, and product.&nbsp;
                        <span className="opacity-50">
                            <WritingText
                                texts={[
                                    "Your launch-eager PM's favorite developer.",
                                    "Your ambitious designer's favorite developer.",
                                    "Your creative director's favorite developer.",
                                    "Your velocity-first founder's favorite developer.",
                                    "Your power users' favorite developer.",
                                    "Your no-nonsense client's favorite developer.",
                                    "Your support team's favorite developer.",
                                ]}
                            />
                        </span>
                    </p>
                </div>
                <div className="mt-4.5! mb-7.5! grid grid-cols-2 ">
                    <p className="m-0! text-base! font-light! italic ">
                        {subPage === 'about' ?
                            <a onClick={() => updateSubPageInUrl(null)} className="pr-1.75 py-1.5 opacity-60 hover:opacity-100 underline cursor-pointer underline-offset-4 font-semibold!">About</a>
                            : <a onClick={() => updateSubPageInUrl('about')} className="pr-1.75 py-1.5 opacity-60 hover:opacity-100 hover:underline cursor-pointer underline-offset-4 ">About</a>
                        }
                        {subPage === 'resume' ?
                            <a onClick={() => updateSubPageInUrl(null)} className="px-1.75 py-1.5 opacity-60 hover:opacity-100 underline cursor-pointer underline-offset-4 font-semibold!">Resume</a>
                            : <a onClick={() => updateSubPageInUrl('resume')} className="px-1.75 py-1.5 opacity-60 hover:opacity-100 hover:underline cursor-pointer underline-offset-4 ">Resume</a>
                        }
                        {subPage === 'contact' ?
                            <a onClick={() => updateSubPageInUrl(null)} className="px-1.75 py-1.5 opacity-60 hover:opacity-100 underline cursor-pointer underline-offset-4 font-semibold!">Contact</a>
                            : <a onClick={() => updateSubPageInUrl('contact')} className="px-1.75 py-1.5 opacity-60 hover:opacity-100 hover:underline cursor-pointer underline-offset-4 ">Contact</a>
                        }
                    </p>
                </div>

                <div className={"transition-all overflow-hidden " + (subPage === 'about' ? '' : 'max-h-0 opacity-0')}>



                </div>
            </div>
        </>
    )
}
