"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import WritingText from "../media/textFadeIn";

function AnimatedWidthSpan({ children }: { children: ReactNode }) {
    const innerRef = useRef<HTMLSpanElement>(null);
    const [width, setWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!innerRef.current) return;
        setWidth(innerRef.current.getBoundingClientRect().width);
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) setWidth(entry.contentRect.width);
        });
        observer.observe(innerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <motion.span
            style={{ display: "inline-block", overflow: "visible" }}
            animate={{ width: width !== undefined ? width : "auto" }}
            transition={{ type: "spring", bounce: 0, duration: 0.6 }}
        >
            <span ref={innerRef} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                {children}
            </span>
        </motion.span>
    );
}

const SUBPAGE_KEY = "p";
const RESUME_URL = "/AlexanderYang_Resume.pdf";

export default function LandingHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [transitionsReady, setTransitionsReady] = useState(false);
    const subPageParam = searchParams.get(SUBPAGE_KEY);
    const subPage = subPageParam === "about" || subPageParam === "resume" || subPageParam === "contact"
        ? subPageParam
        : null;

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            setTransitionsReady(true);
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, []);

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

    const showSubPagePanel = subPage !== null;
    const introTransitionClass = transitionsReady ? "transition-[max-height,opacity] duration-350 ease-in-out" : "transition-none";
    const navTransitionClass = transitionsReady ? "transition-all" : "transition-none";
    const panelTransitionClass = transitionsReady ? "transition-all duration-200 ease-in-out" : "transition-none";
    const panelOpacityTransitionClass = transitionsReady ? "transition-opacity duration-150 ease-out" : "transition-none";
    const stackedPanelTransitionClass = transitionsReady ? "transition-[max-height,opacity,margin] duration-250 ease-in-out" : "transition-none";

    return (
        <div className="relative max-w-(--page-width) w-full bg-white/0">
            <div className="inline-block">
                <h2>Alexander Yang</h2>
                <div className={"overflow-hidden " + introTransitionClass + " " + (showSubPagePanel ? "max-h-0 opacity-0 -mb-px" : "max-h-56 sm:max-h-32 opacity-100")}>
                    <p>I&apos;m a full-stack developer using TypeScript and Next.js to turn vision into{" "}
                        <AnimatedWidthSpan>
                            <WritingText
                                texts={[
                                    "polished products",
                                    "better workflows",
                                    "fine-tuned interaction",
                                    "engaging experiences",
                                    "smoother launches",
                                ]}
                            />
                        </AnimatedWidthSpan> and the systems behind them.&nbsp;

                    </p>
                </div>
            </div>
            <div className="mt-4.5! grid grid-cols-1 sm:grid-cols-2 mb-1!">
                <p className="m-0! text-base! font-light! italic ">
                    {subPage === 'about' ?
                        <a onClick={() => updateSubPageInUrl(null)} className={"inline-block pr-1.75 py-1.5 " + navTransitionClass + " " + (subPage === "about" ? "opacity-100" : "opacity-60 hover:opacity-100") + " underline cursor-pointer underline-offset-4 font-semibold!"}>About</a>
                        : <a onClick={() => updateSubPageInUrl('about')} className={"inline-block pr-1.75 py-1.5 opacity-60 hover:opacity-100 hover:underline cursor-pointer underline-offset-4 " + navTransitionClass}>About</a>
                    }
                    {subPage === 'resume' ?
                        <a onClick={() => updateSubPageInUrl(null)} className={"inline-block px-1.75 py-1.5 opacity-60 hover:opacity-100 underline cursor-pointer underline-offset-4 font-semibold! " + navTransitionClass}>Resume</a>
                        : <a onClick={() => updateSubPageInUrl('resume')} className={"inline-block px-1.75 py-1.5 " + (subPage === "about" ? "opacity-90 font-medium sm:pl-2.25" : "opacity-60 hover:opacity-100") + " hover:underline cursor-pointer underline-offset-4 " + navTransitionClass}>Resume</a>
                    }
                    {subPage === 'contact' ?
                        <a onClick={() => updateSubPageInUrl(null)} className={"inline-block px-1.75 py-1.5  opacity-60 hover:opacity-100 underline cursor-pointer underline-offset-4 font-semibold! " + navTransitionClass}>Contact</a>
                        : <a onClick={() => updateSubPageInUrl('contact')} className={"inline-block px-1.75 py-1.5 " + (subPage === "about" ? "opacity-90 font-medium" : "opacity-60 hover:opacity-100") + " hover:underline cursor-pointer underline-offset-4 " + navTransitionClass}>Contact</a>
                    }
                </p>
            </div>

            <div className={"relative mx-2 px-2 md:-mx-4 md:px-4.5 " + panelTransitionClass + " " + (subPage === 'about' ? 'mt-5 max-h-[46rem] md:max-h-96 opacity-100' : 'mt-0 max-h-0 opacity-100 overflow-hidden')}>
                <div className={"pointer-events-none absolute inset-0 -z-10 rounded-xl bg-black/30 mix-blend-overlay inset-shadow-sm " + panelOpacityTransitionClass + " " + (subPage === 'about' ? 'opacity-100 delay-75' : 'opacity-0')} />
                <div className={"pointer-events-none absolute inset-0 -z-5 rounded-xl inset-shadow-sm " + panelOpacityTransitionClass + " " + (subPage === 'about' ? 'opacity-50 delay-75' : 'opacity-0')} />

                <div className={"rounded-lg px-1 py-5 " + panelOpacityTransitionClass + " " + (subPage === 'about' ? 'opacity-100 delay-75' : 'opacity-0')}>
                    <p className="mt-0!">
                        I build web apps, internal tooling, and infrastructure to ship polished, impactful experiences and shape effective organizations.
                    </p>
                    <p>
                        While my background is primarily in software, I use an education in design, user experience, and media production to add impactful velocity to collaborations in small and growing teams.
                    </p>
                    <p>
                        Recently, at Center Centre, I cut website development timelines in half (with a component library and encoded design system), streamlined bottom-of-funnel UX (with front-end features and optimization), and saved the team &gt;25 hours a week (with cross-functional internal tools).
                    </p>
                </div>
            </div>

            <div className={"relative overflow-hidden " + stackedPanelTransitionClass + " " + ((subPage === 'resume' || subPage === 'contact') ? 'mt-5 max-h-[90rem] sm:max-h-[56rem] opacity-100' : 'mt-0 max-h-0 opacity-0')}>
                <div className={panelOpacityTransitionClass + " " + (subPage === 'resume' ? 'opacity-100 delay-75' : 'opacity-0 absolute inset-0 pointer-events-none')}>
                    <div className="border-t border-black/12 py-5">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
                            <div className="max-w-[26rem]">
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Resume</p>
                                <p className="mt-0!">
                                    Full-stack developer with a background in product engineering, web systems, and interface design.
                                </p>
                            </div>
                            <div className="flex flex-row sm:flex-col items-start gap-4 sm:gap-1 pt-0.5">
                                <a href={RESUME_URL} target="_blank" rel="noreferrer" className="sans small underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">
                                    Open PDF
                                </a>
                                <a href={RESUME_URL} download className="sans small underline underline-offset-4 opacity-55 hover:opacity-100 transition-opacity">
                                    Download copy
                                </a>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                            <div>
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Education</p>
                                <p className="mt-0!">B.S. in Integrated Design &amp; Media, NYU Tandon. Coursework in web development, UX, graphic design, AI, and data structures.</p>
                            </div>
                            <div>
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Center Centre</p>
                                <p className="mt-0!">Built shared React and TypeScript systems, consolidated backend data flows, and developed internal tools for publishing and operations.</p>
                            </div>
                            <div>
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Selected Work</p>
                                <ul className="mt-0! ml-4">
                                    <li className="mt-0!">Cut most website build timelines in half with a shared component and data library.</li>
                                    <li>Built an email publishing app supporting roughly 100 designs and 5 million sends per month.</li>
                                    <li>Rebuilt Harvestworks&apos; website and designed a more flexible content model for the team.</li>
                                </ul>
                            </div>
                            <div>
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Independent Projects</p>
                                <p className="mt-0!">Built a Spotify research companion, a community accountability platform, and an IoT usability study whose timeline-based interface was preferred by 94% of participants.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={panelOpacityTransitionClass + " " + (subPage === 'contact' ? 'opacity-100 delay-75' : 'opacity-0 absolute inset-0 pointer-events-none')}>
                    <div className="border-t border-black/12 py-5">
                        <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Contact</p>
                        <p className="mt-0! max-w-[31rem]">
                            Best for product engineering roles, collaborations, and projects that need someone comfortable moving between implementation, systems thinking, and design-sensitive execution.
                        </p>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-10 gap-y-5">
                            <div>
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Email</p>
                                <a href="mailto:alexanderyang20@gmail.com" className="break-words underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">
                                    alexanderyang20@gmail.com
                                </a>
                            </div>
                            <div>
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">GitHub</p>
                                <a href="https://github.com/alextyang" target="_blank" rel="noreferrer" className="underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">
                                    github.com/alextyang
                                </a>
                            </div>
                            <div>
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Resume</p>
                                <a href={RESUME_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">
                                    View PDF
                                </a>
                            </div>
                            <div>
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Portfolio</p>
                                <a href="https://alexya.ng/" target="_blank" rel="noreferrer" className="underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity">
                                    alexya.ng
                                </a>
                            </div>
                        </div>

                        <p className="mt-6 max-w-[31rem] opacity-70">
                            If you&apos;re reaching out about a role or project, a note with the team, timeline, and problem space is plenty.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
