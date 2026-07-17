"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import WritingText from "../media/textFadeIn";

function AnimatedWidthSpan({ children }: { children: ReactNode }) {
    const innerRef = useRef<HTMLSpanElement>(null);
    const [width, setWidth] = useState<number | undefined>(undefined);
    const [animateWidth, setAnimateWidth] = useState(false);

    useLayoutEffect(() => {
        if (!innerRef.current) return;

        const updateWidth = () => {
            if (!innerRef.current) return;
            setWidth(innerRef.current.getBoundingClientRect().width);
        };

        updateWidth();

        const frameId = window.requestAnimationFrame(() => {
            setAnimateWidth(true);
        });

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) setWidth(entry.contentRect.width);
        });
        observer.observe(innerRef.current);

        return () => {
            window.cancelAnimationFrame(frameId);
            observer.disconnect();
        };
    }, []);

    return (
        <motion.span
            style={{ display: "inline-block", overflow: "visible" }}
            initial={false}
            animate={{ width: width !== undefined ? width : "auto" }}
            transition={animateWidth ? { type: "spring", bounce: 0, duration: 0.6 } : { duration: 0 }}
        >
            <span ref={innerRef} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                {children}
            </span>
        </motion.span>
    );
}

const RESUME_URL = "/AlexanderYang_Resume.pdf";

export type SubPage = "about" | "resume" | "contact";

