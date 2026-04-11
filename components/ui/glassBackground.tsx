"use client";

import { RefObject, useEffect, useRef } from "react";

type GlassBackgroundProps = {
    containerRef: RefObject<HTMLDivElement | null>;
    className?: string;
    topOffsetPx?: number;
};

export default function GlassBackground({
    containerRef,
    className = "",
    topOffsetPx = 40,
}: GlassBackgroundProps) {
    const backgroundRef = useRef<HTMLDivElement>(null);
    const isTopFillModeRef = useRef(false);

    useEffect(() => {
        const updateBackgroundHeight = () => {
            if (!containerRef.current || !backgroundRef.current) return;

            const backgroundRect = backgroundRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const widthGap = viewportWidth - backgroundRect.width;
            const enterTopFillGap = 8;
            const exitTopFillGap = 20;
            const fillsViewportWidth = isTopFillModeRef.current
                ? widthGap <= exitTopFillGap
                : widthGap <= enterTopFillGap;
            isTopFillModeRef.current = fillsViewportWidth;
            const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
            const backgroundTop = fillsViewportWidth ? 0 : containerTop - topOffsetPx;
            const pageBottom = document.documentElement.scrollHeight;

            backgroundRef.current.style.top = fillsViewportWidth ? `${-containerTop}px` : `-${topOffsetPx}px`;
            backgroundRef.current.style.height = `${Math.max(pageBottom - backgroundTop, 0)}px`;
        };

        updateBackgroundHeight();
        window.addEventListener("resize", updateBackgroundHeight);

        const observer = new ResizeObserver(updateBackgroundHeight);
        observer.observe(document.body);

        return () => {
            window.removeEventListener("resize", updateBackgroundHeight);
            observer.disconnect();
        };
    }, [containerRef, topOffsetPx]);

    return <div ref={backgroundRef} className={`${className} transition-[top,height] duration-300 ease-out`} />;
}