export default function LandingHeader({
    subPage,
    onSubPageChange,
}: {
    subPage: SubPage | null;
    onSubPageChange: (nextSubPage: SubPage | null) => void;
}) {
    const [transitionsReady, setTransitionsReady] = useState(false);

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            setTransitionsReady(true);
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, []);

    const showSubPagePanel = subPage !== null;
    const introTransitionClass = transitionsReady ? "transition-[max-height,opacity] duration-350 ease-in-out" : "transition-none";
    const navTransitionClass = transitionsReady ? "transition-all" : "transition-none";
    const panelTransitionClass = transitionsReady ? "transition-all duration-200 ease-in-out" : "transition-none";
    const panelOpacityTransitionClass = transitionsReady ? "transition-opacity duration-150 ease-out" : "transition-none";
    const stackedPanelTransitionClass = transitionsReady ? "transition-[max-height,opacity,margin] duration-250 ease-in-out" : "transition-none";

    return (
        <div className="relative max-w-(--page-width) w-full bg-white/0">
            <div className="inline-block px-4 md:px-0">
                <h2>Alexander Yang</h2>
                <div className={"overflow-hidden " + introTransitionClass + " " + (showSubPagePanel ? "max-h-0 opacity-0 -mb-px" : "max-h-56 sm:max-h-32 opacity-100")}>
                    <p>I&apos;m a full-stack product engineer using TypeScript and Next.js to build{" "}
                        <AnimatedWidthSpan>
                            <WritingText
                                texts={[
                                    "customer-facing web apps",
                                    "internal tools",
                                    "publishing systems",
                                    "fast, clear interfaces",
                                ]}
                            />
                        </AnimatedWidthSpan> for small teams.&nbsp;

                    </p>
                </div>
            </div>
            <div className="mt-4.5! grid grid-cols-1 sm:grid-cols-2 mb-1! px-4 md:px-0">
                <p className="m-0! text-base! font-light! italic ">
                    {subPage === 'about' ?
                        <button type="button" aria-pressed="true" onClick={() => onSubPageChange(null)} className={"inline-block pr-1.75 py-1.5 text-left bg-transparent border-0 italic font-light " + navTransitionClass + " " + (subPage === "about" ? "opacity-100" : "opacity-60 hover:opacity-100") + " underline cursor-pointer underline-offset-4 font-semibold!"}>About</button>
                        : <button type="button" aria-pressed="false" onClick={() => onSubPageChange('about')} className={"inline-block pr-1.75 py-1.5 text-left bg-transparent border-0 italic font-light opacity-60 hover:opacity-100 hover:underline cursor-pointer underline-offset-4 " + navTransitionClass}>About</button>
                    }
                    {subPage === 'resume' ?
                        <button type="button" aria-pressed="true" onClick={() => onSubPageChange(null)} className={"inline-block px-1.75 py-1.5 text-left bg-transparent border-0 italic font-light opacity-60 hover:opacity-100 underline cursor-pointer underline-offset-4 font-semibold! " + navTransitionClass}>Resume</button>
                        : <button type="button" aria-pressed="false" onClick={() => onSubPageChange('resume')} className={"inline-block px-1.75 py-1.5 text-left bg-transparent border-0 italic font-light " + (subPage === "about" ? "opacity-90 font-medium sm:pl-2.25" : "opacity-60 hover:opacity-100") + " hover:underline cursor-pointer underline-offset-4 " + navTransitionClass}>Resume</button>
                    }
                    {subPage === 'contact' ?
                        <button type="button" aria-pressed="true" onClick={() => onSubPageChange(null)} className={"inline-block px-1.75 py-1.5 text-left bg-transparent border-0 italic font-light opacity-60 hover:opacity-100 underline cursor-pointer underline-offset-4 font-semibold! " + navTransitionClass}>Contact</button>
                        : <button type="button" aria-pressed="false" onClick={() => onSubPageChange('contact')} className={"inline-block px-1.75 py-1.5 text-left bg-transparent border-0 italic font-light " + (subPage === "about" ? "opacity-90 font-medium" : "opacity-60 hover:opacity-100") + " hover:underline cursor-pointer underline-offset-4 " + navTransitionClass}>Contact</button>
                    }
                </p>
            </div>

            <div className={"relative mx-0 px-3 md:-mx-4 " + panelTransitionClass + " " + (subPage === 'about' ? 'mt-5 max-h-[46rem] md:max-h-96 opacity-100' : 'mt-0 max-h-0 opacity-100 overflow-hidden')}>
                <div className={"pointer-events-none absolute inset-0 -z-10 rounded-xl bg-black/30 mix-blend-overlay inset-shadow-sm " + panelOpacityTransitionClass + " " + (subPage === 'about' ? 'opacity-100 delay-75' : 'opacity-0')} />
                <div className={"pointer-events-none absolute inset-0 -z-5 rounded-xl inset-shadow-sm " + panelOpacityTransitionClass + " " + (subPage === 'about' ? 'opacity-50 delay-75' : 'opacity-0')} />

                <div className={"rounded-lg px-1 py-5 " + panelOpacityTransitionClass + " " + (subPage === 'about' ? 'opacity-100 delay-75' : 'opacity-0')}>
                    <p className="mt-0!">
                        On a small team, a feature rarely stops at the interface. I like following it through the data layer, the publishing process, and whatever internal tool the team needs to keep it running.
                    </p>
                    <p>
                        I studied interaction design and media production alongside software, so I pay attention to whether an interface feels fast and clear—not only whether the code works.
                    </p>
                    <p>
                        At Center Centre, I cut most site build times in half with a shared component and data library. I also built the email production app and enrollment-data cache featured below.
                    </p>
                </div>
            </div>

            <div className={"relative overflow-hidden px-4 md:px-0 " + stackedPanelTransitionClass + " " + ((subPage === 'resume' || subPage === 'contact') ? 'mt-5 max-h-[90rem] sm:max-h-[56rem] opacity-100' : 'mt-0 max-h-0 opacity-0')}>
                <div className={panelOpacityTransitionClass + " " + (subPage === 'resume' ? 'opacity-100 delay-75' : 'opacity-0 absolute inset-0 pointer-events-none')}>
                    <div className="border-t border-black/12 py-5">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
                            <div className="max-w-[26rem]">
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Resume</p>
                                <p className="mt-0!">
                                    Full-stack product engineer working primarily in React and TypeScript on public web products and internal tools for publishing and operations.
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
                                <p className="mt-0!">B.S. in Integrated Design &amp; Media, NYU Tandon School of Engineering. Coursework included web development, UX design, graphic design, AI, and data structures.</p>
                            </div>
                            <div>
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Center Centre</p>
                                <p className="mt-0!">Built React course sites, connected Airtable data to enrollment flows, and shipped internal tools for email publishing and operations.</p>
                            </div>
                            <div>
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Selected Work</p>
                                <ul className="mt-0! ml-4">
                                    <li className="mt-0!">Cut most website build timelines in half with a shared component and data library.</li>
                                    <li>Built an email production app that reduced active work by 75% in a workflow sending roughly 5 million emails each month.</li>
                                    <li>Rebuilt Harvestworks&apos; website and created a more flexible content model for its team.</li>
                                </ul>
                            </div>
                            <div>
                                <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Independent Projects</p>
                                <ul className="mt-0! ml-4">
                                    <li className="mt-0!">Built a Spotify companion that finds and summarizes journalism about the song currently playing.</li>
                                    <li>Built a MediaWiki-based community site for tracking recurring anti-consumer practices by major brands.</li>
                                    <li>Designed and tested a timeline-based alternative to conventional smart-home automation interfaces.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={panelOpacityTransitionClass + " " + (subPage === 'contact' ? 'opacity-100 delay-75' : 'opacity-0 absolute inset-0 pointer-events-none')}>
                    <div className="border-t border-black/12 py-5">
                        <p className="sans small uppercase tracking-[0.18em] opacity-45 mt-0! mb-2!">Contact</p>
                        <p className="mt-0! max-w-[31rem]">
                            I&apos;m looking for product engineering roles on small teams, and I&apos;m open to project work where I can contribute to both the interface and the systems behind it.
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
                            Reaching out about a role or project? A short note about the team, what you&apos;re building, and where you think I could help is plenty.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
